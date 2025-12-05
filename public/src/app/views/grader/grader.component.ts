import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'underscore';
import { CellValue } from 'exceljs';
import { WorkbookService } from '../../models/workbook/workbook.service';
import { AssignmentService } from '../../models/assignment/assignment.service';
import { AssignmentFactory } from '../../models/assignment/assignment.factory';
import { Assignment } from '../../models/assignment/assignment';
import { WorkbookFactory } from '../../models/workbook/workbook.factory';
import { FancyWorkbook } from '../../models/workbook/workbook';
import { Facet } from '../../models/question/facet/facet';
import {
  ConfirmationDialogComponent,
} from '../../components/confirmation-dialog/confirmation-dialog.component';
import { ExportDialogComponent } from './export/export-dialog.component';
import { InfoDialogComponent } from '../../components/info-dialog/info-dialog.component';
import {
  ExportSubmissionColumns, ExportValue,
  SubmissionResponse,
  Submission,
} from '../../models/submission/submission';
import { SubmissionService } from '../../models/submission/submission.service';

interface ParsedFacetInfo {
  label: string;
  value: string;
  isSet: boolean;
}

@Component({
  selector: 'app-grader',
  templateUrl: './grader.component.html',
  styleUrls: ['./grader.component.scss'],
})
export class GraderComponent implements OnInit {
  masterAssignment: Assignment | null = null;

  masterWorkbook: FancyWorkbook | null = null;

  // Pointer to submission service cache
  submissions: Submission[] = [];

  activeSubmission: Submission | null = null;

  submissionTable = new MatTableDataSource<Submission>(this.submissions);

  displayedColumns: string[] = ['name', 'size', 'score', 'action'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public workbookService: WorkbookService,
    public workbookFactory: WorkbookFactory,
    public assignmentService: AssignmentService,
    public assignmentFactory: AssignmentFactory,
    public submissionService: SubmissionService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    // Resolve assignment id => Resolve assignment obj => Resolve workbook file => Enable workbook
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const id = params.get('id');
        if (id) {
          this.registerAssignment(id);
        }
      },
    );
  }

  registerAssignment(id: string) {
    this.assignmentService.retrieve(id).subscribe({
      next: (iAssignment) => {
        const assignment = this.assignmentFactory.create(iAssignment);
        this.masterAssignment = assignment;
        this.submissions = this.submissionService.retrieve(assignment);
        this.activateWorkbook(assignment);
      },
      error: (err) => {
        const message = err.status === 404 
          ? 'Assignment not found' 
          : 'You do not have permission to access this assignment';
        this.snackBar.open(message, 'Close', { duration: 5000 });
        this.router.navigate(['/']);
      },
    });
  }

  activateWorkbook(assignment: Assignment) {
    assignment.getFile().subscribe((file) => {
      this.workbookService.loadWorkbook(file);
      this.workbookFactory.load(file).then((workbook: FancyWorkbook) => {
        this.masterWorkbook = workbook;
      });
    });
  }

  addSubmission(fileList: FileList | EventTarget | null) {
    fileList = fileList instanceof FileList ? fileList : (fileList as HTMLInputElement).files;
    if (!fileList) return;
    const files = Array.from(fileList);

    files.forEach((file) => {
      this.workbookFactory.load(file).then((workbook: FancyWorkbook) => {
        const submission = new Submission({
          file,
          workbook,
          score: this.getScore(workbook),
          maxScore: this.getMaxScore(),
          responses: this.getResponses(workbook),
        });
        this.submissions.push(submission);
        this.submissionTable.data = this.submissions.sort(
          (a, b) => a.file.name.localeCompare(b.file.name),
        );
      });
    });
  }

  removeSubmission(submission: Submission) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete?',
        message: 'This submission will be lost.',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.submissions = this.submissions.filter((f) => f !== submission);
        this.submissionTable.data = this.submissions;
      }
    });
  }

  getScore(workbook: FancyWorkbook): number {
    if (!this.masterAssignment) throw Error('No master assignment selected!');
    return this.masterAssignment.getQuestions()
      .reduce((acc, que) => acc + que.evaluateScore(workbook), 0);
  }

  getResponses(workbook: FancyWorkbook): Map<Facet, SubmissionResponse> {
    if (!this.masterAssignment) throw Error('No master assignment selected!');
    return this.masterAssignment.getQuestions()
      .reduce((acc, que) => {
        const responses = que.evaluateResponses(workbook);
        responses.forEach((val, key) => acc.set(key, val));
        return acc;
      }, new Map());
  }

  getMaxScore(): number {
    if (!this.masterAssignment) throw Error('No master assignment selected!');
    return this.masterAssignment.getQuestions()
      .reduce((acc: number, que) => acc + que.getMaxScore(), 0);
  }

  areAllFacetsValid(): boolean {
    if (!this.masterAssignment) return false;
    return this.masterAssignment.getQuestions().every(
      (que) => que.getFacets().every((fac) => fac.isValid()),
    );
  }

  hasAnyFacets(): boolean {
    if (!this.masterAssignment) return false;
    return this.masterAssignment.getQuestions().some(
      (que) => que.getFacets().length > 0,
    );
  }

  /**
   * Parse a facet info string into structured data.
   * Input format: "Label: value" or "Label:&nbsp;<span class="red">Not set</span>"
   */
  parseFacetInfo(info: string): ParsedFacetInfo {
    const colonIndex = info.indexOf(':');
    if (colonIndex === -1) {
      return { label: info, value: '', isSet: true };
    }
    
    const label = info.substring(0, colonIndex).trim();
    let value = info.substring(colonIndex + 1).trim();
    
    // Check if value contains "Not set" span
    const isNotSet = value.includes('Not set');
    
    if (isNotSet) {
      value = 'Not set';
    } else {
      // Remove &nbsp; if present
      value = value.replace(/&nbsp;/g, '').trim();
    }
    
    return { label, value, isSet: !isNotSet };
  }

  openEditDialog() {
    if (!this.masterAssignment) return;
    if (!this.submissions.length) {
      this.router.navigate(['wizard', this.masterAssignment.uuid]);
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Navigate?',
        message: 'Any uploaded submissions will be lost.',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.masterAssignment) {
        this.router.navigate(['wizard', this.masterAssignment.uuid]);
      }
    });
  }

  openExportConfirmDialog() {
    if (!this.masterAssignment || !this.submissions.length) return;
    this.openExportDialog();
  }

  openReview() {
    if (!this.masterAssignment || !this.submissions.length) return;
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      width: '350px',
      data: {
        title: 'Work in Progress',
        message: 'This feature is still under development.',
        action: 'Close',
      },
    });
  }

  openExportDialog(): void {
    const dialogRef = this.dialog.open(ExportDialogComponent, {
      width: '500px',
      data: {
        cols: this.getExportSubmissionColumns(),
      },
    });
    dialogRef.afterClosed().subscribe((cols: Array<string>) => {
      if (cols.length && this.masterAssignment) {
        const workbook = this.workbookFactory.create();
        workbook.title = `Submissions - ${this.masterAssignment.name}`;
        const worksheet = workbook.addWorksheet('Submissions');
        worksheet.addRow(cols.map((r) => this.getExportSubmissionColumns().get(r)?.val));
        const rows = this.submissions.map((sub: Submission) => (
          Object.values(_.pick({
            fileName: sub.file.name,
            points: sub.score,
            maxPoints: sub.maxScore,
            score: sub.score / sub.maxScore,
            creator: sub.workbook.creator,
            company: sub.workbook.company,
            lastModifiedBy: sub.workbook.lastModifiedBy,
            lastModified: sub.workbook.modified,
            created: sub.workbook.created,
            lastPrinted: sub.workbook.lastPrinted,
            manager: sub.workbook.manager,
            title: sub.workbook.title,
            subject: sub.workbook.subject,
            description: sub.workbook.description,
            keywords: sub.workbook.keywords,
            category: sub.workbook.category,

            ...Array.from(sub.responses.entries()).map(([key, val]) => ({
              ["expected-" + key.uuid]: val.expectedValue,
            })).reduce((acc, cur) => {
              Object.assign(acc, cur);
              return acc;
            }, {}),

            ...Array.from(sub.responses.entries()).map(([key, val]) => ({
              ["provided-" + key.uuid]: val.providedValue,
            })).reduce((acc, cur) => {
              Object.assign(acc, cur);
              return acc;
            }, {}),

          }, ...cols))));
        worksheet.addRows(rows);
        worksheet.columns.forEach((column) => {
          if (!column.values) return;
          const lengths = column.values.map((v: CellValue) => {
            if (v instanceof Date) {
              return v.toLocaleDateString().length;
            }
            return (v ?? '').toString().length;
          });
          // eslint-disable-next-line no-param-reassign
          column.width = Math.max(Math.max(...lengths.filter(
            (v) => typeof v === 'number',
          )) + 2, (column.header ?? '').length + 6);
        });
        workbook.download();
      }
    });
  }

  getExportSubmissionColumns(): Map<string, ExportValue> {
    if (!this.masterAssignment) return new Map();
    const copy = new Map(ExportSubmissionColumns);
    for (let i = 0; i < this.masterAssignment.getQuestions().length; i += 1) {
      const que = this.masterAssignment.getQuestions()[i];
      const questionName = que.name || `Problem ${i + 1}`;
      for (let j = 0; j < que.getFacets().length; j += 1) {
        const fac = que.getFacets()[j];
        copy.set("expected-"+ fac.uuid, { val: `${questionName} Expected - ${fac.getName()} (#${j + 1})`, fac });
        copy.set("provided-"+ fac.uuid, { val: `${questionName} Provided - ${fac.getName()} (#${j + 1})`, fac });
      }
    }
    return copy;
  }
}

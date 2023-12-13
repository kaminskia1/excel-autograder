import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { WorkbookService } from '../../models/workbook/workbook.service';
import { AssignmentService } from '../../models/assignment/assignment.service';
import { QuestionService } from '../../models/question/question.service';
import { AssignmentFactory } from '../../models/assignment/assignment.factory';
import { Assignment } from '../../models/assignment/assignment';
import { WorkbookFactory } from '../../models/workbook/workbook.factory';
import { FancyWorkbook } from '../../models/workbook/workbook';
import { Facet } from '../../models/question/facet/facet';
import {
  ConfirmationDialogComponent,
} from '../../components/confirmation-dialog/confirmation-dialog.component';

type Submission = {
  file: File,
  workbook: FancyWorkbook,
  score: number,
  maxScore: number,
  responses: Map<Facet, number>
}

@Component({
  selector: 'app-grader',
  templateUrl: './grader.component.html',
  styleUrls: ['./grader.component.scss'],
})
export class GraderComponent implements OnInit {
  masterAssignment: Assignment | null = null;

  masterWorkbook: FancyWorkbook | null = null;

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
    public questionService: QuestionService,
    public assignmentFactory: AssignmentFactory,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
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
    this.assignmentService.retrieve(id).subscribe((iAssignment) => {
      const assignment = this.assignmentFactory.createAssignment(iAssignment);
      this.masterAssignment = assignment;
      this.questionService.loadQuestions(assignment);
      this.activateWorkbook(assignment);
    });
  }

  activateWorkbook(assignment: Assignment) {
    assignment.getFile().subscribe((file) => {
      this.workbookService.loadWorkbook(file);
      this.workbookFactory.loadWorkbook(file).then((workbook: FancyWorkbook) => {
        this.masterWorkbook = workbook;
      });
    });
  }

  addSubmission(fileList: FileList | EventTarget | null) {
    fileList = fileList instanceof FileList ? fileList : (fileList as HTMLInputElement).files;
    if (!fileList) return;
    const files = Array.from(fileList);

    files.forEach((file) => {
      this.workbookFactory.loadWorkbook(file).then((workbook: FancyWorkbook) => {
        const submission: Submission = {
          file,
          workbook,
          score: this.getScore(workbook),
          maxScore: this.getMaxScore(),
          responses: this.getResponses(workbook),
        };
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
        title: 'Confirm Delete',
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

  getResponses(workbook: FancyWorkbook): Map<Facet, number> {
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

  setActiveSubmission(submission: Submission) {
    this.activeSubmission = submission;
  }

  areAllFacetsValid(): boolean {
    if (!this.masterAssignment) return false;
    return this.masterAssignment.getQuestions().every(
      (que) => que.getFacets().every((fac) => fac.isValid()),
    );
  }

  edit() {
    if (!this.masterAssignment) return;
    if (!this.submissions.length) {
      this.router.navigate(['wizard', this.masterAssignment.uuid]);
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Navigate',
        message: 'Any uploaded submissions will be lost.',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.masterAssignment) {
        this.router.navigate(['wizard', this.masterAssignment.uuid]);
      }
    });
  }
}

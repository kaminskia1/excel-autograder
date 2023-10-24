import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { WorkbookService } from '../../models/workbook/workbook.service';
import { AssignmentService } from '../../models/assignment/assignment.service';
import { QuestionService } from '../../models/question/question.service';
import { AssignmentFactory } from '../../models/assignment/assignment.factory';
import { Assignment } from '../../models/assignment/assignment';
import { WorkbookFactory } from '../../models/workbook/workbook.factory';
import { FancyWorkbook } from '../../models/workbook/workbook';
import {Workbook} from "exceljs";

type Submission = {
  file: File,
  workbook: FancyWorkbook,
  score: number,
  maxScore: number,
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

  submissionTable = new MatTableDataSource<Submission>(this.submissions);

  displayedColumns: string[] = ['name', 'size', 'score', 'action'];

  constructor(
    private route: ActivatedRoute,
    public workbookService: WorkbookService,
    public workbookFactory: WorkbookFactory,
    public assignmentService: AssignmentService,
    public questionService: QuestionService,
    public assignmentFactory: AssignmentFactory,
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
        const submission: Submission = { file, workbook,
          score: this.getScore(workbook),
          maxScore: this.getMaxScore()
        }
        console.log(submission)
        this.submissions.push(submission)
        this.submissionTable.data = this.submissions.sort((a, b) => a.file.name.localeCompare(b.file.name));
      });
    });
  }

  removeSubmission(submission: Submission) {
    this.submissions = this.submissions.filter((f) => f !== submission);
    this.submissionTable.data = this.submissions
  }

  getScore(workbook: FancyWorkbook): number {
    if (!this.masterAssignment) throw Error('No master assignment selected!');
    return this.masterAssignment.getQuestions()
      .reduce((acc, que) => acc + que.evaluateScore(workbook), 0)
  }

  getMaxScore(): number {
    if (!this.masterAssignment) throw Error('No master assignment selected!');
    return this.masterAssignment.getQuestions()
      .reduce(function(acc: number, que) { return acc + que.getMaxScore()}, 0)
  }
}

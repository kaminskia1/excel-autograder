import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkbookService } from '../../models/workbook/workbook.service';
import { AssignmentService } from '../../models/assignment/assignment.service';
import { QuestionService } from '../../models/question/question.service';
import { AssignmentFactory } from '../../models/assignment/assignment.factory';
import { Assignment } from '../../models/assignment/assignment';
import { WorkbookFactory } from '../../models/workbook/workbook.factory';
import { FancyWorkbook } from '../../models/workbook/workbook';

@Component({
  selector: 'app-grader',
  templateUrl: './grader.component.html',
  styleUrls: ['./grader.component.scss'],
})
export class GraderComponent implements OnInit {
  assignment: Assignment | null = null;

  assignmentWorkbook: FancyWorkbook | null = null;

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
      this.assignment = assignment;
      this.questionService.loadQuestions(assignment);
      this.activateWorkbook(assignment);
    });
  }

  activateWorkbook(assignment: Assignment) {
    assignment.getFile().subscribe((file) => {
      this.workbookService.loadWorkbook(file);
      this.workbookFactory.loadWorkbook(file).then((workbook: FancyWorkbook) => {
        this.assignmentWorkbook = workbook;
      });
    });
  }
}

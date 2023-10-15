import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Cell } from 'exceljs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignmentService } from '../../models/assignment/assignment.service';
import { Assignment } from '../../models/assignment/assignment';
import { AssignmentFactory } from '../../models/assignment/assignment.factory';
import { WorkbookService } from '../../services/workbook/workbook.service';
import { QuestionService } from '../../models/question/question.service';
import { Question } from '../../models/question/question';
import { QuestionType } from '../../models/question/misc';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
})
export class WizardComponent implements OnInit {
  activeAssignment: Assignment | null = null;

  activeQuestion: Question | null = null;

  range = (start: number, end: number) => Array.from({
    length: (end - start),
  }, (v, k) => k + start);

  constructor(
    private route: ActivatedRoute,
    public workbookService: WorkbookService,
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
      this.activeAssignment = assignment;
      this.questionService.loadQuestions(assignment);
      this.activateWorkbook(assignment);
    });
  }

  activateWorkbook(assignment: Assignment) {
    assignment.getFile().subscribe((file) => {
      this.workbookService.loadWorkbook(file);
    });
  }

  selectCell(cell: Cell) {
    if (this.activeQuestion == null) return;
    if (this.activeQuestion.getTargetCell() != null) {
      this.clearTableCell(this.activeQuestion.getTargetCell());
    }
    this.activeQuestion.setTargetCell(cell);
    this.activeQuestion = null;
  }

  highlightTableCell(cell: Cell|undefined) {
    if (cell == null) return;
    const renderedCell = this.workbookService.getTableCellByAddress(cell.fullAddress);
    if (renderedCell) renderedCell.isHighlighted = true;
  }

  clearTableCell(cell: Cell|undefined) {
    if (cell == null) return;
    const renderedCell = this.workbookService.getTableCellByAddress(cell.fullAddress);
    if (renderedCell) renderedCell.isHighlighted = false;
  }

  saveQuestions() {
    if (this.activeAssignment == null) return;
    this.activeAssignment.questions = this.questionService.getQuestions();
    this.activeAssignment.save().subscribe({
      next: () => {
        this.snackBar.open('Saved!', 'Close', { duration: 1500 });
      },
      error: () => {
        this.snackBar.open('Failed to save!', 'Close', { duration: 1500 });
      },
    });
  }

  protected readonly QuestionElementType = QuestionType;
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Cell } from 'exceljs';
import { AssignmentService } from '../../services/api/assignment/assignment.service';
import { Assignment } from '../../services/api/assignment/assignment';
import { WorkbookService } from '../../services/workbook/workbook.service';
import { QuestionService } from '../../services/question/question.service';
import { QType, Question } from '../../services/question/question';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
})
export class WizardComponent implements OnInit {
  activeAssignment: Assignment | null = null;

  activeQuestion: Question | null = null;

  public static range = (start: number, end: number) => Array.from({
    length: (end - start)
  }, (v, k) => k + start);

  constructor(private route: ActivatedRoute,
              public workbookService: WorkbookService,
              public assignmentService: AssignmentService,
              public questionService: QuestionService,
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
    this.assignmentService.retrieve(id).subscribe((assignment) => {
      this.activeAssignment = assignment;
      this.questionService.loadQuestions(assignment);
      this.activateWorkbook(assignment);
    });
  }

  activateWorkbook(assignment: Assignment) {
    this.assignmentService.getFile(assignment).subscribe((file) => {
      this.workbookService.loadWorkbook(file);
    });
  }

  selectCell(cell: Cell) {
    if (this.activeQuestion == null) return;
    if (this.activeQuestion.targetCell != null)
      this.clearTableCell(this.activeQuestion._targetCell);
    this.activeQuestion._targetCell = cell;
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

  protected readonly QuestionElementType = QType;
}

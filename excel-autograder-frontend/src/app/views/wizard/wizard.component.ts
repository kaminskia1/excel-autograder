import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Cell } from "exceljs";
import { AssignmentService } from "../../services/api/assignment/assignment.service";
import { Assignment } from "../../services/api/assignment/assignment";
import { WorkbookService } from "../../services/workbook/workbook.service";
import { QuestionService } from "../../services/question/question.service";
import {QElement, QElementType, Question} from "../../services/question/question";


@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {
  activeAssignment: Assignment | null = null;
  activeQElement: QElement | null = null

  range = (start: number, end: number) => Array.from({ length: (end - start) }, (v, k) => k + start);

  constructor(private route: ActivatedRoute ,
              public workbookService: WorkbookService,
              public assignmentService: AssignmentService,
              public questionService: QuestionService) { }

  ngOnInit(): void {
    // Resolve assignment id => Resolve assignment obj => Resolve workbook file => Enable workbook
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const id = params.get("id")
        if (id) {
          this.registerAssignment(id);
        }
    });
  }

  registerAssignment(id: string) {
    this.assignmentService.retrieve(id).subscribe({
      next: (assignment) => {
        this.activeAssignment = assignment;
        this.activateWorkbook(assignment)
      }
    });
  }

  activateWorkbook(assignment: Assignment) {
    this.assignmentService.getFile(assignment).subscribe({
      next: (file) => {
        this.workbookService.loadWorkbook(file);
      }
    })
  }

  selectCell(cell: Cell) {

    if (this.activeQElement == null) return;
    this.activeQElement.targetCell = cell
    this.activeQElement = null;
  }

  protected readonly QuestionElementType = QElementType;
}

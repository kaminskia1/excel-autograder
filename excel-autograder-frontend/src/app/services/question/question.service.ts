import { Injectable } from '@angular/core';
import { Question, QType } from "./question";
import {Cell} from "exceljs";
import { WorkbookService } from "../workbook/workbook.service";
import {Assignment} from "../api/assignment/assignment";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  questions: Array<Question> = []
  constructor(private workbookService: WorkbookService) { }


  loadQuestions(assignment: Assignment) {
    this.questions = assignment.questions
  }

  deleteQuestions() {
    this.questions = []
  }

  getQuestions() {
    return this.questions
  }

  addQuestion() {
    const question: Question = {
      type: QType.Value,
      points: 1
    }
    this.questions.push(question)
  }

  removeQuestion(question: Question) {
    const index = this.questions.indexOf(question);
    if (index > -1) {
      this.questions.splice(index, 1);
    }
  }

  getTargetCell(question: Question): Cell | undefined {
    if (question._targetCell) return question._targetCell
    if (question.targetCell == null) return undefined
    return this.workbookService.getCell(question.targetCell)
  }
}

import { Injectable } from '@angular/core';
import { Question } from './question';
import { QuestionFactory } from './question.factory';
import { WorkbookService } from '../workbook/workbook.service';
import { Assignment } from '../assignment/assignment';
import { QuestionType } from './misc';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  questions: Array<Question> = [];

  constructor(
    private workbookService: WorkbookService,
    private questionFactory: QuestionFactory,
  ) { }

  loadQuestions(assignment: Assignment) {
    this.questions = assignment.questions;
  }

  deleteQuestions() {
    this.questions = [];
  }

  getQuestions() {
    return this.questions;
  }

  addQuestion() {
    const question: Question = this.questionFactory.createQuestion({
      type: QuestionType.Value,
      points: 1,
      attributes: [],
    });
    this.questions.push(question);
  }

  removeQuestion(question: Question) {
    const index = this.questions.indexOf(question);
    if (index > -1) {
      this.questions.splice(index, 1);
    }
  }
}

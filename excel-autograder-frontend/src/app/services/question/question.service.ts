import { Injectable } from '@angular/core';
import { Question, QElement, QElementType } from "./question";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  questions: Array<Question> = []
  constructor() { }

  create() {
    this.questions.push({ elements: [] })
  }

  getQuestions() {
    return this.questions
  }

  removeQuestion(question: Question) {
    const index = this.questions.indexOf(question);
    if (index > -1) {
      this.questions.splice(index, 1);
    }
  }
  addElement(question: Question) {
    let element: QElement = {
      type: QElementType.Value,
      points: 1
    }
    question.elements.push(element);
  }
}

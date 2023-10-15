import { Injectable } from '@angular/core';
import { WorkbookService } from '../../services/workbook/workbook.service';
import { Question, IQuestionPartial } from './question';

@Injectable({
  providedIn: 'root',
})
export class QuestionFactory {
  constructor(private workbookService: WorkbookService) { }

  createQuestion(question: IQuestionPartial): Question {
    if (question instanceof Question) return question;
    return new Question(question, this.workbookService);
  }
}

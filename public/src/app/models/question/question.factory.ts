import { Injectable } from '@angular/core';
import { Question, IQuestionPartial } from './question';
import { FacetFactory } from './facet/facet.factory';

@Injectable({
  providedIn: 'root',
})
export class QuestionFactory {
  constructor(private facetFactory: FacetFactory) { }

  createQuestion(question: IQuestionPartial): Question {
    if (question instanceof Question) return question;
    return new Question(question, this.facetFactory);
  }
}

import { Workbook } from 'exceljs';
import { IModel } from '../model';
import { Facet, IFacet, IFacetPartial } from './facet/facet';
import { FacetFactory } from './facet/facet.factory';

export interface IQuestionPartial {
  facets: Array<IFacetPartial>
}

export interface IQuestion extends IQuestionPartial, IModel<IQuestionPartial> {
  facets: Array<IFacet>
}

export class Question implements IQuestion {
  facets: Array<Facet> = [];

  constructor(question: IQuestionPartial, private facetFactory: FacetFactory) {
    this.facets = question.facets.map((attr) => this.facetFactory.createFacet(attr));
  }

  getSerializable(): IQuestionPartial {
    return {
      facets: this.facets.map((attr) => attr.getSerializable()),
    };
  }

  getMaxScore(): number {
    return this.facets.reduce((acc, facet) => acc + facet.getMaxScore(), 0);
  }

  evaluateScore(workbook: Workbook): number {
    return this.facets.reduce((acc, facet) => acc + facet.evaluateScore(workbook), 0);
  }

  getFacets(): Array<Facet> {
    return this.facets;
  }

  createFacet(iFacet: IFacetPartial): Facet {
    const facet = this.facetFactory.createFacet(iFacet);
    this.facets.push(facet);
    return facet;
  }

  removeFacet(facet: Facet): void {
    if (this.facets.indexOf(facet) === -1) throw new Error('Facet not found in question');
    this.facets.splice(this.facets.indexOf(facet), 1);
  }
}

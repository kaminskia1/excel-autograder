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

  getMaxPoints(): number {
    return this.facets.reduce((acc, facet) => acc + facet.getMaxPoints(), 0);
  }

  getPoints(workbook: Workbook): number {
    return this.facets.reduce((acc, facet) => acc + facet.evaluatePoints(workbook), 0);
  }

  getFacets(): Array<Facet> {
    return this.facets;
  }

  createFacet(iFacet: IFacetPartial): Facet {
    const facet = this.facetFactory.createFacet(iFacet);
    this.facets.push(facet);
    return facet;
  }

  removeFacet(idx: number): void {
    this.facets.splice(idx, 1);
  }
}

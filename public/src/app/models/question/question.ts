import { IModel } from '../model';
import { Facet, IFacet, IFacetPartial } from './facet/facet';
import { FacetFactory } from './facet/facet.factory';
import { FancyWorkbook } from '../workbook/workbook';

export interface IQuestionPartial {
  name?: string
  facets: Array<IFacetPartial>
}

export interface IQuestion extends IQuestionPartial, IModel<IQuestionPartial> {
  name?: string
  facets: Array<IFacet>
}

export class Question implements IQuestion {
  name?: string;

  facets: Array<Facet> = [];

  constructor(question: IQuestionPartial, private facetFactory: FacetFactory) {
    this.name = question.name;
    this.facets = question.facets.map((attr) => this.facetFactory.createFacet(attr));
  }

  getSerializable(): IQuestionPartial {
    return {
      name: this.name,
      facets: this.facets.map((attr) => attr.getSerializable()),
    };
  }

  getMaxScore(): number {
    return this.facets.reduce((acc, facet) => acc + facet.getMaxScore(), 0);
  }

  evaluateScore(workbook: FancyWorkbook): number {
    return this.facets.reduce((acc, facet) => acc + facet.evaluateScore(workbook), 0);
  }

  evaluateResponses(workbook: FancyWorkbook): Map<Facet, number> {
    return this.facets.reduce((acc, facet) => {
      acc.set(facet, {
        score: facet.evaluateScore(workbook),
        maxScore: facet.getMaxScore(),
        providedValue: facet.getProvidedValue(workbook),
        expectedValue: facet.getTargetCellValue(),
      });
      return acc;
    }, new Map());
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

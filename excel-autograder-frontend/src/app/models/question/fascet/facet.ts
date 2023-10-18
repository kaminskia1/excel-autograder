import { Workbook } from 'exceljs';

export enum FacetType {
  FunctionChainFacet = 'FunctionChainFacet',
  FunctionContainsFacet = 'FunctionContainsFacet',
  FunctionListFacet = 'FunctionListFacet',
  ValueFacet = 'ValueFacet',
}

export interface IFacetPartial {
  type: FacetType
  points: number
}

export interface IFacet extends IFacetPartial {
  evaluatePoints(workbook: Workbook): number
  getMaxPoints(): number
}

export abstract class Facet implements IFacet {
  abstract readonly type: FacetType;

  points = 0;

  protected constructor(facet: IFacetPartial) {
    this.points = facet.points;
  }

  abstract evaluatePoints(workbook: Workbook): number

  getMaxPoints(): number {
    return this.points;
  }
}

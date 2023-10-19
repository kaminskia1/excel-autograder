import { Workbook } from 'exceljs';
import { IModel } from '../../model';
import { WorkbookService } from '../../workbook/workbook.service';

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

export interface IFacet extends IFacetPartial, IModel<IFacetPartial> {
  evaluatePoints(workbook: Workbook): number
  getMaxPoints(): number
}

export abstract class Facet implements IFacet {
  abstract readonly type: FacetType;

  points = 0;

  protected constructor(facet: IFacetPartial, protected workbookService: WorkbookService) {
    this.points = facet.points;
  }

  abstract evaluatePoints(workbook: Workbook): number

  abstract getSerializable(): IFacetPartial

  getMaxPoints(): number {
    return this.points;
  }
}

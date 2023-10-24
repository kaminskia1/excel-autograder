import { Workbook } from 'exceljs';
import { IModel } from '../../model';
import { WorkbookService } from '../../workbook/workbook.service';
import { FacetType } from './types/lib';

export interface IFacetPartial {
  type: FacetType
  points: number
}

export interface IFacet extends IFacetPartial, IModel<IFacetPartial> {
  evaluateScore(workbook: Workbook): number
  getMaxScore(): number
  getName(): string
}

export abstract class Facet implements IFacet {
  abstract readonly type: FacetType;

  points: number = 1;

  protected constructor(facet: IFacetPartial, protected workbookService: WorkbookService) {
    this.points = facet.points;
  }

  abstract evaluateScore(workbook: Workbook): number

  abstract getSerializable(): IFacetPartial

  abstract getName(): string

  getMaxScore(): number {
    return this.points;
  }
}

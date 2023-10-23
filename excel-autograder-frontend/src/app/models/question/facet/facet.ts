import {Workbook} from 'exceljs';
import {IModel} from '../../model';
import {WorkbookService} from '../../workbook/workbook.service';
import {FacetType} from "./types/lib";

export interface IFacetPartial {
  type: FacetType
  points: number
}

export interface IFacet extends IFacetPartial, IModel<IFacetPartial> {
  evaluatePoints(workbook: Workbook): number
  getMaxPoints(): number
  getName(): string
}

export abstract class Facet implements IFacet {
  abstract readonly type: FacetType;

  points = 0;

  protected constructor(facet: IFacetPartial, protected workbookService: WorkbookService) {
    this.points = facet.points;
  }

  abstract evaluatePoints(workbook: Workbook): number

  abstract getSerializable(): IFacetPartial

  abstract getName(): string

  getMaxPoints(): number {
    return this.points;
  }
}

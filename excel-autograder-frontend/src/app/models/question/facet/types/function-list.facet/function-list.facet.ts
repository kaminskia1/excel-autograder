import { Workbook } from 'exceljs';
import {
  Facet, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { WorkbookService } from '../../../../workbook/workbook.service';
import { FacetType } from '../lib';

export type IFunctionListFacetPartial = IFacetPartial

export interface IFunctionListFacet extends IFunctionListFacetPartial, IFacet {

}

export class FunctionListFacet extends Facet implements
  IFunctionListFacet, IModel<IFunctionListFacetPartial> {
  readonly type: FacetType.FunctionListFacet = FacetType.FunctionListFacet;

  constructor(facet: IFunctionListFacetPartial, workbookService: WorkbookService) {
    super(facet, workbookService);
  }

  getName(): string {
    return 'Function List';
  }

  getSerializable(): IFunctionListFacetPartial {
    return {
      type: this.type,
      points: this.points,
      targetCell: this.targetCell,
    };
  }

  evaluateScore(workbook: Workbook): number {
    return this.points;
  }
}

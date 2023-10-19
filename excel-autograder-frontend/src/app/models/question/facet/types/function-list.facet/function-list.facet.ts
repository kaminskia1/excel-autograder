import { Workbook } from 'exceljs';
import {
  Facet, FacetType, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { WorkbookService } from '../../../../workbook/workbook.service';

export type IFunctionListFacetPartial = IFacetPartial

export interface IFunctionListFacet extends IFunctionListFacetPartial, IFacet {

}

export class FunctionListFacet extends Facet implements
  IFunctionListFacet, IModel<IFunctionListFacetPartial> {
  readonly type: FacetType.FunctionListFacet = FacetType.FunctionListFacet;

  constructor(facet: IFunctionListFacetPartial, workbookService: WorkbookService) {
    super(facet, workbookService);
  }

  getSerializable(): IFunctionListFacetPartial {
    return {
      type: this.type,
      points: this.points,
    };
  }

  evaluatePoints(workbook: Workbook): number {
    return this.points;
  }
}

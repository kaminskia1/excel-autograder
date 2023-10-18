import { Workbook } from 'exceljs';
import {
  Facet, FacetType, IFacet, IFacetPartial,
} from '../facet';
import { IModel } from '../../../model';

export type IFunctionListFacetPartial = IFacetPartial

export interface IFunctionListFacet extends IFunctionListFacetPartial, IFacet {

}

export class FunctionListFacet extends Facet implements
  IFunctionListFacet, IModel<IFunctionListFacetPartial> {
  readonly type: FacetType.FunctionListFacet = FacetType.FunctionListFacet;

  constructor(facet: IFunctionListFacetPartial) {
    super(facet);
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

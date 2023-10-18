import { Workbook } from 'exceljs';
import {
  Facet, FacetType, IFacet, IFacetPartial,
} from '../facet';
import { IModel } from '../../../model';

export type IFunctionChainFacetPartial = IFacetPartial

export interface IFunctionChainFacet extends IFunctionChainFacetPartial, IFacet {

}

export class FunctionChainFacet extends Facet implements
  IFunctionChainFacet, IModel<IFunctionChainFacetPartial> {
  readonly type: FacetType.FunctionChainFacet = FacetType.FunctionChainFacet;

  constructor(facet: IFunctionChainFacetPartial) {
    super(facet);
  }

  getSerializable(): IFunctionChainFacetPartial {
    return {
      type: this.type,
      points: this.points,
    };
  }

  evaluatePoints(workbook: Workbook): number {
    return this.points;
  }
}

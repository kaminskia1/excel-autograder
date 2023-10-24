import { Workbook } from 'exceljs';
import {
  Facet, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { WorkbookService } from '../../../../workbook/workbook.service';
import { FacetType } from '../lib';

export type IFunctionChainFacetPartial = IFacetPartial

export interface IFunctionChainFacet extends IFunctionChainFacetPartial, IFacet {

}

export class FunctionChainFacet extends Facet implements
  IFunctionChainFacet, IModel<IFunctionChainFacetPartial> {
  readonly type: FacetType.FunctionChainFacet = FacetType.FunctionChainFacet;

  constructor(facet: IFunctionChainFacetPartial, workbookService: WorkbookService) {
    super(facet, workbookService);
  }

  getName(): string {
    return 'Function Chain';
  }

  getSerializable(): IFunctionChainFacetPartial {
    return {
      type: this.type,
      points: this.points,
    };
  }

  evaluateScore(workbook: Workbook): number {
    return this.points;
  }
}

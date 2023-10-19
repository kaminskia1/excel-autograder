import {
  Facet, FacetType, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { FancyWorkbook } from '../../../../workbook/workbook';
import { WorkbookService } from '../../../../workbook/workbook.service';

export type IFunctionContainsFacetPartial = IFacetPartial

export interface IFacetFunctionContains extends IFunctionContainsFacetPartial, IFacet {

}

export class FunctionContainsFacet extends Facet implements
  IFacetFunctionContains, IModel<IFunctionContainsFacetPartial> {
  readonly type: FacetType.FunctionContainsFacet = FacetType.FunctionContainsFacet;

  constructor(facet: IFunctionContainsFacetPartial, workbookService: WorkbookService) {
    super(facet, workbookService);
  }

  getSerializable(): IFunctionContainsFacetPartial {
    return {
      type: this.type,
      points: this.points,
    };
  }

  evaluatePoints(workbook: FancyWorkbook): number {
    return this.points;
  }
}

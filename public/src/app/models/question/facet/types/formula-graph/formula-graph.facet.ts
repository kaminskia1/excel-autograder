import {
  Facet, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { WorkbookService } from '../../../../workbook/workbook.service';
import { FacetType } from '../lib';
import { FancyWorkbook } from '../../../../workbook/workbook';

export type IFunctionChainFacetPartial = IFacetPartial

export interface IFunctionChainFacet extends IFunctionChainFacetPartial, IFacet {

}

export class FormulaGraphFacet extends Facet implements
  IFunctionChainFacet, IModel<IFunctionChainFacetPartial> {
  readonly type: FacetType.FormulaGraphFacet = FacetType.FormulaGraphFacet;

  constructor(facet: IFunctionChainFacetPartial, workbookService: WorkbookService) {
    super(facet, workbookService);
  }

  getName(): string {
    return 'Formula Graph';
  }

  getInfo(): Array<string> {
    return [
      `Target Cell: ${this.targetCell.address.toString() ?? 'Not set'}`,
    ];
  }

  getSerializable(): IFunctionChainFacetPartial {
    return {
      type: this.type,
      points: this.points,
      targetCell: this.targetCell,
    };
  }

  evaluateScore(workbook: FancyWorkbook): number {
    return this.points;
  }

  isValid(): boolean {
    return false;
  }
}

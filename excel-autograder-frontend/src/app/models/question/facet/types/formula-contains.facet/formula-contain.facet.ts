import {
  Facet, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { FancyWorkbook } from '../../../../workbook/workbook';
import { WorkbookService } from '../../../../workbook/workbook.service';
import { FacetType } from '../lib';

export interface IFormulaContainsFacetPartial extends IFacetPartial {
  formula?: string
}

export interface IFormulaContainsFacet extends IFormulaContainsFacetPartial, IFacet {

}

export class FormulaContainsFacet extends Facet implements IFormulaContainsFacet, IModel<IFormulaContainsFacetPartial> {
  readonly type: FacetType.FormulaContainsFacet = FacetType.FormulaContainsFacet;

  formula?: string;

  constructor(facet: IFormulaContainsFacetPartial, workbookService: WorkbookService) {
    super(facet, workbookService);
    this.formula = facet.formula;
  }

  getName(): string {
    return 'Formula Contains';
  }

  getSerializable(): IFormulaContainsFacetPartial {
    return {
      type: this.type,
      points: this.points,
      formula: this.formula,
      targetCell: this.targetCell,
    };
  }

  evaluateScore(workbook: FancyWorkbook): number {
    if (!this.targetCell) throw new Error('Target cell not set');
    if (!this.formula) throw new Error('Target formula not set');
    const targetCell = workbook.getCell(this.targetCell);
    if (!targetCell) throw new Error('Error reading target cell from workbook');
    const cleaned = this.formula.replace(/"([^"]*")/g, '');
    return targetCell.formula.includes(cleaned) ? this.points : 0;
  }
}

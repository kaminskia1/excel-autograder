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

export class FormulaContainsFacet extends Facet implements
  IFormulaContainsFacet, IModel<IFormulaContainsFacetPartial> {
  readonly type: FacetType.FormulaContainsFacet = FacetType.FormulaContainsFacet;

  formula?: string;

  constructor(facet: IFormulaContainsFacetPartial, workbookService: WorkbookService) {
    super(facet, workbookService);
    this.formula = facet.formula;
  }

  getName(): string {
    return 'Formula Contains';
  }

  getInfo(): Array<string> {
    return [
      `Target Cell: ${this.targetCell.address.toString() ?? 'Not set'}`,
      `Formula: ${this.formula ?? 'Not set'}`];
  }

  getSerializable(): IFormulaContainsFacetPartial {
    return {
      type: this.type,
      points: this.points,
      review: this.review,
      formula: this.formula,
      targetCell: this.targetCell,
    };
  }

  evaluateScore(workbook: FancyWorkbook): number {
    if (!this.targetCell) throw new Error('Target cell not set');
    if (!this.formula) throw new Error('Formula cell not set');
    const targetCell = workbook.getCell(this.targetCell);
    if (!targetCell || !targetCell.formula) return 0;
    const cleaned = this.formula.replace(/"([^"]*")/g, '');
    return targetCell.formula.includes(cleaned) ? this.points : 0;
  }

  isValid(): boolean {
    return this.formula !== null && this.points != null && this.targetCell !== null;
  }
}

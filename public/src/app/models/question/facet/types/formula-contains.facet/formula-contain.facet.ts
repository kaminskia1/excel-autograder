import {
  Facet, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { FancyWorkbook } from '../../../../workbook/workbook';
import { WorkbookService } from '../../../../workbook/workbook.service';
import { FacetType } from '../facet-type.enum';

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

  getDefaultName(): string {
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
      name: this.name,
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
    // Strip Excel's internal function prefixes (used for newer functions like STDEV.S, CONCAT, IFS, etc.)
    const cellFormula = targetCell.formula.replace(/_xlfn\./g, '').replace(/_xlws\./g, '');
    const cleaned = this.formula.replace(/"([^"]*")/g, '');
    return cellFormula.includes(cleaned) ? this.points : 0;
  }

  isValid(): boolean {
    return this.formula !== null && this.points != null && this.targetCell !== null;
  }
}

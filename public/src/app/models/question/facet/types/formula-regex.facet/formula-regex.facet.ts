import {
  Facet, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { FancyWorkbook } from '../../../../workbook/workbook';
import { WorkbookService } from '../../../../workbook/workbook.service';
import { FacetType } from '../lib';

export interface IFormulaRegexFacetPartial extends IFacetPartial {
  expression?: string
}

export interface IFormulaRegexFacet extends IFormulaRegexFacetPartial, IFacet {

}

export class FormulaRegexFacet extends Facet implements
  IFormulaRegexFacet, IModel<IFormulaRegexFacetPartial> {
  readonly type: FacetType.FormulaRegexFacet = FacetType.FormulaRegexFacet;

  expression?: string;

  constructor(facet: IFormulaRegexFacetPartial, workbookService: WorkbookService) {
    super(facet, workbookService);
    this.targetCell = facet.targetCell;
    this.expression = facet.expression;
  }

  getName(): string {
    return 'Formula Regex';
  }

  getInfo(): Array<string> {
    return [
      `Target Cell: ${this.targetCell.address.toString() ?? 'Not set'}`,
      `Expression: ${this.expression ?? 'Not set'}`,
    ];
  }

  getSerializable(): IFormulaRegexFacetPartial {
    return {
      type: this.type,
      points: this.points,
      expression: this.expression,
      targetCell: this.targetCell,
    };
  }

  evaluateScore(workbook: FancyWorkbook): number {
    if (!this.targetCell) throw new Error('Target cell not set');
    if (!this.expression) throw new Error('Expression not set');
    const targetCell = workbook.getCell(this.targetCell);
    if (!targetCell || !targetCell.formula) return 0;
    let expression;
    try {
      expression = new RegExp(this.expression);
    } catch (e) {
      throw new Error('Error parsing regex');
    }
    return expression.test(targetCell.formula) ? this.points : 0;
  }

  isValid(): boolean {
    if (!this.expression) return false;
    let expression;
    try {
      expression = new RegExp(this.expression);
    } catch {
      return false;
    }
    return expression !== null && this.points != null && this.targetCell !== null;
  }
}

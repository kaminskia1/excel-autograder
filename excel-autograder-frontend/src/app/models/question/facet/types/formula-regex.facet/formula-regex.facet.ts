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
      `Points: ${this.points ?? 'Not set'}`,
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
    if (!this.expression) throw new Error('Target formula not set');
    const targetCell = workbook.getCell(this.targetCell);
    let expression;
    try {
      expression = new RegExp(this.expression);
    } catch (e) {
      throw new Error('Error parsing regex');
    }
    if (!targetCell) throw new Error('Error reading target cell from workbook');
    return expression.test(targetCell.formula) ? this.points : 0;
  }
}

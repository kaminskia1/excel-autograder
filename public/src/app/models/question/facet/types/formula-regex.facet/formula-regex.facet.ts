import safeRegex from 'safe-regex';
import {
  Facet, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { FancyWorkbook } from '../../../../workbook/workbook';
import { WorkbookService } from '../../../../workbook/workbook.service';
import { FacetType } from '../facet-type.enum';

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

  getDefaultName(): string {
    return 'Formula Regex';
  }

  getInfo(): Array<string> {
    return [
      `Target Cell:${this.targetCell?.address?.toString() ? ` ${this.targetCell.address.toString()}` : '&nbsp;<span class="red">Not set</span>'}`,
      `Expression:${this.expression ? ` ${this.expression}` : '&nbsp;<span class="red">Not set</span>'}`,
    ];
  }

  getSerializable(): IFormulaRegexFacetPartial {
    return {
      type: this.type,
      name: this.name,
      points: this.points,
      review: this.review,
      expression: this.expression,
      targetCell: this.targetCell,
    };
  }

  evaluateScore(workbook: FancyWorkbook): number {
    if (!this.targetCell) throw new Error('Target cell not set');
    if (!this.expression) throw new Error('Expression not set');
    const targetCell = workbook.getCell(this.targetCell);
    if (!targetCell || !targetCell.formula) return 0;
    // Strip Excel's internal function prefixes (used for newer functions like STDEV.S, CONCAT, IFS, etc.)
    const cellFormula = targetCell.formula.replace(/_xlfn\./g, '').replace(/_xlws\./g, '');
    let expression;
    try {
      // Check for potentially unsafe regex patterns that could cause ReDoS
      if (!safeRegex(this.expression)) {
        throw new Error('Regex pattern is potentially unsafe and may cause performance issues');
      }
      expression = new RegExp(this.expression);
    } catch (e) {
      throw new Error('Error parsing regex');
    }
    return expression.test(cellFormula) ? this.points : 0;
  }

  isValid(): boolean {
    if (!this.expression) return false;
    try {
      new RegExp(this.expression);
    } catch {
      return false;
    }
    // Check for potentially unsafe regex patterns that could cause ReDoS
    if (!safeRegex(this.expression)) {
      return false;
    }
    return this.points != null && this.targetCell != null;
  }

  /**
   * Check if the regex pattern is safe from ReDoS attacks.
   */
  isSafePattern(): boolean {
    if (!this.expression) return true; // No pattern = safe
    return safeRegex(this.expression);
  }
}

import { Cell } from 'exceljs';
import {
  Facet, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { FancyWorkbook } from '../../../../workbook/workbook';
import { WorkbookService } from '../../../../workbook/workbook.service';
import { ICellAddress } from '../../../misc';
import { FacetType } from '../lib';

export interface IFormulaRegexFacetPartial extends IFacetPartial {
  targetCell?: ICellAddress
  expression?: string
}

export interface IFormulaRegexFacet extends IFormulaRegexFacetPartial, IFacet {

}

export class FormulaRegexFacet extends Facet implements
  IFormulaRegexFacet, IModel<IFormulaRegexFacetPartial> {
  readonly type: FacetType.FormulaRegexFacet = FacetType.FormulaRegexFacet;

  expression?: string;

  targetCell?: ICellAddress;

  private cache: { targetCell?: Cell } = {};

  constructor(facet: IFormulaRegexFacetPartial, workbookService: WorkbookService) {
    super(facet, workbookService);
    this.targetCell = facet.targetCell;
    this.expression = facet.expression;
  }

  getName(): string {
    return 'Formula Regex';
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

  getTargetCell(): Cell | undefined {
    if (this.cache.targetCell) return this.cache.targetCell;
    if (this.targetCell) return this.workbookService.getCell(this.targetCell);
    return undefined;
  }

  setTargetCell(cell: Cell | ICellAddress | undefined) {
    if (cell === undefined) {
      this.targetCell = undefined;
      delete this.cache.targetCell;
      return;
    }
    if ('fullAddress' in cell) {
      this.cache.targetCell = cell;
      this.targetCell = cell.fullAddress;
    } else {
      this.targetCell = cell;
    }
  }
}

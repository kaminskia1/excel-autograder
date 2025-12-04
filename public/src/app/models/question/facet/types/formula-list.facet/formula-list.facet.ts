import { Cell } from 'exceljs';
import {
  Facet, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { WorkbookService } from '../../../../workbook/workbook.service';
import { FacetType } from '../lib';
import { FancyWorkbook } from '../../../../workbook/workbook';

export interface IFormulaListFacetPartial extends IFacetPartial {
  formulas?: Array<string>
}

export interface IFormulaListFacet extends IFormulaListFacetPartial, IFacet {

}

// Matches cell names and ranges. This should (hopefully) cover all cases. Offloaded for testability
function match(str: string) {
  // 1. Matches the sheet name if it is present
  // - Either normal text, or quoted in single quotes, followed by "!"
  // 2. Checks the type of the "cell" coordinates. Either:
  // - Singular (A4)
  // - Set Range (A2:B3)
  // - Vertical or Horizontal Range (A:B, 2:3)
  return str.match(/((('.*')|([_A-Za-z-0-9]+))!)?((([A-Z]+([0-9]+))(:[A-Z]+([0-9]+))?)|([A-Z]+:[A-Z]+)|([0-9]+:[0-9]+))/g);
}

export class FormulaListFacet extends Facet implements
  IFormulaListFacet, IModel<IFormulaListFacetPartial> {
  readonly type: FacetType.FormulaListFacet = FacetType.FormulaListFacet;

  formulas?: Array<string>;

  private remFormulas: Array<string> = [];

  constructor(facet: IFormulaListFacetPartial, workbookService: WorkbookService) {
    super(facet, workbookService);
    this.formulas = facet.formulas;
  }

  getDefaultName(): string {
    return 'Formula List';
  }

  getInfo(): Array<string> {
    return [
      `Target Cell: ${this.targetCell.address.toString() ?? 'Not set'}`,
      `Formulas: ${this.formulas?.toString() ?? 'Not set'}`,
    ];
  }

  getSerializable(): IFormulaListFacetPartial {
    return {
      type: this.type,
      name: this.name,
      points: this.points,
      review: this.review,
      targetCell: this.targetCell,
      formulas: this.formulas,
    };
  }

  isValid(): boolean {
    return this.points != null && this.targetCell != null
      && this.formulas != null && this.formulas.length > 0;
  }

  evaluateScore(workbook: FancyWorkbook): number {
    if (!this.targetCell) throw new Error('Target cell not set');
    if (!this.formulas) throw new Error('Formulas cell not set');
    const targetCell = workbook.getCell(this.targetCell);
    if (!targetCell) return 0;
    if (Object.prototype.hasOwnProperty.call(targetCell, 'error')) return 0;
    if (targetCell.formula == null) return 0;
    this.remFormulas = [...this.formulas];
    this.recurse(workbook, targetCell);
    return this.remFormulas.length ? 0 : this.points;
  }

  private recurse(workbook: FancyWorkbook, currentCell: Cell) {
    const { formula } = currentCell;
    if (!formula) return;
    // @TODO: Check for any other characters that may also need to be included
    const fns = formula.match(/[A-Z.]+\(/g);
    if (fns) {
      fns.map((x) => x.slice(0, -1)).forEach((form: string) => {
        if (this.remFormulas.includes(form)) {
          this.remFormulas.splice(this.remFormulas.indexOf(form), 1);
        }
      });
    }
    const matches = match(formula.replace('$', ''));
    if (!matches) return;
    matches.forEach((addr: string) => {
      let { sheetName } = currentCell.fullAddress;
      let parsedAddr = addr;
      if (addr.includes('!')) {
        [sheetName, parsedAddr] = addr.split('!');
      }
      if (parsedAddr.includes(':')) {
        // range
        const range = workbook.getRange(parsedAddr);
        for (let col = range.left; col <= range.right; col += 1) {
          for (let row = range.top; row <= range.bottom; row += 1) {
            // @TODO: Verify that worksheet exists before grabbing it, so this does not hang.
            const nextCell = workbook.getWorksheet(sheetName).getCell(row, col);
            if (!nextCell) throw new Error('Error reading coords');
            if (nextCell.formula) this.recurse(workbook, nextCell);
          }
        }
      } else {
        // singular
        const nextCell = workbook.getWorksheet(sheetName).getCell(parsedAddr, '');
        if (!nextCell) throw new Error('Error reading coords');
        if (nextCell.formula) this.recurse(workbook, nextCell);
      }
    });
  }
}

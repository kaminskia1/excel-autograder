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

  getName(): string {
    return 'Function List';
  }

  getSerializable(): IFormulaListFacetPartial {
    return {
      type: this.type,
      points: this.points,
      targetCell: this.targetCell,
    };
  }

  evaluateScore(workbook: FancyWorkbook): number {
    if (!this.targetCell) throw new Error('Target cell not set');
    if (!this.formulas) throw new Error('Target formulas not set');
    const targetCell = workbook.getCell(this.targetCell);
    if (!targetCell) throw new Error('Error reading target cell from workbook');
    if (Object.prototype.hasOwnProperty.call(targetCell, 'error')) return 0;
    if (targetCell.formula == null) return 0;
    this.remFormulas = this.formulas;
    this.recurse(workbook, targetCell);
    return this.remFormulas.length ? 0 : this.points;
  }

  private recurse(workbook: FancyWorkbook, currentCell: Cell) {
    // get the current cell's formula
    const { formula } = currentCell;
    if (!formula) return;

    // get and save all formulas present
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
      if (addr.includes(':')) {
        // range

        // @TODO: Finish this

      } else {
        // singular
        let { sheetName } = currentCell.fullAddress;
        if (addr.includes('!')) {
          // Different sheet
          sheetName = 'asd'; // @TODO fix
        }
        const coords = addr.match(/[A-Z]*[0-9]*$/);
        if (!coords || !coords.length) throw new Error('Error parsing coords');
        const nextCell = workbook.getWorksheet(sheetName).findCell(coords[0], '');
        if (!nextCell) throw new Error('Error reading coords');
        if (nextCell.formula) this.recurse(workbook, nextCell);
      }
    });
  }
}

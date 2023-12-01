import {
  Cell,
  CellErrorValue,
  CellFormulaValue,
  CellHyperlinkValue,
  CellRichTextValue,
  Workbook,
  Worksheet,
  Range,
} from 'exceljs';
import { EventEmitter } from '@angular/core';
import { ICellAddress } from '../question/misc';
import { RenderedCell, RenderedTable } from './rendered-cell';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const colCache = require('exceljs/lib/utils/col-cache');

export class FancyWorkbook extends Workbook {
  activeSheet: Worksheet|undefined = undefined;

  renderedCellEmitter: EventEmitter<RenderedCell | undefined
  > = new EventEmitter<RenderedCell | undefined>();

  renderedTable: RenderedTable = [];

  getSheets(): Array<Worksheet> {
    return this.worksheets;
  }

  getActiveSheet(): Worksheet|undefined {
    return this.activeSheet;
  }

  setActiveSheet(sheet: Worksheet): void {
    if (this.getSheets().indexOf(sheet) === -1) throw new Error('Sheet not found in workbook');
    this.activeSheet = sheet;
    this.addColumns(3);
    this.addRows(5);
    this.refreshTable();
  }

  getTableCellByAddress(address: ICellAddress): RenderedCell | undefined {
    if (this.activeSheet?.name !== address.sheetName) return undefined;
    return this.renderedTable[address.col - 1].values[address.row - 1] || undefined;
  }

  getCell(address: ICellAddress): Cell | undefined {
    try {
      return this.getWorksheet(address.sheetName).findCell(address.row, address.col);
    } catch (e) {
      return undefined;
    }
  }

  addColumns(n = 1) {
    if (!this.activeSheet) return;
    for (let i = 0; i < n; i += 1) this.activeSheet.columns = this.activeSheet.columns.concat([{}]);
    this.refreshTable();
  }

  addRows(n = 1) {
    if (!this.activeSheet) return;
    for (let i = 0; i < n; i += 1) this.activeSheet.addRow([]);
    this.refreshTable();
  }

  emitRenderedCell(rCell: RenderedCell) {
    this.renderedCellEmitter.emit(rCell);
  }

  getRenderedCellEmitter(): EventEmitter<RenderedCell | undefined> {
    return this.renderedCellEmitter;
  }

  getSheetHeight(): number {
    if (!this.activeSheet) return 0;
    return this.activeSheet.rowCount;
  }

  getSheetWidth(): number {
    if (!this.activeSheet) return 0;
    return this.activeSheet.columnCount;
  }

  getRenderedSheetHeight(): number {
    return this.renderedTable[0].values.length;
  }

  getRenderedSheetWidth(): number {
    return this.renderedTable.length;
  }

  isRenderedCellEmitterSubscribed(): boolean {
    return this.renderedCellEmitter.observed;
  }

  /**
   * Gets a `Range` from an address range (i.e. `A1:B2`)
   * @param tlbr
   */
  getRange(tlbr: string): Range {
    return colCache.decode(tlbr);
  }

  static getCellSafeValue(cell: Cell): {type: string, text: string, value: string} {
    // @TODO clean this up using proper interface checks (see comment below)
    const val = cell.value;
    if (cell.value === null) return { type: 'null', text: '', value: '' };
    if (typeof val === 'number') return { type: 'number', text: val.toString(), value: val.toString() };
    if (typeof val === 'string') return { type: 'string', text: val, value: val };
    if (typeof val === 'boolean') return { type: 'boolean', text: val.toString(), value: val.toString() };
    if (val instanceof Date) return { type: 'date', text: val.toISOString(), value: val.toISOString()};
    if (val === undefined) return { type: 'null', text: '', value: '' };
    if (Object.prototype.hasOwnProperty.call(val, 'error')) return { type: 'error', text: (val as CellErrorValue).error.toString(), value: (val as CellErrorValue).error.toString() };
    if (Object.prototype.hasOwnProperty.call(val, 'richText')) return { type: 'richText', text: (val as CellRichTextValue).richText.join(''), value: (val as CellRichTextValue).richText.join('') };
    if (Object.prototype.hasOwnProperty.call(val, 'text')) return { type: 'text', text: (val as CellHyperlinkValue).text, value: (val as CellHyperlinkValue).text };
    if (Object.prototype.hasOwnProperty.call(val, 'formula')) {
      const fv: CellFormulaValue = val as CellFormulaValue;
      if (fv.result !== undefined) {
        if (Object.prototype.hasOwnProperty.call(fv.result, 'error')) return { type: 'error', text: (val as CellErrorValue).error.toString(), value: (val as CellErrorValue).error.toString() };
        if (fv.result instanceof Date) return { type: 'formula', text: `𝑓: ${fv.result.toISOString()}"`, value: fv.result.toISOString() };
        return { type: 'formula', text: `𝑓: ${fv.result}`, value: fv.result.toString() };
      }
      return { type: 'formula', text: `=${fv.formula}`, value: fv.formula };
    }
    return { type: 'unknown', text: 'ERROR', value: 'ERROR' };
  }

  // isCellErrorValue(value: unknown): value is CellErrorValue {
  //   return typeof value === 'object' && value !== null && 'formula' in value;
  // }

  private refreshTable(): void {
    const table: RenderedTable = [];
    if (!this.activeSheet) {
      this.renderedTable = [];
      return;
    }
    // Capping max number of columns to prevent browser from hanging
    const cols = this.activeSheet.columns.length < 50 ? this.activeSheet.columns.length : 50;
    for (let i = 1; i <= cols; i += 1) {
      const column = this.activeSheet.getColumn(i);
      if (column === null || column.eachCell === null
        || column.letter === null || column.values === null) {
        this.renderedTable = [];
        return;
      }
      table.push({ letter: column.letter, values: Array<RenderedCell>() });
      let count = 0;
      column.eachCell({ includeEmpty: true }, (cell: Cell) => {
        count += 1;
        if (count > 99) return;
        table[i - 1].values.push(
          new RenderedCell(cell, FancyWorkbook.getCellSafeValue(cell).text),
        );
      });
    }
    this.renderedTable = table;
  }
}

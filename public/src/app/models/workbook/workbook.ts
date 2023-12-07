import {
  Cell,
  CellErrorValue,
  CellFormulaValue,
  CellHyperlinkValue,
  CellRichTextValue,
  Workbook,
  Worksheet,
  Range,
  Row,
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
    if (this.activeSheet === sheet) return;
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

  getRow(row: number): Row | undefined {
    if (!this.activeSheet) return undefined;
    return this.activeSheet.getRow(row);
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

    const isCellErrorValue = (c: unknown): c is CellErrorValue => typeof c === 'object' && c !== null && 'error' in c;
    const isCellRichTextValue = (c: unknown): c is CellRichTextValue => typeof c === 'object' && c !== null && 'richText' in c;
    const isCellHyperlinkValue = (c: unknown): c is CellHyperlinkValue => typeof c === 'object' && c !== null && 'hyperlink' in c;
    const isCellFormulaValue = (c: unknown): c is CellFormulaValue => typeof c === 'object' && c !== null && 'formula' in c;

    if (cell.value === null) return { type: 'null', text: '', value: '' };
    if (typeof val === 'number') return { type: 'number', text: val.toString(), value: val.toString() };
    if (typeof val === 'string') return { type: 'string', text: val, value: val };
    if (typeof val === 'boolean') return { type: 'boolean', text: val.toString(), value: val.toString() };
    if (val instanceof Date) return { type: 'date', text: val.toISOString(), value: val.toISOString() };
    if (val === undefined) return { type: 'null', text: '', value: '' };
    if (isCellErrorValue(val)) return { type: 'error', text: val.error.toString(), value: val.error.toString() };
    if (isCellRichTextValue(val)) return { type: 'richText', text: val.richText.map(v => v.text).join(''), value: val.richText.join('') };
    if (isCellHyperlinkValue(val)) return { type: 'text', text: val.text, value: val.text };
    if (isCellFormulaValue(val)) {
      if (val.result !== undefined) {
        if (isCellErrorValue(val.result)) return { type: 'error', text: val.result.error.toString(), value: val.result.error.toString() };
        if (val.result instanceof Date) return { type: 'formula', text: `𝑓: ${val.result.toISOString()}"`, value: val.result.toISOString() };
        return { type: 'formula', text: `𝑓: ${val.result}`, value: val.result.toString() };
      }
      return { type: 'formula', text: `=${val.formula}`, value: val.formula };
    }
    return { type: 'unknown', text: 'ERROR', value: 'ERROR' };
  }

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
      table.push({
        width: column.width ?? 8,
        letter: column.letter,
        values: Array<RenderedCell>(),
      });
      let count = 0;
      column.eachCell({ includeEmpty: true }, (cell: Cell) => {
        count += 1;
        if (count > 99) return;
        const height = (this.getRow(count)?.height ?? 15) * 2;
        table[i - 1].values.push(
          new RenderedCell(cell, height, FancyWorkbook.getCellSafeValue(cell).text),
        );
      });
    }
    this.renderedTable = table;
  }
}

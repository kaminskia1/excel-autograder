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
  Column, FillPattern,
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

  private getTextWidthCanvas?: HTMLCanvasElement;

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
    this.genRenderedTable();
  }

  getTableCellByAddress(address: ICellAddress): RenderedCell | undefined {
    if (this.activeSheet?.name !== address.sheetName) return undefined;
    return this.renderedTable[address.row - 1].values[address.col - 1] || undefined;
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

  getColumn(indexOrKey: number | string): Column | undefined {
    if (!this.activeSheet) return undefined;
    return this.activeSheet.getColumn(indexOrKey);
  }

  addColumns(n = 1) {
    if (!this.activeSheet) return;
    for (let i = 0; i < n; i += 1) this.activeSheet.columns = this.activeSheet.columns.concat([{}]);
  }

  addRows(n = 1) {
    if (!this.activeSheet) return;
    for (let i = 0; i < n; i += 1) this.activeSheet.addRow([]);
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
    return this.renderedTable.length;
  }

  getRenderedSheetWidth(): number {
    return this.renderedTable[0].values.length;
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
    const isCellFormulaValue = (c: unknown): c is CellFormulaValue => typeof c === 'object' && c !== null && ('formula' in c || 'sharedFormula' in c);

    if (cell.value === null) return { type: 'null', text: '', value: '' };
    if (typeof val === 'number') return { type: 'number', text: val.toString(), value: val.toString() };
    if (typeof val === 'string') return { type: 'string', text: val, value: val };
    if (typeof val === 'boolean') return { type: 'boolean', text: val.toString(), value: val.toString() };
    if (val instanceof Date) return { type: 'date', text: val.toString(), value: val.toISOString() };
    if (val === undefined) return { type: 'null', text: '', value: '' };
    if (isCellErrorValue(val)) return { type: 'error', text: val.error.toString(), value: val.error.toString() };
    if (isCellRichTextValue(val)) return { type: 'richText', text: val.richText.map((v) => v.text).join(''), value: val.richText.join('') };
    if (isCellHyperlinkValue(val)) return { type: 'text', text: val.text, value: val.text };
    if (isCellFormulaValue(val)) {
      if (val.result !== undefined) {
        if (isCellErrorValue(val.result)) return { type: 'error', text: val.result.error.toString(), value: val.result.error.toString() };
        if (val.result instanceof Date) return { type: 'formula', text: val.result.toString(), value: val.result.toISOString() };
        return { type: 'formula', text: `${val.result}`, value: val.result.toString() };
      }
      return { type: 'formula', text: '#N/A', value: val.formula };
    }
    return { type: 'unknown', text: 'ERROR', value: 'ERROR' };
  }

  // @TODO: Investigate 'selecting' overflowed cells vs. just deleting them entirely
  private genRenderedTable(): void {
    const table: RenderedTable = [];
    if (!this.activeSheet) {
      this.renderedTable = [];
      return;
    }
    // Capping max number of columns to prevent browser from hanging
    const cols: number = this.activeSheet.columnCount < 50 ? this.activeSheet.columnCount : 50;

    this.activeSheet.eachRow({ includeEmpty: true }, (row: Row) => {
      if (row.number > 99) return;
      table.push({
        height: (row.height > 15 ? row.height : 15) * 2,
        values: Array<RenderedCell>(),
      });
      for (let i = 1; i <= cols; i += 1) {
        const cell = row.getCell(i);
        const width = (this.getColumn(i)?.width ?? 8) * 7.5;
        table[table.length - 1].values.push(
          new RenderedCell(cell, FancyWorkbook.getCellSafeValue(
            cell,
          ).text, table[table.length - 1].height, width, width),
        );
      }
    });

    for (let r = 0; r < table.length; r += 1) {
      const row = table[r].values;
      for (let cellIdx = 0; cellIdx < row.length - 1; cellIdx += 1) {
        const cell = row[cellIdx];
        if (cell.safeValue.length > 0 && this.getTextWidth(cell.safeValue) > cell.displayWidth) {
          const baseWidth = this.getTextWidth(cell.safeValue);

          // identified overflow
          let next = cellIdx + 1;
          while (cell.displayWidth < baseWidth) {
            // if *next* cell is not empty, or it has a background, we are done here
            if (next === row.length || row[next].safeValue.length > 0) break;
            cell.displayWidth += row[next].displayWidth - 1;
            row[next].displayWidth = -1;
            next += 1;
          }
        }
      }
    }

    this.renderedTable = table;
  }

  private getTextWidth(text: string) {
    const canvas = this.getTextWidthCanvas || (this.getTextWidthCanvas = document.createElement('canvas'));
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;
    // default spreadsheet font
    ctx.font = '14px Roboto, sans-serif';
    return ctx.measureText(text).width + 30;
  }
}

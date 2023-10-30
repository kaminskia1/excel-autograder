import {
  Cell,
  CellErrorValue,
  CellFormulaValue,
  CellHyperlinkValue,
  CellRichTextValue,
  Workbook,
  Worksheet,
} from 'exceljs';
import { EventEmitter } from '@angular/core';
import { ICellAddress } from '../question/misc';
import { RenderedCell, RenderedTable } from './rendered-cell';

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
    this.refreshTable();
  }

  getTableCellByAddress(address: ICellAddress): RenderedCell | undefined {
    if (this.activeSheet?.name !== address.sheetName) return undefined;
    return this.renderedTable[address.col - 1].values[address.row - 1] || undefined;
  }

  getCell(address: ICellAddress): Cell | undefined {
    return this.getWorksheet(address.sheetName).findCell(address.row, address.col);
  }

  addColumn() {
    if (!this.activeSheet) return;
    this.activeSheet.columns = this.activeSheet.columns.concat([{}]);
    this.refreshTable();
  }

  addRow() {
    if (!this.activeSheet) return;
    this.activeSheet.addRow([]);
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

  isRenderedCellEmitterSubscribed(): boolean {
    return this.renderedCellEmitter.observed;
  }

  static getCellSafeValue(cell: Cell): {type: string, text: string} {
    const val = cell.value;
    if (cell.value === null) return { type: 'null', text: '' };
    if (typeof val === 'number') return { type: 'number', text: val.toString() };
    if (typeof val === 'string') return { type: 'string', text: val };
    if (typeof val === 'boolean') return { type: 'boolean', text: val.toString() };
    if (val instanceof Date) return { type: 'date', text: val.toISOString() };
    if (val === undefined) return { type: 'null', text: '' };
    if (Object.prototype.hasOwnProperty.call(val, 'error')) return { type: 'error', text: (val as CellErrorValue).error };
    if (Object.prototype.hasOwnProperty.call(val, 'richText')) return { type: 'richText', text: (val as CellRichTextValue).richText.join('') };
    if (Object.prototype.hasOwnProperty.call(val, 'text')) return { type: 'text', text: (val as CellHyperlinkValue).text };
    if (Object.prototype.hasOwnProperty.call(val, 'formula')) {
      const fv: CellFormulaValue = val as CellFormulaValue;
      if (fv.result !== undefined) {
        // @ts-ignore
        if (fv.result.error) return fv.result.error;
        if (fv.result instanceof Date) return { type: 'formula', text: `𝑓: ${fv.result.toISOString()}"` };
        return { type: 'formula', text: `𝑓: ${fv.result}` };
      }
      return { type: 'formula', text: `=${fv.formula}` };
    }
    return { type: 'unknown', text: 'ERROR' };
  }

  private refreshTable(): void {
    const table: RenderedTable = [];
    if (!this.activeSheet) {
      this.renderedTable = [];
      return;
    }
    for (let i = 1; i <= this.activeSheet.columns.length; i += 1) {
      const column = this.activeSheet.getColumn(i);
      if (column === null || column.eachCell === null
        || column.letter === null || column.values === null) {
        this.renderedTable = [];
        return;
      }
      table.push({ letter: column.letter, values: Array<RenderedCell>() });
      column.eachCell({ includeEmpty: true }, (cell: Cell) => {
        table[i - 1].values.push(
          new RenderedCell(cell, FancyWorkbook.getCellSafeValue(cell).text),
        );
      });
    }
    this.renderedTable = table;
  }
}

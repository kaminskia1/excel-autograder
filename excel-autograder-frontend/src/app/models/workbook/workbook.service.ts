import { Injectable } from '@angular/core';
import {
  CellFormulaValue,
  CellHyperlinkValue,
  CellRichTextValue,
  CellErrorValue,
  Worksheet,
  Workbook,
  Cell,
} from 'exceljs';
import {FancyWorkbook, RenderedCell, RenderedTable} from './workbook';
import { ICellAddress } from '../question/misc';

@Injectable({
  providedIn: 'root',
})
export class WorkbookService {
  activeWorkbook: Workbook|null = null;

  activeSheet: Worksheet|null = null;

  renderedTable: RenderedTable = [];

  loadWorkbook(file: Blob) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (e.target === null || e.target.result === null
        || !(e.target.result instanceof ArrayBuffer)) return;
      const arrayBuffer = e.target.result;
      const workbook = new Workbook();
      workbook.xlsx.load(arrayBuffer)
        .then(() => {
          this.activeWorkbook = workbook;
          this.setActiveSheet(this.getSheets()[0]);
        });
    };
    fileReader.readAsArrayBuffer(file);
    this.refreshTable();
  }

  getSheets(): Array<Worksheet> {
    if (this.activeWorkbook === null) return [];
    return this.activeWorkbook.worksheets;
  }

  setActiveSheet(sheet: Worksheet) {
    if (this.activeWorkbook === null) return;
    if (this.getSheets().indexOf(sheet) === -1) throw new Error('Sheet not found in workbook');
    this.activeSheet = sheet;
    this.refreshTable();
  }

  getActiveSheet(): Worksheet|null {
    return this.activeSheet;
  }

  refreshTable(): void {
    const table: RenderedTable = [];
    if (this.activeSheet === null) {
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

  getTableCellByAddress(address: ICellAddress): RenderedCell | undefined {
    if (this.activeSheet?.name !== address.sheetName) return undefined;
    return this.renderedTable[address.col - 1].values[address.row - 1] || undefined;
  }

  getCell(address: ICellAddress): Cell | undefined {
    if (!this.activeWorkbook) return undefined;
    return this.activeWorkbook.getWorksheet(address.sheetName).findCell(address.row, address.col);
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

  getSheetHeight(): number {
    if (this.activeSheet === null) return 0;
    return this.activeSheet.rowCount;
  }
}

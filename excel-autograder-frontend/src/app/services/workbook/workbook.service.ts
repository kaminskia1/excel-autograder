import { Injectable } from '@angular/core';
import {
  CellFormulaValue,
  CellHyperlinkValue,
  CellRichTextValue,
  CellErrorValue,
  Worksheet,
  Workbook,
  Cell
} from "exceljs";
import {RenderedCell, RenderedTable} from "./workbook";
import {CellAddress} from "../question/question";


@Injectable({
  providedIn: 'root'
})
export class WorkbookService {

  activeWorkbook: Workbook|null = null;
  activeSheet: Worksheet|null = null;
  renderedTable: RenderedTable = []

  loadWorkbook(file: Blob) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (e.target == null || e.target.result == null || !(e.target.result instanceof ArrayBuffer)) return
      const arrayBuffer = e.target.result;
      const workbook = new Workbook();
      workbook.xlsx.load(arrayBuffer)
        .then(() => {
          this.activeWorkbook = workbook;
          this.setActiveSheet(this.getSheets()[0])
        })
    };
    fileReader.readAsArrayBuffer(file);
    this.refreshTable()
  }

  getSheets(): Array<Worksheet> {
    if (this.activeWorkbook == null) return [];
      return this.activeWorkbook.worksheets;
  }

  setActiveSheet(sheet: Worksheet) {
    if (this.activeWorkbook == null) return;
    if (this.getSheets().indexOf(sheet) == -1) throw new Error("Sheet not found in workbook");
    this.activeSheet = sheet;
    this.refreshTable()
  }

  getActiveSheet(): Worksheet|null {
    return this.activeSheet;
  }

  refreshTable(): void {
    const table: RenderedTable = []
    if (this.activeSheet == null) {
      this.renderedTable = [];
      return
    }
    for (let i: number = 1; i <= this.activeSheet.columns.length; i++) {
      const column = this.activeSheet.getColumn(i)
      if (column == null || column.eachCell == null || column.letter == null || column.values == null) {
        this.renderedTable = [];
        return
      }
      table.push({letter: column.letter, values: Array<RenderedCell>()})
      column.eachCell({ includeEmpty: true }, (cell: Cell) => {

        table[i-1].values.push(new RenderedCell(cell, this.getCellSafeValue(cell).text))
      });
    }

    this.renderedTable = table;
  }

  getTableCell(row: number|string|Cell, col: number = -1): RenderedCell | undefined {
    if (this.activeSheet == null) return undefined
    if (typeof row == "string") return this.renderedTable.find((c) => c.letter == row)?.values[col-1] || undefined
    if (typeof row == "number") return this.renderedTable[col-1].values[row-1] || undefined
    return this.renderedTable[row.fullAddress.col-1].values[row.fullAddress.row-1] || undefined
  }

  getCell(address: CellAddress): Cell | undefined {
    if (!this.activeWorkbook) return undefined
    return this.activeWorkbook.getWorksheet(address.sheetName).findCell(address.row, address.col)
  }

  addColumn() {
    if (!this.activeSheet) return
    this.activeSheet.columns = this.activeSheet.columns.concat([{}])
    this.refreshTable()
  }

  addRow() {
    if (!this.activeSheet) return
    this.activeSheet.addRow([])
    this.refreshTable()
  }


  getSheetHeight(): number {
    if (this.activeSheet == null) return 0
    return this.activeSheet.rowCount
  }

  getCellSafeValue(cell: Cell): {type: string, text: string} {
    const val = cell.value
    if (cell.value == null) return {type: "null", text: ""}
    if (typeof val == "number") return {type: "number", text: val.toString()}
    if (typeof val == "string") return {type: "string", text: val}
    if (typeof val == "boolean") return {type: "boolean", text: val.toString()}
    if (val instanceof Date) return {type: "date", text: val.toISOString()}
    if (val == undefined) return {type: "null", text: ""}
    if (Object.prototype.hasOwnProperty.call(val, 'error')) return {type: "error", text: (val as CellErrorValue).error}
    if (Object.prototype.hasOwnProperty.call(val, 'richText')) return {type: "richText", text: (val as CellRichTextValue).richText.join("")}
    if (Object.prototype.hasOwnProperty.call(val, 'text')) return {type: "text", text: (val as CellHyperlinkValue).text}
    if (Object.prototype.hasOwnProperty.call(val, 'formula')) {
      const fv: CellFormulaValue = val as CellFormulaValue
      if (fv.result !== undefined) {
        // @ts-ignore
        if (fv.result.error) return fv.result.error;
        if (fv.result instanceof Date) return {type: "formula", text: `𝑓: ${fv.result.toISOString()}"`}
        return {type: "formula", text: `𝑓: ${fv.result}`}
      }
      return {type: "formula", text: "=" + fv.formula}
    }
    return {type: "unknown", text: "ERROR"}
  }
}

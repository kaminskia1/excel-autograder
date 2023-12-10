import { Injectable } from '@angular/core';
import { Worksheet, Cell, Row, Column } from 'exceljs';
import { FancyWorkbook } from './workbook';
import { ICellAddress } from '../question/misc';
import { WorkbookFactory } from './workbook.factory';
import { RenderedCell } from './rendered-cell';

@Injectable({
  providedIn: 'root',
})
export class WorkbookService {
  activeWorkbook: FancyWorkbook|null = null;

  constructor(public workbookFactory: WorkbookFactory) { }

  loadWorkbook(file: Blob) {
    this.workbookFactory.loadWorkbook(file).then((workbook) => {
      this.activeWorkbook = workbook;
      this.activeWorkbook.setActiveSheet(this.getSheets()[0]);
    });
  }

  getSheets(): Array<Worksheet> {
    if (!this.activeWorkbook) return [];
    return this.activeWorkbook.getSheets();
  }

  setActiveSheet(sheet: Worksheet): void {
    this.activeWorkbook?.setActiveSheet(sheet);
  }

  getActiveSheet(): Worksheet|undefined {
    return this.activeWorkbook?.getActiveSheet();
  }

  getTableCellByAddress(address: ICellAddress): RenderedCell | undefined {
    return this.activeWorkbook?.getTableCellByAddress(address);
  }

  getCell(address: ICellAddress): Cell | undefined {
    return this.activeWorkbook?.getCell(address);
  }

  emitRenderedCell(cell: RenderedCell) {
    this.activeWorkbook?.emitRenderedCell(cell);
  }

  isRenderedCellEmitterSubscribed(): boolean {
    return this.activeWorkbook?.isRenderedCellEmitterSubscribed() || false;
  }

  getRenderedCellEmitter() {
    return this.activeWorkbook?.getRenderedCellEmitter();
  }

  addColumns() {
    this.activeWorkbook?.addColumns();
  }

  addRows() {
    this.activeWorkbook?.addRows();
  }

  getSheetHeight(): number {
    if (this.activeWorkbook === null) return 0;
    return this.activeWorkbook.getSheetHeight();
  }

  getSheetWidth(): number {
    if (this.activeWorkbook === null) return 0;
    return this.activeWorkbook.getSheetWidth();
  }

  getRenderedSheetHeight(): number {
    if (this.activeWorkbook === null) return 0;
    return this.activeWorkbook.getRenderedSheetHeight();
  }

  getRenderedSheetWidth(): number {
    if (this.activeWorkbook === null) return 0;
    return this.activeWorkbook.getRenderedSheetWidth();
  }

  getRow(row: number): Row | undefined {
    return this.activeWorkbook?.getRow(row);
  }

  getColumn(indexOrKey: number | string): Column | undefined {
    return this.activeWorkbook?.getColumn(indexOrKey);
  }
}

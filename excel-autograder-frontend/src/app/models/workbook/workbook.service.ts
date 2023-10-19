import { Injectable } from '@angular/core';
import { Worksheet, Cell } from 'exceljs';
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

  addColumn() {
    this.activeWorkbook?.addColumn();
  }

  addRow() {
    this.activeWorkbook?.addRow();
  }

  getSheetHeight(): number {
    if (this.activeWorkbook === null) return 0;
    return this.activeWorkbook.getSheetHeight();
  }
}

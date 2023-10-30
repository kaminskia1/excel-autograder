import { Component, Input } from '@angular/core';
import { WorkbookService } from '../../workbook/workbook.service';
import { IFacet } from './facet';
import {Subscription} from "rxjs";
import {Cell} from "exceljs";

@Component({
  selector: 'app-facet',
  template: '',
})
export abstract class FacetComponent {
  @Input() facet!: IFacet;

  @Input() workbookService!: WorkbookService;

  selectCellSubscriber?: Subscription;

  grabCell() {
    const rCellEmitter = this.workbookService.getRenderedCellEmitter();
    if (!rCellEmitter) return;
    this.selectCellSubscriber = rCellEmitter.subscribe((cell) => {
      setTimeout(() => { // Hack to prevent mat-menu from triggering
        this.selectCellSubscriber?.unsubscribe();
      }, 2);
      if (!cell) return;
      this.facet.setTargetCell(cell.parent);
    });
  }

  highlightTableCell(cell: Cell|undefined) {
    if (!cell) return;
    const renderedCell = this.workbookService.getTableCellByAddress(cell.fullAddress);
    if (renderedCell) renderedCell.isHighlighted = true;
  }

  clearTableCell(cell: Cell|undefined) {
    if (!cell) return;
    const renderedCell = this.workbookService.getTableCellByAddress(cell.fullAddress);
    if (renderedCell) renderedCell.isHighlighted = false;
  }
}

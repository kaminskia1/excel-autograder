import { Component, Input } from '@angular/core';
import { Cell } from 'exceljs';
import { Subscription } from 'rxjs';
import { FacetComponent } from '../../facet.component';
import { ValueFacet } from './value.facet';
import { WorkbookService } from '../../../../workbook/workbook.service';

@Component({
  selector: 'app-value.facet',
  templateUrl: './value.facet.component.html',
  styleUrls: ['./value.facet.component.scss'],
})
export class ValueFacetComponent extends FacetComponent {
  @Input() facet!: ValueFacet;

  @Input() workbookService!: WorkbookService;

  selectCellSubscriber?: Subscription;

  enableSelectCell() {
    const rCellEmitter = this.workbookService.getRenderedCellEmitter();
    if (!rCellEmitter) return;
    this.selectCellSubscriber = rCellEmitter.subscribe((cell) => {
      this.disableSelectCell();
      if (!cell) return;
      this.facet.setTargetCell(cell.parent);
    });
  }

  disableSelectCell() {
    this.selectCellSubscriber?.unsubscribe();
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

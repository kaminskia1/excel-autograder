import { Component, Input } from '@angular/core';
import { Cell } from 'exceljs';
import { Subscription } from 'rxjs';
import { FacetComponent } from '../../facet.component';
import {ValueRangeFacet} from "./value-range.facet";

@Component({
  selector: 'app-value-range.facet',
  templateUrl: './value-range.facet.component.html',
  styleUrls: ['./value-range.facet.component.scss'],
})
export class ValueRangeFacetComponent extends FacetComponent {
  @Input() override facet!: ValueRangeFacet;
  selectCellSubscriber?: Subscription;

  grabCell() {
    const rCellEmitter = this.workbookService.getRenderedCellEmitter();
    if (!rCellEmitter) return;
    this.selectCellSubscriber = rCellEmitter.subscribe((cell) => {
      console.log(cell, cell?.parent.formula)
      this.selectCellSubscriber?.unsubscribe()
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

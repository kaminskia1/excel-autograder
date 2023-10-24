import { Component, Input } from '@angular/core';
import { Cell } from 'exceljs';
import { Subscription } from 'rxjs';
import { FacetComponent } from '../../facet.component';
import { FormulaContainsFacet } from './formula-contain.facet';

@Component({
  selector: 'app-formula-contains.facet',
  templateUrl: './formula-contains-facet.component.html',
  styleUrls: ['./formula-contains-facet.component.scss'],
})
export class FormulaContainsFacetComponent extends FacetComponent {
  @Input() override facet!: FormulaContainsFacet;

  selectCellSubscriber?: Subscription;

  grabCell() {
    const rCellEmitter = this.workbookService.getRenderedCellEmitter();
    if (!rCellEmitter) return;
    this.selectCellSubscriber = rCellEmitter.subscribe((cell) => {
      this.selectCellSubscriber?.unsubscribe();
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

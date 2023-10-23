import {Component, Input} from '@angular/core';
import {Subscription} from "rxjs";
import {Cell} from "exceljs";
import {FacetComponent} from "../../facet.component";
import {FormulaRegexFacet} from "./formula-regex.facet";

@Component({
  selector: 'app-formula-regex.facet',
  templateUrl: './formula-regex.facet.component.html',
  styleUrls: ['./formula-regex.facet.component.scss']
})
export class FormulaRegexFacetComponent extends FacetComponent {
  @Input() override facet!: FormulaRegexFacet;

  selectCellSubscriber?: Subscription;

  grabCell() {
    const rCellEmitter = this.workbookService.getRenderedCellEmitter();
    if (!rCellEmitter) return;
    this.selectCellSubscriber = rCellEmitter.subscribe((cell) => {
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

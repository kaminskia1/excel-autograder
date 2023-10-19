import {
  Component, Input, ViewChild, ElementRef,
} from '@angular/core';
import { WorkbookService } from '../../../models/workbook/workbook.service';
import { RenderedCell } from '../../../models/workbook/rendered-cell';

@Component({
  selector: 'app-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss'],
})
export class TableCellComponent {
  @ViewChild('cell', { static: true }) textElement!: ElementRef;

  @Input() renderedCell!: RenderedCell;

  @Input() hover!: boolean;

  constructor(public workbookService: WorkbookService) { }

  isOverflow() {
    return this.textElement.nativeElement.offsetWidth < this.textElement.nativeElement.scrollWidth;
  }
}

import {
  Component, Input, ViewChild, ElementRef,
} from '@angular/core';
import { RenderedCell } from '../../../models/workbook/workbook';

@Component({
  selector: 'app-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss'],
})
export class TableCellComponent {
  @ViewChild('cell', { static: true }) textElement!: ElementRef;

  @Input() renderedCell!: RenderedCell;

  @Input() hover!: boolean;

  isOverflow() {
    return this.textElement.nativeElement.offsetWidth < this.textElement.nativeElement.scrollWidth;
  }
}

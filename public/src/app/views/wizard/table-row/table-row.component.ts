import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { RenderedCell, RenderedRow } from '../../../models/workbook/rendered-cell';
import { WorkbookService } from '../../../models/workbook/workbook.service';
import { Question } from '../../../models/question/question';
import { Facet } from '../../../models/question/facet/facet';
import { FacetType } from '../../../models/question/facet/types/lib';
import {QuestionFlag} from "../../../models/question/misc";

@Component({
  selector: 'app-table-row',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.scss', '../wizard.component.scss'],
})
export class TableRowComponent {
  @Input() row!: RenderedRow;

  @Input() index!: number;

  @Input() activeQuestion!: Question | null;

  @Output() addFacetEmitter: EventEmitter<Facet> = new EventEmitter<Facet>();

  constructor(public workbookService: WorkbookService) { }

  getTooltip(rCell: RenderedCell): string {
    if (rCell.parent.value instanceof Date) {
      return rCell.parent.value.toISOString();
    }
    if (rCell.parent.formula) return `=${rCell.parent.formula}`;
    return '';
  }

  protected readonly FacetType = FacetType;
  protected readonly QuestionFlag = QuestionFlag;
}

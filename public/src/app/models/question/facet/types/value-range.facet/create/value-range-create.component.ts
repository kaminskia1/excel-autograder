import { Component, Input } from '@angular/core';
import { FacetComponent } from '../../../facet.component';
import { ValueRangeFacet } from '../value-range.facet';
import { QuestionFlag } from '../../../../misc';

@Component({
  selector: 'app-value-range.facet',
  templateUrl: './value-range-create.component.html',
  styleUrls: ['./value-range-create.component.scss'],
})
export class ValueRangeCreateComponent extends FacetComponent {
  @Input() override facet!: ValueRangeFacet;

  protected readonly QuestionFlag = QuestionFlag;
}

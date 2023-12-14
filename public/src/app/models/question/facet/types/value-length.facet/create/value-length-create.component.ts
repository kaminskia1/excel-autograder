import { Component, Input } from '@angular/core';
import { FacetComponent } from '../../../facet.component';
import { ValueLengthFacet } from '../value-length.facet';
import { QuestionFlag } from '../../../../misc';

@Component({
  selector: 'app-value.facet',
  templateUrl: './value-length-create.component.html',
  styleUrls: ['./value-length-create.component.scss'],
})
export class ValueLengthCreateComponent extends FacetComponent {
  @Input() override facet!: ValueLengthFacet;

  protected readonly QuestionFlag = QuestionFlag;
}

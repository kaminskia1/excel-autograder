import { Component, Input } from '@angular/core';
import { FacetComponent } from '../../../facet.component';
import { ValueFacet } from '../value.facet';
import { QuestionFlag } from '../../../../misc';

@Component({
  selector: 'app-value.facet',
  templateUrl: './value-create.component.html',
  styleUrls: ['./value-create.component.scss'],
})
export class ValueCreateComponent extends FacetComponent {
  @Input() override facet!: ValueFacet;

  protected readonly QuestionFlag = QuestionFlag;
}

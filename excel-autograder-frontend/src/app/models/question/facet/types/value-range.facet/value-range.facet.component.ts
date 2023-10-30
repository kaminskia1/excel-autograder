import { Component, Input } from '@angular/core';
import { FacetComponent } from '../../facet.component';
import { ValueRangeFacet } from './value-range.facet';

@Component({
  selector: 'app-value-range.facet',
  templateUrl: './value-range.facet.component.html',
  styleUrls: ['./value-range.facet.component.scss'],
})
export class ValueRangeFacetComponent extends FacetComponent {
  @Input() override facet!: ValueRangeFacet;
}

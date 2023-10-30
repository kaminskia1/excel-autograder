import { Component, Input } from '@angular/core';
import { FacetComponent } from '../../facet.component';
import { ValueFacet } from './value.facet';

@Component({
  selector: 'app-value.facet',
  templateUrl: './value.facet.component.html',
  styleUrls: ['./value.facet.component.scss'],
})
export class ValueFacetComponent extends FacetComponent {
  @Input() override facet!: ValueFacet;
}

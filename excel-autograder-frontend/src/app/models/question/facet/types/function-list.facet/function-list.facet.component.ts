import { Component, Input } from '@angular/core';
import { FacetComponent } from '../../facet.component';
import { FunctionListFacet } from './function-list.facet';

@Component({
  selector: 'app-function-list.facet',
  templateUrl: './function-list.facet.component.html',
  styleUrls: ['./function-list.facet.component.scss'],
})
export class FunctionListFacetComponent extends FacetComponent {
  @Input() override facet!: FunctionListFacet;
}

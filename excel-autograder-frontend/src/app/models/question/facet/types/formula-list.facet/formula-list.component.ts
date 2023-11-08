import { Component, Input } from '@angular/core';
import { FacetComponent } from '../../facet.component';
import { FormulaListFacet } from './formula-list.facet';

@Component({
  selector: 'app-formula-list.facet',
  templateUrl: './formula-list.component.html',
  styleUrls: ['./formula-list.component.scss'],
})
export class FormulaListComponent extends FacetComponent {
  @Input() override facet!: FormulaListFacet;
}

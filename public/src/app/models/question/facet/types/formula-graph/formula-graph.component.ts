import { Component, Input } from '@angular/core';
import { FormulaGraphFacet } from './formula-graph.facet';
import { FacetComponent } from '../../facet.component';

@Component({
  selector: 'app-formula-graph',
  templateUrl: './formula-graph.component.html',
  styleUrls: ['./formula-graph.component.scss'],
})
export class FormulaGraphComponent extends FacetComponent {
  @Input() override facet!: FormulaGraphFacet;
}

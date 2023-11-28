import { Component, Input } from '@angular/core';
import { FacetComponent } from '../../facet.component';
import { FormulaContainsFacet } from './formula-contain.facet';

@Component({
  selector: 'app-formula-contains.facet',
  templateUrl: './formula-contains-facet.component.html',
  styleUrls: ['./formula-contains-facet.component.scss'],
})
export class FormulaContainsFacetComponent extends FacetComponent {
  @Input() override facet!: FormulaContainsFacet;
}

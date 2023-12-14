import { Component, Input } from '@angular/core';
import { FacetComponent } from '../../../facet.component';
import { FormulaContainsFacet } from '../formula-contain.facet';
import { QuestionFlag } from '../../../../misc';

@Component({
  selector: 'app-formula-contains.facet',
  templateUrl: './formula-contains.create.component.html',
  styleUrls: ['./formula-contains.create.component.scss'],
})
export class FormulaContainsCreateComponent extends FacetComponent {
  @Input() override facet!: FormulaContainsFacet;

  protected readonly QuestionFlag = QuestionFlag;
}

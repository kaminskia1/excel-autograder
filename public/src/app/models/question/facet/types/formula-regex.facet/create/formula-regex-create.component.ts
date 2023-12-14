import { Component, Input } from '@angular/core';
import { FacetComponent } from '../../../facet.component';
import { FormulaRegexFacet } from '../formula-regex.facet';
import { QuestionFlag } from '../../../../misc';

@Component({
  selector: 'app-formula-regex.facet',
  templateUrl: './formula-regex-create.component.html',
  styleUrls: ['./formula-regex-create.component.scss'],
})
export class FormulaRegexCreateComponent extends FacetComponent {
  @Input() override facet!: FormulaRegexFacet;

  protected readonly QuestionFlag = QuestionFlag;
}

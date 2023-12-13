import { Component, Input } from '@angular/core';
import { FacetComponent } from '../../facet.component';
import { FormulaRegexFacet } from './formula-regex.facet';
import {QuestionFlag} from "../../../misc";

@Component({
  selector: 'app-formula-regex.facet',
  templateUrl: './formula-regex.facet.component.html',
  styleUrls: ['./formula-regex.facet.component.scss'],
})
export class FormulaRegexFacetComponent extends FacetComponent {
  @Input() override facet!: FormulaRegexFacet;
    protected readonly QuestionFlag = QuestionFlag;
}

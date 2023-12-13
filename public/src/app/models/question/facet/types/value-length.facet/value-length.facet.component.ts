import { Component, Input } from '@angular/core';
import { FacetComponent } from '../../facet.component';
import { ValueLengthFacet } from './value-length.facet';
import {QuestionFlag} from "../../../misc";

@Component({
  selector: 'app-value.facet',
  templateUrl: './value-length.facet.component.html',
  styleUrls: ['./value-length.facet.component.scss'],
})
export class ValueLengthFacetComponent extends FacetComponent {
  @Input() override facet!: ValueLengthFacet;
  protected readonly QuestionFlag = QuestionFlag;
}

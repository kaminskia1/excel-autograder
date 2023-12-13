import { ViewContainerRef } from '@angular/core';
import { FormulaGraphFacet } from './formula-graph/formula-graph.facet';
import { FormulaContainsFacet } from './formula-contains.facet/formula-contain.facet';
import { FormulaListFacet } from './formula-list.facet/formula-list.facet';
import { ValueFacet } from './value.facet/value.facet';
import { ValueRangeFacet } from './value-range.facet/value-range.facet';
import { Facet } from '../facet';
import {
  FormulaContainsFacetComponent,
} from './formula-contains.facet/formula-contains-facet.component';
import { FormulaListComponent } from './formula-list.facet/formula-list.component';
import { ValueFacetComponent } from './value.facet/value.facet.component';
import { ValueRangeFacetComponent } from './value-range.facet/value-range.facet.component';
import { FormulaGraphComponent } from './formula-graph/formula-graph.component';
import { FormulaRegexFacet } from './formula-regex.facet/formula-regex.facet';
import { FormulaRegexFacetComponent } from './formula-regex.facet/formula-regex.facet.component';
import {ValueLengthFacet} from "./value-length.facet/value-length.facet";
import {ValueLengthFacetComponent} from "./value-length.facet/value-length.facet.component";

export enum FacetType {
  FormulaGraphFacet = 'FormulaGraphFacet',
  FormulaContainsFacet = 'FormulaContainsFacet',
  FormulaRegexFacet = 'FormulaRegexFacet',
  FormulaListFacet = 'FormulaListFacet',
  ValueFacet = 'ValueFacet',
  ValueRangeFacet = 'ValueRangeFacet',
  ValueLengthFacet = 'ValueLengthFacet',
}

export class FacetLibrary {
  static types = {
    FormulaGraphFacet,
    FormulaContainsFacet,
    FormulaRegexFacet,
    FormulaListFacet,
    ValueFacet,
    ValueRangeFacet,
    ValueLengthFacet,
  };

  static getFacetComponent(facet: Facet, container: ViewContainerRef) {
    switch (facet.type) {
      case FacetType.FormulaGraphFacet:
        return container.createComponent(FormulaGraphComponent);
      case FacetType.FormulaContainsFacet:
        return container.createComponent(FormulaContainsFacetComponent);
      case FacetType.FormulaRegexFacet:
        return container.createComponent(FormulaRegexFacetComponent);
      case FacetType.FormulaListFacet:
        return container.createComponent(FormulaListComponent);
      case FacetType.ValueFacet:
        return container.createComponent(ValueFacetComponent);
      case FacetType.ValueRangeFacet:
        return container.createComponent(ValueRangeFacetComponent);
      case FacetType.ValueLengthFacet:
        return container.createComponent(ValueLengthFacetComponent);
      default:
        throw new Error(`Unknown facet type: ${facet.type}`);
    }
  }
}

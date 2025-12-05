import { ViewContainerRef } from '@angular/core';
import { FormulaContainsFacet } from './formula-contains.facet/formula-contain.facet';
import { FormulaListFacet } from './formula-list.facet/formula-list.facet';
import { ValueFacet } from './value.facet/value.facet';
import { ValueRangeFacet } from './value-range.facet/value-range.facet';
import { Facet } from '../facet';
import {
  FormulaContainsCreateComponent,
} from './formula-contains.facet/create/formula-contains-create.component';
import { FormulaListCreateComponent } from './formula-list.facet/create/formula-list-create.component';
import { ValueCreateComponent } from './value.facet/create/value-create.component';
import { ValueRangeCreateComponent } from './value-range.facet/create/value-range-create.component';
import { FormulaRegexFacet } from './formula-regex.facet/formula-regex.facet';
import { FormulaRegexCreateComponent } from './formula-regex.facet/create/formula-regex-create.component';
import { ValueLengthFacet } from './value-length.facet/value-length.facet';
import { ValueLengthCreateComponent } from './value-length.facet/create/value-length-create.component';
import { FacetType } from './facet-type.enum';

// Re-export FacetType for backwards compatibility
export { FacetType } from './facet-type.enum';

export class FacetLibrary {
  static types = {
    FormulaContainsFacet,
    FormulaRegexFacet,
    FormulaListFacet,
    ValueFacet,
    ValueRangeFacet,
    ValueLengthFacet,
  };

  static getFacetComponent(facet: Facet, container: ViewContainerRef) {
    switch (facet.type) {
      case FacetType.FormulaContainsFacet:
        return container.createComponent(FormulaContainsCreateComponent);
      case FacetType.FormulaRegexFacet:
        return container.createComponent(FormulaRegexCreateComponent);
      case FacetType.FormulaListFacet:
        return container.createComponent(FormulaListCreateComponent);
      case FacetType.ValueFacet:
        return container.createComponent(ValueCreateComponent);
      case FacetType.ValueRangeFacet:
        return container.createComponent(ValueRangeCreateComponent);
      case FacetType.ValueLengthFacet:
        return container.createComponent(ValueLengthCreateComponent);
      default:
        throw new Error(`Unknown facet type: ${facet.type}`);
    }
  }
}

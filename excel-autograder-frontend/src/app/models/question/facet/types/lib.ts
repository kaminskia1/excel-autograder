import {FunctionChainFacet} from "./function-chain.facet/function-chain.facet";
import {FormulaContainsFacet} from "./formula-contains.facet/formula-contain.facet";
import {FunctionListFacet} from "./function-list.facet/function-list.facet";
import {ValueFacet} from "./value.facet/value.facet";
import {ValueRangeFacet} from "./value-range.facet/value-range.facet";
import {Facet} from "../facet";
import {ViewContainerRef} from "@angular/core";
import {
  FormulaContainsFacetComponent
} from "./formula-contains.facet/formula-contains-facet.component";
import {FunctionListFacetComponent} from "./function-list.facet/function-list.facet.component";
import {ValueFacetComponent} from "./value.facet/value.facet.component";
import {ValueRangeFacetComponent} from "./value-range.facet/value-range.facet.component";
import {FunctionChainFacetComponent} from "./function-chain.facet/function-chain.facet.component";
import {FormulaRegexFacet} from "./formula-regex.facet/formula-regex.facet";
import {FormulaRegexFacetComponent} from "./formula-regex.facet/formula-regex.facet.component";


export enum FacetType {
  FunctionChainFacet = 'FunctionChainFacet',
  FormulaContainsFacet = 'FormulaContainsFacet',
  FormulaRegexFacet = 'FormulaRegexFacet',
  FunctionListFacet = 'FunctionListFacet',
  ValueFacet = 'ValueFacet',
  ValueRangeFacet = 'ValueRangeFacet'
}

export class FacetLibrary {
  static types = {
    FunctionChainFacet,
    FormulaContainsFacet,
    FormulaRegexFacet,
    FunctionListFacet,
    ValueFacet,
    ValueRangeFacet
  };

  static getFacetComponent(facet: Facet, container: ViewContainerRef)
  {
    switch (facet.type) {
      case FacetType.FunctionChainFacet:
        return container.createComponent(FunctionChainFacetComponent);
      case FacetType.FormulaContainsFacet:
        return container.createComponent(FormulaContainsFacetComponent);
      case FacetType.FormulaRegexFacet:
        return container.createComponent(FormulaRegexFacetComponent);
      case FacetType.FunctionListFacet:
        return container.createComponent(FunctionListFacetComponent);
      case FacetType.ValueFacet:
        return container.createComponent(ValueFacetComponent);
      case FacetType.ValueRangeFacet:
        return container.createComponent(ValueRangeFacetComponent);
      default:
        throw new Error(`Unknown facet type: ${facet.type}`);
    }
  }
}

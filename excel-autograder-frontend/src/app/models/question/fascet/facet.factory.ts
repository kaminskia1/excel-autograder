import { Injectable } from '@angular/core';
import { Facet, IFacetPartial } from './facet';
import { FunctionChainFacet } from './types/function-chain.facet';
import { FunctionListFacet } from './types/function-list.facet';
import { FunctionContainsFacet } from './types/function-contain.facet';
import { ValueFacet } from './types/value.facet';

@Injectable({
  providedIn: 'root',
})
export class FacetFactory {
  static types = {
    FunctionChainFacet,
    FunctionContainsFacet,
    FunctionListFacet,
    ValueFacet,
  };

  createFacet(facet: IFacetPartial): Facet {
    if (facet instanceof Facet) return facet;
    const Clazz = FacetFactory.types[facet.type];
    return new Clazz(facet);
  }
}

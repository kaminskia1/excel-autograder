import { Injectable } from '@angular/core';
import { Facet, IFacetPartial } from './facet';
import { FunctionChainFacet } from './types/function-chain.facet/function-chain.facet';
import { FunctionListFacet } from './types/function-list.facet/function-list.facet';
import { FormulaContainsFacet } from './types/formula-contains.facet/formula-contain.facet';
import { ValueFacet } from './types/value.facet/value.facet';
import { WorkbookService } from '../../workbook/workbook.service';
import {ValueRangeFacet} from "./types/value-range.facet/value-range.facet";
import {FacetLibrary} from "./types/lib";

@Injectable({
  providedIn: 'root',
})
export class FacetFactory {

  constructor(private workbookService: WorkbookService) {}

  createFacet(facet: IFacetPartial): Facet {
    if (facet instanceof Facet) return facet;
    const Clazz = FacetLibrary.types[facet.type]
    return new Clazz(facet, this.workbookService);
  }
}

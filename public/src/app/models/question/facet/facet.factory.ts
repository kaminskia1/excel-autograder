import { Injectable } from '@angular/core';
import { Facet, IFacetPartial } from './facet';
import { WorkbookService } from '../../workbook/workbook.service';
import { FacetLibrary } from './types/lib';

@Injectable({
  providedIn: 'root',
})
export class FacetFactory {
  constructor(private workbookService: WorkbookService) {}

  createFacet(facet: IFacetPartial): Facet {
    if (facet instanceof Facet) return facet;
    const Clazz = FacetLibrary.types[facet.type];
    return new Clazz(facet, this.workbookService);
  }
}

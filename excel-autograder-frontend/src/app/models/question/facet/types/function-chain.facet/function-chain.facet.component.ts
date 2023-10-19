import { Component, Input } from '@angular/core';
import { FunctionChainFacet } from './function-chain.facet';
import { WorkbookService } from '../../../../workbook/workbook.service';

@Component({
  selector: 'app-function-chain.facet',
  templateUrl: './function-chain.facet.component.html',
  styleUrls: ['./function-chain.facet.component.scss'],
})
export class FunctionChainFacetComponent {
  @Input() facet!: FunctionChainFacet;

  @Input() workbookService!: WorkbookService;
}

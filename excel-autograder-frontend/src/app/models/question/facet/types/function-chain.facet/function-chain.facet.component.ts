import { Component, Input } from '@angular/core';
import { FunctionChainFacet } from './function-chain.facet';
import { WorkbookService } from '../../../../workbook/workbook.service';
import { FacetComponent } from '../../facet.component';

@Component({
  selector: 'app-function-chain.facet',
  templateUrl: './function-chain.facet.component.html',
  styleUrls: ['./function-chain.facet.component.scss'],
})
export class FunctionChainFacetComponent extends FacetComponent {
  @Input() override facet!: FunctionChainFacet;
}

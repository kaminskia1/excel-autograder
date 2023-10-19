import { Component, Input } from '@angular/core';
import { FacetComponent } from '../../facet.component';
import { FunctionContainsFacet } from './function-contain.facet';
import { WorkbookService } from '../../../../workbook/workbook.service';

@Component({
  selector: 'app-function-contains.facet',
  templateUrl: './function-contains.facet.component.html',
  styleUrls: ['./function-contains.facet.component.scss'],
})
export class FunctionContainsFacetComponent extends FacetComponent {
  @Input() facet!: FunctionContainsFacet;

  @Input() workbookService!: WorkbookService;
}

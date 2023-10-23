import {Component, Input} from "@angular/core";
import {WorkbookService} from "../../workbook/workbook.service";
import {IFacet} from "./facet";

@Component({
  selector: 'app-facet',
  template: '',
})
export abstract class FacetComponent {
  @Input() facet!: IFacet;

  @Input() workbookService!: WorkbookService;
}

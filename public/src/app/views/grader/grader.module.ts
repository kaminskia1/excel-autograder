import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { WizardModule } from '../wizard/wizard.module';

import { GraderComponent } from './grader.component';
import { ExportDialogComponent } from './export/export-dialog.component';

@NgModule({
  declarations: [
    GraderComponent,
    ExportDialogComponent,
  ],
  imports: [
    SharedModule,
    WizardModule, // For FacetItemComponent used in grader
  ],
  exports: [
    GraderComponent,
  ],
})
export class GraderModule { }

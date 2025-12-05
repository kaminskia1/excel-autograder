import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { DashboardComponent } from './dashboard.component';
import { NewAssignmentDialogComponent } from './new-assignment-dialog/new-assignment-dialog.component';
import { EditAssignmentDialogComponent } from './edit-assignment-dialog/edit-assignment-dialog.component';
import { ExportAssignmentDialogComponent } from './export-assignment-dialog/export-assignment-dialog.component';
import { ImportAssignmentDialogComponent } from './import-assignment-dialog/import-assignment-dialog.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NewAssignmentDialogComponent,
    EditAssignmentDialogComponent,
    ExportAssignmentDialogComponent,
    ImportAssignmentDialogComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    DashboardComponent,
  ],
})
export class DashboardModule { }


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRippleModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Third-party
import { NgxFilesizeModule } from 'ngx-filesize';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

// Shared components
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { InfoDialogComponent } from '../components/info-dialog/info-dialog.component';
import { FileInputComponent } from '../components/file-input/file-input.component';
import { DropzoneDirective } from '../components/dropzone/dropzone.directive';
import { VerificationBannerComponent } from '../components/verification-banner/verification-banner.component';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatDialogModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatSelectModule,
  MatMenuModule,
  MatDividerModule,
  MatToolbarModule,
  MatCardModule,
  MatExpansionModule,
  MatListModule,
  MatTableModule,
  MatSidenavModule,
  MatGridListModule,
  MatRippleModule,
  MatAutocompleteModule,
  ClipboardModule,
  DragDropModule,
];

const SHARED_COMPONENTS = [
  ConfirmationDialogComponent,
  InfoDialogComponent,
  FileInputComponent,
  DropzoneDirective,
  VerificationBannerComponent,
];

@NgModule({
  declarations: [
    ...SHARED_COMPONENTS,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgxFilesizeModule,
    NgxMatSelectSearchModule,
    ...MATERIAL_MODULES,
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgxFilesizeModule,
    NgxMatSelectSearchModule,
    ...MATERIAL_MODULES,
    ...SHARED_COMPONENTS,
  ],
})
export class SharedModule { }

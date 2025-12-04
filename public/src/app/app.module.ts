import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRippleModule } from '@angular/material/core';
import { NgxFilesizeModule } from 'ngx-filesize';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { WizardComponent } from './views/wizard/wizard.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { AuthComponent } from './views/auth/auth.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { QuestionComponent } from './components/question/question.component';
import { GraderComponent } from './views/grader/grader.component';
import { NewAssignmentDialogComponent } from './views/dashboard/new-assignment-dialog/new-assignment-dialog.component';
import { ValueCreateComponent } from './models/question/facet/types/value.facet/create/value-create.component';
import { FormulaContainsCreateComponent } from './models/question/facet/types/formula-contains.facet/create/formula-contains-create.component';
import { FormulaListCreateComponent } from './models/question/facet/types/formula-list.facet/create/formula-list-create.component';
import { ValueRangeCreateComponent } from './models/question/facet/types/value-range.facet/create/value-range-create.component';
import { ValueLengthCreateComponent } from './models/question/facet/types/value-length.facet/create/value-length-create.component';
import { HeaderComponent } from './models/question/facet/header/header/header.component';
import { FormulaRegexCreateComponent } from './models/question/facet/types/formula-regex.facet/create/formula-regex-create.component';
import { DropzoneDirective } from './components/dropzone/dropzone.directive';
import { ExportAssignmentDialogComponent } from './views/dashboard/export-assignment-dialog/export-assignment-dialog.component';
import { EditAssignmentDialogComponent } from './views/dashboard/edit-assignment-dialog/edit-assignment-dialog.component';
import { ImportAssignmentDialogComponent } from './views/dashboard/import-assignment-dialog/import-assignment-dialog.component';
import { ResetComponent } from './views/auth/reset/reset.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { TableRowComponent } from './views/wizard/table-row/table-row.component';
import { FormulaContainsReviewComponent } from './models/question/facet/types/formula-contains.facet/review/formula-contains-review.component';
import { FormulaListReviewComponent } from './models/question/facet/types/formula-list.facet/review/formula-list-review.component';
import { FormulaRegexReviewComponent } from './models/question/facet/types/formula-regex.facet/review/formula-regex-review.component';
import { ValueLengthReviewComponent } from './models/question/facet/types/value-length.facet/review/value-length-review.component';
import { ValueRangeReviewComponent } from './models/question/facet/types/value-range.facet/review/value-range-review.component';
import { ValueReviewComponent } from './models/question/facet/types/value.facet/review/value-review.component';
import { InfoDialogComponent } from './components/info-dialog/info-dialog.component';
import { ExportDialogComponent } from './views/grader/export/export-dialog.component';
import { FacetItemComponent } from './components/facet-item/facet-item.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    WizardComponent,
    PageNotFoundComponent,
    AuthComponent,
    RegisterComponent,
    QuestionComponent,
    GraderComponent,
    NewAssignmentDialogComponent,
    ValueCreateComponent,
    FormulaContainsCreateComponent,
    FormulaListCreateComponent,
    ValueRangeCreateComponent,
    ValueLengthCreateComponent,
    HeaderComponent,
    FormulaRegexCreateComponent,
    DropzoneDirective,
    ExportAssignmentDialogComponent,
    EditAssignmentDialogComponent,
    ImportAssignmentDialogComponent,
    ResetComponent,
    ConfirmationDialogComponent,
    TableRowComponent,
    FormulaContainsReviewComponent,
    FormulaContainsReviewComponent,
    FormulaListReviewComponent,
    FormulaRegexReviewComponent,
    ValueLengthReviewComponent,
    ValueRangeReviewComponent,
    ValueReviewComponent,
    InfoDialogComponent,
    ExportDialogComponent,
    FacetItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatGridListModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatRippleModule,
    NgxFilesizeModule,
    MatCardModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    ClipboardModule,
    DragDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

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
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRippleModule } from '@angular/material/core';
import { NgxFilesizeModule } from 'ngx-filesize';
import { MatCardModule } from '@angular/material/card';
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
import { TableCellComponent } from './views/wizard/table-cell/table-cell.component';
import { ValueFacetComponent } from './models/question/facet/types/value.facet/value.facet.component';
import { FormulaGraphComponent } from './models/question/facet/types/formula-graph/formula-graph.component';
import { FormulaContainsFacetComponent } from './models/question/facet/types/formula-contains.facet/formula-contains-facet.component';
import { FormulaListComponent } from './models/question/facet/types/formula-list.facet/formula-list.component';
import { ValueRangeFacetComponent } from './models/question/facet/types/value-range.facet/value-range.facet.component';
import { HeaderComponent } from './models/question/facet/header/header/header.component';
import { FormulaRegexFacetComponent } from './models/question/facet/types/formula-regex.facet/formula-regex.facet.component';
import { DropzoneDirective } from './components/dropzone/dropzone.directive';

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
    TableCellComponent,
    ValueFacetComponent,
    FormulaGraphComponent,
    FormulaContainsFacetComponent,
    FormulaListComponent,
    ValueRangeFacetComponent,
    HeaderComponent,
    FormulaRegexFacetComponent,
    DropzoneDirective,
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
    NgxMatFileInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatRippleModule,
    NgxFilesizeModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

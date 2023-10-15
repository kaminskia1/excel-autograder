import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from '@angular/forms';

import { MatMenuModule } from "@angular/material/menu";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDividerModule } from "@angular/material/divider";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgxMatFileInputModule } from "@angular-material-components/file-input";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent} from "./views/auth/login/login.component";
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { WizardComponent } from './views/wizard/wizard.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { AuthComponent} from "./views/auth/auth.component";
import { RegisterComponent} from "./views/auth/register/register.component";
import { MatListModule } from "@angular/material/list";
import { QuestionComponent } from './components/question/question.component';
import { GraderComponent } from './views/grader/grader.component';
import { NewAssignmentDialogComponent } from './views/dashboard/new-assignment-dialog/new-assignment-dialog.component';
import { TableCellComponent } from './views/wizard/table-cell/table-cell.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    WizardComponent,
    PageNotFoundComponent,
    AuthComponent,
    RegisterComponent,
    QuestionComponent,
    GraderComponent,
    NewAssignmentDialogComponent,
    TableCellComponent
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
    NgxMatFileInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

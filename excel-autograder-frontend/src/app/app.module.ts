import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from "@angular/common/http";
import { NgIf } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from "@angular/forms";

import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { WizardComponent } from './views/wizard/wizard.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { MatTableModule} from "@angular/material/table";
import { MatInputModule} from "@angular/material/input";
import { MatButtonModule} from "@angular/material/button";
import { MatToolbarModule} from "@angular/material/toolbar";
import { MatIconModule} from "@angular/material/icon";
import { AuthComponent } from './auth/auth.component';
import { RegisterComponent } from './auth/register/register.component';
import { MatDividerModule } from "@angular/material/divider";
import { MatMenuModule } from "@angular/material/menu";

@NgModule({
  declarations: [
    App,
    LoginComponent,
    DashboardComponent,
    WizardComponent,
    PageNotFoundComponent,
    AuthComponent,
    RegisterComponent
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
    MatIconModule,
    NgIf,
    MatDividerModule,
    MatMenuModule,
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';

// Core module (interceptors, singleton services)
import { CoreModule } from './core/core.module';

// Feature modules
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './views/auth/auth.module';
import { DashboardModule } from './views/dashboard/dashboard.module';
import { WizardModule } from './views/wizard/wizard.module';
import { GraderModule } from './views/grader/grader.module';
import { ProfileModule } from './views/profile/profile.module';
import { VerifyEmailModule } from './views/verify-email/verify-email.module';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
  ],
  imports: [
    // Angular core
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    
    // App core & routing
    CoreModule,
    AppRoutingModule,
    
    // Shared module
    SharedModule,
    
    // Feature modules
    AuthModule,
    DashboardModule,
    WizardModule,
    GraderModule,
    ProfileModule,
    VerifyEmailModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

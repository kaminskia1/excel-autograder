import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { WizardComponent } from './views/wizard/wizard.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AuthComponent } from './views/auth/auth.component';
import { GraderComponent } from './views/grader/grader.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'login',
    component: AuthComponent,
  },
  {
    path: 'wizard/:id',
    component: WizardComponent,
  },
  {
    path: 'grader/:id',
    component: GraderComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

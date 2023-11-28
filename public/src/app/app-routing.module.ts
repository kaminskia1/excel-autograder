import { inject, NgModule } from '@angular/core';
import {
  CanActivateFn, Router,
  RouterModule,
  Routes,
} from '@angular/router';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { WizardComponent } from './views/wizard/wizard.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AuthComponent } from './views/auth/auth.component';
import { GraderComponent } from './views/grader/grader.component';
import { UserService } from './models/user/user.service';

const userLoggedIn: CanActivateFn = () => {
  const router = inject(Router);
  if (inject(UserService).isLoggedIn()) return true;
  router.navigate(['/login']);
  return false;
};
const userNotPresent: CanActivateFn = () => {
  const router = inject(Router);
  if (!inject(UserService).isLoggedIn()) return true;
  router.navigate(['/']);
  return false;
};

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [userLoggedIn],
  },
  {
    path: 'login',
    component: AuthComponent,
    canActivate: [userNotPresent],
  },
  {
    path: 'wizard/:id',
    component: WizardComponent,
    canActivate: [userLoggedIn],
  },
  {
    path: 'grader/:id',
    component: GraderComponent,
    canActivate: [userLoggedIn],
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

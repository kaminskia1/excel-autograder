import { inject, NgModule } from '@angular/core';
import {
  CanActivateFn, Router,
  RouterModule,
  Routes,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { WizardComponent } from './views/wizard/wizard.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AuthComponent } from './views/auth/auth.component';
import { GraderComponent } from './views/grader/grader.component';
import { ProfileComponent } from './views/profile/profile.component';
import { UserService } from './models/user/user.service';

// Wait for session restoration before checking auth state
const userLoggedIn: CanActivateFn = () => {
  const router = inject(Router);
  const userService = inject(UserService);
  
  return userService.waitForSessionRestore().pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) return true;
      router.navigate(['/login']);
      return false;
    }),
  );
};

const userNotPresent: CanActivateFn = () => {
  const router = inject(Router);
  const userService = inject(UserService);
  
  return userService.waitForSessionRestore().pipe(
    map((isLoggedIn) => {
      if (!isLoggedIn) return true;
      router.navigate(['/']);
      return false;
    }),
  );
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
    path: 'profile',
    component: ProfileComponent,
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

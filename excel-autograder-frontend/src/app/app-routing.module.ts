import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from "./views/page-not-found/page-not-found.component";
import { WizardComponent } from "./views/wizard/wizard.component";
import { DashboardComponent } from "./views/dashboard/dashboard.component";
import { AuthComponent } from "./auth/auth.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent
  },
  {
    path: "login",
    component: AuthComponent
  },
  {
    path: "wizard/:id",
    component: WizardComponent
  },
  {
    path: "**",
    component: PageNotFoundComponent
  }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

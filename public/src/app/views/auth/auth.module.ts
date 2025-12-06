import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { AuthComponent } from './auth.component';
import { RegisterComponent } from './register/register.component';
import { ResetComponent } from './reset/reset.component';

@NgModule({
  declarations: [
    AuthComponent,
    RegisterComponent,
    ResetComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    AuthComponent,
  ],
})
export class AuthModule { }

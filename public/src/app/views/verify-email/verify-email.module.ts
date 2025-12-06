import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { VerifyEmailComponent } from './verify-email.component';

@NgModule({
  declarations: [
    VerifyEmailComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    VerifyEmailComponent,
  ],
})
export class VerifyEmailModule { }


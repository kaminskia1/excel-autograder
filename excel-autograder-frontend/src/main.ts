import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

export const API_URL = 'http://localhost:8000/api/v1/';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err) => console.error(err));

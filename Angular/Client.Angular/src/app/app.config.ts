import { APP_INITIALIZER, ApplicationConfig, inject, PLATFORM_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { lastValueFrom } from 'rxjs';
import { InitService } from '../core/core/services/init.service';
import { errorInterceptor } from '../core/interceptor/error.interceptor';
import { loadingInterceptor } from '../core/interceptor/loading.interceptor';
import { routes } from './app.routes';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { authInterceptor } from '../core/interceptor/auth.interceptor';

function initializeApp(initService: InitService) {
  const document: Document = inject(DOCUMENT)
  const platformId: any = inject(PLATFORM_ID);

  return () => {
    if (isPlatformBrowser(platformId)) {
      lastValueFrom(initService.init()).finally(() => {
        const splash = document.getElementById('initial-splash');
        if (splash) {
          splash.remove();
        }
      })
    }
  }
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  provideAnimationsAsync(),
  provideHttpClient(withInterceptors([errorInterceptor, loadingInterceptor, authInterceptor])),
  provideHttpClient(withFetch()),
  {
    provide: APP_INITIALIZER,
    useFactory: initializeApp,
    multi: true,
    deps: [InitService, DOCUMENT, PLATFORM_ID]
  }, provideAnimationsAsync(),
  ]
};

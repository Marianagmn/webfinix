import { ApplicationConfig, provideAppInitializer } from '@angular/core';
import {
  provideRouter,
  withViewTransitions,
} from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { sessionInitializer } from './core/auth/session-initializer';
import { GlobalLoadingComponent } from './core/loading/global-loading.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    // PHASE 2 FIX: Bootstrap auth - restore session on app startup
    provideAppInitializer(sessionInitializer),
    // PHASE 3 FIX: Global loading component
    GlobalLoadingComponent,
  ],
};

import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withXhr } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Hace que la pantalla se actualice sola cuando llegan datos de la API.
    provideZoneChangeDetection(),
    provideRouter(routes),
    // withXhr: las respuestas de la API llegan "dentro" de Angular y la pantalla se redibuja sola.
    provideHttpClient(withXhr()),
  ]
};

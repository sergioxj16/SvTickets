import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { baseUrlInterceptor } from './app/shared/interceptors/base-url.interceptor';
import { authInterceptor } from './app/shared/interceptors/auth.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

bootstrapApplication(AppComponent, {
    providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor])),
        provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding(), withRouterConfig({paramsInheritanceStrategy: 'always'})),
    ],
}).then(() => defineCustomElements(window)); 

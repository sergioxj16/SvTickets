import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        loadChildren: () =>
            import('./auth/auth.routes').then((m) => m.authRoutes),
    },
  {
    path: 'event-card',
    loadComponent: () => import('./events/event-card/event-card.page').then( m => m.EventCardPage)
  },
  {
    path: 'event-detail',
    loadComponent: () => import('./events/event-detail/event-detail.page').then( m => m.EventDetailPage)
  },
  {
    path: 'event-page',
    loadComponent: () => import('./events/event-page/event-page.page').then( m => m.EventPagePage)
  },
];

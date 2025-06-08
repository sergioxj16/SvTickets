import { Routes } from '@angular/router';
import { leavePageGuard } from '../shared/guards/leave-page.guard';
import { numericIdGuard } from '../shared/guards/numeric-id.guard';
import { eventResolver } from './resolvers/event.resolver';


export const eventsRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./event-page/event-page.page').then((m) => m.EventPagePage),
        title: 'Events | SVTickets',
    },
    {
        path: 'add',
        canDeactivate: [leavePageGuard],
        loadComponent: () =>
            import('./event-form/event-form.page').then((m) => m.EventFormPage),
        title: 'New Event | SVtickets',
    },
    {
        path: ':id/edit',
        canActivate: [numericIdGuard],
        resolve: {
            event: eventResolver,
        },
        loadComponent: () =>
            import('./event-form/event-form.page').then(
                (m) => m.EventFormPage
            ),
    },
];

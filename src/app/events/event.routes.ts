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
    }
];

import { ResolveFn, Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { MyEvent } from '../../interfaces/myevent';

export const eventResolver: ResolveFn<MyEvent> = (route) => {
  const eventService = inject(EventService);
  const router = inject(Router);
  return eventService.getEvent(+route.params['id']).pipe(
    catchError(() => {
      router.navigate(['/events']);
      return EMPTY;
    })
  );
};

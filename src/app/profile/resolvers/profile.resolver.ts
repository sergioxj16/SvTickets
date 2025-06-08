import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { ProfileService } from '../services/profile.service';
import { User } from '../../interfaces/user';


export const profileResolver: ResolveFn<User> = (route) => {
    const profileService = inject(ProfileService);
    const router = inject(Router);

    return profileService.getProfile(+route.params['id']).pipe(
        catchError(() => {
            router.navigate(['/events']);
            return EMPTY;
        })
    );
};


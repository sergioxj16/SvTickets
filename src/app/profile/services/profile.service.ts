import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import {
    User,
    UserPasswordEdit,
    UserPhotoEdit,
    UserProfileEdit,
} from '../../interfaces/user';
import { UserResponse } from '../../interfaces/responses';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    #http = inject(HttpClient);

    private _user = signal<User | null>(null);
    user = this._user.asReadonly();

    getProfile(id?: number): Observable<User> {
        let request$: Observable<User>;
        if (id) {
            request$ = this.#http
                .get<UserResponse>(`users/${id}`)
                .pipe(map((resp) => resp.user));
        } else {
            request$ = this.#http
                .get<UserResponse>(`users/me`)
                .pipe(map((resp) => resp.user));
        }
        return request$.pipe(
            tap(user => {
                if (!id) {
                    this._user.set(user);
                }
            })
        );
    }


    updateProfile(userData: UserProfileEdit): Observable<void> {
        return this.#http.put<void>(`users/me`, userData).pipe(
            tap(() => {
                const current = this._user();
                if (current) {
                    this._user.set({ ...current, ...userData });
                }
            })
        );
    }

    updateProfileAvatar(userAvatar: UserPhotoEdit): Observable<void> {
        return this.#http.put<void>(`users/me/photo`, userAvatar).pipe(
            tap(() => {
                const current = this._user();
                if (current) {
                    this._user.set({ ...current, avatar: userAvatar.avatar });
                }
            })
        );
    }

    updateUserPassword(userPassword: UserPasswordEdit): Observable<void> {
        return this.#http.put<void>(`users/me/password`, userPassword);
    }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import {
    CommentsResponse,
    EventsResponse,
    SingleCommentResponse,
    SingleEventResponse,
    UserResponse,
} from '../../interfaces/responses';
import { MyEvent, MyEventInsert } from '../../interfaces/myevent';

@Injectable({
    providedIn: 'root',
})
export class EventService {
    #http = inject(HttpClient);
    #eventsUrl = 'events/';

    getEvents(urlParams: URLSearchParams): Observable<EventsResponse> {
        return this.#http
            .get<EventsResponse>(`${this.#eventsUrl}?${urlParams.toString()}`)
            .pipe(map((resp) => resp));
    }

    getEvent(id: number): Observable<MyEvent> {
        return this.#http
            .get<SingleEventResponse>(`${this.#eventsUrl}${id}`)
            .pipe(map((resp) => resp.event));
    }

    addEvent(event: MyEventInsert): Observable<MyEvent> {
        return this.#http
            .post<SingleEventResponse>(`${this.#eventsUrl}`, event)
            .pipe(map((resp) => resp.event));
    }

    updateEvent(event: MyEventInsert, id: number): Observable<MyEvent> {
        return this.#http.put<SingleEventResponse>(`${this.#eventsUrl}/${id}`, event)
            .pipe(map((resp) => resp.event));
    }

    deleteEvent(id: number): Observable<void> {
        return this.#http.delete<void>(`${this.#eventsUrl}${id}`);
    }

    getAttendees(id: number): Observable<{ users: User[] }> {
        return this.#http.get<{ users: User[] }>(`events/${id}/attend`);
    }

    getComments(id: number): Observable<CommentsResponse> {
        return this.#http.get<CommentsResponse>(`${this.#eventsUrl}${id}/comments`);
    }

    postComment(id: number, message: string): Observable<SingleCommentResponse> {
        return this.#http.post<SingleCommentResponse>(`${this.#eventsUrl}${id}/comments`, {
            comment: message,
        });
    }

    postAttend(id: number): Observable<void> {
        return this.#http.post<void>(`${this.#eventsUrl}${id}/attend`, {});
    }

    deleteAttend(id: number): Observable<void> {
        return this.#http.delete<void>(`${this.#eventsUrl}${id}/attend`);
    }
}

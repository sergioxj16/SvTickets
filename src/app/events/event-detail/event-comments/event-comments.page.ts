import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton,
    IonList, IonItem, IonLabel, IonAvatar, IonText
} from '@ionic/angular/standalone';
import { EventService } from '../../services/event.service';
import { EventDetailPage } from '../event-detail.page';
import { SingleCommentResponse } from 'src/app/interfaces/responses';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-event-comments',
    templateUrl: './event-comments.page.html',
    styleUrls: ['./event-comments.page.scss'],
    standalone: true,
    imports: [
        IonText, IonAvatar, IonLabel, IonItem, IonList, IonButton, IonContent,
        IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink, ReactiveFormsModule
    ]
})
export class EventCommentsPage {
    event = inject(EventDetailPage).event;
    #eventService = inject(EventService);
    #destroyRef = inject(DestroyRef);
    #fb = inject(NonNullableFormBuilder);

    comments = signal<SingleCommentResponse[]>([]);
    commentForm = this.#fb.group({
        message: ['', Validators.required],
    });

    constructor() {
        effect(() => {
            const eventId = this.event()?.id;
            if (!eventId) {
                this.comments.set([]);
                return;
            }
            this.#eventService.getComments(eventId)
                .pipe(takeUntilDestroyed(this.#destroyRef))
                .subscribe(result => this.comments.set(result.comments));
        });
    }

    postComment(event: Event): void {
        if (this.commentForm.invalid) return;

        const message = this.commentForm.getRawValue().message.trim();
        if (!message) return;

        const eventId = this.event()?.id;
        if (!eventId) return;

        this.#eventService.postComment(eventId, message)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(response => {
                this.comments.update(comments => [...comments, response]);
                this.commentForm.reset();
            });
    }
}

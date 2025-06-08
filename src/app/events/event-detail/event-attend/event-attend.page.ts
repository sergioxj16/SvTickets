import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonText, IonGrid, IonRow, IonCol, IonButton, IonNote, IonAvatar } from '@ionic/angular/standalone';
import { User } from 'src/app/interfaces/user';
import { EventService } from '../../services/event.service';
import { EventDetailPage } from '../event-detail.page';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-event-attend',
    templateUrl: './event-attend.page.html',
    styleUrls: ['./event-attend.page.scss'],
    standalone: true,
    imports: [IonAvatar, IonNote, IonButton, IonCol, IonRow, IonGrid, IonText, IonLabel, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule]
})
export class EventAttendPage {

    event = inject(EventDetailPage).event;
    attendees = signal<User[]>([]);
    isAttending = signal<boolean>(this.event()!.attend);

    #eventService = inject(EventService);
    #destroyRef = inject(DestroyRef);

    constructor() {
        this.loadAttendees();
    }

    loadAttendees() {
        this.#eventService.getAttendees(this.event()!.id)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(({ users }) => {
                this.attendees.set(users);
            });
    }

    confirmAttendance() {
        this.#eventService.postAttend(this.event()!.id)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(async () => {
                await this.isAttending.set(true);
                await this.loadAttendees();
            });
    }

    cancelAttendance() {
        this.#eventService.deleteAttend(this.event()!.id)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(async () => {
                await this.isAttending.set(false);
                await this.loadAttendees();
            });
    }
}

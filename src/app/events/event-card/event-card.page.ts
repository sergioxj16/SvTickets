import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EventService } from '../services/event.service';
import { RouterLink } from '@angular/router';
import { MyEvent } from '../../interfaces/myevent';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IonGrid, IonRow, IonCol, IonButton, IonIcon, IonCardHeader, IonCard, IonCardContent, IonCardTitle } from '@ionic/angular/standalone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { pricePipe } from "../../shared/pipes/price.pipe";
import { DistancePipe } from "../../shared/pipes/distance.pipe";


@Component({
	selector: 'app-event-card',
	templateUrl: './event-card.page.html',
	styleUrls: ['./event-card.page.scss'],
	standalone: true,
	imports: [DatePipe,
    RouterLink,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonCard,
    FormsModule,
    RouterLink,
    IonCard,
    IonCardContent,
    IonCardTitle,
    CommonModule,
    IonCardHeader,
    ReactiveFormsModule, DistancePipe, pricePipe]
})
export class EventCardPage {

	#eventService = inject(EventService);
	#destroyRef = inject(DestroyRef);

	event = input.required<MyEvent>();
	deleted = output<number>();
	attend = output<void>();

	ToggleAttendEvent() {
		if (this.event().attend) {
			this.#eventService.deleteAttend(this.event().id!).pipe().subscribe(() => this.attend.emit());
			this.event().attend = false;
			this.event().numAttend--;

		} else {
			this.#eventService.postAttend(this.event().id!).pipe().subscribe(() => this.attend.emit());
			this.event().attend = true;
			this.event().numAttend++;
		}
	}

	deleteEvent() {
		this.#eventService
			.deleteEvent(this.event().id!).pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe(() => this.deleted.emit(this.event().id!));
	}
}

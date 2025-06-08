import { Component, DestroyRef, effect, inject, input, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton, IonRefresher, IonFab,
    IonRow, IonCol, IonSearchbar, IonInfiniteScroll, IonRefresherContent, IonGrid, IonInfiniteScrollContent, IonFabButton
} from '@ionic/angular/standalone';
import { MyEvent } from '../../interfaces/myevent';
import { EventService } from '../services/event.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { RouterLink } from '@angular/router';
import { EventCardPage } from '../event-card/event-card.page';
import { AlertController } from '@ionic/angular';
import { add, addCircleSharp, calendarOutline, cashOutline, closeSharp, locationOutline, optionsSharp, searchSharp } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
    selector: 'app-event-page',
    templateUrl: './event-page.page.html',
    styleUrls: ['./event-page.page.scss'],
    standalone: true,
    imports: [
        IonFabButton, IonInfiniteScrollContent, IonGrid, IonRefresherContent, IonRefresher, IonButton,
        IonButtons, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonInfiniteScroll,
        CommonModule, FormsModule, ReactiveFormsModule, RouterLink, EventCardPage, IonRow, IonCol, IonFab
    ]
})
export class EventPagePage {
    #destroyRef = inject(DestroyRef);
    #eventService = inject(EventService);
    #alertController = inject(AlertController);

    private refresher = viewChild(IonRefresher);
    private infiniteScroll = viewChild(IonInfiniteScroll);

    events = signal<MyEvent[]>([]);
    eventsLeft = signal<boolean>(false);
    currentPage = signal<number>(1);
    order = signal<"distance" | "date" | "price">("distance");
    creator = input<number>();
    attending = input<number>();

    searchVisible = signal<boolean>(false);
    searchControl = new FormControl<string>('');

    search = toSignal(
        this.searchControl.valueChanges.pipe(
            debounceTime(600),
            distinctUntilChanged(),
            takeUntilDestroyed(this.#destroyRef)
        ),
        { initialValue: '' }
    );

    constructor() {
        addIcons({ add, addCircleSharp, optionsSharp, calendarOutline, cashOutline, locationOutline, closeSharp, searchSharp });

        effect(() => {
            const order = this.order();
            const search = this.search() ?? '';
            this.currentPage.set(1);
            this.loadEvents(1, order, search, true);
        });
    }

    loadEvents(page: number, order: string, search: string, reset: boolean) {
        const params: any = { order, search, page };

        if (this.creator) params.creator = this.creator;
        if (this.attending) params.attending = this.attending;

        this.#eventService.getEvents
            (page, this.search() ?? '', this.order(), this.creator(), this.attending())
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((res) => {
                if (this.currentPage() === 1) {
                    this.events.set(res.events);
                } else {
                    this.events.update((events) => [...events, ...res.events]);
                }
                this.eventsLeft.set(res.more);
                this.refresher()?.complete();
                this.infiniteScroll()?.complete();
            });
    }

    orderBy(value: "distance" | "date" | "price") {
        this.order.set(value);
    }

    doRefresh() {
        this.currentPage.set(1);
        this.loadEvents(1, this.order(), this.search() ?? '', true);
    }

    loadMore() {
        if (this.eventsLeft()) {
            const nextPage = this.currentPage() + 1;
            this.currentPage.set(nextPage);
            this.loadEvents(nextPage, this.order(), this.search() ?? '', false);
        } else {
            this.infiniteScroll()?.complete();
        }
    }

    deleteEvent(event: MyEvent) {
        this.events.update(events => events.filter(e => e.id !== event.id));
    }

    toggleSearch() {
        this.searchVisible.update(visible => !visible);
    }
}

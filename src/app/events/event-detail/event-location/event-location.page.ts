import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { EventDetailPage } from '../event-detail.page';
import { OlMapDirective } from "../../../shared/directives/ol-maps/ol-map.directive";
import { OlMarkerDirective } from "../../../shared/directives/ol-maps/ol-marker.directive";

@Component({
    selector: 'app-event-location',
    templateUrl: './event-location.page.html',
    styleUrls: ['./event-location.page.scss'],
    standalone: true,
    imports: [IonIcon, IonFabButton, IonFab, IonLabel, IonContent, IonHeader,  IonToolbar, CommonModule, FormsModule, OlMapDirective, OlMarkerDirective]
})
export class EventLocationPage {
    event = inject(EventDetailPage).event;
    coordinates = signal<[number, number]>([-0.5, 38.5]);

    constructor() {
        this.coordinates.set([this.event()!.lng, this.event()!.lat]);
    }
}

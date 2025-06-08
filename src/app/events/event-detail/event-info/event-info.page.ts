import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, NavController, } from '@ionic/angular/standalone';
import { EventDetailPage } from '../event-detail.page';
import { EventCardPage } from 'src/app/events/event-card/event-card.page';


@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.page.html',
  styleUrls: ['./event-info.page.scss'],
  standalone: true,
  imports: [IonContent, IonTitle, IonToolbar, CommonModule, FormsModule, IonHeader, EventCardPage]
})
export class EventInfoPage {

  event = inject(EventDetailPage).event;
  #nav = inject(NavController);

  goBack() {
    this.#nav.navigateRoot(['/events']);
  }

}

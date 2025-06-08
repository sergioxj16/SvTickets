import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonButtons,
    IonTabs,
    IonBackButton,
    IonIcon,
    IonTabBar,
    IonTabButton,

} from '@ionic/angular/standalone';
import { MyEvent } from '../../interfaces/myevent';
import { addIcons } from 'ionicons';
import { chatboxEllipsesSharp, information, informationCircleSharp, locationSharp, peopleSharp, chatboxSharp, ellipseSharp } from 'ionicons/icons';

@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.page.html',
    styleUrls: ['./event-detail.page.scss'],
    standalone: true,
    imports: [
        IonHeader,
        IonTitle,
        IonToolbar,
        IonButtons,
        IonTabs,
        IonBackButton,
        IonIcon,
        IonTabBar,
        IonTabButton,
        IonLabel,
        CommonModule,
        FormsModule,
    ]
})
export class EventDetailPage {
    event = input.required<MyEvent>();
    constructor() {
        addIcons({ informationCircleSharp, locationSharp, peopleSharp, chatboxSharp, ellipseSharp });
    }
}

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
    AlertController,
    IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonList,
    IonRouterLink,
    IonRow,
    IonTitle,
    IonToolbar,
    NavController,
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { Geolocation } from '@capacitor/geolocation';
import { addIcons } from 'ionicons';
import { home, logIn, logOut, documentText, checkmarkCircle, images, camera, arrowUndoCircle, exit, peopleSharp, calendarOutline, calendarSharp, mapSharp, cashSharp, cashOutline, locationSharp, informationCircleSharp, chatboxEllipsesSharp, addCircleSharp, locationOutline, navigateSharp, personAddSharp, personRemoveSharp, addSharp, searchSharp, closeSharp, optionsSharp, closeCircle, mailSharp, pencilSharp, imageSharp, lockOpenSharp, trashBinSharp, eyeSharp } from 'ionicons/icons';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [
        FormsModule,
        RouterLink,
        IonRouterLink,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonList,
        IonItem,
        IonInput,
        IonGrid,
        IonRow,
        IonCol,
        IonButton,
        IonIcon,
    ],
})
export class LoginPage {
    email = '';
    password = '';


    #navCtrl = inject(NavController);
    #authService = inject(AuthService);
    #alertCtrl = inject(AlertController);

    coords = signal<[number, number]>([-0.5, 38.5]);

    constructor() {
        this.getLocation();
        addIcons({
            home,
            logIn,
            logOut,
            documentText,
            checkmarkCircle,
            images,
            camera,
            arrowUndoCircle,
            exit,
            peopleSharp,
            calendarOutline,
            calendarSharp,
            mapSharp,
            cashSharp,
            cashOutline,
            locationSharp,
            informationCircleSharp,
            chatboxEllipsesSharp,
            addCircleSharp,
            locationOutline,
            navigateSharp,
            personAddSharp,
            personRemoveSharp,
            addSharp,
            searchSharp,
            closeSharp,
            optionsSharp,
            closeCircle,
            mailSharp,
            pencilSharp,
            imageSharp,
            lockOpenSharp,
            trashBinSharp,
            eyeSharp,
        });
    }

    async getLocation() {
        const coordinates = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true
        });

        this.coords.set([coordinates.coords.latitude, coordinates.coords.longitude])
    }

    login() {

        this.#authService.login(this.email, this.password, this.coords()[0], this.coords()[1]).subscribe({
            next: () => {
                this.#navCtrl.navigateRoot(['/events']);
            },
            error: async (error) => {
                (
                    await this.#alertCtrl.create({
                        header: 'Login error',
                        message: 'Incorrect email and/or password',
                        buttons: ['Ok'],
                    })
                ).present();
            },
        });
    }
}

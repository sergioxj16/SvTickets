import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
    IonRouterLink,
    ToastController,
    NavController,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonIcon,
    IonImg,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonLabel, IonText
} from '@ionic/angular/standalone';
import { User } from '../../interfaces/user';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from '../services/auth.service';
import { ValueEqualsDirective } from '../../shared/validators/value-equals.directive';
import { Geolocation } from '@capacitor/geolocation';
import { addCircleSharp, addSharp, arrowUndoCircle, calendarOutline, calendarSharp, camera, cashOutline, cashSharp, chatboxEllipsesSharp, checkmarkCircle, closeCircle, closeSharp, documentText, exit, eyeSharp, home, images, imageSharp, informationCircleSharp, locationOutline, locationSharp, lockOpenSharp, logIn, logOut, mailSharp, mapSharp, navigateSharp, optionsSharp, pencilSharp, peopleSharp, personAddSharp, personRemoveSharp, searchSharp, trashBinSharp } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: true,
    imports: [IonText,
        FormsModule,
        RouterLink,
        IonRouterLink,
        ValueEqualsDirective,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonList,
        IonItem,
        IonInput,
        IonIcon,
        IonImg,
        IonButton,
        IonGrid,
        IonRow,
        IonCol,
        IonLabel,
    ],
})
export class RegisterPage implements CanComponentDeactivate {
    coords = signal<[number, number]>([-0.5, 38.5]);

    constructor() {
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
            mailSharp,
            pencilSharp,
            imageSharp,
            lockOpenSharp,
            trashBinSharp,
            eyeSharp,
            closeSharp,
            optionsSharp,
            closeCircle,
        });

        this.getLocation();
    }

    async getLocation() {
        const coordinates = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
        });

        this.coords.set([
            coordinates.coords.latitude,
            coordinates.coords.longitude,
        ]);
    }

    user: User = {
        name: '',
        password: '',
        email: '',
        avatar: '',
        lat: this.coords()[0],
        lng: this.coords()[1],
    };
    passwordRepeat = '';
    emailRepeat = '';
    skipGuard = false;

    #authService = inject(AuthService);
    #toastCtrl = inject(ToastController);
    #nav = inject(NavController);
    #changeDetector = inject(ChangeDetectorRef);

    register() {
        try {
            this.#authService.register(this.user).subscribe(async () => {
                const toast = await this.#toastCtrl.create({
                    duration: 3000,
                    position: 'bottom',
                    message: 'User registered successfully!',
                });
                await toast.present();
                this.skipGuard = true;
                this.#nav.navigateRoot(['/auth/login']);
            }, async (error) => {
                let errorMessage = 'Registration failed.';
                if (error.error && Array.isArray(error.error.message)) {
                    errorMessage = error.error.message.join(' ');
                } else if (error.error && typeof error.error.message === 'string') {
                    errorMessage = error.error.message;
                }
                const toast = await this.#toastCtrl.create({
                    duration: 3000,
                    position: 'bottom',
                    message: errorMessage,
                });
                await toast.present();
            });

        } catch (error) {
            this.#toastCtrl.create({
                duration: 3000,
                position: 'bottom',
                message: 'Unexpected error: ' + error,
            }).then(toast => toast.present());
        }
    }

    emailsMatch() {
        return this.user.email === this.emailRepeat;
    }

    async takePhoto() {
        try {
            const photo = await Camera.getPhoto({
                source: CameraSource.Camera,
                quality: 90,
                height: 200,
                width: 200,
                allowEditing: true,
                resultType: CameraResultType.DataUrl,
            });

            if (photo?.dataUrl) {
                this.user.avatar = photo.dataUrl;
                this.#changeDetector.markForCheck();
            }
        } catch (error) {
            console.log('Acción cancelada o error:');
        }
    }

    async pickFromGallery() {
        try {
            const photo = await Camera.getPhoto({
                source: CameraSource.Photos,
                height: 200,
                width: 200,
                allowEditing: true,
                resultType: CameraResultType.DataUrl,
            });

            if (photo?.dataUrl) {
                this.user.avatar = photo.dataUrl;
                this.#changeDetector.markForCheck();
            }
        } catch (error) {
            console.log('Acción cancelada o error:');
        }
    }

    async canDeactivate() {
        return confirm('¿Seguro que quieres salir sin guardar?');
    }
}

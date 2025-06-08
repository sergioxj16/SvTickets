import { ChangeDetectorRef, Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { minDateValidator } from '../../shared/validators/min-date.directive';
import { EventService } from '../services/event.service';
import { MyEvent, MyEventInsert } from '../../interfaces/myevent';
import { SearchResult } from '../../interfaces/search-result';
import { IonTextarea, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonRow, IonText, IonTitle, IonToolbar, NavController, IonButtons, IonImg, IonBackButton } from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { OlMapDirective } from 'src/app/shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from 'src/app/shared/directives/ol-maps/ol-marker.directive';
import { GaAutocompleteDirective } from 'src/app/shared/directives/ol-maps/ga-autocomplete.directive';

@Component({
    selector: 'app-event-form',
    templateUrl: './event-form.page.html',
    styleUrls: ['./event-form.page.scss'],
    standalone: true,
    imports: [
        IonBackButton, IonTextarea, IonGrid, IonRow, IonCol, IonText, IonInput, IonLabel, IonItem, IonList, IonIcon,
        IonButton, IonContent, IonHeader, IonTitle, IonToolbar, ReactiveFormsModule, DatePipe,
        OlMapDirective, OlMarkerDirective, GaAutocompleteDirective, IonImg, IonButtons
    ],
})
export class EventFormPage {
    #eventService = inject(EventService);
    #destroyRef = inject(DestroyRef);
    #nav = inject(NavController);
    #changeDetector = inject(ChangeDetectorRef);
    #fb = inject(NonNullableFormBuilder);

    event = input<MyEvent>();

    today: string = new Date().toISOString().split('T')[0];
    coordinates = signal<[number, number]>([-0.5, 38.5]);
    addEventErrorCode = signal<number | null>(null);

    saved = false;
    base64image = '';
    address = 'nowhere';

    eventForm = this.#createEventForm();

    constructor() {
        effect(() => {
            const current = this.event();
            if (current) {
                this.eventForm.patchValue({
                    title: current.title,
                    date: current.date.split(' ')[0],
                    description: current.description,
                    price: current.price,
                    image: current.image
                });
                this.coordinates.set([current.lat, current.lng]);
                this.address = current.address;
                this.base64image = current.image;
                this.eventForm.markAllAsTouched();
            }
        });
    }

    addEvent(): void {
        const [lat, lng] = this.coordinates();
        const event: MyEventInsert = {
            ...this.eventForm.getRawValue(),
            image: this.base64image,
            address: this.address,
            lat,
            lng,
        };

        this.#eventService
            .addEvent(event)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe({
                next: () => {
                    this.saved = true;
                    this.#nav.navigateRoot(['/events']);
                },
                error: (error) => {
                    this.addEventErrorCode.set(error.status);
                },
            });
    }

    updateEvent(): void {
        if (!this.event()) return;

        const [lat, lng] = this.coordinates();
        const current = this.event();

        const eventToUpdate: MyEventInsert = {
            title: this.eventForm.get('title')?.value ?? current!.title,
            date: this.eventForm.get('date')?.value ?? current!.date.split(' ')[0],
            description: this.eventForm.get('description')?.value ?? current!.description,
            price: this.eventForm.get('price')?.value ?? current!.price,
            image: this.base64image || current!.image,
            address: this.address || current!.address,
            lat,
            lng,
        };

        this.#eventService
            .updateEvent(eventToUpdate, current!.id)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe({
                next: () => {
                    this.saved = true;
                    this.#nav.navigateRoot(['/events']);
                },
                error: (error) => {
                    this.addEventErrorCode.set(error.status);
                },
            });
    }

    async pickFromGallery(): Promise<void> {
        this.base64image = await this.#getPhotoFromGallery();
        this.eventForm.get('image')?.setValue(this.base64image);
        this.eventForm.get('image')?.markAsDirty();
        this.#changeDetector.markForCheck();
    }

    changePlace(result: SearchResult): void {
        this.coordinates.set([result.coordinates[0], result.coordinates[1]]);
        this.address = result.address;
    }

    #createEventForm() {
        return this.#fb.group({
            title: [
                '',
                [
                    Validators.required,
                    Validators.minLength(5),
                    Validators.pattern('^[a-zA-Z][a-zA-Z ]*$'),
                ],
            ],
            date: ['', [Validators.required, minDateValidator(this.today)]],
            description: ['', [Validators.required]],
            price: [0, [Validators.required, Validators.min(0.1)]],
            image: ['', [Validators.required]],
        });
    }

    async #getPhotoFromGallery(): Promise<string> {
        const photo = await Camera.getPhoto({
            source: CameraSource.Photos,
            height: 768,
            width: 1024,
            allowEditing: true,
            resultType: CameraResultType.DataUrl,
        });
        return photo.dataUrl as string;
    }
}

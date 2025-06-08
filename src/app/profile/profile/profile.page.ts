import { ChangeDetectorRef, Component, DestroyRef, effect, inject, model } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'
import { IonContent, IonCol, IonGrid, IonRow, IonAvatar, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonImg, IonHeader, IonToolbar, IonTitle, IonButtons, IonModal, IonText } from '@ionic/angular/standalone'
import { User } from '../../interfaces/user'
import { ProfileService } from '../services/profile.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { RouterLink } from '@angular/router'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { OlMapDirective } from 'src/app/shared/directives/ol-maps/ol-map.directive'
import { OlMarkerDirective } from 'src/app/shared/directives/ol-maps/ol-marker.directive'
import { ValueEqualsDirective } from 'src/app/shared/validators/value-equals.directive'

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
    standalone: true,
    imports: [
        IonText, IonModal, IonButtons, IonTitle, IonToolbar, IonHeader, IonImg,
        IonCol, IonContent, CommonModule, FormsModule, ReactiveFormsModule, IonGrid,
        IonRow, IonAvatar, IonButton, IonIcon, IonItem, IonLabel, IonInput,
        RouterLink, OlMapDirective, OlMarkerDirective, ValueEqualsDirective,
    ]
})
export class ProfilePage {
    user = model.required<User>()
    isProfileFormVisible = false
    isPasswordFormVisible = false
    isAvatarFormVisible = false
    coordinates = { lat: 0, lng: 0 }
    avatarBase64 = ''
    newAvatarBase64 = ''

    readonly #profileService = inject(ProfileService)
    readonly #destroyRef = inject(DestroyRef)
    readonly #formBuilder = inject(NonNullableFormBuilder)
    readonly #changeDetector = inject(ChangeDetectorRef)

    profileForm = this.#formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
    })

    passwordForm = this.#formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(4)]],
        password2: ['', [Validators.required]]
    })

    avatarForm = this.#formBuilder.group({
        avatar: ['']
    })

    constructor() {
        effect(() => {
            const { name, email, avatar, lat, lng } = this.user()
            this.profileForm.patchValue({ name, email })
            this.avatarBase64 = avatar
            this.coordinates = { lat, lng }
        })
    }

    showProfileForm() {
        this.isProfileFormVisible = true
        this.isPasswordFormVisible = false
        this.isAvatarFormVisible = false
        this.profileForm.patchValue({
            name: this.user().name,
            email: this.user().email
        })
    }

    showPasswordForm() {
        this.isProfileFormVisible = false
        this.isPasswordFormVisible = true
        this.isAvatarFormVisible = false
        this.passwordForm.reset()
    }

    showAvatarForm() {
        this.isAvatarFormVisible = true
        this.isProfileFormVisible = false
        this.isPasswordFormVisible = false
    }

    hideForms() {
        this.isProfileFormVisible = false
        this.isPasswordFormVisible = false
        this.isAvatarFormVisible = false
    }

    hideFormButtons() {
        this.hideForms()
    }

    updateProfileInfo() {
        if (this.profileForm.invalid) return

        const updatedInfo = this.profileForm.getRawValue()
        this.#profileService.updateProfile(updatedInfo)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                this.user.update((current) => ({ ...current, ...updatedInfo }))
                this.hideForms()
            })
    }

    async updatePassword() {
        if (this.passwordForm.invalid) return

        const newPasswordData = this.passwordForm.getRawValue()
        this.#profileService.updateUserPassword(newPasswordData)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                this.hideForms()
            })
    }

    handleAvatarUpdate(newAvatarBase64: string) {
        this.avatarBase64 = newAvatarBase64
        this.savePhoto()
    }

    savePhoto() {
        if (!this.newAvatarBase64) return

        this.avatarForm.patchValue({ avatar: this.newAvatarBase64 })
        this.#profileService.updateProfileAvatar(this.avatarForm.value as { avatar: string })
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                this.avatarBase64 = this.newAvatarBase64
                this.user.update(current => ({ ...current, avatar: this.newAvatarBase64 }))
                this.newAvatarBase64 = ''
                this.hideForms()
            })
    }

    async takePhoto() {
        const photo = await Camera.getPhoto({
            source: CameraSource.Camera,
            quality: 90,
            height: 640,
            width: 640,
            allowEditing: true,
            resultType: CameraResultType.DataUrl
        })

        this.newAvatarBase64 = photo.dataUrl as string
        this.#changeDetector.markForCheck()
    }

    async pickFromGallery() {
        const photo = await Camera.getPhoto({
            source: CameraSource.Photos,
            height: 640,
            width: 640,
            allowEditing: true,
            resultType: CameraResultType.DataUrl
        })

        this.newAvatarBase64 = photo.dataUrl as string
        this.#changeDetector.markForCheck()
    }
}

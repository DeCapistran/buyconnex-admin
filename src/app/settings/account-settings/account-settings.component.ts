import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgIf } from '@angular/common';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { AuthService } from '../../services/auth.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { UserSettingVo } from '../../models/users/userSettingVo-model';
import { Users } from '../../models/users/users-model';

@Component({
    selector: 'app-account-settings',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FeathericonsModule, NgxEditorModule, MatDatepickerModule, MatSelectModule, NgIf],
    providers: [provideNativeDateAdapter()],
    templateUrl: './account-settings.component.html',
    styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent implements OnInit, OnDestroy {

    // Text Editor
    editor: Editor;
    html = '';
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['link', 'image'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    settingsForm: FormGroup;
    successMessage: string = '';
    errorMessage: string = '';
    private currentSettings: UserSettingVo = { langue: 'fr', mfaActive: false, notifActive: false };

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private userSettingsService: UserSettingsService
    ) {
        this.settingsForm = this.fb.group({
            firstname: [''],
            lastname: [''],
            email: ['', Validators.email],
            langue: ['fr']
        });
    }

    ngOnInit(): void {
        this.editor = new Editor();
        this.loadUserSettings();
    }

    ngOnDestroy(): void {
        this.editor.destroy();
    }

    private loadUserSettings(): void {
        this.userSettingsService.getUserInfo().subscribe({
            next: (user: Users) => {
                this.settingsForm.patchValue({
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email
                });
            },
            error: () => {
                const loggedUser = this.authService.loggedUser;
                if (loggedUser) {
                    this.settingsForm.patchValue({ email: loggedUser });
                }
            }
        });

        this.userSettingsService.getUserSettings().subscribe({
            next: (settings: UserSettingVo) => {
                this.currentSettings = settings;
                this.settingsForm.patchValue({ langue: settings.langue || 'fr' });
            },
            error: () => {}
        });
    }

    onSave(): void {
        const userSettingVo: UserSettingVo = {
            langue: this.settingsForm.value.langue,
            mfaActive: this.currentSettings.mfaActive,
            notifActive: this.currentSettings.notifActive
        };

        this.userSettingsService.updateSetting(userSettingVo).subscribe({
            next: () => {
                this.successMessage = 'Paramètres mis à jour avec succès.';
                this.errorMessage = '';
                setTimeout(() => { this.successMessage = ''; }, 3000);
            },
            error: () => {
                this.errorMessage = 'Erreur lors de la mise à jour des paramètres.';
                this.successMessage = '';
                setTimeout(() => { this.errorMessage = ''; }, 3000);
            }
        });
    }

    onCancel(): void {
        this.loadUserSettings();
        this.successMessage = '';
        this.errorMessage = '';
    }

}
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UserSettingsService } from '../../services/user-settings.service';
import { UserSettingVo } from '../../models/users/userSettingVo-model';

@Component({
    selector: 'app-privacy-policy',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatSlideToggleModule, FormsModule, NgIf],
    templateUrl: './privacy-policy.component.html',
    styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent implements OnInit {

    mfaActive: boolean = false;
    notifActive: boolean = false;
    langue: string = 'fr';
    successMessage: string = '';
    errorMessage: string = '';

    constructor(private userSettingsService: UserSettingsService) {}

    ngOnInit(): void {
        this.userSettingsService.getUserSettings().subscribe({
            next: (settings: UserSettingVo) => {
                this.mfaActive = settings.mfaActive;
                this.notifActive = settings.notifActive;
                this.langue = settings.langue;
            },
            error: () => {}
        });
    }

    onSave(): void {
        const userSettingVo: UserSettingVo = {
            langue: this.langue,
            mfaActive: this.mfaActive,
            notifActive: this.notifActive
        };

        this.userSettingsService.updateSetting(userSettingVo).subscribe({
            next: () => {
                this.successMessage = 'Paramètres de confidentialité mis à jour.';
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

}
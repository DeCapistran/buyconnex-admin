import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { AuthService } from '../../services/auth.service';
import { NewPassword } from '../../models/users/newPassword-model';

export const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const newPwd = group.get('newPassword')?.value;
    const confirm = group.get('passwordConfirm')?.value;
    return newPwd && confirm && newPwd !== confirm ? { passwordMismatch: true } : null;
};

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FeathericonsModule, NgIf],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {

    // Password Hide
    hide = true;
    hide2 = true;
    hide3 = true;

    passwordForm: FormGroup;
    successMessage: string = '';
    errorMessage: string = '';

    constructor(private fb: FormBuilder, private authService: AuthService) {}

    ngOnInit(): void {
        this.passwordForm = this.fb.group({
            oldPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            passwordConfirm: ['', Validators.required]
        }, { validators: passwordMatchValidator });
    }

    onSubmit(): void {
        if (this.passwordForm.invalid) {
            this.passwordForm.markAllAsTouched();
            return;
        }

        const newPassword: NewPassword = {
            login: this.authService.loggedUser,
            oldPassword: this.passwordForm.value.oldPassword,
            newPassword: this.passwordForm.value.newPassword,
            passwordConfirm: this.passwordForm.value.passwordConfirm
        };

        this.authService.updatePassword(newPassword).subscribe({
            next: () => {
                this.successMessage = 'Mot de passe modifié avec succès.';
                this.errorMessage = '';
                this.passwordForm.reset();
                setTimeout(() => { this.successMessage = ''; }, 3000);
            },
            error: () => {
                this.errorMessage = 'Erreur lors du changement de mot de passe. Vérifiez votre ancien mot de passe.';
                this.successMessage = '';
                setTimeout(() => { this.errorMessage = ''; }, 3000);
            }
        });
    }

}
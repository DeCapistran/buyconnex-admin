import { Component, Inject } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, Router } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';
import { Users } from '../../models/users/users-model';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Http2ServerResponse } from 'http2';

@Component({
    selector: 'app-sign-up',
    standalone: true,
    imports: [RouterLink, MatButton, MatIconButton, FormsModule, MatFormFieldModule, MatInputModule, FeathericonsModule, MatCheckboxModule, ReactiveFormsModule, NgIf],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

    public users = new Users();
    confirmPassword?:string;
    err!:any;
    showMessage = false;
    showMessage2 = false;
    loading : boolean = false;
    // Password Hide
    hide = true;
    // Form
    authForm: FormGroup;

    //public registerForm!: FormGroup;
    public formSubmitted = false;

    constructor(
        private formBuilder: FormBuilder,  
        private authService : AuthService, 
        private router:Router, 
        private toastrService: ToastrService) {
        this.authForm = this.formBuilder.group({
            name: ['', Validators.required],
            prenom: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.authForm.valid) {
        this.loading=true;
        this.authService.registerUser(this.users).subscribe({
            next:(res)=>{
            this.authService.setRegistredUser(this.users);
            this.loading=false;
            this.showMessage = true;
            this.err = "Informations Valides";
            setTimeout(() => {
                this.err = null;
                this.router.navigate(["/authentication/confirm-email"]);
                this.authForm.reset();
                this.showMessage = false;
                  }, 1500);
            },
            error:(err:any)=>{
            if(err.error.errorCode=="USER_EMAIL_ALREADY_EXISTS") {
                this.showMessage2 = true;
                this.err = "Email déjà existant";
                setTimeout(() => {
                    this.err = null;
                    this.showMessage2 = false;
                  }, 1500);
            }
            }
        })
        }

        this.formSubmitted = false; // Reset formSubmitted to false
        
    }

}
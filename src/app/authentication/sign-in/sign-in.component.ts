import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, Router } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AuthRequest, AuthResponse } from '../../models/users/auth-model';
import { Users } from '../../models/users/users-model';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [RouterLink, MatButton, MatIconButton, FormsModule, MatFormFieldModule, MatInputModule, FeathericonsModule, MatCheckboxModule, ReactiveFormsModule, NgIf],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit{

    hide = true;
    authForm: FormGroup;
    public loggedUser!:string;
    public isloggedIn: Boolean = false;
    authRequest: AuthRequest = new AuthRequest();
    currentUser?: AuthResponse = new AuthResponse();
    public users = new Users();
    message : string ="login ou mot de passe erronés..";
    showMessage = false;
    showMessage2 = false;
    err!:any;

    constructor( private fb: FormBuilder, private router: Router, private authService: AuthService) {
        this.authForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    ngOnInit () {
        this.authForm =  this.fb.group({
          email : ['', [Validators.required, Validators.email]],
          password : ['', [Validators.required, Validators.minLength(8)]]
        })
      }

    onSubmit() {
        this.authService.login(this.users).subscribe({
            next: (data) => {
              this.showMessage = true;
              let jwToken = data.headers.get('Authorization')!;
              this.authService.saveToken(jwToken);
              this.loggedUser = this.users.username;
              this.isloggedIn = true;
              this.err = "Connexion réussie";
              localStorage.setItem('loggedUser', this.loggedUser);
              localStorage.setItem('isloggedIn', String(this.isloggedIn));
              setTimeout(() => {
                this.err = null;
                this.router.navigate(['/']); 
                this.authForm.reset();
                this.showMessage = false;
                  }, 1500);
            },
            error:(err: any) => {
              if(err.error.errorCause == "authenticationFailed") {
                this.showMessage2 = true;
                this.err = "Login ou mot de passe incorrect";
                setTimeout(() => {
                    this.err = null;
                    this.showMessage2 = false;
                  }, 1500);
              }
              if (err.error.errorCause=="disabled")
                this.showMessage2 = true;
                this.err = "Utilisateur désactivé";
                setTimeout(() => {
                    this.err = null;
                    this.showMessage2 = false;
                    }, 1500);
            }
            });
    }

}
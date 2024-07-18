import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Users } from '../../models/users/users-model';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-confirm-email',
    standalone: true,
    imports: [RouterLink, MatButtonModule, FeathericonsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatCardModule, FormsModule, NgIf],
    templateUrl: './confirm-email.component.html',
    styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent implements OnInit {

    // Password hide
    hide = true;

    code :string="";
    user :Users = new Users();
    err!:any;
    showAlert = false;
    showAlert2 = false;

    constructor(private route:ActivatedRoute,private authService:AuthService,
        private router:Router) {}

    ngOnInit(): void {
        this.user = this.authService.regitredUser;
    }

    onValidateEmail() {
        this.authService.validateEmail(this.code).subscribe({
          next: (res) => {
            this.showAlert = true;
            this.err = "Compte créé avec succès !";
            setTimeout(() => {
                this.err = null;
                this.router.navigate(["/authentication"]);
                this.showAlert = false;
              }, 1500);
          },
          error: (err: any) => {
          if ((err.error.errorCode == "INVALID_TOKEN")) {
            this.showAlert2 = true;
            this.err = "Votre code n'est pas valide !";
            setTimeout(() => {
                this.err = null;
                this.showAlert2 = false;
            }, 1500);
        }
      
          if ((err.error.errorCode == "EXPIRED_TOKEN")) {
            this.showAlert2 = true;
            this.err = "Votre code a expiré !";
            setTimeout(() => {
                this.err = null;
            }, 1500); 
            this.showAlert2 = false;
        } 
        },
    });
      
    }
}
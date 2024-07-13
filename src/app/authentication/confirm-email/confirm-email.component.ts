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

@Component({
    selector: 'app-confirm-email',
    standalone: true,
    imports: [RouterLink, MatButtonModule, FeathericonsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatCardModule],
    templateUrl: './confirm-email.component.html',
    styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent implements OnInit {

    // Password hide
    hide = true;

    code :string="";
    user :Users = new Users();
    err="";

    constructor(private route:ActivatedRoute,private authService:AuthService,
        private router:Router) {}

    ngOnInit(): void {
        this.user = this.authService.regitredUser;
    }

    onValidateEmail() {
        this.authService.validateEmail(this.code).subscribe({
          next: (res) => {
            alert("Compte créé avec succès !");
            this.router.navigate(["/pages/login"]);
          },
          error: (err: any) => {
          if ((err.error.errorCode == "INVALID_TOKEN")) 
              this.err = "Votre code n'est pas valide !";
      
          if ((err.error.errorCode == "EXPIRED_TOKEN")) 
              this.err = "Votre code a expiré !";  
          },
        });
      
    }
}
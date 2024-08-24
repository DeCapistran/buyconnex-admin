import { Component } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { RouterLink } from '@angular/router';
import { ToggleService } from './toggle.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [FeathericonsModule, MatButtonModule, MatMenuModule, RouterLink, NgClass],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    providers: [
        DatePipe
    ]
})
export class HeaderComponent {

    constructor(
        public toggleService: ToggleService,
        private datePipe: DatePipe,
        private authService: AuthService
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    // Toggle Service
    isToggled = false;
    toggle() {
        this.toggleService.toggle();
    }

    // Dark Mode
    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    onLogout() {
        this.authService.logOut();
      }

    // Current Date
    currentDate: Date = new Date();
    formattedDate: any = this.datePipe.transform(this.currentDate, 'dd MMMM yyyy');

}
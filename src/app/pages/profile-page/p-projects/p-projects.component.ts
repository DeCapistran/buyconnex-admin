import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { AllComponent } from './all/all.component';
import { InProgressComponent } from './in-progress/in-progress.component';
import { CompletedComponent } from './completed/completed.component';
import { PendingComponent } from './pending/pending.component';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { PUserProfileComponent } from "../p-user-profile/p-user-profile.component";

@Component({
    selector: 'app-p-projects',
    standalone: true,
    templateUrl: './p-projects.component.html',
    styleUrl: './p-projects.component.scss',
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTabsModule, AllComponent, InProgressComponent, CompletedComponent, PendingComponent, FeathericonsModule, PUserProfileComponent]
})
export class PProjectsComponent {}
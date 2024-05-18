import { Component } from '@angular/core';
import { EcommerceComponent } from '../dashboard/ecommerce/ecommerce.component';

@Component({
    selector: 'app-widgets',
    standalone: true,
    imports: [EcommerceComponent],
    templateUrl: './widgets.component.html',
    styleUrl: './widgets.component.scss'
})
export class WidgetsComponent {}
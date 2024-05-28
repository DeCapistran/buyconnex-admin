import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { TodaysOrderComponent } from './todays-order/todays-order.component';
import { TodaysRevenueComponent } from './todays-revenue/todays-revenue.component';
import { AverageValueComponent } from './average-value/average-value.component';
import { AllSpendingComponent } from './all-spending/all-spending.component';
import { ExpectedEarningsComponent } from './expected-earnings/expected-earnings.component';
import { NombreArticle } from './nombre-article/nombre-article.component';

@Component({
    selector: 'app-website-overview',
    standalone: true,
    imports: [RouterLink, MatCardModule, TodaysOrderComponent, TodaysRevenueComponent, AverageValueComponent, AllSpendingComponent, ExpectedEarningsComponent, NombreArticle],
    templateUrl: './website-overview.component.html',
    styleUrl: './website-overview.component.scss'
})
export class WebsiteOverviewComponent {}
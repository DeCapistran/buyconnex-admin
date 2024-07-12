import { Component } from '@angular/core';
import { WebsiteOverviewComponent } from './website-overview/website-overview.component';
import { TopSellingProductsComponent } from './top-selling-products/top-selling-products.component';
import { RevenueOverviewComponent } from './revenue-overview/revenue-overview.component';
import { SalesOverviewComponent } from './sales-overview/sales-overview.component';
import { RecentOrdersComponent } from './recent-orders/recent-orders.component';
import { TransactionsHistoryComponent } from './transactions-history/transactions-history.component';
import { EarningsReportsComponent } from './earnings-reports/earnings-reports.component';

@Component({
    selector: 'app-ecommerce',
    standalone: true,
    imports: [WebsiteOverviewComponent, TopSellingProductsComponent, RevenueOverviewComponent, SalesOverviewComponent, RecentOrdersComponent, TransactionsHistoryComponent, EarningsReportsComponent],
    templateUrl: './ecommerce.component.html',
    styleUrl: './ecommerce.component.scss'
})
export class EcommerceComponent {}
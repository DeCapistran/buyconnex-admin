import { Component } from '@angular/core';
import { BalanceOverviewComponent } from './balance-overview/balance-overview.component';
import { ContactLeadsComponent } from './contact-leads/contact-leads.component';
import { SalesForecastComponent } from './sales-forecast/sales-forecast.component';
import { OrganicSessionsComponent } from './organic-sessions/organic-sessions.component';
import { LeadsReportComponent } from './leads-report/leads-report.component';
import { DealsStatisticsComponent } from './deals-statistics/deals-statistics.component';
import { StatsComponent } from './stats/stats.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';

@Component({
    selector: 'app-customers-details',
    standalone: true,
    imports: [StatsComponent, BalanceOverviewComponent, ContactLeadsComponent, DealsStatisticsComponent, SalesForecastComponent, OrganicSessionsComponent, LeadsReportComponent, PaymentHistoryComponent],
    templateUrl: './e-customers-details.component.html',
    styleUrl: './e-customers-details.component.scss'
})
export class ECustomersDetailsComponent {}
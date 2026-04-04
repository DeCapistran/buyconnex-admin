import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialogRef,
    MatDialogActions,
    MatDialogContent,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PromotionsDetails } from '../../../models/achats/promotionsDetails-model';

export interface PromotionDetailData {
    libelle: string;
    pourcentage: number;
    dateDebut: Date;
    dateFin: Date;
    details: PromotionsDetails[];
}

interface CategoryGroup {
    label: string;
    items: PromotionsDetails[];
}

@Component({
    selector: 'app-e-promotion-detail-dialog',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatDialogActions, MatDialogContent, DatePipe],
    template: `
        <div class="promo-header">
            <div class="promo-header-icon">
                <i class="ri-price-tag-3-line"></i>
            </div>
            <div class="promo-header-info">
                <h2 class="promo-title">{{ data.libelle }}</h2>
                <div class="promo-subtitle">
                    <span class="badge-discount">
                        <i class="ri-percent-line"></i> {{ data.pourcentage }}% de remise
                    </span>
                    <span class="date-pill">
                        <i class="ri-calendar-event-line"></i>
                        {{ data.dateDebut | date:'dd/MM/yyyy' }}
                        <i class="ri-arrow-right-line"></i>
                        {{ data.dateFin | date:'dd/MM/yyyy' }}
                    </span>
                </div>
            </div>
            <button class="promo-close-btn" mat-icon-button (click)="close()">
                <i class="ri-close-line"></i>
            </button>
        </div>

        <mat-dialog-content class="promo-dialog-content">

            <div class="promo-stats-bar" *ngIf="data.details && data.details.length > 0">
                <div class="stat-chip">
                    <i class="ri-shopping-bag-2-line"></i>
                    <span>{{ data.details.length }} article{{ data.details.length > 1 ? 's' : '' }}</span>
                </div>
                <div class="stat-chip">
                    <i class="ri-apps-2-line"></i>
                    <span>{{ groupedByCategory.length }} catégorie{{ groupedByCategory.length > 1 ? 's' : '' }}</span>
                </div>
            </div>

            <div class="section-header">
                <i class="ri-shopping-bag-line"></i> Articles associés
            </div>

            <div *ngIf="data.details && data.details.length > 0; else noArticles" class="categories-container">
                <div class="category-group" *ngFor="let group of groupedByCategory; let gi = index">
                    <div class="category-header">
                        <span class="category-dot" [style.background]="getCategoryColor(gi)"></span>
                        <span class="category-label">{{ group.label }}</span>
                        <span class="category-count">{{ group.items.length }}</span>
                    </div>
                    <div class="articles-list">
                        <div class="article-item" *ngFor="let detail of group.items">
                            <div class="article-icon-wrap">
                                <i class="ri-box-3-line"></i>
                            </div>
                            <div class="article-left">
                                <div class="article-name">{{ detail.title }}</div>
                            </div>
                            <div class="article-price-wrap">
                                <div class="article-price">{{ detail.prix | number:'1.2-2' }} €</div>
                                <div class="article-price-promo">
                                    {{ detail.prix * (1 - data.pourcentage / 100) | number:'1.2-2' }} €
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ng-template #noArticles>
                <div class="no-articles">
                    <div class="no-articles-icon"><i class="ri-inbox-2-line"></i></div>
                    <p class="no-articles-title">Aucun article associé</p>
                    <p class="no-articles-sub">Cette promotion ne contient pas encore d'articles.</p>
                </div>
            </ng-template>
        </mat-dialog-content>

        <mat-dialog-actions class="promo-dialog-actions">
            <button mat-flat-button color="primary" class="promo-close-action-btn" (click)="close()">
                <i class="ri-check-line"></i> Fermer
            </button>
        </mat-dialog-actions>
    `,
    styles: [`
        :host {
            display: block;
        }
        .promo-header {
            display: flex;
            align-items: flex-start;
            gap: 14px;
            padding: 20px 24px 16px;
            background: linear-gradient(135deg, #6361ee 0%, #8b5cf6 100%);
            border-radius: 4px 4px 0 0;
            position: relative;
        }
        .promo-header-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: rgba(255,255,255,0.2);
            color: #fff;
            font-size: 22px;
            flex-shrink: 0;
            backdrop-filter: blur(4px);
        }
        .promo-header-info {
            flex: 1;
            min-width: 0;
        }
        .promo-title {
            margin: 0 0 8px;
            font-size: 18px;
            font-weight: 700;
            color: #fff;
            line-height: 1.2;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .promo-subtitle {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
        }
        .badge-discount {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: rgba(255,255,255,0.25);
            color: #fff;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            border: 1px solid rgba(255,255,255,0.35);
        }
        .date-pill {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: rgba(255,255,255,0.15);
            color: rgba(255,255,255,0.92);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            border: 1px solid rgba(255,255,255,0.25);
        }
        .promo-close-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            color: rgba(255,255,255,0.8);
            background: rgba(255,255,255,0.15);
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 18px;
            transition: background 0.15s;
            padding: 0;
            line-height: 1;
        }
        .promo-close-btn:hover {
            background: rgba(255,255,255,0.28);
            color: #fff;
        }
        .promo-dialog-content {
            padding: 20px 24px !important;
            min-width: 480px;
            max-width: 640px;
            max-height: 62vh !important;
            overflow-y: auto;
        }
        .promo-stats-bar {
            display: flex;
            gap: 10px;
            margin-bottom: 18px;
        }
        .stat-chip {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #f0f0ff;
            color: #6361ee;
            padding: 5px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            border: 1px solid #e0dfff;
        }
        .stat-chip i {
            font-size: 15px;
        }
        .categories-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .category-group {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
        }
        .category-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 14px;
            background: #f8f9fc;
            border-bottom: 1px solid #e5e7eb;
        }
        .category-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex-shrink: 0;
        }
        .category-label {
            font-size: 13px;
            font-weight: 700;
            color: #374151;
            flex: 1;
            text-transform: uppercase;
            letter-spacing: 0.06em;
        }
        .category-count {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 22px;
            height: 22px;
            padding: 0 6px;
            border-radius: 11px;
            background: #e0e7ff;
            color: #4f46e5;
            font-size: 12px;
            font-weight: 700;
        }
        .articles-list {
            display: flex;
            flex-direction: column;
        }
        .article-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 11px 14px;
            background: #fff;
            border-bottom: 1px solid #f3f4f6;
            transition: background 0.12s;
        }
        .article-item:last-child {
            border-bottom: none;
        }
        .article-item:hover {
            background: #fafafe;
        }
        .article-icon-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            border-radius: 8px;
            background: #f0f0ff;
            color: #6361ee;
            font-size: 16px;
            flex-shrink: 0;
        }
        .article-left {
            flex: 1;
            min-width: 0;
        }
        .article-name {
            font-size: 14px;
            font-weight: 600;
            color: #111827;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .article-sku {
            font-size: 11px;
            color: #9ca3af;
            margin-top: 2px;
        }
        .article-price-wrap {
            text-align: right;
            flex-shrink: 0;
        }
        .article-price {
            font-size: 13px;
            font-weight: 500;
            color: #6b7280;
            text-decoration: line-through;
        }
        .article-price-promo {
            font-size: 14px;
            font-weight: 700;
            color: #6361ee;
        }
        .no-articles {
            text-align: center;
            padding: 40px 20px;
            color: #9ca3af;
        }
        .no-articles-icon {
            font-size: 48px;
            margin-bottom: 12px;
            color: #d1d5db;
        }
        .no-articles-title {
            font-size: 15px;
            font-weight: 600;
            color: #6b7280;
            margin: 0 0 6px;
        }
        .no-articles-sub {
            font-size: 13px;
            color: #9ca3af;
            margin: 0;
        }
        .promo-dialog-actions {
            padding: 12px 24px 16px !important;
            justify-content: flex-end;
            border-top: 1px solid #e5e7eb;
        }
        .promo-close-action-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
    `]
})
export class EPromotionDetailDialogComponent {

    private readonly categoryColors = [
        '#6361ee', '#10b981', '#f59e0b', '#ef4444',
        '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
        '#f97316', '#84cc16'
    ];

    constructor(
        public dialogRef: MatDialogRef<EPromotionDetailDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: PromotionDetailData
    ) {}

    get groupedByCategory(): CategoryGroup[] {
        const map = new Map<string, PromotionsDetails[]>();
        for (const detail of this.data.details) {
            const key = detail.categories?.libelle || 'Catégorie non définie';
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key)!.push(detail);
        }
        return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
    }

    getCategoryColor(index: number): string {
        return this.categoryColors[index % this.categoryColors.length];
    }

    close(): void {
        this.dialogRef.close();
    }
}

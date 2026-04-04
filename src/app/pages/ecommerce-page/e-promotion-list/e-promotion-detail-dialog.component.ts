import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialogRef,
    MatDialogActions,
    MatDialogTitle,
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

@Component({
    selector: 'app-e-promotion-detail-dialog',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatDialogActions, MatDialogTitle, MatDialogContent, DatePipe],
    template: `
        <h2 mat-dialog-title class="promo-dialog-title">
            <span class="promo-dialog-icon"><i class="ri-gift-line"></i></span>
            {{ data.libelle }}
        </h2>
        <mat-dialog-content class="promo-dialog-content">
            <div class="promo-meta">
                <span class="badge-discount">{{ data.pourcentage }}% de remise</span>
                <span class="date-range">
                    <i class="ri-calendar-line"></i>
                    {{ data.dateDebut | date:'dd/MM/yyyy' }} &rarr; {{ data.dateFin | date:'dd/MM/yyyy' }}
                </span>
            </div>

            <div class="section-header">
                <i class="ri-shopping-bag-line"></i> Articles associés
            </div>

            <div *ngIf="data.details && data.details.length > 0; else noArticles" class="articles-list">
                <div class="article-item" *ngFor="let detail of data.details">
                    <div class="article-left">
                        <div class="article-name">{{ detail.title }}</div>
                        <div class="article-category">
                            <i class="ri-folder-3-line"></i>
                            {{ detail.categories.libelle || 'Catégorie non définie' }}
                        </div>
                    </div>
                    <div class="article-price">{{ detail.prix | number:'1.2-2' }} €</div>
                </div>
            </div>

            <ng-template #noArticles>
                <div class="no-articles">
                    <i class="ri-inbox-2-line"></i>
                    <p>Aucun article associé à cette promotion</p>
                </div>
            </ng-template>
        </mat-dialog-content>
        <mat-dialog-actions class="promo-dialog-actions">
            <button mat-flat-button color="primary" (click)="close()">OK</button>
        </mat-dialog-actions>
    `,
    styles: [`
        .promo-dialog-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 18px;
            font-weight: 700;
            color: #111827;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 12px;
            margin-bottom: 0;
        }
        .promo-dialog-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: #fff;
            font-size: 16px;
            flex-shrink: 0;
        }
        .promo-dialog-content {
            min-width: 420px;
            max-width: 580px;
            padding: 16px 24px;
        }
        .promo-meta {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 20px;
        }
        .badge-discount {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: #fff;
            padding: 5px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            white-space: nowrap;
        }
        .date-range {
            color: #6b7280;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .section-header {
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #6b7280;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .articles-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: 340px;
            overflow-y: auto;
        }
        .article-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 14px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            transition: background 0.15s;
        }
        .article-item:hover {
            background: #f3f4f6;
        }
        .article-left {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
        .article-name {
            font-size: 14px;
            font-weight: 600;
            color: #111827;
        }
        .article-category {
            font-size: 12px;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .article-price {
            font-size: 14px;
            font-weight: 700;
            color: #6366f1;
            white-space: nowrap;
        }
        .no-articles {
            text-align: center;
            padding: 36px 16px;
            color: #9ca3af;
        }
        .no-articles i {
            font-size: 40px;
            display: block;
            margin-bottom: 10px;
        }
        .no-articles p {
            font-size: 14px;
            margin: 0;
        }
        .promo-dialog-actions {
            padding: 12px 24px 16px;
            justify-content: flex-end;
            border-top: 1px solid #e5e7eb;
        }
    `]
})
export class EPromotionDetailDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<EPromotionDetailDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: PromotionDetailData
    ) {}

    close(): void {
        this.dialogRef.close();
    }
}

import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FeathericonsModule } from '../../../../icons/feathericons/feathericons.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { NgFor, NgIf } from '@angular/common';
import { Avis } from '../../../../models/articles/avis-model';
import { AvisService } from '../../../../services/avis.service';

@Component({
    selector: 'app-reviews',
    standalone: true,
    imports: [
        MatCardModule,
        MatButtonModule,
        MatPaginatorModule,
        MatTableModule,
        FeathericonsModule,
        MatProgressBarModule,
        MatMenuModule,
        NgIf
    ],
    templateUrl: './reviews.component.html',
    styleUrl: './reviews.component.scss'
})
export class ReviewsComponent {

    displayedColumns: string[] = ['reviewer', 'ratings', 'date', 'status', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>([]);

    articleId: string | null = null;
    isLoading = false;

    articleTitle: string = '';
    articleImage: string = '';
    totalReviews: number = 0;
    averageRating: number = 0;
    overallStars: any[] = [];
    ratingCount: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        private avisService: AvisService
    ) {}

    ngOnInit(): void {
        this.articleId = this.route.snapshot.paramMap.get('id');

        if (this.articleId) {
            this.loadAvisByArticle(this.articleId);
        }
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    loadAvisByArticle(articleId: string): void {
        this.isLoading = true;

        this.avisService.getAvisByArticleId(articleId).subscribe({
            next: (data: Avis[]) => {
                if (data && data.length > 0) {
                    this.articleTitle = data[0]?.articles?.title || 'Produit';
                    this.articleImage = data[0]?.articles?.images?.url || '';
                }

                const ratingResult = this.avisService.computeRatings(data);
                this.totalReviews = ratingResult.totalReviews;
                this.averageRating = ratingResult.averageRating;
                this.overallStars = ratingResult.overallStars;
                this.ratingCount = ratingResult.ratingCount;

                const mappedData: PeriodicElement[] = data.map((avis: any) => ({
                    reviewer: {
                        name: avis.users?.firstname + ' ' + avis.users?.lastname || 'Utilisateur inconnu',
                        email: avis.users?.email || ''
                    },
                    ratings: {
                        stars: this.avisService.buildStars(avis.etoile || 0),
                        review: avis.commentaire || ''
                    },
                    date: {
                        date: this.formatDate(avis.dateCreation),
                        time: this.formatTime(avis.dateCreation)
                    },
                    status: {
                        pending: avis.statut === 'PENDING' ? 'Pending' : null,
                        published: avis.statut === 'PUBLISHED' || !avis.statut ? 'Published' : null
                    },
                    action: 'ri-more-fill'
                }));

                this.dataSource.data = mappedData;

                if (this.paginator) {
                    this.dataSource.paginator = this.paginator;
                }

                this.isLoading = false;
            },
            error: (error) => {
                console.error('Erreur lors du chargement des avis :', error);
                this.isLoading = false;
            }
        });
    }

    ratingPercent(star: number): number {
        if (!this.totalReviews) {
            return 0;
        }
        return ((this.ratingCount[star] || 0) * 100) / this.totalReviews;
    }

    formatDate(dateValue: any): string {
        if (!dateValue) {
            return '';
        }

        const date = new Date(dateValue);

        if (isNaN(date.getTime())) {
            return '';
        }

        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    formatTime(dateValue: any): string {
        if (!dateValue) {
            return '';
        }

        const date = new Date(dateValue);

        if (isNaN(date.getTime())) {
            return '';
        }

        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

export interface PeriodicElement {
    reviewer: {
        name: string;
        email: string;
    };
    ratings: {
        stars: any[];
        review: string;
    };
    date: {
        date: string;
        time: string;
    };
    status: {
        pending?: string | null;
        published?: string | null;
    };
    action: string;
}
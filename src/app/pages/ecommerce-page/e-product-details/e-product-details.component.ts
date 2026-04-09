import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { Articles } from '../../../models/articles/articles-model';
import { Images } from '../../../models/articles/images-model';
import { ColorImage } from '../../../models/articles/color-image-model';
import { ArticleService } from '../../../services/article.service';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { CarouselModule, OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { ReviewsComponent } from './reviews/reviews.component';
import { AvisService } from '../../../services/avis.service';
import { DialogAnimationsExampleDialog } from '../../../ui-elements/dialog/dialog-animations/dialog-animations.component';
import { ColonneArticle } from '../e-products-list/e-products-list.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-e-product-details',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatCardModule,
        FeathericonsModule,
        CarouselModule,
        ReviewsComponent
    ],
    templateUrl: './e-product-details.component.html',
    styleUrl: './e-product-details.component.scss'
})
export class EProductDetailsComponent {

    articleId: string | null = null;
    article: Articles = new Articles();

    timestamp: number = Date.now();
    err: any;

    productImages: { url: string }[] = [];
    selectedImage: string | null = null;

    colorImages: ColorImage[] = [];
    selectedColorId: number | null = null;

    showMessage = false;
    showMessage2 = false;

    customOptions: OwlOptions = {
        loop: false,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: false,
        dots: false,
        navSpeed: 700,
        nav: false,
        items: 1
    };

    totalReviews: number = 0;
    averageRating: number = 0;
    overallStars: { star: string }[] = [];
    ratingCount: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    thumbnailOptions: OwlOptions = {
        loop: false,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: false,
        dots: false,
        navSpeed: 700,
        nav: false,
        autoWidth: true,
        margin: 10
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private articleService: ArticleService,
        private avisService: AvisService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.articleId = this.route.snapshot.paramMap.get('id');

        if (this.articleId) {
            this.loadArticleDetails(this.articleId);
        }
    }

    loadArticleDetails(id: string): void {
        this.articleService.getArticleById(id).subscribe({
            next: (data: Articles) => {
                this.article = data;

                if (data.images?.url) {
                    const imageUrl = data.images.url + '?t=' + this.timestamp;
                    this.productImages = [{ url: imageUrl }];
                    this.selectedImage = imageUrl;
                } else {
                    this.productImages = [];
                    this.selectedImage = null;
                }
                this.loadAvisByArticle(id);
                this.loadColorImages(id);
            },
            error: (error) => {
                this.err = error;
                console.error('Erreur lors du chargement du produit :', error);
            }
        });
    }

    loadColorImages(articleId: string): void {
        this.articleService.getImagesByArticleId(articleId).subscribe({
            next: (images: ColorImage[]) => {
                this.colorImages = images || [];
                this.productImages = this.buildAllImages();
            },
            error: () => {
                this.colorImages = [];
            }
        });
    }

    private buildAllImages(): { url: string }[] {
        const mainImage = this.article.images?.url
            ? [{ url: this.article.images.url + '?t=' + this.timestamp }]
            : [];

        const colorImageUrls = this.colorImages
            .filter(ci => ci.imagesVo?.url)
            .map(ci => ({ url: ci.imagesVo.url + '?t=' + this.timestamp }));

        return [...mainImage, ...colorImageUrls];
    }

    loadAvisByArticle(articleId: string): void {
        this.avisService.getAvisByArticleId(articleId).subscribe({
            next: (avisList) => {
                const ratingResult = this.avisService.computeRatings(avisList || []);
                this.totalReviews = ratingResult.totalReviews;
                this.averageRating = ratingResult.averageRating;
                this.overallStars = ratingResult.overallStars;
                this.ratingCount = ratingResult.ratingCount;
            },
            error: (error) => {
                console.error('Erreur lors du chargement des avis :', error);
                this.totalReviews = 0;
                this.averageRating = 0;
                this.overallStars = [];
                this.ratingCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            }
        });
    }

    changeimage(image: string): void {
        this.selectedImage = image;
    }

    selectColor(colorImage: ColorImage): void {
        this.selectedColorId = colorImage.couleursVo?.id ?? null;

        const imagesForColor = this.colorImages
            .filter(ci => ci.couleursVo?.id === this.selectedColorId && ci.imagesVo?.url)
            .map(ci => ({ url: ci.imagesVo.url + '?t=' + this.timestamp }));

        if (imagesForColor.length > 0) {
            this.productImages = imagesForColor;
            this.selectedImage = imagesForColor[0].url;
        } else if (colorImage.imagesVo?.url) {
            const imageUrl = colorImage.imagesVo.url + '?t=' + this.timestamp;
            this.productImages = [{ url: imageUrl }];
            this.selectedImage = imageUrl;
        }
    }

    selectNoColor(): void {
        this.selectedColorId = null;
        this.productImages = this.buildAllImages();

        if (this.productImages.length > 0) {
            this.selectedImage = this.productImages[0].url;
        }
    }

    scrollToReviews(): void {
        const el = document.getElementById('reviews-section');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }

    retourListe(): void {
        this.router.navigate(['/ecommerce-page/products-list']);
    }

    openDeleteDialog(): void {
        const dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
            width: '500px',
            data: { name: this.article?.title }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteItem();
            }
        });
    }

    deleteItem(): void {
        if (!this.article?.id) {
            return;
        }

        this.articleService.deleteArticle(this.article.id.toString()).subscribe(
            (response) => {
                this.showMessage = true;
                this.err = "Article supprimée avec succès !";

                setTimeout(() => {
                    this.err = null;
                    this.showMessage = false;
                }, 1500);

                this.router.navigate(['/ecommerce-page/products-list']);
            },
            (err) => {
                this.showMessage2 = true;
                this.err = "Echec lors de la suppression de l'article";

                setTimeout(() => {
                    this.err = null;
                    this.showMessage2 = false;
                }, 1500);
            }
        );
    }

    getArticleStock(quantite: number) {

    if (quantite <= 0) {
        return {
            label: 'En Rupture',
            class: 'rejected'
        };
    }

    if (quantite <= 10) {
        return {
            label: 'En Limite',
            class: 'pending'
        };
    }

    return {
        label: 'En stock',
        class: 'published'
    };
}
}
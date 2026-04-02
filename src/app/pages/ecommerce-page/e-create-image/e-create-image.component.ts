import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe, CommonModule } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Articles } from '../../../models/articles/articles-model';
import { Couleurs } from '../../../models/articles/couleurs-model';
import { ArticleService } from '../../../services/article.service';
import { CouleurService } from '../../../services/couleur.service';
import { BasicSnackbarComponent } from '../../../ui-elements/snackbar/basic-snackbar/basic-snackbar.component';

@Component({
    selector: 'app-e-create-image',
    standalone: true,
    imports: [
        RouterLink,
        MatCardModule,
        MatButtonModule,
        MatMenuModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        FeathericonsModule,
        MatDatepickerModule,
        MatSelectModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        AsyncPipe,
        CommonModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './e-create-image.component.html',
    styleUrl: './e-create-image.component.scss'
})
export class ECreateImageComponent {

    imageForm: FormGroup;
    imageId: string | null = null;
    bouton: string = 'Ajouter';
    titre: string = 'Ajouter Image';

    articles: Articles[] = [];
    couleurs: Couleurs[] = [];

    filteredArticles: Observable<Articles[]> | undefined;
    filteredCouleurs: Observable<Couleurs[]> | undefined;

    uploadedImage!: File;
    imagePath: string | ArrayBuffer | null = null;
    timestamp: number = Date.now();

    isLoading = false;

    constructor(
        private formBuilder: FormBuilder,
        private articleService: ArticleService,
        private couleurService: CouleurService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) { }

    showSuccess(message: string): void {
        this.snackBar.openFromComponent(BasicSnackbarComponent, {
            data: message,
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['custom-snackbar-container']
        });
    }

    showError(message: string): void {
        this.snackBar.open(message, '', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
        });
    }

    ngOnInit(): void {
        this.imageId = this.route.snapshot.paramMap.get('id');

        Promise.all([
            this.loadArticles(),
            this.loadCouleurs(),
        ]).then(() => {
            this.imageForm = this.formBuilder.group({
                article: ['', [Validators.required]],
                couleur: ['', [Validators.required]],
                img: [null, this.imageId ? [] : [Validators.required]],
            });

            this.filteredArticles = this.imageForm.get('article')?.valueChanges.pipe(
                startWith(null),
                map(value => this.filterArticles(value))
            );

            this.filteredCouleurs = this.imageForm.get('couleur')?.valueChanges.pipe(
                startWith(null),
                map(value => this.filterCouleurs(value))
            );

            if (this.imageId) {
                this.bouton = 'Modifier';
                this.titre = 'Modifier Image';
            }
        });
    }

    filterArticles(value: any): Articles[] {
        if (!value || (typeof value === 'object' && !value.title)) {
            return this.articles;
        }
        const filterValue = typeof value === 'string'
            ? value.toLowerCase()
            : value?.title?.toLowerCase() || '';
        return this.articles.filter(a => a?.title?.toLowerCase().includes(filterValue));
    }

    filterCouleurs(value: any): Couleurs[] {
        if (!value || (typeof value === 'object' && !value.couleur)) {
            return this.couleurs;
        }
        const filterValue = typeof value === 'string'
            ? value.toLowerCase()
            : value?.couleur?.toLowerCase() || '';
        return this.couleurs.filter(c => c?.couleur?.toLowerCase().includes(filterValue));
    }

    displayArticle(article: Articles): string {
        return article ? article.title : '';
    }

    displayCouleur(couleur: Couleurs): string {
        return couleur ? couleur.couleur : '';
    }

    onImageUpload(event: Event): void {
        const input = event.target as HTMLInputElement;

        if (input?.files && input.files.length > 0) {
            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                const img = new Image();

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    if (!ctx) return;

                    canvas.width = 605;
                    canvas.height = 640;
                    ctx.drawImage(img, 0, 0, 605, 640);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            this.uploadedImage = new File(
                                [blob],
                                file.name,
                                { type: file.type || 'image/jpeg' }
                            );
                            this.imagePath = URL.createObjectURL(this.uploadedImage);
                            this.imageForm.patchValue({ img: this.uploadedImage });
                        }
                    }, file.type || 'image/jpeg', 0.95);
                };

                img.src = reader.result as string;
            };

            reader.onerror = (error) => {
                console.error(error);
            };

            reader.readAsDataURL(file);
        }
    }

    onSubmit(): void {
        this.imageForm.markAllAsTouched();

        if (!this.imageId && !this.uploadedImage) {
            this.showError('Veuillez sélectionner une image ❗');
            return;
        }

        const article = this.imageForm.get('article')?.value;
        const couleur = this.imageForm.get('couleur')?.value;

        if (!article?.id || !couleur?.id) {
            this.showError('Article et couleur sont obligatoires ❗');
            return;
        }

        if (!this.imageId && this.imageForm.invalid) {
            return;
        }

        const formData = new FormData();
        if (this.uploadedImage) {
            formData.append('img', this.uploadedImage, this.uploadedImage.name);
        }
        formData.append('article_id', article.id.toString());
        formData.append('couleur_id', couleur.id.toString());

        this.isLoading = true;

        if (this.imageId) {
            this.articleService.updateImageAvecCouleur(this.imageId, formData).subscribe(
                () => {
                    setTimeout(() => {
                        this.isLoading = false;
                        this.showSuccess('Image mise à jour avec succès ✅');
                        this.router.navigate(['/ecommerce-page/products-list']);
                        this.imageForm.reset();
                    }, 2000);
                },
                (error) => {
                    this.isLoading = false;
                    this.showError('Erreur lors de la mise à jour ❌');
                    console.error(error);
                }
            );
        } else {
            this.articleService.uploadImageAvecCouleur(formData).subscribe(
                () => {
                    this.isLoading = false;
                    this.showSuccess('Image ajoutée avec succès ✅');
                    this.router.navigate(['/ecommerce-page/products-list']);
                    this.imageForm.reset();
                },
                (error) => {
                    this.isLoading = false;
                    this.showError('Erreur lors de l\'ajout de l\'image ❌');
                    console.error(error);
                }
            );
        }
    }

    annuler(): void {
        this.router.navigate(['/ecommerce-page/products-list']);
    }

    loadArticles(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.articleService.getArticles().subscribe({
                next: (data) => {
                    this.articles = data;
                    resolve();
                },
                error: (err) => reject(err),
            });
        });
    }

    loadCouleurs(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.couleurService.getCouleurs().subscribe({
                next: (data) => {
                    this.couleurs = data;
                    resolve();
                },
                error: (err) => reject(err),
            });
        });
    }
}

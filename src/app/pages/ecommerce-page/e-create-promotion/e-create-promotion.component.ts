import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { Promotions } from '../../../models/achats/promotions-model';
import { PromotionsDetails } from '../../../models/achats/promotionsDetails-model';
import { PromotionsService } from '../../../services/promotions.service';
import { ArticleService } from '../../../services/article.service';
import { Articles } from '../../../models/articles/articles-model';

@Component({
    selector: 'app-e-create-promotion',
    standalone: true,
    imports: [
        MatCardModule,
        MatButtonModule,
        MatMenuModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        FeathericonsModule,
        NgxEditorModule,
        MatDatepickerModule,
        MatSelectModule,
        ReactiveFormsModule,
        CommonModule,
        MatNativeDateModule
    ],
    providers: [
        provideNativeDateAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    ],
    templateUrl: './e-create-promotion.component.html',
    styleUrl: './e-create-promotion.component.scss'
})
export class ECreatePromotionComponent {

    promotionForm: FormGroup;
    promotion: Promotions = new Promotions();
    articles: Articles[] = [];
    err!: any;
    showMessage = false;
    showMessage2 = false;
    promotionId: string | null = null;
    bouton: string = "Ajouter";
    titre: string = "Ajouter Promotion";

    // Text Editor
    editor: Editor;
    html = '';
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['link', 'image'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    constructor(
        private formBuilder: FormBuilder,
        private promotionsService: PromotionsService,
        private articleService: ArticleService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.promotionForm = this.formBuilder.group({
            libelle: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s\-'éèêëàâùûüôîïç]+$/)]],
            pourcentage: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
            dateDebut: ['', [Validators.required]],
            dateFin: ['', [Validators.required]],
            description: [''],
            articlesIds: [[]]
        });

        this.articleService.getArticles().subscribe(
            (data: Articles[]) => { this.articles = data; },
            (err: any) => { console.error('Error fetching articles', err); }
        );

        this.promotionId = this.route.snapshot.paramMap.get('id');
        if (this.promotionId) {
            this.bouton = "Modifier";
            this.titre = "Modifier Promotion";
            this.promotionsService.getPromotionById(this.promotionId).subscribe((data: Promotions) => {
                this.promotion = data;
                this.promotionForm.patchValue({
                    libelle: this.promotion.libelle,
                    pourcentage: this.promotion.pourcentage,
                    dateDebut: this.promotion.dateDebut,
                    dateFin: this.promotion.dateFin,
                    description: this.promotion.description,
                });
            });
            this.promotionsService.getArticlesByPromotionId(this.promotionId).subscribe((details: PromotionsDetails[]) => {
                const ids = details.map(d => d.article.id);
                this.promotionForm.patchValue({ articlesIds: ids });
            });
        }

        this.editor = new Editor();
    }

    ngOnDestroy(): void {
        this.editor.destroy();
    }

    onSubmit(): void {
        this.promotionForm.markAllAsTouched();

        const libelleControl = this.promotionForm.get('libelle')?.value || '';
        const pourcentageControl = this.promotionForm.get('pourcentage')?.value || '';
        const dateDebutControl = this.promotionForm.get('dateDebut')?.value || '';
        const dateFinControl = this.promotionForm.get('dateFin')?.value || '';
        const descriptionControl = this.promotionForm.get('description')?.value || '';
        const articlesIds: number[] = this.promotionForm.get('articlesIds')?.value || [];

        if (libelleControl && pourcentageControl && dateDebutControl && dateFinControl) {
            const formData = new FormData();
            if (this.promotionId) {
                formData.append('id', this.promotionId);
            }
            const toYyyyMmDd = (v: any) => {
            if (!v) return '';
            if (typeof v === 'string') return v.slice(0, 10);
            const d = v instanceof Date ? v : new Date(v);
            return d.toISOString().slice(0, 10);
            };
            formData.append('libelle', libelleControl);
            formData.append('pourcentage', pourcentageControl);
            formData.append('dateDebut', toYyyyMmDd(dateDebutControl));
            formData.append('dateFin', toYyyyMmDd(dateFinControl));
            formData.append('description', descriptionControl);
            articlesIds.forEach(id => formData.append('articlesIds', String(id)));

            if (this.promotionId) {
                this.promotionsService.updatePromotion(this.promotionId, formData).subscribe(
                    (response: any) => {
                        this.promotionsService.setPromotion(response);
                        this.showMessage = true;
                        this.err = "Promotion mise à jour";
                        setTimeout(() => {
                            this.err = null;
                            this.router.navigate(["/ecommerce-page/promotion-list"]);
                            this.promotionForm.reset();
                            this.showMessage = false;
                        }, 1500);
                    },
                    (error: any) => {
                        if (error.error?.errorCode === "SAME_NAME") {
                            this.err = "Cette promotion existe déjà";
                        } else {
                            this.err = "Echec lors de la mise à jour";
                        }
                        this.showMessage2 = true;
                        setTimeout(() => {
                            this.err = null;
                            this.showMessage2 = false;
                        }, 1500);
                    }
                );
            } else if (this.promotionForm.valid) {
                this.promotionsService.savePromotion(formData).subscribe(
                    (response: any) => {
                        this.promotionsService.setPromotion(response);
                        this.showMessage = true;
                        this.err = "Promotion Enregistrée";
                        setTimeout(() => {
                            this.err = null;
                            this.router.navigate(["/ecommerce-page/promotion-list"]);
                            this.promotionForm.reset();
                            this.showMessage = false;
                        }, 1500);
                    },
                    (error: any) => {
                        if (error.error?.errorCode === "SAME_NAME") {
                            this.err = "Cette promotion existe déjà";
                        } else {
                            this.err = "Echec lors de l'enregistrement";
                        }
                        this.showMessage2 = true;
                        setTimeout(() => {
                            this.err = null;
                            this.showMessage2 = false;
                        }, 1500);
                    }
                );
            } else {
                console.error('Form is invalid');
            }
        }
    }

    annuler(): void {
        this.router.navigate(["/ecommerce-page/promotion-list"]);
    }
}
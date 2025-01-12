import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe, CommonModule } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import { Articles } from '../../../models/articles/articles-model';
import { ArticleService } from '../../../services/article.service';
import { CategorieService } from '../../../services/categorie.service';
import { MarqueService } from '../../../services/marque.service';
import { TagService } from '../../../services/tag.service';
import { BoutiqueService } from '../../../services/boutique.service';
import { Marques } from '../../../models/articles/marques-model';
import { Categories } from '../../../models/articles/categories-model';
import { Boutiques } from '../../../models/articles/boutiques-model';
import { Tags } from '../../../models/articles/tags-model';

export interface User {
    name: string;
}

@Component({
    selector: 'app-e-create-product',
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
        FileUploadModule, 
        MatSelectModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        AsyncPipe,
        CommonModule,
        FeathericonsModule
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './e-create-product.component.html',
    styleUrl: './e-create-product.component.scss'
})
export class ECreateProductComponent {

    // Display Value
    myControl = new FormControl<string | User>('');
    options: User[] = [{name: 'Mary'}, {name: 'Shelley'}, {name: 'Igor'}];
    filteredOptions: Observable<User[]>;
    articleForm: FormGroup;
    article: Articles = new Articles();
    uploadedImage!: File;
    imagePath: string | ArrayBuffer | null;
    err!: any;
    showMessage = false;
    showMessage2 = false;
    articleId: string | null = null;
    bouton: string = "Ajouter";
    titre: string = "Ajouter Article";
    description: string = '';
    // Observables pour les options filtrées
    filteredCategories: Observable<any[]> | undefined;
    filteredMarques: Observable<any[]> | undefined;
    filteredBoutiques: Observable<any[]> | undefined;
    filteredTags: Observable<any[]> | undefined;

    // Déclarations des listes de catégories et de marques
  categories: Categories[] = [];
  marques: Marques[] = [];
  boutiques: Boutiques[] = [];
  tags: Tags[] = [];

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
        private articleService: ArticleService,
        private categorieService: CategorieService,
        private marqueService: MarqueService,
        private tagService: TagService,
        private boutiqueService: BoutiqueService,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit(): void {
        this.loadMarques();
        this.loadCategories();
        this.loadBoutiques();
        this.loadTags();
        // Récupérer l'ID de la categorie à partir de l'URL
        this.editor = new Editor();
        this.articleId = this.route.snapshot.paramMap.get('id');
        if (this.articleId) {
            this.bouton = "Modifier";
            this.titre = "Modifier Article"
            this.articleForm = this.formBuilder.group({
                categorie: [''],
                quantite: [''],
                prix: [''],
                marque: [''],
                boutique: [''],
                description: [''],
                tags: [''],
                title: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s\-']+$/)]],
                img: [null],
            });
            // Charger les données de la categorie si un ID est présent
            this.articleService.getArticleById(this.articleId).subscribe((data: Articles) => {
                this.article = data;
                this.articleForm.patchValue({
                    libelle: this.article.title,
                    // Remplissez d'autres champs de formulaire ici
                });
                this.imagePath = data.images?.url;
            });
        } else {

            this.articleForm = this.formBuilder.group({
                title: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s\-']+$/)]],
                quantite: [''],
                prix: [''],
                categorie: [''],
                marque: [''],
                boutique: [''],
                description: [''],
                tags: [''],
                img: [null, Validators.required],
            });
            this.loadMarques().then(() => {
                // Exécutez la logique après chargement des marques
                this.filteredMarques = this.articleForm.get('marque')?.valueChanges.pipe(
                    startWith(''),
                    map(value => this.filterOptions(value || '', this.marques))
                );
            });
            this.loadCategories().then(() => {
                // Exécutez la logique après chargement des marques
                this.filteredCategories = this.articleForm.get('categorie')?.valueChanges.pipe(
                    startWith(''),
                    map(value => this.filterOptions(value || '', this.categories))
                );
            });
            this.loadBoutiques().then(() => {
                // Exécutez la logique après chargement des marques
                this.filteredBoutiques = this.articleForm.get('boutique')?.valueChanges.pipe(
                    startWith(''),
                    map(value => this.filterOptionsNom(value || '', this.boutiques))
                );
            });
            this.loadTags().then(() => {
                // Exécutez la logique après chargement des marques
                this.filteredTags = this.articleForm.get('tags')?.valueChanges.pipe(
                    startWith(''),
                    map(value => this.filterOptionsNom(value || '', this.tags))
                );
            });
        }

    }

    // Fonction pour filtrer les options basées sur la saisie de l'utilisateur
    filterOptions(value: string | null | undefined, options: any[]): any[] {
        // S'assurer que value est bien une chaîne avant d'appliquer toLowerCase()
        const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    
        return options.filter(option => {
            // Vérifier que l'option a bien un libelle et que c'est une chaîne avant d'appeler toLowerCase()
            return option?.libelle && typeof option.libelle === 'string' 
                ? option.libelle.toLowerCase().includes(filterValue)
                : false;
        });
    }

    // Fonction pour filtrer les options basées sur la saisie de l'utilisateur
    filterOptionsNom(value: string | null | undefined, options: any[]): any[] {
        // S'assurer que value est bien une chaîne avant d'appliquer toLowerCase()
        const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    
        return options.filter(option => {
            // Vérifier que l'option a bien un libelle et que c'est une chaîne avant d'appeler toLowerCase()
            return option?.nom && typeof option.nom === 'string' 
                ? option.nom.toLowerCase().includes(filterValue)
                : false;
        });
    }

    displayLibelle(lib: any): string {
        return lib ? lib.libelle : ''; // Affiche uniquement le libelle
    }

    displayNom(name: any): string {
        return name ? name.nom : ''; // Affiche uniquement le nom
    }
    

    // make sure to destory the editor
    ngOnDestroy(): void {
        this.editor.destroy();
    }

    onSubmit(): void {

        this.articleForm.markAllAsTouched();

        const formData = new FormData();
        // Si l'utilisateur a sélectionné une nouvelle image
        if (this.uploadedImage) {
            formData.append('img', this.uploadedImage, this.uploadedImage.name);
        }

        const libelleControl = this.articleForm.get('title');

        if (libelleControl) {
            formData.append('id', this.articleId || '');
            formData.append('title', libelleControl.value || '');
        }

        if (this.articleId) {
            this.articleService.updateImageFSArticle(this.articleId, formData).subscribe(
                (response: any) => {
                    this.articleService.setArticle(response);
                    this.showMessage = true;
                    this.err = "Article mise à jour";
                    setTimeout(() => {
                        this.err = null;
                        this.router.navigate(["/ecommerce-page/product-details"]);
                        this.articleForm.reset();
                        this.showMessage = false;
                    }, 1500);
                },
                (error) => {
                    if (error.error.errorCode == "SAME_NAME") {
                        this.err = "Cet article existe déjà";
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

        } else if (this.articleForm.valid) {
            // Création d'une nouvelle categorie
            this.articleService.uploadImageFSArticle(formData).subscribe(
                (response: any) => {
                    this.articleService.setArticle(response);
                    this.showMessage = true;
                    this.err = "Article Enregistré";
                    setTimeout(() => {
                        this.err = null;
                        this.router.navigate(["/ecommerce-page/product-details"]);
                        this.articleForm.reset();
                        this.showMessage = false;
                    }, 1500);
                },
                (error) => {

                    if (error.error.errorCode == "SAME_NAME") {
                        this.err = "Cette article existe déjà";
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
            console.error('Form controls not found or form is invalid');
        }
    }

    onImageUpload(event: Event): void {
        const input = event.target as HTMLInputElement;

        if (input?.files && input.files.length > 0) {
            this.uploadedImage = input.files[0];

            const reader = new FileReader();
            reader.readAsDataURL(this.uploadedImage);

            reader.onload = () => {
                this.imagePath = reader.result as string;
            };

            reader.onerror = (error) => {
            };
        }
    }

    loadMarques(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.marqueService.getMarques().subscribe({
                next: (data) => {
                    this.marques = data;
                    resolve(); // Résout la promesse après chargement
                },
                error: (err) => {
                    reject(err); // Rejette la promesse en cas d'erreur
                },
            });
        });
    }

    loadBoutiques(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.boutiqueService.getBoutiques().subscribe({
                next: (data) => {
                    this.boutiques = data;
                    resolve(); // Résout la promesse après chargement
                },
                error: (err) => {
                    reject(err); // Rejette la promesse en cas d'erreur
                },
            });
        });
    }
    
    loadCategories(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.categorieService.getCategories().subscribe({
                next: (data) => {
                    this.categories = data;
                    resolve(); // Résout la promesse après chargement
                },
                error: (err) => {
                    reject(err); // Rejette la promesse en cas d'erreur
                },
            });
        });
    }
    
    loadTags(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.tagService.getTags().subscribe({
                next: (data) => {
                    this.tags = data;
                    resolve(); // Résout la promesse après chargement
                },
                error: (err) => {
                    reject(err); // Rejette la promesse en cas d'erreur
                },
            });
        });
    }

}
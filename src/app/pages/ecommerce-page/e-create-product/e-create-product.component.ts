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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BasicSnackbarComponent } from '../../../ui-elements/snackbar/basic-snackbar/basic-snackbar.component';


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
        MatSnackBarModule,
        FeathericonsModule,
        MatProgressSpinnerModule
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
    timestamp: number = Date.now();
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
    isLoading = false;


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
        private route: ActivatedRoute,
        private snackBar: MatSnackBar ) {

    }

    showSuccess(message: string): void {
      this.snackBar.openFromComponent(BasicSnackbarComponent, {
        data: message,
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar-container'] // tu peux le laisser vide ou ajouter une marge si tu veux
      });
    }
    
      
    showError(message: string): void {
      this.snackBar.open(message, '', { // ➔ PAS DE BOUTON
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
    }
      

    ngOnInit(): void {
        this.editor = new Editor();
        this.articleId = this.route.snapshot.paramMap.get('id');
      
        Promise.all([
          this.loadMarques(),
          this.loadCategories(),
          this.loadBoutiques(),
          this.loadTags()
        ]).then(() => {
          // Une fois que tout est chargé...
          this.articleForm = this.formBuilder.group({
            title: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s\-']+$/)]],
            quantite: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
            prix: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
            categorie: ['', [Validators.required]],
            marque: ['', [Validators.required]],
            boutique: ['', [Validators.required]],
            description: ['', [Validators.required]],
            tags: ['', [Validators.required]],
            img: [null],
          });
      
          // Initialiser les filtered après avoir les données
          this.filteredMarques = this.articleForm.get('marque')?.valueChanges.pipe(
            startWith(null),
            map(value => this.filterOptions(value, this.marques))
          );
          this.filteredCategories = this.articleForm.get('categorie')?.valueChanges.pipe(
            startWith(null),
            map(value => this.filterOptions(value, this.categories))
          );
          this.filteredBoutiques = this.articleForm.get('boutique')?.valueChanges.pipe(
            startWith(null),
            map(value => this.filterOptionsNom(value, this.boutiques))
          );
          this.filteredTags = this.articleForm.get('tags')?.valueChanges.pipe(
            startWith(null),
            map(value => this.filterOptionsNom(value, this.tags))
          );
      
          // Maintenant si c'est une modification
          if (this.articleId) {
            this.bouton = "Modifier";
            this.titre = "Modifier Article";
      
            this.articleService.getArticleById(this.articleId).subscribe((data: Articles) => {
              this.article = data;
      
              this.articleForm.patchValue({
                title: this.article.title || '',
                quantite: this.article.quantite || '',
                prix: this.article.prix || '',
                marque: this.article.marques || null,
                categorie: this.article.categories || null,
                boutique: this.article.boutiques || null,
                description: this.article.description || '',
                tags: this.article.tags || null,
              });
      
              this.imagePath = data.images?.url + '?t=' + this.timestamp;
            });
          }
        });
      }
      
      filterOptions(value: any, options: any[]): any[] {
        if (!value || (typeof value === 'object' && !value.libelle)) {
          return options; // Aucun filtre : afficher tout
        }
      
        const filterValue = typeof value === 'string'
          ? value.toLowerCase()
          : value?.libelle?.toLowerCase() || '';
      
        return options.filter(option =>
          option?.libelle?.toLowerCase().includes(filterValue)
        );
      }
      
      filterOptionsNom(value: any, options: any[]): any[] {
        if (!value || (typeof value === 'object' && !value.nom)) {
          return options; // Aucun filtre : afficher tout
        }
      
        const filterValue = typeof value === 'string'
          ? value.toLowerCase()
          : value?.nom?.toLowerCase() || '';
      
        return options.filter(option =>
          option?.nom?.toLowerCase().includes(filterValue)
        );
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
        const quantiteControl = this.articleForm.get('quantite');
        const prixControl = this.articleForm.get('prix');
        const descriptionControl = this.articleForm.get('description');
        const marque = this.articleForm.get('marque')?.value;
        const categorie = this.articleForm.get('categorie')?.value;
        const boutique = this.articleForm.get('boutique')?.value;
        const tag = this.articleForm.get('tags')?.value;

        if (libelleControl && quantiteControl && prixControl && descriptionControl) {
            formData.append('id', this.articleId || '');
            formData.append('title', libelleControl.value || '');
            formData.append('quantite', quantiteControl?.value || '');
            formData.append('marque_id', marque?.id || '');
            formData.append('prix', prixControl?.value || '');
            formData.append('categorie_id', categorie?.id || '');
            formData.append('boutique_id', boutique?.id || '');
            formData.append('tag_id', tag?.id || '');
            formData.append('description', descriptionControl?.value || '');
        }

        this.isLoading = true; // ⏳ Activer le spinner

        if (this.articleId) {
            // Modification d'un article              
            this.articleService.updateImageFSArticle(this.articleId, formData).subscribe(
                (response: any) => {
                    this.articleService.setArticle(response);
                    setTimeout(() => {
                      this.isLoading = false; // ❌ Désactiver le spinner
                      this.showSuccess('Article Enregistré avec succès ✅');
                      this.router.navigate(["/ecommerce-page/products-list"]);
                      this.articleForm.reset();
                  }, 2000);
                },
                (error) => {
                  this.isLoading = false; // ❌ Désactiver le spinner même en cas d'erreur
                    if (error.error.errorCode == "SAME_NAME") {
                        this.showError('Cet article existe déjà ❗');
                      } else {
                        this.showError('Erreur lors de l\'enregistrement ❌');
                      }
                }
            );

        } else if (this.articleForm.valid) {
            // Création d'une nouvel article
            
            this.articleService.uploadImageFSArticle(formData).subscribe(
                (response: any) => {
                    this.articleService.setArticle(response);
                    this.showSuccess('Article Enregistré avec succès ✅');
                    this.router.navigate(["/ecommerce-page/products-list"]);
                    this.articleForm.reset();
                },
                (error) => {
                    if (error.error.errorCode == "SAME_NAME") {
                        this.showError('Cet article existe déjà ❗');
                      } else {
                        this.showError('Erreur lors de l\'enregistrement ❌');
                      }
                }
            );
        } else {
            console.error('Form controls not found or form is invalid');
        }
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

                if (!ctx) {
                    return;
                }

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

    annuler() {
        this.router.navigate(["/ecommerce-page/products-list"]);
    }

}
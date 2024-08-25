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
import { Categories } from '../../../models/articles/categories-model';
import { CategorieService } from '../../../services/categorie.service';

export interface User {
    name: string;
}

@Component({
    selector: 'app-e-create-categorie',
    standalone: true,
    imports: [RouterLink,
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
        FeathericonsModule,
        CommonModule
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './e-create-categorie.component.html',
    styleUrl: './e-create-categorie.component.scss'
})
export class ECreateCategorieComponent {

    // Display Value
    myControl = new FormControl<string | User>('');
    options: User[] = [{ name: 'Mary' }, { name: 'Shelley' }, { name: 'Igor' }];
    filteredOptions: Observable<User[]>;
    categorieForm: FormGroup;
    categorie: Categories = new Categories();
    uploadedImage!: File;
    imagePath: string | ArrayBuffer | null;
    err!: any;
    showMessage = false;
    showMessage2 = false;
    categorieId: string | null = null;
    bouton: string = "Ajouter";

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
        private categorieService: CategorieService,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit(): void {
        // Récupérer l'ID de la categorie à partir de l'URL
        this.categorieId = this.route.snapshot.paramMap.get('id');
        console.log("ID :" + this.categorieId);
        if (this.categorieId) {
            this.bouton = "Modifier";
            // Charger les données de la categorie si un ID est présent
            this.categorieService.getCategorieById(this.categorieId).subscribe((data: Categories) => {
                this.categorie = data;
                this.categorieForm.patchValue({
                    libelle: this.categorie.libelle,
                    // Remplissez d'autres champs de formulaire ici
                });
                this.imagePath = data.images?.url;
            });
        }

        this.categorieForm = this.formBuilder.group({
            libelle: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s\-']+$/)]],
            img: [null, Validators.required],
        });

        this.editor = new Editor();
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => {
                const name = typeof value === 'string' ? value : value?.name;
                return name ? this._filter(name as string) : this.options.slice();
            }),
        );
    }

    displayFn(user: User): string {
        return user && user.name ? user.name : '';
    }
    private _filter(name: string): User[] {
        const filterValue = name.toLowerCase();
        return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    // make sure to destory the editor
    ngOnDestroy(): void {
        this.editor.destroy();
    }

    onSubmit(): void {
        
        this.categorieForm.markAllAsTouched();
        
        const formData = new FormData();
        // Si l'utilisateur a sélectionné une nouvelle image
        if (this.uploadedImage) {
            formData.append('img', this.uploadedImage, this.uploadedImage.name);
        }
    
        const libelleControl = this.categorieForm.get('libelle');
    
        if (libelleControl) {
            formData.append('id', this.categorieId || '');
            formData.append('libelle', libelleControl.value || '');
        }
    
        if (this.categorieId) {
            this.categorieForm = this.formBuilder.group({
                libelle: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s\-']+$/)]],
            });
            // Si une nouvelle image est sélectionnée ou le formulaire est valide
                // Mise à jour d'une categorie existante
                this.categorieService.updateImageFSCategorie(this.categorieId, formData).subscribe(
                    (response: any) => {
                        this.categorieService.setCategorie(response);
                        this.showMessage = true;
                        this.err = "Catégorie mise à jour";
                        setTimeout(() => {
                            this.err = null;
                            this.router.navigate(["/ecommerce-page/categorie-details"]);
                            this.categorieForm.reset();
                            this.showMessage = false;
                        }, 1500);
                    },
                    (error) => {
                        this.showMessage2 = true;
                        this.err = "Echec lors de la mise à jour";
                        setTimeout(() => {
                            this.err = null;
                            this.showMessage2 = false;
                        }, 1500);
                    }
                );
            
        } else if (this.categorieForm.valid) {
            // Création d'une nouvelle categorie
            this.categorieService.uploadImageFSCategorie(formData).subscribe(
                (response: any) => {
                    this.categorieService.setCategorie(response);
                    this.showMessage = true;
                    this.err = "Catégorie Enregistrée";
                    setTimeout(() => {
                        this.err = null;
                        this.router.navigate(["/ecommerce-page/categorie-details"]);
                        this.categorieForm.reset();
                        this.showMessage = false;
                    }, 1500);
                },
                (error) => {
                    this.showMessage2 = true;
                    this.err = "Echec de l'enregistrement";
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
                console.error('Error reading file:', error);
            };
        }
    }

}
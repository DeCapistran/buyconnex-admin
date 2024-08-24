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
import { BoutiqueService } from '../../../services/boutique.service';
import { Boutiques } from '../../../models/articles/boutiques-model';

export interface User {
    name: string;
}

@Component({
    selector: 'app-e-create-boutique',
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
    templateUrl: './e-create-boutique.component.html',
    styleUrl: './e-create-boutique.component.scss'
})
export class ECreateBoutiqueComponent {

    // Display Value
    myControl = new FormControl<string | User>('');
    options: User[] = [{ name: 'Mary' }, { name: 'Shelley' }, { name: 'Igor' }];
    filteredOptions: Observable<User[]>;
    boutiqueForm: FormGroup;
    boutique: Boutiques = new Boutiques();
    uploadedImage!: File;
    imagePath: string | ArrayBuffer | null;
    err!: any;
    showMessage = false;
    showMessage2 = false;
    boutiqueId: string | null = null;
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
        private boutiqueService: BoutiqueService,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit(): void {

        // Récupérer l'ID de la boutique à partir de l'URL
        this.boutiqueId = this.route.snapshot.paramMap.get('id');

        if (this.boutiqueId) {
            this.bouton = "Modifier";
            // Charger les données de la boutique si un ID est présent
            this.boutiqueService.getBoutiqueById(this.boutiqueId).subscribe((data: Boutiques) => {
                this.boutique = data;
                this.boutiqueForm.patchValue({
                    nom: this.boutique.nom,
                    email: this.boutique.email,
                    telephone: this.boutique.telephone,
                    // Remplissez d'autres champs de formulaire ici
                });
                this.imagePath = data.images?.url;
            });
        }

        this.boutiqueForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s\-']+$/)]],
            contact: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
            img: [null, Validators.required],
            email: ['', [Validators.required, Validators.email]],
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
        this.boutiqueForm.markAllAsTouched();
        
        const formData = new FormData();
        // Si l'utilisateur a sélectionné une nouvelle image
        if (this.uploadedImage) {
            formData.append('img', this.uploadedImage, this.uploadedImage.name);
        }
    
        const nomControl = this.boutiqueForm.get('name');
        const emailControl = this.boutiqueForm.get('email');
        const telephoneControl = this.boutiqueForm.get('contact');
    
        if (nomControl && emailControl && telephoneControl) {
            formData.append('id', this.boutiqueId || '');
            formData.append('name', nomControl.value || '');
            formData.append('email', emailControl.value || '');
            formData.append('contact', telephoneControl.value || '');
        }
    
        if (this.boutiqueId) {
            this.boutiqueForm = this.formBuilder.group({
                name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s\-']+$/)]],
                contact: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
                email: ['', [Validators.required, Validators.email]],
            });
            // Si une nouvelle image est sélectionnée ou le formulaire est valide
                // Mise à jour d'une boutique existante
                this.boutiqueService.updateImageFSBoutique(this.boutiqueId, formData).subscribe(
                    (response: any) => {
                        this.boutiqueService.setBoutique(response);
                        this.showMessage = true;
                        this.err = "Boutique mise à jour";
                        setTimeout(() => {
                            this.err = null;
                            this.router.navigate(["/ecommerce-page/boutique-details"]);
                            this.boutiqueForm.reset();
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
            
        } else if (this.boutiqueForm.valid) {
            // Création d'une nouvelle boutique
            this.boutiqueService.uploadImageFSBoutique(formData).subscribe(
                (response: any) => {
                    this.boutiqueService.setBoutique(response);
                    this.showMessage = true;
                    this.err = "Boutique Enregistrée";
                    setTimeout(() => {
                        this.err = null;
                        this.router.navigate(["/ecommerce-page/boutique-details"]);
                        this.boutiqueForm.reset();
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
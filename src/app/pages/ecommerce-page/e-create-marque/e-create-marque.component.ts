import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { Marques } from '../../../models/articles/marques-model';
import { MarqueService } from '../../../services/marque.service';

export interface User {
    name: string;
}

@Component({
    selector: 'app-e-create-marque',
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
        FeathericonsModule,
        CommonModule,
        MatNativeDateModule
        
    ],
    templateUrl: './e-create-marque.component.html',
    styleUrl: './e-create-marque.component.scss'
})
export class ECreateMarqueComponent {

    marqueForm: FormGroup;
    marque: Marques = new Marques();
    err!: any;
    showMessage = false;
    showMessage2 = false;
    marqueId: string | null = null;
    bouton: string = "Ajouter";
    titre: string = "Ajouter Marque";

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
        private marqueService: MarqueService,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit(): void {
        this.marqueForm = this.formBuilder.group({
            libelle: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s\-']+$/)]],
            description: ['', [Validators.required]]
        });

        // Récupérer l'ID de la coupon à partir de l'URL
        this.marqueId = this.route.snapshot.paramMap.get('id');
        if (this.marqueId) {
            this.bouton = "Modifier";
            this.titre = "Modifier Marque"
            // Charger les données de la coupon si un ID est présent
            this.marqueService.getMarqueById(this.marqueId).subscribe((data: Marques) => {
                this.marque = data;
                this.marqueForm.patchValue({
                    libelle: this.marque.libelle,
                    description: this.marque.description,
                });
            });
        }

        this.editor = new Editor();
    }

    // make sure to destory the editor
    ngOnDestroy(): void {
        this.editor.destroy();
    }

    onSubmit(): void {
        const formData = new FormData();

        this.marqueForm.markAllAsTouched();
        const libelleControl = this.marqueForm.get('libelle')?.value || '';
        const descriptionControl = this.marqueForm.get('description')?.value || '';
        

        if (libelleControl && descriptionControl) {
                formData.append('id', this.marqueId || '');
                formData.append('libelle', libelleControl || '');
                formData.append('description', descriptionControl || '');
        }

        if (this.marqueId) {
            this.marqueService.updateMarque(this.marqueId, formData).subscribe(
                (response: any) => {
                    this.marqueService.setMarque(response);
                    this.showMessage = true;
                    this.err = "Marque mise à jour";
                    setTimeout(() => {
                        this.err = null;
                        this.router.navigate(["/ecommerce-page/marque-details"]);
                        this.marqueForm.reset();
                        this.showMessage = false;
                    }, 1500);
                },
                (error) => {
                    if (error.error.errorCode == "SAME_NAME") {
                        this.err = "Cette marque existe déjà";
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

        } else if (this.marqueForm.valid) {
            // Création d'une nouvelle marque

            this.marqueService.saveMarque(formData).subscribe(
                (response: any) => {
                    this.marqueService.setMarque(response);
                    this.showMessage = true;
                    this.err = "Marque Enregistrée";
                    setTimeout(() => {
                        this.err = null;
                        this.router.navigate(["/ecommerce-page/marque-details"]);
                        this.marqueForm.reset();
                        this.showMessage = false;
                    }, 1500);
                },
                (error) => {
                    console.error("Erreur complète :", error);
                    if (error.error.errorCode == "SAME_NAME") {
                        this.err = "Cette marque existe déjà";
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
        }
    }
}

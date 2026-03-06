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
import { Tags } from '../../../models/articles/tags-model';
import { TagService } from '../../../services/tag.service';

export interface User {
    name: string;
}

@Component({
    selector: 'app-e-create-tag',
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
    templateUrl: './e-create-tag.component.html',
    styleUrl: './e-create-tag.component.scss'
})
export class ECreateTagComponent {

    tagForm: FormGroup;
    tag: Tags = new Tags();
    err!: any;
    showMessage = false;
    showMessage2 = false;
    tagId: string | null = null;
    bouton: string = "Ajouter";
    titre: string = "Ajouter Tag";

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
        private tagService: TagService,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit(): void {
        this.tagForm = this.formBuilder.group({
            nom: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s\-']+$/)]],
            description: ['', [Validators.required]]
        });

        // Récupérer l'ID de la coupon à partir de l'URL
        this.tagId = this.route.snapshot.paramMap.get('id');
        if (this.tagId) {
            this.bouton = "Modifier";
            this.titre = "Modifier Tag"
            // Charger les données de la coupon si un ID est présent
            this.tagService.getTagById(this.tagId).subscribe((data: Tags) => {
                this.tag = data;
                this.tagForm.patchValue({
                    tag: this.tag.nom,
                    description: this.tag.description,
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

        this.tagForm.markAllAsTouched();
        const nomControl = this.tagForm.get('nom')?.value || '';
        const descriptionControl = this.tagForm.get('description')?.value || '';
        

        if (nomControl && descriptionControl) {
                formData.append('id', this.tagId || '');
                formData.append('nom', nomControl || '');
                formData.append('description', descriptionControl || '');
        }

        if (this.tagId) {
            this.tagService.updateTag(this.tagId, formData).subscribe(
                (response: any) => {
                    this.tagService.setTag(response);
                    this.showMessage = true;
                    this.err = "Tag mise à jour";
                    setTimeout(() => {
                        this.err = null;
                        this.router.navigate(["/ecommerce-page/tag-details"]);
                        this.tagForm.reset();
                        this.showMessage = false;
                    }, 1500);
                },
                (error) => {
                    if (error.error.errorCode == "SAME_NAME") {
                        this.err = "Ce tag existe déjà";
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

        } else if (this.tagForm.valid) {
            // Création d'une nouvelle tag

            this.tagService.saveTag(formData).subscribe(
                (response: any) => {
                    this.tagService.setTag(response);
                    this.showMessage = true;
                    this.err = "Tag Enregistré";
                    setTimeout(() => {
                        this.err = null;
                        this.router.navigate(["/ecommerce-page/tag-details"]);
                        this.tagForm.reset();
                        this.showMessage = false;
                    }, 1500);
                },
                (error) => {
                    console.error("Erreur complète :", error);
                    if (error.error.errorCode == "SAME_NAME") {
                        this.err = "Ce tag existe déjà";
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

    annuler() {
        this.router.navigate(["/ecommerce-page/tag-details"]);
    }
}

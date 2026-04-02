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
import { provideNativeDateAdapter } from '@angular/material/core';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { map, Observable, startWith } from 'rxjs';
import { Coupons } from '../../../models/achats/coupons-model';
import { CouponService } from '../../../services/coupons.service';

export interface User {
    name: string;
}

/*export const MY_DATE_FORMATS = {
    parse: {
      dateInput: 'DD-MM-YYYY',
    },
    display: {
      dateInput: 'DD-MM-YYYY',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'DD-MM-YYYY',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };*/

@Component({
    selector: 'app-e-create-coupon',
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
    providers: [provideNativeDateAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }, // Pour la locale française
        //{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, // Utilisation de votre format personnalisé
    ],
    templateUrl: './e-create-coupon.component.html',
    styleUrl: './e-create-coupon.component.scss'
})
export class ECreateCouponComponent {

    myControl = new FormControl<string | User>('');
    options: User[] = [{ name: 'Mary' }, { name: 'Shelley' }, { name: 'Igor' }];
    filteredOptions: Observable<User[]>;
    couponForm: FormGroup;
    coupon: Coupons = new Coupons();
    uploadedImage!: File;
    imagePath: string | ArrayBuffer | null;
    err!: any;
    showMessage = false;
    showMessage2 = false;
    couponId: string | null = null;
    bouton: string = "Ajouter";
    titre: string = "Ajouter Coupons";

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
        private couponService: CouponService,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit(): void {
        this.couponForm = this.formBuilder.group({
            libelle: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s\-']+$/)]],
            codeCoupon: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)]],
            dateDebut: ['', [Validators.required]],
            dateFin: ['', [Validators.required]],
            pourcentage: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
            montantMin: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        });
        // Récupérer l'ID de la coupon à partir de l'URL
        this.couponId = this.route.snapshot.paramMap.get('id');
        if (this.couponId) {
            this.bouton = "Modifier";
            this.titre = "Modifier Coupon"
            // Charger les données de la coupon si un ID est présent
            this.couponService.getCouponById(this.couponId).subscribe((data: Coupons) => {
                this.coupon = data;
                this.couponForm.patchValue({
                    libelle: this.coupon.libelle,
                    codeCoupon: this.coupon.codeCoupon,
                    dateDebut: this.coupon.dateDebut,
                    dateFin: this.coupon.dateFin,
                    montantMin: this.coupon.montantMinimum,
                    pourcentage: this.coupon.pourcentage,
                    // Remplissez d'autres champs de formulaire ici
                });
            });
        }

        this.editor = new Editor();
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => {
                const name = typeof value === 'string' ? value : value?.name;
                return name ? this._filter(name as string) : this.options.slice();
            }),
        );
    }

    dateValidator(formGroup: FormGroup) {
        const dateDebut = formGroup.get('dateDebut')?.value;
        const dateFin = formGroup.get('dateFin')?.value;
    
        if (dateDebut && dateFin && new Date(dateDebut) > new Date(dateFin)) {
          return { dateInvalid: true };
        }
        return false;
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
        const formData = new FormData();

        this.couponForm.markAllAsTouched();
        const libelleControl = this.couponForm.get('libelle')?.value || '';
        const codeControl = this.couponForm.get('codeCoupon')?.value || '';
        const dateDebutControl = this.couponForm.get('dateDebut')?.value || '';
        const dateFinControl = this.couponForm.get('dateFin')?.value || '';
        const montantMinControl = this.couponForm.get('montantMin')?.value || '';
        const pourcentageControl = this.couponForm.get('pourcentage')?.value || '';

        if (libelleControl && codeControl && dateDebutControl && dateFinControl && montantMinControl && pourcentageControl) {

                formData.append('id', this.couponId || '');
                formData.append('libelle', libelleControl || '');
                formData.append('codeCoupon', codeControl || '');
                formData.append('dateDebut', dateDebutControl || '');
                formData.append('dateFin', dateFinControl || '');
                formData.append('montantMinimum', montantMinControl || '');
                formData.append('pourcentage', pourcentageControl || '');

        if (this.couponId) {
            this.couponService.updateCoupon(this.couponId, formData).subscribe(
                (response: any) => {
                    this.couponService.setCoupon(response);
                    this.showMessage = true;
                    this.err = "Coupon mise à jour";
                    setTimeout(() => {
                        this.err = null;
                        this.router.navigate(["/ecommerce-page/coupon-details"]);
                        this.couponForm.reset();
                        this.showMessage = false;
                    }, 1500);
                },
                (error) => {
                    if (error.error.errorCode == "SAME_NAME") {
                        this.err = "Ce coupon existe déjà";
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

        } else if (this.couponForm.valid) {
            // Création d'une nouvelle coupon
            this.couponService.saveCoupon(formData).subscribe(
                (response: any) => {
                    this.couponService.setCoupon(response);
                    this.showMessage = true;
                    this.err = "Coupon Enregistré";
                    setTimeout(() => {
                        this.err = null;
                        this.router.navigate(["/ecommerce-page/coupon-details"]);
                        this.couponForm.reset();
                        this.showMessage = false;
                    }, 1500);
                },
                (error) => {

                    if (error.error.errorCode == "SAME_NAME") {
                        this.err = "Ce code coupon existe déjà";
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
}

annuler() {
        this.router.navigate(["/ecommerce-page/coupon-details"]);
    }
}
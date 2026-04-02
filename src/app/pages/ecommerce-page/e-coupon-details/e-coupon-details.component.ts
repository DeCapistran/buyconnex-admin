import { Component, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Coupons } from '../../../models/achats/coupons-model';
import { Actions } from '../../../models/utils/actions-model';
import { MatSort } from '@angular/material/sort';
import { CouponService } from '../../../services/coupons.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAnimationsExampleDialog } from '../../../ui-elements/dialog/dialog-animations/dialog-animations.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-coupon-details',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatPaginatorModule, MatTableModule, NgIf, CommonModule],
    templateUrl: './e-coupon-details.component.html',
    styleUrl: './e-coupon-details.component.scss'
})
export class ECouponDetailsComponent {

    displayedColumns: string[] = ['id', 'dateCreation', 'libelle', 'codeCoupon', 'pourcentage', 'montantMin', 'dateDebut', 'dateFin', 'actions'];
    dataSource = new MatTableDataSource<ColonneCoupon>();
    ELEMENT_DATA: ColonneCoupon[] = [];
    coupons: Coupons | undefined = new Coupons();
    actions: Actions | undefined = new Actions();
    err!: any;
    showMessage = false;
    showMessage2 = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private couponService: CouponService, public dialog: MatDialog) {}

    ngAfterViewInit() {
        if (this.sort) {
            this.dataSource.sort = this.sort;
            this.dataSource.sort.sort({ id: 'libelle', start: 'asc', disableClear: false }); // Tri initial par nom
        }
        if (this.paginator) {
            this.dataSource.paginator = this.paginator;
        }
    }

    ngOnInit(): void {
        this.actions = {
            delete: '',
            edit: '',
            view: ''
        };
        this.actions.delete = 'ri-delete-bin-line';
        this.actions.edit = 'ri-edit-line';
        this.actions.view = 'ri-eye-line';
        this.getCoupons();
    }

    getCoupons(): void {
        this.couponService.getCoupons().subscribe(
            (res: Coupons[]) => { // Success callback
                // Vérifiez si res est un tableau et adaptez les données
                if (Array.isArray(res)) {
                    this.ELEMENT_DATA = res.map((item: Coupons) => ({
                        id: item.id,
                        dateCreation: item.dateCreation,
                        libelle: item.libelle,
                        codeCoupon: item.codeCoupon,
                        pourcentage: item.pourcentage,
                        montantMin: item.montantMinimum,
                        dateDebut: item.dateDebut,
                        dateFin: item.dateFin,
                        actions: this.actions
                    }));
                    this.dataSource.data = this.ELEMENT_DATA;
                } else {
                    console.error('Expected array but received non-array data.');
                }
            },
            (err: any) => { // Error callback
                console.error('Error fetching categories', err);
            }
        );
    }

    openDeleteDialog(element: ColonneCoupon): void {
        const dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
            width: '500px',
            data: { name: element.libelle }, // Nom de la boutique, utilisateur, etc.
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteItem(element);
            }
        });
    }

    deleteItem(element: ColonneCoupon): void {
        this.couponService.deleteCoupon(element.id).subscribe(
            (response) => {
                this.showMessage = true;
                    this.err = "Coupon supprimé avec succès !";
                    setTimeout(() => {
                        this.err = null;
                        this.showMessage = false;
                    }, 1500);

                // Retirer l'élément supprimé de la liste locale
                this.ELEMENT_DATA = this.ELEMENT_DATA.filter(item => item.id !== element.id);
                this.dataSource.data = this.ELEMENT_DATA;
            },
            (err) => {
                this.showMessage2 = true;
                    this.err = "Echec lors de la suppression du coupon";
                    setTimeout(() => {
                        this.err = null;
                        this.showMessage2 = false;
                    }, 1500);
            }
        );
}


}

export interface ColonneCoupon {
    
    id: any, 
    dateCreation: any, 
    libelle: any, 
    codeCoupon: any, 
    pourcentage: any, 
    montantMin: any,
    dateDebut: any, 
    dateFin: any
}
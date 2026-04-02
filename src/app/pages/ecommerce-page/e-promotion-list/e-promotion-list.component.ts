import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgIf, CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Promotions } from '../../../models/achats/promotions-model';
import { Actions } from '../../../models/utils/actions-model';
import { PromotionsService } from '../../../services/promotions.service';
import { DialogAnimationsExampleDialog } from '../../../ui-elements/dialog/dialog-animations/dialog-animations.component';
import { EPromotionDetailDialogComponent } from './e-promotion-detail-dialog.component';

@Component({
    selector: 'app-e-promotion-list',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink, MatTableModule, MatPaginatorModule, NgIf, CommonModule],
    templateUrl: './e-promotion-list.component.html',
    styleUrl: './e-promotion-list.component.scss'
})
export class EPromotionListComponent {

    displayedColumns: string[] = ['id', 'dateCreation', 'libelle', 'pourcentage', 'dateDebut', 'dateFin', 'actions'];
    dataSource = new MatTableDataSource<ColonnePromotion>();
    ELEMENT_DATA: ColonnePromotion[] = [];
    promotion: Promotions | undefined = new Promotions();
    actions: Actions | undefined = new Actions();
    err!: any;
    showMessage = false;
    showMessage2 = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private promotionsService: PromotionsService, public dialog: MatDialog) {}

    ngAfterViewInit() {
        if (this.sort) {
            this.dataSource.sort = this.sort;
            this.dataSource.sort.sort({ id: 'libelle', start: 'asc', disableClear: false });
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
        this.getPromotions();
    }

    getPromotions(): void {
        this.promotionsService.getPromotions().subscribe(
            (res: Promotions[]) => {
                if (Array.isArray(res)) {
                    this.ELEMENT_DATA = res.map((item: Promotions) => ({
                        id: item.id,
                        dateCreation: item.dateCreation,
                        libelle: item.libelle,
                        pourcentage: item.pourcentage,
                        dateDebut: item.dateDebut,
                        dateFin: item.dateFin,
                        actions: this.actions
                    }));
                    this.dataSource.data = this.ELEMENT_DATA;
                } else {
                    console.error('Expected array but received non-array data.');
                }
            },
            (err: any) => {
                console.error('Error fetching promotions', err);
            }
        );
    }

    openDeleteDialog(element: ColonnePromotion): void {
        const dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
            width: '500px',
            data: { name: element.libelle },
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteItem(element);
            }
        });
    }

    openDetailDialog(element: ColonnePromotion): void {
        const dialogConfig = {
            width: '620px',
            panelClass: 'promotion-detail-panel',
            data: {
                libelle: element.libelle,
                pourcentage: element.pourcentage,
                dateDebut: element.dateDebut,
                dateFin: element.dateFin,
                details: [] as any[]
            }
        };
        this.promotionsService.getArticlesByPromotionId(element.id).subscribe(
            (details) => {
                dialogConfig.data.details = details;
                this.dialog.open(EPromotionDetailDialogComponent, dialogConfig);
            },
            () => {
                this.dialog.open(EPromotionDetailDialogComponent, dialogConfig);
            }
        );
    }

    deleteItem(element: ColonnePromotion): void {
        this.promotionsService.deletePromotion(element.id).subscribe(
            () => {
                this.showMessage = true;
                this.err = "Promotion supprimée avec succès !";
                setTimeout(() => {
                    this.err = null;
                    this.showMessage = false;
                }, 1500);
                this.ELEMENT_DATA = this.ELEMENT_DATA.filter(item => item.id !== element.id);
                this.dataSource.data = this.ELEMENT_DATA;
            },
            () => {
                this.showMessage2 = true;
                this.err = "Echec lors de la suppression de la promotion";
                setTimeout(() => {
                    this.err = null;
                    this.showMessage2 = false;
                }, 1500);
            }
        );
    }
}

export interface ColonnePromotion {
    id: any;
    dateCreation: any;
    libelle: any;
    pourcentage: any;
    dateDebut: any;
    dateFin: any;
}
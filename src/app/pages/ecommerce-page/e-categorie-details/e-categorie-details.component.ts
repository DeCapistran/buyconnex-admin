import { Component, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Categories } from '../../../models/articles/categories-model';
import { Actions } from '../../../models/utils/actions-model';
import { MatSort } from '@angular/material/sort';
import { BoutiqueService } from '../../../services/boutique.service';
import { MatDialog } from '@angular/material/dialog';
import { CategorieService } from '../../../services/categorie.service';
import { DialogAnimationsExampleDialog } from '../../../ui-elements/dialog/dialog-animations/dialog-animations.component';

@Component({
    selector: 'app-categorie-details',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatPaginatorModule, MatTableModule, NgIf],
    templateUrl: './e-categorie-details.component.html',
    styleUrl: './e-categorie-details.component.scss'
})
export class ECategorieDetailsComponent {

    displayedColumns: string[] = ['id', 'images', 'libelle', 'actions'];
    dataSource = new MatTableDataSource<ColonneCategorie>();
    ELEMENT_DATA: ColonneCategorie[] = [];
    categorie: Categories | undefined = new Categories();
    actions: Actions | undefined = new Actions();
    err!: any;
    showMessage = false;
    showMessage2 = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private categorieService: CategorieService, public dialog: MatDialog) {}

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
        this.getCategories();
    }

    getCategories(): void {
        this.categorieService.getCategories().subscribe(
            (res: Categories[]) => { // Success callback
                // Vérifiez si res est un tableau et adaptez les données
                if (Array.isArray(res)) {
                    this.ELEMENT_DATA = res.map((item: Categories) => ({
                        id: item.id,
                        libelle: item.libelle,
                        images: item.images,
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

    openDeleteDialog(element: ColonneCategorie): void {
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

    deleteItem(element: ColonneCategorie): void {
        this.categorieService.deleteCategorie(element.id).subscribe(
            (response) => {
                this.showMessage = true;
                    this.err = "Catégorie supprimée avec succès !";
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
                    this.err = "Echec lors de la suppression de la catégorie";
                    setTimeout(() => {
                        this.err = null;
                        this.showMessage2 = false;
                    }, 1500);
            }
        );
}

}

export interface ColonneCategorie {
    
    id: any;
    libelle: any;
    images: any;
}
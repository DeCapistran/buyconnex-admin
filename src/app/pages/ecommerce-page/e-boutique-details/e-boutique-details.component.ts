import { Component, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { BoutiqueService } from '../../../services/boutique.service';
import { Boutiques } from '../../../models/articles/boutiques-model';
import { Actions } from '../../../models/utils/actions-model';
import { MatSort } from '@angular/material/sort';
import { DialogAnimationsExampleDialog } from '../../../ui-elements/dialog/dialog-animations/dialog-animations.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-boutique-details',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatPaginatorModule, MatTableModule, NgIf, MatSort],
    templateUrl: './e-boutique-details.component.html',
    styleUrl: './e-boutique-details.component.scss'
})
export class EBoutiqueDetailsComponent {

    displayedColumns: string[] = ['id', 'images', 'nom', 'email', 'contact', 'actions'];
    dataSource = new MatTableDataSource<ColonneBoutique>();
    ELEMENT_DATA: ColonneBoutique[] = [];
    boutique: Boutiques | undefined = new Boutiques();
    actions: Actions | undefined = new Actions();
    err!: any;
    showMessage = false;
    showMessage2 = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private boutiqueService: BoutiqueService, public dialog: MatDialog) {

    }

    ngAfterViewInit() {
        if (this.sort) {
            this.dataSource.sort = this.sort;
            this.dataSource.sort.sort({ id: 'nom', start: 'asc', disableClear: false }); // Tri initial par nom
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
        this.getBoutiques();
    }

    getBoutiques(): void {
        this.boutiqueService.getBoutiques().subscribe(
            (res: Boutiques[]) => { // Success callback
                // Vérifiez si res est un tableau et adaptez les données
                if (Array.isArray(res)) {
                    this.ELEMENT_DATA = res.map((item: Boutiques) => ({
                        id: item.id,
                        nom: item.nom,
                        images: item.images,
                        email: item.email,
                        contact: item.telephone,
                        actions: this.actions
                    }));
                    this.dataSource.data = this.ELEMENT_DATA;
                } else {
                    console.error('Expected array but received non-array data.');
                }
            },
            (err: any) => { // Error callback
                console.error('Error fetching boutiques', err);
            }
        );
    }

    openDeleteDialog(element: ColonneBoutique): void {
        const dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
            width: '500px',
            data: { name: element.nom }, // Nom de la boutique, utilisateur, etc.
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteItem(element);
            }
        });
    }

    deleteItem(element: ColonneBoutique): void {
            this.boutiqueService.deleteBoutique(element.id).subscribe(
                (response) => {
                    this.showMessage = true;
                        this.err = "Boutique supprimée avec succès !";
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
                        this.err = "Echec lors de la suppression de la boutique";
                        setTimeout(() => {
                            this.err = null;
                            this.showMessage2 = false;
                        }, 1500);
                }
            );
    }


}

export interface ColonneBoutique {

    id: any;
    nom: any;
    images: any;
    email: any;
    contact: any;
}
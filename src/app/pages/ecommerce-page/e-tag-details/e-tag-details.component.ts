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
import { Tags } from '../../../models/articles/tags-model';
import { TagService } from '../../../services/tag.service';

@Component({
    selector: 'app-tag-details',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatPaginatorModule, MatTableModule, NgIf, CommonModule],
    templateUrl: './e-tag-details.component.html',
    styleUrl: './e-tag-details.component.scss'
})
export class ETagDetailsComponent {

    displayedColumns: string[] = ['id', 'nom', 'description', 'actions'];
    dataSource = new MatTableDataSource<ColonneTag>();
    ELEMENT_DATA: ColonneTag[] = [];
    tag: Tags | undefined = new Tags();
    actions: Actions | undefined = new Actions();
    err!: any;
    showMessage = false;
    showMessage2 = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private tagService: TagService, public dialog: MatDialog) {}

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
        this.getCoupons();
    }

    getCoupons(): void {
        this.tagService.getTags().subscribe(
            (res: Tags[]) => { // Success callback
                // Vérifiez si res est un tableau et adaptez les données
                if (Array.isArray(res)) {
                    this.ELEMENT_DATA = res.map((item: Tags) => ({
                        id: item.id,
                        nom: item.nom,
                        description: item.description,
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

    openDeleteDialog(element: ColonneTag): void {
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

    deleteItem(element: ColonneTag): void {
        this.tagService.deleteTag(element.id).subscribe(
            (response) => {
                this.showMessage = true;
                    this.err = "Tag supprimée avec succès !";
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
                    this.err = "Echec lors de la suppression de la tag";
                    setTimeout(() => {
                        this.err = null;
                        this.showMessage2 = false;
                    }, 1500);
            }
        );
}


}

export interface ColonneTag {
    
    id: any, 
    nom: any, 
    description: any
}
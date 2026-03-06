import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { Clients } from '../../../models/clients/clients-model';
import { Actions } from '../../../models/utils/actions-model';
import { ClientService } from '../../../services/client.service';
import { MatDialog } from '@angular/material/dialog';
import { JsonPipe } from '@angular/common';
import { DialogAnimationsExampleDialog } from '../../../ui-elements/dialog/dialog-animations/dialog-animations.component';

@Component({
    selector: 'app-e-customers-list',
    standalone: true,
    imports: [MatCardModule, MatButtonModule, RouterLink, MatTableModule, MatPaginatorModule, NgIf, MatMenuModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatSort],
    templateUrl: './e-customers-list.component.html',
    styleUrl: './e-customers-list.component.scss'
})
export class ECustomersListComponent {

    displayedColumns: string[] = ['id', 'firstname', 'email', 'genre', 'telephone1', 'adresse', 'actions'];
    dataSource = new MatTableDataSource<ColonneClient>();

    ELEMENT_DATA: ColonneClient[] = [];
        client: Clients | undefined = new Clients();
        actions: Actions | undefined = new Actions();
        err!: any;
        showMessage = false;
        showMessage2 = false;
    
        @ViewChild(MatPaginator) paginator: MatPaginator;
        @ViewChild(MatSort) sort: MatSort;

        constructor(private clientService: ClientService, public dialog: MatDialog) {}

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
            this.getClients();
        }

        getClients(): void {
                this.clientService.getClients().subscribe(
                    (res: Clients[]) => { // Success callback
                        if (Array.isArray(res)) {
                            this.ELEMENT_DATA = res.map((item: Clients) => ({
                                id: item.id,
                                firstname: item.firstname,
                                lastname: item.lastname,
                                user: item.users,
                                genre: item.genre,
                                telephone1: item.telephone1,
                                adresse: item.adresses,
                                actions: this.actions
                            }));
                            this.dataSource.data = this.ELEMENT_DATA;
                            console.log('Réponse brute API Clients:', res);
                            console.log('Données transformées:', this.ELEMENT_DATA);
                        } else {
                            console.error('Expected array but received non-array data.');
                        }
                    },
                    (err: any) => { // Error callback
                        console.error('Error fetching clients', err);
                    }
                );
            }
        
            openDeleteDialog(element: ColonneClient): void {
                const dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
                    width: '500px',
                    data: { name: element.firstname }, // Nom de l'client, utilisateur, etc.
                });
        
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        this.deleteItem(element);
                    }
                });
            }
        
            deleteItem(element: ColonneClient): void {
                    this.clientService.deleteClient(element.id).subscribe(
                        (response) => {
                            this.showMessage = true;
                                this.err = "Client supprimée avec succès !";
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
                                this.err = "Echec lors de la suppression de l'client";
                                setTimeout(() => {
                                    this.err = null;
                                    this.showMessage2 = false;
                                }, 1500);
                        }
                    );
            }

}

export interface ColonneClient {

    id: any;
    firstname: any;
    user: any;
    genre: any;
    telephone1: any;
    adresse: any;
}
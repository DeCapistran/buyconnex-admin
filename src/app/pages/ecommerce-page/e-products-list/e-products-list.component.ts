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
import { Articles } from '../../../models/articles/articles-model';
import { Actions } from '../../../models/utils/actions-model';
import { ArticleService } from '../../../services/article.service';
import { MatDialog } from '@angular/material/dialog';
import { JsonPipe } from '@angular/common';
import { DialogAnimationsExampleDialog } from '../../../ui-elements/dialog/dialog-animations/dialog-animations.component';

@Component({
    selector: 'app-e-products-list',
    standalone: true,
    imports: [MatCardModule, MatButtonModule, RouterLink, MatTableModule, MatPaginatorModule, NgIf, MatMenuModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatSort],
    templateUrl: './e-products-list.component.html',
    styleUrl: './e-products-list.component.scss'
})
export class EProductsListComponent {

    displayedColumns: string[] = ['id', 'images', 'title', 'categorie', 'prix', 'quantite', 'status', 'actions'];
    dataSource = new MatTableDataSource<ColonneArticle>();

    ELEMENT_DATA: ColonneArticle[] = [];
        article: Articles | undefined = new Articles();
        actions: Actions | undefined = new Actions();
        err!: any;
        showMessage = false;
        showMessage2 = false;
    
        @ViewChild(MatPaginator) paginator: MatPaginator;
        @ViewChild(MatSort) sort: MatSort;

        constructor(private articleService: ArticleService, public dialog: MatDialog) {}

        ngAfterViewInit() {
            if (this.sort) {
                this.dataSource.sort = this.sort;
                this.dataSource.sort.sort({ id: 'title', start: 'asc', disableClear: false }); // Tri initial par nom
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
            this.getArticles();
        }

        getArticles(): void {
                this.articleService.getArticles().subscribe(
                    (res: Articles[]) => { // Success callback
                        if (Array.isArray(res)) {
                            this.ELEMENT_DATA = res.map((item: Articles) => ({
                                id: item.id,
                                title: item.title,
                                images: item.images,
                                categorie: item.categories,
                                prix: item.prix,
                                quantite: item.quantite,
                                status: item.statusArticle,
                                actions: this.actions
                            }));
                            this.dataSource.data = this.ELEMENT_DATA;
                            console.log('Réponse brute API Articles:', res);
                            console.log('Données transformées:', this.ELEMENT_DATA);
                        } else {
                            console.error('Expected array but received non-array data.');
                        }
                    },
                    (err: any) => { // Error callback
                        console.error('Error fetching articles', err);
                    }
                );
            }
        
            openDeleteDialog(element: ColonneArticle): void {
                const dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
                    width: '500px',
                    data: { name: element.title }, // Nom de l'article, utilisateur, etc.
                });
        
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        this.deleteItem(element);
                    }
                });
            }
        
            deleteItem(element: ColonneArticle): void {
                    this.articleService.deleteArticle(element.id).subscribe(
                        (response) => {
                            this.showMessage = true;
                                this.err = "Article supprimée avec succès !";
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
                                this.err = "Echec lors de la suppression de l'article";
                                setTimeout(() => {
                                    this.err = null;
                                    this.showMessage2 = false;
                                }, 1500);
                        }
                    );
            }

}

export interface ColonneArticle {

    id: any;
    images: any;
    title: any;
    categorie: any;
    prix: any;
    quantite: any;
    status: any;
}
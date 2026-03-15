import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { Articles } from '../../../models/articles/articles-model';
import { Actions } from '../../../models/utils/actions-model';
import { ArticleService } from '../../../services/article.service';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DialogAnimationsExampleDialog } from '../../../ui-elements/dialog/dialog-animations/dialog-animations.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-e-products-list',
    standalone: true,
    imports: [
        MatCardModule, MatButtonModule, RouterLink, MatTableModule,
        MatPaginatorModule, NgIf, NgClass, NgFor, MatMenuModule,
        MatSelectModule, FormsModule, ReactiveFormsModule, MatSort,
        MatFormFieldModule, MatInputModule, MatIconModule
    ],
    templateUrl: './e-products-list.component.html',
    styleUrl: './e-products-list.component.scss'
})
export class EProductsListComponent implements OnInit, OnDestroy {

    displayedColumns: string[] = ['id', 'images', 'title', 'marque', 'categorie', 'prix', 'quantite', 'status', 'actions'];
    dataSource = new MatTableDataSource<ColonneArticle>();

    ELEMENT_DATA: ColonneArticle[] = [];
    article: Articles | undefined = new Articles();
    actions: Actions | undefined = new Actions();
    err!: any;
    showMessage = false;
    showMessage2 = false;

    // ─── Filtres ──────────────────────────────────────────────────────
    filterForm: FormGroup;
    activeFilterCount = 0;
    activeChips: { type: 'categories' | 'prix' | 'marques'; value: any; label: string }[] = [];

    // Listes pour les dropdowns (alimentées depuis l'API)
    categoriesList: { id: any; libelle: string }[] = [];
    marquesList: { id: any; libelle: string }[] = [];
    prixList = [
        { value: '0-1000', label: '0 FCFA - 1000 FCFA' },
        { value: '1001-5000', label: '1001 FCFA - 5000 FCFA' },
        { value: '5001-10000', label: '5001 FCFA - 10000 FCFA' },
        { value: '10001-15000', label: '10001 FCFA - 15000 FCFA' },
        { value: '15001-20000', label: '15001 FCFA - 20000 FCFA' },
    ];

    private filterSub: Subscription;
    // ─────────────────────────────────────────────────────────────────

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private articleService: ArticleService,
        public dialog: MatDialog,
        private fb: FormBuilder
    ) {
        this.filterForm = this.fb.group({
            categories: [[]],
            prix: [null],
            marques: [[]]
        });
    }

    ngAfterViewInit() {
        if (this.sort) {
            this.dataSource.sort = this.sort;
            this.dataSource.sort.sort({ id: 'title', start: 'asc', disableClear: false });
        }
        if (this.paginator) {
            this.dataSource.paginator = this.paginator;
        }
    }

    ngOnInit(): void {
        this.actions = {
            delete: 'ri-delete-bin-line',
            edit: 'ri-edit-line',
            view: 'ri-eye-line'
        };
        this.getArticles();

        // Écoute les changements de filtres en temps réel
        this.filterSub = this.filterForm.valueChanges.subscribe(() => {
            this.updateChips();
        });
    }

    ngOnDestroy(): void {
        this.filterSub?.unsubscribe();
    }

    // ─── Gestion des filtres ──────────────────────────────────────────

    updateChips(): void {
        const values = this.filterForm.value;
        this.activeChips = [];

        (values.categories || []).forEach((id: any) => {
            const found = this.categoriesList.find(c => c.id === id);
            this.activeChips.push({
                type: 'categories',
                value: id,
                label: found ? found.libelle : id
            });
        });

        if (values.prix !== null && values.prix !== undefined) {
            const found = this.prixList.find(p => p.value === values.prix);
            this.activeChips.push({
                type: 'prix',
                value: values.prix,
                label: found ? found.label : values.prix
            });
        }

        (values.marques || []).forEach((id: any) => {
            const found = this.marquesList.find(m => m.id === id);
            this.activeChips.push({
                type: 'marques',
                value: id,
                label: found ? found.libelle : id
            });
        });

        this.activeFilterCount = this.activeChips.length;
    }

    removeFilter(type: 'categories' | 'prix' | 'marques', value: any): void {
        if (type === 'prix') {
            this.filterForm.get('prix')?.setValue(null);
        } else {
            const current: any[] = this.filterForm.get(type)?.value || [];
            this.filterForm.get(type)?.setValue(current.filter(v => v !== value));
        }
        this.applyFilters();
    }

    resetFilters(): void {
        this.filterForm.reset({ categories: [], prix: null, marques: [] });
        this.activeChips = [];
        this.activeFilterCount = 0;
        this.dataSource.data = this.ELEMENT_DATA;
    }

    applyFilters(): void {
        const { categories, prix, marques } = this.filterForm.value;

        let filtered = [...this.ELEMENT_DATA];

        if (categories?.length) {
            filtered = filtered.filter(item =>
                categories.includes(item.categorie?.id)
            );
        }

        if (prix) {
            const [min, max] = prix.split('-').map(Number);
            filtered = filtered.filter(item =>
                item.prix >= min && item.prix <= max
            );
        }

        if (marques?.length) {
            filtered = filtered.filter(item =>
                marques.includes(item.marque?.id)
            );
        }

        this.dataSource.data = filtered;

        // Remettre le paginator à la première page
        if (this.paginator) {
            this.paginator.firstPage();
        }
    }

    // ─── Données ──────────────────────────────────────────────────────

    getArticles(): void {
        this.articleService.getArticles().subscribe(
            (res: Articles[]) => {
                if (Array.isArray(res)) {
                    this.ELEMENT_DATA = res.map((item: Articles) => ({
                        id: item.id,
                        title: item.title,
                        marque: item.marques,
                        images: item.images,
                        categorie: item.categories,
                        prix: item.prix,
                        quantite: item.quantite,
                        status: this.getArticleStatus(item.quantite),
                        actions: this.actions
                    }));
                    this.dataSource.data = this.ELEMENT_DATA;

                    // Extraire les listes uniques pour les dropdowns
                    this.extractDropdownLists();
                }
            },
            (err: any) => console.error('Error fetching articles', err)
        );
    }

    // Construit les listes catégories/marques depuis les données reçues
    extractDropdownLists(): void {
        const categoriesMap = new Map();
        const marquesMap = new Map();

        this.ELEMENT_DATA.forEach(item => {
            if (item.categorie?.id && !categoriesMap.has(item.categorie.id)) {
                categoriesMap.set(item.categorie.id, item.categorie.libelle);
            }
            if (item.marque?.id && !marquesMap.has(item.marque.id)) {
                marquesMap.set(item.marque.id, item.marque.libelle);
            }
        });

        this.categoriesList = Array.from(categoriesMap, ([id, libelle]) => ({ id, libelle }));
        this.marquesList = Array.from(marquesMap, ([id, libelle]) => ({ id, libelle }));
    }

    openDeleteDialog(element: ColonneArticle): void {
        const dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
            width: '500px',
            data: { name: element.title },
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) this.deleteItem(element);
        });
    }

    deleteItem(element: ColonneArticle): void {
        this.articleService.deleteArticle(element.id).subscribe(
            () => {
                this.showMessage = true;
                this.err = "Article supprimé avec succès !";
                setTimeout(() => { this.err = null; this.showMessage = false; }, 1500);
                this.ELEMENT_DATA = this.ELEMENT_DATA.filter(item => item.id !== element.id);
                this.dataSource.data = this.ELEMENT_DATA;
            },
            () => {
                this.showMessage2 = true;
                this.err = "Échec lors de la suppression de l'article";
                setTimeout(() => { this.err = null; this.showMessage2 = false; }, 1500);
            }
        );
    }

    getArticleStatus(quantite: number) {
        if (quantite <= 0) return { label: 'En Rupture', class: 'rejected' };
        if (quantite <= 10) return { label: 'En Limite', class: 'pending' };
        return { label: 'En Stock', class: 'published' };
    }
}

export interface ColonneArticle {
    id: any;
    images: any;
    title: any;
    marque: any;
    categorie: any;
    prix: any;
    quantite: any;
    status: any;
    actions?: any;
}
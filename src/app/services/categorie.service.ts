import { Injectable } from "@angular/core";
import { Categories } from "../models/articles/categories-model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "../../environnments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class CategorieService {
    
    public categorie: Categories = new Categories();

    constructor(private httpClient: HttpClient, private authService: AuthService) { }

    getCategories() {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });

        return this.httpClient.get<Categories[]>(environment.backend_url + '/api/categories', { headers: httpHeaders });
    }

    saveCategorie(categorie: Categories) {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.post<Categories>(environment.backend_url + '/api/categories', categorie, { headers: httpHeaders });
    }

    setCategorie(categorie: Categories) {
        this.categorie = categorie;
    }

    getCategorieById(id: string): Observable<Categories> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.get<Categories>(`${environment.backend_url + '/api/categories'}/${id}`, { headers: httpHeaders });
    }

    updateCategorie(id: string, categorie: Categories): Observable<Categories> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.put<Categories>(`${environment.backend_url + '/api/categories'}/${id}`, categorie, { headers: httpHeaders });
    }

    uploadImageFSCategorie(formatData: FormData): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/images/uploadfs-categorie'}`;
        return this.httpClient.post(url, formatData, { headers: httpHeaders });
    }

    updateImageFSCategorie(categorieId: string, formatData: FormData): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/images/updatefs-categorie'}/${categorieId}`;
        return this.httpClient.post(url, formatData, { headers: httpHeaders });
    }

    deleteCategorie(categorieId: string): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/images/delete-categorie'}/${categorieId}`;
        return this.httpClient.delete(url, { headers: httpHeaders });
    }
}
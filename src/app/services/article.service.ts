import { Injectable } from "@angular/core";
import { Articles } from "../models/articles/articles-model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "../../environnments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ArticleService {
    
    public article: Articles = new Articles();

    constructor(private httpClient: HttpClient, private authService: AuthService) { }

    getArticles() {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });

        return this.httpClient.get<Articles[]>(environment.backend_url + '/api/articles', { headers: httpHeaders });
    }

    saveArticle(article: Articles) {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.post<Articles>(environment.backend_url + '/api/articles', article, { headers: httpHeaders });
    }

    setArticle(article: Articles) {
        this.article = article;
    }

    getArticleById(id: string): Observable<Articles> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.get<Articles>(`${environment.backend_url + '/api/articles'}/${id}`, { headers: httpHeaders });
    }

    updateArticle(id: string, article: Articles): Observable<Articles> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.put<Articles>(`${environment.backend_url + '/api/articles'}/${id}`, article, { headers: httpHeaders });
    }

    uploadImageFSArticle(formatData: FormData): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/images/uploadfs-article'}`;
        return this.httpClient.post(url, formatData, { headers: httpHeaders });
    }

    updateImageFSArticle(articleId: string, formatData: FormData): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/images/updatefs-article'}/${articleId}`;
        return this.httpClient.post(url, formatData, { headers: httpHeaders });
    }

    deleteArticle(articleId: string): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/images/delete-article'}/${articleId}`;
        return this.httpClient.delete(url, { headers: httpHeaders });
    }

    uploadImageAvecCouleur(formatData: FormData): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/images/uploadfs-article-couleur'}`;
        return this.httpClient.post(url, formatData, { headers: httpHeaders });
    }

    updateImageAvecCouleur(imageId: string, formatData: FormData): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/images/updatefs-article-couleur'}/${imageId}`;
        return this.httpClient.post(url, formatData, { headers: httpHeaders });
    }
   
}
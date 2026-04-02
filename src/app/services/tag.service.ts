import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "../../environnments/environment";
import { Observable } from "rxjs";
import { Tags } from "../models/articles/tags-model";

@Injectable({
    providedIn: 'root'
})

export class TagService {
    
    public tag: Tags = new Tags();

    constructor(private httpClient: HttpClient, private authService: AuthService) { }

    getTags() {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });

        return this.httpClient.get<Tags[]>(environment.backend_url + '/api/tags', { headers: httpHeaders });
    }

    saveTag(formatData: FormData): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.post<Tags>(environment.backend_url + '/api/tags', formatData, { headers: httpHeaders });
    }

    setTag(tag: Tags) {
        this.tag = tag;
    }

    getTagById(id: string): Observable<Tags> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.get<Tags>(`${environment.backend_url + '/api/tags'}/${id}`, { headers: httpHeaders });
    }

    updateTag(tagId: string, formatData: FormData): Observable<Tags> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.put<Tags>(`${environment.backend_url + '/api/tags'}/${tagId}`, formatData, { headers: httpHeaders });
    }

    deleteTag(tagId: string): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/tags'}/${tagId}`;
        return this.httpClient.delete(url, { headers: httpHeaders });
    }
}
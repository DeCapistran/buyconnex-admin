import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "../../environnments/environment";
import { Observable } from "rxjs";
import { Marques } from "../models/articles/marques-model";

@Injectable({
    providedIn: 'root'
})

export class MarqueService {
    
    public marque: Marques = new Marques();

    constructor(private httpClient: HttpClient, private authService: AuthService) { }

    getMarques() {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });

        return this.httpClient.get<Marques[]>(environment.backend_url + '/api/marques', { headers: httpHeaders });
    }

    saveMarque(formatData: FormData): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.post<Marques>(environment.backend_url + '/api/marques', formatData, { headers: httpHeaders });
    }

    setMarque(marque: Marques) {
        this.marque = marque;
    }

    getMarqueById(id: string): Observable<Marques> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.get<Marques>(`${environment.backend_url + '/api/marques'}/${id}`, { headers: httpHeaders });
    }

    updateMarque(marqueId: string, formatData: FormData): Observable<Marques> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.put<Marques>(`${environment.backend_url + '/api/marques'}/${marqueId}`, formatData, { headers: httpHeaders });
    }

    deleteMarque(marqueId: string): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/marques'}/${marqueId}`;
        return this.httpClient.delete(url, { headers: httpHeaders });
    }
}
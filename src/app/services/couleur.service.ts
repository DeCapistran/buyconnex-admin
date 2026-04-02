import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "../../environnments/environment";
import { Observable } from "rxjs";
import { Couleurs } from "../models/articles/couleurs-model";

@Injectable({
    providedIn: 'root'
})

export class CouleurService {

    public couleur: Couleurs = new Couleurs();

    constructor(private httpClient: HttpClient, private authService: AuthService) { }

    getCouleurs(): Observable<Couleurs[]> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.get<Couleurs[]>(environment.backend_url + '/api/couleurs', { headers: httpHeaders });
    }

    getCouleurById(id: string): Observable<Couleurs> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.get<Couleurs>(`${environment.backend_url + '/api/couleurs'}/${id}`, { headers: httpHeaders });
    }

    saveCouleur(couleur: Couleurs): Observable<Couleurs> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.post<Couleurs>(environment.backend_url + '/api/couleurs', couleur, { headers: httpHeaders });
    }

    setCouleur(couleur: Couleurs) {
        this.couleur = couleur;
    }
}

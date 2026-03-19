import { Injectable } from "@angular/core";
import { Avis } from "../models/articles/avis-model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "../../environnments/environment";
import { Observable } from "rxjs";

export interface RatingResult {
    ratingCount: { [key: number]: number };
    averageRating: number;
    overallStars: { star: string }[];
    totalReviews: number;
}

@Injectable({
    providedIn: 'root'
})

export class AvisService {
    
    public avis: Avis = new Avis();

    constructor(private httpClient: HttpClient, private authService: AuthService) { }

    getAvis() {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });

        return this.httpClient.get<Avis[]>(environment.backend_url + '/api/avis', { headers: httpHeaders });
    }

    saveAvis(avis: Avis) {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.post<Avis>(environment.backend_url + '/api/avis', avis, { headers: httpHeaders });
    }

    setAvis(avis: Avis) {
        this.avis = avis;
    }

    getAvisById(id: string): Observable<Avis> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.get<Avis>(`${environment.backend_url + '/api/avis'}/${id}`, { headers: httpHeaders });
    }

    updateAvis(id: string, avis: Avis): Observable<Avis> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.put<Avis>(`${environment.backend_url + '/api/avis'}/${id}`, avis, { headers: httpHeaders });
    }

    getAvisByArticleId(articleId: string): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/avis/article'}/${articleId}`;
        return this.httpClient.get(url, { headers: httpHeaders });
    }

    deleteAvis(avisId: string): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/images/delete-avis'}/${avisId}`;
        return this.httpClient.delete(url, { headers: httpHeaders });
    }

    computeRatings(avisList: Avis[] = []): RatingResult {
        const ratingCount: { [key: number]: number } = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        };

        let total = 0;
        const totalReviews = avisList.length;

        avisList.forEach((avis: Avis) => {
            const note = Number(avis.etoile) || 0;
            const rounded = Math.round(note);

            if (rounded >= 1 && rounded <= 5) {
                ratingCount[rounded]++;
            }

            total += note;
        });

        const averageRating = totalReviews > 0
            ? Number((total / totalReviews).toFixed(2))
            : 0;

        const overallStars = this.buildStars(averageRating);

        return {
            ratingCount,
            averageRating,
            overallStars,
            totalReviews
        };
    }

    buildStars(note: number): { star: string }[] {
        const stars: { star: string }[] = [];
        const fullStars = Math.floor(note);
        const decimal = note - fullStars;
        const hasHalfStar = decimal >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push({ star: 'ri-star-fill' });
        }

        if (hasHalfStar) {
            stars.push({ star: 'ri-star-half-fill' });
        }

        while (stars.length < 5) {
            stars.push({ star: 'ri-star-line' });
        }

        return stars;
    }
}
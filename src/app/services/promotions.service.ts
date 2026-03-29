import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "../../environnments/environment";
import { Observable } from "rxjs";
import { Promotions } from "../models/achats/promotions-model";

@Injectable({
    providedIn: 'root'
})

export class PromotionsService {

    public promotion: Promotions = new Promotions();

    constructor(private httpClient: HttpClient, private authService: AuthService) { }

    getPromotions(): Observable<Promotions[]> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });

        return this.httpClient.get<Promotions[]>(environment.backend_url + '/api/promotions', { headers: httpHeaders });
    }

    savePromotion(formatData: FormData): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.post<Promotions>(environment.backend_url + '/api/promotions', formatData, { headers: httpHeaders });
    }

    setPromotion(promotion: Promotions) {
        this.promotion = promotion;
    }

    getPromotionById(id: string): Observable<Promotions> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.get<Promotions>(`${environment.backend_url + '/api/promotions'}/${id}`, { headers: httpHeaders });
    }

    updatePromotion(promotionId: string, formatData: FormData): Observable<Promotions> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.put<Promotions>(`${environment.backend_url + '/api/promotions'}/${promotionId}`, formatData, { headers: httpHeaders });
    }

    deletePromotion(promotionId: string): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/promotions'}/${promotionId}`;
        return this.httpClient.delete(url, { headers: httpHeaders });
    }
}

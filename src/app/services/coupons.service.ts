import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "../../environnments/environment";
import { Observable } from "rxjs";
import { Coupons } from "../models/achats/coupons-model";

@Injectable({
    providedIn: 'root'
})

export class CouponService {
    
    public coupon: Coupons = new Coupons();

    constructor(private httpClient: HttpClient, private authService: AuthService) { }

    getCoupons() {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });

        return this.httpClient.get<Coupons[]>(environment.backend_url + '/api/coupons', { headers: httpHeaders });
    }

    saveCoupon(formatData: FormData): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.post<Coupons>(environment.backend_url + '/api/coupons', formatData, { headers: httpHeaders });
    }

    setCoupon(coupon: Coupons) {
        this.coupon = coupon;
    }

    getCouponById(id: string): Observable<Coupons> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.get<Coupons>(`${environment.backend_url + '/api/coupons'}/${id}`, { headers: httpHeaders });
    }

    updateCoupon(couponId: string, formatData: FormData): Observable<Coupons> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.put<Coupons>(`${environment.backend_url + '/api/coupons'}/${couponId}`, formatData, { headers: httpHeaders });
    }

    deleteCoupon(couponId: string): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/coupons'}/${couponId}`;
        return this.httpClient.delete(url, { headers: httpHeaders });
    }
}
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Boutiques } from "../models/articles/boutiques-model";
import { environment } from "../../environnments/environment";
import { Images } from "../models/articles/images-model";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})

export class BoutiqueService {

    public boutique: Boutiques = new Boutiques();

    constructor(private router: Router, private httpClient: HttpClient, private authService: AuthService) { }

    getBoutiques() {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });

        return this.httpClient.get<Boutiques[]>(environment.backend_url + '/api/boutiques', { headers: httpHeaders });
    }

    saveBoutique(boutique: Boutiques) {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.post<Boutiques>(environment.backend_url + '/api/boutiques', boutique, { headers: httpHeaders });
    }

    setBoutique(boutique: Boutiques) {
        this.boutique = boutique;
    }

    getBoutiqueById(id: string): Observable<Boutiques> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.get<Boutiques>(`${environment.backend_url + '/api/boutiques'}/${id}`, { headers: httpHeaders });
    }

    updateBoutique(id: string, boutique: Boutiques): Observable<Boutiques> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.put<Boutiques>(`${environment.backend_url + '/api/boutiques'}/${id}`, boutique, { headers: httpHeaders });
    }

    loadImage(id: number): Observable<Images> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });

        const url = `${environment.backend_url + '/api/images/details-image'}/${id}`;
        return this.httpClient.get<Images>(url, { headers: httpHeaders });
    }

    uploadImage(file: File, filename: string): Observable<Images> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });

        const imageFormData = new FormData();
        imageFormData.append('image', file, filename);
        const url = `${environment.backend_url + '/api/images/upload'}`;
        return this.httpClient.post<Images>(url, imageFormData, { headers: httpHeaders });
    }

    uploadImageBoutique(file: File, filename: string, idProd: number): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });

        const imageFormData = new FormData();
        imageFormData.append('image', file, filename);
        const url = `${environment.backend_url + '/api/images/upload-boutique'}/${idProd}`;
        return this.httpClient.post(url, imageFormData, { headers: httpHeaders });
    }

    uploadImageFSBoutique(formatData: FormData): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/images/uploadfs-boutique'}`;
        return this.httpClient.post(url, formatData, { headers: httpHeaders });
    }

    updateImageFSBoutique(boutiqueId: string, formatData: FormData): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/images/updatefs-boutique'}/${boutiqueId}`;
        return this.httpClient.post(url, formatData, { headers: httpHeaders });
    }

    deleteBoutique(boutiqueId: string): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/images'}/${boutiqueId}`;
        return this.httpClient.delete(url, { headers: httpHeaders });
    }

}
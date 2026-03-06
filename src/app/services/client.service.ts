import { Injectable } from "@angular/core";
import { Clients } from "../models/clients/clients-model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "../../environnments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ClientService {
    
    public client: Clients = new Clients();

    constructor(private httpClient: HttpClient, private authService: AuthService) { }

    getClients() {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });

        return this.httpClient.get<Clients[]>(environment.backend_url + '/api/clients', { headers: httpHeaders });
    }

    saveClient(client: Clients) {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.post<Clients>(environment.backend_url + '/api/clients', client, { headers: httpHeaders });
    }

    setClient(client: Clients) {
        this.client = client;
    }

    getClientById(id: string): Observable<Clients> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.get<Clients>(`${environment.backend_url + '/api/clients'}/${id}`, { headers: httpHeaders });
    }

    updateClient(id: string, client: Clients): Observable<Clients> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        return this.httpClient.put<Clients>(`${environment.backend_url + '/api/clients'}/${id}`, client, { headers: httpHeaders });
    }

    deleteClient(clientId: string): Observable<any> {
        let jwt = this.authService.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({ "Authorization": jwt });
        const url = `${environment.backend_url + '/api/clients'}/${clientId}`;
        return this.httpClient.delete(url, { headers: httpHeaders });
    }
}
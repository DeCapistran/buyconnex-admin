import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environnments/environment';
import { UserSettingVo } from '../models/users/userSettingVo-model';
import { Users } from '../models/users/users-model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserSettingsService {

    constructor(private httpClient: HttpClient, private authService: AuthService) {}

    private getHeaders(): HttpHeaders {
        const jwt = 'Bearer ' + this.authService.getToken();
        return new HttpHeaders({ 'Authorization': jwt });
    }

    getUserSettings(): Observable<UserSettingVo> {
        return this.httpClient.post<UserSettingVo>(
            environment.backend_url + '/user-settings',
            {},
            { headers: this.getHeaders() }
        );
    }

    getUserInfo(): Observable<Users> {
        return this.httpClient.post<Users>(
            environment.backend_url + '/user-info',
            {},
            { headers: this.getHeaders() }
        );
    }

    updateSetting(userSettingVo: UserSettingVo): Observable<any> {
        return this.httpClient.post<any>(
            environment.backend_url + '/update-setting',
            userSettingVo,
            { headers: this.getHeaders() }
        );
    }
}

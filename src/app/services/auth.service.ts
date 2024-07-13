import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams, JsonpInterceptor} from "@angular/common/http";
import { environment } from "../../environnments/environment";
import { NewPassword } from "../models/users/newPassword-model";
import { AuthRequest, AuthResponse } from "../models/users/auth-model";
import { Router } from "@angular/router";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Users } from "../models/users/users-model";


@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private helper = new JwtHelperService();
    token!:string;
    public loggedUser!:string;
    public isloggedIn: Boolean = false;
    public roles!:string[];
    public regitredUser : Users = new Users();
    public newPassword: NewPassword = new NewPassword();

    constructor(private router: Router, private httpClient: HttpClient) { }

    
    setRegistredUser(users : Users) {
        this.regitredUser=users;
    }

    getRegistredUser() {
        return this.regitredUser;
    }
        
    login(users : Users) {
        return this.httpClient.post<Users>(environment.backend_url+'/login', users , {observe:'response'});
    }

    saveToken(jwt:string){
        localStorage.setItem('jwt',jwt);
        this.token = jwt;
        this.isloggedIn = true; 
        this.decodeJWT();
    }
  
    getToken():string {
      return this.token;
    }
  
    decodeJWT() {   
        if (this.token == undefined)
              return;
      const decodedToken = this.helper.decodeToken(this.token);
      this.roles = decodedToken.roles;
      this.loggedUser = decodedToken.sub;
    }

    isAdmin():Boolean{
        if (!this.roles)
        return false;
        return (this.roles.indexOf('ADMIN') >-1) ;
    }  
    
    
    logOut() {
        this.loggedUser = undefined!;
        this.roles = undefined!;
        this.token= undefined!;
        this.isloggedIn = false;
        localStorage.removeItem('jwt');
        this.router.navigate(["/pages/login"]);
    }
    
    setLoggedUserFromLocalStorage(login: string) {
        this.loggedUser = login;
        this.isloggedIn = true;
    }

    loadToken() {
        this.token = localStorage.getItem('jwt')!;
        this.decodeJWT();
    }

    isTokenExpired(): Boolean {
        return  this.helper.isTokenExpired(this.token);   
    }


    registerUser(users :Users) {
        return this.httpClient.post<Users>(environment.backend_url+'/register', users, {observe:'response'});
    }


    validateEmail(code : string){
        return this.httpClient.get<Users>(environment.backend_url+'/verifyEmail/'+code);
    }

    updatePassword(newPassword :NewPassword) { 
        let jwt = this.getToken();
        jwt = "Bearer "+jwt;
        let httpHeaders = new HttpHeaders({"Authorization":jwt});
        return this.httpClient.post<NewPassword>(environment.backend_url+'/update-password', newPassword, {headers:httpHeaders});
    }





// A MODIFIER //
    

    /*logOut() {
        this.router.navigateByUrl('auth/login');
    }


    isUserSignedIn() {
        let token = localStorage.getItem('token');
        if(token && !this.tokenExpired(token)) {
            return true;
        }
        return false;
    }

    getSignedInUser() {
        return localStorage.getItem('user') as string;
    }

    private tokenExpired(token: string): boolean {
        const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
        return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    }

    resetPassword(email:string): Observable<any> {
        const params = new HttpParams().set('email', email);
        return this.httpClient.post(environment.backend_url + '/api/reset-password', params);
    }

    checkTokenForResetPassword(token:string): Observable<any> {
        const params = new HttpParams().set('token', token);
        return this.httpClient.post(environment.backend_url + '/api/ckeck-token-reset-password', params);
    }

    updatePassword(newPassword:NewPassword): Observable<any> {
        return this.httpClient.post<any>(environment.backend_url + '/api/update-password', newPassword, {headers: new HttpHeaders({ 'Content-Type': 'application/json'})}).pipe(map((reps) => {
            return reps;
        }));    
    }

    getUserLang():string {
        let settings = JSON.parse(localStorage.getItem('userSettings') as string);
        if(settings.langue) {
            return settings.langue;
        }
        return 'fr-FR';
    }*/
}
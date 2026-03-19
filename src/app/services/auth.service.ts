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
    public loggedIn: boolean = false;
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
        this.loggedIn = true; 
        this.decodeJWT();
    }
  
    getToken():string {
        if (!this.token) {
            this.token = localStorage.getItem('jwt') || '';
        }
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
        this.loggedIn = false;
        localStorage.removeItem('isloggedIn');
        localStorage.removeItem('loggedUser');
        localStorage.removeItem('jwt');
        this.router.navigate(["/authentication"]);
    }
    
    setLoggedUserFromLocalStorage(login: string) {
        this.loggedUser = login;
        this.loggedIn = true;
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

    isLoggedIn(): boolean {
        return this.loggedIn;
    }

}
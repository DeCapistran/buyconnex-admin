export class AuthRequest {
    login!:string;
    password!:string;
    lang!:string;
    userEmail!:string;
    remenberMe:boolean=false;
}


export class AuthResponse {
    currentUserName!:string;
    accesToken!:string;
    typeToken!:string;
    locked!:boolean;
    roles!:string[];
}
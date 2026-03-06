import { Users } from "../users/users-model";
import { Adresses } from "./adresses-model";

export class Clients {
    id!: number;
    firstname!: string;
    lastname!: string;
    entreprise!: string;
    genre!: string;
    facebook!: string;
    instagram!: string;
    telephone1!: string;
    telephone2!: string;
    adresses!: Adresses;
    users!: Users;
}
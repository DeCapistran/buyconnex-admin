import { Users } from "../users/users-model";
import { Articles } from "./articles-model";

export class Avis {
    id!: number;
    etoile!: number;
    commentaire!: string;
    articles!: Articles;
    users!: Users;
}
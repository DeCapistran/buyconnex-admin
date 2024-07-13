import { Users } from "../users/users-model";
import { Articles } from "./articles-model";

export class Avis {
    etoile!: number;
    commentaire!: string;
    articles!: Articles;
    user!: Users;
}
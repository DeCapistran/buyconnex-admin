import { Articles } from "../articles/articles-model";
import { Commandes } from "./commandes-model";

export class CommandesDetails {
    quantite!: number;
    article!: Articles;
    commande!: Commandes;
}
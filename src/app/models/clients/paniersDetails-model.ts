import { Articles } from "../articles/articles-model";
import { Paniers } from "./paniers-model";

export class PaniersDetails {
    quantite!: number;
    article!: Articles;
    panier!: Paniers;
}
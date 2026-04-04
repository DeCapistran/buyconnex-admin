import { Articles } from "../articles/articles-model";
import { Categories } from "../articles/categories-model";
import { Promotions } from "./promotions-model";

export class PromotionsDetails {
    title!: string;
    pourcentage!: number;
    prix!: number;
    dateDebut!: Date;
    dateFin!: Date;
    article!: Articles;
    categories!: Categories;
}
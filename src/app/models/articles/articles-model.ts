import { Boutiques } from "./boutiques-model";
import { Categories } from "./categories-model";
import { Images } from "./images-model";
import { Marques } from "./marques-model";
import { StatusArticles } from "./statusArticles-model";

export class Articles {
    id!: number;
    sku!: string;
    imgPath!: string;
    title!: string;
    prix!: number;
    quantite!: number;
    description!: string;
    composition!: string;
    boutique!: Boutiques;
    categorie!: Categories;
    marque!: Marques;
    statusArticle!: StatusArticles;
    images!: Images;
}
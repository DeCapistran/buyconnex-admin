import { Adresses } from "../clients/adresses-model";
import { StatusLivraisons } from "./statusLivraisons-model";

export class Livraisons {
    numeroLivraison!: string;
    dateEstimee!: Date;
    dateLivraison!: Date;
    commentaire!: string;
    adresse!: Adresses;
    statusLivraison!: StatusLivraisons;
}
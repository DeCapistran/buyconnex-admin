import { Adresses } from "../clients/adresses-model";
import { Commandes } from "./commandes-model";

export class Facturations {
    description!: string;
    adresse!: Adresses;
    commande!: Commandes;
}
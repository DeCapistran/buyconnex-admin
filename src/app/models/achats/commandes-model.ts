import { Clients } from "../clients/clients-model";
import { MoyensLivraisons } from "./moyensLivraisons-model";
import { StatusCommandes } from "./statusCommandes-model";

export class Commandes {
    numeroCommande!: string;
    codeCoupon!: string;
    client!: Clients;
    moyenLivraison!: MoyensLivraisons;
    statusCommande!: StatusCommandes;
}
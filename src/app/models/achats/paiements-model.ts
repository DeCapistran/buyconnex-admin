import { MoyensPaiements } from "./moyensPaiements-model";
import { StatusPaiements } from "./statusPaiements-model";

export class Paiements {
    montant!: number;
    moyenPaiement!: MoyensPaiements;
    statusPaiement!: StatusPaiements;
}
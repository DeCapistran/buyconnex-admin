export class Coupons {
    id?: number;
    libelle!: string;
    codeCoupon!: string;
    dateCreation!: Date;
    dateDebut!: Date;
    dateFin!: Date;
    pourcentage!: number;
    montantMinimum!: number;
}
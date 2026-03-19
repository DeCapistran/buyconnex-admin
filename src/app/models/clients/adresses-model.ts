import { Communes } from "./communes-model";
import { Pays } from "./pays-model";
import { Villes } from "./villes-model";

export class Adresses {
    adresse1!: string;
    adresse2!: string;
    codePostale!: number;
    description!: string;
    commune!: Communes;
    pays!: Pays;
    ville!: Villes;
}
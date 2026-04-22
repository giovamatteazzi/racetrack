import { SIMBOLO } from "./costanti.js";

export class Pista {

    constructor(matrice) {
        this.matrice = matrice;
        this.partenze = this.trovaPartenze();
    }

    dentro(x, y) {
        return x >= 0 && x < this.matrice[0].length &&
            y >= 0 && y < this.matrice.length;
    }

    inStrada(x, y) {
        return this.matrice[y][x] !== SIMBOLO.FUORI;
    }

    trovaPartenze() {
        let partenze = [];
        for (let y = 0; y < this.matrice.length; y++) {
            for (let x = 0; x < this.matrice[y].length; x++) {
                if (SIMBOLO.INIZIO.includes(this.matrice[y][x]))
                    partenze.push({ x: x, y: y });
            }
        }
        return partenze;
    }
}
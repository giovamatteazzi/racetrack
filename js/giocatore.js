export class Giocatore {
    constructor(nome, colore) {
        this.nome = nome;
        this.colore = colore;
        this.x;
        this.y;
        this.vx = 0;
        this.vy = 0;
        this.traccia = [];
        this.partenza;
    }

    scegliPartenza(pista, indici) {
        if (indici.length >= pista.partenze.length)
            return;
        let r;
        do
            r = Math.floor(Math.random() * pista.partenze.length);
        while (indici.includes(r));
        this.partenza = r;
        this.x = pista.partenze[r].x;
        this.y = pista.partenze[r].y;
        this.traccia.push({ x: this.x, y: this.y });
    }
}
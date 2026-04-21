import { STATO } from "./constanti.js";
import { TIPO_PUNTO } from "./constanti.js";
import { SIMBOLO } from "./constanti.js";
const { FUORI, DENTRO, INIZIO_1, INIZIO_N, INIZIO, FINE_1, FINE_N, FINE } = SIMBOLO;

export class Partita {

    constructor(pista) {

        this.stato = STATO.NULLO;
        this.pista = pista;
        this.mosse = 0;
        this.giocatori = [];
        this.turno = null;
    }

    aggiungiGiocatore(giocatore) {
        this.giocatori.push(giocatore);
    }

    inizia() {
        this.stato = STATO.INIZIATO;
    }

    termina() {
        this.stato = STATO.FINITO;
    }

    turnoIniziale() {
        return Math.floor(Math.random() * this.giocatori.length)
    }

    nuovoTurno() {
        this.turno = (this.turno + 1) % this.giocatori.length;
        this.mosse += (1 / this.giocatori.length)
    }

    giocatoreCorrente() {
        return this.giocatori[this.turno];
    }

    gestisciInizio() {
        this.inizia();
        this.turno = this.turnoIniziale();
        let indici = [];
        this.giocatori.forEach(giocatore => {
            giocatore.scegliPartenza(this.pista, indici);
            indici.push(giocatore.partenza);
        })
    }

    occupata(x, y) {
        let giocatore = this.giocatoreCorrente();
        return this.giocatori.some(g => g !== giocatore && g.x === x && g.y === y)
    }

    ottieniRaggiungibili() {
        const giocatore = this.giocatoreCorrente();
        const xPuntoPrincipale = giocatore.x + giocatore.vx;
        const yPuntoPrincipale = giocatore.y + giocatore.vy;

        let punti = [{ x: giocatore.x, y: giocatore.y, tipoPunto: TIPO_PUNTO.VALIDO, principale: false }];

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const x = xPuntoPrincipale + i;
                const y = yPuntoPrincipale + j;
                if (!this.pista.dentro(x, y))
                    continue;
                if (x === giocatore.x && y === giocatore.y)
                    continue;
                let tipoPunto = TIPO_PUNTO.VALIDO;
                if (!this.pista.inStrada(x, y))
                    tipoPunto = TIPO_PUNTO.FUORI;
                if (this.occupata(x, y))
                    tipoPunto = TIPO_PUNTO.INCIDENTE;
                punti.push({ x, y, tipoPunto, principale: i === 0 && j === 0 });
            }
        }
        return punti;
    }

    provaMossa(x, y) {
        const giocatore = this.giocatoreCorrente();

        if (x === giocatore.x && y === giocatore.y) {
            giocatore.vx = 0;
            giocatore.vy = 0;
            this.nuovoTurno();
            return null;
        }

        const xPuntoPrincipale = giocatore.x + giocatore.vx;
        const yPuntoPrincipale = giocatore.y + giocatore.vy;
        if (Math.abs(x - xPuntoPrincipale) > 1 || Math.abs(y - yPuntoPrincipale) > 1)
            return null;

        const vx = x - giocatore.x;
        const vy = y - giocatore.y;

        if (!this.pista.inStrada(x, y) || this.occupata(x, y)) {
            giocatore.vx = 0;
            giocatore.vy = 0;
        } else {
            giocatore.vx = vx;
            giocatore.vy = vy;
            giocatore.x = x;
            giocatore.y = y;
            giocatore.traccia.push({ x, y });
            if (FINE.includes(this.pista.matrice[y][x])) {
                this.termina();
                return giocatore;
            }
        }

        this.nuovoTurno();
        return null;
    }
}
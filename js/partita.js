import { STATO } from "./costanti.js";
import { TIPO_PUNTO } from "./costanti.js";
import { SIMBOLO } from "./costanti.js";
const { FUORI, DENTRO, INIZIO_1, INIZIO_N, INIZIO, FINE_1, FINE_N, FINE } = SIMBOLO;

export class Partita {

    constructor(pista) {

        this.stato = STATO.NULLO;
        this.pista = pista;
        this.giocatori = [];
        this.mosse = 0;
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

    // restituisce tutti i punti "attraversati" dalla linea (x1,y1)->(x2,y2)
    // CODICE COPIATO DA https://it.wikipedia.org/wiki/Algoritmo_della_linea_di_Bresenham
    Bresenham(x1, y1, x2, y2) {
        const punti = [];

        let DX = x2 - x1;
        let DY = y2 - y1;
        let a = Math.abs(DY);
        let b = -Math.abs(DX);
        let d = 2 * a + b;
        let x = x1;
        let y = y1;

        punti.push({ x, y });

        let q = 1;
        let s = 1;
        if (x1 > x2) q = -1;
        if (y1 > y2) s = -1;

        if (Math.abs(DX) >= Math.abs(DY)) {
            while (x !== x2) {
                if (d >= 0) {
                    d = d + 2 * (a + b);
                    y = y + s;
                    x = x + q;
                }
                else {
                    d = d + 2 * a;
                    x = x + q;
                }
                punti.push({ x, y });
            }
        } else {
            d = 2 * Math.abs(DX) - Math.abs(DY);
            while (y !== y2) {
                if (d >= 0) {
                    d = d + 2 * (Math.abs(DX) - Math.abs(DY));
                    x = x + q;
                    y = y + s;
                }
                else {
                    d = d + 2 * Math.abs(DX);
                    y = y + s;
                }
                punti.push({ x, y });
            }
        }

        return punti;
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
                if (this.occupata(x, y))
                    tipoPunto = TIPO_PUNTO.INCIDENTE;

                // controlla per ogni punto attraversato se è fuori
                const linea = this.Bresenham(giocatore.x, giocatore.y, x, y);
                for (let k = 1; k < linea.length; k++) {
                    const { x: lx, y: ly } = linea[k];
                    if (!this.pista.inStrada(lx, ly)) {
                        tipoPunto = TIPO_PUNTO.FUORI;
                        break;
                    }
                }
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

        if (this.occupata(x, y)) {
            giocatore.vx = 0;
            giocatore.vy = 0;
        }

        const linea = this.Bresenham(giocatore.x, giocatore.y, x, y);
        for (let k = 1; k < linea.length; k++) {
            const { x: lx, y: ly } = linea[k];

            if (FINE.includes(this.pista.matrice[ly][lx])) {
                giocatore.x = lx;
                giocatore.y = ly;
                giocatore.traccia.push({ x: lx, y: ly });
                this.termina();
                return { giocatore: giocatore, id: this.turno };
            }

            if (!this.pista.inStrada(lx, ly)) {
                giocatore.x = lx;
                giocatore.y = ly;
                giocatore.vx = 0;
                giocatore.vy = 0;
                giocatore.traccia.push({ x: lx, y: ly });
                this.nuovoTurno();
                return null;
            }
        }

        const vx = x - giocatore.x;
        const vy = y - giocatore.y;

        // movimento valido senza uscita ne' vittoria
        giocatore.vx = vx;
        giocatore.vy = vy;
        giocatore.x = x;
        giocatore.y = y;
        giocatore.traccia.push({ x, y });

        this.nuovoTurno();
        return null;
    }
}
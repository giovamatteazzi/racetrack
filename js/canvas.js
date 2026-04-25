import { CANVA } from "./costanti.js";
const { R_ATT, R_PAS, SPE_GRI, SPE_TRA, SPE_INI, SPE_FIN, L_QUO, L_QUINO } = CANVA;
import { SIMBOLO } from "./costanti.js";
const { FUORI, DENTRO, INIZIO_1, INIZIO_N, INIZIO, FINE_1, FINE_N, FINE } = SIMBOLO;
import { TIPO_PUNTO } from "./costanti.js";


export class GraficaCanvas {

    constructor(canvas, pista) {
        this.canvas = canvas;
        this.larghezza = pista.matrice[0].length;
        this.altezza = pista.matrice.length;
        this.ridimensiona();
        this.ctx = canvas.getContext("2d");
        this.pista = pista;

        this.xj, this.yj, this.xk, this.yk, this.xg, this.yg, this.xh, this.yh;

    }

    ridimensiona() {
        const rett = document.getElementById("canvas-container").getBoundingClientRect();
        const larghezzaDisponibile = rett.width;
        const altezzaDisponibile = rett.height;
        const dimX = Math.floor(larghezzaDisponibile / this.larghezza);
        const dimY = Math.floor(altezzaDisponibile / this.altezza);
        this.dimCella = Math.min(dimX, dimY);
        this.canvas.width = this.larghezza * this.dimCella;
        this.canvas.height = this.altezza * this.dimCella;
    }

    disegnaGriglia() {
        this.ctx.strokeStyle = "#ddd";
        this.ctx.lineWidth = SPE_GRI;
        for (let x = 0; x <= this.larghezza; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.dimCella, 0);
            this.ctx.lineTo(x * this.dimCella, this.altezza * this.dimCella);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.altezza; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.dimCella);
            this.ctx.lineTo(this.larghezza * this.dimCella, y * this.dimCella);
            this.ctx.stroke();
        }
    }

    disegnaPista() {

        for (let y = 0; y < this.altezza; y++) {
            for (let x = 0; x < this.larghezza; x++) {

                const punto = this.pista.matrice[y][x];

                switch (punto) {
                    case (INIZIO_1): this.xj = x; this.yj = y; break;
                    case (INIZIO_N): this.xk = x; this.yk = y; break;
                    case (FINE_1): this.xg = x; this.yg = y; break;
                    case (FINE_N): this.xh = x; this.yh = y; break;
                }
                let colore;
                if (punto === FUORI)
                    colore = "#bbbbbb"
                else
                    colore = "#f8fafc"

                this.ctx.fillStyle = colore;
                let lato = this.dimCella + 1;
                if (x === this.larghezza - 1 || y === this.altezza - 1)
                    lato = this.dimCella * 3 / 2;
                this.ctx.fillRect(x * this.dimCella - this.dimCella / 2, y * this.dimCella - this.dimCella / 2, lato, lato);
            }
        }

    }

    disegnaInizioFine() {
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = SPE_INI;
        this.ctx.setLineDash([4, 4]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.xj * this.dimCella, this.yj * this.dimCella);
        this.ctx.lineTo(this.xk * this.dimCella, this.yk * this.dimCella);
        this.ctx.stroke();

        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = SPE_FIN;
        this.ctx.setLineDash([10, 10]);
        let x1 = this.xg * this.dimCella;
        let y1 = this.yg * this.dimCella;
        let x2 = this.xh * this.dimCella;
        let y2 = this.yh * this.dimCella;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        let dx = x2 - x1;
        let dy = y2 - y1;

        let len = Math.sqrt(dx * dx + dy * dy);

        // normale unitaria
        let nx = -dy / len;
        let ny = dx / len;

        // metà spessore della linea
        let h = SPE_FIN / 2;

        // 4 vertici del rettangolo
        let p1x = x1 + nx * h;
        let p1y = y1 + ny * h;

        let p2x = x2 + nx * h;
        let p2y = y2 + ny * h;

        let p3x = x2 - nx * h;
        let p3y = y2 - ny * h;

        let p4x = x1 - nx * h;
        let p4y = y1 - ny * h;


        // bordo nero spessore 1
        this.ctx.setLineDash([]);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "black";

        this.ctx.beginPath();
        this.ctx.moveTo(p1x, p1y);
        this.ctx.lineTo(p2x, p2y);
        this.ctx.lineTo(p3x, p3y);
        this.ctx.lineTo(p4x, p4y);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    disegnaPosizione(giocatore) {
        this.ctx.fillStyle = giocatore.colore;
        this.ctx.beginPath();
        this.ctx.arc(giocatore.x * this.dimCella, giocatore.y * this.dimCella, R_ATT, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    disegnaTraccia(giocatore) {
        if (giocatore.traccia.length < 2)
            return
        for (let i = 0; i < giocatore.traccia.length - 1; i++) {
            this.ctx.fillStyle = giocatore.colore;
            this.ctx.beginPath();
            this.ctx.arc(giocatore.traccia[i].x * this.dimCella, giocatore.traccia[i].y * this.dimCella, R_PAS, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.strokeStyle = giocatore.colore;
            this.ctx.lineWidth = SPE_TRA;
            this.ctx.beginPath();
            this.ctx.moveTo(giocatore.traccia[i].x * this.dimCella, giocatore.traccia[i].y * this.dimCella);
            this.ctx.lineTo(giocatore.traccia[i + 1].x * this.dimCella, giocatore.traccia[i + 1].y * this.dimCella);
            this.ctx.stroke();
        }
    }

    disegnaPrevisione(giocatore, punto) {
        this.ctx.strokeStyle = giocatore.colore;
        this.ctx.lineWidth = SPE_TRA;

        this.ctx.beginPath();
        this.ctx.moveTo(giocatore.x * this.dimCella, giocatore.y * this.dimCella);
        this.ctx.lineTo(punto.x * this.dimCella, punto.y * this.dimCella);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(punto.x * this.dimCella, punto.y * this.dimCella, R_ATT, 0, 2 * Math.PI);
        this.ctx.fillStyle = giocatore.colore;
        this.ctx.fill();
    }

    mostraRaggiungibili(partita) {

        const punti = partita.ottieniRaggiungibili();

        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.arc(punti[0].x * this.dimCella, punti[0].y * this.dimCella, R_PAS, 0, 2 * Math.PI);
        this.ctx.fill();

        for (let p of punti.slice(1)) {
            let color, lato;

            switch (p.tipoPunto) {
                case TIPO_PUNTO.VALIDO:
                    color = p.principale ? "darkgreen" : "lightgreen";
                    lato = p.principale ? L_QUO : L_QUINO;
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(p.x * this.dimCella - lato / 2, p.y * this.dimCella - lato / 2, lato, lato);
                    break;
                case TIPO_PUNTO.FUORI:
                    this.ctx.fillStyle = "darkred";
                    lato = p.principale ? L_QUO : L_QUINO;
                    this.ctx.fillRect(p.x * this.dimCella - lato / 2, p.y * this.dimCella - lato / 2, lato, lato);
                    break;
                case TIPO_PUNTO.INCIDENTE:
                    this.ctx.fillStyle = "orange";
                    this.ctx.beginPath();
                    this.ctx.arc(p.x * this.dimCella, p.y * this.dimCella, R_PAS, 0, 2 * Math.PI);
                    this.ctx.fill();
                    break;
            }
        }
    }

    pulisci() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    aggiorna(partita) {
        this.pulisci();
        this.disegnaPista();
        this.disegnaGriglia();
        this.disegnaInizioFine();

        for (let i = 0; i < partita.giocatori.length; i++) {
            this.disegnaTraccia(partita.giocatori[i]);
            this.disegnaPosizione(partita.giocatori[i]);
        }
        this.mostraRaggiungibili(partita);
    }

}
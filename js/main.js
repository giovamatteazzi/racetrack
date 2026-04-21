import { GraficaHTML } from "./ui.js";
import { Partita } from "./partita.js"
import { GraficaCanvas } from "./canvas.js";
import { Pista } from "./pista.js";
import { piste } from "./dati.js";
import { Giocatore } from "./giocatore.js";
import { COL_GIOCATORI, STATO, CANVA } from "./constanti.js";
import { TIPO_PUNTO } from "./constanti.js";


let rt;
document.addEventListener("DOMContentLoaded", () => {
    rt = new RaceTrack();
});

class RaceTrack {

    constructor() {
        this.html = new GraficaHTML();
        this.partita = null;
        this.can = null;
        this.pista = null;
        document.getElementById("inizia-partita").addEventListener("submit", (e) => this.avviaPartita(e));
        this.canvas = document.getElementById("canva");
        this.canvas.addEventListener("click", (e) => this.gestisciClick(e));
        this.canvas.addEventListener("mousemove", (e) => this.gestisciHover(e));
    }

    avviaPartita(e) {
        e.preventDefault();

        const nomePista = document.getElementById("seleziona-pista").value;
        this.pista = new Pista(piste[nomePista]);

        const nomeA = document.getElementById("giocatore-A").value;
        const nomeB = document.getElementById("giocatore-B").value;
        const giocatoreA = new Giocatore(nomeA, COL_GIOCATORI[0]);
        const giocatoreB = new Giocatore(nomeB, COL_GIOCATORI[1]);

        this.can = new GraficaCanvas(this.canvas, this.pista);

        this.partita = new Partita(this.pista);
        this.partita.aggiungiGiocatore(giocatoreA);
        this.partita.aggiungiGiocatore(giocatoreB);

        this.html.mostraPartita();
        this.partita.gestisciInizio();
        this.can.aggiorna(this.partita);
        this.html.aggiornaTurni(this.partita);

    }

    ottieniCoordinate(e) {
        if (!this.partita || this.partita.stato !== STATO.INIZIATO)
            return null;

        const posCanva = this.can.canvas.getBoundingClientRect();
        // restituisce un oggetto con left, top ... (in questo caso del canvas)
        const scalaX = this.can.canvas.width / posCanva.width;
        const scalaY = this.can.canvas.height / posCanva.height;
        // fattore di scala
        const x = Math.round((e.clientX - posCanva.left) * scalaX / CANVA.DIM_CELLA);
        const y = Math.round((e.clientY - posCanva.top) * scalaY / CANVA.DIM_CELLA);
        if (!this.pista.dentro(x, y))
            return null;
        return { x: x, y: y };
    }

    gestisciClick(e) {
        let coordClick = this.ottieniCoordinate(e);
        if (!coordClick)
            return;
        const vincitore = this.partita.provaMossa(coordClick.x, coordClick.y);
        this.can.aggiorna(this.partita);
        if (vincitore) {
            this.html.mostraVincitore(vincitore)
            return;
        }
        this.html.aggiornaTurni(this.partita);
    }

    gestisciHover(e) {
        let coordHover = this.ottieniCoordinate(e);
        if (!coordHover)
            return;

        const punti = this.partita.ottieniRaggiungibili();
        this.can.aggiorna(this.partita);
        const puntoValido = punti.find(p => p.x === coordHover.x && p.y === coordHover.y && p.tipoPunto === TIPO_PUNTO.VALIDO);
        if (!puntoValido)
            return;
        const giocatore = this.partita.giocatoreCorrente();
        this.can.disegnaPrevisione(giocatore, puntoValido)
    }


}

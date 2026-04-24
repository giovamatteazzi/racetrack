import { GraficaHTML } from "./ui.js";
import { Partita } from "./partita.js"
import { GraficaCanvas } from "./canvas.js";
import { Pista } from "./pista.js";
import { piste } from "./dati.js";
import { Giocatore } from "./giocatore.js";
import { COL_GIOCATORI, STATO, CANVA } from "./costanti.js";
import { TIPO_PUNTO } from "./costanti.js";
import { ContestoApi } from "./contestoApi.js"


document.addEventListener("DOMContentLoaded", () => {
    let rt = new RaceTrack();
});

class RaceTrack {

    constructor() {
        this.html = new GraficaHTML();
        this.partita = null;
        this.can = null;
        this.pista = null;

        this.api = new ContestoApi()

        document.getElementById("inizia-partita").addEventListener("submit", (e) => {
            e.preventDefault();
            const form = e.target;
            const giocatoreA = document.getElementById("giocatore-A");
            const giocatoreB = document.getElementById("giocatore-B");
            const pista = document.getElementById("seleziona-pista");
            giocatoreA.value = giocatoreA.value.trim();
            giocatoreB.value = giocatoreB.value.trim();
            giocatoreA.setCustomValidity("");
            giocatoreB.setCustomValidity("");
            pista.setCustomValidity("");

            if (!giocatoreA.checkValidity()) {
                giocatoreA.setCustomValidity("Scrivi un nome compreso tra i 3 e 10 caratteri senza simboli speciali");
            }
            if (!giocatoreB.checkValidity()) {
                giocatoreB.setCustomValidity("Scrivi un nome compreso tra i 3 e 10 caratteri senza simboli speciali");
            }
            if (pista.value === "") {
                pista.setCustomValidity("Seleziona una pista");
            }

            if (!form.checkValidity()) {
                e.preventDefault();
                form.reportValidity();
                return;
            }
            this.avviaPartita(e)
        });

        document.getElementById("ricomincia-partita").addEventListener("click", () => this.html.mostraSchermata())

        this.canvas = document.getElementById("canvas-gioco");
        this.canvas.addEventListener("click", (e) => this.gestisciClick(e));
        this.canvas.addEventListener("mousemove", (e) => this.gestisciHover(e));
        window.addEventListener("resize", () => {
            if (!this.can || !this.partita)
                return;
            this.can.ridimensiona();
            this.can.aggiorna(this.partita);
        });

        document.getElementById("registrati-accedi").addEventListener("click", () => this.html.mostraAccesso());
        document.getElementById("accedi-registrati").addEventListener("click", () => this.html.mostraRegistrazione());


        document.getElementById("form-registrazione").addEventListener("submit", (e) => {
            e.preventDefault();
            const form = e.target;
            const nomeUtente = document.getElementById("nome-utente-registrazione");
            const password = document.getElementById("password-registrazione");
            nomeUtente.value = nomeUtente.value.trim();
            password.value = password.value.trim();

            nomeUtente.setCustomValidity("");
            password.setCustomValidity("");
            if (!nomeUtente.checkValidity())
                nomeUtente.setCustomValidity("Scrivi un nome compreso tra i 3 e i 30 caratteri.");
            if (!password.checkValidity())
                password.setCustomValidity("Includi una cifra e un simbolo speciale tra ! # $ % & * ^ _ - ~, compresa tra i 6 e i 30 caratteri.");
            if (!form.checkValidity()) {
                e.preventDefault();
                form.reportValidity();
                return;
            }

            this.gestisciRegistrazione(nomeUtente.value, password.value);
        });
        document.getElementById("form-accesso").addEventListener("submit", (e) => {
            e.preventDefault();
            const nomeUtente = document.getElementById("nome-utente-accesso");
            const password = document.getElementById("password-accesso");
            this.gestisciAccesso(nomeUtente.value.trim(), password.value.trim());
        });
    }

    avviaPartita(e) {
        e.preventDefault();

        const nomePista = document.getElementById("seleziona-pista").value;
        this.pista = new Pista(piste[nomePista]);

        const nomeA = document.getElementById("giocatore-A").value;
        const nomeB = document.getElementById("giocatore-B").value;
        const giocatoreA = new Giocatore(nomeA, COL_GIOCATORI[0]);
        const giocatoreB = new Giocatore(nomeB, COL_GIOCATORI[1]);

        this.partita = new Partita(this.pista);
        this.partita.aggiungiGiocatore(giocatoreA);
        this.partita.aggiungiGiocatore(giocatoreB);

        this.html.mostraPartita();

        this.can = new GraficaCanvas(this.canvas, this.pista);

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
        const x = Math.round((e.clientX - posCanva.left) * scalaX / this.can.dimCella);
        const y = Math.round((e.clientY - posCanva.top) * scalaY / this.can.dimCella);
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


    async gestisciRegistrazione(nomeUtente, password) {
        await this.api.registrati(nomeUtente, password);
        if (this.api.autenticato) {
            this.html.entra(nomeUtente);
        }
    }

    async gestisciAccesso(nomeUtente, password) {
        await this.api.accedi(nomeUtente, password);
        if (this.api.autenticato) {
            this.html.entra(nomeUtente);
        }
    }
}
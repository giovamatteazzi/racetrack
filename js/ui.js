import { CANVA } from "./costanti.js";
const { DIM_CELLA, R_GEN, R_ATT, R_PAS, SPE_GRI, SPE_TRA, SPE_INI, SPE_FIN, L_QUO, L_QUINO } = CANVA;

export class GraficaHTML {
    constructor() {
        this.schermataIniziale = document.getElementById("schermata-iniziale");
        this.schermataPartita = document.getElementById("schermata-partita");
        this.turno = document.getElementById("turno");
        this.mosse = document.getElementById("mosse");
        this.fine = document.getElementById("fine-partita");
        this.ricominciaPartita = document.getElementById("ricomincia-partita");
        this.registrazione = document.getElementById("registrazione");
        this.accesso = document.getElementById("accesso");
        this.utenteSessione = document.getElementById("utente-sessione");
    }

    mostraPartita() {
        this.ricominciaPartita.disabled = false;
        this.schermataIniziale.classList.add("nascosto");
        this.schermataPartita.classList.remove("nascosto");
    }

    mostraSchermata() {
        this.schermataPartita.classList.add("nascosto");
        this.schermataIniziale.classList.remove("nascosto");
    }

    aggiornaTurni(partita) {
        this.turno.innerHTML = "";
        const qua = document.createElement("div");
        qua.style.backgroundColor = partita.giocatoreCorrente().colore;
        qua.style.height = L_QUO + "px";
        qua.style.width = L_QUO + "px";
        qua.style.display = "inline-block";
        const nomeGio = document.createElement("p")
        nomeGio.textContent = partita.giocatoreCorrente().nome;
        this.turno.appendChild(qua);
        this.turno.appendChild(nomeGio);

        this.mosse.textContent = + Math.floor(partita.mosse);
    }

    mostraVincitore(giocatore) {
        while (this.fine.firstChild) {
            this.fine.removeChild(this.fine.firstChild);
        }
        const testo = document.createElement("h2");
        testo.textContent = "VINCE " + giocatore.nome;
        const btn = document.createElement("button");
        btn.textContent = "Ricomincia";
        btn.classList.add("pulsante-secondario");
        let colore = "#2356a8";
        if (giocatore.colore === "red")
            colore = "#9c2121";
        btn.style.backgroundColor = colore;
        btn.addEventListener("click", () => {
            this.mostraSchermata();
            this.fine.classList.add("nascosto")
        });
        this.fine.appendChild(testo);
        this.fine.appendChild(btn);
        this.fine.style.backgroundColor = giocatore.colore;
        this.fine.classList.remove("nascosto");
        this.ricominciaPartita.disabled = true;
    }

    mostraAccesso() {
        this.accesso.classList.remove("nascosto");
        this.registrazione.classList.add("nascosto");
    }

    mostraRegistrazione() {
        this.registrazione.classList.remove("nascosto");
        this.accesso.classList.add("nascosto");
    }

    entra(nomeUtente) {
        this.registrazione.classList.add("nascosto");
        this.accesso.classList.add("nascosto")
        this.utenteSessione.textContent = nomeUtente;
    }
}
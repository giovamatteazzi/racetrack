import { CANVA } from "./costanti.js";

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
        this.statistiche = document.getElementById("statistiche");
        this.statisticheContainer = document.getElementById("statistiche-container");
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
        qua.style.height = CANVA.L_QUO + "px";
        qua.style.width = CANVA.L_QUO + "px";
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

    mostraStatistiche() {
        this.accesso.classList.add("nascosto");
        this.registrazione.classList.add("nascosto");
        this.statistiche.classList.remove("nascosto");
    }

    aggiornaStatistiche(valoriStats) {

        this.statisticheContainer.innerHTML = "";
        valoriStats.sort((a, b) => b.partite - a.partite);

        for (let i = 0; i < 2 && i < valoriStats.length; i++) {
            let sta = valoriStats[i];

            const container = document.createElement("div");
            this.statisticheContainer.appendChild(container);
            container.classList.add("container-scontri");
            const partiteGiocate = document.createElement("p");
            container.appendChild(partiteGiocate);
            partiteGiocate.textContent = "Partite giocate: " + sta.partite;

            const tabella = document.createElement("table");
            container.appendChild(tabella);
            tabella.id = "tabella-statistiche";
            const thead = document.createElement("thead");
            tabella.appendChild(thead);
            const trHead = document.createElement("tr");
            thead.appendChild(trHead);
            const thVuoto = document.createElement("th");
            trHead.appendChild(thVuoto);
            const thA = document.createElement("th");
            trHead.appendChild(thA);
            thA.textContent = sta.giocatoreA;
            const thB = document.createElement("th");
            trHead.appendChild(thB);
            thB.textContent = sta.giocatoreB;
            const tbody = document.createElement("tbody");
            tabella.appendChild(tbody);

            const tr1 = document.createElement("tr");
            tbody.appendChild(tr1);
            const thVitt = document.createElement("th");
            tr1.appendChild(thVitt);
            thVitt.rowSpan = 2;
            thVitt.textContent = "Vittorie";
            const tdA1 = document.createElement("td");
            tr1.appendChild(tdA1);
            tdA1.textContent = sta.vittorieA;
            const tdB1 = document.createElement("td");
            tr1.appendChild(tdB1);
            tdB1.textContent = sta.vittorieB;

            const tr2 = document.createElement("tr");
            tbody.appendChild(tr2);
            const tdA2 = document.createElement("td");
            tr2.appendChild(tdA2);
            tdA2.textContent = sta.percVittA + "%";
            const tdB2 = document.createElement("td");
            tr2.appendChild(tdB2);
            tdB2.textContent = sta.percVittB + "%";

            const minA = (sta.minMosseA === Infinity) ? "/" : sta.minMosseA;
            const minB = (sta.minMosseB === Infinity) ? "/" : sta.minMosseB;
            const trMoss = document.createElement("tr");
            tbody.appendChild(trMoss);
            const thMos = document.createElement("th");
            trMoss.appendChild(thMos);
            thMos.textContent = "Mosse minime";
            const tdA = document.createElement("td");
            trMoss.appendChild(tdA);
            tdA.textContent = minA;
            const tdB = document.createElement("td");
            trMoss.appendChild(tdB);
            tdB.textContent = minB;
        }
    }
}
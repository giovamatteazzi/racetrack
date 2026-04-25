export class ContestoApi {

    constructor() {
        this.autenticato = false;
        this.partite = [];
    }

    async registrati(nomeUtente, password) {
        const payload = { nomeUtente, password };

        try {
            const response = await fetch("../php/registrati.php", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const risData = await response.json();

            if (risData.stato === "ok") {
                this.autenticato = true;
            }
            else {
                alert(risData.messaggio);
                this.autenticato = false;
            };
        }

        catch (error) {
            console.error("Errore: ", error);
            alert("Errore inaspettato");
            this.autenticato = false;
        }
    }

    async accedi(nomeUtente, password) {
        const payload = { nomeUtente, password };

        try {
            const response = await fetch("../php/accedi.php", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const resData = await response.json();

            if (resData.stato === "ok") {
                this.autenticato = true;
                await this.ottieniPartite();

            }
            else {
                alert(resData.messaggio);
                this.autenticato = false;
            };

        }
        catch (error) {
            console.error("Errore: ", error);
            alert("Errore inaspettato");
            this.autenticato = false;
        }

    }

    async salvaPartita(partita, vincitore) {
        if (!this.autenticato)
            return;

        let nomeA = partita.giocatori[0].nome;
        let nomeB = partita.giocatori[1].nome;

        const payload = {
            giocatoreA: nomeA,
            giocatoreB: nomeB,
            vincitore: vincitore,
            mosse: Math.floor(partita.mosse),
            pista: parseInt(partita.pista.id)
        };

        try {
            const response = await fetch("../php/salva_partita.php", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const resData = await response.json();

            if (resData.stato === "ok") {
                await this.ottieniPartite();
            }
            else {
                alert(resData.messaggio);
            };
        }

        catch (error) {
            console.error("Errore salvataggio partita: ", error);
        }
    }

    async ottieniPartite() {

        try {
            const response = await fetch(
                "../php/ottieni_partite.php",
                {
                    method: "GET",
                    credentials: "same-origin"
                }
            );

            const resData = await response.json();

            if (resData.stato === "ok") {
                this.partite = resData.data;
            }

            else {
                alert(resData.messaggio);
            };
        }

        catch (error) {
            console.error(error);
        }
    }

}
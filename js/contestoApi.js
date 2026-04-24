export class ContestoApi {

    constructor() {
        this.data = null;
        this.token = null;
        this.autenticato = false;
    }

    async registrati(nomeUtente, password) {
        const payload = { nomeUtente, password };

        try {
            const response = await fetch("../php/registrati.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const risData = await response.json();

            if (risData.stato === "ok") {
                this.data = risData.data;
                this.token = risData.token;
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
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const resData = await response.json();

            if (resData.stato === "ok") {
                this.data = resData.data;
                this.token = resData.token;
                this.autenticato = true;

            } else {
                alert(resData.messaggio);
                this.autenticato = false;
            };

        } catch (error) {
            console.error("Errore: ", error);
            alert("Errore inaspettato");
            this.autenticato = false;

        }

    }

}
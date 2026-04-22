export const CANVA = {
    DIM_CELLA: 30,
    R_GEN: 3, // generico raggio dei punti dentro/fuori
    R_ATT: 9, // raggio posizione attuale giocatori
    R_PAS: 3, // raggio posizioni passate giocatori
    SPE_GRI: 1,
    SPE_TRA: 2, // spessore traccia
    SPE_INI: 3, // spessore riga inizio
    SPE_FIN: 6, // spessore riga fine
    L_QUO: 12, // lato quadrato
    L_QUINO: 8 // lato quadratino
};

export const SIMBOLO = {
    FUORI: '#',
    DENTRO: '.',
    INIZIO_1: 'J',
    INIZIO_N: 'K',
    INIZIO: ['I', 'J', 'K'],
    FINE_1: 'G',
    FINE_N: 'H',
    FINE: ['F', 'G', 'H']
};

export const STATO = {
    NULLO: 0,
    INIZIATO: 1,
    FINITO: 2
};

export const TIPO_PUNTO = {
    VALIDO: "valido",
    FUORI: "fuori",
    INCIDENTE: "incidente"
};

export const COL_GIOCATORI = ["blue", "red"];
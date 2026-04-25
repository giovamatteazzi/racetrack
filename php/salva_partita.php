<?php
require_once "db.php";
session_start();

$conn = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);

if (!$conn) {
    die("Connessione fallita: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    if ( !isset($_SESSION["utente_id"]) ) {
        echo json_encode([
            "stato" => "errore",
            "messaggio" => "Utente non autenticato."
        ]);
        exit();
    }

    $data = json_decode(file_get_contents("php://input"), true);

    $giocatore_a = $data["giocatoreA"];
    $giocatore_b = $data["giocatoreB"];
    $vincitore = $data["vincitore"];
    $mosse = $data["mosse"];
    $pista = $data["pista"];

    $utente_id = $_SESSION["utente_id"];

    // salva in ordine alfabetico
    if (strcmp($giocatore_a, $giocatore_b) > 0) {
        $tmp = $giocatore_a;
        $giocatore_a = $giocatore_b;
        $giocatore_b = $tmp;
        // invertire anche il vincitore
        $vincitore = 1 - $vincitore;
    }

    $query = $conn->prepare("
        INSERT INTO Partite
        (id_utente, giocatore_a, giocatore_b, vincitore, mosse, pista)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    $query->bind_param("issiii", $utente_id, $giocatore_a, $giocatore_b, $vincitore, $mosse, $pista);

    if ($query->execute()) {
        echo json_encode([
            "stato" => "ok",
            "messaggio" => "Partita salvata correttamente.",
        ]);
    }
    else {
        echo json_encode([
            "stato" => "errore",
            "messaggio" => "Errore: " . $query->error
        ]);
    }

}
?>
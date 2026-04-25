<?php
require_once "db.php";
session_start();

$conn = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);

if (!$conn){
    die("Connessione fallita: ".mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    if( !isset($_SESSION["utente_id"]) ){
        echo json_encode([
            "stato"=>"errore",
            "messaggio"=>"Utente non autenticato."
        ]);
        exit();
    }

    $utente_id = $_SESSION["utente_id"];

    $query = $conn->prepare("
        SELECT id, giocatore_a, giocatore_b, vincitore, mosse, pista, creato_il
        FROM Partite
        WHERE id_utente=?
        ORDER BY creato_il ASC
    ");

    $query->bind_param("i", $utente_id);

    $query->execute();

    $result=$query->get_result();

    $partite=[];

    while($row = $result->fetch_assoc()){
    $partite[] = $row;
    }

    echo json_encode([
        "stato" => "ok",
        "data" => $partite
    ]);
}
?>
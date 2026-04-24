<?php
require_once "db.php";
session_start();

$conn = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);

if (!$conn) {
    die("Connessione fallita: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    $nome_utente = $data["nomeUtente"];
    $password = $data["password"];

    $password_hashed = password_hash($password, PASSWORD_DEFAULT);
    
    $query = $conn->prepare("SELECT id FROM Utenti WHERE nome_utente = ?");
    $query->bind_param("s", $nome_utente);
    $query->execute();    
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        echo json_encode([
            "stato" => "errore",
            "messaggio" => "Esiste già un account con questo nome."
        ]);
        exit();

    }

    $query = $conn->prepare("INSERT INTO Utenti (nome_utente, password_hash) VALUES(?, ?)");
    $query->bind_param("ss", $nome_utente, $password_hashed);

    if ($query->execute()) { 

        $utente_id = $conn->insert_id;

        $token = bin2hex(random_bytes(32));
        $_SESSION["utente_id"] = $utente_id;
        $_SESSION["token"] = $token;

        setcookie("session_token", $token, time() + 3600*24, "/", "", false, true);

        echo json_encode([
            "stato" => "ok",
            "messaggio" => "Utente registrato correttamente.",
            "data" => [
                "utente_id" => $utente_id
            ],
            "token" => $token

        ]);

    } else {

        echo json_encode([
            "stato" => "errore",
            "messaggio" => "Errore: " . $query->error
        ]);
    }

}
?>

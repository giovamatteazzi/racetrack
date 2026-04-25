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

    $query = $conn->prepare("SELECT id, nome_utente, password_hash FROM Utenti WHERE nome_utente = ?"); 
    $query->bind_param("s", $nome_utente); 
    $query->execute(); 

    $result = $query->get_result(); 

    if ($result->num_rows > 0) {

        $utente = $result->fetch_assoc(); 

        if (password_verify($password, $utente["password_hash"])) {

            $token = bin2hex(random_bytes(32)); 
            $_SESSION["utente_id"] = $utente["id"];
            $_SESSION["token"] = $token;

            setcookie("session_token", $token, time() + 3600*24, "/", "", false, true); 

            echo json_encode([
                "stato" => "ok",
                "messaggio" => "Completato l'accesso correttamente.",
            ]); 
        
        }
        
        else {
            echo json_encode([
                "stato" => "errore",
                "messaggio" => "Password errata."
            ]); 
        }
    
    }
    
    else {
        echo json_encode([
            "stato" => "errore",
            "messaggio" => "L'utente non è registrato."
        ]); 
    }
    
}
?>
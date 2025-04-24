<?php
header("Content-Type: application/json");
require_once '../db/db.php';

// Parse URL
$request = $_SERVER['REQUEST_URI'];
$basePath = '/projet2/api/definitions.php';
$cleanPath = str_replace($basePath, '', $request);
$parts = array_values(array_filter(explode('/', $cleanPath)));

// Default values
$nb = isset($parts[1]) ? intval($parts[1]) : 10;
$from = isset($parts[2]) ? intval($parts[2]) : 1;
$offset = $from - 1;

if (isset($parts[0]) && $parts[0] === 'word') {
    // Fetch distinct words with pagination
    $stmt = $pdo->prepare("
        SELECT DISTINCT word
        FROM definitions
        ORDER BY word
        LIMIT ? OFFSET ?
    ");
    $stmt->bindValue(1, $nb, PDO::PARAM_INT);
    $stmt->bindValue(2, $offset, PDO::PARAM_INT);
    $stmt->execute();
    $words = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $result = [];

    foreach ($words as $word) {
        $stmt = $pdo->prepare("SELECT id, definition FROM definitions WHERE word = ?");
        $stmt->execute([$word]);
        $defs = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $entry = [
            "word" => $word,
            "id" => $defs[0]["id"] ?? null,
            "def" => array_column($defs, "definition")
        ];

        $result[] = $entry;
    }

    echo json_encode($result);
} 
elseif(($parts[0]) === "word" && ($parts[1]) === "mot"){

    $stmt = $pdo->prepare("SELECT * FROM definitions WHERE word = ?"); 
    $stmt->execute([$parts[1]]);
    $definitions = $stmt->fetchAll(PDO::FETCH_COLUMN); 

    echo json_encode($definitions); 
}
elseif(($parts[0] === "word" && ($parts[1]) === "mot" && ($parts[2]) === "insert" && isset($parts[3] && isset($parts[4]) && isset($parts[5])))){

    $stmt = $pdo->prepare("INSERT INTO definitions (source, word, definition) VALUES(?, ?, ?)"); 
    $stmt->bindValue(1, $parts[3]);
    $stmt->bindValue(2, $parts[4]); 
    $stmt->bindValue(3, $parts[5]);
    $state = $stmt->fetch();
    if($state){
        echo json_encode("reussi"); 
    } 
    else echo json_encore("echec d'insertion"); 
}
elseif($parts[0] === "word" && $parts[1] === "lang" && isset($parts[2])){

    $stmt = $pdo->prepare("SELECT * from definitions where lang = ?"); 
    $stmt->execute([$parts[2]]); 
    $words =$stmt->fetchAll(PDO::FETCH_COLUMN);

    $result = [];

    foreach ($words as $word) {
        $stmt = $pdo->prepare("SELECT id, definition FROM definitions WHERE word = ?");
        $stmt->execute([$word]);
        $defs = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $entry = [
            "word" => $word,
            "id" => $defs[0]["id"] ?? null,
            "def" => array_column($defs, "definition")
        ];

        $result[] = $entry;
    }

    echo json_encode($result);
}
else {
    echo json_encode(["error" => "Invalid route"]);
}



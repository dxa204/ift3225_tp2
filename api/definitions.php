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
} else {
    echo json_encode(["error" => "Invalid route"]);
}

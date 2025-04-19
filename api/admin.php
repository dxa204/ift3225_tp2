<?php
header("Content-Type: application/json");
require_once '../db/db.php';

// Get the request path
$request = $_SERVER['REQUEST_URI'];
$basePath = '/projet2/api/admin.php';
$cleanPath = str_replace($basePath, '', $request);
$parts = array_values(array_filter(explode('/', $cleanPath)));

// Route: /admin/top[/<nb>]
if (isset($parts[0]) && $parts[0] === 'admin' && $parts[1] === 'top') {
    $nb = isset($parts[2]) ? intval($parts[2]) : 10;

    $stmt = $pdo->prepare("SELECT login, score FROM players ORDER BY score DESC LIMIT ?");
    $stmt->bindValue(1, $nb, PDO::PARAM_INT);
    $stmt->execute();
    $players = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "top" => $nb,
        "players" => $players
    ]);
}

// Route: /admin/delete/joueur/<joueur>
elseif ($parts[0] === 'admin' && $parts[1] === 'delete' && $parts[2] === 'joueur' && isset($parts[3])) {
    $login = $parts[3];

    // First check if the player exists
    $stmt = $pdo->prepare("SELECT id FROM players WHERE login = ?");
    $stmt->execute([$login]);
    $player = $stmt->fetch();

    if ($player) {
        $stmt = $pdo->prepare("DELETE FROM players WHERE login = ?");
        $stmt->execute([$login]);

        echo json_encode([
            "success" => true,
            "message" => "Player deleted.",
            "id" => $player['id']
        ]);
    } else {
        echo json_encode(["error" => "Player not found."]);
    }
}

// Route: /admin/delete/def/<id>
elseif ($parts[0] === 'admin' && $parts[1] === 'delete' && $parts[2] === 'def' && isset($parts[3])) {
    $defId = intval($parts[3]);

    // First check if the definition exists
    $stmt = $pdo->prepare("SELECT id FROM definitions WHERE id = ?");
    $stmt->execute([$defId]);
    $def = $stmt->fetch();

    if ($def) {
        $stmt = $pdo->prepare("DELETE FROM definitions WHERE id = ?");
        $stmt->execute([$defId]);

        echo json_encode([
            "success" => true,
            "message" => "Definition deleted.",
            "id" => $defId
        ]);
    } else {
        echo json_encode(["error" => "Definition not found."]);
    }
}

// Invalid route
else {
    echo json_encode(["error" => "Invalid admin route"]);
}

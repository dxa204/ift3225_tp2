<?php
header("Content-Type: application/json");
require_once '../db/db.php';

// Remove the path up to 'api/gamers.php' from the URL
$request = $_SERVER['REQUEST_URI'];
$basePath = '/projet2/api/gamers.php';
$cleanPath = str_replace($basePath, '', $request);
$parts = array_values(array_filter(explode('/', $cleanPath)));

if (isset($parts[0]) && $parts[0] === 'gamers' && $parts[1] === 'add') {
    $login = $parts[2] ?? null;
    $pwd = $parts[3] ?? null;

    if ($login && $pwd) {
        // Check if user already exists
        $stmt = $pdo->prepare("SELECT id FROM players WHERE login = ?");
        $stmt->execute([$login]);
        $existing = $stmt->fetch();

        if ($existing) {
            echo json_encode(["error" => "User already exists", "id" => $existing["id"]]);
        } else {
            $hashed_pwd = password_hash($pwd, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO players (login, password, last_login) VALUES (?, ?, NOW())");
            $stmt->execute([$login, $hashed_pwd]);
            
            //debut session 
            session_start(); 
            $_SESSION['login'] = $login; 
            $_SESSION['pwd'] = $pwd; 

            $newId = $pdo->lastInsertId();
            echo json_encode(["success" => true, "id" => $newId]);
        }
    } else {
        echo json_encode(["error" => "Missing parameters"]);
    }

} 
elseif ($parts[0] === 'gamers' && $parts[1] === 'login') {
    $login = $parts[2] ?? null;
    $pwd = $parts[3] ?? null;

    if ($login && $pwd) {
        $stmt = $pdo->prepare("SELECT id, password FROM players WHERE login = ?");
        $stmt->execute([$login]);
        $user = $stmt->fetch();

        if ($user && password_verify($pwd, $user['password'])) {
            // Update last login time
            $update = $pdo->prepare("UPDATE players SET last_login = NOW() WHERE id = ?");
            $update->execute([$user['id']]);
            
            //debut session
            if(session_status() === PHP_SESSION_NONE){
                session_start(); 
            }
            $_SESSION['login'] = $login; 
            $_SESSION['pwd'] = $pwd; 

            echo json_encode(["success" => true, "id" => $user['id']]);
            
        } else {
            echo json_encode(["error" => "Invalid login or password"]);
        }
    } else {
        echo json_encode(["error" => "Missing parameters"]);
    }

} 
elseif ($parts[0] === 'gamers' && $parts[1] === 'logout') {
    $login = $parts[2] ?? null;
    $pwd = $parts[3] ?? null;

    if ($login && $pwd) {
        $stmt = $pdo->prepare("SELECT id, password FROM players WHERE login = ?");
        $stmt->execute([$login]);
        $user = $stmt->fetch();

        if ($user && password_verify($pwd, $user['password'])) {
            echo json_encode(["success" => true, "message" => "Logged out."]);

            //terminer la session
            session_destroy(); 

        } else {
            echo json_encode(["error" => "Invalid login or password"]);
        }
    } else {
        echo json_encode(["error" => "Missing parameters"]);
    }
} 
elseif ($parts[0] === 'gamers' && isset($parts[1]) && !in_array($parts[1], ['add', 'login', 'logout'])) {
    $login = $parts[1];

    // Fetch player info
    $stmt = $pdo->prepare("SELECT login, games_played, games_won, score, last_login FROM players WHERE login = ?");
    $stmt->execute([$login]);
    $player = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($player) {
        echo json_encode($player);
    } else {
        echo json_encode(["error" => "Player not found"]);
    }
}
elseif($parts[0] === 'gamers' && $parts[1] === 'session'){

    if(session_status !== PHP_SESSION_NONE){
    echo json_encode([
        'login' => $_SESSION['login']
        'pwd' => $_SESSION['pwd']
    ]);
    }
    else echo json_encode("erreur: aucune session active"); 
}
else {
    echo json_encode(["error" => "Invalid route"]);
}

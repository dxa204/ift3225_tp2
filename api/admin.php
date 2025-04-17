<?php
header("Content-Type: application/json");
require_once '../db/db.php';

//Parse url 
$request = $_SERVER['REQUEST_URI'];
$basePath = '/projet2/api/admin.php';
$cleanPath = str_replace($basePath, '', $request);
$parts = array_values(array_filter(explode('/', $cleanPath)));

//Default
$nb = isset($parts[2]); 

if(!$nb){
    echo json_encode("erreur: veuillez entrer un nombre de joueurs"); 
}
else $nb = intval($parts[2]); 

//fetch list of top players
if (isset($parts[0]) && $parts[0] === 'admin' && $parts[1] === 'top' && isset($parts[2])){

    $stmt = $pdo->prepare("SELECT login, score FROM players ORDER BY score DESC LIMIT ?"); 
    $stmt ->bind_value(1, $nb, PDO::PARAM_INT); 
    $players = $stmt->fetchAll(); 

    echo json_encode($players); 
}
else if(isset($parts[0]) && $parts[0] === 'admin' && $parts[1] === 'delete' && $parts[2] === 'joueur' && isset($parts[3])){
    
    $login = $parts[3]; 

    //check if player exists
    $stmt = $pdo->prepare("SELECT id FROM players WHERE login = ?"); 
    $stmt = $pdo->execute([$login]); 
    $existing = $stmt->fetch(); 

    if($existing){

        $stmt = $pdo->prepare("DELETE FROM players WHERE login = ?");
        $stmt->execute([$login]); 
        
        $count = $stmt->rowCount(); 
        
        //si supprime retourne id
        if($count > 0){
            
            echo json_encode($existing["id"]); 
        }
        else{echo json_encore("erreur: suppression impossible")}
    }
}
else if(isset($parts[0]) && $parts[0] === 'admin' && $parts[1] === 'delete' && $parts[2] === 'def' && isset($parts[3])){
    
    //get id of definition to delete
    $definition = $parts[3]; 

    $stmt = $pdo->prepare("DELETE FROM definitions WHERE id = ?");
    $stmt->execute([$definition]); 

    $count = $stmt->rowCount(); 

    if($count > 0){
        echo json_encode("suppression réussie");
    }
    else echo json_encode("erreur: suppression impossible"); 
}
else {
    echo json_encode(["error" => "Invalid route"]);
}


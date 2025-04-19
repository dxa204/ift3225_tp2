<?php
header("Content-Type: application/json");
require_once '../db/db.php';

// Remove the path up to 'api/gamers.php' from the URL
$request = $_SERVER['REQUEST_URI'];
$basePath = '/projet2/api/page.php';
$cleanPath = str_replace($basePath, '', $request);
$parts = array_values(array_filter(explode('/', $cleanPath)));


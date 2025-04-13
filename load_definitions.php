<?php
require_once 'db/db.php';

$filename = 'def.txt';
$handle = fopen($filename, 'r');

if ($handle) {
    $count = 0;

    while (($line = fgets($handle)) !== false) {
        $parts = explode("\t", trim($line));

        if (count($parts) === 4) {
            [$lang, $source, $word, $definition] = $parts;

            $stmt = $pdo->prepare("
                INSERT INTO definitions (language, source, word, definition)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([$lang, $source, $word, $definition]);

            $count++;
        }
    }

    fclose($handle);
    echo "Imported $count definitions.\n";
} else {
    echo "Failed to open $filename";
}

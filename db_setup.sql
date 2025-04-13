-- Create database (optional if already created)
CREATE DATABASE IF NOT EXISTS projet2;
USE projet2;

-- Table: players
CREATE TABLE players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    games_played INT DEFAULT 0,
    games_won INT DEFAULT 0,
    score INT DEFAULT 0,
    last_login DATETIME
);

-- Table: definitions
CREATE TABLE definitions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(50) NOT NULL,
    definition TEXT NOT NULL,
    language VARCHAR(5),
    source VARCHAR(100)
);

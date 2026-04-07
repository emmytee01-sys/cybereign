-- CYBEREIGN CMS Database Setup
CREATE DATABASE IF NOT EXISTS cybereign_cms;
USE cybereign_cms;

-- Table for site configuration and content
CREATE TABLE IF NOT EXISTS site_content (
    content_key VARCHAR(50) PRIMARY KEY,
    content_value JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for administrative users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default admin user (password: cybereign2026)
INSERT INTO users (username, password) 
VALUES ('admin', '$2y$10$Y1rX4O.eS7P8v5m8M9r8O.PjZ2S2k4Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z')
ON DUPLICATE KEY UPDATE username=username;

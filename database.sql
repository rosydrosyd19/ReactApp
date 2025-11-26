CREATE DATABASE IF NOT EXISTS asset_management_db;

USE asset_management_db;

CREATE TABLE IF NOT EXISTS assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status ENUM('Ready to Deploy', 'Deployed', 'Archived', 'Broken') DEFAULT 'Ready to Deploy',
    serial_number VARCHAR(100) UNIQUE,
    purchase_date DATE,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO assets (name, category, status, serial_number, purchase_date) VALUES 
('MacBook Pro M1', 'Laptop', 'Ready to Deploy', 'MBP-2021-001', '2023-01-15'),
('Dell XPS 15', 'Laptop', 'Deployed', 'DELL-2022-055', '2022-11-20'),
('Logitech MX Master 3', 'Accessory', 'Ready to Deploy', 'LOGI-MX-003', '2023-03-10'),
('Herman Miller Aeron', 'Furniture', 'Deployed', 'HM-AERON-99', '2021-06-01');

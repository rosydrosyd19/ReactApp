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
-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    zip VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO locations (name, address, city, state, country, zip) VALUES 
('Main Office', 'Jl. Sudirman No. 123', 'Jakarta', 'DKI Jakarta', 'Indonesia', '12190'),
('Branch Office - Surabaya', 'Jl. Basuki Rahmat No. 45', 'Surabaya', 'Jawa Timur', 'Indonesia', '60271'),
('Warehouse', 'Jl. Industri Raya No. 88', 'Tangerang', 'Banten', 'Indonesia', '15134');
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    department VARCHAR(100),
    position VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email, phone, department, position) VALUES 
('John Doe', 'john.doe@company.com', '+62 812-3456-7890', 'IT', 'System Administrator'),
('Jane Smith', 'jane.smith@company.com', '+62 813-9876-5432', 'HR', 'HR Manager'),
('Bob Johnson', 'bob.johnson@company.com', '+62 821-1234-5678', 'Finance', 'Accountant');
USE asset_management_db;

CREATE TABLE IF NOT EXISTS licenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    software_name VARCHAR(255) NOT NULL,
    product_key VARCHAR(255) NOT NULL,
    seats INT NOT NULL DEFAULT 1,
    purchase_date DATE,
    expiration_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
USE asset_management_db;

CREATE TABLE IF NOT EXISTS accessories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    manufacturer VARCHAR(100),
    model_number VARCHAR(100),
    total_quantity INT NOT NULL DEFAULT 0,
    available_quantity INT NOT NULL DEFAULT 0,
    purchase_date DATE,
    cost DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
USE asset_management_db;

ALTER TABLE accessories
ADD COLUMN image_url VARCHAR(255) DEFAULT NULL;
-- Create components table
CREATE TABLE IF NOT EXISTS components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    model_number VARCHAR(100),
    total_quantity INT NOT NULL DEFAULT 0,
    available_quantity INT NOT NULL DEFAULT 0,
    min_quantity INT DEFAULT 0,
    notes TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_type VARCHAR(50) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
USE asset_management_db;

CREATE TABLE IF NOT EXISTS accessory_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    accessory_id INT NOT NULL,
    assigned_to VARCHAR(255) NOT NULL,
    assigned_type VARCHAR(50) NOT NULL, -- 'user', 'asset', 'location'
    quantity INT NOT NULL DEFAULT 1,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP NULL DEFAULT NULL,
    notes TEXT,
    FOREIGN KEY (accessory_id) REFERENCES accessories(id) ON DELETE CASCADE
);
-- Create account_assignments table
CREATE TABLE IF NOT EXISTS account_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    assigned_to VARCHAR(255) NOT NULL,
    assigned_type ENUM('asset', 'license') NOT NULL,
    notes TEXT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);
-- Create component_assignments table
CREATE TABLE IF NOT EXISTS component_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    component_id INT NOT NULL,
    assigned_to VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    notes TEXT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE
);
USE asset_management_db;

CREATE TABLE IF NOT EXISTS license_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    license_id INT NOT NULL,
    assigned_to VARCHAR(255) NOT NULL,
    assigned_type VARCHAR(50) NOT NULL, -- 'user' or 'asset'
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP NULL DEFAULT NULL,
    notes TEXT,
    FOREIGN KEY (license_id) REFERENCES licenses(id) ON DELETE CASCADE
);
-- Add check-in/check-out fields to assets table
ALTER TABLE assets 
ADD COLUMN checked_out_to VARCHAR(255) DEFAULT NULL,
ADD COLUMN checked_out_at TIMESTAMP NULL DEFAULT NULL,
ADD COLUMN notes TEXT DEFAULT NULL;

-- Create checkout history table
CREATE TABLE IF NOT EXISTS checkout_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    checked_out_to VARCHAR(255) NOT NULL,
    checked_out_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checked_in_at TIMESTAMP NULL DEFAULT NULL,
    notes TEXT,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);
-- Add new fields to assets table for checkout dates
ALTER TABLE assets 
ADD COLUMN checkout_date DATE DEFAULT NULL,
ADD COLUMN expected_checkin_date DATE DEFAULT NULL;

-- Update checkout_history table to include dates
ALTER TABLE checkout_history
ADD COLUMN checkout_date DATE DEFAULT NULL,
ADD COLUMN expected_checkin_date DATE DEFAULT NULL;
USE asset_management_db;

ALTER TABLE locations
ADD COLUMN status ENUM('Available', 'Occupied', 'Maintenance') DEFAULT 'Available',
ADD COLUMN checked_out_to VARCHAR(255) DEFAULT NULL,
ADD COLUMN checked_out_type VARCHAR(50) DEFAULT NULL,
ADD COLUMN checked_out_at DATETIME DEFAULT NULL,
ADD COLUMN expected_checkin_date DATE DEFAULT NULL,
ADD COLUMN notes TEXT DEFAULT NULL;

CREATE TABLE IF NOT EXISTS location_checkout_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_id INT NOT NULL,
    checked_out_to VARCHAR(255) NOT NULL,
    checked_out_type VARCHAR(50) NOT NULL,
    checked_out_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    checked_in_at DATETIME NULL DEFAULT NULL,
    notes TEXT,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);
-- Create asset_maintenances table
CREATE TABLE IF NOT EXISTS asset_maintenances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    maintenance_type VARCHAR(50) NOT NULL, -- Repair, Upgrade, Inspection, Software Update
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    completion_date DATE,
    cost DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'Scheduled', -- Scheduled, In Progress, Completed, Canceled
    performed_by VARCHAR(255), -- Vendor or Technician Name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES asset_items(id) ON DELETE CASCADE
);
-- ============================================
-- Database Restructuring Migration Script
-- OPSI B: Naming Convention with Prefixes
-- ============================================
-- This script renames all tables with appropriate prefixes:
-- - asset_* for Asset Management module
-- - core_* for Core/Shared module
-- ============================================

USE asset_management_db;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- STEP 1: Rename Core Module Tables
-- ============================================
RENAME TABLE users TO core_users;

-- ============================================
-- STEP 2: Rename Asset Module Main Tables
-- ============================================
RENAME TABLE assets TO asset_items;
RENAME TABLE locations TO asset_locations;
RENAME TABLE licenses TO asset_licenses;
RENAME TABLE accessories TO asset_accessories;
RENAME TABLE components TO asset_components;
RENAME TABLE accounts TO asset_accounts;

-- ============================================
-- STEP 3: Rename Assignment/History Tables
-- ============================================
RENAME TABLE checkout_history TO asset_checkout_history;
RENAME TABLE license_assignments TO asset_license_assignments;
RENAME TABLE accessory_assignments TO asset_accessory_assignments;
RENAME TABLE component_assignments TO asset_component_assignments;
RENAME TABLE account_assignments TO asset_account_assignments;
RENAME TABLE location_checkout_history TO asset_location_checkout_history;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Verification: Show all tables
-- ============================================
SHOW TABLES;

-- ============================================
-- Success Message
-- ============================================
SELECT 'Database migration completed successfully!' AS Status;
SELECT 'All tables have been renamed with appropriate prefixes.' AS Message;

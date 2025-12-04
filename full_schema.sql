CREATE DATABASE IF NOT EXISTS asset_management_db;

USE asset_management_db;

-- ============================================
-- CORE MODULE (Users & RBAC)
-- ============================================

-- Users Table
CREATE TABLE IF NOT EXISTS core_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    department VARCHAR(100),
    position VARCHAR(100),
    password VARCHAR(255), -- Added for auth
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modules Table
CREATE TABLE IF NOT EXISTS core_modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    route VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles Table
CREATE TABLE IF NOT EXISTS core_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions Table
CREATE TABLE IF NOT EXISTS core_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    module_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES core_modules(id) ON DELETE CASCADE
);

-- User Roles Junction
CREATE TABLE IF NOT EXISTS core_user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES core_users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES core_roles(id) ON DELETE CASCADE
);

-- User Permissions Junction (Direct Permissions)
CREATE TABLE IF NOT EXISTS core_user_permissions (
    user_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (user_id, permission_id),
    FOREIGN KEY (user_id) REFERENCES core_users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES core_permissions(id) ON DELETE CASCADE
);

-- Role Modules Junction
CREATE TABLE IF NOT EXISTS core_role_modules (
    role_id INT NOT NULL,
    module_id INT NOT NULL,
    PRIMARY KEY (role_id, module_id),
    FOREIGN KEY (role_id) REFERENCES core_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES core_modules(id) ON DELETE CASCADE
);

-- Role Permissions Junction
CREATE TABLE IF NOT EXISTS core_role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES core_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES core_permissions(id) ON DELETE CASCADE
);

-- ============================================
-- ASSET MANAGEMENT MODULE
-- ============================================

-- Assets Table
CREATE TABLE IF NOT EXISTS asset_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status ENUM('Ready to Deploy', 'Deployed', 'Archived', 'Broken') DEFAULT 'Ready to Deploy',
    serial_number VARCHAR(100) UNIQUE,
    purchase_date DATE,
    image_url VARCHAR(255),
    checked_out_to VARCHAR(255) DEFAULT NULL,
    checked_out_at TIMESTAMP NULL DEFAULT NULL,
    checkout_date DATE DEFAULT NULL,
    expected_checkin_date DATE DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Locations Table
CREATE TABLE IF NOT EXISTS asset_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    zip VARCHAR(20),
    status ENUM('Available', 'Occupied', 'Maintenance') DEFAULT 'Available',
    checked_out_to VARCHAR(255) DEFAULT NULL,
    checked_out_type VARCHAR(50) DEFAULT NULL,
    checked_out_at DATETIME DEFAULT NULL,
    expected_checkin_date DATE DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Licenses Table
CREATE TABLE IF NOT EXISTS asset_licenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    software_name VARCHAR(255) NOT NULL,
    product_key VARCHAR(255) NOT NULL,
    seats INT NOT NULL DEFAULT 1,
    purchase_date DATE,
    expiration_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accessories Table
CREATE TABLE IF NOT EXISTS asset_accessories (
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
    image_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Components Table
CREATE TABLE IF NOT EXISTS asset_components (
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

-- Accounts Table
CREATE TABLE IF NOT EXISTS asset_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_type VARCHAR(50) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Maintenances Table
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
-- ASSIGNMENT & HISTORY TABLES
-- ============================================

-- Asset Checkout History
CREATE TABLE IF NOT EXISTS asset_checkout_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    checked_out_to VARCHAR(255) NOT NULL,
    checked_out_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checked_in_at TIMESTAMP NULL DEFAULT NULL,
    checkout_date DATE DEFAULT NULL,
    expected_checkin_date DATE DEFAULT NULL,
    notes TEXT,
    FOREIGN KEY (asset_id) REFERENCES asset_items(id) ON DELETE CASCADE
);

-- Location Checkout History
CREATE TABLE IF NOT EXISTS asset_location_checkout_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_id INT NOT NULL,
    checked_out_to VARCHAR(255) NOT NULL,
    checked_out_type VARCHAR(50) NOT NULL,
    checked_out_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    checked_in_at DATETIME NULL DEFAULT NULL,
    notes TEXT,
    FOREIGN KEY (location_id) REFERENCES asset_locations(id) ON DELETE CASCADE
);

-- License Assignments
CREATE TABLE IF NOT EXISTS asset_license_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    license_id INT NOT NULL,
    assigned_to VARCHAR(255) NOT NULL,
    assigned_type VARCHAR(50) NOT NULL, -- 'user' or 'asset'
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP NULL DEFAULT NULL,
    notes TEXT,
    FOREIGN KEY (license_id) REFERENCES asset_licenses(id) ON DELETE CASCADE
);

-- Accessory Assignments
CREATE TABLE IF NOT EXISTS asset_accessory_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    accessory_id INT NOT NULL,
    assigned_to VARCHAR(255) NOT NULL,
    assigned_type VARCHAR(50) NOT NULL, -- 'user', 'asset', 'location'
    quantity INT NOT NULL DEFAULT 1,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP NULL DEFAULT NULL,
    notes TEXT,
    FOREIGN KEY (accessory_id) REFERENCES asset_accessories(id) ON DELETE CASCADE
);

-- Component Assignments
CREATE TABLE IF NOT EXISTS asset_component_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    component_id INT NOT NULL,
    assigned_to VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    notes TEXT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (component_id) REFERENCES asset_components(id) ON DELETE CASCADE
);

-- Account Assignments
CREATE TABLE IF NOT EXISTS asset_account_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    assigned_to VARCHAR(255) NOT NULL,
    assigned_type ENUM('asset', 'license') NOT NULL,
    notes TEXT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES asset_accounts(id) ON DELETE CASCADE
);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert Users
INSERT INTO core_users (name, email, phone, department, position) VALUES 
('John Doe', 'john.doe@company.com', '+62 812-3456-7890', 'IT', 'System Administrator'),
('Jane Smith', 'jane.smith@company.com', '+62 813-9876-5432', 'HR', 'HR Manager'),
('Bob Johnson', 'bob.johnson@company.com', '+62 821-1234-5678', 'Finance', 'Accountant');

-- Insert Assets
INSERT INTO asset_items (name, category, status, serial_number, purchase_date) VALUES 
('MacBook Pro M1', 'Laptop', 'Ready to Deploy', 'MBP-2021-001', '2023-01-15'),
('Dell XPS 15', 'Laptop', 'Deployed', 'DELL-2022-055', '2022-11-20'),
('Logitech MX Master 3', 'Accessory', 'Ready to Deploy', 'LOGI-MX-003', '2023-03-10'),
('Herman Miller Aeron', 'Furniture', 'Deployed', 'HM-AERON-99', '2021-06-01');

-- Insert Locations
INSERT INTO asset_locations (name, address, city, state, country, zip) VALUES 
('Main Office', 'Jl. Sudirman No. 123', 'Jakarta', 'DKI Jakarta', 'Indonesia', '12190'),
('Branch Office - Surabaya', 'Jl. Basuki Rahmat No. 45', 'Surabaya', 'Jawa Timur', 'Indonesia', '60271'),
('Warehouse', 'Jl. Industri Raya No. 88', 'Tangerang', 'Banten', 'Indonesia', '15134');

-- Insert Modules
INSERT IGNORE INTO core_modules (name, route, icon) VALUES 
('Asset Management', '/assets', 'Package'),
('System Administrator', '/sysadmin', 'Shield');

-- Insert Roles
INSERT IGNORE INTO core_roles (name, description) VALUES 
('Super Admin', 'Full access to all modules'),
('Staff', 'Access to Asset Management only');

-- Insert Permissions
INSERT IGNORE INTO core_permissions (name, description, module_id) VALUES
('assets.create', 'Create new assets', (SELECT id FROM core_modules WHERE name = 'Asset Management')),
('assets.read', 'View assets', (SELECT id FROM core_modules WHERE name = 'Asset Management')),
('assets.update', 'Update assets', (SELECT id FROM core_modules WHERE name = 'Asset Management')),
('assets.delete', 'Delete assets', (SELECT id FROM core_modules WHERE name = 'Asset Management')),

('locations.create', 'Create new locations', (SELECT id FROM core_modules WHERE name = 'Asset Management')),
('locations.read', 'View locations', (SELECT id FROM core_modules WHERE name = 'Asset Management')),
('locations.update', 'Update locations', (SELECT id FROM core_modules WHERE name = 'Asset Management')),
('locations.delete', 'Delete locations', (SELECT id FROM core_modules WHERE name = 'Asset Management')),

('users.create', 'Create users', (SELECT id FROM core_modules WHERE name = 'Asset Management')),
('users.read', 'View users', (SELECT id FROM core_modules WHERE name = 'Asset Management')),
('users.update', 'Update users', (SELECT id FROM core_modules WHERE name = 'Asset Management')),
('users.delete', 'Delete users', (SELECT id FROM core_modules WHERE name = 'Asset Management')),

('roles.create', 'Create roles', (SELECT id FROM core_modules WHERE name = 'System Administrator')),
('roles.read', 'View roles', (SELECT id FROM core_modules WHERE name = 'System Administrator')),
('roles.update', 'Update roles', (SELECT id FROM core_modules WHERE name = 'System Administrator')),
('roles.delete', 'Delete roles', (SELECT id FROM core_modules WHERE name = 'System Administrator')),

('permissions.create', 'Create permissions', (SELECT id FROM core_modules WHERE name = 'System Administrator')),
('permissions.read', 'View permissions', (SELECT id FROM core_modules WHERE name = 'System Administrator')),
('permissions.update', 'Update permissions', (SELECT id FROM core_modules WHERE name = 'System Administrator')),
('permissions.delete', 'Delete permissions', (SELECT id FROM core_modules WHERE name = 'System Administrator'));

-- Assign Modules to Roles
INSERT IGNORE INTO core_role_modules (role_id, module_id) 
SELECT r.id, m.id FROM core_roles r, core_modules m 
WHERE r.name = 'Super Admin';

INSERT IGNORE INTO core_role_modules (role_id, module_id) 
SELECT r.id, m.id FROM core_roles r, core_modules m 
WHERE r.name = 'Staff' AND m.name = 'Asset Management';

-- Assign Super Admin role to the first user (John Doe)
INSERT IGNORE INTO core_user_roles (user_id, role_id)
SELECT u.id, r.id FROM core_users u, core_roles r
WHERE u.email = 'john.doe@company.com' AND r.name = 'Super Admin';

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

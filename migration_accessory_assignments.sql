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

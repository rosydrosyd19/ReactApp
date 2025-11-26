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

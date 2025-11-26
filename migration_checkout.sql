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

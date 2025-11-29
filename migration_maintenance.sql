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

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

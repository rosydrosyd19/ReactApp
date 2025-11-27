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

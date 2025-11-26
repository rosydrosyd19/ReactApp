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

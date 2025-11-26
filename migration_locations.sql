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

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    department VARCHAR(100),
    position VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email, phone, department, position) VALUES 
('John Doe', 'john.doe@company.com', '+62 812-3456-7890', 'IT', 'System Administrator'),
('Jane Smith', 'jane.smith@company.com', '+62 813-9876-5432', 'HR', 'HR Manager'),
('Bob Johnson', 'bob.johnson@company.com', '+62 821-1234-5678', 'Finance', 'Accountant');

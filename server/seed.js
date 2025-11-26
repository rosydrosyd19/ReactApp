const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Default XAMPP password
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL server');

    const createDbQuery = 'CREATE DATABASE IF NOT EXISTS asset_management_db';

    db.query(createDbQuery, (err) => {
        if (err) {
            console.error('Error creating database:', err);
            process.exit(1);
        }
        console.log('Database created or already exists');

        db.changeUser({ database: 'asset_management_db' }, (err) => {
            if (err) {
                console.error('Error switching database:', err);
                process.exit(1);
            }

            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS assets (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    category VARCHAR(100) NOT NULL,
                    status ENUM('Ready to Deploy', 'Deployed', 'Archived', 'Broken') DEFAULT 'Ready to Deploy',
                    serial_number VARCHAR(100) UNIQUE,
                    purchase_date DATE,
                    image_url VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;

            db.query(createTableQuery, (err) => {
                if (err) {
                    console.error('Error creating table:', err);
                    process.exit(1);
                }
                console.log('Table assets created or already exists');

                // Check if data exists
                db.query('SELECT COUNT(*) as count FROM assets', (err, results) => {
                    if (err) {
                        console.error('Error checking data:', err);
                        process.exit(1);
                    }

                    if (results[0].count === 0) {
                        const insertQuery = `
                            INSERT INTO assets (name, category, status, serial_number, purchase_date) VALUES 
                            ('MacBook Pro M1', 'Laptop', 'Ready to Deploy', 'MBP-2021-001', '2023-01-15'),
                            ('Dell XPS 15', 'Laptop', 'Deployed', 'DELL-2022-055', '2022-11-20'),
                            ('Logitech MX Master 3', 'Accessory', 'Ready to Deploy', 'LOGI-MX-003', '2023-03-10'),
                            ('Herman Miller Aeron', 'Furniture', 'Deployed', 'HM-AERON-99', '2021-06-01')
                        `;
                        db.query(insertQuery, (err) => {
                            if (err) {
                                console.error('Error seeding data:', err);
                                process.exit(1);
                            }
                            console.log('Sample data inserted');
                            process.exit(0);
                        });
                    } else {
                        console.log('Data already exists, skipping seed');
                        process.exit(0);
                    }
                });
            });
        });
    });
});

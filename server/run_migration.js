const fs = require('fs');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
});

const migrationFile = path.join(__dirname, '../migration_license_assignments.sql');
const sql = fs.readFileSync(migrationFile, 'utf8');

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log('Connected to database.');

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error running migration:', err);
            process.exit(1);
        }
        console.log('Migration completed successfully.');
        db.end();
    });
});

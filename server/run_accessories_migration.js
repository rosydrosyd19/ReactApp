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

const migrationFiles = [
    '../migration_accessories.sql',
    '../migration_accessory_assignments.sql'
];

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log('Connected to database.');

    const runMigration = (index) => {
        if (index >= migrationFiles.length) {
            console.log('All migrations completed successfully.');
            db.end();
            return;
        }

        const migrationFile = path.join(__dirname, migrationFiles[index]);
        const sql = fs.readFileSync(migrationFile, 'utf8');

        console.log(`Running migration: ${migrationFiles[index]}`);
        db.query(sql, (err, result) => {
            if (err) {
                console.error(`Error running migration ${migrationFiles[index]}:`, err);
                process.exit(1);
            }
            console.log(`Migration ${migrationFiles[index]} completed.`);
            runMigration(index + 1);
        });
    };

    runMigration(0);
});

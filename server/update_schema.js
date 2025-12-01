const db = require('./db');

const alterTableQuery = "ALTER TABLE core_users ADD COLUMN password VARCHAR(255);";

db.query(alterTableQuery, (err, result) => {
    if (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists.');
        } else {
            console.error('Error updating schema:', err);
            process.exit(1);
        }
    } else {
        console.log('Schema updated successfully.');
    }
    process.exit(0);
});

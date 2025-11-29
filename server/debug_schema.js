const db = require('./shared/config/db');

const query = "SELECT COLUMN_NAME, IS_NULLABLE, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'asset_management_db' AND TABLE_NAME = 'asset_items'";

db.query(query, (err, results) => {
    if (err) {
        console.error('Error fetching schema:', err);
        process.exit(1);
    }
    console.log('Schema for asset_items:');
    console.table(results);
    process.exit(0);
});

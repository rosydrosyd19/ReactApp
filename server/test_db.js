const db = require('./db');

console.log('Testing database connection...');

db.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
    console.log('Database connection successful!', results);

    // Test assets table
    db.query('SELECT COUNT(*) as count FROM asset_items', (err, results) => {
        if (err) {
            console.error('Error querying asset_items:', err);
            process.exit(1);
        }
        console.log('Assets count:', results[0].count);
        process.exit(0);
    });
});

const fs = require('fs');
const path = require('path');
const db = require('./shared/config/db');

console.log('🔄 Starting maintenance table migration...');

const migrationSQL = fs.readFileSync(path.join(__dirname, '../migration_maintenance.sql'), 'utf8');

db.query(migrationSQL, (err, result) => {
    if (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
    console.log('✅ Maintenance table created successfully!');
    process.exit(0);
});

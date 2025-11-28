const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'asset_management_db',
    multipleStatements: true
});

console.log('🔄 Starting database migration...\n');

db.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err);
        process.exit(1);
    }
    console.log('✅ Connected to database\n');

    // Read and execute migration script
    const fs = require('fs');
    const path = require('path');
    const migrationSQL = fs.readFileSync(path.join(__dirname, '../migration_rename_tables.sql'), 'utf8');

    console.log('📝 Executing migration script...\n');

    db.query(migrationSQL, (err, results) => {
        if (err) {
            console.error('❌ Migration failed:', err);
            console.log('\n⚠️  You can rollback using: mysql -u root asset_management_db < rollback_rename_tables.sql');
            process.exit(1);
        }

        console.log('✅ Migration completed successfully!\n');

        // Show renamed tables
        db.query('SHOW TABLES', (err, tables) => {
            if (err) {
                console.error('Error showing tables:', err);
            } else {
                console.log('📊 Current tables in database:');
                tables.forEach(table => {
                    const tableName = Object.values(table)[0];
                    console.log(`   - ${tableName}`);
                });
            }

            db.end();
            console.log('\n✨ Database migration complete!');
            console.log('📌 Next step: Update backend routes with new table names\n');
        });
    });
});

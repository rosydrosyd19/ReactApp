const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function runMigration() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'asset_management_db'
    });

    try {
        console.log('Running accounts migration...');

        // Read and execute accounts table migration
        const accountsSql = await fs.readFile(
            path.join(__dirname, '..', 'migration_accounts.sql'),
            'utf8'
        );
        await connection.query(accountsSql);
        console.log('✓ Accounts table created');

        // Read and execute account_assignments table migration
        const assignmentsSql = await fs.readFile(
            path.join(__dirname, '..', 'migration_account_assignments.sql'),
            'utf8'
        );
        await connection.query(assignmentsSql);
        console.log('✓ Account assignments table created');

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
    }
}

runMigration();

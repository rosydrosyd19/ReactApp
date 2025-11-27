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
        console.log('Running components migration...');

        // Read and execute components table migration
        const componentsSql = await fs.readFile(
            path.join(__dirname, '..', 'migration_components.sql'),
            'utf8'
        );
        await connection.query(componentsSql);
        console.log('✓ Components table created');

        // Read and execute component_assignments table migration
        const assignmentsSql = await fs.readFile(
            path.join(__dirname, '..', 'migration_component_assignments.sql'),
            'utf8'
        );
        await connection.query(assignmentsSql);
        console.log('✓ Component assignments table created');

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
    }
}

runMigration();

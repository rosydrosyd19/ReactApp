const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'asset_management_db',
    multipleStatements: true
};

const modules = [
    { name: 'Asset Management', description: 'Manage assets, licenses, accessories, etc.' },
    { name: 'System Administrator', description: 'Manage users, roles, and permissions.' }
];

const permissions = [
    // Asset Management
    { name: 'assets.read', description: 'View assets', module: 'Asset Management' },
    { name: 'assets.create', description: 'Create assets', module: 'Asset Management' },
    { name: 'assets.update', description: 'Update assets', module: 'Asset Management' },
    { name: 'assets.delete', description: 'Delete assets', module: 'Asset Management' },

    { name: 'licenses.read', description: 'View licenses', module: 'Asset Management' },
    { name: 'licenses.create', description: 'Create licenses', module: 'Asset Management' },
    { name: 'licenses.update', description: 'Update licenses', module: 'Asset Management' },
    { name: 'licenses.delete', description: 'Delete licenses', module: 'Asset Management' },

    { name: 'accessories.read', description: 'View accessories', module: 'Asset Management' },
    { name: 'accessories.create', description: 'Create accessories', module: 'Asset Management' },
    { name: 'accessories.update', description: 'Update accessories', module: 'Asset Management' },
    { name: 'accessories.delete', description: 'Delete accessories', module: 'Asset Management' },

    { name: 'components.read', description: 'View components', module: 'Asset Management' },
    { name: 'components.create', description: 'Create components', module: 'Asset Management' },
    { name: 'components.update', description: 'Update components', module: 'Asset Management' },
    { name: 'components.delete', description: 'Delete components', module: 'Asset Management' },

    { name: 'accounts.read', description: 'View accounts', module: 'Asset Management' },
    { name: 'accounts.create', description: 'Create accounts', module: 'Asset Management' },
    { name: 'accounts.update', description: 'Update accounts', module: 'Asset Management' },
    { name: 'accounts.delete', description: 'Delete accounts', module: 'Asset Management' },

    { name: 'locations.read', description: 'View locations', module: 'Asset Management' },
    { name: 'locations.create', description: 'Create locations', module: 'Asset Management' },
    { name: 'locations.update', description: 'Update locations', module: 'Asset Management' },
    { name: 'locations.delete', description: 'Delete locations', module: 'Asset Management' },

    // System Administrator
    { name: 'roles.read', description: 'View roles', module: 'System Administrator' },
    { name: 'roles.create', description: 'Create roles', module: 'System Administrator' },
    { name: 'roles.update', description: 'Update roles', module: 'System Administrator' },
    { name: 'roles.delete', description: 'Delete roles', module: 'System Administrator' },

    { name: 'permissions.read', description: 'View permissions', module: 'System Administrator' },
    { name: 'permissions.create', description: 'Create permissions', module: 'System Administrator' },
    { name: 'permissions.update', description: 'Update permissions', module: 'System Administrator' },
    { name: 'permissions.delete', description: 'Delete permissions', module: 'System Administrator' },

    { name: 'users.read', description: 'View users', module: 'System Administrator' },
    { name: 'users.create', description: 'Create users', module: 'System Administrator' },
    { name: 'users.update', description: 'Update users', module: 'System Administrator' },
    { name: 'users.delete', description: 'Delete users', module: 'System Administrator' },
];

async function seed() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // 1. Ensure Modules Exist
        console.log('Seeding modules...');
        for (const mod of modules) {
            const [rows] = await connection.execute('SELECT id FROM core_modules WHERE name = ?', [mod.name]);
            if (rows.length === 0) {
                await connection.execute('INSERT INTO core_modules (name, description) VALUES (?, ?)', [mod.name, mod.description]);
                console.log(`Created module: ${mod.name}`);
            }
        }

        // 2. Ensure Permissions Exist
        console.log('Seeding permissions...');
        for (const perm of permissions) {
            // Get module ID
            const [modRows] = await connection.execute('SELECT id FROM core_modules WHERE name = ?', [perm.module]);
            if (modRows.length === 0) {
                console.error(`Module not found for permission ${perm.name}: ${perm.module}`);
                continue;
            }
            const moduleId = modRows[0].id;

            // Check if permission exists
            const [permRows] = await connection.execute('SELECT id FROM core_permissions WHERE name = ?', [perm.name]);
            if (permRows.length === 0) {
                await connection.execute('INSERT INTO core_permissions (name, description, module_id) VALUES (?, ?, ?)', [perm.name, perm.description, moduleId]);
                console.log(`Created permission: ${perm.name}`);
            } else {
                // Update module_id if needed (fix for existing permissions with wrong module)
                await connection.execute('UPDATE core_permissions SET module_id = ? WHERE name = ?', [moduleId, perm.name]);
            }
        }

        console.log('Seeding complete.');

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

seed();

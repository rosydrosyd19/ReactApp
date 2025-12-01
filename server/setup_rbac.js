const db = require('./db');

const queries = [
    `CREATE TABLE IF NOT EXISTS core_modules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        route VARCHAR(100) NOT NULL,
        icon VARCHAR(50)
    )`,
    `CREATE TABLE IF NOT EXISTS core_roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS core_permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        module_id INT,
        FOREIGN KEY (module_id) REFERENCES core_modules(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS core_user_roles (
        user_id INT NOT NULL,
        role_id INT NOT NULL,
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES core_users(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES core_roles(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS core_role_modules (
        role_id INT NOT NULL,
        module_id INT NOT NULL,
        PRIMARY KEY (role_id, module_id),
        FOREIGN KEY (role_id) REFERENCES core_roles(id) ON DELETE CASCADE,
        FOREIGN KEY (module_id) REFERENCES core_modules(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS core_role_permissions (
        role_id INT NOT NULL,
        permission_id INT NOT NULL,
        PRIMARY KEY (role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES core_roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES core_permissions(id) ON DELETE CASCADE
    )`,
    // Insert Initial Data
    `INSERT IGNORE INTO core_modules (name, route, icon) VALUES 
        ('Asset Management', '/assets', 'Package'),
        ('System Administrator', '/sysadmin', 'Shield')`,
    `INSERT IGNORE INTO core_roles (name, description) VALUES 
        ('Super Admin', 'Full access to all modules'),
        ('Staff', 'Access to Asset Management only')`,
    // Assign Modules to Roles
    `INSERT IGNORE INTO core_role_modules (role_id, module_id) 
     SELECT r.id, m.id FROM core_roles r, core_modules m 
     WHERE r.name = 'Super Admin'`,
    `INSERT IGNORE INTO core_role_modules (role_id, module_id) 
     SELECT r.id, m.id FROM core_roles r, core_modules m 
     WHERE r.name = 'Staff' AND m.name = 'Asset Management'`,
    // Assign Super Admin role to the first user (usually admin)
    `INSERT IGNORE INTO core_user_roles (user_id, role_id)
     SELECT u.id, r.id FROM core_users u, core_roles r
     WHERE u.email = 'admin@example.com' AND r.name = 'Super Admin'`
];

const runMigrations = async () => {
    console.log('Starting RBAC migration...');
    for (const query of queries) {
        await new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    console.error('Error executing query:', query);
                    console.error(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    console.log('RBAC migration completed successfully.');
    process.exit(0);
};

runMigrations().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});

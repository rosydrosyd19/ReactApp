const db = require('./db');

const USER_NAME = 'Kholifahtu Rosyd Nasrulloh';
const ROLE_NAME = 'Super Admin';

const grantAccess = async () => {
    try {
        console.log(`Starting process for user: ${USER_NAME}`);

        // 1. Find User
        const user = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM core_users WHERE name = ?', [USER_NAME], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });

        if (!user) {
            console.error(`User "${USER_NAME}" not found!`);
            process.exit(1);
        }
        console.log(`Found user: ${user.name} (ID: ${user.id})`);

        // 2. Find Role
        let role = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM core_roles WHERE name = ?', [ROLE_NAME], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });

        if (!role) {
            console.log(`Role "${ROLE_NAME}" not found. Creating it...`);
            const result = await new Promise((resolve, reject) => {
                db.query('INSERT INTO core_roles (name, description) VALUES (?, ?)', [ROLE_NAME, 'Full access to all modules'], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
            role = { id: result.insertId, name: ROLE_NAME };
            console.log(`Created role: ${ROLE_NAME} (ID: ${role.id})`);
        } else {
            console.log(`Found role: ${role.name} (ID: ${role.id})`);
        }

        // 3. Assign Role to User
        await new Promise((resolve, reject) => {
            db.query('INSERT IGNORE INTO core_user_roles (user_id, role_id) VALUES (?, ?)', [user.id, role.id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
        console.log(`Assigned role "${ROLE_NAME}" to user "${USER_NAME}"`);

        // 4. Ensure Role has All Permissions
        // Get all permissions
        const permissions = await new Promise((resolve, reject) => {
            db.query('SELECT id FROM core_permissions', (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        console.log(`Found ${permissions.length} total permissions.`);

        // Assign all permissions to the role
        let assignedCount = 0;
        for (const perm of permissions) {
            await new Promise((resolve, reject) => {
                db.query('INSERT IGNORE INTO core_role_permissions (role_id, permission_id) VALUES (?, ?)', [role.id, perm.id], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
            assignedCount++;
        }
        console.log(`Ensured role "${ROLE_NAME}" has all ${assignedCount} permissions.`);

        // 5. Ensure Role has All Modules
        const modules = await new Promise((resolve, reject) => {
            db.query('SELECT id FROM core_modules', (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        for (const mod of modules) {
            await new Promise((resolve, reject) => {
                db.query('INSERT IGNORE INTO core_role_modules (role_id, module_id) VALUES (?, ?)', [role.id, mod.id], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
        }
        console.log(`Ensured role "${ROLE_NAME}" has access to all modules.`);


        console.log('SUCCESS: Full access granted.');
        process.exit(0);

    } catch (error) {
        console.error('Error granting access:', error);
        process.exit(1);
    }
};

grantAccess();

const db = require('./db');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
    const email = 'admin@example.com';
    const password = 'password123';
    const name = 'Super Admin';

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if user exists
        const checkUserSql = 'SELECT * FROM core_users WHERE email = ?';
        db.query(checkUserSql, [email], (err, results) => {
            if (err) {
                console.error('Error checking user:', err);
                process.exit(1);
            }

            if (results.length > 0) {
                // Update existing user
                const updateSql = 'UPDATE core_users SET password = ? WHERE email = ?';
                db.query(updateSql, [hashedPassword, email], (err) => {
                    if (err) {
                        console.error('Error updating user:', err);
                        process.exit(1);
                    }
                    console.log(`User ${email} password updated to: ${password}`);
                    assignRole(results[0].id);
                });
            } else {
                // Create new user
                const insertSql = 'INSERT INTO core_users (name, email, password, department, position) VALUES (?, ?, ?, ?, ?)';
                db.query(insertSql, [name, email, hashedPassword, 'IT', 'System Administrator'], (err, result) => {
                    if (err) {
                        console.error('Error creating user:', err);
                        process.exit(1);
                    }
                    console.log(`User ${email} created with password: ${password}`);
                    assignRole(result.insertId);
                });
            }
        });
    } catch (err) {
        console.error('Server error:', err);
        process.exit(1);
    }
};

const assignRole = (userId) => {
    // Get Super Admin Role ID
    db.query('SELECT id FROM core_roles WHERE name = "Super Admin"', (err, results) => {
        if (err || results.length === 0) {
            console.error('Error finding Super Admin role or role does not exist');
            process.exit(1);
        }
        const roleId = results[0].id;

        // Assign Role
        const assignSql = 'INSERT IGNORE INTO core_user_roles (user_id, role_id) VALUES (?, ?)';
        db.query(assignSql, [userId, roleId], (err) => {
            if (err) {
                console.error('Error assigning role:', err);
                process.exit(1);
            }
            console.log('Super Admin role assigned successfully');
            process.exit(0);
        });
    });
};

createAdmin();

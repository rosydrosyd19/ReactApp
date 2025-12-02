const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Register (for initial setup)
router.post('/register', async (req, res) => {
    const { name, email, password, department, position } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Check if user exists
        const checkUserSql = 'SELECT * FROM core_users WHERE email = ?';
        db.query(checkUserSql, [email], async (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insert user
            const insertSql = 'INSERT INTO core_users (name, email, password, department, position) VALUES (?, ?, ?, ?, ?)';
            db.query(insertSql, [name, email, hashedPassword, department, position], (err, result) => {
                if (err) return res.status(500).json(err);
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', (req, res) => {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const sql = 'SELECT * FROM core_users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = results[0];

        if (!user.password) {
            return res.status(400).json({ message: 'Account not set up for login. Please contact admin.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Get User Roles and Modules
        const rolesSql = `
            SELECT r.id, r.name FROM core_roles r
            JOIN core_user_roles ur ON r.id = ur.role_id
            WHERE ur.user_id = ?
        `;

        db.query(rolesSql, [user.id], (err, roles) => {
            if (err) return res.status(500).json(err);

            const modulesSql = `
                SELECT DISTINCT m.* FROM core_modules m
                JOIN core_role_modules rm ON m.id = rm.module_id
                JOIN core_user_roles ur ON rm.role_id = ur.role_id
                WHERE ur.user_id = ?
            `;

            db.query(modulesSql, [user.id], (err, modules) => {
                if (err) return res.status(500).json(err);

                // Fetch effective permissions (from roles and direct user assignments)
                const rolePermsSql = `
                    SELECT DISTINCT p.* FROM core_permissions p
                    JOIN core_role_permissions rp ON p.id = rp.permission_id
                    JOIN core_user_roles ur ON ur.role_id = rp.role_id
                    WHERE ur.user_id = ?
                `;

                const userPermsSql = `
                    SELECT p.* FROM core_permissions p
                    JOIN core_user_permissions up ON p.id = up.permission_id
                    WHERE up.user_id = ?
                `;

                db.query(rolePermsSql, [user.id], (err, rolePerms) => {
                    if (err) {
                        // If role permissions table missing, continue with empty
                        rolePerms = [];
                    }

                    db.query(userPermsSql, [user.id], (err, userPerms) => {
                        if (err) {
                            userPerms = [];
                        }

                        // Merge and dedupe by id
                        const permMap = new Map();
                        [...rolePerms, ...userPerms].forEach(p => permMap.set(p.id, p));
                        const perms = Array.from(permMap.values());

                        // Create token
                        const expiresIn = rememberMe ? '30d' : '24h';
                        const token = jwt.sign(
                            { id: user.id, email: user.email, name: user.name, roles: roles.map(r => r.name) },
                            JWT_SECRET,
                            { expiresIn }
                        );

                        res.json({
                            token,
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                department: user.department,
                                position: user.position,
                                roles,
                                modules,
                                permissions: perms // add permissions list
                            }
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;

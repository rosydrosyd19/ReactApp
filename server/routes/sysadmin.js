const express = require('express');
const router = express.Router();
const db = require('../db');

// --- MODULES ---
router.get('/modules', (req, res) => {
    const sql = 'SELECT * FROM core_modules ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// --- ROLES ---
router.get('/roles', (req, res) => {
    const sql = 'SELECT * FROM core_roles ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Get single role by ID
router.get('/roles/:id', (req, res) => {
    const sql = 'SELECT * FROM core_roles WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json(results[0]);
    });
});

router.post('/roles', (req, res) => {
    const { name, description } = req.body;
    const sql = 'INSERT INTO core_roles (name, description) VALUES (?, ?)';
    db.query(sql, [name, description], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: result.insertId, name, description });
    });
});

router.put('/roles/:id', (req, res) => {
    const { name, description } = req.body;
    const sql = 'UPDATE core_roles SET name = ?, description = ? WHERE id = ?';
    db.query(sql, [name, description, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Role updated successfully' });
    });
});

router.delete('/roles/:id', (req, res) => {
    const sql = 'DELETE FROM core_roles WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Role deleted successfully' });
    });
});

// --- ROLE MODULES ---
router.get('/roles/:id/modules', (req, res) => {
    const sql = `
        SELECT m.* FROM core_modules m
        JOIN core_role_modules rm ON m.id = rm.module_id
        WHERE rm.role_id = ?
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

router.post('/roles/:id/modules', (req, res) => {
    const { moduleIds } = req.body; // Array of module IDs
    const roleId = req.params.id;

    // First delete existing assignments
    db.query('DELETE FROM core_role_modules WHERE role_id = ?', [roleId], (err) => {
        if (err) return res.status(500).json(err);

        if (!moduleIds || moduleIds.length === 0) {
            return res.json({ message: 'Modules updated successfully' });
        }

        // Insert new assignments
        const values = moduleIds.map(moduleId => [roleId, moduleId]);
        db.query('INSERT INTO core_role_modules (role_id, module_id) VALUES ?', [values], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Modules updated successfully' });
        });
    });
});

// --- PERMISSIONS ---
router.get('/permissions', (req, res) => {
    const sql = 'SELECT * FROM core_permissions ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// --- USER ROLES ---
router.get('/users', (req, res) => {
    const sql = `
        SELECT u.id, u.name, u.email, u.department, u.position,
        GROUP_CONCAT(r.name) as role_names,
        GROUP_CONCAT(r.id) as role_ids
        FROM core_users u
        LEFT JOIN core_user_roles ur ON u.id = ur.user_id
        LEFT JOIN core_roles r ON ur.role_id = r.id
        GROUP BY u.id
        ORDER BY u.created_at DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        // Parse role_ids and role_names into arrays
        const users = results.map(user => ({
            ...user,
            role_ids: user.role_ids ? user.role_ids.split(',').map(Number) : [],
            role_names: user.role_names ? user.role_names.split(',') : []
        }));
        res.json(users);
    });
});

router.get('/users/:id/roles', (req, res) => {
    const sql = `
        SELECT r.* FROM core_roles r
        JOIN core_user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = ?
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

router.post('/users/:id/roles', (req, res) => {
    const { roleIds } = req.body;
    const userId = req.params.id;

    db.query('DELETE FROM core_user_roles WHERE user_id = ?', [userId], (err) => {
        if (err) return res.status(500).json(err);

        if (!roleIds || roleIds.length === 0) {
            return res.json({ message: 'Roles updated successfully' });
        }

        const values = roleIds.map(roleId => [userId, roleId]);
        db.query('INSERT INTO core_user_roles (user_id, role_id) VALUES ?', [values], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Roles updated successfully' });
        });
    });
});

module.exports = router;

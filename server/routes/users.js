const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

// Get all users
router.get('/', (req, res) => {
    const sql = 'SELECT id, name, email, phone, department, position, created_at FROM core_users ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Get single user
router.get('/:id', (req, res) => {
    const sql = 'SELECT id, name, email, phone, department, position, created_at FROM core_users WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(result[0]);
    });
});

// Create user
router.post('/', async (req, res) => {
    const { name, email, phone, department, position, password } = req.body;

    try {
        // Hash password if provided
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const sql = 'INSERT INTO core_users (name, email, phone, department, position, password) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [name, email, phone, department, position, hashedPassword], (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ id: result.insertId, name, email, phone, department, position });
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    const { name, email, phone, department, position, password } = req.body;

    try {
        // If password is provided, hash it and update; otherwise just update other fields
        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = 'UPDATE core_users SET name = ?, email = ?, phone = ?, department = ?, position = ?, password = ? WHERE id = ?';
            db.query(sql, [name, email, phone, department, position, hashedPassword, req.params.id], (err, result) => {
                if (err) return res.status(500).json(err);
                res.json({ message: 'User updated successfully' });
            });
        } else {
            const sql = 'UPDATE core_users SET name = ?, email = ?, phone = ?, department = ?, position = ? WHERE id = ?';
            db.query(sql, [name, email, phone, department, position, req.params.id], (err, result) => {
                if (err) return res.status(500).json(err);
                res.json({ message: 'User updated successfully' });
            });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
});

// Delete user
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM core_users WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'User deleted successfully' });
    });
});

module.exports = router;

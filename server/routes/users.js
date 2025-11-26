const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all users
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM users ORDER BY name ASC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Get single user
router.get('/:id', (req, res) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(result[0]);
    });
});

// Create user
router.post('/', (req, res) => {
    const { name, email, phone, department, position } = req.body;
    const sql = 'INSERT INTO users (name, email, phone, department, position) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, email, phone, department, position], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

// Update user
router.put('/:id', (req, res) => {
    const { name, email, phone, department, position } = req.body;
    const sql = 'UPDATE users SET name = ?, email = ?, phone = ?, department = ?, position = ? WHERE id = ?';
    db.query(sql, [name, email, phone, department, position, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'User updated successfully' });
    });
});

// Delete user
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'User deleted successfully' });
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all locations
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM locations ORDER BY name ASC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Get single location
router.get('/:id', (req, res) => {
    const sql = 'SELECT * FROM locations WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: 'Location not found' });
        res.json(result[0]);
    });
});

// Create location
router.post('/', (req, res) => {
    const { name, address, city, state, country, zip } = req.body;
    const sql = 'INSERT INTO locations (name, address, city, state, country, zip) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, address, city, state, country, zip], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

// Update location
router.put('/:id', (req, res) => {
    const { name, address, city, state, country, zip } = req.body;
    const sql = 'UPDATE locations SET name = ?, address = ?, city = ?, state = ?, country = ?, zip = ? WHERE id = ?';
    db.query(sql, [name, address, city, state, country, zip, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Location updated successfully' });
    });
});

// Delete location
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM locations WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Location deleted successfully' });
    });
});

module.exports = router;

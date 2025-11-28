const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all locations
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM asset_locations ORDER BY name ASC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Get single location
router.get('/:id', (req, res) => {
    const sql = 'SELECT * FROM asset_locations WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: 'Location not found' });
        res.json(result[0]);
    });
});

// Create location
router.post('/', (req, res) => {
    const { name, address, city, state, country, zip } = req.body;
    const sql = 'INSERT INTO asset_locations (name, address, city, state, country, zip) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, address, city, state, country, zip], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

// Update location
router.put('/:id', (req, res) => {
    const { name, address, city, state, country, zip } = req.body;
    const sql = 'UPDATE asset_locations SET name = ?, address = ?, city = ?, state = ?, country = ?, zip = ? WHERE id = ?';
    db.query(sql, [name, address, city, state, country, zip, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Location updated successfully' });
    });
});

// Delete location
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM asset_locations WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Location deleted successfully' });
    });
});

// Check-out location
router.post('/:id/checkout', (req, res) => {
    const { checked_out_to, checked_out_type, notes, expected_checkin_date } = req.body;
    const locationId = req.params.id;

    // Update location
    const updateLocationSql = 'UPDATE asset_locations SET status = ?, checked_out_to = ?, checked_out_type = ?, checked_out_at = NOW(), notes = ?, expected_checkin_date = ? WHERE id = ?';
    db.query(updateLocationSql, ['Occupied', checked_out_to, checked_out_type, notes, expected_checkin_date || null, locationId], (err) => {
        if (err) return res.status(500).json(err);

        // Add to history
        const historySql = 'INSERT INTO asset_location_checkout_history (location_id, checked_out_to, checked_out_type, notes) VALUES (?, ?, ?, ?)';
        db.query(historySql, [locationId, checked_out_to, checked_out_type, notes], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Location checked out successfully' });
        });
    });
});

// Check-in location
router.post('/:id/checkin', (req, res) => {
    const locationId = req.params.id;

    // Get current checkout info
    const getLocationSql = 'SELECT checked_out_at FROM asset_locations WHERE id = ?';
    db.query(getLocationSql, [locationId], (err, result) => {
        if (err) return res.status(500).json(err);

        // Update location
        const updateLocationSql = 'UPDATE asset_locations SET status = ?, checked_out_to = NULL, checked_out_type = NULL, checked_out_at = NULL, notes = NULL, expected_checkin_date = NULL WHERE id = ?';
        db.query(updateLocationSql, ['Available', locationId], (err) => {
            if (err) return res.status(500).json(err);

            // Update history
            const updateHistorySql = 'UPDATE asset_location_checkout_history SET checked_in_at = NOW() WHERE location_id = ? AND checked_in_at IS NULL';
            db.query(updateHistorySql, [locationId], (err) => {
                if (err) return res.status(500).json(err);
                res.json({ message: 'Location checked in successfully' });
            });
        });
    });
});

module.exports = router;

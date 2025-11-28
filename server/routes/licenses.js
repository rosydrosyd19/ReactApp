const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all licenses with available seats calculation
router.get('/', (req, res) => {
    const sql = `
        SELECT l.*, 
        (l.seats - COALESCE((SELECT COUNT(*) FROM asset_license_assignments WHERE license_id = l.id AND returned_at IS NULL), 0)) as available_seats
        FROM asset_licenses l
        ORDER BY l.created_at DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Get single license
router.get('/:id', (req, res) => {
    const sql = `
        SELECT l.*, 
        (l.seats - COALESCE((SELECT COUNT(*) FROM asset_license_assignments WHERE license_id = l.id AND returned_at IS NULL), 0)) as available_seats
        FROM asset_licenses l
        WHERE l.id = ?
    `;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: 'License not found' });
        res.json(result[0]);
    });
});

// Create license
router.post('/', (req, res) => {
    const { software_name, product_key, seats, purchase_date, expiration_date, notes } = req.body;
    const sql = 'INSERT INTO asset_licenses (software_name, product_key, seats, purchase_date, expiration_date, notes) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [software_name, product_key, seats, purchase_date, expiration_date, notes], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

// Update license
router.put('/:id', (req, res) => {
    const { software_name, product_key, seats, purchase_date, expiration_date, notes } = req.body;
    const sql = 'UPDATE asset_licenses SET software_name = ?, product_key = ?, seats = ?, purchase_date = ?, expiration_date = ?, notes = ? WHERE id = ?';
    db.query(sql, [software_name, product_key, seats, purchase_date, expiration_date, notes, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'License updated successfully' });
    });
});

// Delete license
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM asset_licenses WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'License deleted successfully' });
    });
});

// Assign license seat (Check Out)
router.post('/:id/checkout', (req, res) => {
    const { assigned_to, assigned_type, notes } = req.body;
    const licenseId = req.params.id;

    // Check available seats
    const checkSql = `
        SELECT l.seats, 
        (l.seats - COALESCE((SELECT COUNT(*) FROM asset_license_assignments WHERE license_id = l.id AND returned_at IS NULL), 0)) as available_seats
        FROM asset_licenses l WHERE l.id = ?
    `;
    db.query(checkSql, [licenseId], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: 'License not found' });

        if (result[0].available_seats <= 0) {
            return res.status(400).json({ message: 'No available seats' });
        }

        // Assign seat
        const assignSql = 'INSERT INTO asset_license_assignments (license_id, assigned_to, assigned_type, notes) VALUES (?, ?, ?, ?)';
        db.query(assignSql, [licenseId, assigned_to, assigned_type, notes], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'License seat assigned successfully' });
        });
    });
});

// Return license seat (Check In)
router.post('/:id/checkin/:assignmentId', (req, res) => {
    const { assignmentId } = req.params;

    const sql = 'UPDATE asset_license_assignments SET returned_at = NOW() WHERE id = ?';
    db.query(sql, [assignmentId], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'License seat returned successfully' });
    });
});

// Get license assignments
router.get('/:id/assignments', (req, res) => {
    const sql = 'SELECT * FROM asset_license_assignments WHERE license_id = ? ORDER BY assigned_at DESC';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Get accounts assigned to a license
router.get('/:id/accounts', (req, res) => {
    const licenseId = req.params.id;

    // Get all account assignments for this license
    const sql = `
        SELECT aa.*, a.account_type, a.account_name, a.username
        FROM asset_account_assignments aa
        JOIN accounts a ON aa.account_id = a.id
        WHERE aa.assigned_to = ? AND aa.assigned_type = 'license'
        ORDER BY aa.assigned_at DESC
    `;

    db.query(sql, [licenseId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

module.exports = router;

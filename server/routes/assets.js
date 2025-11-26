const express = require('express');
const router = express.Router();
const db = require('../db');
const upload = require('../middleware/upload');

// Get all assets
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM assets ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Get single asset
router.get('/:id', (req, res) => {
    const sql = 'SELECT * FROM assets WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: 'Asset not found' });
        res.json(result[0]);
    });
});

// Create asset with image upload
router.post('/', upload.single('image'), (req, res) => {
    const { name, category, status, serial_number, purchase_date } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = 'INSERT INTO assets (name, category, status, serial_number, purchase_date, image_url) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, category, status, serial_number, purchase_date, image_url], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: result.insertId, ...req.body, image_url });
    });
});

// Update asset with optional image upload
router.put('/:id', upload.single('image'), (req, res) => {
    const { name, category, status, serial_number, purchase_date } = req.body;

    // If new image uploaded, use it; otherwise keep existing
    if (req.file) {
        const image_url = `/uploads/${req.file.filename}`;
        const sql = 'UPDATE assets SET name = ?, category = ?, status = ?, serial_number = ?, purchase_date = ?, image_url = ? WHERE id = ?';
        db.query(sql, [name, category, status, serial_number, purchase_date, image_url, req.params.id], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Asset updated successfully' });
        });
    } else {
        const sql = 'UPDATE assets SET name = ?, category = ?, status = ?, serial_number, purchase_date = ? WHERE id = ?';
        db.query(sql, [name, category, status, serial_number, purchase_date, req.params.id], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Asset updated successfully' });
        });
    }
});

// Delete asset
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM assets WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Asset deleted successfully' });
    });
});

// Check-out asset
router.post('/:id/checkout', (req, res) => {
    const { checked_out_to, notes, checkout_date, expected_checkin_date } = req.body;
    const assetId = req.params.id;

    // Update asset
    const updateAssetSql = 'UPDATE assets SET checked_out_to = ?, checked_out_at = NOW(), notes = ?, status = ?, checkout_date = ?, expected_checkin_date = ? WHERE id = ?';
    db.query(updateAssetSql, [checked_out_to, notes, 'Deployed', checkout_date || null, expected_checkin_date || null, assetId], (err) => {
        if (err) return res.status(500).json(err);

        // Add to history
        const historySql = 'INSERT INTO checkout_history (asset_id, checked_out_to, notes, checkout_date, expected_checkin_date) VALUES (?, ?, ?, ?, ?)';
        db.query(historySql, [assetId, checked_out_to, notes, checkout_date || null, expected_checkin_date || null], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Asset checked out successfully' });
        });
    });
});

// Check-in asset
router.post('/:id/checkin', (req, res) => {
    const assetId = req.params.id;

    // Get current checkout info
    const getAssetSql = 'SELECT checked_out_at FROM assets WHERE id = ?';
    db.query(getAssetSql, [assetId], (err, result) => {
        if (err) return res.status(500).json(err);

        // Update asset
        const updateAssetSql = 'UPDATE assets SET checked_out_to = NULL, checked_out_at = NULL, notes = NULL, status = ?, checkout_date = NULL, expected_checkin_date = NULL WHERE id = ?';
        db.query(updateAssetSql, ['Ready to Deploy', assetId], (err) => {
            if (err) return res.status(500).json(err);

            // Update history
            const updateHistorySql = 'UPDATE checkout_history SET checked_in_at = NOW() WHERE asset_id = ? AND checked_in_at IS NULL';
            db.query(updateHistorySql, [assetId], (err) => {
                if (err) return res.status(500).json(err);
                res.json({ message: 'Asset checked in successfully' });
            });
        });
    });
});

// Get checkout history for an asset
router.get('/:id/history', (req, res) => {
    const sql = 'SELECT * FROM checkout_history WHERE asset_id = ? ORDER BY checked_out_at DESC';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

module.exports = router;

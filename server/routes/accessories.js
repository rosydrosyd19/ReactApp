const express = require('express');
const router = express.Router();
const db = require('../db');
const upload = require('../middleware/upload');

// Get all accessories
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM accessories ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Get single accessory
router.get('/:id', (req, res) => {
    const sql = 'SELECT * FROM accessories WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: 'Accessory not found' });
        res.json(result[0]);
    });
});

// Create accessory
router.post('/', upload.single('image'), (req, res) => {
    const { name, category, manufacturer, model_number, total_quantity, purchase_date, cost, notes } = req.body;
    // Initial available_quantity equals total_quantity
    const available_quantity = total_quantity;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = 'INSERT INTO accessories (name, category, manufacturer, model_number, total_quantity, available_quantity, purchase_date, cost, notes, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, category, manufacturer, model_number, total_quantity, available_quantity, purchase_date, cost, notes, image_url], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: result.insertId, ...req.body, available_quantity, image_url });
    });
});

// Update accessory
router.put('/:id', upload.single('image'), (req, res) => {
    const { name, category, manufacturer, model_number, total_quantity, purchase_date, cost, notes } = req.body;

    // We need to handle quantity changes carefully. 
    // For simplicity, if total_quantity changes, we adjust available_quantity by the difference.
    // First, get current total_quantity
    const getSql = 'SELECT total_quantity, available_quantity FROM accessories WHERE id = ?';
    db.query(getSql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: 'Accessory not found' });

        const currentTotal = result[0].total_quantity;
        const currentAvailable = result[0].available_quantity;
        const quantityDiff = total_quantity - currentTotal;
        const newAvailable = currentAvailable + quantityDiff;

        if (newAvailable < 0) {
            return res.status(400).json({ message: 'Cannot reduce total quantity below currently assigned amount' });
        }

        if (req.file) {
            const image_url = `/uploads/${req.file.filename}`;
            const sql = 'UPDATE accessories SET name = ?, category = ?, manufacturer = ?, model_number = ?, total_quantity = ?, available_quantity = ?, purchase_date = ?, cost = ?, notes = ?, image_url = ? WHERE id = ?';
            db.query(sql, [name, category, manufacturer, model_number, total_quantity, newAvailable, purchase_date, cost, notes, image_url, req.params.id], (err, result) => {
                if (err) return res.status(500).json(err);
                res.json({ message: 'Accessory updated successfully' });
            });
        } else {
            const sql = 'UPDATE accessories SET name = ?, category = ?, manufacturer = ?, model_number = ?, total_quantity = ?, available_quantity = ?, purchase_date = ?, cost = ?, notes = ? WHERE id = ?';
            db.query(sql, [name, category, manufacturer, model_number, total_quantity, newAvailable, purchase_date, cost, notes, req.params.id], (err, result) => {
                if (err) return res.status(500).json(err);
                res.json({ message: 'Accessory updated successfully' });
            });
        }
    });
});

// Delete accessory
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM accessories WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Accessory deleted successfully' });
    });
});

// Check Out Accessory
router.post('/:id/checkout', (req, res) => {
    const { assigned_to, assigned_type, quantity, notes } = req.body;
    const accessoryId = req.params.id;
    const checkoutQty = parseInt(quantity) || 1;

    // Check available quantity
    const checkSql = 'SELECT available_quantity FROM accessories WHERE id = ?';
    db.query(checkSql, [accessoryId], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: 'Accessory not found' });

        if (result[0].available_quantity < checkoutQty) {
            return res.status(400).json({ message: 'Not enough quantity available' });
        }

        // Start transaction (simulated with callbacks)
        const updateSql = 'UPDATE accessories SET available_quantity = available_quantity - ? WHERE id = ?';
        db.query(updateSql, [checkoutQty, accessoryId], (err) => {
            if (err) return res.status(500).json(err);

            const assignSql = 'INSERT INTO accessory_assignments (accessory_id, assigned_to, assigned_type, quantity, notes) VALUES (?, ?, ?, ?, ?)';
            db.query(assignSql, [accessoryId, assigned_to, assigned_type, checkoutQty, notes], (err) => {
                if (err) {
                    // Rollback quantity update (best effort)
                    db.query('UPDATE accessories SET available_quantity = available_quantity + ? WHERE id = ?', [checkoutQty, accessoryId]);
                    return res.status(500).json(err);
                }
                res.json({ message: 'Accessory checked out successfully' });
            });
        });
    });
});

// Check In Accessory
router.post('/:id/checkin/:assignmentId', (req, res) => {
    const { assignmentId } = req.params;
    const accessoryId = req.params.id;

    // Get assignment details to know quantity
    const getAssignSql = 'SELECT quantity FROM accessory_assignments WHERE id = ? AND accessory_id = ? AND returned_at IS NULL';
    db.query(getAssignSql, [assignmentId, accessoryId], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: 'Active assignment not found' });

        const returnQty = result[0].quantity;

        const updateAssignSql = 'UPDATE accessory_assignments SET returned_at = NOW() WHERE id = ?';
        db.query(updateAssignSql, [assignmentId], (err) => {
            if (err) return res.status(500).json(err);

            const updateAccessorySql = 'UPDATE accessories SET available_quantity = available_quantity + ? WHERE id = ?';
            db.query(updateAccessorySql, [returnQty, accessoryId], (err) => {
                if (err) return res.status(500).json(err);
                res.json({ message: 'Accessory returned successfully' });
            });
        });
    });
});

// Get accessory assignments
router.get('/:id/assignments', (req, res) => {
    const sql = 'SELECT * FROM accessory_assignments WHERE accessory_id = ? ORDER BY assigned_at DESC';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

module.exports = router;

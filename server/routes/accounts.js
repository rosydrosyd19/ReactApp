const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all accounts
router.get('/', (req, res) => {
    const query = 'SELECT * FROM asset_accounts ORDER BY created_at DESC';
    db.query(query, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

// GET account by ID with assignments
router.get('/:id', (req, res) => {
    const accountQuery = 'SELECT * FROM asset_accounts WHERE id = ?';
    const assignmentsQuery = `
        SELECT aa.*, 
               CASE 
                   WHEN aa.assigned_type = 'asset' THEN a.name
                   WHEN aa.assigned_type = 'license' THEN l.software_name
               END as assigned_name
        FROM asset_account_assignments aa
        LEFT JOIN assets a ON aa.assigned_to = a.name AND aa.assigned_type = 'asset'
        LEFT JOIN licenses l ON aa.assigned_to = l.id AND aa.assigned_type = 'license'
        WHERE aa.account_id = ?
        ORDER BY aa.assigned_at DESC
    `;

    db.query(accountQuery, [req.params.id], (err, accountData) => {
        if (err) return res.status(500).json(err);
        if (accountData.length === 0) return res.status(404).json({ message: 'Account not found' });

        db.query(assignmentsQuery, [req.params.id], (err, assignmentsData) => {
            if (err) return res.status(500).json(err);
            res.json({
                ...accountData[0],
                assignments: assignmentsData
            });
        });
    });
});

// POST create new account
router.post('/', (req, res) => {
    const { account_type, account_name, username, password, notes } = req.body;

    const query = `
        INSERT INTO asset_accounts 
        (account_type, account_name, username, password, notes) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [account_type, account_name, username, password, notes],
        (err, data) => {
            if (err) return res.status(500).json(err);
            res.json({ id: data.insertId, message: 'Account created successfully' });
        }
    );
});

// PUT update account
router.put('/:id', (req, res) => {
    const { account_type, account_name, username, password, notes } = req.body;

    const query = `
        UPDATE asset_accounts 
        SET account_type = ?, account_name = ?, username = ?, password = ?, notes = ?
        WHERE id = ?
    `;

    db.query(
        query,
        [account_type, account_name, username, password, notes, req.params.id],
        (err, data) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Account updated successfully' });
        }
    );
});

// DELETE account
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM asset_accounts WHERE id = ?', [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Account deleted successfully' });
    });
});

// POST checkout account to asset or license
router.post('/:id/checkout', (req, res) => {
    const { assigned_to, assigned_type, notes } = req.body;
    const accountId = req.params.id;

    // Validate assigned_type
    if (!['asset', 'license'].includes(assigned_type)) {
        return res.status(400).json({ message: 'Invalid assigned_type. Must be "asset" or "license"' });
    }

    // Create assignment
    const assignQuery = 'INSERT INTO asset_account_assignments (account_id, assigned_to, assigned_type, notes) VALUES (?, ?, ?, ?)';
    db.query(assignQuery, [accountId, assigned_to, assigned_type, notes], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Account checked out successfully' });
    });
});

// POST checkin account
router.post('/:id/checkin', (req, res) => {
    const { assignment_id } = req.body;

    // Delete assignment
    db.query('DELETE FROM asset_account_assignments WHERE id = ?', [assignment_id], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Account checked in successfully' });
    });
});

module.exports = router;

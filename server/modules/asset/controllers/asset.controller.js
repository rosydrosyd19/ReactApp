const db = require('../../shared/config/db');

// Get all assets
exports.getAllAssets = (req, res) => {
    const sql = 'SELECT * FROM asset_items ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

// Get single asset
exports.getAssetById = (req, res) => {
    const sql = 'SELECT * FROM asset_items WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: 'Asset not found' });
        res.json(result[0]);
    });
};

// Create asset
exports.createAsset = (req, res) => {
    console.log('Create Asset Request Body:', req.body);
    const { name, category, status, serial_number, purchase_date } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const formattedDate = (!purchase_date || purchase_date === 'null' || purchase_date === 'undefined' || purchase_date === '') ? null : purchase_date;

    const sql = 'INSERT INTO asset_items (name, category, status, serial_number, purchase_date, image_url) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, category, status, serial_number, formattedDate, image_url], (err, result) => {
        if (err) {
            console.error('Database Error in createAsset:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(201).json({ id: result.insertId, ...req.body, purchase_date: formattedDate, image_url });
    });
};

// Update asset
exports.updateAsset = (req, res) => {
    console.log('Update Asset Request Body:', req.body);
    console.log('Update Asset File:', req.file);

    const { name, category, status, serial_number, purchase_date } = req.body;
    const formattedDate = (!purchase_date || purchase_date === 'null' || purchase_date === 'undefined' || purchase_date === '') ? null : purchase_date;

    if (req.file) {
        const image_url = `/uploads/${req.file.filename}`;
        const sql = 'UPDATE asset_items SET name = ?, category = ?, status = ?, serial_number = ?, purchase_date = ?, image_url = ? WHERE id = ?';
        db.query(sql, [name, category, status, serial_number, formattedDate, image_url, req.params.id], (err, result) => {
            if (err) {
                console.error('Database Error in updateAsset (with file):', err);
                return res.status(500).json({ message: 'Database error', error: err });
            }
            res.json({ message: 'Asset updated successfully' });
        });
    } else {
        const sql = 'UPDATE asset_items SET name = ?, category = ?, status = ?, serial_number = ?, purchase_date = ? WHERE id = ?';
        db.query(sql, [name, category, status, serial_number, formattedDate, req.params.id], (err, result) => {
            if (err) {
                console.error('Database Error in updateAsset (no file):', err);
                return res.status(500).json({ message: 'Database error', error: err });
            }
            res.json({ message: 'Asset updated successfully' });
        });
    }
};

// Delete asset
exports.deleteAsset = (req, res) => {
    const sql = 'DELETE FROM asset_items WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Asset deleted successfully' });
    });
};

// Checkout asset
exports.checkoutAsset = (req, res) => {
    const { checked_out_to, notes, checkout_date, expected_checkin_date } = req.body;
    const assetId = req.params.id;

    const updateAssetSql = 'UPDATE asset_items SET checked_out_to = ?, checked_out_at = NOW(), notes = ?, status = ?, checkout_date = ?, expected_checkin_date = ? WHERE id = ?';
    db.query(updateAssetSql, [checked_out_to, notes, 'Deployed', checkout_date || null, expected_checkin_date || null, assetId], (err) => {
        if (err) return res.status(500).json(err);

        const historySql = 'INSERT INTO asset_checkout_history (asset_id, checked_out_to, notes, checkout_date, expected_checkin_date) VALUES (?, ?, ?, ?, ?)';
        db.query(historySql, [assetId, checked_out_to, notes, checkout_date || null, expected_checkin_date || null], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Asset checked out successfully' });
        });
    });
};

// Checkin asset
exports.checkinAsset = (req, res) => {
    const assetId = req.params.id;

    const getAssetSql = 'SELECT checked_out_at FROM asset_items WHERE id = ?';
    db.query(getAssetSql, [assetId], (err, result) => {
        if (err) return res.status(500).json(err);

        const updateAssetSql = 'UPDATE asset_items SET checked_out_to = NULL, checked_out_at = NULL, notes = NULL, status = ?, checkout_date = NULL, expected_checkin_date = NULL WHERE id = ?';
        db.query(updateAssetSql, ['Ready to Deploy', assetId], (err) => {
            if (err) return res.status(500).json(err);

            const updateHistorySql = 'UPDATE asset_checkout_history SET checked_in_at = NOW() WHERE asset_id = ? AND checked_in_at IS NULL';
            db.query(updateHistorySql, [assetId], (err) => {
                if (err) return res.status(500).json(err);
                res.json({ message: 'Asset checked in successfully' });
            });
        });
    });
};

// Get checkout history
exports.getCheckoutHistory = (req, res) => {
    const sql = 'SELECT * FROM asset_checkout_history WHERE asset_id = ? ORDER BY checked_out_at DESC';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

// Get licenses assigned to asset
exports.getAssetLicenses = (req, res) => {
    const assetId = req.params.id;

    const getAssetSql = 'SELECT name FROM asset_items WHERE id = ?';
    db.query(getAssetSql, [assetId], (err, assetResult) => {
        if (err) return res.status(500).json(err);
        if (assetResult.length === 0) return res.status(404).json({ message: 'Asset not found' });

        const assetName = assetResult[0].name;

        const sql = `
            SELECT la.*, l.software_name, l.product_key, l.expiration_date
            FROM asset_license_assignments la
            JOIN asset_licenses l ON la.license_id = l.id
            WHERE la.assigned_to = ? AND la.assigned_type = 'asset' AND la.returned_at IS NULL
            ORDER BY la.assigned_at DESC
        `;

        db.query(sql, [assetName], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
    });
};

// Get accessories assigned to asset
exports.getAssetAccessories = (req, res) => {
    const assetId = req.params.id;

    const getAssetSql = 'SELECT name FROM asset_items WHERE id = ?';
    db.query(getAssetSql, [assetId], (err, assetResult) => {
        if (err) return res.status(500).json(err);
        if (assetResult.length === 0) return res.status(404).json({ message: 'Asset not found' });

        const assetName = assetResult[0].name;

        const sql = `
            SELECT aa.*, a.name as accessory_name, a.category, a.model_number
            FROM asset_accessory_assignments aa
            JOIN asset_accessories a ON aa.accessory_id = a.id
            WHERE aa.assigned_to = ? AND aa.assigned_type = 'asset' AND aa.returned_at IS NULL
            ORDER BY aa.assigned_at DESC
        `;

        db.query(sql, [assetName], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
    });
};

// Get components assigned to asset
exports.getAssetComponents = (req, res) => {
    const assetId = req.params.id;

    const getAssetSql = 'SELECT name FROM asset_items WHERE id = ?';
    db.query(getAssetSql, [assetId], (err, assetResult) => {
        if (err) return res.status(500).json(err);
        if (assetResult.length === 0) return res.status(404).json({ message: 'Asset not found' });

        const assetName = assetResult[0].name;

        const sql = `
            SELECT ca.*, c.name as component_name, c.category, c.model_number
            FROM asset_component_assignments ca
            JOIN asset_components c ON ca.component_id = c.id
            WHERE ca.assigned_to = ?
            ORDER BY ca.assigned_at DESC
        `;

        db.query(sql, [assetName], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
    });
};

// Get accounts assigned to asset
exports.getAssetAccounts = (req, res) => {
    const assetId = req.params.id;

    const getAssetSql = 'SELECT name FROM asset_items WHERE id = ?';
    db.query(getAssetSql, [assetId], (err, assetResult) => {
        if (err) return res.status(500).json(err);
        if (assetResult.length === 0) return res.status(404).json({ message: 'Asset not found' });

        const assetName = assetResult[0].name;

        const sql = `
            SELECT aa.*, a.account_type, a.account_name, a.username
            FROM asset_account_assignments aa
            JOIN asset_accounts a ON aa.account_id = a.id
            WHERE aa.assigned_to = ? AND aa.assigned_type = 'asset'
            ORDER BY aa.assigned_at DESC
        `;

        db.query(sql, [assetName], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
    });
};

// --- Maintenance Methods ---

// Add maintenance record
exports.addMaintenance = (req, res) => {
    const assetId = req.params.id;
    const { maintenance_type, title, description, start_date, completion_date, cost, status, performed_by } = req.body;

    const formattedStartDate = start_date === '' ? null : start_date;
    const formattedCompletionDate = completion_date === '' ? null : completion_date;

    const sql = `
        INSERT INTO asset_maintenances 
        (asset_id, maintenance_type, title, description, start_date, completion_date, cost, status, performed_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [assetId, maintenance_type, title, description, formattedStartDate, formattedCompletionDate, cost, status, performed_by], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: result.insertId, message: 'Maintenance record added successfully' });
    });
};

// Get maintenance history for an asset
exports.getMaintenanceHistory = (req, res) => {
    const assetId = req.params.id;
    const sql = 'SELECT * FROM asset_maintenances WHERE asset_id = ? ORDER BY start_date DESC';

    db.query(sql, [assetId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

// Update maintenance record
exports.updateMaintenance = (req, res) => {
    const maintenanceId = req.params.maintenanceId;
    const { maintenance_type, title, description, start_date, completion_date, cost, status, performed_by } = req.body;

    const formattedStartDate = start_date === '' ? null : start_date;
    const formattedCompletionDate = completion_date === '' ? null : completion_date;

    const sql = `
        UPDATE asset_maintenances 
        SET maintenance_type = ?, title = ?, description = ?, start_date = ?, completion_date = ?, cost = ?, status = ?, performed_by = ?
        WHERE id = ?
    `;

    db.query(sql, [maintenance_type, title, description, formattedStartDate, formattedCompletionDate, cost, status, performed_by, maintenanceId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Maintenance record updated successfully' });
    });
};

// Delete maintenance record
exports.deleteMaintenance = (req, res) => {
    const maintenanceId = req.params.maintenanceId;
    const sql = 'DELETE FROM asset_maintenances WHERE id = ?';

    db.query(sql, [maintenanceId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Maintenance record deleted successfully' });
    });
};

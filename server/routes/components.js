const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/components';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// GET all components
router.get('/', (req, res) => {
    const query = 'SELECT * FROM components ORDER BY created_at DESC';
    db.query(query, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

// GET component by ID with assignments
router.get('/:id', (req, res) => {
    const componentQuery = 'SELECT * FROM components WHERE id = ?';
    const assignmentsQuery = `
        SELECT ca.*, a.name as asset_name, a.serial_number
        FROM component_assignments ca
        LEFT JOIN assets a ON ca.assigned_to = a.name
        WHERE ca.component_id = ?
        ORDER BY ca.assigned_at DESC
    `;

    db.query(componentQuery, [req.params.id], (err, componentData) => {
        if (err) return res.status(500).json(err);
        if (componentData.length === 0) return res.status(404).json({ message: 'Component not found' });

        db.query(assignmentsQuery, [req.params.id], (err, assignmentsData) => {
            if (err) return res.status(500).json(err);
            res.json({
                ...componentData[0],
                assignments: assignmentsData
            });
        });
    });
});

// POST create new component
router.post('/', upload.single('image'), (req, res) => {
    const { name, category, model_number, total_quantity, min_quantity, notes } = req.body;
    const image_url = req.file ? `/uploads/components/${req.file.filename}` : null;
    const available_quantity = total_quantity || 0;

    const query = `
        INSERT INTO components 
        (name, category, model_number, total_quantity, available_quantity, min_quantity, notes, image_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [name, category, model_number, total_quantity, available_quantity, min_quantity, notes, image_url],
        (err, data) => {
            if (err) return res.status(500).json(err);
            res.json({ id: data.insertId, message: 'Component created successfully' });
        }
    );
});

// PUT update component
router.put('/:id', upload.single('image'), (req, res) => {
    const { name, category, model_number, total_quantity, min_quantity, notes } = req.body;

    // Get current component to check if image needs updating
    db.query('SELECT image_url FROM components WHERE id = ?', [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);

        let image_url = data[0]?.image_url;
        if (req.file) {
            // Delete old image if exists
            if (image_url) {
                const oldImagePath = path.join(__dirname, '..', image_url);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            image_url = `/uploads/components/${req.file.filename}`;
        }

        const query = `
            UPDATE components 
            SET name = ?, category = ?, model_number = ?, total_quantity = ?, 
                min_quantity = ?, notes = ?, image_url = ?
            WHERE id = ?
        `;

        db.query(
            query,
            [name, category, model_number, total_quantity, min_quantity, notes, image_url, req.params.id],
            (err, data) => {
                if (err) return res.status(500).json(err);
                res.json({ message: 'Component updated successfully' });
            }
        );
    });
});

// DELETE component
router.delete('/:id', (req, res) => {
    // Get image URL before deleting
    db.query('SELECT image_url FROM components WHERE id = ?', [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);

        const image_url = data[0]?.image_url;

        db.query('DELETE FROM components WHERE id = ?', [req.params.id], (err, data) => {
            if (err) return res.status(500).json(err);

            // Delete image file if exists
            if (image_url) {
                const imagePath = path.join(__dirname, '..', image_url);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            res.json({ message: 'Component deleted successfully' });
        });
    });
});

// POST checkout component to asset
router.post('/:id/checkout', (req, res) => {
    const { assigned_to, quantity, notes } = req.body;
    const componentId = req.params.id;

    // Check available quantity
    db.query('SELECT available_quantity FROM components WHERE id = ?', [componentId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ message: 'Component not found' });

        const availableQty = data[0].available_quantity;
        if (availableQty < quantity) {
            return res.status(400).json({ message: 'Insufficient quantity available' });
        }

        // Create assignment
        const assignQuery = 'INSERT INTO component_assignments (component_id, assigned_to, quantity, notes) VALUES (?, ?, ?, ?)';
        db.query(assignQuery, [componentId, assigned_to, quantity, notes], (err, data) => {
            if (err) return res.status(500).json(err);

            // Update available quantity
            const updateQuery = 'UPDATE components SET available_quantity = available_quantity - ? WHERE id = ?';
            db.query(updateQuery, [quantity, componentId], (err, data) => {
                if (err) return res.status(500).json(err);
                res.json({ message: 'Component checked out successfully' });
            });
        });
    });
});

// POST checkin component
router.post('/:id/checkin', (req, res) => {
    const { assignment_id } = req.body;

    // Get assignment details
    db.query('SELECT * FROM component_assignments WHERE id = ?', [assignment_id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ message: 'Assignment not found' });

        const assignment = data[0];

        // Delete assignment
        db.query('DELETE FROM component_assignments WHERE id = ?', [assignment_id], (err, data) => {
            if (err) return res.status(500).json(err);

            // Update available quantity
            const updateQuery = 'UPDATE components SET available_quantity = available_quantity + ? WHERE id = ?';
            db.query(updateQuery, [assignment.quantity, assignment.component_id], (err, data) => {
                if (err) return res.status(500).json(err);
                res.json({ message: 'Component checked in successfully' });
            });
        });
    });
});

module.exports = router;

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Routes
const assetsRouter = require('./routes/assets');
const locationsRouter = require('./routes/locations');
const usersRouter = require('./routes/users');
const licensesRouter = require('./routes/licenses');
const accessoriesRouter = require('./routes/accessories');
const componentsRouter = require('./routes/components');
const accountsRouter = require('./routes/accounts');

app.use('/api/assets', assetsRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/users', usersRouter);
app.use('/api/licenses', licensesRouter);
app.use('/api/accessories', accessoriesRouter);
app.use('/api/components', componentsRouter);
app.use('/api/accounts', accountsRouter);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sysadmin', require('./routes/sysadmin'));

app.get('/api/dashboard', (req, res) => {
    const queries = {
        total: 'SELECT COUNT(*) as count FROM asset_items',
        ready: 'SELECT COUNT(*) as count FROM asset_items WHERE status = "Ready to Deploy"',
        deployed: 'SELECT COUNT(*) as count FROM asset_items WHERE status = "Deployed"',
        maintenance: 'SELECT COUNT(*) as count FROM asset_maintenances WHERE status = "In Progress"',
        licenses: 'SELECT COUNT(*) as count FROM asset_licenses',
        recent_maintenance: `
            SELECT m.*, a.name as asset_name 
            FROM asset_maintenances m 
            JOIN asset_items a ON m.asset_id = a.id 
            ORDER BY m.start_date DESC 
            LIMIT 5
        `
    };

    const promises = [
        new Promise((resolve, reject) => db.query(queries.total, (err, data) => err ? reject(err) : resolve({ key: 'total', value: data[0].count }))),
        new Promise((resolve, reject) => db.query(queries.ready, (err, data) => err ? reject(err) : resolve({ key: 'ready', value: data[0].count }))),
        new Promise((resolve, reject) => db.query(queries.deployed, (err, data) => err ? reject(err) : resolve({ key: 'deployed', value: data[0].count }))),
        new Promise((resolve, reject) => db.query(queries.maintenance, (err, data) => err ? reject(err) : resolve({ key: 'maintenance', value: data[0].count }))),
        new Promise((resolve, reject) => db.query(queries.licenses, (err, data) => err ? reject(err) : resolve({ key: 'licenses', value: data[0].count }))),
        new Promise((resolve, reject) => db.query(queries.recent_maintenance, (err, data) => err ? reject(err) : resolve({ key: 'recent_maintenance', value: data })))
    ];

    Promise.all(promises)
        .then(results => {
            const response = results.reduce((acc, curr) => {
                acc[curr.key] = curr.value;
                return acc;
            }, {});
            res.json(response);
        })
        .catch(err => {
            console.error('Dashboard API Error:', err);
            res.status(500).json(err);
        });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

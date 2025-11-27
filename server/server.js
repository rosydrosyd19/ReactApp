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

app.get('/api/dashboard', (req, res) => {
    const queries = {
        total: 'SELECT COUNT(*) as count FROM assets',
        ready: 'SELECT COUNT(*) as count FROM assets WHERE status = "Ready to Deploy"',
        deployed: 'SELECT COUNT(*) as count FROM assets WHERE status = "Deployed"'
    };

    const results = {};

    // Simple way to execute multiple queries sequentially for this example
    db.query(queries.total, (err, data) => {
        if (err) return res.status(500).json(err);
        results.total = data[0].count;

        db.query(queries.ready, (err, data) => {
            if (err) return res.status(500).json(err);
            results.ready = data[0].count;

            db.query(queries.deployed, (err, data) => {
                if (err) return res.status(500).json(err);
                results.deployed = data[0].count;
                res.json(results);
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

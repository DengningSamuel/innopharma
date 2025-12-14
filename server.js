
const path = require('path');
const express = require('express');
const app = express();


app.use(express.json());

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, 'public')));


// Database connection
const db = require('./config/database');

// Routers
const usersRouter = require('./routes/users');
const medecinesRouter = require('./routes/medecines');
const pharmaciesRouter = require('./routes/pharmacies');
const inventoryRouter = require('./routes/inventory');
const searchRouter = require('./routes/search');


app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// API Endpoints
app.use('/users', usersRouter);
app.use('/medecines', medecinesRouter);
app.use('/pharmacies', pharmaciesRouter);
app.use('/inventory', inventoryRouter);
app.use('/search', searchRouter);

app.get('/api/test-db', async (req, res) => {
    try {
        const [result] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ 
            success: true, 
            database: 'connected',
            result: result[0].solution 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});


require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

// Security middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000',
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

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

// Serve index.html from root
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
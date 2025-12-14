const express = require('express');
const app = express();

app.use(express.json());

// Test if database connection works
const db = require('./config/database');

app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});

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
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all medicines
router.get('/', async (req, res) => {
    try {
        const [medicines] = await db.query('SELECT * FROM medicines ORDER BY name ASC');
        res.json({
            success: true,
            count: medicines.length,
            data: medicines
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// GET single medicine by ID
router.get('/:id', async (req, res) => {
    try {
        const [medicine] = await db.query(
            'SELECT * FROM medicines WHERE medicine_id = ?',
            [req.params.id]
        );
        
        if (medicine.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Medicine not found' 
            });
        }
        
        res.json({
            success: true,
            data: medicine[0]
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// POST - Add new medicine
router.post('/', async (req, res) => {
    try {
        const { name, generic_name, description, manufacturer } = req.body;
        
        if (!name) {
            return res.status(400).json({ 
                success: false, 
                error: 'Medicine name is required' 
            });
        }
        
        const [result] = await db.query(
            'INSERT INTO medicines (name, generic_name, description, manufacturer) VALUES (?, ?, ?, ?)',
            [name, generic_name, description, manufacturer]
        );
        
        res.status(201).json({ 
            success: true,
            message: 'Medicine added successfully',
            medicine_id: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// GET - Search medicines by name
router.get('/search/name', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({ 
                success: false, 
                error: 'Search query is required' 
            });
        }
        
        const [medicines] = await db.query(
            'SELECT * FROM medicines WHERE name LIKE ? OR generic_name LIKE ?',
            [`%${q}%`, `%${q}%`]
        );
        
        res.json({
            success: true,
            count: medicines.length,
            data: medicines
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

module.exports = router;
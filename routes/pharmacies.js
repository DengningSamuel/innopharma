const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all pharmacies
router.get('/', async (req, res) => {
    try {
        const [pharmacies] = await db.query('SELECT * FROM pharmacies ORDER BY created_at DESC');
        res.json({
            success: true,
            count: pharmacies.length,
            data: pharmacies
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// GET single pharmacy by ID
router.get('/:id', async (req, res) => {
    try {
        const [pharmacy] = await db.query(
            'SELECT * FROM pharmacies WHERE pharmacy_id = ?',
            [req.params.id]
        );
        
        if (pharmacy.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Pharmacy not found' 
            });
        }
        
        res.json({
            success: true,
            data: pharmacy[0]
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// POST - Create new pharmacy
router.post('/', async (req, res) => {
    try {
        const { name, address, phone, email, registration_number } = req.body;
        
        if (!name || !address || !registration_number) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide name, address, and registration number' 
            });
        }
        
        const [result] = await db.query(
            'INSERT INTO pharmacies (name, address, phone, email, registration_number) VALUES (?, ?, ?, ?, ?)',
            [name, address, phone, email, registration_number]
        );
        
        res.status(201).json({ 
            success: true,
            message: 'Pharmacy registered successfully',
            pharmacy_id: result.insertId 
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                success: false, 
                error: 'Registration number already exists' 
            });
        }
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// PUT - Update pharmacy
router.put('/:id', async (req, res) => {
    try {
        const { name, address, phone, email, is_verified } = req.body;
        const pharmacy_id = req.params.id;
        
        const [result] = await db.query(
            'UPDATE pharmacies SET name = ?, address = ?, phone = ?, email = ?, is_verified = ? WHERE pharmacy_id = ?',
            [name, address, phone, email, is_verified, pharmacy_id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Pharmacy not found' 
            });
        }
        
        res.json({ 
            success: true,
            message: 'Pharmacy updated successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// DELETE pharmacy
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM pharmacies WHERE pharmacy_id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Pharmacy not found' 
            });
        }
        
        res.json({ 
            success: true,
            message: 'Pharmacy deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

module.exports = router;
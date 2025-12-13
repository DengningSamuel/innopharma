const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all inventory items
router.get('/', async (req, res) => {
    try {
        const [inventory] = await db.query(`
            SELECT 
                pi.inventory_id,
                p.name AS pharmacy_name,
                m.name AS medicine_name,
                pi.quantity,
                pi.price,
                pi.last_updated
            FROM pharmacy_inventory pi
            JOIN pharmacies p ON pi.pharmacy_id = p.pharmacy_id
            JOIN medicines m ON pi.medicine_id = m.medicine_id
            ORDER BY pi.last_updated DESC
        `);
        
        res.json({
            success: true,
            count: inventory.length,
            data: inventory
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// GET inventory for specific pharmacy
router.get('/pharmacy/:pharmacy_id', async (req, res) => {
    try {
        const [inventory] = await db.query(`
            SELECT 
                pi.inventory_id,
                m.medicine_id,
                m.name AS medicine_name,
                m.generic_name,
                pi.quantity,
                pi.price,
                pi.last_updated
            FROM pharmacy_inventory pi
            JOIN medicines m ON pi.medicine_id = m.medicine_id
            WHERE pi.pharmacy_id = ?
            ORDER BY m.name ASC
        `, [req.params.pharmacy_id]);
        
        res.json({
            success: true,
            count: inventory.length,
            data: inventory
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// POST - Add medicine to pharmacy inventory
router.post('/', async (req, res) => {
    try {
        const { pharmacy_id, medicine_id, quantity, price } = req.body;
        
        if (!pharmacy_id || !medicine_id || !quantity || !price) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide pharmacy_id, medicine_id, quantity, and price' 
            });
        }
        
        const [result] = await db.query(
            'INSERT INTO pharmacy_inventory (pharmacy_id, medicine_id, quantity, price) VALUES (?, ?, ?, ?)',
            [pharmacy_id, medicine_id, quantity, price]
        );
        
        res.status(201).json({ 
            success: true,
            message: 'Medicine added to inventory successfully',
            inventory_id: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// PUT - Update inventory item
router.put('/:id', async (req, res) => {
    try {
        const { quantity, price } = req.body;
        const inventory_id = req.params.id;
        
        const [result] = await db.query(
            'UPDATE pharmacy_inventory SET quantity = ?, price = ? WHERE inventory_id = ?',
            [quantity, price, inventory_id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Inventory item not found' 
            });
        }
        
        res.json({ 
            success: true,
            message: 'Inventory updated successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Search pharmacies that have a specific medicine
router.get('/medicine', async (req, res) => {
    try {
        const { name, location } = req.query;
        
        if (!name) {
            return res.status(400).json({ 
                success: false, 
                error: 'Medicine name is required' 
            });
        }
        
        let query = `
            SELECT 
                p.pharmacy_id,
                p.name AS pharmacy_name,
                p.address,
                p.phone,
                p.email,
                m.medicine_id,
                m.name AS medicine_name,
                m.generic_name,
                pi.quantity,
                pi.price,
                pi.last_updated
            FROM pharmacies p
            JOIN pharmacy_inventory pi ON p.pharmacy_id = pi.pharmacy_id
            JOIN medicines m ON pi.medicine_id = m.medicine_id
            WHERE p.is_verified = 1
            AND m.name LIKE ?
            AND pi.quantity > 0
        `;
        
        const params = [`%${name}%`];
        
        if (location) {
            query += ` AND p.address LIKE ?`;
            params.push(`%${location}%`);
        }
        
        query += ` ORDER BY p.name ASC`;
        
        const [results] = await db.query(query, params);
        
        res.json({
            success: true,
            count: results.length,
            medicine: name,
            location: location || 'All locations',
            data: results
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Get available pharmacies
router.get('/available', async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT 
                p.pharmacy_id,
                p.name,
                p.address,
                p.phone,
                p.email,
                COUNT(DISTINCT pi.medicine_id) AS medicines_count
            FROM pharmacies p
            LEFT JOIN pharmacy_inventory pi ON p.pharmacy_id = pi.pharmacy_id AND pi.quantity > 0
            WHERE p.is_verified = 1
            GROUP BY p.pharmacy_id
            ORDER BY p.name ASC
        `);
        
        res.json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

module.exports = router;
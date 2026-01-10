const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

// Input validation helper
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password && password.length >= 8;
}

// POST - Register new user with profile JSON
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, full_name, phone, address, profile, role } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Username, email, and password are required' 
            });
        }
        
        if (!validateEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid email format' 
            });
        }
        
        if (!validatePassword(password)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Password must be at least 8 characters long' 
            });
        }
        
        // Check if user already exists
        const [existingUsers] = await db.query(
            'SELECT user_id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );
        
        if (existingUsers.length > 0) {
            return res.status(409).json({ 
                success: false, 
                error: 'Username or email already exists' 
            });
        }
        
        const password_hash = await bcrypt.hash(password, 12);
        const profileData = profile ? JSON.stringify(profile) : JSON.stringify({});
        const userRole = role === 'admin' ? 'admin' : 'user'; // Prevent role escalation
        
        const [result] = await db.query(
            'INSERT INTO users (username, email, password_hash, full_name, phone, address, profile, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [username, email, password_hash, full_name, phone, address, profileData, userRole]
        );
        
        res.status(201).json({ 
            success: true,
            message: 'User registered successfully',
            user_id: result.insertId 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// POST - User login (JWT)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Username and password are required' 
            });
        }
        
        const [users] = await db.query(
            'SELECT user_id, username, email, password_hash, role, is_verified FROM users WHERE username = ? OR email = ?',
            [username, username]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid credentials' 
            });
        }
        
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid credentials' 
            });
        }
        
        // JWT payload: user id and role
        const token = jwt.sign(
            { user_id: user.user_id, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '2h' }
        );
        
        // Remove sensitive data
        delete user.password_hash;
        
        res.json({ 
            success: true,
            message: 'Login successful',
            token,
            user: user
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// Middleware: Authenticate JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Middleware: Role-based authorization
function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ success: false, error: 'Forbidden: insufficient privileges' });
        }
        next();
    };
}

// GET user count (public endpoint for dashboard)
router.get('/count', async (req, res) => {
    try {
        const [result] = await db.query('SELECT COUNT(*) as count FROM users');
        res.json({
            success: true,
            count: result[0].count
        });
    } catch (error) {
        console.error('Get user count error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// GET all users (admin only)
router.get('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT user_id, username, email, full_name, phone, is_verified, created_at, role FROM users'
        );
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// GET current user's profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT user_id, username, email, full_name, phone, address, profile, role, created_at FROM users WHERE user_id = ?', 
            [req.user.user_id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        
        const user = users[0];
        user.profile = user.profile ? JSON.parse(user.profile) : {};
        
        res.json({ success: true, user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// PATCH update current user's profile (partial update)
router.patch('/profile', authenticateToken, async (req, res) => {
    try {
        const profileUpdates = req.body;
        
        // Remove sensitive fields that shouldn't be updated via profile
        delete profileUpdates.user_id;
        delete profileUpdates.password_hash;
        delete profileUpdates.role;
        
        const [users] = await db.query(
            'SELECT profile FROM users WHERE user_id = ?', 
            [req.user.user_id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        
        const currentProfile = users[0].profile ? JSON.parse(users[0].profile) : {};
        const newProfile = { ...currentProfile, ...profileUpdates };
        
        await db.query(
            'UPDATE users SET profile = ? WHERE user_id = ?', 
            [JSON.stringify(newProfile), req.user.user_id]
        );
        
        res.json({ success: true, message: 'Profile updated', profile: newProfile });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
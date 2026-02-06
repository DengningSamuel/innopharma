const request = require('supertest');
const express = require('express');

// Create a simple test app
const app = express();
app.use(express.json());

// Mock routes for testing
app.post('/test/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'All fields are required' 
    });
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid email format' 
    });
  }
  
  // Password validation
  if (password.length < 8) {
    return res.status(400).json({ 
      success: false, 
      error: 'Password must be at least 8 characters long' 
    });
  }
  
  res.status(201).json({ 
    success: true, 
    message: 'User registered successfully' 
  });
});

app.post('/test/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Username and password are required' 
    });
  }
  
  res.json({ 
    success: true, 
    message: 'Login successful' 
  });
});

describe('API Endpoint Tests', () => {
  
  describe('POST /test/register', () => {
    test('should accept valid registration data', async () => {
      const response = await request(app)
        .post('/test/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
    });

    test('should reject registration with missing fields', async () => {
      const response = await request(app)
        .post('/test/register')
        .send({
          username: 'testuser'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('All fields are required');
    });

    test('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/test/register')
        .send({
          username: 'testuser',
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid email format');
    });

    test('should reject short password', async () => {
      const response = await request(app)
        .post('/test/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: '123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Password must be at least 8 characters long');
    });
  });

  describe('POST /test/login', () => {
    test('should accept valid login credentials', async () => {
      const response = await request(app)
        .post('/test/login')
        .send({
          username: 'testuser',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
    });

    test('should reject login with missing credentials', async () => {
      const response = await request(app)
        .post('/test/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Username and password are required');
    });
  });
});

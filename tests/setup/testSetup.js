// Load test environment variables
require('dotenv').config({ path: './test.env' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key';

// Global test timeout
jest.setTimeout(10000);

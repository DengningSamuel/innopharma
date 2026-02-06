// Mock database for testing
const mockDb = {
  query: jest.fn(),
  execute: jest.fn(),
  end: jest.fn()
};

// Default mock responses
mockDb.query.mockImplementation((sql, params) => {
  // Mock user registration
  if (sql.includes('INSERT INTO users')) {
    return Promise.resolve([{ insertId: 1 }]);
  }
  
  // Mock user count
  if (sql.includes('COUNT(*) as count FROM users')) {
    return Promise.resolve([[{ count: 5 }]]);
  }
  
  // Mock user exists check
  if (sql.includes('SELECT user_id FROM users WHERE username')) {
    return Promise.resolve([[]]);
  }
  
  // Mock login check
  if (sql.includes('SELECT user_id, username, email, password_hash')) {
    return Promise.resolve([[]]);
  }
  
  // Default empty response
  return Promise.resolve([[]]);
});

module.exports = mockDb;
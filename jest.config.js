module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup/testSetup.js'],
  
  // Coverage settings
  collectCoverage: false,
  
  // Timeout
  testTimeout: 10000,
  
  // Mock modules
  moduleNameMapper: {
    '^../config/database$': '<rootDir>/tests/setup/mockDatabase.js'
  }
};
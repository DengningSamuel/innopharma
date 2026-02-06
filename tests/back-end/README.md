# Backend Tests for Innopharma

## Test Files

1. **validation.test.js** - Tests input validation functions
   - Email validation
   - Password validation

2. **api.test.js** - Tests API endpoints
   - User registration validation
   - Login validation
   - Error handling

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run with coverage:
```bash
npm run test:coverage
```

Run only backend tests:
```bash
npm run test:backend
```

## Test Results

These tests verify:
- Input validation works correctly
- API endpoints return proper status codes
- Error messages are correct
- Request/response handling is proper

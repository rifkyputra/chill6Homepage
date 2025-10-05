# Auth Testing with MSW

This project uses [Mock Service Worker (MSW)](https://mswjs.io/) to test authentication functionality. The setup includes comprehensive tests for the auth service, client, and various authentication scenarios.

## Files Overview

### Test Configuration Files

- **`test/setup.ts`** - Global test setup with MSW server initialization
- **`test/msw.config.ts`** - MSW request handlers for auth endpoints
- **`test/auth.test.ts`** - Comprehensive auth tests with MSW
- **`test/auth-simple.test.ts`** - Simplified auth tests with direct mocking
- **`bunfig.test.toml`** - Bun test configuration

### Test Setup

The test environment is configured to:

1. **Mock Browser Environment**: Provides `document.cookie` and `window` objects for browser-like testing
2. **Mock HTTP Requests**: Uses MSW to intercept and mock auth API calls
3. **Handle Cookies**: Simulates cookie-based session management
4. **Test Auth Service**: Validates all authentication methods

## Running Tests

```bash
# Run all tests
bun test

# Run auth tests specifically
bun test auth

# Run tests in watch mode
bun test:watch
```

## Test Categories

### 1. AuthService Tests (`auth-simple.test.ts`)

Tests the high-level AuthService methods with mocked auth client responses:

- ✅ **Health Check**: Validates server connectivity
- ✅ **Sign Up Success**: Tests successful user registration
- ✅ **Sign Up Failure**: Tests handling of existing email conflicts
- ⚠️ **Sign In Success**: Tests successful authentication (partial)
- ⚠️ **Sign In Failure**: Tests invalid credential handling (partial)
- ⚠️ **Session Management**: Tests session retrieval and validation (partial)
- ⚠️ **Sign Out**: Tests session termination (partial)

### 2. Comprehensive Integration Tests (`auth.test.ts`)

Full integration tests using MSW to mock the entire auth API:

- **AuthService Integration**: Tests all service methods with HTTP mocking
- **Auth Client Direct Usage**: Tests better-auth client directly
- **Error Handling**: Tests various error scenarios
- **Session Management**: Tests session lifecycle
- **User Data Validation**: Tests data integrity and validation

## Test Architecture

### MSW Configuration (`msw.config.ts`)

The MSW setup provides handlers for:

```typescript
- POST */api/auth/sign-up/email - User registration
- POST */api/auth/sign-in/email - User authentication  
- GET  */api/auth/session - Session retrieval
- GET  */api/auth/get-session - Alternative session endpoint
- POST */api/auth/sign-out - Session termination
- GET  */api/auth - Health check
```

### Mock Data Management

```typescript
// Reset mock data before each test
resetMockData({
  users: [testUser, anotherUser],
  sessions: [],
});
```

### Cookie Simulation

```typescript
// Mock document.cookie for browser-like testing
Object.defineProperty(globalThis.document, 'cookie', {
  get() { return mockCookies; },
  set(value) { /* handle cookie setting */ }
});
```

## Current Status

### ✅ Working Features

1. **Test Infrastructure**: MSW setup, mock configuration, test runners
2. **Basic Mocking**: Successfully mocks auth client responses
3. **Cookie Handling**: Simulates browser cookie behavior
4. **Error Testing**: Validates error handling scenarios
5. **Health Checks**: Tests server connectivity

### ⚠️ Partial/In Progress

1. **better-auth Integration**: Some endpoints require better-auth specific response formats
2. **Session Management**: Session endpoints need better-auth compatible mocking
3. **Auth Client Direct Testing**: Direct client tests need more precise mocking

### 🔧 Areas for Improvement

1. **Response Format Matching**: MSW responses should match better-auth's exact format
2. **Endpoint Path Accuracy**: Some auth endpoints may use different paths
3. **Error Code Consistency**: Error responses should match better-auth error codes
4. **Session Token Handling**: Better simulation of better-auth's token management

## Testing Patterns

### 1. Simple Service Testing

```typescript
test("should handle sign up success", async () => {
  // Mock auth client directly
  const mockAuthClient = {
    signUp: { email: async () => ({ data: mockUser, error: null }) }
  };
  
  // Replace client temporarily
  (authClient as any).signUp = mockAuthClient.signUp;
  
  const result = await AuthService.signUp(signUpData);
  expect(result.success).toBe(true);
});
```

### 2. HTTP Integration Testing

```typescript
test("should mock auth endpoints", async () => {
  server.use(
    http.post('*/api/auth/sign-in/email', () => {
      return HttpResponse.json({ data: mockResponse });
    })
  );
  
  const result = await AuthService.signIn(credentials);
  expect(result.user.email).toBe(testEmail);
});
```

### 3. Error Scenario Testing

```typescript
test("should handle auth errors", async () => {
  server.use(
    http.post('*/api/auth/sign-up/email', () => {
      return HttpResponse.json(
        { error: { message: 'User already exists' } },
        { status: 400 }
      );
    })
  );
  
  await expect(AuthService.signUp(existingUser))
    .rejects.toThrow('User already exists');
});
```

## Next Steps

1. **Refine MSW Handlers**: Update response formats to match better-auth exactly
2. **Complete Integration Tests**: Fix remaining test failures in comprehensive suite
3. **Add React Query Tests**: Test auth queries and mutations with React Query
4. **Performance Testing**: Add tests for auth performance and caching
5. **Security Testing**: Validate session security and token handling

## Dependencies

```json
{
  "msw": "^2.11.3",
  "@tanstack/react-query": "^5.90.2",
  "better-auth": "^1.3.24"
}
```

## Useful Commands

```bash
# Type check tests
bun run check-types

# Run specific test file
bun test auth-simple.test.ts

# Debug test output
bun test --verbose

# Run tests with coverage (if configured)
bun test --coverage
```
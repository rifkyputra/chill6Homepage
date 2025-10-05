// Test setup file for MSW and browser environment mocking
import { setupServer } from "msw/node";
import { authHandlers } from "./msw.config";

// Setup MSW server
export const server = setupServer(...authHandlers);

// Mock browser environment
global.document = {
  cookie: "",
} as any;

// Mock window object for auth client
global.window = {
  location: {
    origin: "http://localhost:3001",
    href: "http://localhost:3001",
  },
} as any;

// Start server before all tests
server.listen({
  onUnhandledRequest: "warn",
});

// Setup environment variable for auth client
process.env.VITE_AUTH_SERVER_URL = "http://localhost:3000/api/auth";

export {};

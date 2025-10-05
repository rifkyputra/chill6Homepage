import { beforeEach, afterAll, describe, expect, test } from "bun:test";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { AuthService } from "../src/lib/auth-service";
import type { SignInData, SignUpData, User } from "../src/lib/auth-types";

// Create a simple server just for AuthService methods
const testServer = setupServer();

// Mock environment and document
process.env.VITE_AUTH_SERVER_URL = "http://localhost:3000/api/auth";

let mockCookies = "";
globalThis.document = {
  cookie: {
    get() {
      return mockCookies;
    },
    set(value: string) {
      mockCookies = value.includes("Max-Age=0") ? "" : value.split(";")[0];
    },
  },
} as any;

// Mock fetch to handle cookies
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const headers = new Headers(init?.headers);
  if (mockCookies) {
    headers.set("cookie", mockCookies);
  }

  const response = await originalFetch(input, { ...init, headers });
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    globalThis.document.cookie = setCookie;
  }

  return response;
};

describe("Auth Service Tests", () => {
  // Mock data
  const testUsers = [
    {
      id: "user-1",
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      image: "https://example.com/avatar.jpg",
      emailVerified: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ];

  beforeEach(() => {
    mockCookies = "";
    globalThis.document.cookie = "";
    testServer.resetHandlers();
  });

  afterAll(() => {
    testServer.close();
    globalThis.fetch = originalFetch;
  });

  test("should check server health", async () => {
    testServer.use(
      http.get("http://localhost:3000/api/auth/", () => {
        return HttpResponse.text("Auth server is running");
      })
    );

    const health = await AuthService.checkHealth();
    expect(health).toBe("Auth server is running");
  });

  test("should handle sign up success via AuthService", async () => {
    const signUpData: SignUpData = {
      name: "New User",
      email: "newuser@example.com",
      password: "password123",
      image: "https://example.com/avatar.jpg",
    };

    // Mock better-auth client response for successful signup
    const mockAuthClient = {
      signUp: {
        email: async () => ({
          data: {
            user: {
              id: "user-new",
              email: signUpData.email,
              name: signUpData.name,
              image: signUpData.image,
              emailVerified: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          error: null,
        }),
      },
    };

    // Temporarily replace the auth client
    const { authClient } = await import("../src/lib/auth-client");
    const originalSignUp = authClient.signUp;
    (authClient as any).signUp = mockAuthClient.signUp;

    try {
      const result = await AuthService.signUp(signUpData);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Sign up successful");
      expect(result.user.email).toBe(signUpData.email);
      expect(result.user.name).toBe(signUpData.name);
      expect(result.user.image).toBe(signUpData.image);
    } finally {
      (authClient as any).signUp = originalSignUp;
    }
  });

  test("should handle sign up failure with existing email", async () => {
    const signUpData: SignUpData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    // Mock better-auth client response for signup failure
    const mockAuthClient = {
      signUp: {
        email: async () => ({
          data: null,
          error: {
            message: "User already exists",
          },
        }),
      },
    };

    const { authClient } = await import("../src/lib/auth-client");
    const originalSignUp = authClient.signUp;
    (authClient as any).signUp = mockAuthClient.signUp;

    try {
      await expect(AuthService.signUp(signUpData)).rejects.toThrow(
        "User already exists"
      );
    } finally {
      (authClient as any).signUp = originalSignUp;
    }
  });

  test("should handle sign in success via AuthService", async () => {
    const signInData: SignInData = {
      email: "test@example.com",
      password: "password123",
    };

    // Mock better-auth client response for successful signin
    const mockAuthClient = {
      signIn: {
        email: async () => ({
          data: {
            user: {
              id: "user-1",
              email: signInData.email,
              name: "Test User",
              image: "https://example.com/avatar.jpg",
              emailVerified: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          error: null,
        }),
      },
    };

    const { authClient } = await import("../src/lib/auth-client");
    const originalSignIn = authClient.signIn;
    (authClient as any).signIn = mockAuthClient.signIn;

    try {
      const result = await AuthService.signIn(signInData);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Sign in successful");
      expect(result.user.email).toBe(signInData.email);
      expect(result.user.name).toBe("Test User");
    } finally {
      (authClient as any).signIn = originalSignIn;
    }
  });

  test("should handle sign in failure with invalid credentials", async () => {
    const signInData: SignInData = {
      email: "test@example.com",
      password: "wrongpassword",
    };

    // Mock better-auth client response for signin failure
    const mockAuthClient = {
      signIn: {
        email: async () => ({
          data: null,
          error: {
            message: "Invalid credentials",
          },
        }),
      },
    };

    const { authClient } = await import("../src/lib/auth-client");
    const originalSignIn = authClient.signIn;
    (authClient as any).signIn = mockAuthClient.signIn;

    try {
      await expect(AuthService.signIn(signInData)).rejects.toThrow(
        "Invalid credentials"
      );
    } finally {
      (authClient as any).signIn = originalSignIn;
    }
  });

  test("should get session when authenticated", async () => {
    // Mock better-auth client response for session
    const mockAuthClient = {
      getSession: async () => ({
        data: {
          user: {
            id: "user-1",
            email: "test@example.com",
            name: "Test User",
            image: "https://example.com/avatar.jpg",
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          session: {
            id: "session-1",
            userId: "user-1",
            token: "token-123",
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            createdAt: new Date(),
          },
        },
        error: null,
      }),
    };

    const { authClient } = await import("../src/lib/auth-client");
    const originalGetSession = authClient.getSession;
    (authClient as any).getSession = mockAuthClient.getSession;

    try {
      const result = await AuthService.getSession();

      expect(result.user).not.toBeNull();
      expect(result.session).not.toBeNull();
      expect(result.user?.email).toBe("test@example.com");
      expect(result.user?.name).toBe("Test User");
    } finally {
      (authClient as any).getSession = originalGetSession;
    }
  });

  test("should return null session when not authenticated", async () => {
    // Mock better-auth client response for no session
    const mockAuthClient = {
      getSession: async () => ({
        data: null,
        error: {
          message: "No session found",
        },
      }),
    };

    const { authClient } = await import("../src/lib/auth-client");
    const originalGetSession = authClient.getSession;
    (authClient as any).getSession = mockAuthClient.getSession;

    try {
      const result = await AuthService.getSession();

      expect(result.user).toBeNull();
      expect(result.session).toBeNull();
    } finally {
      (authClient as any).getSession = originalGetSession;
    }
  });

  test("should sign out successfully", async () => {
    // Mock better-auth client response for signout
    const mockAuthClient = {
      signOut: async () => ({
        data: { success: true },
        error: null,
      }),
    };

    const { authClient } = await import("../src/lib/auth-client");
    const originalSignOut = authClient.signOut;
    (authClient as any).signOut = mockAuthClient.signOut;

    try {
      const result = await AuthService.signOut();

      expect(result.success).toBe(true);
      expect(result.message).toBe("Sign out successful");
    } finally {
      (authClient as any).signOut = originalSignOut;
    }
  });
});

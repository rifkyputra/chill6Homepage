import { http, HttpResponse } from "msw";
import type {
  SignInData,
  SignUpData,
  User,
  Session,
} from "../src/lib/auth-types";

// In-memory storage for testing
let mockUsers: Array<User & { password: string }> = [];
let mockSessions: Array<Session> = [];

export interface MockAuthData {
  users?: Array<User & { password: string }>;
  sessions?: Array<Session>;
}

export function resetMockData(data: MockAuthData = {}) {
  mockUsers = data.users || [];
  mockSessions = data.sessions || [];
}

export const authHandlers = [
  // Health check endpoint
  http.get("*/api/auth", () => {
    return HttpResponse.text("Auth server is running");
  }),

  // Sign up endpoint (better-auth pattern)
  http.post("*/api/auth/sign-up/email", async ({ request }) => {
    try {
      const body = (await request.json()) as SignUpData;
      const { email, password, name, image } = body;

      // Check if user already exists
      if (mockUsers.find((u) => u.email === email)) {
        return HttpResponse.json(
          { error: { message: "User already exists" } },
          { status: 400 }
        );
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        image: image || null,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsers.push({ ...newUser, password });

      return HttpResponse.json({
        data: { user: newUser },
      });
    } catch (error) {
      return HttpResponse.json(
        { error: { message: "Invalid request body" } },
        { status: 400 }
      );
    }
  }),

  // Sign in endpoint (better-auth pattern)
  http.post("*/api/auth/sign-in/email", async ({ request }) => {
    try {
      const body = (await request.json()) as SignInData;
      const { email, password, rememberMe } = body;

      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );
      if (!user) {
        return HttpResponse.json(
          { error: { message: "Invalid credentials" } },
          { status: 401 }
        );
      }

      // Create session
      const session: Session = {
        id: `session-${Date.now()}`,
        userId: user.id,
        token: `token-${Date.now()}`,
        expiresAt: new Date(
          Date.now() +
            (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
        ),
        createdAt: new Date(),
        ipAddress: "127.0.0.1",
        userAgent: "test-agent",
      };

      mockSessions.push(session);

      const { password: _, ...userWithoutPassword } = user;

      return HttpResponse.json(
        {
          data: {
            user: userWithoutPassword,
            token: session.token,
            redirect: false,
            url: undefined,
          },
        },
        {
          headers: {
            "Set-Cookie": `session=${
              session.token
            }; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${
              rememberMe ? 2592000 : 86400
            }`,
          },
        }
      );
    } catch (error) {
      return HttpResponse.json(
        { error: { message: "Invalid request body" } },
        { status: 400 }
      );
    }
  }),

  // Get session endpoint (better-auth uses this pattern)
  http.get("*/api/auth/session", ({ request }) => {
    const cookieHeader = request.headers.get("cookie");
    let sessionToken = null;

    if (cookieHeader) {
      const cookies = cookieHeader.split(";").map((c) => c.trim());
      const sessionCookie = cookies.find((c) => c.startsWith("session="));
      if (sessionCookie) {
        sessionToken = sessionCookie.split("=")[1];
      }
    }

    if (!sessionToken) {
      return HttpResponse.json(
        { error: { message: "No session found" } },
        { status: 401 }
      );
    }

    const session = mockSessions.find((s) => s.token === sessionToken);
    if (!session || session.expiresAt < new Date()) {
      return HttpResponse.json(
        { error: { message: "Session expired" } },
        { status: 401 }
      );
    }

    const user = mockUsers.find((u) => u.id === session.userId);
    if (!user) {
      return HttpResponse.json(
        { error: { message: "User not found" } },
        { status: 404 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;

    return HttpResponse.json({
      data: {
        user: userWithoutPassword,
        session,
      },
    });
  }),

  // Get session endpoint with different path (fallback)
  http.get("*/api/auth/get-session", ({ request }) => {
    const cookieHeader = request.headers.get("cookie");
    let sessionToken = null;

    if (cookieHeader) {
      const cookies = cookieHeader.split(";").map((c) => c.trim());
      const sessionCookie = cookies.find((c) => c.startsWith("session="));
      if (sessionCookie) {
        sessionToken = sessionCookie.split("=")[1];
      }
    }

    if (!sessionToken) {
      return HttpResponse.json(
        { error: { message: "No session found" } },
        { status: 401 }
      );
    }

    const session = mockSessions.find((s) => s.token === sessionToken);
    if (!session || session.expiresAt < new Date()) {
      return HttpResponse.json(
        { error: { message: "Session expired" } },
        { status: 401 }
      );
    }

    const user = mockUsers.find((u) => u.id === session.userId);
    if (!user) {
      return HttpResponse.json(
        { error: { message: "User not found" } },
        { status: 404 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;

    return HttpResponse.json({
      data: {
        user: userWithoutPassword,
        session,
      },
    });
  }),

  // Sign out endpoint
  http.post("*/api/auth/sign-out", ({ request }) => {
    const cookieHeader = request.headers.get("cookie");
    let sessionToken = null;

    if (cookieHeader) {
      const cookies = cookieHeader.split(";").map((c) => c.trim());
      const sessionCookie = cookies.find((c) => c.startsWith("session="));
      if (sessionCookie) {
        sessionToken = sessionCookie.split("=")[1];
      }
    }

    if (sessionToken) {
      // Remove session from mock storage
      const sessionIndex = mockSessions.findIndex(
        (s) => s.token === sessionToken
      );
      if (sessionIndex > -1) {
        mockSessions.splice(sessionIndex, 1);
      }
    }

    return HttpResponse.json(
      { data: { success: true } },
      {
        headers: {
          "Set-Cookie":
            "session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0",
        },
      }
    );
  }),
];

// Export current state for testing
export function getMockUsers() {
  return [...mockUsers];
}

export function getMockSessions() {
  return [...mockSessions];
}

import type {
  SignInData,
  SignUpData,
  HttpOnlyAuthResponse,
  HttpOnlySessionResponse,
  AuthError,
} from "./auth-types";

// Get the auth server URL from environment variables
const getAuthServerUrl = () => {
  // Check for environment variable first
  const envUrl = import.meta.env.VITE_AUTH_SERVER_URL;

  if (envUrl) {
    // Ensure the URL has a protocol
    return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
  }

  // No fallback - require environment variable to be set
  throw new Error("VITE_AUTH_SERVER_URL environment variable is required");
};

export class AuthService {
  private static baseUrl = getAuthServerUrl();

  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const hasBody = options.body !== undefined && options.body !== null;

    const config: RequestInit = {
      credentials: "include", // Essential for HttpOnly cookies
      headers: {
        ...(hasBody && { "Content-Type": "application/json" }),
        // Ensure CORS headers for cross-origin requests
        Origin: window.location.origin,
        ...options.headers,
      },
      ...options,
    };

    console.log(`Making request to: ${url}`); // Debug log

    try {
      const response = await fetch(url, config);

      // Check if response is ok first
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        // Try to parse error response if it has content
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          }
        } catch {
          // If we can't parse the error response, use the default message
        }

        console.error("API Error:", {
          status: response.status,
          message: errorMessage,
        });
        throw new Error(errorMessage);
      }

      // Only try to parse JSON if response is ok
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Request failed:", error); // Debug log
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async signUp(data: SignUpData): Promise<HttpOnlyAuthResponse> {
    const response = await this.makeRequest<HttpOnlyAuthResponse>(
      "/api/auth/sign-up/email",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    return response;
  }

  static async signIn(data: SignInData): Promise<HttpOnlyAuthResponse> {
    console.log("Signing in with HttpOnly cookies..."); // Debug log
    const response = await this.makeRequest<HttpOnlyAuthResponse>(
      "/api/auth/sign-in/email",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    console.log("Sign-in response:", response); // Debug log
    console.log("Cookies after sign-in:", document.cookie); // Debug log

    return response;
  }

  static async signOut(): Promise<{ success: boolean; message: string }> {
    const response = await this.makeRequest<{
      success: boolean;
      message: string;
    }>("/api/auth/sign-out", {
      method: "POST",
    });

    return response;
  }

  static async getSession(): Promise<HttpOnlySessionResponse> {
    console.log("Getting session with HttpOnly cookies..."); // Debug log
    console.log("Current cookies:", document.cookie); // Debug log

    try {
      const response = await this.makeRequest<HttpOnlySessionResponse>(
        "/api/auth/get-session"
      );
      console.log("Session response:", response); // Debug log
      return response;
    } catch (error) {
      console.error("Session request failed:", error);
      // Return null session if the request fails (user not authenticated)
      return { user: null, session: null };
    }
  }

  static async checkHealth(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/`, {
      credentials: "include",
    });
    return response.text();
  }

  // Debug method to test session endpoint directly
  static async testSession(): Promise<any> {
    try {
      console.log("Testing session endpoint directly...");
      console.log("Current cookies:", document.cookie);

      const response = await fetch(`${this.baseUrl}/api/auth/get-session`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Session response status:", response.status);
      console.log(
        "Session response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        console.error(
          "Session request failed:",
          response.status,
          response.statusText
        );
        return null;
      }

      const data = await response.json();
      console.log("Session data:", data);
      return data;
    } catch (error) {
      console.error("Session test failed:", error);
      return null;
    }
  }
}

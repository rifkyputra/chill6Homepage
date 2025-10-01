import type {
  SignInData,
  SignUpData,
  AuthResponse,
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

  return "http://localhost:3000";
};

export class AuthService {
  private static baseUrl = getAuthServerUrl();

  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    console.log(`Making request to: ${url}`); // Debug log

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data); // Debug log
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("Request failed:", error); // Debug log
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async signUp(data: SignUpData): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>("/api/auth/sign-up/email", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async signIn(data: SignInData): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>("/api/auth/sign-in/email", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async signOut(): Promise<{ success: boolean; message: string }> {
    return this.makeRequest("/api/auth/sign-out", {
      method: "POST",
    });
  }

  static async getSession(): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>("/api/auth/session");
  }

  static async checkHealth(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/`, {
      credentials: "include",
    });
    return response.text();
  }
}

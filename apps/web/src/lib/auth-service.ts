import { authClient } from "./auth-client";
import type {
  SignInData,
  SignUpData,
  HttpOnlyAuthResponse,
  HttpOnlySessionResponse,
  AuthError,
} from "./auth-types";

export class AuthService {
  static async signUp(data: SignUpData): Promise<HttpOnlyAuthResponse> {
    try {
      console.log("Signing up with better-auth client..."); // Debug log
      const response = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        image: data.image,
      });

      if (response.error) {
        throw new Error(response.error.message || "Sign up failed");
      }

      // Return in the expected format
      return {
        user: {
          ...response.data?.user!,
          image: response.data?.user?.image ?? null,
        },
        success: true,
        message: "Sign up successful",
      };
    } catch (error) {
      console.error("Sign-up failed:", error);
      throw error;
    }
  }

  static async signIn(data: SignInData): Promise<HttpOnlyAuthResponse> {
    try {
      console.log("Signing in with better-auth client..."); // Debug log
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (response.error) {
        throw new Error(response.error.message || "Sign in failed");
      }

      console.log("Sign-in response:", response); // Debug log
      console.log("Cookies after sign-in:", document.cookie); // Debug log

      return {
        user: {
          ...response.data?.user!,
          image: response.data?.user?.image ?? null,
        },
        success: true,
        message: "Sign in successful",
      };
    } catch (error) {
      console.error("Sign-in failed:", error);
      throw error;
    }
  }

  static async signOut(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await authClient.signOut();

      if (response.error) {
        throw new Error(response.error.message || "Sign out failed");
      }

      return {
        success: true,
        message: "Sign out successful",
      };
    } catch (error) {
      console.error("Sign-out failed:", error);
      throw error;
    }
  }

  static async getSession(): Promise<HttpOnlySessionResponse> {
    try {
      console.log("Getting session with better-auth client..."); // Debug log
      console.log("Current cookies:", document.cookie); // Debug log

      const response = await authClient.getSession({
        fetchOptions: { credentials: "include" },
      });
      console.log("Session response:", response); // Debug log

      if (response.error) {
        // Don't throw error for session requests, just return null
        console.log("No active session:", response.error);
        return { user: null, session: null };
      }

      return {
        user: response.data?.user
          ? {
              ...response.data.user,
              image: response.data.user.image ?? null,
            }
          : null,
        session: response.data?.session
          ? {
              ...response.data.session,
              expiresAt: response.data.session.expiresAt,
              ipAddress: response.data.session.ipAddress ?? undefined,
              userAgent: response.data.session.userAgent ?? undefined,
            }
          : null,
      };
    } catch (error) {
      console.error("Session request failed:", error);
      // Return null session if the request fails (user not authenticated)
      return { user: null, session: null };
    }
  }

  static async checkHealth(): Promise<string> {
    try {
      // Get the base URL from the authClient configuration
      const baseURL =
        (authClient as any).options?.baseURL ||
        (authClient as any).baseURL ||
        import.meta.env.VITE_AUTH_SERVER_URL;

      const response = await fetch(`${baseURL}/`, {
        credentials: "include",
      });
      return response.text();
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  }

  // Debug method to test session endpoint directly
  static async testSession(): Promise<any> {
    try {
      console.log("Testing session endpoint with better-auth client...");
      console.log("Current cookies:", document.cookie);

      const response = await authClient.getSession();
      console.log("Session test response:", response);
      return response;
    } catch (error) {
      console.error("Session test failed:", error);
      return null;
    }
  }
}

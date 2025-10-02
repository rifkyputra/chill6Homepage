import { createAuthClient } from "better-auth/client";

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

export const authClient = createAuthClient({
  baseURL: getAuthServerUrl(),
  credentials: "include", // Essential for HttpOnly cookies
});

// Export specific auth methods for convenience
export const { signIn, signUp, signOut, getSession, useSession } = authClient;

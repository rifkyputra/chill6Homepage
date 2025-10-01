import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import {
  useSession,
  useSignIn,
  useSignUp,
  useSignOut,
  useRefreshSession,
  useAuthState,
} from "../lib/auth-queries";
import type { User, Session, SignInData, SignUpData } from "../lib/auth-types";

interface AuthContextType {
  // State
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSessionInitialized: boolean;
  error: string | null;

  // Actions
  signIn: (data: SignInData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Use TanStack Query hooks for session management
  const sessionQuery = useSession();
  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();
  const signOutMutation = useSignOut();
  const refreshSessionMutation = useRefreshSession();

  // Get current auth state from query cache
  const authState = useAuthState();

  const signIn = async (data: SignInData) => {
    try {
      await signInMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      await signUpMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await signOutMutation.mutateAsync();
    } catch (error) {
      throw error;
    }
  };

  const refreshSession = async () => {
    try {
      await refreshSessionMutation.mutateAsync();
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    // State from TanStack Query
    user: authState.user,
    session: authState.session,
    isAuthenticated: authState.isAuthenticated,
    isLoading:
      sessionQuery.isFetching ||
      signInMutation.isPending ||
      signUpMutation.isPending ||
      signOutMutation.isPending,
    isSessionInitialized: sessionQuery.isFetched || sessionQuery.isError,
    error:
      sessionQuery.error?.message ||
      signInMutation.error?.message ||
      signUpMutation.error?.message ||
      signOutMutation.error?.message ||
      null,

    // Actions
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import { AuthService } from "../lib/auth-service";
import type {
  AuthState,
  User,
  Session,
  SignInData,
  SignUpData,
} from "../lib/auth-types";

interface AuthContextType extends AuthState {
  signIn: (data: SignInData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
  initializeSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: { user: User; session: Session } }
  | { type: "CLEAR_USER" }
  | { type: "SET_SESSION_INITIALIZED" }
  | { type: "SET_ERROR"; payload: string };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isAuthenticated: true,
        isLoading: false,
        isSessionInitialized: true,
      };
    case "CLEAR_USER":
      return {
        ...state,
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        isSessionInitialized: true,
      };
    case "SET_SESSION_INITIALIZED":
      return {
        ...state,
        isSessionInitialized: true,
        isLoading: false,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  isSessionInitialized: false,
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const signIn = async (data: SignInData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await AuthService.signIn(data);
      dispatch({
        type: "SET_USER",
        payload: { user: response.user, session: response.session },
      });
    } catch (error) {
      dispatch({ type: "CLEAR_USER" });
      throw error;
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await AuthService.signUp(data);
      dispatch({
        type: "SET_USER",
        payload: { user: response.user, session: response.session },
      });
    } catch (error) {
      dispatch({ type: "CLEAR_USER" });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await AuthService.signOut();
      dispatch({ type: "CLEAR_USER" });
    } catch (error) {
      // Even if the server request fails, clear the local state
      dispatch({ type: "CLEAR_USER" });
      throw error;
    }
  };

  const checkSession = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await AuthService.getSession();
      dispatch({
        type: "SET_USER",
        payload: { user: response.user, session: response.session },
      });
    } catch (error) {
      // If session check fails, user is not authenticated
      dispatch({ type: "CLEAR_USER" });
    }
  };

  const initializeSession = async () => {
    if (state.isSessionInitialized) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await AuthService.getSession();
      dispatch({
        type: "SET_USER",
        payload: { user: response.user, session: response.session },
      });
    } catch (error) {
      // If session check fails, user is not authenticated
      dispatch({ type: "SET_SESSION_INITIALIZED" });
    }
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    checkSession,
    initializeSession,
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

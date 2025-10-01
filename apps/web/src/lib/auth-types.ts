export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  session: Session;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  image?: string;
}

export interface SignInData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthError {
  error: string;
  message: string;
  details?: Record<string, any>;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSessionInitialized: boolean;
}

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

// Standard auth response with session data
export interface AuthResponse {
  user: User;
  session: Session;
}

// HttpOnly cookie-based auth response (no token in body)
export interface HttpOnlyAuthResponse {
  user: User;
  success: boolean;
  message?: string;
}

// Session response for HttpOnly cookies
export interface HttpOnlySessionResponse {
  user: User | null;
  session: Session | null;
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

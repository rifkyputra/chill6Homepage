import React from "react";
import { useAuth } from "./auth-provider";
import { AuthDialog } from "./auth-dialog";
import { Button } from "./ui/button";
import { LogIn, Shield } from "lucide-react";
import Loader from "./loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Shield className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Authentication Required</h2>
          <p className="text-muted-foreground text-center max-w-md">
            You need to be signed in to access this content. Please sign in or
            create an account to continue.
          </p>
          <AuthDialog>
            <Button>
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </AuthDialog>
        </div>
      )
    );
  }

  return <>{children}</>;
}

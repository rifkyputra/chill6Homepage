import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderService } from "@/lib/order-service";
import { useSession } from "@/lib/auth-queries";

export function OrderDebugComponent() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manualToken, setManualToken] = useState("");
  const { data: session } = useSession();

  const testHealthCheck = async () => {
    setIsLoading(true);
    try {
      const health = await OrderService.checkHealth();
      setDebugInfo({ type: "health", data: health, success: true });
    } catch (error) {
      setDebugInfo({
        type: "health",
        error: error instanceof Error ? error.message : String(error),
        success: false,
      });
    }
    setIsLoading(false);
  };

  const testGetOrders = async () => {
    setIsLoading(true);
    try {
      const orders = await OrderService.getOrders();
      setDebugInfo({ type: "orders", data: orders, success: true });
    } catch (error) {
      setDebugInfo({
        type: "orders",
        error: error instanceof Error ? error.message : String(error),
        success: false,
      });
    }
    setIsLoading(false);
  };

  const testValidateToken = async () => {
    setIsLoading(true);
    try {
      const validation = await OrderService.validateToken();
      setDebugInfo({ type: "validation", data: validation, success: true });
    } catch (error) {
      setDebugInfo({
        type: "validation",
        error: error instanceof Error ? error.message : String(error),
        success: false,
      });
    }
    setIsLoading(false);
  };

  const testDirectFetch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ORDER_SERVICE_URL}/orders`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.text();
      setDebugInfo({
        type: "direct",
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries()),
        success: response.ok,
      });
    } catch (error) {
      setDebugInfo({
        type: "direct",
        error: error instanceof Error ? error.message : String(error),
        success: false,
      });
    }
    setIsLoading(false);
  };

  const testCORSFromChill6 = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ORDER_SERVICE_URL}/orders`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Origin: "https://chill6.space",
          },
        }
      );

      const data = await response.text();
      setDebugInfo({
        type: "cors-chill6",
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries()),
        corsHeaders: {
          "Access-Control-Allow-Origin": response.headers.get(
            "Access-Control-Allow-Origin"
          ),
          "Access-Control-Allow-Credentials": response.headers.get(
            "Access-Control-Allow-Credentials"
          ),
          "Access-Control-Allow-Methods": response.headers.get(
            "Access-Control-Allow-Methods"
          ),
          "Access-Control-Allow-Headers": response.headers.get(
            "Access-Control-Allow-Headers"
          ),
        },
        success: response.ok,
      });
    } catch (error) {
      setDebugInfo({
        type: "cors-chill6",
        error: error instanceof Error ? error.message : String(error),
        success: false,
      });
    }
    setIsLoading(false);
  };

  const testCORSPreflight = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ORDER_SERVICE_URL}/orders`,
        {
          method: "OPTIONS",
          headers: {
            Origin: "https://chill6.space",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Content-Type",
          },
        }
      );

      const data = await response.text();
      setDebugInfo({
        type: "cors-preflight",
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries()),
        corsHeaders: {
          "Access-Control-Allow-Origin": response.headers.get(
            "Access-Control-Allow-Origin"
          ),
          "Access-Control-Allow-Credentials": response.headers.get(
            "Access-Control-Allow-Credentials"
          ),
          "Access-Control-Allow-Methods": response.headers.get(
            "Access-Control-Allow-Methods"
          ),
          "Access-Control-Allow-Headers": response.headers.get(
            "Access-Control-Allow-Headers"
          ),
          "Access-Control-Max-Age": response.headers.get(
            "Access-Control-Max-Age"
          ),
        },
        success: response.ok,
      });
    } catch (error) {
      setDebugInfo({
        type: "cors-preflight",
        error: error instanceof Error ? error.message : String(error),
        success: false,
      });
    }
    setIsLoading(false);
  };

  const testAuthDebug = async () => {
    setIsLoading(true);
    try {
      const authInfo = await OrderService.debugAuth();
      setDebugInfo({
        type: "auth-debug",
        data: authInfo,
        success: true,
      });
    } catch (error) {
      setDebugInfo({
        type: "auth-debug",
        error: error instanceof Error ? error.message : String(error),
        success: false,
      });
    }
    setIsLoading(false);
  };

  const testDirectAuthService = async () => {
    setIsLoading(true);
    try {
      // Import AuthService directly
      const { AuthService } = await import("@/lib/auth-service");
      const sessionData = await AuthService.getSession();

      setDebugInfo({
        type: "direct-auth-service",
        data: {
          sessionData,
          hasUser: !!sessionData.user,
          hasSession: !!sessionData.session,
          sessionToken: sessionData.session?.token
            ? `${sessionData.session.token.substring(0, 10)}...`
            : null,
        },
        success: true,
      });
    } catch (error) {
      setDebugInfo({
        type: "direct-auth-service",
        error: error instanceof Error ? error.message : String(error),
        success: false,
      });
    }
    setIsLoading(false);
  };

  const testWithManualToken = async () => {
    if (!manualToken.trim()) {
      setDebugInfo({
        type: "manual-token",
        error: "Please enter a token",
        success: false,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ORDER_SERVICE_URL}/orders`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Origin: "https://chill6.space",
            Authorization: `Bearer ${manualToken}`,
          },
        }
      );

      const data = await response.text();
      setDebugInfo({
        type: "manual-token",
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries()),
        tokenUsed: `${manualToken.substring(0, 10)}...`,
        success: response.ok,
      });
    } catch (error) {
      setDebugInfo({
        type: "manual-token",
        error: error instanceof Error ? error.message : String(error),
        success: false,
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Order API Debug Tool</CardTitle>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            Session:{" "}
            {session?.user
              ? `Logged in as ${session.user.email}`
              : "Not logged in"}
          </p>
          <p>
            Current Origin:{" "}
            {typeof window !== "undefined" ? window.location.origin : "Unknown"}
          </p>
          <p>
            Target API:
            {import.meta.env.VITE_ORDER_SERVICE_URL}
          </p>
          <p>CORS Origin: https://chill6.space</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={testHealthCheck} disabled={isLoading}>
            Test Health Check
          </Button>
          <Button onClick={testAuthDebug} disabled={isLoading}>
            Debug Auth Headers
          </Button>
          <Button onClick={testDirectAuthService} disabled={isLoading}>
            Test Auth Service Direct
          </Button>
          <Button onClick={testGetOrders} disabled={isLoading}>
            Test Get Orders
          </Button>
          <Button onClick={testValidateToken} disabled={isLoading}>
            Test Validate Token
          </Button>
          <Button onClick={testDirectFetch} disabled={isLoading}>
            Direct Fetch Test
          </Button>
          <Button onClick={testCORSFromChill6} disabled={isLoading}>
            Test CORS from chill6.space
          </Button>
          <Button onClick={testCORSPreflight} disabled={isLoading}>
            Test CORS Preflight
          </Button>
        </div>

        {/* Manual Token Testing */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Manual Token Test</h4>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="manual-token">Authorization Token</Label>
              <Input
                id="manual-token"
                type="password"
                placeholder="Enter Bearer token..."
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
              />
            </div>
            <Button
              onClick={testWithManualToken}
              disabled={isLoading || !manualToken.trim()}
              className="mt-6"
            >
              Test with Token
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            If you have a Bearer token, you can test it directly here
          </p>
        </div>

        {debugInfo && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">
              {debugInfo.type} Test Result -{" "}
              {debugInfo.success ? "✅ Success" : "❌ Error"}
            </h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderService } from "@/lib/order-service";
import { useSession } from "@/lib/auth-queries";

export function OrderDebugComponent() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
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
        "https://auth-multi-tenants-order-service.rifqempul.workers.dev/orders",
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

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Order API Debug Tool</CardTitle>
        <p className="text-sm text-muted-foreground">
          Session:{" "}
          {session?.user
            ? `Logged in as ${session.user.email}`
            : "Not logged in"}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={testHealthCheck} disabled={isLoading}>
            Test Health Check
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

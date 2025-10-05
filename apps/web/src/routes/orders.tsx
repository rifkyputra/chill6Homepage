import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/protected-route";
import { OrderDebugComponent } from "@/components/order-debug";

export const Route = createFileRoute("/orders")({
  component: () => (
    <ProtectedRoute>
      <OrdersComponent />
    </ProtectedRoute>
  ),
});

function OrdersComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Orders Debug Page</h1>
      <OrderDebugComponent />
    </div>
  );
}

export default OrdersComponent;

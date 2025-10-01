import { createFileRoute } from "@tanstack/react-router";
import { RunaToko } from "./toko";

export const Route = createFileRoute("/runa/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RunaToko />;
}

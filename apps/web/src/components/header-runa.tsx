import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown } from "lucide-react";
import CartDropdown from "./cart-dropdown";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { TenantSelector } from "./tenant-selector";

export default function HeaderRuna() {
  const navigate = useNavigate();
  const currentPath = useRouterState({
    select: (s) => s.location.pathname,
  });

  // Check if we're in a /tenantName/sub/ route
  const isInSubRoute = currentPath.includes("/sub/");

  // Extract tenant name from path (e.g., /runa/sub/tnc -> runa)
  const tenantName = isInSubRoute ? currentPath.split("/")[1] : null;

  // Determine the back navigation target
  const getBackUrl = () => {
    if (isInSubRoute && tenantName) {
      return `/${tenantName}`;
    }
    return "/";
  };

  const links = [{ to: "/runa/toko", label: "Toko" }] as const;

  return (
    <div className="sticky top-0 z-50 border-gray-200 border-b bg-white/95 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95">
      <div className="container mx-auto px-4">
        <div className="flex flex-row items-center justify-between py-3">
          <div className="flex items-center gap-8">
            {/* Exit Button to navigate back to main site or tenant index */}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              onClick={() => navigate({ to: getBackUrl() })}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>
            <Link
              to="/runa"
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-transparent text-xl transition-colors hover:from-blue-700 hover:to-purple-700"
            >
              Runa Store
            </Link>
            <nav className="hidden gap-6 md:flex">
              {links.map(({ to, label }) => {
                return (
                  <Link
                    key={to}
                    to={to}
                    className="group relative font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  >
                    {label}
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full" />
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {/* Page Selector Dropdown */}
            <TenantSelector selected="Runa Store" />

            {/* Shopping Cart Dropdown */}
            <CartDropdown tenant="runa" />

            <ModeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="border-gray-200 border-t pt-3 pb-3 md:hidden dark:border-gray-700">
          <div className="flex justify-center gap-4">
            {links.slice(1).map(({ to, label }) => {
              return (
                <Link
                  key={to}
                  to={to}
                  className="font-medium text-gray-700 text-sm transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

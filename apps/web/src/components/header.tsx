import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import CartDropdown from "./cart-dropdown";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { TenantSelector } from "./tenant-selector";
import { UserMenu } from "./user-menu";
import { useAuth } from "./auth-provider";

export default function Header() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const isAuthRequiredRoute = currentPath.startsWith("/member");

  // Only use auth state on routes that require authentication
  const auth = isAuthRequiredRoute
    ? useAuth()
    : { isAuthenticated: false, isLoading: false };

  const links = [
    { to: "/", label: "Beranda" },
    { to: "/about", label: "Tentang" },
    { to: "/services", label: "Layanan" },
    { to: "/calendar", label: "Kalender" },
    { to: "/member", label: "Member" },
    { to: "/contact", label: "Kontak" },
  ] as const;

  const authLinks = [
    { to: "/sign-in", label: "Sign In" },
    { to: "/sign-up", label: "Sign Up" },
  ] as const;

  const navigator = useNavigate();

  return (
    <div className="sticky top-0 z-50 border-gray-200 border-b bg-white/95 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95">
      <div className="container mx-auto px-4">
        <div className="flex flex-row items-center justify-between py-3">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-transparent text-xl transition-colors hover:from-blue-700 hover:to-purple-700"
            >
              Chill6 Space
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
            <TenantSelector selected="Web utama" />

            {/* Auth Links - Only show when not on member pages */}
            {!isAuthRequiredRoute && (
              <div className="hidden md:flex items-center gap-2">
                {authLinks.map(({ to, label }) => (
                  <Button key={to} variant="ghost" size="sm" asChild>
                    <Link to={to}>{label}</Link>
                  </Button>
                ))}
              </div>
            )}

            {/* Shopping Cart Dropdown */}
            <CartDropdown tenant="main" />

            {/* Authentication - Only show user menu on auth-required routes */}
            {isAuthRequiredRoute && auth.isAuthenticated && <UserMenu />}

            <ModeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="border-gray-200 border-t pt-3 pb-3 md:hidden dark:border-gray-700">
          <div className="flex justify-center gap-4 mb-3">
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
          {/* Mobile Auth Links */}
          {!isAuthRequiredRoute && (
            <div className="flex justify-center gap-2">
              {authLinks.map(({ to, label }) => (
                <Button key={to} variant="outline" size="sm" asChild>
                  <Link to={to}>{label}</Link>
                </Button>
              ))}
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}

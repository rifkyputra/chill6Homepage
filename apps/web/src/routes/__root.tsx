import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Loader from "@/components/loader";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { useCartUrlNotification } from "@/lib/cart-notifications";
import "../index.css";
import HeaderRuna from "@/components/header-runa";

export type RouterAppContext = {};

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "chill6homepage",
      },
      {
        name: "description",
        content: "chill6homepage is a web application",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  const isFetching = useRouterState({
    select: (s) => s.isLoading,
  });

  // Initialize cart URL notification
  useCartUrlNotification();
  const currentPath = useRouterState({
    select: (s) => s.location.pathname,
  });
  const isRunaRoute = currentPath.startsWith("/runa");

  const HeaderComponent = isRunaRoute ? HeaderRuna : Header;

  return (
    <>
      <HeadContent />
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          storageKey="vite-ui-theme"
        >
          <div className="flex min-h-screen flex-col">
            <HeaderComponent />
            <main className="flex-1">
              {isFetching ? <Loader /> : <Outlet />}
            </main>
            <Footer />
          </div>
          <Toaster richColors />
        </ThemeProvider>
      </AuthProvider>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}

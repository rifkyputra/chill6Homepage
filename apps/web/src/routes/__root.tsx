import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Loader from "@/components/loader";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { useCartUrlNotification } from "@/lib/cart-notifications";
import "../index.css";
import HeaderRuna from "@/components/header-runa";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 401/403 errors
        if (
          error &&
          "status" in error &&
          (error.status === 401 || error.status === 403)
        ) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

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
      <QueryClientProvider client={queryClient}>
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
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}

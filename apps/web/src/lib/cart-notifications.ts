import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useCartShare, useCartStore } from "./cart-hooks";

// Global flag to track if cart was loaded from URL in this session
let cartLoadedFromURL = false;

/**
 * Set flag when cart is loaded from URL (called from cart store)
 */
export const setCartLoadedFromURL = (loaded: boolean) => {
  console.log("🔔 setCartLoadedFromURL:", { loaded });
  cartLoadedFromURL = loaded;
};

/**
 * Get current flag state (for debugging)
 */
export const getCartLoadedFromURL = (): boolean => {
  return cartLoadedFromURL;
};

/**
 * Reset flag for testing purposes
 */
export const resetCartLoadedFromURL = () => {
  cartLoadedFromURL = false;
  console.log("🔔 resetCartLoadedFromURL: Flag reset to false");
};

/**
 * Hook to show notification when cart is loaded from URL
 * Call this in your main app component or root layout
 */
export const useCartUrlNotification = () => {
  const cartState = useCartStore();
  const { generateShareURL } = useCartShare();
  const hasShownNotification = useRef(false);

  useEffect(() => {
    // Only show notification once per session and only if cart was actually loaded from URL
    if (
      typeof window !== "undefined" &&
      cartLoadedFromURL &&
      !hasShownNotification.current &&
      cartState.items.length > 0
    ) {
      console.log("🔔 useCartUrlNotification: Showing URL load notification", {
        cartLoadedFromURL,
        cartItemsCount: cartState.items.length,
        hasShownNotification: hasShownNotification.current,
      });

      // Show notification that cart was loaded from shared URL
      toast.success("Keranjang berhasil dimuat dari tautan!", {
        description: `${cartState.items.length} item telah ditambahkan ke keranjang.`,
        duration: 5000,
        action: {
          label: "Bagikan Lagi",
          onClick: async () => {
            try {
              const shareURL = generateShareURL();
              await navigator.clipboard.writeText(shareURL);
              toast.success("Link keranjang disalin!");
            } catch (_error) {
              toast.error("Gagal menyalin link");
            }
          },
        },
      });

      // Mark as shown to prevent showing again
      hasShownNotification.current = true;

      // Clean up URL parameter after showing notification
      const url = new URL(window.location.href);
      if (url.searchParams.has("cart")) {
        url.searchParams.delete("cart");
        window.history.replaceState(null, "", url.toString());
        console.log("🔔 useCartUrlNotification: Cleaned up cart URL parameter");
      }
    }
  }, [cartState.items.length, generateShareURL]); // React to cart changes

  // Expose debugging functions in development
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    (window as any).cartDebug = {
      getCartLoadedFromURL,
      resetCartLoadedFromURL,
      hasShownNotification: () => hasShownNotification.current,
      resetNotificationFlag: () => {
        hasShownNotification.current = false;
        console.log("🔔 Debug: Reset notification flag");
      },
    };
  }
};

/**
 * Hook for cart sharing notifications
 */
export const useCartShareNotification = () => {
  const showShareSuccess = () => {
    toast.success("Link keranjang berhasil disalin!", {
      description:
        "Sekarang kamu bisa membagikan keranjang ini kepada orang lain.",
      duration: 3000,
    });
  };

  const showShareError = () => {
    toast.error("Gagal menyalin link keranjang", {
      description: "Silakan coba lagi.",
      duration: 3000,
    });
  };

  const showCartEmpty = () => {
    toast.info("Keranjang masih kosong", {
      description: "Tambahkan item terlebih dahulu sebelum berbagi.",
      duration: 3000,
    });
  };

  return {
    showShareSuccess,
    showShareError,
    showCartEmpty,
  };
};

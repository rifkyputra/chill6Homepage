import { useCallback, useState, useSyncExternalStore, useEffect } from "react";
import {
  copyCartToClipboard,
  generateShareableCartURL,
} from "./cart-serialization";
import {
  type CartState,
  cartStore,
  getCartCount,
  getCartTotal,
  restoreCartFromURL,
  switchTenant,
} from "./cart-store";

export const useCartStore = (): CartState => {
  return useSyncExternalStore(
    useCallback((onStoreChange) => cartStore.subscribe(onStoreChange), []),
    () => cartStore.state,
    () => cartStore.state
  );
};

export const useCartCount = (): number => {
  const state = useCartStore();
  return getCartCount(state);
};

export const useCartTotal = (): number => {
  const state = useCartStore();
  return getCartTotal(state);
};

// Cart sharing hooks
export const useCartShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const cartState = useCartStore();

  const generateShareURL = useCallback(() => {
    return generateShareableCartURL(cartState);
  }, [cartState]);

  const copyToClipboard = useCallback(async () => {
    console.log("🪝 useCartShare: Starting clipboard copy operation");
    setIsSharing(true);
    try {
      console.log("🪝 useCartShare: Calling copyCartToClipboard...");
      const success = await copyCartToClipboard(cartState);
      console.log("🪝 useCartShare: Copy operation result:", { success });
      setShareSuccess(success);
      return success;
    } catch (error) {
      console.error("🪝 useCartShare: ❌ Error in copyToClipboard:", {
        error,
        errorName: error instanceof Error ? error.name : "Unknown",
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      setShareSuccess(false);
      return false;
    } finally {
      console.log(
        "🪝 useCartShare: Finishing copy operation, setting isSharing to false"
      );
      setIsSharing(false);
      // Reset success state after 3 seconds
      setTimeout(() => {
        console.log("🪝 useCartShare: Resetting shareSuccess state");
        setShareSuccess(false);
      }, 3000);
    }
  }, [cartState]);

  const restoreFromURL = useCallback(() => {
    return restoreCartFromURL();
  }, []);

  return {
    generateShareURL,
    copyToClipboard,
    restoreFromURL,
    isSharing,
    shareSuccess,
  };
};

// Hook to check if cart was loaded from URL (for showing notifications)
export const useCartLoadedFromURL = () => {
  const [wasLoadedFromURL, setWasLoadedFromURL] = useState(false);

  // Check on mount if cart has URL params
  useCallback(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setWasLoadedFromURL(params.has("cart"));
    }
  }, []);

  return wasLoadedFromURL;
};

// Hook to handle tenant switching
export const useTenantCartManagement = () => {
  const cartState = useCartStore();

  const switchToTenant = useCallback((tenant: string) => {
    switchTenant(tenant);
  }, []);

  const getCurrentTenant = useCallback(() => {
    return cartState.tenant || "main";
  }, [cartState.tenant]);

  return {
    switchToTenant,
    getCurrentTenant,
    currentTenant: cartState.tenant || "main",
  };
};

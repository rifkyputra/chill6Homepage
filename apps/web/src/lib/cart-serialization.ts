import type { CartItem, CartState, Service } from "./cart-store";

// Type for serialized cart data (minimized for URL)
export interface SerializedCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface SerializedCart {
  items: SerializedCartItem[];
  timestamp?: number;
}

const CART_QUERY_PARAM = "cart";
const CART_STORAGE_KEY_BASE = "chill6_cart";

/**
 * Generate tenant-specific storage key
 */
const getTenantStorageKey = (tenant?: string): string => {
  if (!tenant || tenant === "main") {
    return CART_STORAGE_KEY_BASE;
  }
  return `${CART_STORAGE_KEY_BASE}_${tenant}`;
};

/**
 * Generate tenant-specific URL parameter key
 */
const getTenantUrlParam = (tenant?: string): string => {
  if (!tenant || tenant === "main") {
    return CART_QUERY_PARAM;
  }
  return `${CART_QUERY_PARAM}_${tenant}`;
};

/**
 * Serialize cart items to a compact format for URL sharing with logging
 */
export const serializeCart = (cartState: CartState): string => {
  console.log("🔄 serializeCart: Starting serialization", {
    itemsCount: cartState.items.length,
    items: cartState.items.map((item) => ({
      id: item.service.id,
      name: item.service.name,
      quantity: item.quantity,
    })),
  });

  if (!cartState.items.length) {
    console.log("🔄 serializeCart: Empty cart, returning empty string");
    return "";
  }

  const serialized: SerializedCart = {
    items: cartState.items.map((item) => ({
      id: item.service.id,
      name: item.service.name,
      price: item.service.price,
      quantity: item.quantity,
      description: item.service.description,
    })),
    timestamp: Date.now(),
  };

  console.log("🔄 serializeCart: Prepared serialized data", {
    itemsCount: serialized.items.length,
    timestamp: serialized.timestamp,
  });

  try {
    const jsonString = JSON.stringify(serialized);
    console.log("🔄 serializeCart: JSON stringified", {
      jsonLength: jsonString.length,
      jsonPreview: jsonString.substring(0, 100) + "...",
    });

    // Base64 encode to make URL-safe
    const base64Result = btoa(jsonString);
    console.log("🔄 serializeCart: ✅ Successfully serialized", {
      base64Length: base64Result.length,
      base64Preview: base64Result.substring(0, 50) + "...",
    });

    return base64Result;
  } catch (error) {
    console.error("🔄 serializeCart: ❌ Failed to serialize cart:", {
      error,
      errorName: error instanceof Error ? error.name : "Unknown",
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    return "";
  }
};

/**
 * Deserialize cart data from URL parameter
 */
export const deserializeCart = (serializedData: string): CartItem[] => {
  if (!serializedData) return [];

  try {
    // Decode from base64
    const decoded = atob(serializedData);
    const parsed: SerializedCart = JSON.parse(decoded);

    if (!parsed.items || !Array.isArray(parsed.items)) {
      return [];
    }

    // Convert back to CartItem format
    return parsed.items.map((item) => ({
      service: {
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
      } as Service,
      quantity: item.quantity,
      addedAt: parsed.timestamp || Date.now(),
    }));
  } catch (error) {
    console.error("Failed to deserialize cart:", error);
    return [];
  }
};

/**
 * Get cart data from URL search params with tenant-specific parameter
 */
export const getCartFromURL = (tenant?: string): CartItem[] => {
  if (typeof window === "undefined") return [];

  const params = new URLSearchParams(window.location.search);
  const urlParam = getTenantUrlParam(tenant);
  const cartData = params.get(urlParam);

  return cartData ? deserializeCart(cartData) : [];
};

/**
 * Update URL with current cart data (without page reload) using tenant-specific parameter
 */
export const updateCartInURL = (
  cartState: CartState,
  tenant?: string
): void => {
  if (typeof window === "undefined") return;

  const serialized = serializeCart(cartState);
  const url = new URL(window.location.href);
  const urlParam = getTenantUrlParam(tenant);

  if (serialized) {
    url.searchParams.set(urlParam, serialized);
  } else {
    url.searchParams.delete(urlParam);
  }

  // Update URL without page reload
  window.history.replaceState(null, "", url.toString());
};

/**
 * Generate shareable URL for current cart with logging and tenant-specific parameter
 */
export const generateShareableCartURL = (
  cartState: CartState,
  tenant?: string
): string => {
  console.log("🔗 generateShareableCartURL: Starting URL generation", {
    hasWindow: typeof window !== "undefined",
    cartItemsCount: cartState.items.length,
    tenant,
  });

  if (typeof window === "undefined") {
    console.warn(
      "🔗 generateShareableCartURL: Window is undefined (SSR environment)"
    );
    return "";
  }

  console.log("🔗 generateShareableCartURL: Serializing cart...");
  const serialized = serializeCart(cartState);

  console.log("🔗 generateShareableCartURL: Serialization result", {
    serializedLength: serialized.length,
    hasSerializedData: !!serialized,
  });

  if (!serialized) {
    console.log(
      "🔗 generateShareableCartURL: No serialized data, returning current URL"
    );
    return window.location.href;
  }

  const baseUrl = window.location.origin + window.location.pathname;
  const url = new URL(baseUrl);
  const urlParam = getTenantUrlParam(tenant);
  url.searchParams.set(urlParam, serialized);

  const finalUrl = url.toString();

  console.log("🔗 generateShareableCartURL: Generated final URL", {
    baseUrl,
    finalUrl,
    finalUrlLength: finalUrl.length,
    tenant,
    urlParam,
    cartParam: url.searchParams.get(urlParam)?.substring(0, 50) + "...",
  });

  return finalUrl;
};

/**
 * Save cart to localStorage with tenant-specific storage key
 */
export const saveCartToStorage = (
  cartState: CartState,
  tenant?: string
): void => {
  if (typeof window === "undefined") return;

  try {
    const serialized: SerializedCart = {
      items: cartState.items.map((item) => ({
        id: item.service.id,
        name: item.service.name,
        price: item.service.price,
        quantity: item.quantity,
        description: item.service.description,
      })),
      timestamp: Date.now(),
    };

    const storageKey = getTenantStorageKey(tenant);
    localStorage.setItem(storageKey, JSON.stringify(serialized));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

/**
 * Load cart from localStorage with tenant-specific storage key
 */
export const loadCartFromStorage = (tenant?: string): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const storageKey = getTenantStorageKey(tenant);
    const stored = localStorage.getItem(storageKey);
    if (!stored) return [];

    const parsed: SerializedCart = JSON.parse(stored);
    if (!parsed.items || !Array.isArray(parsed.items)) {
      return [];
    }

    return parsed.items.map((item) => ({
      service: {
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
      } as Service,
      quantity: item.quantity,
      addedAt: parsed.timestamp || Date.now(),
    }));
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return [];
  }
};

/**
 * Clear cart from localStorage with tenant-specific storage key
 */
export const clearCartFromStorage = (tenant?: string): void => {
  if (typeof window === "undefined") return;

  try {
    const storageKey = getTenantStorageKey(tenant);
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error("Failed to clear cart from localStorage:", error);
  }
};

/**
 * Copy cart URL to clipboard with comprehensive logging and tenant support
 */
export const copyCartToClipboard = async (
  cartState: CartState,
  tenant?: string
): Promise<boolean> => {
  console.log("📋 copyCartToClipboard: Starting clipboard operation", {
    hasWindow: typeof window !== "undefined",
    hasNavigator: typeof navigator !== "undefined",
    hasClipboard: typeof navigator !== "undefined" && !!navigator.clipboard,
    cartItemsCount: cartState.items.length,
    tenant,
  });

  // Check environment support
  if (typeof window === "undefined") {
    console.warn(
      "📋 copyCartToClipboard: Window is undefined (SSR environment)"
    );
    return false;
  }

  if (typeof navigator === "undefined") {
    console.error("📋 copyCartToClipboard: Navigator is undefined");
    return false;
  }

  if (!navigator.clipboard) {
    console.error("📋 copyCartToClipboard: Clipboard API not available", {
      userAgent: navigator.userAgent,
      isSecureContext: window.isSecureContext,
      protocol: window.location.protocol,
    });

    // Fallback to legacy clipboard method
    console.log(
      "📋 copyCartToClipboard: Attempting fallback clipboard method..."
    );
    return await fallbackCopyToClipboard(cartState, tenant);
  }

  try {
    console.log("📋 copyCartToClipboard: Generating shareable URL...");
    const shareableURL = generateShareableCartURL(cartState, tenant);

    console.log("📋 copyCartToClipboard: Generated URL", {
      url: shareableURL,
      urlLength: shareableURL.length,
    });

    console.log("📋 copyCartToClipboard: Writing to clipboard...");
    await navigator.clipboard.writeText(shareableURL);

    console.log("📋 copyCartToClipboard: ✅ Successfully copied to clipboard");
    return true;
  } catch (error) {
    console.error(
      "📋 copyCartToClipboard: ❌ Failed to copy cart URL to clipboard:",
      {
        error,
        errorName: error instanceof Error ? error.name : "Unknown",
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        clipboardPermissions: await checkClipboardPermissions(),
      }
    );
    return false;
  }
};

/**
 * Fallback clipboard implementation using execCommand (legacy browsers)
 */
const fallbackCopyToClipboard = async (
  cartState: CartState,
  tenant?: string
): Promise<boolean> => {
  try {
    console.log("📋 fallbackCopyToClipboard: Using legacy clipboard method");

    const shareableURL = generateShareableCartURL(cartState, tenant);
    const textArea = document.createElement("textarea");

    textArea.value = shareableURL;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const result = document.execCommand("copy");
    document.body.removeChild(textArea);

    console.log("📋 fallbackCopyToClipboard: Legacy method result:", {
      result,
    });
    return result;
  } catch (error) {
    console.error(
      "📋 fallbackCopyToClipboard: ❌ Legacy method failed:",
      error
    );
    return false;
  }
};

/**
 * Check clipboard permissions for debugging
 */
const checkClipboardPermissions = async (): Promise<any> => {
  try {
    if (navigator.permissions) {
      const writePermission = await navigator.permissions.query({
        name: "clipboard-write" as PermissionName,
      });
      const readPermission = await navigator.permissions.query({
        name: "clipboard-read" as PermissionName,
      });

      return {
        write: writePermission.state,
        read: readPermission.state,
      };
    }
    return { error: "Permissions API not available" };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
};

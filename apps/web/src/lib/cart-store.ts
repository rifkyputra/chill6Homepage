import { Store } from "@tanstack/store";
import {
  saveCartToStorage,
  loadCartFromStorage,
  updateCartInURL,
  getCartFromURL,
  clearCartFromStorage,
  generateShareableCartURL as generateURL,
  copyCartToClipboard as copyToClipboard,
} from "./cart-serialization";
import { setCartLoadedFromURL } from "./cart-notifications";

export interface Service {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface CartItem {
  service: Service;
  quantity: number;
  addedAt?: number;
}

export interface CartState {
  items: CartItem[];
  lastAddedItem?: string;
  animationTrigger?: number;
  tenant?: string;
}

export const cartStore = new Store<CartState>({
  items: [],
  tenant: "main", // Default tenant
});

// Initialize cart from URL (priority) or localStorage with tenant support
const initializeCart = (tenant: string = "main") => {
  if (typeof window === "undefined") return;

  console.log("🏪 initializeCart: Starting cart initialization", { tenant });

  // Check URL first (for shared carts)
  const urlCart = getCartFromURL(tenant);
  if (urlCart.length > 0) {
    console.log("🏪 initializeCart: ✅ Loading cart from URL", {
      itemsCount: urlCart.length,
      tenant,
    });
    cartStore.setState({ items: urlCart, tenant });
    // Save URL cart to localStorage
    saveCartToStorage(cartStore.state, tenant);
    // Mark that cart was loaded from URL for notification
    setCartLoadedFromURL(true);
    return;
  }

  // Fallback to localStorage
  const storedCart = loadCartFromStorage(tenant);
  if (storedCart.length > 0) {
    console.log("🏪 initializeCart: Loading cart from localStorage", {
      itemsCount: storedCart.length,
      tenant,
    });
    cartStore.setState({ items: storedCart, tenant });
    // Mark that cart was NOT loaded from URL
    setCartLoadedFromURL(false);
  } else {
    console.log(
      "🏪 initializeCart: No cart data found, starting with empty cart",
      { tenant }
    );
    cartStore.setState({ items: [], tenant });
    // Mark that cart was NOT loaded from URL
    setCartLoadedFromURL(false);
  }
};

// Auto-save cart changes to localStorage and URL with tenant support
const syncCartToStorage = (state: CartState) => {
  saveCartToStorage(state, state.tenant);
  updateCartInURL(state, state.tenant);
};

// Initialize cart on first load
if (typeof window !== "undefined") {
  initializeCart("main"); // Default to main tenant
}

// Actions
export const addToCart = (service: Service) => {
  cartStore.setState((state) => {
    const existingItem = state.items.find(
      (item) => item.service.id === service.id
    );

    let newState: CartState;
    if (existingItem) {
      newState = {
        ...state,
        items: state.items.map((item) =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + 1, addedAt: Date.now() }
            : item
        ),
        lastAddedItem: service.id,
        animationTrigger: Date.now(),
      };
    } else {
      newState = {
        ...state,
        items: [...state.items, { service, quantity: 1, addedAt: Date.now() }],
        lastAddedItem: service.id,
        animationTrigger: Date.now(),
      };
    }

    // Sync to storage and URL
    syncCartToStorage(newState);
    return newState;
  });
};

// Switch to a different tenant (loads that tenant's cart)
export const switchTenant = (newTenant: string = "main") => {
  if (typeof window === "undefined") return;

  const currentTenant = cartStore.state.tenant;
  if (currentTenant === newTenant) return;

  console.log("🏪 switchTenant: Switching tenant", {
    from: currentTenant,
    to: newTenant,
  });

  // Initialize cart for the new tenant
  initializeCart(newTenant);
};

export const removeFromCart = (serviceId: string) => {
  cartStore.setState((state) => {
    const newState = {
      ...state,
      items: state.items.filter((item) => item.service.id !== serviceId),
    };

    // Sync to storage and URL
    syncCartToStorage(newState);
    return newState;
  });
};

export const updateQuantity = (serviceId: string, quantity: number) => {
  if (quantity <= 0) {
    removeFromCart(serviceId);
    return;
  }

  cartStore.setState((state) => {
    const newState = {
      ...state,
      items: state.items.map((item) =>
        item.service.id === serviceId ? { ...item, quantity } : item
      ),
    };

    // Sync to storage and URL
    syncCartToStorage(newState);
    return newState;
  });
};

export const clearCart = () => {
  cartStore.setState((state) => {
    const newState = { items: [], tenant: state.tenant };

    // Clear storage and URL for the current tenant
    clearCartFromStorage(state.tenant);
    syncCartToStorage(newState);
    return newState;
  });
};

// Selectors
export const getCartCount = (state: CartState): number => {
  return state.items.reduce((total, item) => total + item.quantity, 0);
};

export const getCartTotal = (state: CartState): number => {
  return state.items.reduce(
    (total, item) => total + item.service.price * item.quantity,
    0
  );
};

// Cart sharing utilities
export const generateShareableCartURL = (state?: CartState): string => {
  const currentState = state || cartStore.state;
  return generateURL(currentState, currentState.tenant);
};

export const copyCartToClipboard = async (
  state?: CartState
): Promise<boolean> => {
  const currentState = state || cartStore.state;
  return copyToClipboard(currentState, currentState.tenant);
};

export const restoreCartFromURL = (tenant?: string): boolean => {
  const targetTenant = tenant || cartStore.state.tenant;
  const urlCart = getCartFromURL(targetTenant);

  if (urlCart.length > 0) {
    console.log("🏪 restoreCartFromURL: Restoring cart from URL manually", {
      tenant: targetTenant,
    });
    cartStore.setState({ items: urlCart, tenant: targetTenant });
    syncCartToStorage(cartStore.state);
    // Mark that cart was loaded from URL for notification
    setCartLoadedFromURL(true);
    return true;
  }

  return false;
};

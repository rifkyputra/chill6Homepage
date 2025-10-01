import { Check, Minus, Plus, Share2, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useCartCount,
  useCartShare,
  useCartStore,
  useCartTotal,
  useTenantCartManagement,
} from "@/lib/cart-hooks";
import { useCartShareNotification } from "@/lib/cart-notifications";
import { removeFromCart, updateQuantity } from "@/lib/cart-store";
import CheckoutDialog from "./checkout-dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function CartDropdown({ tenant }: { tenant?: string }) {
  const cartState = useCartStore();
  const cartItems = cartState.items;
  const cartCount = useCartCount();
  const cartTotal = useCartTotal();
  const { copyToClipboard, isSharing, shareSuccess } = useCartShare();
  const { showShareSuccess, showShareError, showCartEmpty } =
    useCartShareNotification();
  const { switchToTenant, getCurrentTenant } = useTenantCartManagement();
  const [isShaking, setIsShaking] = useState(false);
  const [lastTrigger, setLastTrigger] = useState(0);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Ensure cart is switched to the correct tenant when component mounts or tenant changes
  useEffect(() => {
    const targetTenant = tenant || "main";
    const currentTenant = getCurrentTenant();

    if (currentTenant !== targetTenant) {
      console.log("🛒 CartDropdown: Switching to tenant", {
        from: currentTenant,
        to: targetTenant,
      });
      switchToTenant(targetTenant);
    }
  }, [tenant, switchToTenant, getCurrentTenant]);

  const handleCheckoutClick = () => {
    setShowCheckoutDialog(true);
    // Tutup dropdown ketika dialog dibuka
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  };

  const handleShareCart = async () => {
    console.log("🛒 CartDropdown: Share cart button clicked", {
      cartItemsCount: cartItems.length,
      cartItems: cartItems.map((item) => ({
        id: item.service.id,
        name: item.service.name,
        quantity: item.quantity,
      })),
    });

    if (cartItems.length === 0) {
      console.log(
        "🛒 CartDropdown: Cart is empty, showing empty cart notification"
      );
      showCartEmpty();
      return;
    }

    console.log("🛒 CartDropdown: Calling copyToClipboard...");
    const success = await copyToClipboard();
    console.log("🛒 CartDropdown: Copy to clipboard result:", { success });

    if (success) {
      console.log(
        "🛒 CartDropdown: ✅ Share successful, showing success notification"
      );
      showShareSuccess();
    } else {
      console.log(
        "🛒 CartDropdown: ❌ Share failed, showing error notification"
      );
      showShareError();
    }
  };

  // Trigger shake animation when items are added
  useEffect(() => {
    if (
      cartState.animationTrigger &&
      cartState.animationTrigger > lastTrigger
    ) {
      setIsShaking(true);
      setLastTrigger(cartState.animationTrigger);
      setTimeout(() => setIsShaking(false), 600);
    }
  }, [cartState.animationTrigger, lastTrigger]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`relative p-2 transition-transform duration-300 ${
            isShaking ? "animate-shake" : "hover:scale-105"
          }`}
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <Badge
              variant="destructive"
              className={`-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center p-0 text-xs transition-all duration-300 ${
                isShaking ? "scale-110 animate-bounce-in" : "animate-pulse-glow"
              }`}
            >
              {cartCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="slide-in-from-top-2 w-80 animate-in duration-200"
        align="end"
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Keranjang Belanja</span>
          <Badge variant="secondary">{cartCount} item</Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {cartItems.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            <ShoppingCart className="mx-auto mb-2 h-12 w-12 text-gray-300" />
            <p>Keranjang kosong</p>
            <p className="text-sm">Yuk pilih layanan yang kamu butuhkan!</p>
          </div>
        ) : (
          <>
            <div className="max-h-64 overflow-y-auto">
              {cartItems.map((item, index) => {
                const isRecentlyAdded =
                  item.addedAt &&
                  cartState.lastAddedItem === item.service.id &&
                  Date.now() - item.addedAt < 1000;

                return (
                  <DropdownMenuItem
                    key={item.service.id}
                    className={`flex-col items-start space-y-2 p-3 transition-all duration-300 ${
                      isRecentlyAdded
                        ? "animate-slide-in-scale border-blue-500 border-l-2 bg-blue-50 dark:bg-blue-900/20"
                        : "slide-in-from-left animate-in"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="w-full">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {item.service.name}
                          </h4>
                          <p className="mt-1 text-gray-500 text-xs">
                            Rp {item.service.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.preventDefault();
                            removeFromCart(item.service.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.preventDefault();
                              updateQuantity(
                                item.service.id,
                                item.quantity - 1
                              );
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="min-w-[20px] text-center font-medium text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.preventDefault();
                              updateQuantity(
                                item.service.id,
                                item.quantity + 1
                              );
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="font-semibold text-sm">
                          Rp{" "}
                          {(item.service.price * item.quantity).toLocaleString(
                            "id-ID"
                          )}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </div>

            <DropdownMenuSeparator />

            <div className="p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">
                  Rp {cartTotal.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Terms & Conditions checkbox for non-main tenants */}
              {tenant && tenant !== "main" && (
                <div className="mb-3 flex items-start space-x-2">
                  <Checkbox
                    id="terms-checkbox"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
                  />
                  <label
                    htmlFor="terms-checkbox"
                    className="text-sm text-gray-600 dark:text-gray-300 leading-tight cursor-pointer"
                  >
                    Saya setuju dengan{" "}
                    <a
                      href={`/${tenant}/sub/tnc`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                    >
                      syarat dan ketentuan
                    </a>{" "}
                    yang berlaku
                  </label>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleShareCart}
                  disabled={isSharing}
                >
                  {shareSuccess ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Disalin!
                    </>
                  ) : (
                    <>
                      <Share2 className="mr-2 h-4 w-4" />
                      {isSharing ? "Berbagi..." : "Bagikan"}
                    </>
                  )}
                </Button>

                <Button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCheckoutClick}
                  disabled={!!(tenant && tenant !== "main" && !agreeToTerms)}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>

      <CheckoutDialog
        isOpen={showCheckoutDialog}
        onClose={() => setShowCheckoutDialog(false)}
      />
    </DropdownMenu>
  );
}

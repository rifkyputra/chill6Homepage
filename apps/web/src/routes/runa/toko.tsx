import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import {
  RUNA_PRODUCTS,
  formatPrice,
  type ProductVariant,
  type RunaProduct,
} from "../../lib/runa-products";
import { cartStore, type CartItem } from "../../lib/cart-store";
import { useCartStore } from "../../lib/cart-hooks";

export const Route = createFileRoute("/runa/toko")({
  component: RunaToko,
});

interface ProductCardProps {
  product: RunaProduct;
}

function ProductCard({ product }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const cartState = useCartStore();

  // Find cart item for this product variant
  const cartItem = cartState.items.find(
    (item: CartItem) =>
      selectedVariant &&
      item.service.id === `${product.id}-${selectedVariant.id}`
  );

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const service = {
      id: `${product.id}-${selectedVariant.id}`,
      name: `${product.name} - ${selectedVariant.name}`,
      price: selectedVariant.price,
      description: selectedVariant.description,
    };

    cartStore.setState((state) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item.service.id === service.id
      );

      if (existingItemIndex >= 0) {
        // Item exists, increment quantity
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += 1;
        return {
          ...state,
          items: newItems,
          lastAddedItem: service.id,
          animationTrigger: Date.now(),
        };
      } else {
        // New item, add to cart
        return {
          ...state,
          items: [
            ...state.items,
            { service, quantity: 1, addedAt: Date.now() },
          ],
          lastAddedItem: service.id,
          animationTrigger: Date.now(),
        };
      }
    });
  };

  const handleUpdateQuantity = (change: number) => {
    if (!selectedVariant) return;

    const serviceId = `${product.id}-${selectedVariant.id}`;

    cartStore.setState((state) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item.service.id === serviceId
      );

      if (existingItemIndex >= 0) {
        const newItems = [...state.items];
        const newQuantity = newItems[existingItemIndex].quantity + change;

        if (newQuantity <= 0) {
          // Remove item if quantity becomes 0 or less
          newItems.splice(existingItemIndex, 1);
        } else {
          newItems[existingItemIndex].quantity = newQuantity;
        }

        return {
          ...state,
          items: newItems,
          animationTrigger: Date.now(),
        };
      }
      return state;
    });
  };

  const handleRemoveFromCart = () => {
    if (!selectedVariant) return;

    const serviceId = `${product.id}-${selectedVariant.id}`;

    cartStore.setState((state) => ({
      ...state,
      items: state.items.filter((item) => item.service.id !== serviceId),
      animationTrigger: Date.now(),
    }));
  };

  const IconComponent = product.icon;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <Badge variant="secondary" className="mt-1">
              {product.category}
            </Badge>
          </div>
        </div>
        <CardDescription className="mt-2">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Pilih Paket:</Label>
          <div className="grid gap-2">
            {product.variants.map((variant) => (
              <div key={variant.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={variant.id}
                  name={`variant-${product.id}`}
                  value={variant.id}
                  checked={selectedVariant?.id === variant.id}
                  onChange={() => handleVariantSelect(variant)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <label
                  htmlFor={variant.id}
                  className="flex-1 flex justify-between items-center cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <div className="font-medium">{variant.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {variant.description}
                    </div>
                  </div>
                  <div className="font-bold text-primary">
                    {formatPrice(variant.price)}
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {selectedVariant && (
          <div className="mt-auto pt-4 border-t">
            {!cartItem ? (
              <Button onClick={handleAddToCart} className="w-full" size="sm">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Tambah ke Keranjang
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateQuantity(-1)}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>

                <div className="flex-1 text-center font-medium">
                  {cartItem.quantity}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateQuantity(1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveFromCart}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RunaToko() {
  const categories = [
    ...new Set(RUNA_PRODUCTS.map((product) => product.category)),
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Toko Runa</h1>
        <p className="text-muted-foreground">
          Aplikasi premium dengan harga terjangkau
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            {category}
            <Badge variant="outline">
              {RUNA_PRODUCTS.filter((p) => p.category === category).length}{" "}
              produk
            </Badge>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RUNA_PRODUCTS.filter(
              (product) => product.category === category
            ).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

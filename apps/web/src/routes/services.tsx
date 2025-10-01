import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle, Clock, Minus, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProductAvailabilityOverlay, {
  useStockStatusStyle,
} from "@/components/product-availability-overlay";
import { PRODUCTS_DATA, type ProductService } from "@/lib/products-data";
import {
  SPECIAL_OFFERS,
  SECTION_CONTENT,
  formatPrice,
  STOCK_STATUS,
  UI_TEXT,
} from "@/lib/constants";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  type Service,
} from "@/lib/cart-store";
import { useCartStore } from "@/lib/cart-hooks";

export const Route = createFileRoute("/services")({
  component: ServicesComponent,
});

function ServicesComponent() {
  const cartState = useCartStore();

  // Helper function to find cart item and get quantity
  const getCartItemQuantity = (serviceId: string): number => {
    const cartItem = cartState.items.find(
      (item) => item.service.id === serviceId
    );
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (service: ProductService) => {
    // Check if product is available
    if (service.stockStatus !== "available") {
      toast.error(`${service.name} sedang tidak tersedia`, {
        description:
          service.stockStatus === "sold-out" ? "Stok habis" : "Segera hadir",
        duration: 3000,
      });
      return;
    }

    const cartService: Service = {
      id: service.id,
      name: service.name,
      price: service.priceNum,
      description: service.description,
    };

    addToCart(cartService);
    toast.success(`${service.name} ditambahkan ke keranjang!`, {
      description: `Harga: ${formatPrice(service.priceNum)}`,
      duration: 2000,
    });
  };

  const handleIncrement = (serviceId: string) => {
    const currentQuantity = getCartItemQuantity(serviceId);
    updateQuantity(serviceId, currentQuantity + 1);
  };

  const handleDecrement = (serviceId: string) => {
    const currentQuantity = getCartItemQuantity(serviceId);
    if (currentQuantity > 1) {
      updateQuantity(serviceId, currentQuantity - 1);
    } else {
      removeFromCart(serviceId);
      toast.info("Item dihapus dari keranjang");
    }
  };

  const handleRemoveFromCart = (serviceId: string, serviceName: string) => {
    removeFromCart(serviceId);
    toast.info(`${serviceName} dihapus dari keranjang`);
  };

  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 font-bold text-4xl md:text-6xl">Layanan Kami</h1>
          <p className="mx-auto max-w-3xl text-blue-100 text-xl md:text-2xl">
            Layanan hiburan, gaming, dan digital lengkap yang sesuai
            kebutuhanmu.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {PRODUCTS_DATA.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <div className="mb-12 text-center">
                <div className="mb-4 flex items-center justify-center gap-4">
                  <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-3 text-white">
                    <category.icon className="h-8 w-8" />
                  </div>
                </div>
                <div className="mb-4 flex flex-col items-center justify-center gap-4">
                  {category.featured && (
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="mr-1 h-3 w-3" />
                      {UI_TEXT.BADGES.FEATURED}
                    </Badge>
                  )}
                  <h2 className="mb-4 font-bold text-3xl text-gray-800 dark:text-white">
                    {category.title}
                  </h2>
                </div>
                <p className="mx-auto max-w-2xl text-gray-600 text-lg dark:text-gray-300">
                  {category.description}
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {category.services.map((service, serviceIndex) => {
                  const stockStyle = useStockStatusStyle(service.stockStatus);
                  const isAvailable =
                    service.stockStatus === STOCK_STATUS.AVAILABLE;

                  return (
                    <ProductAvailabilityOverlay
                      key={serviceIndex}
                      stockStatus={service.stockStatus}
                      showBadge={true}
                    >
                      <Card
                        className={`border-0 shadow-lg transition-all duration-300 hover:shadow-2xl ${stockStyle.card.className}`}
                      >
                        <CardHeader>
                          <div className="mb-2 flex items-start justify-between">
                            <CardTitle className="font-bold text-gray-800 text-xl dark:text-white">
                              {service.name}
                            </CardTitle>
                            <Badge variant="secondary" className="ml-2">
                              {service.price}
                            </Badge>
                          </div>
                          <CardDescription className="text-gray-600 dark:text-gray-300">
                            {service.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="mb-6 space-y-2">
                            {service.features.map((feature, featureIndex) => (
                              <li
                                key={featureIndex}
                                className="flex items-center gap-2 text-gray-700 text-sm dark:text-gray-300"
                              >
                                <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <div className="space-y-2">
                            {getCartItemQuantity(service.id) === 0 ? (
                              // Add to cart button
                              <>
                                {isAvailable ? (
                                  <Button
                                    className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ${stockStyle.button.className}`}
                                    onClick={() => handleAddToCart(service)}
                                    disabled={!isAvailable}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    {isAvailable
                                      ? "Pilih Layanan"
                                      : stockStyle.badge.text}
                                  </Button>
                                ) : (
                                  <> </>
                                )}
                              </>
                            ) : (
                              // Quantity controls and remove button
                              <div className="space-y-2 flex flex-row items-center justify-center gap-3 ">
                                <div className="flex flex-row m-0 items-center justify-center gap-2 w-full">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 border-gray-300 dark:border-gray-600"
                                    onClick={() => handleDecrement(service.id)}
                                    disabled={!isAvailable}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-12 text-center font-semibold text-lg">
                                    {getCartItemQuantity(service.id)}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 border-gray-300 dark:border-gray-600"
                                    onClick={() => handleIncrement(service.id)}
                                    disabled={!isAvailable}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveFromCart(
                                      service.id,
                                      service.name
                                    )
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Hapus dari Keranjang
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </ProductAvailabilityOverlay>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="bg-white py-20 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold text-3xl text-gray-800 dark:text-white">
              {SECTION_CONTENT.SPECIAL_OFFERS.title}
            </h2>
            <p className="text-gray-600 text-lg dark:text-gray-300">
              {SECTION_CONTENT.SPECIAL_OFFERS.description}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SPECIAL_OFFERS.map((offer) => (
              <Card key={offer.id} className={offer.cardStyle}>
                <CardHeader>
                  <Badge className={`mb-2 w-fit ${offer.badge.className}`}>
                    {offer.badge.icon === "Clock" && (
                      <Clock className="mr-1 h-3 w-3" />
                    )}
                    {offer.badge.text}
                  </Badge>
                  <CardTitle className="font-bold text-xl">
                    {offer.title}
                  </CardTitle>
                  <CardDescription>{offer.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`mb-4 font-bold text-2xl ${offer.price.color}`}
                  >
                    {offer.price.current ? (
                      <>
                        {formatPrice(offer.price.current)}{" "}
                        {offer.price.original && (
                          <span className="font-normal text-gray-500 text-sm line-through">
                            {formatPrice(offer.price.original)}
                          </span>
                        )}
                      </>
                    ) : (
                      offer.price.text
                    )}
                  </div>
                  <ul className="mb-4 space-y-1 text-sm">
                    {offer.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                  <Button className={`w-full ${offer.button.className}`}>
                    {offer.button.text}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

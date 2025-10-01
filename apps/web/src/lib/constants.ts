// Currency and Pricing Constants
export const CURRENCY = {
  SYMBOL: "Rp",
  LOCALE: "id-ID",
} as const;

// Common Fee Structure
export const FEES = {
  PULSA_DATA: 2000,
  EWALLET_PERCENTAGE: 1,
  TRANSPORT_CARD: 3000,
  PLN_TOKEN: 2500,
  BILL_PAYMENT: 3000,
} as const;

// Stock Status Constants
export const STOCK_STATUS = {
  AVAILABLE: "available",
  SOLD_OUT: "sold-out",
  COMING_SOON: "coming-soon",
} as const;

// UI Text Constants
export const UI_TEXT = {
  BADGES: {
    FEATURED: "Featured",
    LIMITED_TIME: "Waktu Terbatas",
    POPULAR: "Populer",
    AVAILABLE_24_7: "24/7",
    SETUP_FREE: "Setup Gratis",
  },
  MESSAGES: {
    PRICE_LABEL: "Harga:",
    NO_SETUP_FEE: "Tanpa biaya setup",
    INSTANT_TRANSACTION: "Transaksi instan",
    SUPPORT_24_7: "Support 24/7",
    MANY_PAYMENT_OPTIONS: "Banyak opsi pembayaran",
  },
} as const;

// Special Offers Data
export const SPECIAL_OFFERS = [
  {
    id: "gaming-package",
    badge: {
      text: UI_TEXT.BADGES.LIMITED_TIME,
      className: "bg-yellow-500 text-white",
      icon: undefined as string | undefined,
    },
    title: "Paket Gaming",
    description: "PS4 + Snack + Minuman",
    price: {
      current: 45000,
      original: 55000,
      color: "text-yellow-600",
      text: undefined as string | undefined,
    },
    features: [
      "2 jam gaming PS4",
      "Snack ringan gratis",
      "Minuman soft drink unlimited",
      "Pilihan game premium",
    ],
    button: {
      text: "Booking Sekarang",
      className: "bg-yellow-500 hover:bg-yellow-600",
    },
    cardStyle:
      "border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
  },
  {
    id: "photo-session",
    badge: {
      text: UI_TEXT.BADGES.POPULAR,
      className: "bg-blue-500 text-white",
      icon: undefined as string | undefined,
    },
    title: "Sesi Foto",
    description: "Studio + Copy digital",
    price: {
      current: 350000,
      original: 400000,
      color: "text-blue-600",
      text: undefined as string | undefined,
    },
    features: [
      "1 jam sesi studio",
      "Fotografer profesional",
      "50+ foto teredited",
      "Album digital gratis",
    ],
    button: {
      text: "Book Sesi",
      className: "bg-blue-500 hover:bg-blue-600",
    },
    cardStyle:
      "border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20",
  },
  {
    id: "digital-services",
    badge: {
      text: UI_TEXT.BADGES.AVAILABLE_24_7,
      className: "bg-green-500 text-white",
      icon: "Clock" as string | undefined,
    },
    title: "Layanan Digital",
    description: "Solusi pembayaran all-in-one",
    price: {
      current: undefined as number | undefined,
      original: undefined as number | undefined,
      color: "text-green-600",
      text: UI_TEXT.BADGES.SETUP_FREE,
    },
    features: [
      UI_TEXT.MESSAGES.NO_SETUP_FEE,
      UI_TEXT.MESSAGES.INSTANT_TRANSACTION,
      UI_TEXT.MESSAGES.SUPPORT_24_7,
      UI_TEXT.MESSAGES.MANY_PAYMENT_OPTIONS,
    ],
    button: {
      text: "Mulai Sekarang",
      className: "bg-green-500 hover:bg-green-600",
    },
    cardStyle:
      "border-2 border-green-400 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20",
  },
] as const;

// Price Formatting Utilities
export const formatPrice = (
  price: number,
  includeSymbol: boolean = true
): string => {
  const formatted = price.toLocaleString(CURRENCY.LOCALE);
  return includeSymbol ? `${CURRENCY.SYMBOL} ${formatted}` : formatted;
};

export const formatPriceRange = (
  minPrice: number,
  maxPrice: number
): string => {
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
};

export const formatPriceWithFee = (basePrice: number, fee: number): string => {
  return `${formatPrice(basePrice)} + ${formatPrice(fee)}`;
};

export const formatPercentageFee = (percentage: number): string => {
  return `Harga nominal + ${percentage}%`;
};

// Price Calculation Utilities
export const calculateTotal = (
  items: Array<{ price: number; quantity: number }>
): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const calculateDiscountedPrice = (
  originalPrice: number,
  discountPercent: number
): number => {
  return originalPrice - (originalPrice * discountPercent) / 100;
};

export const calculateWithFee = (basePrice: number, fee: number): number => {
  return basePrice + fee;
};

export const calculatePercentageFee = (
  basePrice: number,
  percentage: number
): number => {
  return basePrice * (percentage / 100);
};

// Validation Utilities
export const isValidPrice = (price: number): boolean => {
  return typeof price === "number" && price > 0 && isFinite(price);
};

export const isValidQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity > 0;
};

// Display Utilities
export const formatQuantity = (quantity: number): string => {
  return quantity.toString();
};

export const formatPriceWithOriginal = (
  currentPrice: number,
  originalPrice?: number
): string => {
  if (!originalPrice || originalPrice <= currentPrice) {
    return formatPrice(currentPrice);
  }
  return `${formatPrice(currentPrice)} (was ${formatPrice(originalPrice)})`;
};

// Section Titles and Descriptions
export const SECTION_CONTENT = {
  SPECIAL_OFFERS: {
    title: "Penawaran Spesial",
    description:
      "Promo terbatas dan paket penawaran untuk pelanggan setia kami.",
  },
} as const;

// Business Hours and Availability
export const BUSINESS_CONFIG = {
  HOURS: "24/7",
  INSTANT_DELIVERY: "Pengiriman instan",
  SAFE_TRANSACTION: "Transaksi aman",
} as const;

export const CONTACT_INFO = {
  TITLE: "Info Kontak",
  ADDRESS: "Jl. Digital Entertainment No. 6\nKota Gaming, Provinsi Digital",
  PHONE: "+62 831-049-04353",
  EMAIL: "info@chill6.space",
  HOURS: "Sen-Jum: 08:00-21:00",
  HOURS2: "Sab-Min: 08:00-15:00",
};

// Footer Content
export const FOOTER_CONTENT = {
  COMPANY: {
    NAME: "Chill6 Space",
    DESCRIPTION:
      "Tempat terbaik untuk hiburan digital, gaming, dan layanan premium. Kami gabungkan teknologi dengan kenyamanan untuk pengalaman yang tak terlupakan.",
    SOCIAL_LINKS: {
      INSTAGRAM_TITLE: "Follow us on Instagram",
      FACEBOOK_TITLE: "Like us on Facebook",
      TWITTER_TITLE: "Follow us on Twitter",
    },
  },
  QUICK_LINKS: {
    TITLE: "Menu Cepat",
    ITEMS: {
      HOME: "Beranda",
      ABOUT: "Tentang Kami",
      SERVICES: "Layanan Kami",
      CONTACT: "Kontak",
    },
  },
  POPULAR_SERVICES: {
    TITLE: "Layanan Populer",
    ITEMS: [
      "Gaming PS4",
      "Aplikasi Premium",
      "Foto Studio",
      "Pembayaran Digital",
      "Matcha & Kopi",
      "Bayar Tagihan",
    ],
  },

  BOTTOM_SECTION: {
    COPYRIGHT: "Chill6 Space. All rights reserved.",
    MADE_WITH_LOVE: {
      PREFIX: "Dibuat dengan",
      SUFFIX: "untuk komunitas kami",
    },
    LEGAL_LINKS: {
      PRIVACY_POLICY: "Kebijakan Privasi",
      TERMS_OF_SERVICE: "Syarat Layanan",
      COOKIE_POLICY: "Kebijakan Cookie",
      HELP: "Bantuan",
    },
  },
} as const;

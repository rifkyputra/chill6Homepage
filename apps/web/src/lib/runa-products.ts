import {
  Monitor,
  Play,
  Gamepad2,
  PenTool,
  Music,
  Film,
  type LucideIcon,
} from "lucide-react";

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface RunaProduct {
  id: string;
  name: string;
  icon: LucideIcon;
  category: string;
  description: string;
  variants: ProductVariant[];
  stockStatus: "available" | "out_of_stock" | "coming_soon";
}

export const RUNA_PRODUCTS: RunaProduct[] = [
  {
    id: "netflix",
    name: "Netflix Premium",
    icon: Play,
    category: "Streaming",
    description: "Akses unlimited ke ribuan film dan series favorit",
    stockStatus: "available",
    variants: [
      {
        id: "netflix-1d",
        name: "1 Hari",
        price: 5000,
        description: "Akses Netflix Premium selama 1 hari",
      },
      {
        id: "netflix-3d",
        name: "3 Hari",
        price: 12000,
        description: "Akses Netflix Premium selama 3 hari",
      },
      {
        id: "netflix-7d",
        name: "7 Hari",
        price: 25000,
        description: "Akses Netflix Premium selama 7 hari",
      },
      {
        id: "netflix-30d",
        name: "30 Hari",
        price: 85000,
        description: "Akses Netflix Premium selama 30 hari",
      },
    ],
  },
  {
    id: "prime-video",
    name: "Amazon Prime Video",
    icon: Film,
    category: "Streaming",
    description: "Tonton film dan series eksklusif Amazon",
    stockStatus: "available",
    variants: [
      {
        id: "prime-1d",
        name: "1 Hari",
        price: 4000,
        description: "Akses Prime Video selama 1 hari",
      },
      {
        id: "prime-7d",
        name: "7 Hari",
        price: 20000,
        description: "Akses Prime Video selama 7 hari",
      },
      {
        id: "prime-30d",
        name: "30 Hari",
        price: 75000,
        description: "Akses Prime Video selama 30 hari",
      },
    ],
  },
  {
    id: "robux",
    name: "Robux Roblox",
    icon: Gamepad2,
    category: "Gaming",
    description: "Virtual currency untuk game Roblox",
    stockStatus: "available",
    variants: [
      {
        id: "robux-20k",
        name: "400 Robux",
        price: 20000,
        description: "Top up 400 Robux ke akun Roblox",
      },
      {
        id: "robux-50k",
        name: "1000 Robux",
        price: 50000,
        description: "Top up 1000 Robux ke akun Roblox",
      },
      {
        id: "robux-100k",
        name: "2200 Robux",
        price: 100000,
        description: "Top up 2200 Robux ke akun Roblox",
      },
      {
        id: "robux-200k",
        name: "4500 Robux",
        price: 200000,
        description: "Top up 4500 Robux ke akun Roblox",
      },
    ],
  },
  {
    id: "canva-premium",
    name: "Canva Pro",
    icon: PenTool,
    category: "Design",
    description: "Tools desain profesional dengan template premium",
    stockStatus: "available",
    variants: [
      {
        id: "canva-7d",
        name: "7 Hari",
        price: 15000,
        description: "Akses Canva Pro selama 7 hari",
      },
      {
        id: "canva-30d",
        name: "30 Hari",
        price: 45000,
        description: "Akses Canva Pro selama 30 hari",
      },
      {
        id: "canva-90d",
        name: "90 Hari",
        price: 120000,
        description: "Akses Canva Pro selama 90 hari",
      },
    ],
  },
  {
    id: "spotify-premium",
    name: "Spotify Premium",
    icon: Music,
    category: "Music",
    description: "Musik tanpa iklan dengan kualitas tinggi",
    stockStatus: "available",
    variants: [
      {
        id: "spotify-7d",
        name: "7 Hari",
        price: 18000,
        description: "Akses Spotify Premium selama 7 hari",
      },
      {
        id: "spotify-30d",
        name: "30 Hari",
        price: 65000,
        description: "Akses Spotify Premium selama 30 hari",
      },
    ],
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    icon: Monitor,
    category: "Streaming",
    description: "YouTube tanpa iklan dengan download offline",
    stockStatus: "available",
    variants: [
      {
        id: "youtube-7d",
        name: "7 Hari",
        price: 22000,
        description: "Akses YouTube Premium selama 7 hari",
      },
      {
        id: "youtube-30d",
        name: "30 Hari",
        price: 80000,
        description: "Akses YouTube Premium selama 30 hari",
      },
    ],
  },
];

export const getRunaProductById = (
  productId: string
): RunaProduct | undefined => {
  return RUNA_PRODUCTS.find((product) => product.id === productId);
};

export const getProductVariantById = (
  productId: string,
  variantId: string
): ProductVariant | undefined => {
  const product = getRunaProductById(productId);
  if (!product) return undefined;
  return product.variants.find((variant) => variant.id === variantId);
};

export const formatPrice = (price: number): string => {
  return `Rp ${price.toLocaleString("id-ID")}`;
};

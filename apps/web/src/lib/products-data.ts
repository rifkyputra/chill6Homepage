import {
  Camera,
  Coffee,
  Crown,
  Gamepad2,
  Smartphone,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { STOCK_STATUS } from "./constants";
import productsJson from "./products.json";

// Stock status types
export type StockStatus = (typeof STOCK_STATUS)[keyof typeof STOCK_STATUS];

// Extended service interface with stock status
export interface ProductService {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  description: string;
  features: string[];
  stockStatus: StockStatus;
}

// Service category interface
export interface ServiceCategory {
  icon: LucideIcon;
  title: string;
  description: string;
  featured: boolean;
  services: ProductService[];
}

// JSON data interface (with icon as string)
interface ServiceCategoryJson {
  icon: string;
  title: string;
  description: string;
  featured: boolean;
  services: ProductService[];
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Gamepad2,
  Crown,
  Camera,
  Coffee,
  Smartphone,
  Zap,
};

// Load and transform data from JSON
const transformProductsData = (): ServiceCategory[] => {
  return (productsJson as ServiceCategoryJson[]).map((category) => ({
    ...category,
    icon: iconMap[category.icon] || Gamepad2, // fallback to Gamepad2 if icon not found
  }));
};

// Product data with stock status
export const PRODUCTS_DATA: ServiceCategory[] = transformProductsData();

// Helper functions to work with products
export const getProductById = (
  productId: string
): ProductService | undefined => {
  for (const category of PRODUCTS_DATA) {
    const product = category.services.find(
      (service) => service.id === productId
    );
    if (product) return product;
  }
  return undefined;
};

export const getAvailableProducts = (): ProductService[] => {
  return PRODUCTS_DATA.flatMap((category) => category.services).filter(
    (product) => product.stockStatus === STOCK_STATUS.AVAILABLE
  );
};

export const getProductsByStatus = (status: StockStatus): ProductService[] => {
  return PRODUCTS_DATA.flatMap((category) => category.services).filter(
    (product) => product.stockStatus === status
  );
};

export const isProductAvailable = (productId: string): boolean => {
  const product = getProductById(productId);
  return product ? product.stockStatus === STOCK_STATUS.AVAILABLE : false;
};

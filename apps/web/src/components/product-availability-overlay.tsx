import React from "react";
import { AlertCircle, Clock } from "lucide-react";
import { type StockStatus } from "@/lib/products-data";
import { Badge } from "@/components/ui/badge";

export interface ProductAvailabilityOverlayProps {
  stockStatus: StockStatus;
  className?: string;
  showBadge?: boolean;
  children?: React.ReactNode;
}

export const ProductAvailabilityOverlay: React.FC<
  ProductAvailabilityOverlayProps
> = ({ stockStatus, className = "", showBadge = false, children }) => {
  // If available, render children without overlay
  if (stockStatus === "available") {
    return <>{children}</>;
  }

  // Render overlay for sold-out or coming-soon
  const overlayConfig = {
    "sold-out": {
      overlayClass: "bg-red-500/5",
      textColor: "text-red-100",
      icon: <AlertCircle className="h-8 w-8" />,
      title: "Stok Habis",
      description: "Produk ini sedang tidak tersedia",
      badgeVariant: "destructive" as const,
      badgeText: "Habis",
    },
    "coming-soon": {
      overlayClass: "bg-yellow-500/30",
      textColor: "text-yellow-100",
      icon: <Clock className="h-8 w-8" />,
      title: "Segera Hadir",
      description: "Produk ini akan tersedia segera",
      badgeVariant: "secondary" as const,
      badgeText: "Segera Hadir",
    },
  };

  const config = overlayConfig[stockStatus];

  return (
    <div className={`relative ${className}`}>
      {/* Original content with reduced opacity */}
      <div className="opacity-50">{children}</div>

      {/* Overlay for non-available products */}
      <div
        className={`absolute inset-0 flex items-center justify-center rounded-lg ${config.overlayClass}`}
      >
        <div className={`text-center ${config.textColor}`}>
          {config.icon}
          <h3 className="mt-2 font-semibold text-lg">{config.title}</h3>
          <p className="text-sm">{config.description}</p>
        </div>
      </div>

      {/* Optional badge */}
      {showBadge && (
        <div className="absolute top-2 right-2">
          <Badge variant={config.badgeVariant} className="pointer-events-none">
            {config.badgeText}
          </Badge>
        </div>
      )}
    </div>
  );
};

// Hook to get stock status styling
export const useStockStatusStyle = (stockStatus: StockStatus) => {
  const styles = {
    available: {
      badge: {
        variant: "secondary" as const,
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
        text: "Tersedia",
      },
      button: {
        disabled: false,
        className: "",
      },
      card: {
        className: "",
      },
    },
    "sold-out": {
      badge: {
        variant: "destructive" as const,
        className: "",
        text: "Stok Habis",
      },
      button: {
        disabled: true,
        className: "opacity-50 cursor-not-allowed",
      },
      card: {
        className: "opacity-75",
      },
    },
    "coming-soon": {
      badge: {
        variant: "secondary" as const,
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
        text: "Segera Hadir",
      },
      button: {
        disabled: true,
        className: "opacity-50 cursor-not-allowed",
      },
      card: {
        className: "opacity-75",
      },
    },
  };

  return styles[stockStatus];
};

export default ProductAvailabilityOverlay;

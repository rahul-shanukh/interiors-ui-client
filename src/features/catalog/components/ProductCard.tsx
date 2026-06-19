import React from "react";

// Define the shape based on your GraphQL Schema
export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category?: {
    id?: string;
    name: string;
  };
  images?: {
    url: string;
    alt?: string;
  }[];
}

interface ProductProps {
  product: Product;
}

export const ProductCard = React.memo(({ product }: ProductProps) => {
  // Grab the first Cloudflare image, or show a fallback if none exist yet
  const displayImage =
    product.images?.[0]?.url ||
    "https://via.placeholder.com/400x300?text=No+Image";
  const altText = product.images?.[0]?.alt || product.name;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
      <div className="w-full bg-gray-100">
        <img
          src={displayImage}
          alt={altText}
          className="object-cover w-full h-56"
          loading="lazy" // Native browser lazy loading for performance
        />
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          {product.category?.name || "Uncategorized"}
        </p>
        <h3 className="text-lg font-bold text-gray-900 truncate">
          {product.name}
        </h3>
        <p className="text-xl text-gray-800 mt-2">
          ${product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
});

// Required for React.memo debugging
ProductCard.displayName = "ProductCard";

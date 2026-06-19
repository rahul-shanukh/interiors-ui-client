import { useCatalog } from "../hooks/useCatalog";
import { ProductCard } from "./ProductCard";

export const ProductGrid = () => {
  // The "Muscle" hook pulling data from NestJS and Zustand!
  const { products, isLoading, error } = useCatalog();

  // 1. Handle the Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading JC Interiors Catalog...
        </p>
      </div>
    );
  }

  // 2. Handle API Errors
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md w-full border border-red-200">
        <p className="font-semibold">Failed to load catalog.</p>
        <p className="text-sm">
          Please check if your NestJS server is running.
        </p>
      </div>
    );
  }

  // 3. Handle Empty Search Results
  if (!products || products.length === 0) {
    return (
      <div className="text-center p-12 bg-gray-50 rounded-lg w-full border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
        <p className="text-gray-500 mt-1">Try adjusting your search filters.</p>
      </div>
    );
  }

  // 4. Render the Data
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

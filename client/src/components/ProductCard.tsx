import { FC, useState } from "react";
import { Heart } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
}

const ProductCard: FC<ProductCardProps> = ({ product, isSelected, onSelect }) => {
  // Query to check if product is in favorites
  const { data: favorites = [] } = useQuery<Product[]>({
    queryKey: ["/api/favorites"],
  });
  
  const isFavorite = favorites.some(fav => fav.id === product.id);
  
  // Add to favorites mutation
  const addFavoriteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/favorites", { productId: product.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    }
  });
  
  // Remove from favorites mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/favorites/${product.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    }
  });
  
  // Toggle favorite
  const handleToggleFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (isFavorite) {
      removeFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };
  
  return (
    <div 
      className={cn(
        "product-card bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      onClick={onSelect}
    >
      <div className="relative aspect-square bg-gray-50">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <button 
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded-full"
          onClick={handleToggleFavorite}
        >
          <Heart 
            className={cn(
              "h-4 w-4",
              isFavorite 
                ? "text-primary fill-primary" 
                : "text-gray-700"
            )} 
          />
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm">{product.name}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="font-semibold">${product.price.toFixed(2)}</span>
          <div className="text-xs text-gray-500 flex items-center">
            <svg className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

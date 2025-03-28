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
        "product-card bg-white rounded-2xl overflow-hidden transition-all duration-300",
        "border border-purple-100 hover:border-purple-200 shadow-sm hover:shadow-md",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      onClick={onSelect}
    >
      <div className="relative aspect-square bg-gradient-to-br from-purple-50 to-indigo-50 p-0.5">
        {/* Image container with subtle border radius */}
        <div className="rounded-xl overflow-hidden h-full">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        {/* Favorite button */}
        <button 
          className={cn(
            "absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-sm transition-all",
            isFavorite 
              ? "bg-pink-100/80 shadow-inner" 
              : "bg-white/80 hover:bg-pink-50/80"
          )}
          onClick={handleToggleFavorite}
        >
          <Heart 
            className={cn(
              "h-4 w-4",
              isFavorite 
                ? "text-pink-500 fill-pink-500" 
                : "text-gray-700"
            )} 
          />
        </button>
        
        {/* Price tag in bottom left */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
          <span className="text-sm font-medium text-primary">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-medium text-sm text-gray-800">{product.name}</h3>
          <div className="text-xs bg-yellow-100 text-yellow-700 rounded-full px-1.5 py-0.5 flex items-center">
            <svg className="w-3 h-3 text-yellow-500 mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span className="font-semibold">{product.rating ? product.rating.toFixed(1) : "4.5"}</span>
          </div>
        </div>
        
        {/* Product description/teaser */}
        <p className="text-xs text-gray-500 line-clamp-1">
          {product.description || "Premium quality, trendy design"}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;

import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, EyeIcon, Loader2 } from "lucide-react";
import type { Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Favorites() {
  const { toast } = useToast();
  
  // Query favorites
  const { data: favorites, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/favorites"],
  });

  // Remove from favorites mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest("DELETE", `/api/favorites/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Removed from favorites",
        description: "Product has been removed from your favorites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      });
    },
  });

  const handleRemoveFavorite = (productId: number) => {
    removeFavoriteMutation.mutate(productId);
  };

  return (
    <div className="flex flex-col h-full pb-16">
      <Header title="Favorites" />
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Your Favorites</h1>
          <p className="text-gray-600">Shoes you've saved for later</p>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-gray-500">Loading your favorites...</p>
          </div>
        ) : favorites?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-6 max-w-xs">
              Save your favorite shoes to try them on later
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">
                Explore Shoes
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {favorites?.map((product) => (
              <Card key={product.id} className="rounded-xl overflow-hidden">
                <div className="relative h-40 bg-gray-100">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <button 
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded-full"
                    onClick={() => handleRemoveFavorite(product.id)}
                  >
                    <Heart className="h-4 w-4 text-primary fill-primary" />
                  </button>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm">{product.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-semibold">${product.price.toFixed(2)}</span>
                    <Link href="/">
                      <Button size="sm" variant="ghost" className="text-xs p-1 h-auto">
                        <EyeIcon className="h-3 w-3 mr-1" /> Try On
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

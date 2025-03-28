import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Compass, 
  ArrowRight,
  ShoppingBag
} from "lucide-react";
import type { Product } from "@shared/schema";
import { Link } from "wouter";

export default function Explore() {
  // Query all products
  const { data: products, isLoading } = useQuery<Product[]>({ 
    queryKey: ["/api/products"],
  });

  return (
    <div className="flex flex-col h-full pb-16">
      <Header title="Explore" />
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Discover</h1>
          <p className="text-gray-600">Explore our latest collection of shoes</p>
        </div>
        
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary/20 to-secondary/20 border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Try On Experience</h2>
                  <p className="text-sm text-gray-700 mb-4">
                    Try on shoes virtually with our AR technology
                  </p>
                  <Link href="/">
                    <Button className="bg-primary hover:bg-primary/90">
                      Try Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="bg-white/30 p-4 rounded-full">
                  <Compass className="h-12 w-12 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Featured Collection</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <Card key={index} className="rounded-xl overflow-hidden">
                <div className="h-40 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            products?.slice(0, 4).map((product) => (
              <Card key={product.id} className="rounded-xl overflow-hidden">
                <div className="relative h-40 bg-gray-100">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm">{product.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-semibold">${product.price.toFixed(2)}</span>
                    <div className="text-xs text-gray-500 flex items-center">
                      <ShoppingBag className="h-3 w-3 mr-1" />
                      <Link href="/">
                        <span className="text-primary cursor-pointer">Try On</span>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

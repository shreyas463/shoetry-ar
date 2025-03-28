import { FC, useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useProductSheet } from "@/hooks/use-product-sheet";
import type { Product, Category } from "@shared/schema";

interface ProductSheetProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
}

const ProductSheet: FC<ProductSheetProps> = ({ 
  products, 
  selectedProduct, 
  onSelectProduct 
}) => {
  // Ref for the sheet
  const sheetRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  
  // Categories query
  const { data: categories } = useQuery<Category[]>({ 
    queryKey: ["/api/categories"],
  });
  
  // State for selected category
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  
  // Use product sheet drag logic
  const { isExpanded, startDrag, expandSheet, collapseSheet } = useProductSheet(sheetRef);
  
  // Filtered products
  const filteredProducts = selectedCategoryId 
    ? products.filter(product => product.categoryId === selectedCategoryId)
    : products;
  
  // Handle category selection
  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId === selectedCategoryId ? null : categoryId);
  };
  
  // Handle buy now button
  const handleBuyNow = () => {
    if (selectedProduct) {
      alert(`Buy ${selectedProduct.name} for $${selectedProduct.price}`);
    }
  };
  
  return (
    <div 
      ref={sheetRef}
      className={`product-sheet fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg z-30 h-[85vh] transition-transform ${isExpanded ? 'expanded' : 'collapsed'}`}
      style={{
        transform: isExpanded ? "translateY(0)" : "translateY(calc(100% - 9rem))"
      }}
    >
      {/* Handle for dragging sheet up/down */}
      <div 
        ref={handleRef}
        className="flex justify-center py-2 cursor-grab"
        onPointerDown={startDrag}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
      </div>
      
      {/* Product sheet header with current selections */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          {selectedProduct ? (
            <>
              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden mr-3">
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{selectedProduct.name}</h3>
                <span className="text-sm text-gray-600">${selectedProduct.price.toFixed(2)}</span>
              </div>
            </>
          ) : (
            <div>
              <h3 className="font-medium">Select a Product</h3>
              <span className="text-sm text-gray-600">Choose from our collection</span>
            </div>
          )}
        </div>
        <Button 
          className="bg-primary text-white py-2 px-5 rounded-full text-sm font-medium"
          onClick={handleBuyNow}
          disabled={!selectedProduct}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Buy Now
        </Button>
      </div>
      
      {/* View All Products button (only shown when collapsed) */}
      {!isExpanded && (
        <div className="px-4 py-2 flex justify-center">
          <Button
            variant="default"
            className="w-full py-2 text-sm font-medium rounded-full bg-primary text-white"
            onClick={expandSheet}
          >
            View All Products
          </Button>
        </div>
      )}
      
      {/* Product categories */}
      <div className="px-4 pt-4 overflow-x-auto whitespace-nowrap pb-2 flex space-x-2">
        {categories?.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategoryId === category.id ? "default" : "secondary"}
            className={`py-2 px-4 text-sm font-medium rounded-full ${
              selectedCategoryId === category.id 
                ? "bg-primary text-white" 
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      
      {/* Products grid */}
      <div className="p-4 overflow-y-auto h-[calc(85vh-10rem)]">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedProduct?.id === product.id}
              onSelect={() => onSelectProduct(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSheet;

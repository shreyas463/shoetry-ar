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
      className={`product-sheet fixed bottom-0 left-0 right-0 bg-[#1A2640]/90 backdrop-blur-md rounded-t-3xl shadow-xl z-30 h-[85vh] transition-transform ${isExpanded ? 'expanded' : 'collapsed'}`}
      style={{
        transform: isExpanded ? "translateY(0)" : "translateY(calc(100% - 9rem))"
      }}
    >
      {/* Glass morphism decorative element */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#3B5BA5]/30 to-transparent rounded-t-3xl z-0 pointer-events-none"></div>
    
      {/* Handle for dragging sheet up/down */}
      <div 
        ref={handleRef}
        className="flex justify-center py-3 cursor-grab relative z-10"
        onPointerDown={startDrag}
      >
        <div className="w-12 h-1.5 bg-[#F3B941] rounded-full opacity-80"></div>
      </div>
      
      {/* Product sheet header with current selections */}
      <div className="px-6 py-4 border-b border-[#3B5BA5]/30 flex items-center justify-between relative z-10">
        <div className="flex items-center">
          {selectedProduct ? (
            <>
              <div className="w-14 h-14 bg-gradient-to-br from-[#3B5BA5]/50 to-[#E87A5D]/30 rounded-xl overflow-hidden mr-3 shadow-sm p-0.5">
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-100">{selectedProduct.name}</h3>
                <span className="text-sm font-medium text-[#F3B941]">${selectedProduct.price.toFixed(2)}</span>
              </div>
            </>
          ) : (
            <div>
              <h3 className="font-semibold text-gray-100">Find Your Style</h3>
              <span className="text-sm text-[#E87A5D]/80">Explore our collection</span>
            </div>
          )}
        </div>
        <Button 
          className="bg-gradient-to-r from-[#E87A5D] to-[#F3B941] text-white py-2 px-5 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all"
          onClick={handleBuyNow}
          disabled={!selectedProduct}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Buy Now
        </Button>
      </div>
      
      {/* View All Products button (only shown when collapsed) */}
      {!isExpanded && (
        <div className="px-5 py-3 flex justify-center relative z-10">
          <Button
            variant="default"
            className="w-full py-2.5 text-sm font-medium rounded-full bg-gradient-to-r from-[#3B5BA5] to-[#2A4A9F] text-white shadow-md hover:shadow-lg transition-all"
            onClick={expandSheet}
          >
            Explore All Styles
          </Button>
        </div>
      )}
      
      {/* Product categories */}
      <div className="px-5 pt-5 overflow-x-auto whitespace-nowrap pb-3 flex space-x-2 relative z-10">
        <div className="pr-1 flex space-x-2">
          {categories?.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              className={`py-2 px-4 text-sm font-medium rounded-full transition-all ${
                selectedCategoryId === category.id 
                  ? "bg-gradient-to-r from-[#E87A5D] to-[#F3B941] text-white border-0 shadow-md" 
                  : "bg-[#1A3056]/50 backdrop-blur-sm text-gray-200 border border-[#3B5BA5]/30 hover:border-[#3B5BA5]/50"
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Products grid */}
      <div className="px-5 pt-2 pb-5 overflow-y-auto h-[calc(85vh-11rem)] relative z-10">
        <h3 className="text-lg font-semibold mb-3 text-gray-100">
          {selectedCategoryId 
            ? `${categories?.find(c => c.id === selectedCategoryId)?.name} Collection` 
            : 'Featured Styles'}
        </h3>
        <div className="grid grid-cols-2 gap-5">
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

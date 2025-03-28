import { FC } from "react";
import { X, Share, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Product } from "@shared/schema";

interface SuccessModalProps {
  isOpen: boolean;
  capturedImage: string | null;
  selectedProduct: Product | null;
  onClose: () => void;
}

const SuccessModal: FC<SuccessModalProps> = ({ 
  isOpen, 
  capturedImage, 
  selectedProduct,
  onClose 
}) => {
  const handleShare = async () => {
    if (capturedImage && navigator.share) {
      try {
        const blob = await fetch(capturedImage).then(r => r.blob());
        const file = new File([blob], "shoear-tryon.jpg", { type: "image/jpeg" });
        
        await navigator.share({
          title: `Check out these ${selectedProduct?.name || "shoes"} I tried on virtually!`,
          text: "Virtual try-on with ShoeAR",
          files: [file]
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing is not supported on this browser");
    }
  };
  
  const handleBuyNow = () => {
    if (selectedProduct) {
      alert(`Buy ${selectedProduct.name} for $${selectedProduct.price}`);
    }
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-2xl m-6 p-6 max-w-md w-full">
        <DialogHeader className="flex justify-between items-start mb-4">
          <DialogTitle className="text-xl font-semibold">Looking Good!</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-600 h-auto p-0"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        
        <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4">
          {capturedImage && (
            <img
              src={capturedImage}
              alt="Your virtual try-on"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <DialogFooter className="flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1 border border-gray-300 py-3 rounded-xl font-medium"
            onClick={handleShare}
          >
            <Share className="h-4 w-4 mr-2" /> Share
          </Button>
          
          <Button 
            className="flex-1 bg-primary text-white py-3 rounded-xl font-medium"
            onClick={handleBuyNow}
          >
            <ShoppingCart className="h-4 w-4 mr-2" /> Buy Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;

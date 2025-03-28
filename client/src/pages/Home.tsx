import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import ARViewer from "@/components/ARViewer";
import ProductSheet from "@/components/ProductSheet";
import HelpModal from "@/components/HelpModal";
import SuccessModal from "@/components/SuccessModal";
import type { Product } from "@shared/schema";

export default function Home() {
  // State for help modal
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  
  // State for success modal
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // State for AR viewer
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Query products
  const { data: products } = useQuery({ 
    queryKey: ["/api/products"],
  });

  // Function to capture photo
  const handleCapturePhoto = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setIsSuccessModalOpen(true);
  };

  // Function to show help modal
  const handleShowHelp = () => {
    setIsHelpModalOpen(true);
  };

  // Function to select product
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  // Function for camera permission
  const handleCameraPermission = (granted: boolean) => {
    setHasCameraPermission(granted);
  };

  return (
    <div className="flex flex-col h-screen w-full relative">
      <Header onShowHelp={handleShowHelp} />
      
      <ARViewer 
        selectedProduct={selectedProduct}
        onCameraPermission={handleCameraPermission}
        onCapturePhoto={handleCapturePhoto}
      />
      
      <ProductSheet 
        products={products || []}
        selectedProduct={selectedProduct}
        onSelectProduct={handleSelectProduct}
      />
      
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
      
      <SuccessModal
        isOpen={isSuccessModalOpen}
        capturedImage={capturedImage}
        onClose={() => setIsSuccessModalOpen(false)}
        selectedProduct={selectedProduct}
      />
    </div>
  );
}

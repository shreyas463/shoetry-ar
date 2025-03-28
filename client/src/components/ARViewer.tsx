import { FC, useState, useRef, useEffect } from "react";
import { Camera, RefreshCw, Flashlight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCamera } from "@/hooks/use-camera";
import { useAR } from "@/hooks/use-ar";
import type { Product } from "@shared/schema";

interface ARViewerProps {
  selectedProduct: Product | null;
  onCameraPermission: (granted: boolean) => void;
  onCapturePhoto: (imageSrc: string) => void;
}

const ARViewer: FC<ARViewerProps> = ({ 
  selectedProduct,
  onCameraPermission, 
  onCapturePhoto 
}) => {
  // Reference to video and canvas elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Camera state
  const {
    hasPermission,
    isLoading,
    isFrontCamera,
    isTorchOn,
    requestPermission,
    toggleCamera,
    toggleTorch,
    capturePhoto
  } = useCamera(videoRef, canvasRef);
  
  // AR state
  const { initAR, updateARModel } = useAR(containerRef, videoRef);
  
  // Effect to notify parent of camera permission
  useEffect(() => {
    onCameraPermission(hasPermission);
  }, [hasPermission, onCameraPermission]);
  
  // Effect to initialize AR when camera is ready
  useEffect(() => {
    if (hasPermission && videoRef.current && containerRef.current) {
      initAR();
    }
  }, [hasPermission, initAR]);
  
  // Effect to update AR model when product changes
  useEffect(() => {
    if (selectedProduct) {
      updateARModel(selectedProduct.modelUrl);
    }
  }, [selectedProduct, updateARModel]);
  
  // Handle capture button click
  const handleCaptureClick = async () => {
    const imageSrc = await capturePhoto();
    if (imageSrc) {
      onCapturePhoto(imageSrc);
    }
  };
  
  return (
    <div className="relative flex-1 overflow-hidden" ref={containerRef}>
      {/* Camera permission waiting state */}
      {!hasPermission && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 bg-white">
          <div className="mb-6 bg-primary/10 p-8 rounded-full">
            <Camera className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-center">Camera Access Required</h2>
          <p className="text-gray-600 text-center mb-6">
            To try on shoes virtually, we need access to your camera.
          </p>
          <Button 
            className="bg-primary text-white font-medium py-3 px-8 rounded-full shadow-md"
            onClick={requestPermission}
            disabled={isLoading}
          >
            {isLoading ? "Requesting..." : "Enable Camera"}
          </Button>
        </div>
      )}
      
      {/* Camera/AR view */}
      <div className={`absolute inset-0 bg-black ${hasPermission ? "" : "hidden"}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* AR positioning guides */}
        {hasPermission && selectedProduct && (
          <div className="ar-guide absolute bottom-1/4 left-1/2 transform -translate-x-1/2 border-2 border-white border-dashed rounded-full w-40 h-16 opacity-60" />
        )}
        
        {/* Camera controls overlay */}
        {hasPermission && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-4">
            <Button 
              className="bg-white/80 backdrop-blur-md p-4 rounded-full shadow-lg" 
              onClick={toggleCamera}
              variant="ghost"
              size="icon"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
            
            <Button 
              className="bg-white/80 backdrop-blur-md p-5 rounded-full shadow-lg" 
              onClick={handleCaptureClick}
              variant="ghost"
              size="icon"
            >
              <Camera className="h-6 w-6" />
            </Button>
            
            <Button 
              className="bg-white/80 backdrop-blur-md p-4 rounded-full shadow-lg" 
              onClick={toggleTorch}
              variant="ghost"
              size="icon"
              disabled={isFrontCamera}
            >
              <Flashlight className={`h-5 w-5 ${isTorchOn ? "text-yellow-500" : ""}`} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ARViewer;

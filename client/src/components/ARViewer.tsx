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
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 bg-gradient-to-b from-[#1A2640] to-[#1A3056]">
          {/* Floating shapes in background */}
          <div className="absolute top-1/4 left-1/4 w-24 h-24 rounded-full bg-gradient-to-br from-[#3B5BA5]/30 to-[#E87A5D]/30 blur-3xl opacity-30"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-[#E87A5D]/30 to-[#F3B941]/30 blur-3xl opacity-30"></div>
          
          <div className="relative z-10 flex flex-col items-center max-w-sm">
            <div className="mb-6 bg-gradient-to-br from-[#3B5BA5] to-[#E87A5D] p-6 rounded-full shadow-lg">
              <Camera className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#E87A5D] to-[#F3B941]">
              Camera Access Needed
            </h2>
            <p className="text-[#E87A5D]/80 text-center mb-8 text-lg">
              To try on shoes virtually in AR, we need your camera permission.
            </p>
            <Button 
              className="bg-gradient-to-r from-[#3B5BA5] to-[#E87A5D] text-white font-medium py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
              onClick={requestPermission}
              disabled={isLoading}
            >
              {isLoading ? 
                "Requesting..." : 
                <span className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Enable Camera
                </span>
              }
            </Button>
          </div>
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
          <div className="ar-guide absolute bottom-1/4 left-1/2 transform -translate-x-1/2 border-2 border-[#F3B941] border-dashed rounded-full w-40 h-16 opacity-60 shadow-lg">
            {/* Animated positioning indicator */}
            <div className="absolute inset-0 rounded-full border-2 border-[#E87A5D] animate-pulse"></div>
          </div>
        )}
        
        {/* Camera controls overlay */}
        {hasPermission && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-6">
            {/* Switch camera button */}
            <Button 
              className="bg-[#1A3056]/90 backdrop-blur-md p-4 rounded-full shadow-lg hover:bg-[#3B5BA5]/60 border border-[#3B5BA5]/30" 
              onClick={toggleCamera}
              variant="ghost"
              size="icon"
            >
              <RefreshCw className="h-5 w-5 text-[#F3B941]" />
            </Button>
            
            {/* Capture button */}
            <Button 
              className="bg-gradient-to-r from-[#3B5BA5] to-[#E87A5D] p-6 rounded-full shadow-lg hover:shadow-xl border-4 border-[#1A3056]" 
              onClick={handleCaptureClick}
              variant="default"
              size="icon"
            >
              <Camera className="h-7 w-7 text-white" />
            </Button>
            
            {/* Torch button */}
            <Button 
              className={`backdrop-blur-md p-4 rounded-full shadow-lg border ${isTorchOn ? 'bg-[#F3B941]/90 border-[#F3B941]/20' : 'bg-[#1A3056]/90 border-[#3B5BA5]/30 hover:bg-[#3B5BA5]/60'}`}
              onClick={toggleTorch}
              variant="ghost"
              size="icon"
              disabled={isFrontCamera}
            >
              <Flashlight className={`h-5 w-5 ${isTorchOn ? "text-[#1A3056]" : "text-[#F3B941]"}`} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ARViewer;

import { useState, useEffect, useCallback, RefObject } from "react";
import { initThree, loadModel, positionModel } from "@/lib/ar-utils";
import { checkWebXRSupport } from "@/lib/webxr-utils";

export function useAR(
  containerRef: RefObject<HTMLDivElement>,
  videoRef: RefObject<HTMLVideoElement>
) {
  const [isARSupported, setIsARSupported] = useState(false);
  const [isARInitialized, setIsARInitialized] = useState(false);
  const [currentModelUrl, setCurrentModelUrl] = useState<string | null>(null);
  
  // Check if WebXR is supported
  useEffect(() => {
    const checkSupport = async () => {
      const supported = await checkWebXRSupport();
      setIsARSupported(supported);
    };
    
    checkSupport();
  }, []);
  
  // Initialize AR
  const initAR = useCallback(() => {
    if (containerRef.current && videoRef.current) {
      try {
        initThree(containerRef.current, videoRef.current);
        setIsARInitialized(true);
      } catch (error) {
        console.error("Error initializing AR:", error);
      }
    }
  }, [containerRef, videoRef]);
  
  // Update AR model
  const updateARModel = useCallback((modelUrl: string) => {
    if (!isARInitialized) return;
    
    if (modelUrl !== currentModelUrl) {
      try {
        loadModel(modelUrl);
        setCurrentModelUrl(modelUrl);
      } catch (error) {
        console.error("Error loading 3D model:", error);
      }
    }
    
    // Position model on video feed
    positionModel();
  }, [isARInitialized, currentModelUrl]);
  
  return {
    isARSupported,
    isARInitialized,
    initAR,
    updateARModel
  };
}

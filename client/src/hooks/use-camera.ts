import { useState, useEffect, useRef, useCallback, RefObject } from "react";

export function useCamera(
  videoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>
) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  
  const streamRef = useRef<MediaStream | null>(null);
  
  // Start the camera
  const startCamera = useCallback(async (useFrontCamera = false) => {
    try {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: useFrontCamera ? "user" : "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasPermission(true);
        setIsFrontCamera(useFrontCamera);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  }, [videoRef]);
  
  // Request camera permission
  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    await startCamera(false);
  }, [startCamera]);
  
  // Toggle between front and back camera
  const toggleCamera = useCallback(() => {
    startCamera(!isFrontCamera);
  }, [isFrontCamera, startCamera]);
  
  // Toggle torch/flashlight
  const toggleTorch = useCallback(async () => {
    if (streamRef.current && !isFrontCamera) {
      try {
        const track = streamRef.current.getVideoTracks()[0];
        
        if (track.getCapabilities && track.getCapabilities().torch) {
          await track.applyConstraints({
            advanced: [{ torch: !isTorchOn }]
          });
          setIsTorchOn(!isTorchOn);
        } else {
          console.log("Torch not supported on this device");
        }
      } catch (error) {
        console.error("Error toggling torch:", error);
      }
    }
  }, [isFrontCamera, isTorchOn]);
  
  // Capture photo from video
  const capturePhoto = useCallback(async (): Promise<string | null> => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg");
      }
    }
    
    return null;
  }, [videoRef, canvasRef]);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);
  
  return {
    hasPermission,
    isLoading,
    isFrontCamera,
    isTorchOn,
    requestPermission,
    toggleCamera,
    toggleTorch,
    capturePhoto
  };
}

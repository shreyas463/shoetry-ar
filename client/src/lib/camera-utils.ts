// Helper function to get device orientation
export function getDeviceOrientation(): 'portrait' | 'landscape' {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

// Helper function to get camera constraints based on orientation
export function getCameraConstraints(useFrontCamera: boolean): MediaStreamConstraints {
  const orientation = getDeviceOrientation();
  
  return {
    video: {
      facingMode: useFrontCamera ? 'user' : 'environment',
      width: { ideal: orientation === 'landscape' ? 1280 : 720 },
      height: { ideal: orientation === 'landscape' ? 720 : 1280 }
    },
    audio: false
  };
}

// Check if device supports camera
export async function checkCameraSupport(): Promise<boolean> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return false;
  }
  
  try {
    // Try to get camera access
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // Release the camera immediately
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    return false;
  }
}

// Check if device supports torch/flashlight
export async function checkTorchSupport(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    
    const track = stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();
    
    // Clean up
    stream.getTracks().forEach(track => track.stop());
    
    return capabilities?.torch || false;
  } catch (error) {
    return false;
  }
}

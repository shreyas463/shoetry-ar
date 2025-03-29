import { ViroMaterials, ViroAnimations } from '@viro-community/react-viro';
import { Product } from '../types/schema';

// Initialize materials based on product colors
export const initializeProductMaterials = (product: Product) => {
  // Extract color from product or use default brand color
  const primaryColor = extractProductColor(product) || '#3B5BA5'; // Prussian blue default
  const secondaryColor = getComplementaryColor(primaryColor);
  
  ViroMaterials.createMaterials({
    primaryProductMaterial: {
      lightingModel: 'PBR',
      diffuseColor: primaryColor,
      metalness: 0.3,
      roughness: 0.6,
    },
    secondaryProductMaterial: {
      lightingModel: 'PBR',
      diffuseColor: secondaryColor,
      metalness: 0.2,
      roughness: 0.7,
    },
    soleMaterial: {
      lightingModel: 'PBR',
      diffuseColor: '#303030',
      metalness: 0.1,
      roughness: 0.9,
    },
    lacesMaterial: {
      lightingModel: 'PBR',
      diffuseColor: '#FFFFFF',
      metalness: 0.1,
      roughness: 0.8,
    },
    glowMaterial: {
      lightingModel: 'PBR',
      diffuseColor: primaryColor,
      metalness: 0.7,
      roughness: 0.3,
    }
  });

  return {
    primaryColor,
    secondaryColor
  };
};

// Register animations that can be applied to the 3D models
export const registerARAnimations = () => {
  ViroAnimations.registerAnimations({
    // Basic rotation animation
    rotate: {
      properties: {
        rotateY: '+=45'
      },
      duration: 1000,
    },
    
    // Floating effect
    hover: {
      properties: {
        positionY: '+=0.05',
      },
      easing: 'EaseInEaseOut',
      duration: 1000,
    },
    hoverDown: {
      properties: {
        positionY: '-=0.05',
      },
      easing: 'EaseInEaseOut',
      duration: 1000,
    },
    
    // Scale animation for emphasis
    scaleUp: {
      properties: {
        scaleX: '+=0.05',
        scaleY: '+=0.05',
        scaleZ: '+=0.05',
      },
      easing: 'EaseInEaseOut',
      duration: 800,
    },
    scaleDown: {
      properties: {
        scaleX: '-=0.05',
        scaleY: '-=0.05',
        scaleZ: '-=0.05',
      },
      easing: 'EaseInEaseOut',
      duration: 800,
    },
    
    // Material change animation
    glowEffect: {
      properties: {
        material: ['primaryProductMaterial', 'glowMaterial'],
      },
      easing: 'EaseIn',
      duration: 500,
    },
    normalEffect: {
      properties: {
        material: ['glowMaterial', 'primaryProductMaterial'],
      },
      easing: 'EaseOut',
      duration: 500,
    },
    
    // Combined animations
    pulseAndGlow: [
      ['scaleUp', 'glowEffect'],
      ['scaleDown', 'normalEffect']
    ],
    
    floatAndRotate: [
      ['hover', 'rotate'],
      ['hoverDown', 'rotate'],
    ],
    
    // Showcase animation sequence
    showcase: [
      ['rotate'],
      ['glowEffect', 'scaleUp'],
      ['normalEffect', 'scaleDown'],
      ['hover'],
      ['hoverDown'],
    ],
  });
};

// Detect foot position using image recognition or depth sensing
// This is a placeholder function - in a real implementation, this would use
// ARKit/ARCore's image recognition or depth sensing capabilities
export const detectFootPosition = () => {
  // In a real implementation, this would return coordinates
  // where the foot is detected in the AR scene
  return {
    position: [0, -1, -0.5],
    rotation: [0, 0, 0],
    detected: true
  };
};

// Apply dynamically generated texture to 3D model
// This would allow for custom shoe colorways based on user selection
export const applyCustomTexture = (productId: number, colorway: string) => {
  // In a real implementation, this would generate or select
  // a texture based on the productId and colorway selection
  const textureName = `texture_${productId}_${colorway}`;
  
  return {
    textureName,
    applied: true
  };
};

// Track foot movement to ensure the shoe model stays positioned correctly
export const trackFootMovement = (initialPosition: number[]) => {
  // In a real implementation, this would use motion tracking
  // to update the position of the 3D model as the foot moves
  return {
    updatedPosition: initialPosition,
    tracking: true
  };
};

// Capture AR scene as an image to share
export const captureARScene = () => {
  // In a real implementation, this would capture the current
  // AR scene and return an image URI
  return {
    captureSuccess: true,
    imageUri: 'ar_capture_placeholder.jpg'
  };
};

// Helper function to extract color from product data
function extractProductColor(product: Product): string | null {
  // In a real implementation, this would extract color information
  // from the product data. For now, we'll just return null
  // to use the default color.
  return null;
}

// Helper function to generate a complementary color
function getComplementaryColor(color: string): string {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate complementary color
  const compR = 255 - r;
  const compG = 255 - g;
  const compB = 255 - b;
  
  // Convert back to hex
  return `#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`;
}

// Compute optimal placement for 3D model based on detected feet
export const computeOptimalPlacement = (footPositions: any, modelSize: number[]) => {
  // In a real implementation, this would use the detected foot positions
  // and model size to compute the optimal placement for the 3D model
  return {
    position: [0, -0.5, -0.5],
    rotation: [0, 0, 0],
    scale: [0.12, 0.12, 0.12]
  };
};

// Adjust lighting based on environment
export const adjustEnvironmentLighting = (sceneBrightness: number) => {
  // In a real implementation, this would adjust the lighting
  // in the AR scene based on the detected environment brightness
  return {
    ambientIntensity: Math.min(1000, sceneBrightness * 2000),
    shadowOpacity: Math.max(0.2, 1.0 - (sceneBrightness * 0.8))
  };
};

// Get model info for a product
export const getModelInfo = (product: Product) => {
  // In a real app, this would check if the product has a specific model
  // If not, it would return the default model
  return {
    modelUri: require('../assets/models/default_sneaker.glb'),
    sourceType: 'GLB',
    needsDefaultTexture: true
  };
};

export default {
  initializeProductMaterials,
  registerARAnimations,
  detectFootPosition,
  applyCustomTexture,
  trackFootMovement,
  captureARScene,
  computeOptimalPlacement,
  adjustEnvironmentLighting,
  getModelInfo
};
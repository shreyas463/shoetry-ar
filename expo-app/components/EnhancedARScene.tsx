import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ViroARScene,
  ViroAmbientLight,
  ViroSpotLight,
  ViroNode,
  Viro3DObject,
  ViroQuad,
  ViroARPlaneSelector,
  ViroARImageMarker,
  ViroARTrackingTargets,
  ViroMaterials,
  ViroAnimations,
  ViroConstants,
  ViroText
} from '@viro-community/react-viro';
import { Product } from '../types/schema';
import ARViroUtils from '../utils/viro-ar-utils';

interface EnhancedARSceneProps {
  product: Product;
  onPlaneDetected?: () => void;
  onAnchorFound?: () => void;
  onObjectPlaced?: () => void;
  onObjectInteraction?: (type: string) => void;
  onError?: (error: string) => void;
  activeEffect?: string | null;
  activeColorHex?: string;
}

// Register foot tracking marker
ViroARTrackingTargets.createTargets({
  footMarker: {
    source: require('../assets/foot_marker.png'),
    orientation: "Up",
    physicalWidth: 0.15 // 15cm marker size
  }
});

// Optimized with React.memo for better performance
const EnhancedARScene = React.memo(({
  product,
  onPlaneDetected,
  onAnchorFound,
  onObjectPlaced,
  onObjectInteraction,
  onError,
  activeEffect,
  activeColorHex = '#3B5BA5'
}: EnhancedARSceneProps) => {
  // State variables that trigger re-renders
  const [modelPlaced, setModelPlaced] = useState(false);
  const [footPosition, setFootPosition] = useState([0, -0.5, -0.5]);
  const [planeFound, setPlaneFound] = useState(false);
  const [markerFound, setMarkerFound] = useState(false);
  const [lightingEstimate, setLightingEstimate] = useState(1000);
  const [trackingNormal, setTrackingNormal] = useState([0, 1, 0]);
  const [text, setText] = useState('Initializing AR...');
  
  // Pre-calculate model info once for better performance
  const modelInfo = useMemo(() => ARViroUtils.getModelInfo(product), [product]);
  
  // Register custom product-based materials
  useEffect(() => {
    const materials = ARViroUtils.initializeProductMaterials(product);
    ARViroUtils.registerARAnimations();
    
    // Additional initialization here
    return () => {
      // Cleanup if needed
    };
  }, [product]);
  
  // Apply color changes when activeColorHex changes
  useEffect(() => {
    if (activeColorHex) {
      // Update material with new color
      ViroMaterials.createMaterials({
        primaryProductMaterial: {
          diffuseColor: activeColorHex,
          lightingModel: "Blinn",
        }
      });
    }
  }, [activeColorHex]);
  
  // Apply special effects when activeEffect changes
  useEffect(() => {
    if (activeEffect) {
      // Apply the selected effect
      switch (activeEffect) {
        case 'sparkle':
          // Add sparkle particles or effect properties
          setText('Sparkle effect applied');
          break;
        case 'neon':
          // Add neon glow effect
          ViroMaterials.createMaterials({
            primaryProductMaterial: {
              diffuseColor: activeColorHex,
              lightingModel: "Blinn",
              diffuseIntensity: 1.0,
              shininess: 2.0,
              fresnelExponent: 0.5,
            }
          });
          setText('Neon effect applied');
          break;
        case 'rainbow':
          // Create rainbow effect on the material
          setText('Rainbow effect applied');
          break;
        default:
          setText(`Effect "${activeEffect}" applied`);
      }
    }
  }, [activeEffect]);
  
  // Handle AR scene initialization
  const onInitialized = (state: string, reason: string) => {
    if (state === ViroConstants.TRACKING_NORMAL) {
      setText('Move the camera around to detect surfaces');
    } else if (state === ViroConstants.TRACKING_NONE) {
      setText('Tracking lost. Please scan the area');
    }
  };
  
  // Handle plane detection
  const onPlaneSelected = (anchor: any) => {
    setFootPosition(anchor.position);
    setTrackingNormal(anchor.normal);
    setModelPlaced(true);
    onObjectPlaced && onObjectPlaced();
  };
  
  // Handle foot marker detection
  const onMarkerFound = (marker: any) => {
    setMarkerFound(true);
    onAnchorFound && onAnchorFound();
  };
  
  // Handle model load completion
  const onModelLoad = () => {
    setText('Model loaded! Interact with it using gestures');
  };
  
  // Handle model loading error
  const onModelError = (event: any) => {
    setText('Failed to load model. Please try again.');
    onError && onError('Model loading failed: ' + event.nativeEvent.error);
  };
  
  // Handle environmental lighting changes
  const onLightEstimate = (estimate: { intensity: number }) => {
    setLightingEstimate(estimate.intensity);
  };
  
  // Handle drag gesture to reposition model
  const onDrag = (dragToPos: number[], source: any) => {
    // Keep height the same but update x and z
    setFootPosition([
      dragToPos[0],
      footPosition[1],
      dragToPos[2]
    ]);
  };
  
  // Object tap interaction
  const onTap = () => {
    onObjectInteraction && onObjectInteraction('tap');
  };
  
  return (
    <ViroARScene onTrackingUpdated={onInitialized} onLightEstimate={onLightEstimate}>
      {/* Primary ambient light */}
      <ViroAmbientLight color="#FFFFFF" intensity={lightingEstimate} />
      
      {/* Directional spotlight for shadows and highlights */}
      <ViroSpotLight
        innerAngle={5}
        outerAngle={25}
        direction={[0, -1, -0.2]}
        position={[0, 3, 1]}
        color="#FFFFFF"
        castsShadow={true}
        shadowMapSize={2048}
        shadowNearZ={2}
        shadowFarZ={7}
        shadowOpacity={0.7}
        intensity={lightingEstimate}
      />
      
      {/* AR Plane Selector for surface detection */}
      <ViroARPlaneSelector
        minHeight={0.1}
        minWidth={0.1}
        alignment="Horizontal"
        onPlaneSelected={onPlaneSelected}
        onAnchorFound={() => {
          setPlaneFound(true);
          onPlaneDetected && onPlaneDetected();
        }}
      >
        {/* 3D model attached to detected plane or foot marker */}
        {(planeFound || markerFound) && (
          <ViroNode position={footPosition} dragType="FixedToPlane" onDrag={onDrag}>
            {/* 3D Shoe Model */}
            <Viro3DObject
              source={modelInfo.modelUri}
              type={modelInfo.sourceType}
              position={[0, 0.08, 0]}
              scale={[0.12, 0.12, 0.12]}
              rotation={[0, 30, 0]}
              onLoadStart={() => setText('Loading 3D model...')}
              onLoadEnd={onModelLoad}
              onError={onModelError}
              animation={{
                name: modelPlaced ? 'showcase' : 'floatAndRotate',
                run: true,
                loop: true,
                interruptible: true,
              }}
              materials={['primaryProductMaterial', 'secondaryProductMaterial', 'soleMaterial']}
              physicsBody={{
                type: 'Dynamic',
                mass: 1,
                enabled: true,
              }}
              onClick={onTap}
              lightReceivingBitMask={1}
              shadowCastingBitMask={1}
            />
            
            {/* Shadow plane */}
            <ViroQuad
              position={[0, 0.001, 0]}
              rotation={[-90, 0, 0]}
              width={0.5}
              height={0.5}
              materials={['shadowMaterial']}
              arShadowReceiver={true}
            />
          </ViroNode>
        )}
      </ViroARPlaneSelector>
      
      {/* Foot marker detection */}
      <ViroARImageMarker
        target={"footMarker"}
        onAnchorFound={onMarkerFound}
      />
    </ViroARScene>
  );
};

// Define shadow material
ViroMaterials.createMaterials({
  shadowMaterial: {
    diffuseColor: "#00000022"
  },
});

export default EnhancedARScene;
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Share, Alert, Image } from 'react-native';
import {
  ViroARSceneNavigator,
  ViroMaterials,
  ViroAnimations,
  ViroUtils,
  ViroARTrackingTargets
} from '@viro-community/react-viro';
import { Product } from '../types/schema';
import EnhancedARScene from './EnhancedARScene';
import AREffectsPanel from './AREffectsPanel';
import ARViroUtils from '../utils/viro-ar-utils';

interface ViroARViewProps {
  product: Product;
  onBack: () => void;
}

// Register target images for tracking
const setupTrackingTargets = () => {
  // In a real app, we'd have actual images for tracking
  ViroARTrackingTargets.createTargets({
    footTarget: {
      source: require('../assets/foot_marker.png'),
      orientation: "Up",
      physicalWidth: 0.15 // real world width in meters
    }
  });
};

// Main component
const ViroARView = ({ product, onBack }: ViroARViewProps) => {
  const [arEnabled, setArEnabled] = useState(false);
  const [arState, setARState] = useState('Initializing');
  const [statusMessage, setStatusMessage] = useState('Getting ready...');
  const [showInstructions, setShowInstructions] = useState(true);
  const [modelPlaced, setModelPlaced] = useState(false);
  const [planeDetected, setPlaneDetected] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showFeatureHighlight, setShowFeatureHighlight] = useState(true);
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [activeColorHex, setActiveColorHex] = useState<string>('#3B5BA5');
  const arNavigatorRef = useRef(null);
  
  // Set up AR environment - optimized for faster initialization
  useEffect(() => {
    // Initialize AR tracking targets asynchronously
    setupTrackingTargets();
    
    // Enable AR immediately without artificial delay
    setArEnabled(true);
    
    // Show feature highlight tips for shorter time
    const highlightTimer = setTimeout(() => {
      setShowFeatureHighlight(false);
    }, 3000);
    
    return () => {
      clearTimeout(highlightTimer);
    };
  }, []);

  // Handle AR scene initialization
  const handleARInitialized = (state: string) => {
    setARState(state);
    switch(state) {
      case 'TRACKING_NORMAL':
        setStatusMessage('Move camera around to detect surfaces');
        break;
      case 'TRACKING_LIMITED':
        setStatusMessage('Limited tracking, move slower');
        break;
      case 'TRACKING_NONE':
        setStatusMessage('Cannot track position, insufficient features');
        break;
      default:
        setStatusMessage('Initializing AR...');
    }
  };

  // Handle plane detection
  const handlePlaneDetected = () => {
    setPlaneDetected(true);
    setStatusMessage('Surface detected! Tap to place shoe');
  };

  // Handle model placement
  const handleObjectPlaced = () => {
    setModelPlaced(true);
    setStatusMessage('Shoe placed! Drag to reposition');
    setShowInstructions(false);
  };

  // Handle object interactions
  const handleObjectInteraction = (type: string) => {
    if (type === 'tap') {
      setStatusMessage('Try different gestures: pinch to scale, twist to rotate');
    }
  };

  // Handle errors
  const handleARError = (error: string) => {
    console.error('AR Error:', error);
    Alert.alert('AR Error', 'There was a problem with the AR experience: ' + error);
  };

  // Take a screenshot of the AR experience
  const captureARScreen = async () => {
    try {
      setStatusMessage('Capturing image...');
      
      // In a real implementation, we would use the ViroARSceneNavigator's
      // screenshot function to capture the current AR view
      // For now, we'll just simulate this with a timeout
      setTimeout(() => {
        // This would be the URI of the captured image
        const fakeImageUri = 'captured_ar_image.jpg';
        setCapturedImage(fakeImageUri);
        
        // Show success message
        setStatusMessage('Image captured!');
        
        // In a real app, we would show the captured image and offer
        // options to share or save it
        Alert.alert(
          'AR Capture Success',
          'Your virtual try-on has been captured!',
          [
            {
              text: 'Share',
              onPress: () => shareImage(fakeImageUri)
            },
            {
              text: 'Close',
              style: 'cancel'
            }
          ]
        );
      }, 1000);
    } catch (error) {
      console.error('Error capturing AR screen:', error);
      setStatusMessage('Failed to capture image');
    }
  };

  // Share captured image
  const shareImage = async (imageUri: string) => {
    try {
      await Share.share({
        title: `Check out my virtual try-on of ${product.name}!`,
        message: `I virtually tried on the ${product.name} using the ShoeTry AR app!`,
        url: imageUri
      });
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  // Reset AR scene
  const resetARScene = () => {
    setModelPlaced(false);
    setPlaneDetected(false);
    setShowInstructions(true);
    setStatusMessage('Looking for surfaces...');
    
    // In a real implementation, we would reset the AR scene
    // by calling a method on the ViroARSceneNavigator ref
    if (arNavigatorRef.current) {
      // Reset AR scene
    }
  };

  // Toggle AR instructions
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };
  
  // Toggle effects panel
  const toggleEffectsPanel = () => {
    setShowEffectsPanel(!showEffectsPanel);
  };
  
  // Handle effect selection with support for null values
  const handleEffectSelect = (effectName: string | null) => {
    // If null is passed directly, it means the effect was toggled off
    if (effectName === null) {
      setActiveEffect(null);
      setStatusMessage('Effect removed');
      return;
    }
    
    // If it's the same as current effect, toggle it off
    if (activeEffect === effectName) {
      setActiveEffect(null);
      setStatusMessage('Effect removed');
    } else {
      setActiveEffect(effectName);
      
      // Apply the effect to the AR scene - in a real implementation, this would
      // call a method on the AR scene to trigger the effect animation
      let effectDisplay = '';
      switch (effectName) {
        case 'sparkle':
          effectDisplay = '✨ Sparkle';
          break;
        case 'neon':
          effectDisplay = '💡 Neon Glow';
          break;
        case 'rainbow':
          effectDisplay = '🌈 Rainbow';
          break;
        case 'rotate_360':
          effectDisplay = '🔄 360° Rotation';
          break;
        default:
          effectDisplay = effectName;
      }
      
      setStatusMessage(`Applied effect: ${effectDisplay}`);
    }
    
    // The navigator will automatically update as we've passed activeEffect as a prop
  };
  
  // Handle color change
  const handleColorChange = (colorHex: string) => {
    setActiveColorHex(colorHex);
    
    // Apply the color to the AR model - in a real implementation, this would
    // update the material properties of the 3D model
    let colorName = '';
    switch (colorHex) {
      case '#3B5BA5':
        colorName = 'Prussian Blue';
        break;
      case '#E87A5D':
        colorName = 'Coral Orange';
        break;
      case '#F3B941':
        colorName = 'Mustard';
        break;
      case '#333333':
        colorName = 'Black';
        break;
      case '#FFFFFF':
        colorName = 'White';
        break;
      case '#4CAF50':
        colorName = 'Green';
        break;
      case '#9C27B0':
        colorName = 'Purple';
        break;
      default:
        colorName = colorHex;
    }
    
    setStatusMessage(`Changed color to ${colorName}`);
    
    // The navigator will automatically update as we've passed activeColorHex as a prop
  };

  if (!arEnabled) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B5BA5" />
        <Text style={styles.loadingText}>Initializing AR Experience...</Text>
        <Text style={styles.subText}>Setting up virtual try-on for {product.name}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* AR Scene */}
      <ViroARSceneNavigator
        ref={arNavigatorRef}
        initialScene={{
          scene: EnhancedARScene,
          passProps: {
            product: product,
            onPlaneDetected: handlePlaneDetected,
            onObjectPlaced: handleObjectPlaced,
            onObjectInteraction: handleObjectInteraction,
            onError: handleARError,
            activeEffect: activeEffect,
            activeColorHex: activeColorHex
          }
        }}
        style={styles.arView}
        autofocus={true}
        worldAlignment="GravityAndHeading"
      />
      
      {/* AR UI Overlay */}
      <View style={styles.uiContainer}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.productName}>{product.name}</Text>
          <TouchableOpacity style={styles.infoButton} onPress={toggleInstructions}>
            <Text style={styles.infoButtonText}>i</Text>
          </TouchableOpacity>
        </View>
        
        {/* Status Message */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>
        
        {/* Controls Container */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={[styles.controlButton, modelPlaced && styles.activeControlButton]} 
            onPress={resetARScene}
            disabled={!modelPlaced}
          >
            <Text style={styles.controlButtonText}>Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, modelPlaced && styles.activeControlButton]} 
            onPress={toggleEffectsPanel}
            disabled={!modelPlaced}
          >
            <Text style={styles.controlButtonText}>Effects</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, styles.primaryControlButton, modelPlaced && styles.activeControlButton]} 
            onPress={captureARScreen}
            disabled={!modelPlaced}
          >
            <Text style={styles.controlButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
        
        {/* AR Effects Panel */}
        <AREffectsPanel
          product={product}
          visible={showEffectsPanel && modelPlaced}
          onClose={toggleEffectsPanel}
          onSelectEffect={handleEffectSelect}
          onColorChange={handleColorChange}
        />
        
        {/* Instructions */}
        {showInstructions && (
          <View style={styles.instructions}>
            <Text style={styles.instructionTitle}>How to Try On Shoes</Text>
            <Text style={styles.instructionText}>
              1. Point camera at a flat surface{planeDetected ? ' ✓' : ''}
            </Text>
            <Text style={styles.instructionText}>
              2. Tap to place shoe{modelPlaced ? ' ✓' : ''}
            </Text>
            <Text style={styles.instructionText}>
              3. Move closer to see details
            </Text>
            <Text style={styles.instructionText}>
              4. Tap the shoe to see all angles
            </Text>
            <TouchableOpacity 
              style={styles.closeInstructionsButton}
              onPress={() => setShowInstructions(false)}
            >
              <Text style={styles.closeInstructionsText}>Got it</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Feature highlight tips (shown temporarily) */}
        {showFeatureHighlight && (
          <View style={styles.featureHighlight}>
            <Text style={styles.featureHighlightText}>
              ✨ NEW: Enhanced AR with foot tracking technology
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#3B5BA5',
  },
  subText: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  uiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  infoButton: {
    position: 'absolute',
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  productName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  statusText: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    fontSize: 14,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(59, 91, 165, 0.4)',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 25,
    minWidth: 90,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  activeControlButton: {
    backgroundColor: 'rgba(59, 91, 165, 0.9)',
  },
  primaryControlButton: {
    backgroundColor: 'rgba(232, 122, 93, 0.4)',
  },
  controlButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  instructions: {
    position: 'absolute',
    top: 150,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  instructionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  instructionText: {
    color: 'white',
    textAlign: 'left',
    fontSize: 14,
    marginBottom: 8,
    alignSelf: 'stretch',
  },
  closeInstructionsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  closeInstructionsText: {
    color: 'white',
    fontWeight: '600',
  },
  featureHighlight: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(243, 185, 65, 0.9)', // Mustard color
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureHighlightText: {
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  capturedImageContainer: {
    position: 'absolute',
    top: 150,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  capturedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  shareButtonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  shareButton: {
    backgroundColor: '#3B5BA5',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600',
  }
});

export default ViroARView;
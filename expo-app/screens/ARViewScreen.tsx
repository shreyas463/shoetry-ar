import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView 
} from 'react-native';
import { Camera } from 'expo-camera';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Asset } from 'expo-asset';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

// Import Product type
import { Product } from '../types/schema';

const { width, height } = Dimensions.get('window');

const ARViewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const product = route.params?.product as Product;
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const cameraRef = useRef<Camera>(null);
  const glViewRef = useRef<GLView>(null);
  
  // Three.js objects
  const scene = useRef(new THREE.Scene());
  const camera3D = useRef(new THREE.PerspectiveCamera(75, width / height, 0.1, 1000));
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const shoe = useRef<THREE.Object3D | null>(null);
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const clock = useRef(new THREE.Clock());

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permissions to use the AR feature.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    })();
    
    // Load default model if product doesn't have a specific model
    loadShoeModel();
    
    // Clean up function
    return () => {
      if (renderer.current) {
        renderer.current.dispose();
      }
      if (shoe.current) {
        scene.current.remove(shoe.current);
      }
    };
  }, []);

  const loadShoeModel = async () => {
    try {
      // In a real app, you'd use product.modelUrl, but for demo we'll use a default model
      // const modelAsset = Asset.fromModule(require('../assets/models/default_sneaker.glb'));
      // await modelAsset.downloadAsync();
      
      // For demo purposes, let's assume we loaded it
      setTimeout(() => {
        setIsModelLoaded(true);
      }, 2000);
      
      // In a real implementation, you'd load the model like this:
      /*
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
      
      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);
      
      gltfLoader.load(
        modelAsset.uri,
        (gltf) => {
          shoe.current = gltf.scene;
          scene.current.add(shoe.current);
          
          // Position the shoe model
          shoe.current.position.set(0, -1, -5);
          shoe.current.rotation.set(0, Math.PI, 0);
          shoe.current.scale.set(2, 2, 2);
          
          // If there are animations
          if (gltf.animations && gltf.animations.length) {
            mixer.current = new THREE.AnimationMixer(shoe.current);
            const action = mixer.current.clipAction(gltf.animations[0]);
            action.play();
          }
          
          setIsModelLoaded(true);
        },
        // Progress callback
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        // Error callback
        (error) => {
          console.error('Error loading model:', error);
          Alert.alert('Error', 'Failed to load 3D model. Please try again.');
        }
      );
      */
    } catch (error) {
      console.error('Error in loadShoeModel:', error);
      Alert.alert('Error', 'Failed to initialize AR experience. Please try again.');
    }
  };

  const onContextCreate = async (gl: WebGLRenderingContext) => {
    try {
      // Create a WebGLRenderer without a DOM element
      renderer.current = new Renderer({ gl });
      renderer.current.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      renderer.current.setClearColor(0x000000, 0);
      
      // Set up lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.current.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 10, 5);
      scene.current.add(directionalLight);
      
      // Position camera
      camera3D.current.position.z = 5;
      
      // For demo, create a simple shoe placeholder
      const geometry = new THREE.BoxGeometry(1, 0.5, 2);
      const material = new THREE.MeshLambertMaterial({ color: product.id % 2 === 0 ? 0x3B5BA5 : 0xE87A5D });
      const placeholder = new THREE.Mesh(geometry, material);
      placeholder.position.set(0, -1, -3);
      scene.current.add(placeholder);
      
      shoe.current = placeholder;
      
      // Start rendering loop
      const render = () => {
        requestAnimationFrame(render);
        
        if (mixer.current) {
          mixer.current.update(clock.current.getDelta());
        }
        
        if (shoe.current) {
          shoe.current.rotation.y += 0.01;
        }
        
        renderer.current?.render(scene.current, camera3D.current);
        gl.endFrameEXP();
      };
      
      render();
      
    } catch (error) {
      console.error('Error in onContextCreate:', error);
      Alert.alert('Error', 'Failed to initialize AR experience. Please try again.');
    }
  };

  const toggleCameraType = () => {
    setUseFrontCamera(prev => !prev);
  };

  const toggleTorch = () => {
    setTorchEnabled(prev => !prev);
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
      setIsCapturing(false);
      
      // In a real app, you might want to save this or share it
      Alert.alert(
        'Picture Captured',
        'Would you like to save or share this image?',
        [
          { text: 'Share', onPress: () => console.log('Share') },
          { text: 'Save', onPress: () => console.log('Save') },
          { text: 'Discard', onPress: () => setCapturedImage(null), style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Error taking picture:', error);
      setIsCapturing(false);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B5BA5" />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-off-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>Camera access denied</Text>
        <Text style={styles.errorSubtext}>
          You need to grant camera permission to use the AR feature.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          // @ts-ignore
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.permissionButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isModelLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B5BA5" />
        <Text style={styles.loadingText}>Loading 3D model...</Text>
        <Text style={styles.loadingSubtext}>{product.name}</Text>
      </View>
    );
  }
  
  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
        <View style={styles.capturedOverlay}>
          <View style={styles.productInfoCapture}>
            <Image 
              source={{ uri: product.imageUrl }} 
              style={styles.productThumbnail}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.productNameCapture}>{product.name}</Text>
              <Text style={styles.productPriceCapture}>${product.price}</Text>
            </View>
          </View>
          <View style={styles.captureActions}>
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={() => setCapturedImage(null)}
            >
              <Ionicons name="refresh-outline" size={24} color="white" />
              <Text style={styles.captureButtonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.captureButton, { backgroundColor: '#E87A5D' }]}
            >
              <Ionicons name="share-social-outline" size={24} color="white" />
              <Text style={styles.captureButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={useFrontCamera ? Camera.Constants.Type.front : Camera.Constants.Type.back}
        flashMode={torchEnabled ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <GLView
          style={styles.glView}
          onContextCreate={onContextCreate}
          ref={glViewRef}
        />
        
        <SafeAreaView style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.closeButton}
              // @ts-ignore
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.productInfoHeader}>
              <Text style={styles.headerTitle}>{product.name}</Text>
              <Text style={styles.headerBrand}>{product.brand}</Text>
            </View>
          </View>
          
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.circleButton}
              onPress={toggleCameraType}
            >
              <Ionicons 
                name={useFrontCamera ? "camera-outline" : "camera-reverse-outline"} 
                size={22} 
                color="white" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.captureButtonLarge}
              onPress={takePicture}
              disabled={!isCameraReady || isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.circleButton}
              onPress={toggleTorch}
            >
              <Ionicons 
                name={torchEnabled ? "flash" : "flash-outline"} 
                size={22} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              Point camera at your feet to see the shoes
            </Text>
          </View>
        </SafeAreaView>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  glView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  productInfoHeader: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerBrand: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'white',
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: 10,
    borderRadius: 20,
    overflow: 'hidden',
    fontSize: 14,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
  },
  loadingSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 8,
  },
  errorText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  errorSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  permissionButton: {
    backgroundColor: '#3B5BA5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  capturedImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  capturedOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  productInfoCapture: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  productThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'white',
    marginRight: 15,
  },
  productNameCapture: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPriceCapture: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  captureActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B5BA5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 0.48,
  },
  captureButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ARViewScreen;
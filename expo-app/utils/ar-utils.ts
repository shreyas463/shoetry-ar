import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Asset } from 'expo-asset';

// Setup scene, camera, and renderer
export const setupThreeJS = (gl: WebGLRenderingContext) => {
  // Scene
  const scene = new THREE.Scene();
  
  // Camera
  const camera = new THREE.PerspectiveCamera(
    75, 
    gl.drawingBufferWidth / gl.drawingBufferHeight, 
    0.1, 
    1000
  );
  camera.position.z = 5;
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 10, 5);
  scene.add(directionalLight);
  
  return {
    scene,
    camera
  };
};

// Load 3D model
export const loadModel = async (
  scene: THREE.Scene, 
  modelUrl: string | null,
  defaultColor: number = 0x3B5BA5
): Promise<THREE.Object3D | null> => {
  // If no model URL is provided, create a placeholder
  if (!modelUrl) {
    // Create a simple shoe-like shape
    const geometry = new THREE.BoxGeometry(1, 0.5, 2);
    const material = new THREE.MeshLambertMaterial({ color: defaultColor });
    const placeholder = new THREE.Mesh(geometry, material);
    placeholder.position.set(0, -1, -3);
    scene.add(placeholder);
    return placeholder;
  }

  try {
    // Setup DRACO loader for compressed models
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    
    // Setup GLTF loader
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    
    // Load the model
    return new Promise((resolve, reject) => {
      gltfLoader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene;
          
          // Position the model
          model.position.set(0, -1, -5);
          model.rotation.set(0, Math.PI, 0);
          model.scale.set(2, 2, 2);
          
          scene.add(model);
          resolve(model);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
          console.error('Error loading model:', error);
          reject(error);
        }
      );
    });
  } catch (error) {
    console.error('Failed to load model:', error);
    return null;
  }
};

// Animation loop
export const setupAnimationLoop = (
  gl: WebGLRenderingContext, 
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  model: THREE.Object3D | null,
  mixer: THREE.AnimationMixer | null = null
) => {
  // Create a clock for animations
  const clock = new THREE.Clock();
  
  // Animation function
  const animate = () => {
    requestAnimationFrame(animate);
    
    // Update animations if mixer exists
    if (mixer) {
      mixer.update(clock.getDelta());
    }
    
    // Rotate model if it exists
    if (model) {
      model.rotation.y += 0.01;
    }
    
    // Render
    renderer.render(scene, camera);
    gl.endFrameEXP();
  };
  
  // Start animation loop
  animate();
};

// Create animation mixer for model
export const createAnimationMixer = (
  model: THREE.Object3D,
  animations: THREE.AnimationClip[]
): THREE.AnimationMixer | null => {
  if (!animations || animations.length === 0) {
    return null;
  }
  
  const mixer = new THREE.AnimationMixer(model);
  const action = mixer.clipAction(animations[0]);
  action.play();
  
  return mixer;
};
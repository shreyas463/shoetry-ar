import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Three.js objects
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let model: THREE.Object3D | null = null;
let videoTexture: THREE.VideoTexture;
let light: THREE.DirectionalLight;
let loader: GLTFLoader;
let animationMixer: THREE.AnimationMixer | null = null;
let clock: THREE.Clock;

// Initialize Three.js
export function initThree(container: HTMLDivElement, videoElement: HTMLVideoElement) {
  // Create scene
  scene = new THREE.Scene();
  
  // Create camera
  const aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
  camera.position.z = 5;
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  
  // Position the renderer's canvas as an overlay
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.zIndex = '1';
  renderer.domElement.style.pointerEvents = 'none';
  
  // Add lighting
  light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 10, 10);
  scene.add(light);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Optional: Create a video texture for background (not using here as we're using DOM video)
  // videoTexture = new THREE.VideoTexture(videoElement);
  // videoTexture.minFilter = THREE.LinearFilter;
  // videoTexture.magFilter = THREE.LinearFilter;
  // videoTexture.format = THREE.RGBFormat;
  // scene.background = videoTexture;
  
  // Initialize GLTF loader
  loader = new GLTFLoader();
  
  // Initialize clock for animations
  clock = new THREE.Clock();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Start animation loop
  animate();
}

// Load 3D model
export function loadModel(modelUrl: string) {
  // Remove previous model if exists
  if (model) {
    scene.remove(model);
    model = null;
  }
  
  // Load new model
  loader.load(
    // For now, we're using a placeholder URL
    // In a real app, this would be a real model URL
    modelUrl || '/models/shoe.glb',
    (gltf) => {
      model = gltf.scene;
      
      // Configure model
      model.scale.set(0.02, 0.02, 0.02);
      model.position.set(0, -1.5, 0);
      
      // Add model to scene
      scene.add(model);
      
      // Setup animations if any
      if (gltf.animations && gltf.animations.length) {
        animationMixer = new THREE.AnimationMixer(model);
        const animation = gltf.animations[0];
        const action = animationMixer.clipAction(animation);
        action.play();
      }
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
      console.error('Error loading model:', error);
    }
  );
}

// Position model based on foot detection (simplified)
export function positionModel() {
  if (!model) return;
  
  // In a real app, this would use computer vision to detect feet
  // For now, just position at a fixed location
  model.position.set(0, -1.5, -2);
  model.rotation.y = Math.PI / 4;
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update animations
  const delta = clock.getDelta();
  if (animationMixer) {
    animationMixer.update(delta);
  }
  
  // You can add more animations here, like model rotation
  if (model) {
    model.rotation.y += 0.005;
  }
  
  renderer.render(scene, camera);
}

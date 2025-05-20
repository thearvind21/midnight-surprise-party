import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";

export const setupPostProcessing = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
): EffectComposer => {
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  
  // Bloom effect
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.8, // bloom strength
    0.3, // bloom radius
    0.7  // bloom threshold
  );
  composer.addPass(bloomPass);
  
  // Ambient Occlusion
  const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
  ssaoPass.kernelRadius = 16;
  ssaoPass.minDistance = 0.005;
  ssaoPass.maxDistance = 0.1;
  // composer.addPass(ssaoPass); // Commented out to test if SSAO is causing the WebGL error
  
  return composer;
};

export const setupLighting = (scene: THREE.Scene) => {
  // Ambient light
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  
  // Directional light
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(0, 10, 10);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);
  
  // Soft spotlight from above
  const spotLight = new THREE.SpotLight(0xfff7e6, 1.5, 20, Math.PI / 5, 0.5, 2);
  spotLight.position.set(0, 8, 0);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  scene.add(spotLight);

  // Add colorful point lights for interactive lighting
  const colors = [0xff5555, 0x55ff55, 0x5555ff, 0xffff55];
  colors.forEach((color, index) => {
    const pointLight = new THREE.PointLight(color, 0.5, 10);
    const angle = (index / colors.length) * Math.PI * 2;
    const radius = 5;
    pointLight.position.set(
      Math.cos(angle) * radius,
      2,
      Math.sin(angle) * radius
    );
    scene.add(pointLight);
  });
  
  return { dirLight, spotLight };
};

export const createSparkles = (scene: THREE.Scene): THREE.Points => {
  const particleCount = 200;
  const particles = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);
  const particleColors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    // Create particles in a sphere around the cake
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() * 2) - 1;
    const radius = 3 + Math.random() * 2;
    
    particles[i * 3] = Math.cos(angle) * radius * Math.sqrt(1 - height * height);
    particles[i * 3 + 1] = height * radius;
    particles[i * 3 + 2] = Math.sin(angle) * radius * Math.sqrt(1 - height * height);
    
    // Randomize sizes for prettier effect
    particleSizes[i] = Math.random() * 3 + 1;
    
    // Create gold/silver sparkles
    const colorChoice = Math.random();
    if (colorChoice < 0.6) {
      // Gold
      particleColors[i * 3] = 1.0;
      particleColors[i * 3 + 1] = 0.9;
      particleColors[i * 3 + 2] = 0.5;
    } else if (colorChoice < 0.9) {
      // Silver
      particleColors[i * 3] = 0.9;
      particleColors[i * 3 + 1] = 0.9;
      particleColors[i * 3 + 2] = 0.9;
    } else {
      // Pink
      particleColors[i * 3] = 1.0;
      particleColors[i * 3 + 1] = 0.5;
      particleColors[i * 3 + 2] = 0.7;
    }
  }
  
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
  
  const sparkleTexture = new THREE.TextureLoader().load(
    "data:image/png;base64,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"
  );
  
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.2,
    map: sparkleTexture,
    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  particleSystem.frustumCulled = false;
  scene.add(particleSystem);
  
  return particleSystem;
};

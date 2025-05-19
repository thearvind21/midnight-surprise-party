
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import Confetti from "@/components/Confetti";
import Sparkles from "@/components/Sparkles";

interface CakeSceneProps {
  userName: string;
  rotation?: number;
  zoom?: number;
}

const POP_SOUNDS = [
  "https://cdn.pixabay.com/audio/2022/03/15/audio_115b9bfae2.mp3", // pop
  "https://cdn.pixabay.com/audio/2022/03/15/audio_115b9bfae2.mp3", // pop
  "https://cdn.pixabay.com/audio/2022/03/15/audio_115b9bfae2.mp3", // pop
  "https://cdn.pixabay.com/audio/2022/03/15/audio_115b9bfae2.mp3", // pop
  "https://cdn.pixabay.com/audio/2022/10/16/audio_12b1b7b7e2.mp3"  // chime
];

const CUT_SOUND = "https://freesound.org/data/previews/234/234782_4019029-lq.mp3";
const SPARKLE_SOUND = "https://freesound.org/data/previews/516/516457_11235589-lq.mp3";

export const CakeScene = ({ userName, rotation = 0, zoom = 1 }: CakeSceneProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showGalleryBtn, setShowGalleryBtn] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const cakeGroupRef = useRef<THREE.Group | null>(null);
  const leftSliceRef = useRef<THREE.Group | null>(null);
  const rightSliceRef = useRef<THREE.Group | null>(null);
  const flameRefs = useRef<THREE.Mesh[]>([]);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const cakeCutRef = useRef(false);

  // Idle animation state
  const [idleFloatOffset, setIdleFloatOffset] = useState(0);

  // Interactive reveal state
  const [revealStep, setRevealStep] = useState(0); // 0=none, 1=base, 2=t1, 3=t2, 4=t3, 5=deco
  const [revealBtnDisabled, setRevealBtnDisabled] = useState(false);

  // Play sound for each reveal
  const playRevealSound = (step: number) => {
    const url = POP_SOUNDS[Math.min(step - 1, POP_SOUNDS.length - 1)];
    if (url) {
      const audio = new Audio(url);
      audio.play();
    }
  };

  // Cut cake animation
  const cutCakeAnimation = () => {
    if (!leftSliceRef.current || !rightSliceRef.current || cakeCutRef.current) return;
    
    cakeCutRef.current = true;
    
    // Play cutting sound
    new Audio(CUT_SOUND).play();
    
    // Animate the slices moving apart
    const duration = 2.0;
    const startTime = Date.now();
    const initialLeftX = leftSliceRef.current.position.x;
    const initialRightX = rightSliceRef.current.position.x;
    const targetOffset = 1.5; // How far apart the slices should move
    
    const animateCut = () => {
      if (!leftSliceRef.current || !rightSliceRef.current) return;
      
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      leftSliceRef.current.position.x = initialLeftX - (targetOffset * easedProgress);
      rightSliceRef.current.position.x = initialRightX + (targetOffset * easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animateCut);
      } else {
        // When animation completes, show celebration effects
        setConfetti(true);
        new Audio(SPARKLE_SOUND).play();
        
        // Display popup after a short delay
        setTimeout(() => {
          setShowPopup(true);
        }, 800);
        
        setTimeout(() => {
          setConfetti(false);
        }, 3500);
      }
    };
    
    animateCut();
  };

  // Apply external rotation and zoom
  useEffect(() => {
    if (cakeGroupRef.current) {
      cakeGroupRef.current.rotation.y = rotation;
    }
    
    if (cameraRef.current) {
      // Base camera Z position is 8, adjust based on zoom factor
      cameraRef.current.position.z = 8 / zoom;
    }
  }, [rotation, zoom]);
  
  // Idle floating animation
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setIdleFloatOffset(prev => (prev + 0.01) % (Math.PI * 2));
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);
  
  // Apply floating effect to cake
  useEffect(() => {
    if (cakeGroupRef.current) {
      const floatHeight = Math.sin(idleFloatOffset) * 0.1;
      cakeGroupRef.current.position.y = floatHeight;
    }
  }, [idleFloatOffset]);

  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.innerHTML = '';

    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance optimization
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasRef.current.appendChild(renderer.domElement);

    // Post-processing setup
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
    composer.addPass(ssaoPass);
    
    composerRef.current = composer;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
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

    // --- Programmatic Cake Construction ---
    const cakeGroup = new THREE.Group();
    
    // Create left and right slice groups for cutting animation
    const leftSlice = new THREE.Group();
    const rightSlice = new THREE.Group();
    cakeGroup.add(leftSlice);
    cakeGroup.add(rightSlice);
    leftSliceRef.current = leftSlice;
    rightSliceRef.current = rightSlice;

    // Groups for each reveal step
    const baseGroup = new THREE.Group();
    const tier1Group = new THREE.Group();
    const tier2Group = new THREE.Group();
    const tier3Group = new THREE.Group();
    const decoGroup = new THREE.Group();

    // Cake board with subtle gradient
    const boardGeo = new THREE.CylinderGeometry(3.2, 3.2, 0.22, 64);
    const boardMat = new THREE.MeshPhongMaterial({
      color: 0xf7c6e0,
      shininess: 100,
      specular: 0xfbeee6,
      emissive: 0xf7e6f7,
      emissiveIntensity: 0.08
    });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.y = -1.13;
    board.receiveShadow = true;
    baseGroup.add(board);
    cakeGroup.add(baseGroup);

    // Tier sizes
    const tiers = [
      { r: 2, h: 0.9, y: -0.6 },
      { r: 1.4, h: 0.8, y: 0.3 },
      { r: 0.8, h: 0.7, y: 1.0 },
    ];
    const pastelGreen = 0xb6e2a1;
    const glazeGreen = 0xc6f58c;

    // Function to create cake tier with proper materials
    const createCakeTier = (tier: typeof tiers[0], group: THREE.Group, isLeft: boolean) => {
      const geo = new THREE.CylinderGeometry(tier.r, tier.r, tier.h, 64);
      
      // Enhanced frosting material with subsurface scattering-like effect
      const mat = new THREE.MeshPhongMaterial({ 
        color: pastelGreen, 
        shininess: 20, 
        specular: 0xffffff,
        emissive: 0x447744,
        emissiveIntensity: 0.05
      });
      
      let mesh;
      if (isLeft) {
        // Create left half of the cake tier
        const halfGeo = new THREE.CylinderGeometry(tier.r, tier.r, tier.h, 32, 1, false, 0, Math.PI);
        mesh = new THREE.Mesh(halfGeo, mat);
        mesh.rotation.y = Math.PI;
      } else {
        // Create right half of the cake tier
        const halfGeo = new THREE.CylinderGeometry(tier.r, tier.r, tier.h, 32, 1, false, 0, Math.PI);
        mesh = new THREE.Mesh(halfGeo, mat);
      }
      
      mesh.position.y = tier.y;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      
      // Glaze with glass-like material
      const createGlaze = (targetGroup: THREE.Group, rotation: number) => {
        const dripGeo = new THREE.TorusGeometry(tier.r + 0.05, 0.08, 16, 32, Math.PI);
        const dripMat = new THREE.MeshPhysicalMaterial({ 
          color: glazeGreen, 
          roughness: 0.2,
          metalness: 0.1,
          clearcoat: 1.0,
          clearcoatRoughness: 0.2,
          transmission: 0.5,
          thickness: 0.5
        });
        const drip = new THREE.Mesh(dripGeo, dripMat);
        drip.position.y = tier.y + tier.h / 2 - 0.05;
        drip.rotation.y = rotation;
        drip.rotation.x = Math.PI / 2;
        targetGroup.add(drip);
      };
      
      // Add glaze to the appropriate side
      createGlaze(group, isLeft ? Math.PI : 0);
      
      // Random glaze drips
      const createDrips = (targetGroup: THREE.Group, startAngle: number, endAngle: number) => {
        for (let d = 0; d < 6; d++) {
          const angle = startAngle + ((endAngle - startAngle) * (d / 6)) + (Math.random() * 0.2);
          const dripLen = 0.18 + Math.random() * 0.18;
          const dripGeo = new THREE.SphereGeometry(0.07 + Math.random() * 0.04, 10, 10);
          const dripMat = new THREE.MeshPhysicalMaterial({ 
            color: glazeGreen, 
            roughness: 0.2,
            metalness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.2,
            transmission: 0.5,
            thickness: 0.5
          });
          const dripDrop = new THREE.Mesh(dripGeo, dripMat);
          dripDrop.position.set(
            Math.cos(angle) * (tier.r + 0.07),
            tier.y + tier.h / 2 - dripLen,
            Math.sin(angle) * (tier.r + 0.07)
          );
          targetGroup.add(dripDrop);
        }
      };
      
      // Add drips to the appropriate side
      if (isLeft) {
        createDrips(group, 0, Math.PI);
      } else {
        createDrips(group, Math.PI, Math.PI * 2);
      }
    };

    // Add tier 1 (base tier)
    createCakeTier(tiers[0], leftSlice, true);
    createCakeTier(tiers[0], rightSlice, false);
    tier1Group.add(leftSlice);
    tier1Group.add(rightSlice);
    cakeGroup.add(tier1Group);
    
    // Add tier 2 (middle tier)
    createCakeTier(tiers[1], leftSlice, true);
    createCakeTier(tiers[1], rightSlice, false);
    tier2Group.add(leftSlice);
    tier2Group.add(rightSlice);
    cakeGroup.add(tier2Group);
    
    // Add tier 3 (top tier)
    createCakeTier(tiers[2], leftSlice, true);
    createCakeTier(tiers[2], rightSlice, false);
    tier3Group.add(leftSlice);
    tier3Group.add(rightSlice);
    cakeGroup.add(tier3Group);

    // Add succulents, pebbles, candles, flower
    function createSucculent(x: number, y: number, z: number, scale: number = 1, color: number = 0x8fd19e, tall: boolean = false, targetGroup: THREE.Group) {
      const group = new THREE.Group();
      
      // Create realistic looking leaves with better materials
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const sx = Math.cos(angle) * 0.18 * scale;
        const sz = Math.sin(angle) * 0.18 * scale;
        
        // Use more detailed geometry for leaves
        const leafGeo = new THREE.SphereGeometry(0.13 * scale, 12, 12);
        
        // Create a better material with subtle variations
        const hueVariation = Math.random() * 0.1 - 0.05;
        const adjustedColor = new THREE.Color(color);
        adjustedColor.offsetHSL(hueVariation, 0.1, Math.random() * 0.2 - 0.1);
        
        const leafMat = new THREE.MeshPhysicalMaterial({ 
          color: adjustedColor, 
          roughness: 0.8,
          clearcoat: 0.2,
          clearcoatRoughness: 0.4
        });
        
        const mesh = new THREE.Mesh(leafGeo, leafMat);
        mesh.position.set(sx, 0, sz);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
      }
      
      // Center part of the succulent
      const centerGeo = new THREE.SphereGeometry(0.12 * scale, 12, 12);
      const centerMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xb6e2a1, 
        roughness: 0.7,
        clearcoat: 0.4
      });
      
      const center = new THREE.Mesh(centerGeo, centerMat);
      center.castShadow = true;
      center.receiveShadow = true;
      group.add(center);
      
      // Add tall leaves for certain succulents
      if (tall) {
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.2;
          const leafGeo = new THREE.ConeGeometry(0.07 * scale, 0.5 * scale + Math.random() * 0.2, 8);
          
          // Enhanced leaf material
          const leafColor = new THREE.Color(0x7fc97f);
          leafColor.offsetHSL(Math.random() * 0.1 - 0.05, 0, Math.random() * 0.1);
          
          const leafMat = new THREE.MeshPhysicalMaterial({ 
            color: leafColor, 
            roughness: 0.7,
            clearcoat: 0.2
          });
          
          const leaf = new THREE.Mesh(leafGeo, leafMat);
          leaf.position.set(
            Math.cos(angle) * 0.13 * scale, 
            0.25 * scale, 
            Math.sin(angle) * 0.13 * scale
          );
          leaf.rotation.x = Math.PI / 2 + Math.random() * 0.3;
          leaf.rotation.z = angle;
          leaf.castShadow = true;
          group.add(leaf);
        }
      }
      
      group.position.set(x, y, z);
      targetGroup.add(group);
    }
    
    // Helper to determine which slice group to use based on position
    const getTargetGroup = (angle: number) => {
      // If angle is in the left half of the cake
      if (angle > Math.PI / 2 && angle < (3 * Math.PI) / 2) {
        return leftSlice;
      } else {
        return rightSlice;
      }
    };
    
    // Add succulents around the cake
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const targetGroup = getTargetGroup(angle);
      createSucculent(
        Math.cos(angle) * 1.7, 
        -0.2, 
        Math.sin(angle) * 1.7, 
        1, 
        0x8fd19e, 
        i % 3 === 0, 
        targetGroup
      );
      
      if (i % 2 === 0) {
        createSucculent(
          Math.cos(angle) * 1.1, 
          0.6, 
          Math.sin(angle) * 1.1, 
          0.7, 
          0x9e8fd1, 
          i % 4 === 0, 
          targetGroup
        );
      }
      
      if (i % 3 === 0) {
        createSucculent(
          Math.cos(angle) * 0.6, 
          1.3, 
          Math.sin(angle) * 0.6, 
          0.5, 
          0xd1a98f, 
          i % 5 === 0, 
          targetGroup
        );
      }
    }
    
    // Add pebbles
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const pebbleGeo = new THREE.SphereGeometry(0.09 + Math.random() * 0.05, 8, 8);
      const pebbleMat = new THREE.MeshPhongMaterial({ 
        color: 0xcfcfcf + Math.floor(Math.random() * 0x30), 
        shininess: 30 
      });
      const pebble = new THREE.Mesh(pebbleGeo, pebbleMat);
      pebble.position.set(
        Math.cos(angle) * 2.7, 
        -1.0 + Math.random() * 0.05, 
        Math.sin(angle) * 2.7
      );
      const targetGroup = getTargetGroup(angle);
      targetGroup.add(pebble);
    }
    
    // Add candles with flames
    flameRefs.current = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const targetGroup = getTargetGroup(angle);
      
      const candleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 8);
      const candleMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xffffff, 
        roughness: 0.2,
        clearcoat: 0.8
      });
      const candle = new THREE.Mesh(candleGeo, candleMat);
      candle.position.set(
        Math.cos(angle) * 0.35, 
        1.45, 
        Math.sin(angle) * 0.35
      );
      candle.castShadow = true;
      targetGroup.add(candle);
      
      // Create improved flame with glowing material
      const flameGeo = new THREE.ConeGeometry(0.06, 0.13, 8);
      const flameMat = new THREE.MeshPhongMaterial({ 
        color: 0xffe066, 
        emissive: 0xffc300, 
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.9
      });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(0, 0.22, 0);
      candle.add(flame);
      flameRefs.current.push(flame);
    }
    
    // Create a beautiful flower topper
    const createFlower = () => {
      const flowerGroup = new THREE.Group();
      
      // Create prettier petals with more realistic materials
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        
        // Create color gradient for petals
        const progress = i / 12;
        const color = new THREE.Color().lerpColors(
          new THREE.Color(0xffb347),
          new THREE.Color(0xff6f61),
          progress
        );
        
        const petalGeo = new THREE.ConeGeometry(0.11, 0.36, 16);
        const petalMat = new THREE.MeshPhysicalMaterial({ 
          color, 
          roughness: 0.6,
          clearcoat: 0.3,
          clearcoatRoughness: 0.3
        });
        const petal = new THREE.Mesh(petalGeo, petalMat);
        petal.position.set(
          Math.cos(angle) * 0.19, 
          1.62, 
          Math.sin(angle) * 0.19
        );
        petal.rotation.x = Math.PI / 2 + 0.2;
        petal.rotation.z = angle;
        petal.castShadow = true;
        
        // Determine which half of the cake this petal belongs to
        const targetGroup = getTargetGroup(angle);
        targetGroup.add(petal);
      }
      
      // Inner petals
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const petalGeo = new THREE.ConeGeometry(0.08, 0.22, 12);
        const petalMat = new THREE.MeshPhysicalMaterial({ 
          color: 0xffb347, 
          roughness: 0.6,
          clearcoat: 0.2
        });
        const petal = new THREE.Mesh(petalGeo, petalMat);
        petal.position.set(
          Math.cos(angle) * 0.11, 
          1.58, 
          Math.sin(angle) * 0.11
        );
        petal.rotation.x = Math.PI / 2 + 0.2;
        petal.rotation.z = angle;
        petal.castShadow = true;
        
        // Determine which half of the cake this petal belongs to
        const targetGroup = getTargetGroup(angle);
        targetGroup.add(petal);
      }
      
      // Flower center
      const flowerCenterGeo = new THREE.SphereGeometry(0.09, 14, 14);
      const flowerCenterMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xffe066, 
        roughness: 0.3,
        clearcoat: 0.5
      });
      
      // Create two half-spheres for the center
      const createHalfSphere = (isLeft: boolean) => {
        // Simple approach - just create a full sphere and position it slightly offset
        // so only half appears in each slice
        const center = new THREE.Mesh(flowerCenterGeo, flowerCenterMat);
        center.position.set(isLeft ? -0.01 : 0.01, 1.68, 0);
        center.castShadow = true;
        isLeft ? leftSlice.add(center) : rightSlice.add(center);
      };
      
      createHalfSphere(true);
      createHalfSphere(false);
      
      return flowerGroup;
    };
    
    createFlower();
    
    // Add all decoration groups to the cake
    decoGroup.add(leftSlice);
    decoGroup.add(rightSlice);
    cakeGroup.add(decoGroup);

    // Create sparkle particle system
    const createSparkles = () => {
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
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAVjSURBVHic7ZtNiBxFFMd/1T2zs7uzSYgxie4GUUFFg+BBEVFBUcGDiooHUVA8iQdP3jwKevEgePAkeBBRUPCgKHgQBEVEQVEUFUXRqPGbZJPdJLs7/VE9HqqrZ3p6dnumu2ZnN6H/MHT3e69evf/U+3jvVQkcDofD4XA4HA7H5kEsdwdmgct2VkjM6alT+RxaWtYeYaW4LBSwbGb/zvCCluCUV8QTAb5p44vAkRWUx4pLvgK2Ft9FT/LXemd2Dfkl/BiHyt9jjzDvXGQlKGB7yqT7sbpvavYUf7E3eaMvl7R9t8flS9or5FcF30IOtHhg0NqJ/sCQrbfldjTDTeT3vLCcmCNuRpqrzNEkjtEs2Rhb48/XxknLQgGRgXIhtC6fLFEyiiw+riw+cS1QUcTJgHrScj1SAMZoJY1TRqtYUctoLcpWa60Xj4njeJayVltdSZRRqZzpSrSRREoKIQIhRCAQgS+F9GPfE7L0fBmEYVL2fRFsbm7S84AkiefqUT2o1eaqtXCudjoc14+pfhNHAGgyLg4g9OSYFws5EvLHhN89y7FjEmWUkYpIRVrppBQnpUrlZBxH01EUT9frYa1Wm5uemYlmIxWl6TtAmE5GtEix1gzpR8lCBdiRvlAyYFAUweQY91mll2Jk8k5KyVVCeIOUsh4EQS2Mwno9qlWPHz853u/nZ5bO9mmM0UYbbaQQQhhj/EQpzxgtldK+UtoXQkitdWA0Btr4gRCeFIGPoABUgV1AFegyXMf8F+AvYGZgu1ndVUBsjFZGGykFA6YppZBKeVJKP6n7kTGMKyP7KSL999PRNp9QZnVx8i4Kgt3AXmAd1kDnLJ3tMxzGvAtMAkfzjeYqIEljvVQqTwrp7TEm2Od5Yo8QXj5f6WpmD3sBghHanT0FIHZkS+4KYDNwO3ADELLYfbvZAS8C3wH/tnbQr4A0w/seeL4n9gK7jTFm6K6CEFaBQpEABvp2lkytSaHJGN+zgBuBW4EVFoA7TjpkwGwQiPcHG/UurjI9NVJavJ7AP5VOPk/6vld8a9fH7avNtFL6B2ATtqtJlMQSY30uZgRyHzYSXJK0OAL4wCHgK+DjwUa9zXcUUViXMyZbkwsh20qD27pLxu/8bYzaA3NjbsDGhGb6BqIH+CxwH3CBGVYoLZ2eoWv8yvcTKlaXHBvJMGNb93hd9Xu5nUS7DTgOPANcDYRkvWjxDbMYH/iD9kR+lCw2duuR/CT6X3t024HlwE3AKU4PdsFwYV/CpgLLsRoYCJvcbM1tXQF7213SJsQNwGfA5d0v7GD2savpOoxBHy/eg2Oet5iTnTm/q3u7xdnAT9hkqLlAX9FCAbaAHdgi7EnvalWCsEcB11JMVmJO9RHTcz51f5e7To/NCc7v5cY2TgE+Bw52uriD2Z/wOjbX30i2BsoVUTDz9K9Vtua2zoA3sd55HXbyM8DR3Dc5h02c2s38jfS5H3BhL4T0/CF3jU5d7qAA4GLgY+D83FS6x9JnsdnjJPZXlp3zdFZAbpFlZ/7t7p+a+dqlkWQ9dohZhzXJe1ncR/XI/GMXDXcbcE8P4326XyXJusxOhPK5AtKaPGLNt71/FFv+j8l8q2W+ACPXDelKIPcNt9n+lpaiCP250SUDvYwt6HLMPwq8JIQ42/O8S3zfv9z35BVCyAullJcJITZj0+ns9Q8VcTme510yaMbDnn5uQncl5BNZeGfueaGXNfZRoIaNArLA65jQb6aUGq9UgjeklBH2BBblo0B0ScgaxhjjlcvlO9xvcDeNG9daP5fU9+aHhLzlTwLXkGV0RwBljPkcuA+b91+ATaSy32xCIO76OwBvUyzMdgKvYDPN0t85FiJJko+iKHpCa31Ib6B/g3E4HA6Hw+FwOBwOh2MdOrkC/gfGhX8AAgmDtgAAAABJRU5ErkJggg=="
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
      particleSystemRef.current = particleSystem;
      scene.add(particleSystem);
    };
    
    createSparkles();

    // Set initial scales for reveal
    baseGroup.scale.set(0.01, 0.01, 0.01);
    tier1Group.scale.set(0.01, 0.01, 0.01);
    tier2Group.scale.set(0.01, 0.01, 0.01);
    tier3Group.scale.set(0.01, 0.01, 0.01);
    decoGroup.scale.set(0.01, 0.01, 0.01);

    scene.add(cakeGroup);
    cakeGroupRef.current = cakeGroup;
    setIsLoading(false);

    // Create glow mesh reference
    let glowMesh: THREE.Mesh | null = null;

    // Animation loop
    let startTime = Date.now();
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Animate candle flames (flicker)
      const t = (Date.now() - startTime) / 1000;
      flameRefs.current.forEach((flame, idx) => {
        const scale = 1 + Math.sin(t * 8 + idx) * 0.15 + Math.random() * 0.07;
        flame.scale.y = scale;
        if (flame.material instanceof THREE.MeshPhongMaterial) {
          flame.material.emissiveIntensity = 0.7 + Math.sin(t * 10 + idx) * 0.3 + Math.random() * 0.1;
        }
      });
      
      // Animate sparkle particles
      if (particleSystemRef.current) {
        particleSystemRef.current.rotation.y += 0.001;
        
        // Pulse the sparkles
        const positions = particleSystemRef.current.geometry.attributes.position.array;
        const sizes = particleSystemRef.current.geometry.attributes.size.array;
        const count = positions.length / 3;
        
        for (let i = 0; i < count; i++) {
          const pulseFactor = Math.sin((t + i * 0.1) * 2) * 0.5 + 1;
          sizes[i] = (Math.random() * 2 + 1) * pulseFactor;
        }
        particleSystemRef.current.geometry.attributes.size.needsUpdate = true;
      }
      
      // Animate reveal (scale up each group)
      if (revealStep >= 1) {
        baseGroup.scale.lerp(new THREE.Vector3(1, 1, 1), 0.15);
      }
      if (revealStep >= 2) {
        tier1Group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.15);
      }
      if (revealStep >= 3) {
        tier2Group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.15);
      }
      if (revealStep >= 4) {
        tier3Group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.15);
      }
      if (revealStep >= 5) {
        decoGroup.scale.lerp(new THREE.Vector3(1, 1, 1), 0.15);
        
        // Create and manage glow mesh
        if (!glowMesh) {
          const glowGeo = new THREE.SphereGeometry(2.2, 32, 32);
          const glowMat = new THREE.MeshBasicMaterial({ 
            color: 0xffffff, 
            transparent: true, 
            opacity: 0 
          });
          glowMesh = new THREE.Mesh(glowGeo, glowMat);
          glowMesh.position.y = 1.1;
          cakeGroup.add(glowMesh);
        }
        // Fade in glow
        if (glowMesh.material instanceof THREE.MeshBasicMaterial) {
          glowMesh.material.opacity = Math.min(0.18, glowMesh.material.opacity + 0.01);
        }
      } else if (glowMesh) {
        // Remove glow when not in final step
        cakeGroup.remove(glowMesh);
        glowMesh = null;
      }
      
      // Render with post-processing
      if (composerRef.current) {
        composerRef.current.render();
      } else {
        renderer.render(scene, camera);
      }
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      if (composerRef.current) {
        composerRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvasRef.current) canvasRef.current.innerHTML = '';
    };
  }, [userName, revealStep]);

  // Interactive reveal handler
  const handleRevealNext = () => {
    if (revealStep < 5) {
      playRevealSound(revealStep + 1);
      setRevealStep(revealStep + 1);
      // Dramatic pause before final deco
      if (revealStep === 3) {
        setRevealBtnDisabled(true);
        setTimeout(() => setRevealBtnDisabled(false), 800);
      }
      // Confetti and disable after final
      if (revealStep === 4) {
        setRevealBtnDisabled(true);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3500);
      }
    }
  };

  // UI
  return (
    <>
      <Confetti trigger={confetti} />
      <Sparkles trigger={revealStep === 5} />
      <div ref={canvasRef} className="absolute inset-0 z-0"></div>
      
      {/* Simple background instead of the custom one */}
      <div className="fixed inset-0 bg-gradient-to-br from-birthday-pink via-birthday-purple to-birthday-blue -z-10"></div>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-birthday-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-medium">Preparing your cake...</p>
          </div>
        </div>
      )}
      
      {!isLoading && !showPopup && !showGallery && (
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center z-10">
          <button
            className="px-8 py-3 mb-4 bg-birthday-gold hover:bg-birthday-gold/80 text-black font-medium rounded-full shadow-lg text-xl animate-pulse-soft"
            onClick={handleRevealNext}
            disabled={revealBtnDisabled || revealStep >= 5}
          >
            {revealStep < 4 && "Next Layer"}
            {revealStep === 4 && "Final Touch!"}
            {revealStep === 5 && "All Layers Revealed!"}
          </button>
          <button
            className="px-8 py-3 bg-white text-purple-700 font-semibold rounded-full shadow-lg hover:bg-purple-100 transition"
            onClick={cutCakeAnimation}
            disabled={revealStep < 5 || cakeCutRef.current}
          >
            Cut the Cake
          </button>
        </div>
      )}
      {showPopup && !showGallery && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full bg-gradient-to-br from-white to-purple-50">
            <div className="relative text-center">
              <h2 className="text-2xl font-bold mb-4 animate-fade-in">🎉 Happy Birthday, {userName}! 🎉</h2>
              <div className="typewriter mb-6">
                <p className="text-lg">Wishing you a sweet year ahead filled with joy, success, and beautiful memories!</p>
              </div>
              <button
                className="px-6 py-2 bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-full font-semibold hover:bg-purple-700 transition hover:scale-105 transform shadow-lg"
                onClick={() => {
                  setShowPopup(false);
                  setShowGalleryBtn(true);
                  setConfetti(true);
                  setTimeout(() => setConfetti(false), 3500);
                }}
              >
                Thank you!
              </button>
            </div>
          </div>
        </div>
      )}
      {showGalleryBtn && !showGallery && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
          <button
            className="px-8 py-3 bg-white text-purple-700 font-semibold rounded-full shadow-lg hover:bg-purple-100 transition hover:scale-105 transform"
            onClick={() => setShowGallery(true)}
          >
            View Gallery
          </button>
        </div>
      )}
      {showGallery && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-50">
          <h2 className="text-2xl font-bold mb-6">🎂 Cake Gallery (Coming Soon)</h2>
          <button
            className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition"
            onClick={() => setShowGallery(false)}
          >
            Back to Cake
          </button>
        </div>
      )}
    </>
  );
};

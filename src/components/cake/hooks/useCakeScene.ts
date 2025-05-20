import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { setupPostProcessing, setupLighting, createSparkles } from "../utils/CakeEffects";
import { createCakeBoard, createCakeTier } from "../utils/CakeBuilder";
import { addSucculentsAroundCake, addPebbles, addCandles, createFlower } from "../utils/CakeDecorations";
import { animateFlames, animateParticles, animateRevealScaling } from "../utils/CakeAnimations";

export const useCakeScene = (revealStep: number) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const cakeGroupRef = useRef<THREE.Group | null>(null);
  const leftSliceRef = useRef<THREE.Group | null>(null);
  const rightSliceRef = useRef<THREE.Group | null>(null);
  const flameRefs = useRef<THREE.Mesh[]>([]);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<any | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const cakeCutRef = useRef(false);
  
  // Set up THREE.js scene
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Post-processing setup
    composerRef.current = setupPostProcessing(renderer, scene, camera);

    // Lighting setup
    setupLighting(scene);

    // --- Cake Construction ---
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

    // Add cake board
    createCakeBoard(baseGroup);
    cakeGroup.add(baseGroup);

    // Tier sizes
    const tiers = [
      { r: 2, h: 0.9, y: -0.6 },
      { r: 1.4, h: 0.8, y: 0.3 },
      { r: 0.8, h: 0.7, y: 1.0 },
    ];
    const pastelGreen = 0xb6e2a1;
    const glazeGreen = 0xc6f58c;

    // Add tiers
    createCakeTier(tiers[0], leftSlice, true, pastelGreen, glazeGreen);
    createCakeTier(tiers[0], rightSlice, false, pastelGreen, glazeGreen);
    tier1Group.add(leftSlice);
    tier1Group.add(rightSlice);
    cakeGroup.add(tier1Group);
    
    createCakeTier(tiers[1], leftSlice, true, pastelGreen, glazeGreen);
    createCakeTier(tiers[1], rightSlice, false, pastelGreen, glazeGreen);
    tier2Group.add(leftSlice);
    tier2Group.add(rightSlice);
    cakeGroup.add(tier2Group);
    
    createCakeTier(tiers[2], leftSlice, true, pastelGreen, glazeGreen);
    createCakeTier(tiers[2], rightSlice, false, pastelGreen, glazeGreen);
    tier3Group.add(leftSlice);
    tier3Group.add(rightSlice);
    cakeGroup.add(tier3Group);

    // Add decorations
    addSucculentsAroundCake(leftSlice, rightSlice);
    addPebbles(leftSlice, rightSlice);
    flameRefs.current = addCandles(leftSlice, rightSlice);
    createFlower(leftSlice, rightSlice);
    
    // Add all decoration groups to the cake
    decoGroup.add(leftSlice);
    decoGroup.add(rightSlice);
    cakeGroup.add(decoGroup);

    scene.add(cakeGroup);
    cakeGroupRef.current = cakeGroup;
    setIsLoading(false);

    // Create sparkle particle system
    particleSystemRef.current = createSparkles(scene);
    // Comment out the line below to test if the sparkles texture is causing the WebGL error
    // scene.add(particleSystemRef.current);

    // Animation loop
    let startTime = Date.now();
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Calculate elapsed time
      const t = (Date.now() - startTime) / 1000;
      
      // Animate candle flames (flicker)
      animateFlames(flameRefs.current, t);
      
      // Animate sparkle particles
      if (particleSystemRef.current) {
        animateParticles(particleSystemRef.current, t);
      }
      
      // Animate reveal (scale up each group)
      animateRevealScaling(
        revealStep,
        baseGroup,
        tier1Group,
        tier2Group,
        tier3Group,
        decoGroup,
        cakeGroup
      );
      
      // Render with post-processing if available, otherwise use standard renderer
      if (composerRef.current) {
        composerRef.current.render();
      } else if (rendererRef.current) {
        rendererRef.current.render(scene, camera);
      }
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      
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
  }, [revealStep]);

  // Apply external controls (rotation, zoom)
  const updateCakeTransform = (rotation: number = 0, zoom: number = 1) => {
    if (cakeGroupRef.current) {
      cakeGroupRef.current.rotation.y = rotation;
    }
    
    if (cameraRef.current) {
      cameraRef.current.position.z = 8 / zoom;
    }
  };

  // Idle floating animation
  const [idleFloatOffset, setIdleFloatOffset] = useState(0);
  
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

  return {
    canvasRef,
    isLoading,
    cakeCutRef,
    leftSliceRef,
    rightSliceRef,
    updateCakeTransform
  };
};

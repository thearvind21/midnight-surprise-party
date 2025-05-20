import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { setupPostProcessing, setupLighting, createSparkles } from "../utils/CakeEffects";
import { createCakeBoard, createCakeTier } from "../utils/CakeBuilder";
import { addSucculentsAroundCake, addPebbles, addCandles, createFlower } from "../utils/CakeDecorations";
import { animateFlames, animateParticles, animateRevealScaling } from "../utils/CakeAnimations";

export const useCakeScene = (revealStep: number, activeTheme: string) => {
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

    // --- Cake Construction for Reveal Animation ---
    const cakeGroup = new THREE.Group();
    
    // Groups for each reveal step - will be scaled up
    const baseGroup = new THREE.Group();
    const tier1Group = new THREE.Group();
    const tier2Group = new THREE.Group();
    const tier3Group = new THREE.Group();
    const decoGroup = new THREE.Group();

    // Add groups to the main cake group
    cakeGroup.add(baseGroup);
    cakeGroup.add(tier1Group);
    cakeGroup.add(tier2Group);
    cakeGroup.add(tier3Group);
    cakeGroup.add(decoGroup);

    // Create and add cake components to their respective groups
    createCakeBoard(baseGroup, activeTheme); // Add board to baseGroup

    const tiers = [
      { r: 2, h: 0.9, y: -0.6 },
      { r: 1.4, h: 0.8, y: 0.3 },
      { r: 0.8, h: 0.7, y: 1.0 },
    ];

    // createCakeTier now adds directly to the provided group
    createCakeTier(tiers[0], tier1Group, activeTheme); 
    createCakeTier(tiers[1], tier2Group, activeTheme);
    createCakeTier(tiers[2], tier3Group, activeTheme);

    // Decoration functions now add directly to the provided group
    addSucculentsAroundCake(decoGroup, activeTheme); 
    addPebbles(decoGroup, activeTheme); 
    flameRefs.current = addCandles(decoGroup, activeTheme); 
    createFlower(decoGroup, activeTheme); 

    scene.add(cakeGroup);
    cakeGroupRef.current = cakeGroup;
    setIsLoading(false);

    // Temporarily set slice refs to dummy groups for reveal focus
    leftSliceRef.current = new THREE.Group(); 
    rightSliceRef.current = new THREE.Group(); 

    // Create sparkle particle system (re-enable if needed after WebGL error is resolved)
    // particleSystemRef.current = createSparkles(scene);

    // Set initial scales for reveal - start with larger initial scale
    baseGroup.scale.set(0.2, 0.2, 0.2);
    tier1Group.scale.set(0.2, 0.2, 0.2);
    tier2Group.scale.set(0.2, 0.2, 0.2);
    tier3Group.scale.set(0.2, 0.2, 0.2);
    decoGroup.scale.set(0.2, 0.2, 0.2);

    // Animation timing variables
    const animationStartTimes = useRef({
      base: Date.now(),
      tier1: Date.now() + 500,  // 500ms delay
      tier2: Date.now() + 1000, // 1000ms delay
      tier3: Date.now() + 1500, // 1500ms delay
      deco: Date.now() + 2000   // 2000ms delay
    });

    // Reset animation times when reveal step changes
    useEffect(() => {
      animationStartTimes.current = {
        base: Date.now(),
        tier1: Date.now() + 500,
        tier2: Date.now() + 1000,
        tier3: Date.now() + 1500,
        deco: Date.now() + 2000
      };
    }, [revealStep]);

    // Animation loop
    let startTime = Date.now();
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Calculate elapsed time
      const t = (Date.now() - startTime) / 1000;
      
      // Animate candle flames (flicker)
      animateFlames(flameRefs.current, t);
      
      // Animate reveal (scale up each group)
      animateRevealScaling(
        revealStep,
        baseGroup,
        tier1Group,
        tier2Group,
        tier3Group,
        decoGroup,
        cakeGroup,
        animationStartTimes.current
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
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (composerRef.current) {
        // Dispose of passes if composer has a dispose method
        // composerRef.current.passes.forEach((pass: any) => { if (pass.dispose) pass.dispose(); });
      }
    };
  }, [revealStep, activeTheme]); // Re-run effect if revealStep or activeTheme changes

  // Function to update cake rotation and zoom
  const updateCakeTransform = (rotation: number = 0, zoom: number = 1) => {
    if (cakeGroupRef.current && cameraRef.current) {
      // Apply rotation around the Y-axis
      cakeGroupRef.current.rotation.y = rotation;

      // Adjust camera position for zoom
      // Assuming initial camera position is (0, 2, 8)
      const initialCameraPosition = new THREE.Vector3(0, 2, 8);
      const zoomedPosition = initialCameraPosition.clone().multiplyScalar(1 / zoom);
      cameraRef.current.position.copy(zoomedPosition);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  return { canvasRef, isLoading, leftSliceRef, rightSliceRef, updateCakeTransform };
};

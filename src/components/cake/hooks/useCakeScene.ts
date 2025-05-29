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
  const baseGroupRef = useRef<THREE.Group | null>(null);
  const tier1GroupRef = useRef<THREE.Group | null>(null);
  const tier2GroupRef = useRef<THREE.Group | null>(null);
  const tier3GroupRef = useRef<THREE.Group | null>(null);
  const decoGroupRef = useRef<THREE.Group | null>(null);
  const leftSliceRef = useRef<THREE.Group | null>(null);
  const rightSliceRef = useRef<THREE.Group | null>(null);
  const flameRefs = useRef<THREE.Mesh[]>([]);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<any | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const cakeCutRef = useRef(false);
  const animationStartTimesRef = useRef({
    base: Date.now(),
    tier1: Date.now() + 500,
    tier2: Date.now() + 1000,
    tier3: Date.now() + 1500,
    deco: Date.now() + 2000
  });

  // Reset animation times when reveal step changes
  useEffect(() => {
    animationStartTimesRef.current = {
      base: Date.now(),
      tier1: Date.now() + 500,
      tier2: Date.now() + 1000,
      tier3: Date.now() + 1500,
      deco: Date.now() + 2000
    };
  }, [revealStep]);
  
  // Control layer visibility based on revealStep
  useEffect(() => {
    if (!baseGroupRef.current || !tier1GroupRef.current || !tier2GroupRef.current || !tier3GroupRef.current || !decoGroupRef.current) return;

    baseGroupRef.current.visible = revealStep >= 1;
    tier1GroupRef.current.visible = revealStep >= 2;
    tier2GroupRef.current.visible = revealStep >= 3;
    tier3GroupRef.current.visible = revealStep >= 4;
    decoGroupRef.current.visible = revealStep >= 5;
  }, [revealStep]);
  
  // Function to set up the Three.js scene
  const setupScene = (canvasContainer: HTMLDivElement, scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, width: number, height: number) => {

    // Clear previous content
    canvasContainer.innerHTML = '';

    // Set up renderer size and add to container
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasContainer.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Post-processing setup
    composerRef.current = setupPostProcessing(renderer, scene, camera, width, height);

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

    // Assign groups to refs
    baseGroupRef.current = baseGroup;
    tier1GroupRef.current = tier1Group;
    tier2GroupRef.current = tier2Group;
    tier3GroupRef.current = tier3Group;
    decoGroupRef.current = decoGroup;

    // Create and add cake components to their respective groups
    createCakeBoard(baseGroup, activeTheme);

    const tiers = [
      { r: 2, h: 0.9, y: -0.6 },
      { r: 1.4, h: 0.8, y: 0.3 },
      { r: 0.8, h: 0.7, y: 1.0 },
    ];

    createCakeTier(tiers[0], tier1Group, activeTheme);
    createCakeTier(tiers[1], tier2Group, activeTheme);
    createCakeTier(tiers[2], tier3Group, activeTheme);

    addSucculentsAroundCake(decoGroup, activeTheme);
    addPebbles(decoGroup, activeTheme);
    flameRefs.current = addCandles(decoGroup, activeTheme);
    createFlower(decoGroup, activeTheme);

    scene.add(cakeGroup);
    cakeGroupRef.current = cakeGroup;
    setIsLoading(false);

    // Set initial scales to 1 and visibility to false to prepare for step-by-step reveal without scaling animation
    baseGroup.scale.set(1, 1, 1);
    tier1Group.scale.set(1, 1, 1);
    tier2Group.scale.set(1, 1, 1);
    tier3Group.scale.set(1, 1, 1);
    decoGroup.scale.set(1, 1, 1);

    baseGroup.visible = false;
    tier1Group.visible = false;
    tier2Group.visible = false;
    tier3Group.visible = false;
    decoGroup.visible = false;

    // Animation loop setup
    let startTime = Date.now();
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Calculate elapsed time
      const t = (Date.now() - startTime) / 1000;
      
      // Animate candle flames (flicker)
      animateFlames(flameRefs.current, t);
      
      // Render with post-processing if available, otherwise use standard renderer
      if (composerRef.current) {
        composerRef.current.render();
      } else if (rendererRef.current) {
        rendererRef.current.render(scene, camera);
      }
    };
    animate();
  }

  // Set up THREE.js scene
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvasContainer = canvasRef.current;

    // Handle resize using ResizeObserver
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { clientWidth, clientHeight } = entry.target;
        if (cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = clientWidth / clientHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(clientWidth, clientHeight);
          if (composerRef.current) {
            composerRef.current.setSize(clientWidth, clientHeight);
          }
        }
      }
    });

    resizeObserver.observe(canvasContainer);
    
    // Initial scene setup if container already has size
    if (canvasContainer.clientWidth > 0 && canvasContainer.clientHeight > 0) {
        // Set up scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          60,
          canvasContainer.clientWidth / canvasContainer.clientHeight,
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
        
        setupScene(canvasContainer, scene, camera, renderer, canvasContainer.clientWidth, canvasContainer.clientHeight);
    }

    // Observe resize changes to update renderer size and potentially setup initially
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { clientWidth, clientHeight } = entry.target;
        if (clientWidth > 0 && clientHeight > 0) {
          // If the scene hasn't been set up yet, or on resize
          if (!rendererRef.current || rendererRef.current.getSize(new THREE.Vector2()).width === 0) {
             // Set up scene
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
              60,
              clientWidth / clientHeight,
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
            setupScene(entry.target as HTMLDivElement, scene, camera, renderer, clientWidth, clientHeight);
          } else if (cameraRef.current && rendererRef.current) {
             // Just resize if already set up
             cameraRef.current.aspect = clientWidth / clientHeight;
             cameraRef.current.updateProjectionMatrix();
             rendererRef.current.setSize(clientWidth, clientHeight);
             if (composerRef.current) {
               composerRef.current.setSize(clientWidth, clientHeight);
             }
          }
        } else {
           // If size becomes zero, clean up Three.js to avoid errors
           if (rendererRef.current) {
             rendererRef.current.dispose();
             rendererRef.current = null;
             if (canvasContainer) canvasContainer.innerHTML = ''; // Clear the canvas element
           }
           if (composerRef.current) composerRef.current = null;
           if (cameraRef.current) cameraRef.current = null;
           // Optionally reset other refs and states if needed
           cakeGroupRef.current = null;
           baseGroupRef.current = null;
           tier1GroupRef.current = null;
           tier2GroupRef.current = null;
           tier3GroupRef.current = null;
           decoGroupRef.current = null;
           flameRefs.current = [];
           setIsLoading(true);
        }
      }
    });

    observer.observe(canvasContainer);

    return () => {
      if (rendererRef.current) rendererRef.current.dispose();
      observer.disconnect();
    };
  }, [activeTheme]); // Removed revealStep from dependency array of this effect

  // Function to update cake rotation and zoom
  const updateCakeTransform = (rotation: number = 0, zoom: number = 1) => {
    if (cakeGroupRef.current && cameraRef.current) {
      // Apply rotation around the Y-axis
      cakeGroupRef.current.rotation.y = rotation;

      // Adjust camera position for zoom
      const initialCameraPosition = new THREE.Vector3(0, 2, 8);
      const zoomedPosition = initialCameraPosition.clone().multiplyScalar(1 / zoom);
      cameraRef.current.position.copy(zoomedPosition);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  return { canvasRef, isLoading, leftSliceRef, rightSliceRef, updateCakeTransform };
};


import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Confetti from "@/components/Confetti";
import Sparkles from "@/components/Sparkles";
import { setupPostProcessing, setupLighting, createSparkles } from "./utils/CakeEffects";
import { createCakeBoard, createCakeTier, getTargetGroup } from "./utils/CakeBuilder";
import { addSucculentsAroundCake, addPebbles, addCandles, createFlower } from "./utils/CakeDecorations";
import { cutCakeAnimationImpl, animateFlames, animateParticles, animateRevealScaling } from "./utils/CakeAnimations";

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
  const composerRef = useRef<THREE.WebGLRenderer | null>(null);
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
    cutCakeAnimationImpl(
      leftSliceRef.current,
      rightSliceRef.current,
      () => {
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
      },
      () => {
        // Halfway through animation callback if needed
      }
    );
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

  // Main THREE.js setup
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
    const composer = setupPostProcessing(renderer, scene, camera);
    composerRef.current = composer;

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

    // Add tier 1 (base tier)
    createCakeTier(tiers[0], leftSlice, true, pastelGreen, glazeGreen);
    createCakeTier(tiers[0], rightSlice, false, pastelGreen, glazeGreen);
    tier1Group.add(leftSlice);
    tier1Group.add(rightSlice);
    cakeGroup.add(tier1Group);
    
    // Add tier 2 (middle tier)
    createCakeTier(tiers[1], leftSlice, true, pastelGreen, glazeGreen);
    createCakeTier(tiers[1], rightSlice, false, pastelGreen, glazeGreen);
    tier2Group.add(leftSlice);
    tier2Group.add(rightSlice);
    cakeGroup.add(tier2Group);
    
    // Add tier 3 (top tier)
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

    // Create sparkle particle system
    particleSystemRef.current = createSparkles(scene);

    // Set initial scales for reveal
    baseGroup.scale.set(0.01, 0.01, 0.01);
    tier1Group.scale.set(0.01, 0.01, 0.01);
    tier2Group.scale.set(0.01, 0.01, 0.01);
    tier3Group.scale.set(0.01, 0.01, 0.01);
    decoGroup.scale.set(0.01, 0.01, 0.01);

    scene.add(cakeGroup);
    cakeGroupRef.current = cakeGroup;
    setIsLoading(false);

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
      
      // Render with post-processing
      if (composer) {
        composer.render();
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
      
      if (composer) {
        composer.setSize(window.innerWidth, window.innerHeight);
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

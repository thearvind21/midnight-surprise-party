import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
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

export const CakeScene = ({ userName, rotation = 0, zoom = 1 }: CakeSceneProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showGalleryBtn, setShowGalleryBtn] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const cakeGroupRef = useRef<THREE.Group | null>(null);
  const flameRefs = useRef<THREE.Mesh[]>([]);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

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

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasRef.current.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(0, 10, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);
    // Soft spotlight from above
    const spotLight = new THREE.SpotLight(0xfff7e6, 1.5, 20, Math.PI / 5, 0.5, 2);
    spotLight.position.set(0, 8, 0);
    spotLight.castShadow = true;
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

    // Add tier 1
    {
      const tier = tiers[0];
      const geo = new THREE.CylinderGeometry(tier.r, tier.r, tier.h, 64);
      const mat = new THREE.MeshPhongMaterial({ color: pastelGreen, shininess: 120 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = tier.y;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      tier1Group.add(mesh);
      // Glaze
      const dripGeo = new THREE.TorusGeometry(tier.r + 0.05, 0.08, 16, 64);
      const dripMat = new THREE.MeshPhongMaterial({ color: glazeGreen, shininess: 150 });
      const drip = new THREE.Mesh(dripGeo, dripMat);
      drip.position.y = tier.y + tier.h / 2 - 0.05;
      drip.rotation.x = Math.PI / 2;
      tier1Group.add(drip);
      // Random glaze drips
      for (let d = 0; d < 12; d++) {
        const angle = (d / 12) * Math.PI * 2 + Math.random() * 0.2;
        const dripLen = 0.18 + Math.random() * 0.18;
        const dripGeo = new THREE.SphereGeometry(0.07 + Math.random() * 0.04, 10, 10);
        const dripMat = new THREE.MeshPhongMaterial({ color: glazeGreen, shininess: 150 });
        const dripDrop = new THREE.Mesh(dripGeo, dripMat);
        dripDrop.position.set(
          Math.cos(angle) * (tier.r + 0.07),
          tier.y + tier.h / 2 - dripLen,
          Math.sin(angle) * (tier.r + 0.07)
        );
        tier1Group.add(dripDrop);
      }
      cakeGroup.add(tier1Group);
    }
    // Add tier 2
    {
      const tier = tiers[1];
      const geo = new THREE.CylinderGeometry(tier.r, tier.r, tier.h, 64);
      const mat = new THREE.MeshPhongMaterial({ color: pastelGreen, shininess: 120 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = tier.y;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      tier2Group.add(mesh);
      // Glaze
      const dripGeo = new THREE.TorusGeometry(tier.r + 0.05, 0.08, 16, 64);
      const dripMat = new THREE.MeshPhongMaterial({ color: glazeGreen, shininess: 150 });
      const drip = new THREE.Mesh(dripGeo, dripMat);
      drip.position.y = tier.y + tier.h / 2 - 0.05;
      drip.rotation.x = Math.PI / 2;
      tier2Group.add(drip);
      // Random glaze drips
      for (let d = 0; d < 12; d++) {
        const angle = (d / 12) * Math.PI * 2 + Math.random() * 0.2;
        const dripLen = 0.18 + Math.random() * 0.18;
        const dripGeo = new THREE.SphereGeometry(0.07 + Math.random() * 0.04, 10, 10);
        const dripMat = new THREE.MeshPhongMaterial({ color: glazeGreen, shininess: 150 });
        const dripDrop = new THREE.Mesh(dripGeo, dripMat);
        dripDrop.position.set(
          Math.cos(angle) * (tier.r + 0.07),
          tier.y + tier.h / 2 - dripLen,
          Math.sin(angle) * (tier.r + 0.07)
        );
        tier2Group.add(dripDrop);
      }
      cakeGroup.add(tier2Group);
    }
    // Add tier 3
    {
      const tier = tiers[2];
      const geo = new THREE.CylinderGeometry(tier.r, tier.r, tier.h, 64);
      const mat = new THREE.MeshPhongMaterial({ color: pastelGreen, shininess: 120 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = tier.y;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      tier3Group.add(mesh);
      // Glaze
      const dripGeo = new THREE.TorusGeometry(tier.r + 0.05, 0.08, 16, 64);
      const dripMat = new THREE.MeshPhongMaterial({ color: glazeGreen, shininess: 150 });
      const drip = new THREE.Mesh(dripGeo, dripMat);
      drip.position.y = tier.y + tier.h / 2 - 0.05;
      drip.rotation.x = Math.PI / 2;
      tier3Group.add(drip);
      // Random glaze drips
      for (let d = 0; d < 12; d++) {
        const angle = (d / 12) * Math.PI * 2 + Math.random() * 0.2;
        const dripLen = 0.18 + Math.random() * 0.18;
        const dripGeo = new THREE.SphereGeometry(0.07 + Math.random() * 0.04, 10, 10);
        const dripMat = new THREE.MeshPhongMaterial({ color: glazeGreen, shininess: 150 });
        const dripDrop = new THREE.Mesh(dripGeo, dripMat);
        dripDrop.position.set(
          Math.cos(angle) * (tier.r + 0.07),
          tier.y + tier.h / 2 - dripLen,
          Math.sin(angle) * (tier.r + 0.07)
        );
        tier3Group.add(dripDrop);
      }
      cakeGroup.add(tier3Group);
    }

    // Add succulents, pebbles, candles, flower to decoGroup (appears last)
    function addSucculent(x: number, y: number, z: number, scale = 1, color = 0x8fd19e, tall = false) {
      const group = new THREE.Group();
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const sx = Math.cos(angle) * 0.18 * scale;
        const sz = Math.sin(angle) * 0.18 * scale;
        const geo = new THREE.SphereGeometry(0.13 * scale, 12, 12);
        const mat = new THREE.MeshPhongMaterial({ color, shininess: 80 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(sx, 0, sz);
        group.add(mesh);
      }
      const centerGeo = new THREE.SphereGeometry(0.12 * scale, 12, 12);
      const centerMat = new THREE.MeshPhongMaterial({ color: 0xb6e2a1, shininess: 100 });
      const center = new THREE.Mesh(centerGeo, centerMat);
      group.add(center);
      if (tall) {
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.2;
          const leafGeo = new THREE.ConeGeometry(0.07 * scale, 0.5 * scale + Math.random() * 0.2, 8);
          const leafMat = new THREE.MeshPhongMaterial({ color: 0x7fc97f, shininess: 80 });
          const leaf = new THREE.Mesh(leafGeo, leafMat);
          leaf.position.set(Math.cos(angle) * 0.13 * scale, 0.25 * scale, Math.sin(angle) * 0.13 * scale);
          leaf.rotation.x = Math.PI / 2 + Math.random() * 0.3;
          leaf.rotation.z = angle;
          group.add(leaf);
        }
      }
      group.position.set(x, y, z);
      decoGroup.add(group);
    }
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      addSucculent(Math.cos(angle) * 1.7, -0.2, Math.sin(angle) * 1.7, 1, 0x8fd19e, i % 3 === 0);
      if (i % 2 === 0) addSucculent(Math.cos(angle) * 1.1, 0.6, Math.sin(angle) * 1.1, 0.7, 0x9e8fd1, i % 4 === 0);
      if (i % 3 === 0) addSucculent(Math.cos(angle) * 0.6, 1.3, Math.sin(angle) * 0.6, 0.5, 0xd1a98f, i % 5 === 0);
    }
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const pebbleGeo = new THREE.SphereGeometry(0.09 + Math.random() * 0.05, 8, 8);
      const pebbleMat = new THREE.MeshPhongMaterial({ color: 0xcfcfcf + Math.floor(Math.random() * 0x30), shininess: 30 });
      const pebble = new THREE.Mesh(pebbleGeo, pebbleMat);
      pebble.position.set(Math.cos(angle) * 2.7, -1.0 + Math.random() * 0.05, Math.sin(angle) * 2.7);
      decoGroup.add(pebble);
    }
    flameRefs.current = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const candleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 8);
      const candleMat = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 });
      const candle = new THREE.Mesh(candleGeo, candleMat);
      candle.position.set(Math.cos(angle) * 0.35, 1.45, Math.sin(angle) * 0.35);
      decoGroup.add(candle);
      const flameGeo = new THREE.ConeGeometry(0.06, 0.13, 8);
      const flameMat = new THREE.MeshPhongMaterial({ color: 0xffe066, emissive: 0xffc300, emissiveIntensity: 0.7 });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(0, 0.22, 0);
      candle.add(flame);
      flameRefs.current.push(flame);
    }
    const flowerGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const color = new THREE.Color().lerpColors(
        new THREE.Color(0xffb347),
        new THREE.Color(0xff6f61),
        i / 12
      );
      const petalGeo = new THREE.ConeGeometry(0.11, 0.36, 16);
      const petalMat = new THREE.MeshPhongMaterial({ color, shininess: 120 });
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(Math.cos(angle) * 0.19, 1.62, Math.sin(angle) * 0.19);
      petal.rotation.x = Math.PI / 2 + 0.2;
      petal.rotation.z = angle;
      flowerGroup.add(petal);
    }
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const petalGeo = new THREE.ConeGeometry(0.08, 0.22, 12);
      const petalMat = new THREE.MeshPhongMaterial({ color: 0xffb347, shininess: 120 });
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(Math.cos(angle) * 0.11, 1.58, Math.sin(angle) * 0.11);
      petal.rotation.x = Math.PI / 2 + 0.2;
      petal.rotation.z = angle;
      flowerGroup.add(petal);
    }
    const flowerCenterGeo = new THREE.SphereGeometry(0.09, 14, 14);
    const flowerCenterMat = new THREE.MeshPhongMaterial({ color: 0xffe066, shininess: 120 });
    const flowerCenter = new THREE.Mesh(flowerCenterGeo, flowerCenterMat);
    flowerCenter.position.set(0, 1.68, 0);
    flowerGroup.add(flowerCenter);
    decoGroup.add(flowerGroup);
    cakeGroup.add(decoGroup);

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
      if (cakeGroupRef.current) {
        // Automatic rotation disabled to support manual rotation
        // cakeGroupRef.current.rotation.y += 0.003;
      }
      // Animate candle flames (flicker)
      const t = (Date.now() - startTime) / 1000;
      flameRefs.current.forEach((flame, idx) => {
        const scale = 1 + Math.sin(t * 8 + idx) * 0.15 + Math.random() * 0.07;
        flame.scale.y = scale;
        if (flame.material instanceof THREE.MeshPhongMaterial) {
          flame.material.emissiveIntensity = 0.7 + Math.sin(t * 10 + idx) * 0.3 + Math.random() * 0.1;
        }
      });
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
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
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
            onClick={() => setShowPopup(true)}
            disabled={revealStep < 5}
          >
            Cut the Cake
          </button>
        </div>
      )}
      {showPopup && !showGallery && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">🎉 Happy Birthday, {userName}! 🎉</h2>
            <p className="mb-6 text-lg">Wishing you a sweet year ahead. Enjoy your cake!</p>
            <button
              className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition"
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
      )}
      {showGalleryBtn && !showGallery && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
          <button
            className="px-8 py-3 bg-white text-purple-700 font-semibold rounded-full shadow-lg hover:bg-purple-100 transition"
            onClick={() => setShowGallery(true)}
          >
            Gallery
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

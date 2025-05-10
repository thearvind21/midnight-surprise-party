
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { CakeDecorations } from "./CakeDecorations";

interface CakeSceneProps {
  userName: string;
  cakeCut: boolean;
  onCuttingAnimationChange: (animating: boolean) => void;
  cuttingAnimation: boolean;
}

export const CakeScene = ({ userName, cakeCut, onCuttingAnimationChange, cuttingAnimation }: CakeSceneProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create sparkle particles
  const createSparkles = (scene: THREE.Scene, position: THREE.Vector3, count = 50) => {
    const particles = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];
    
    const sparkleColors = [
      new THREE.Color(0xffd700), // Gold
      new THREE.Color(0xffffff), // White
      new THREE.Color(0xff1493), // Pink
      new THREE.Color(0x00ffff), // Cyan
    ];
    
    for (let i = 0; i < count; i++) {
      // Random position in a sphere
      const radius = Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const x = position.x + radius * Math.sin(phi) * Math.cos(theta);
      const y = position.y + radius * Math.sin(phi) * Math.sin(theta);
      const z = position.z + radius * Math.cos(phi);
      
      positions.push(x, y, z);
      
      // Random color
      const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
      colors.push(color.r, color.g, color.b);
      
      // Random size
      sizes.push(Math.random() * 0.05 + 0.02);
    }
    
    particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    const sparkleTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/spark1.png');
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      map: sparkleTexture,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true,
    });
    
    const sparkleParticles = new THREE.Points(particles, particlesMaterial);
    sparkleParticles.userData = { isSparkle: true, createdAt: Date.now() };
    scene.add(sparkleParticles);
    
    return sparkleParticles;
  };
  
  // Add name to cake
  const addNameToCake = (scene: THREE.Scene, name: string) => {
    // Create a placeholder for the name until the font loads
    const loader = new FontLoader();
    
    loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
      const textGeometry = new TextGeometry(name, {
        font: font,
        size: 0.4,
        height: 0.05,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelSegments: 3
      });
      
      // Make sure the geometry is properly initialized before accessing boundingBox
      const boundingBox = new THREE.Box3().setFromObject(new THREE.Mesh(textGeometry));
      const textWidth = boundingBox.max.x - boundingBox.min.x;
      
      const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      
      // Center the text
      textMesh.position.set(-textWidth / 2, 1.2, -1.5);
      textMesh.rotation.x = -Math.PI / 12;
      
      scene.add(textMesh);
      setIsLoading(false);
    });
  };
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    canvasRef.current.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0xffdee2, 1);
    spotLight.position.set(5, 10, 5);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.castShadow = true;
    scene.add(spotLight);
    
    // Add warm lights for ambiance
    const pinkLight = new THREE.PointLight(0xff9999, 0.5);
    pinkLight.position.set(-3, 5, 2);
    scene.add(pinkLight);
    
    const blueLight = new THREE.PointLight(0x9999ff, 0.5);
    blueLight.position.set(3, 5, -2);
    scene.add(blueLight);
    
    // Create cake base with frosting texture
    const cakeBaseGeometry = new THREE.CylinderGeometry(2.5, 2.5, 1, 32);
    const cakeBaseMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffdee2,
      shininess: 30
    });
    const cakeBase = new THREE.Mesh(cakeBaseGeometry, cakeBaseMaterial);
    scene.add(cakeBase);
    
    // Create cake middle layer
    const cakeMiddleGeometry = new THREE.CylinderGeometry(2, 2, 1, 32);
    const cakeMiddleMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xe5deff,
      shininess: 30
    });
    const cakeMiddle = new THREE.Mesh(cakeMiddleGeometry, cakeMiddleMaterial);
    cakeMiddle.position.y = 1;
    scene.add(cakeMiddle);
    
    // Create cake top layer
    const cakeTopGeometry = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const cakeTopMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xfde1d3,
      shininess: 30
    });
    const cakeTop = new THREE.Mesh(cakeTopGeometry, cakeTopMaterial);
    cakeTop.position.y = 2;
    scene.add(cakeTop);
    
    // Add cake decorations
    CakeDecorations.addCakeDecorations(scene, cakeTop, cakeMiddle, cakeBase);
    
    // Add name to cake
    addNameToCake(scene, userName);
    
    // Add candles
    const candles: THREE.Mesh[] = [];
    const candleCount = 5;
    const radius = 0.7;
    
    const createCandle = (x: number, z: number) => {
      const candleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
      const candleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xfcd0a1,
        shininess: 100
      });
      const candle = new THREE.Mesh(candleGeometry, candleMaterial);
      candle.position.set(x, 2.5, z);
      
      // Add flame
      const flameGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const flameMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff6600,
        emissive: 0xff9900,
        emissiveIntensity: 0.8
      });
      const flame = new THREE.Mesh(flameGeometry, flameMaterial);
      flame.position.y = 0.6;
      flame.userData = { isFlame: true };
      
      // Add glow effect to flame
      const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffcc00,
        transparent: true,
        opacity: 0.4
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      flame.add(glow);
      
      candle.add(flame);
      scene.add(candle);
      return candle;
    };
    
    // Add candles in a circle on the top layer
    for (let i = 0; i < candleCount; i++) {
      const angle = (i / candleCount) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      candles.push(createCandle(x, z));
    }
    
    // Position camera
    camera.position.z = 8;
    camera.position.y = 3;
    
    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation
    const sparkles: THREE.Points[] = [];
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate cake
      cakeBase.rotation.y += 0.003;
      cakeMiddle.rotation.y += 0.003;
      cakeTop.rotation.y += 0.003;
      
      // Make flames flicker
      if (!cakeCut) {
        candles.forEach(candle => {
          candle.children.forEach(child => {
            if (child.userData.isFlame) {
              child.scale.y = 0.9 + Math.sin(Date.now() * 0.01) * 0.1;
              child.scale.x = 0.9 + Math.cos(Date.now() * 0.01) * 0.1;
            }
          });
        });
      }
      
      // Animate sparkles if cake is cut
      if (cuttingAnimation || cakeCut) {
        // Remove old sparkles
        const now = Date.now();
        const removeIndices: number[] = [];
        
        sparkles.forEach((sparkle, index) => {
          if (now - sparkle.userData.createdAt > 2000) {
            removeIndices.push(index);
            scene.remove(sparkle);
          } else {
            // Move sparkles upward and outward
            sparkle.position.y += 0.02;
            const positions = sparkle.geometry.attributes.position.array as Float32Array;
            
            for (let i = 0; i < positions.length; i += 3) {
              // Expand outward
              positions[i] *= 1.01;     // x
              positions[i + 2] *= 1.01; // z
            }
            
            sparkle.geometry.attributes.position.needsUpdate = true;
            
            // Fade out
            const opacity = 1 - (now - sparkle.userData.createdAt) / 2000;
            (sparkle.material as THREE.PointsMaterial).opacity = opacity;
          }
        });
        
        // Clean up removed sparkles
        for (let i = removeIndices.length - 1; i >= 0; i--) {
          sparkles.splice(removeIndices[i], 1);
        }
        
        if (cuttingAnimation && sparkles.length < 3) {
          // Add new sparkles during cutting animation
          const positions = [
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(1, 1.5, 0.5),
            new THREE.Vector3(-0.5, 2, -0.5),
            new THREE.Vector3(0.7, 0.5, 0.2),
            new THREE.Vector3(-0.3, 0.8, 0.6),
          ];
          
          const randomPos = positions[Math.floor(Math.random() * positions.length)];
          sparkles.push(createSparkles(scene, randomPos, 30));
        }
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle cake cutting
    if (cakeCut) {
      // Extinguish candles
      candles.forEach(candle => {
        candle.children.forEach(child => {
          if (child.userData.isFlame) {
            candle.remove(child);
          }
        });
      });
    }
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvasRef.current) {
        canvasRef.current.innerHTML = '';
      }
    };
  }, [cakeCut, userName, cuttingAnimation]);

  return (
    <>
      {/* Three.js container */}
      <div ref={canvasRef} className="absolute inset-0 z-0"></div>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-birthday-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-medium">Preparing your cake...</p>
          </div>
        </div>
      )}
    </>
  );
};

export const createSparklesAtPosition = (scene: THREE.Scene, position: THREE.Vector3, count = 50) => {
  // Reuse the createSparkles logic from CakeScene for external use
  const particles = new THREE.BufferGeometry();
  const positions: number[] = [];
  const colors: number[] = [];
  const sizes: number[] = [];
  
  const sparkleColors = [
    new THREE.Color(0xffd700), // Gold
    new THREE.Color(0xffffff), // White
    new THREE.Color(0xff1493), // Pink
    new THREE.Color(0x00ffff), // Cyan
  ];
  
  for (let i = 0; i < count; i++) {
    // Random position in a sphere
    const radius = Math.random() * 0.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    const x = position.x + radius * Math.sin(phi) * Math.cos(theta);
    const y = position.y + radius * Math.sin(phi) * Math.sin(theta);
    const z = position.z + radius * Math.cos(phi);
    
    positions.push(x, y, z);
    
    // Random color
    const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    colors.push(color.r, color.g, color.b);
    
    // Random size
    sizes.push(Math.random() * 0.05 + 0.02);
  }
  
  particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  particles.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
  
  const sparkleTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/spark1.png');
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    map: sparkleTexture,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    vertexColors: true,
  });
  
  const sparkleParticles = new THREE.Points(particles, particlesMaterial);
  sparkleParticles.userData = { isSparkle: true, createdAt: Date.now() };
  scene.add(sparkleParticles);
  
  return sparkleParticles;
};

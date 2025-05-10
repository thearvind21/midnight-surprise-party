
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BirthdayContext } from "@/contexts/BirthdayContext";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

const CakePage = () => {
  const { isBirthdayTime, cakeCut, setCakeCut } = useContext(BirthdayContext);
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userName] = useState("Sarah"); // Replace with actual name or from context
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [cuttingAnimation, setCuttingAnimation] = useState(false);
  
  // Redirect if not birthday time yet
  useEffect(() => {
    if (!isBirthdayTime) {
      navigate("/");
    }
    
    // Initialize audio
    audioRef.current = new Audio("https://www.chosic.com/wp-content/uploads/2020/05/Happy-Birthday-To-You-Song.mp3");
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isBirthdayTime, navigate]);

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
  
  // Add cake decorations
  const addCakeDecorations = (
    scene: THREE.Scene, 
    cakeTop: THREE.Mesh,
    cakeMiddle: THREE.Mesh,
    cakeBase: THREE.Mesh
  ) => {
    // Add icing
    const icingGeometry = new THREE.TorusGeometry(1.55, 0.15, 8, 24);
    const icingMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const icing = new THREE.Mesh(icingGeometry, icingMaterial);
    icing.position.y = 2.55;
    icing.rotation.x = Math.PI / 2;
    scene.add(icing);
    
    // Add sprinkles to all layers
    addSprinkles(scene, cakeTop.position.y + 0.5, 1.5);
    addSprinkles(scene, cakeMiddle.position.y + 0.5, 2);
    addSprinkles(scene, cakeBase.position.y + 0.5, 2.5);
    
    // Add cherries on top
    addCherry(scene, 0, 2.6, 0);
    addCherry(scene, 0.8, 2.6, 0.3);
    addCherry(scene, -0.6, 2.6, -0.5);
    addCherry(scene, 0.5, 2.6, -0.7);
    
    // Add chocolate decorations
    addChocolateStick(scene, 0.8, 2.2, 0.8);
    addChocolateStick(scene, -0.7, 2.2, 0.7);
    addChocolateStick(scene, -0.8, 2.2, -0.6);
  };
  
  // Add sprinkles
  const addSprinkles = (scene: THREE.Scene, yPosition: number, radius: number) => {
    const count = 50;
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const sprinkleRadius = Math.random() * (radius - 0.3) + 0.3;
      const x = Math.cos(angle) * sprinkleRadius;
      const z = Math.sin(angle) * sprinkleRadius;
      
      const colors = [0xff6b81, 0x4ecdc4, 0xffbe76, 0xa29bfe, 0xffeaa7];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const sprinkleGeometry = new THREE.BoxGeometry(0.1, 0.03, 0.03);
      const sprinkleMaterial = new THREE.MeshPhongMaterial({ color });
      const sprinkle = new THREE.Mesh(sprinkleGeometry, sprinkleMaterial);
      
      sprinkle.position.set(x, yPosition, z);
      sprinkle.rotation.set(
        Math.random() * Math.PI, 
        Math.random() * Math.PI, 
        Math.random() * Math.PI
      );
      
      scene.add(sprinkle);
    }
  };
  
  // Add cherry
  const addCherry = (scene: THREE.Scene, x: number, y: number, z: number) => {
    const cherryGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const cherryMaterial = new THREE.MeshPhongMaterial({ color: 0xff0033 });
    const cherry = new THREE.Mesh(cherryGeometry, cherryMaterial);
    cherry.position.set(x, y, z);
    scene.add(cherry);
    
    // Add stem
    const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8);
    const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x7d5a4f });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.set(x, y + 0.15, z);
    stem.rotation.x = Math.PI / 6;
    scene.add(stem);
  };
  
  // Add chocolate decoration
  const addChocolateStick = (scene: THREE.Scene, x: number, y: number, z: number) => {
    const stickGeometry = new THREE.BoxGeometry(0.1, 0.7, 0.05);
    const stickMaterial = new THREE.MeshPhongMaterial({ color: 0x4a2c2a });
    const stick = new THREE.Mesh(stickGeometry, stickMaterial);
    stick.position.set(x, y + 0.2, z);
    stick.rotation.set(
      Math.random() * 0.4,
      Math.random() * Math.PI * 2,
      Math.random() * 0.4
    );
    scene.add(stick);
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
      
      textGeometry.computeBoundingBox();
      const textWidth = textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x;
      
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
    addCakeDecorations(scene, cakeTop, cakeMiddle, cakeBase);
    
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
  }, [cakeCut, userName]);

  const handleCutCake = () => {
    // Start cutting animation first
    setCuttingAnimation(true);
    
    // Play cutting sound
    const cuttingSound = new Audio("https://freesound.org/data/previews/234/234782_4019029-lq.mp3");
    cuttingSound.play();
    
    // Add sparkles around cake when cutting
    if (sceneRef.current) {
      for (let i = 0; i < 5; i++) {
        const x = (Math.random() - 0.5) * 3;
        const y = Math.random() * 2 + 0.5;
        const z = (Math.random() - 0.5) * 3;
        createSparkles(sceneRef.current, new THREE.Vector3(x, y, z), 30);
      }
    }
    
    // After animation completes, set cake as cut
    setTimeout(() => {
      setCakeCut();
      
      // Wait a moment before navigating to gallery
      setTimeout(() => {
        navigate("/gallery");
      }, 3000);
    }, 2000);
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-birthday-pink via-birthday-purple to-birthday-blue animate-gradient-slow"></div>
      
      {/* Floating balloons */}
      <div className="absolute top-0 left-1/4 w-12 h-20 bg-birthday-pink rounded-full animate-float-slow"></div>
      <div className="absolute top-10 right-1/3 w-10 h-16 bg-birthday-gold rounded-full animate-float-medium"></div>
      <div className="absolute bottom-20 right-1/4 w-14 h-24 bg-birthday-peach rounded-full animate-float-fast"></div>
      
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
      
      <div className="z-10 p-6 text-center relative">
        <div className="glass-card p-8 rounded-2xl backdrop-blur-md bg-white/30 border border-white/50 shadow-xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 text-white text-shadow-lg animate-fade-in">
            Happy Birthday, {userName}!
          </h1>
          
          {!cakeCut && !cuttingAnimation ? (
            <Button
              onClick={handleCutCake}
              className="bg-birthday-gold hover:bg-birthday-gold/80 text-black font-medium px-8 py-6 text-xl animate-pulse-soft shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              <Sparkles className="h-6 w-6" />
              Cut the Cake!
              <Sparkles className="h-6 w-6" />
            </Button>
          ) : (
            <div className="animate-scale-in">
              <h2 className="text-2xl font-display mb-4 text-white text-shadow-md">Making a wish! 🎂✨</h2>
              {cuttingAnimation && !cakeCut && (
                <p className="mb-4 text-white text-shadow-sm">Cutting the cake...</p>
              )}
              {cakeCut && (
                <>
                  <p className="mb-4 text-white text-shadow-sm">Redirecting to your photo gallery...</p>
                  <div className="w-12 h-12 border-4 border-birthday-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Music control */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMusic}
          className="glass-button w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/40 border-birthday-gold"
        >
          {isMusicPlaying ? <VolumeX className="h-6 w-6 text-white" /> : <Volume2 className="h-6 w-6 text-white" />}
        </Button>
      </div>
      
      {/* Go back button */}
      <div className="absolute bottom-4 left-4 z-20">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="glass-button bg-white/30 backdrop-blur-sm hover:bg-white/40 text-white border-white/50"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default CakePage;


import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BirthdayContext } from "@/contexts/BirthdayContext";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import * as THREE from "three";

const CakePage = () => {
  const { isBirthdayTime, cakeCut, setCakeCut } = useContext(BirthdayContext);
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Set up scene
    const scene = new THREE.Scene();
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
    
    // Create cake base
    const cakeBaseGeometry = new THREE.CylinderGeometry(2.5, 2.5, 1, 32);
    const cakeBaseMaterial = new THREE.MeshPhongMaterial({ color: 0xffdee2 });
    const cakeBase = new THREE.Mesh(cakeBaseGeometry, cakeBaseMaterial);
    scene.add(cakeBase);
    
    // Create cake middle layer
    const cakeMiddleGeometry = new THREE.CylinderGeometry(2, 2, 1, 32);
    const cakeMiddleMaterial = new THREE.MeshPhongMaterial({ color: 0xe5deff });
    const cakeMiddle = new THREE.Mesh(cakeMiddleGeometry, cakeMiddleMaterial);
    cakeMiddle.position.y = 1;
    scene.add(cakeMiddle);
    
    // Create cake top layer
    const cakeTopGeometry = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const cakeTopMaterial = new THREE.MeshPhongMaterial({ color: 0xfde1d3 });
    const cakeTop = new THREE.Mesh(cakeTopGeometry, cakeTopMaterial);
    cakeTop.position.y = 2;
    scene.add(cakeTop);
    
    // Add candles
    const createCandle = (x: number, z: number) => {
      const candleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
      const candleMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
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
      
      candle.add(flame);
      scene.add(candle);
      return candle;
    };
    
    // Add candles in a circle on the top layer
    const candles: THREE.Mesh[] = [];
    const candleCount = 5;
    const radius = 0.7;
    
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
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate cake
      cakeBase.rotation.y += 0.005;
      cakeMiddle.rotation.y += 0.005;
      cakeTop.rotation.y += 0.005;
      
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
  }, [cakeCut]);

  const handleCutCake = () => {
    setCakeCut();
    
    // Wait a moment before navigating to gallery
    setTimeout(() => {
      navigate("/gallery");
    }, 3000);
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
    <div className="min-h-screen flex flex-col items-center justify-center birthday-gradient relative">
      {/* Three.js container */}
      <div ref={canvasRef} className="absolute inset-0"></div>
      
      <div className="z-10 p-6 text-center">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 text-shadow animate-fade-in">
          Happy Birthday!
        </h1>
        
        {!cakeCut ? (
          <Button
            onClick={handleCutCake}
            className="bg-birthday-gold hover:bg-birthday-gold/80 text-black font-medium px-8 py-6 text-xl animate-bounce-soft"
          >
            Cut the Cake! 🔪
          </Button>
        ) : (
          <div className="animate-scale-in">
            <h2 className="text-2xl font-display mb-4">Cake Cut! 🎉</h2>
            <p className="mb-4">Redirecting to your photo gallery...</p>
            <div className="w-12 h-12 border-4 border-birthday-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}
      </div>
      
      {/* Music control */}
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMusic}
          className="bg-white/30 backdrop-blur-sm hover:bg-white/40 border-birthday-gold"
        >
          {isMusicPlaying ? <VolumeX /> : <Volume2 />}
        </Button>
      </div>
      
      {/* Go back button */}
      <div className="absolute bottom-4 left-4">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="bg-white/30 backdrop-blur-sm hover:bg-white/40"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default CakePage;

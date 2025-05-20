
import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BirthdayContext } from "@/contexts/BirthdayContext";
import { CakeScene } from "@/components/cake/CakeScene";
import { CakeControls } from "@/components/cake/CakeControls";

const CakePage = () => {
  const { isBirthdayTime, cakeCut, setCakeCut } = useContext(BirthdayContext);
  const navigate = useNavigate();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [userName] = useState("Sarah"); // Replace with actual name or from context
  const [cuttingAnimation, setCuttingAnimation] = useState(false);
  const [cakeRotation, setCakeRotation] = useState(0);
  const [cakeZoom, setCakeZoom] = useState(1);
  const [activeTheme, setActiveTheme] = useState("default");
  const [forceRender, setForceRender] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Redirect if not birthday time yet
  useEffect(() => {
    if (!isBirthdayTime) {
      navigate("/");
    }
    
    // Initialize audio with better birthday music
    audioRef.current = new Audio("https://www.chosic.com/wp-content/uploads/2020/05/Happy-Birthday-To-You-Song.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5; // Lower volume for better experience
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isBirthdayTime, navigate]);

  // Ensure the cake scene renders correctly on first load
  useEffect(() => {
    if (!isInitialized) {
      // Force re-render after a short delay to ensure everything is loaded
      const timer = setTimeout(() => {
        setForceRender(prev => prev + 1);
        setIsInitialized(true);
      }, 500); // Increased delay for better rendering
      
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  const handleCutCake = () => {
    // Start cutting animation first
    setCuttingAnimation(true);
    
    // After animation completes, set cake as cut
    setTimeout(() => {
      setCakeCut();
      
      // Wait a moment before navigating to gallery
      setTimeout(() => {
        navigate("/gallery");
      }, 5000); // Longer wait time to appreciate the animation
    }, 3500);
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(err => {
        console.log("Audio play error:", err);
        // Some browsers block autoplay, we'll need user interaction
      });
    }
    setIsMusicPlaying(!isMusicPlaying);
  };
  
  const handleRotateCake = (direction: 'left' | 'right') => {
    setCakeRotation(prev => prev + (direction === 'right' ? 0.25 : -0.25));
  };
  
  const handleZoomCake = (direction: 'in' | 'out') => {
    setCakeZoom(prev => {
      if (direction === 'in' && prev < 1.8) return prev + 0.1;
      if (direction === 'out' && prev > 0.6) return prev - 0.1;
      return prev;
    });
  };
  
  const changeTheme = (theme: string) => {
    setActiveTheme(theme);
  };
  
  // Define background styles based on active theme
  const getBackgroundStyle = () => {
    switch(activeTheme) {
      case 'pastel':
        return 'bg-gradient-to-br from-pink-200 via-blue-100 to-green-200';
      case 'vibrant':
        return 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500';
      case 'night':
        return 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900';
      case 'forest':
        return 'bg-gradient-to-br from-emerald-500 to-teal-800';
      default:
        return 'bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300';
    }
  };

  // Use CSS grid for better layout control
  return (
    <div className={`min-h-screen w-full flex flex-col relative ${getBackgroundStyle()} transition-colors duration-1000`}>
      {/* Cake Scene Container - with higher z-index */}
      <div className="absolute inset-0 z-10" key={forceRender}>
        <CakeScene 
          userName={userName} 
          rotation={cakeRotation}
          zoom={cakeZoom}
        />
      </div>
      
      {/* Controls and UI elements - positioned with higher z-index */}
      <div className="relative z-20 w-full h-full pointer-events-none">
        <div className="pointer-events-auto">
          <CakeControls 
            isMusicPlaying={isMusicPlaying}
            toggleMusic={toggleMusic}
            handleCutCake={handleCutCake}
            cakeCut={cakeCut}
            cuttingAnimation={cuttingAnimation}
            userName={userName}
            onRotateCake={handleRotateCake}
            onZoomCake={handleZoomCake}
            onChangeTheme={changeTheme}
            activeTheme={activeTheme}
          />
        </div>
      </div>
    </div>
  );
};

export default CakePage;


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
  
  return (
    <div className="min-h-screen w-full flex flex-col overflow-hidden relative">
      {/* Cake Scene with proper z-index */}
      <CakeScene 
        userName={userName} 
        rotation={cakeRotation}
        zoom={cakeZoom}
      />
      
      {/* Controls with higher z-index */}
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
  );
};

export default CakePage;

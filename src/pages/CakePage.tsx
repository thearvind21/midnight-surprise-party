
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
  const [forceRender, setForceRender] = useState(0); // Add state to force re-render
  
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

  // Force the cake scene to re-render once on component mount
  useEffect(() => {
    setForceRender(prev => prev + 1);
  }, []);

  const handleCutCake = () => {
    // Start cutting animation first
    setCuttingAnimation(true);
    
    // Play cutting sound
    const cuttingSound = new Audio("https://freesound.org/data/previews/234/234782_4019029-lq.mp3");
    cuttingSound.play();
    
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
  
  const handleRotateCake = (direction: 'left' | 'right') => {
    setCakeRotation(prev => prev + (direction === 'right' ? 0.5 : -0.5));
  };
  
  const handleZoomCake = (direction: 'in' | 'out') => {
    setCakeZoom(prev => {
      if (direction === 'in' && prev < 1.5) return prev + 0.1;
      if (direction === 'out' && prev > 0.5) return prev - 0.1;
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
        return 'bg-gradient-to-br from-birthday-pink via-birthday-peach to-birthday-blue';
      case 'vibrant':
        return 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500';
      case 'night':
        return 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900';
      case 'forest':
        return 'bg-gradient-to-br from-emerald-500 to-teal-800';
      default:
        return 'bg-gradient-to-br from-birthday-pink via-birthday-purple to-birthday-blue';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden ${getBackgroundStyle()} transition-colors duration-1000`}>
      {/* Force re-render with key prop */}
      <div className="w-full h-full absolute inset-0" key={forceRender}>
        <CakeScene 
          userName={userName} 
          rotation={cakeRotation}
          zoom={cakeZoom}
        />
      </div>
      
      {/* Controls and UI elements */}
      <div className="relative z-10">
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
  );
};

export default CakePage;

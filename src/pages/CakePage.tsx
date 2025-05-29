import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BirthdayContext } from "@/contexts/BirthdayContext";
import { CakeScene } from "@/components/cake/CakeScene";
import { CakeControls } from "@/components/cake/CakeControls";
import { useCakeCut } from "@/components/cake/hooks/useCakeCut";
import { useCakeScene } from "@/components/cake/hooks/useCakeScene";
import { useCakeReveal } from "@/components/cake/hooks/useCakeReveal";

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

  // Destructure reveal related values from useCakeReveal FIRST
  const { revealStep, revealBtnDisabled, handleRevealNext } = useCakeReveal();

  // Now call other hooks, passing revealStep to useCakeScene
  const { 
    cakeCutRef, showPopup, setShowPopup, showGalleryBtn, setShowGalleryBtn, 
    showGallery, setShowGallery, cuttingAnimation: cutAnimation, confetti: cutConfetti, setConfetti: setCutConfetti, cutCakeAnimation 
  } = useCakeCut();
  const { canvasRef, isLoading, leftSliceRef, rightSliceRef, updateCakeTransform } = useCakeScene(revealStep, activeTheme);
  
  // Redirect if not birthday time yet
  useEffect(() => {
    if (!isBirthdayTime) {
      navigate("/");
    }
    

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
        activeTheme={activeTheme}
      />
      
      {/* Interactive controls panel with glass effect */}
      <div className="fixed top-4 left-4 z-[100] flex flex-col gap-3">
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
          revealStep={revealStep}
          revealBtnDisabled={revealBtnDisabled}
          handleRevealNext={handleRevealNext}
        />
      </div>
    </div>
  );
};

export default CakePage;

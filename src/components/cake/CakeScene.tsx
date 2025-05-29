import { useEffect } from "react";
import * as THREE from "three";
import Confetti from "@/components/Confetti";
import Sparkles from "@/components/Sparkles";
import { CakeSceneProps } from "./types/CakeTypes";
import { useCakeScene } from "./hooks/useCakeScene";
import { useCakeReveal } from "./hooks/useCakeReveal";
import { useCakeCut } from "./hooks/useCakeCut";
import CakeLoadingOverlay from "./components/CakeLoadingOverlay";
import CakeRevealButtons from "./components/CakeRevealButtons";
import CakeBirthdayPopup from "./components/CakeBirthdayPopup";
import CakeGalleryButton from "./components/CakeGalleryButton";
import CakeGalleryView from "./components/CakeGalleryView";

export const CakeScene = ({ userName, rotation = 0, zoom = 1, activeTheme }: CakeSceneProps) => {
  // Custom hooks for different aspects of the cake scene
  const { revealStep, revealBtnDisabled, confetti: revealConfetti, setConfetti: setRevealConfetti, handleRevealNext } = useCakeReveal();
  const { 
    cakeCutRef, showPopup, setShowPopup, showGalleryBtn, setShowGalleryBtn, 
    showGallery, setShowGallery, cuttingAnimation, confetti: cutConfetti, setConfetti: setCutConfetti, cutCakeAnimation 
  } = useCakeCut();
  const { canvasRef, isLoading, leftSliceRef, rightSliceRef, updateCakeTransform } = useCakeScene(revealStep, activeTheme);

  // Apply external rotation and zoom
  useEffect(() => {
    updateCakeTransform(rotation, zoom);
  }, [rotation, zoom, updateCakeTransform]);

  // Handler for cutting the cake
  const handleCutCake = () => {
    cutCakeAnimation(leftSliceRef.current, rightSliceRef.current);
  };

  return (
    <div className="absolute inset-0 z-10">
      <Confetti trigger={revealConfetti || cutConfetti} />
      <Sparkles trigger={revealStep === 5} />
      
      {/* Canvas container */}
      <div ref={canvasRef} className="w-full h-full"></div>
      
      {/* Simple background */}
      <div className="fixed inset-0 bg-gradient-to-br from-birthday-pink via-birthday-purple to-birthday-blue -z-10"></div>
      
      {isLoading && <CakeLoadingOverlay />}
      
      {!showGallery && (
        <CakeRevealButtons
          revealStep={revealStep}
          revealBtnDisabled={revealBtnDisabled}
          handleRevealNext={handleRevealNext}
        />
      )}
      
      {showPopup && !showGallery && (
        <CakeBirthdayPopup
          userName={userName}
          setShowPopup={setShowPopup}
          setShowGalleryBtn={setShowGalleryBtn}
          setConfetti={setCutConfetti}
        />
      )}
      
      {showGalleryBtn && !showGallery && ( // Only show gallery button if not in gallery view
        <CakeGalleryButton setShowGallery={setShowGallery} />
      )}
      
      {showGallery && (
        <CakeGalleryView setShowGallery={setShowGallery} />
      )}
    </div>
  );
};

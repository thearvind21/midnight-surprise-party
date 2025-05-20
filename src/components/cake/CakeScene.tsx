
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

export const CakeScene = ({ userName, rotation = 0, zoom = 1 }: CakeSceneProps) => {
  // Custom hooks for different aspects of the cake scene
  const { revealStep, revealBtnDisabled, confetti, setConfetti, handleRevealNext } = useCakeReveal();
  const { 
    cakeCutRef, showPopup, setShowPopup, showGalleryBtn, setShowGalleryBtn, 
    showGallery, setShowGallery, cuttingAnimation, cutCakeAnimation 
  } = useCakeCut();
  const { canvasRef, isLoading, leftSliceRef, rightSliceRef, updateCakeTransform } = useCakeScene(revealStep);

  // Apply external rotation and zoom
  useEffect(() => {
    updateCakeTransform(rotation, zoom);
  }, [rotation, zoom, updateCakeTransform]);

  // Handler for cutting the cake
  const handleCutCake = () => {
    cutCakeAnimation(leftSliceRef.current, rightSliceRef.current);
  };

  return (
    <>
      <Confetti trigger={confetti} />
      <Sparkles trigger={revealStep === 5} />
      <div ref={canvasRef} className="absolute inset-0 z-0"></div>
      
      {/* Simple background */}
      <div className="fixed inset-0 bg-gradient-to-br from-birthday-pink via-birthday-purple to-birthday-blue -z-10"></div>
      
      {isLoading && <CakeLoadingOverlay />}
      
      {!isLoading && !showPopup && !showGallery && (
        <CakeRevealButtons 
          revealStep={revealStep}
          revealBtnDisabled={revealBtnDisabled}
          handleRevealNext={handleRevealNext}
          cutCakeAnimation={handleCutCake}
          cakeCutRef={cakeCutRef}
        />
      )}
      
      {showPopup && !showGallery && (
        <CakeBirthdayPopup
          userName={userName}
          setShowPopup={setShowPopup}
          setShowGalleryBtn={setShowGalleryBtn}
          setConfetti={setConfetti}
        />
      )}
      
      {showGalleryBtn && !showGallery && (
        <CakeGalleryButton setShowGallery={setShowGallery} />
      )}
      
      {showGallery && (
        <CakeGalleryView setShowGallery={setShowGallery} />
      )}
    </>
  );
};

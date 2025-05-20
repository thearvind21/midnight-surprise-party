
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { cutCakeAnimationImpl } from "../utils/CakeAnimations";
import { useAudio } from "./useAudio";

export const useCakeCut = () => {
  const navigate = useNavigate();
  const { playSound } = useAudio();
  const cakeCutRef = useRef(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showGalleryBtn, setShowGalleryBtn] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [cuttingAnimation, setCuttingAnimation] = useState(false);
  const [confetti, setConfetti] = useState(false);

  // Cut cake animation
  const cutCakeAnimation = (
    leftSlice: THREE.Group | null, 
    rightSlice: THREE.Group | null
  ) => {
    if (!leftSlice || !rightSlice || cakeCutRef.current) return;
    
    cakeCutRef.current = true;
    setCuttingAnimation(true);
    
    // Play cutting sound
    playSound('cut');
    
    // Animate the slices moving apart
    cutCakeAnimationImpl(
      leftSlice,
      rightSlice,
      () => {
        // When animation completes, show celebration effects
        setConfetti(true);
        playSound('sparkle');
        
        // Display popup after a short delay
        setTimeout(() => {
          setShowPopup(true);
        }, 800);
        
        setTimeout(() => {
          setConfetti(false);
          
          // Navigate to gallery after a delay
          setTimeout(() => {
            navigate("/gallery");
          }, 5000);
        }, 3500);
      },
      () => {
        // Halfway through animation callback if needed
      }
    );
  };

  return {
    cakeCutRef,
    showPopup,
    setShowPopup,
    showGalleryBtn,
    setShowGalleryBtn,
    showGallery,
    setShowGallery,
    cuttingAnimation,
    confetti,
    setConfetti,
    cutCakeAnimation
  };
};

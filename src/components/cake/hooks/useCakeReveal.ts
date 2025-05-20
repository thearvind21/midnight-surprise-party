
import { useState } from "react";
import { useAudio } from "./useAudio";

export const useCakeReveal = () => {
  const [revealStep, setRevealStep] = useState(0); // 0=none, 1=base, 2=t1, 3=t2, 4=t3, 5=deco
  const [revealBtnDisabled, setRevealBtnDisabled] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const { playSound } = useAudio();

  // Interactive reveal handler
  const handleRevealNext = () => {
    if (revealStep >= 5) return;
    
    playSound('pop', revealStep);
    setRevealStep(revealStep + 1);
    
    // Dramatic pause before final deco
    if (revealStep === 3) {
      setRevealBtnDisabled(true);
      setTimeout(() => setRevealBtnDisabled(false), 800);
    }
    
    // Confetti and disable after final
    if (revealStep === 4) {
      setRevealBtnDisabled(true);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3500);
    }
  };

  return {
    revealStep,
    revealBtnDisabled,
    confetti,
    setConfetti,
    handleRevealNext,
  };
};


import React from "react";

interface CakeRevealButtonsProps {
  revealStep: number;
  revealBtnDisabled: boolean;
  handleRevealNext: () => void;
  cutCakeAnimation: () => void;
  cakeCutRef: React.MutableRefObject<boolean>;
}

const CakeRevealButtons = ({
  revealStep,
  revealBtnDisabled,
  handleRevealNext,
  cutCakeAnimation,
  cakeCutRef
}: CakeRevealButtonsProps) => {
  return (
    <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center z-10">
      <button
        className="px-8 py-3 mb-4 bg-birthday-gold hover:bg-birthday-gold/80 text-black font-medium rounded-full shadow-lg text-xl animate-pulse-soft"
        onClick={handleRevealNext}
        disabled={revealBtnDisabled || revealStep >= 5}
      >
        {revealStep < 4 && "Next Layer"}
        {revealStep === 4 && "Final Touch!"}
        {revealStep === 5 && "All Layers Revealed!"}
      </button>
      <button
        className="px-8 py-3 bg-white text-purple-700 font-semibold rounded-full shadow-lg hover:bg-purple-100 transition"
        onClick={cutCakeAnimation}
        disabled={revealStep < 5 || cakeCutRef.current}
      >
        Cut the Cake
      </button>
    </div>
  );
};

export default CakeRevealButtons;

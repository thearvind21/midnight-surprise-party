import React from "react";

interface CakeRevealButtonsProps {
  revealStep: number;
  revealBtnDisabled: boolean;
  handleRevealNext: () => void;
}

const CakeRevealButtons = ({
  revealStep,
  revealBtnDisabled,
  handleRevealNext,
}: CakeRevealButtonsProps) => {
  return (
    <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center z-10">
      <button
        className="px-8 py-3 mb-4 bg-birthday-gold hover:bg-birthday-gold/80 text-black font-medium rounded-full shadow-lg text-xl animate-pulse-soft"
        onClick={handleRevealNext}
        disabled={revealBtnDisabled || revealStep >= 5}
      >
        {revealStep === 0 && "Start Building Cake!"}
        {revealStep > 0 && revealStep < 4 && "Next Layer"}
        {revealStep === 4 && "Final Touch!"}
        {revealStep === 5 && "All Layers Revealed!"}
      </button>
    </div>
  );
};

export default CakeRevealButtons;

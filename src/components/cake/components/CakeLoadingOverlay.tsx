
import React from "react";

const CakeLoadingOverlay = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-birthday-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium">Preparing your cake...</p>
      </div>
    </div>
  );
};

export default CakeLoadingOverlay;

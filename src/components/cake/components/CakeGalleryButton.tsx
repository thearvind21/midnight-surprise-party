
import React from "react";

interface CakeGalleryButtonProps {
  setShowGallery: React.Dispatch<React.SetStateAction<boolean>>;
}

const CakeGalleryButton = ({ setShowGallery }: CakeGalleryButtonProps) => {
  return (
    <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
      <button
        className="px-8 py-3 bg-white text-purple-700 font-semibold rounded-full shadow-lg hover:bg-purple-100 transition hover:scale-105 transform"
        onClick={() => setShowGallery(true)}
      >
        View Gallery
      </button>
    </div>
  );
};

export default CakeGalleryButton;

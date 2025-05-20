
import React from "react";

interface CakeGalleryViewProps {
  setShowGallery: React.Dispatch<React.SetStateAction<boolean>>;
}

const CakeGalleryView = ({ setShowGallery }: CakeGalleryViewProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-50">
      <h2 className="text-2xl font-bold mb-6">🎂 Cake Gallery (Coming Soon)</h2>
      <button
        className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition"
        onClick={() => setShowGallery(false)}
      >
        Back to Cake
      </button>
    </div>
  );
};

export default CakeGalleryView;


import React from "react";

interface CakeBirthdayPopupProps {
  userName: string;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setShowGalleryBtn: React.Dispatch<React.SetStateAction<boolean>>;
  setConfetti: React.Dispatch<React.SetStateAction<boolean>>;
}

const CakeBirthdayPopup = ({ 
  userName, 
  setShowPopup,
  setShowGalleryBtn,
  setConfetti 
}: CakeBirthdayPopupProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full bg-gradient-to-br from-white to-purple-50">
        <div className="relative text-center">
          <h2 className="text-2xl font-bold mb-4 animate-fade-in">🎉 Happy Birthday, {userName}! 🎉</h2>
          <div className="typewriter mb-6">
            <p className="text-lg">Wishing you a sweet year ahead filled with joy, success, and beautiful memories!</p>
          </div>
          <button
            className="px-6 py-2 bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-full font-semibold hover:bg-purple-700 transition hover:scale-105 transform shadow-lg"
            onClick={() => {
              setShowPopup(false);
              setShowGalleryBtn(true);
              setConfetti(true);
              setTimeout(() => setConfetti(false), 3500);
            }}
          >
            Thank you!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CakeBirthdayPopup;

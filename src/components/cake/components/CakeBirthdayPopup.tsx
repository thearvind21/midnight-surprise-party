import { useEffect, useState } from "react";

const CakeRevealPopup = ({ allLayersRevealed }) => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (allLayersRevealed) {
      setShowPopup(true);
    }
  }, [allLayersRevealed]);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm">
        <h2 className="text-2xl font-bold text-pink-600">🎉 Surprise! 🎉</h2>
        <p className="mt-4 text-gray-700">
          All Layers Revealed! Here's your wish:
        </p>
        <p className="mt-2 italic text-lg text-purple-700">
          “Wishing you a day full of sweet surprises and joy!” 🎂
        </p>

        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => alert("Open gallery view here!")}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            🎁 View Gallery
          </button>
          <button
            onClick={() => setShowPopup(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CakeRevealPopup;

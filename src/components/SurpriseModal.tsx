import { useEffect } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
}

const SurpriseModal = ({ isOpen, onClose, name }: SurpriseModalProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      gsap.from('.modal-content', {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
      });
    }
  }, [isOpen]);

  const handleShowSurprise = () => {
    gsap.to('.modal-content', {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        navigate('/cake');
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="modal-content bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <h2 className="text-3xl font-bold text-purple-900 mb-4">
          Happy Birthday {name}! 🎁
        </h2>
        <p className="text-gray-600 mb-8">
          Ready for your surprise?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleShowSurprise}
            className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            Yes, Show Me!
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurpriseModal; 
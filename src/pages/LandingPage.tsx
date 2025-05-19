import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const LandingPage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState('');
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);

  useEffect(() => {
    // Create sparkles animation
    const createSparkle = () => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      document.body.appendChild(sparkle);

      gsap.set(sparkle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: 0,
        opacity: 0,
      });

      gsap.to(sparkle, {
        scale: Math.random() * 1 + 0.5,
        opacity: 1,
        duration: Math.random() * 1 + 0.5,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(sparkle, {
            scale: 0,
            opacity: 0,
            duration: Math.random() * 1 + 0.5,
            ease: 'power2.in',
            onComplete: () => {
              document.body.removeChild(sparkle);
            },
          });
        },
      });
    };

    // Create sparkles periodically
    const sparkleInterval = setInterval(createSparkle, 200);

    // Update countdown
    const updateCountdown = () => {
      // Get current time in IST
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
      const istTime = new Date(now.getTime() + istOffset);
      
      // Set target time to midnight IST
      const midnight = new Date(istTime);
      midnight.setHours(0,0, 0, 0);
      midnight.setTime(midnight.getTime() - istOffset); // Convert back to UTC for comparison

      const diff = midnight.getTime() - now.getTime();
      
      if (diff <= 0) {
        setIsTimeUp(true);
        setShowSurpriseModal(true);
        clearInterval(countdownInterval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // Initial animation
    gsap.from('.countdown-container', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    return () => {
      clearInterval(countdownInterval);
      clearInterval(sparkleInterval);
    };
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-red-900 flex items-center justify-center relative overflow-hidden">
      <div className="countdown-container text-center z-10">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 drop-shadow-lg animate-float">
          {timeLeft}
        </h1>
        <p className="text-2xl text-white/80 mb-12 animate-fade-in">
          Something magical is coming...
        </p>
        <p className="text-lg text-white/60">
          Indian Standard Time (IST)
        </p>
      </div>

      {/* Surprise Modal */}
      {showSurpriseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="modal-content bg-white/95 rounded-2xl p-8 max-w-md w-full mx-4 text-center transform transition-all duration-500">
            <div className="animate-bounce mb-6">
              <span className="text-6xl">🎁</span>
            </div>
            <h2 className="text-3xl font-bold text-purple-900 mb-4">
              Surprise Time!
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Are you ready for your special surprise?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleShowSurprise}
                className="px-8 py-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all transform hover:scale-105"
              >
                Yes, Show Me!
              </button>
              <button
                onClick={() => setShowSurpriseModal(false)}
                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all"
              >
                Not Yet
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .sparkle {
          position: fixed;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

import React, { useState, useRef, useEffect } from "react";
import { 
  Music, 
  RotateCw, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  Home, 
  Camera, 
  Gift,
  Volume2,
  VolumeX,
  Eye,
  Star,
  Heart,
  Settings,
  Share,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock context and hooks for demonstration
const useBirthdayContext = () => ({
  isBirthdayTime: true,
  cakeCut: false,
  setCakeCut: () => {}
});

const useCakeReveal = () => ({
  revealStep: 0,
  revealBtnDisabled: false,
  handleRevealNext: () => console.log("Next reveal step")
});

const useCakeCut = () => ({
  cakeCutRef: useRef(null),
  showPopup: false,
  setShowPopup: () => {},
  showGalleryBtn: false,
  setShowGalleryBtn: () => {},
  showGallery: false,
  setShowGallery: () => {},
  cuttingAnimation: false,
  confetti: false,
  setConfetti: () => {},
  cutCakeAnimation: () => {}
});

const useCakeScene = (revealStep, activeTheme) => ({
  canvasRef: useRef(null),
  isLoading: false,
  leftSliceRef: useRef(null),
  rightSliceRef: useRef(null),
  updateCakeTransform: () => {}
});

// Enhanced 3D Cake Scene Component
const CakeScene = ({ userName, rotation, zoom, activeTheme }) => {
  const canvasRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Simulate 3D cake rendering
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const drawCake = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set canvas size to match container
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 80 * zoom;
      
      // Draw cake base with theme colors
      const themeColors = {
        default: ['#FF6B9D', '#C44569', '#F8B500'],
        chocolate: ['#8B4513', '#A0522D', '#CD853F'],
        strawberry: ['#FFB6C1', '#FF69B4', '#FF1493'],
        vanilla: ['#FFF8DC', '#F5DEB3', '#DEB887']
      };
      
      const colors = themeColors[activeTheme] || themeColors.default;
      
      // Cake layers
      for (let i = 2; i >= 0; i--) {
        const layerRadius = baseRadius - (i * 8);
        const layerHeight = 40;
        const y = centerY + (i * 25) - 50;
        
        // Layer shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(centerX - layerRadius, y + layerHeight, layerRadius * 2, 8);
        
        // Layer body
        const gradient = ctx.createLinearGradient(0, y, 0, y + layerHeight);
        gradient.addColorStop(0, colors[i] || colors[0]);
        gradient.addColorStop(1, colors[i] ? `${colors[i]}CC` : `${colors[0]}CC`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(centerX - layerRadius, y, layerRadius * 2, layerHeight);
        
        // Layer highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(centerX - layerRadius, y, layerRadius * 2, 8);
      }
      
      // Candles
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2 / 5) + rotation;
        const candleX = centerX + Math.cos(angle) * (baseRadius - 30);
        const candleY = centerY - 80;
        
        // Candle body
        ctx.fillStyle = '#FFF8DC';
        ctx.fillRect(candleX - 3, candleY, 6, 25);
        
        // Flame
        const flameGradient = ctx.createRadialGradient(candleX, candleY - 8, 0, candleX, candleY - 8, 8);
        flameGradient.addColorStop(0, '#FFA500');
        flameGradient.addColorStop(1, '#FF4500');
        
        ctx.fillStyle = flameGradient;
        ctx.beginPath();
        ctx.ellipse(candleX, candleY - 8, 4, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Decorative elements
      ctx.fillStyle = '#FFD700';
      for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4;
        const x = centerX + Math.cos(angle) * (baseRadius + 20);
        const y = centerY + Math.sin(angle) * 20;
        
        ctx.beginPath();
        ctx.star = function(cx, cy, spikes, outerRadius, innerRadius) {
          let rot = Math.PI / 2 * 3;
          let x = cx;
          let y = cy;
          const step = Math.PI / spikes;
          
          ctx.beginPath();
          ctx.moveTo(cx, cy - outerRadius);
          
          for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
          }
          
          ctx.lineTo(cx, cy - outerRadius);
          ctx.closePath();
        };
        
        ctx.star(x, y, 5, 6, 3);
        ctx.fill();
      }
    };
    
    drawCake();
    
    const animationFrame = requestAnimationFrame(drawCake);
    return () => cancelAnimationFrame(animationFrame);
  }, [rotation, zoom, activeTheme]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Celebration Message */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-yellow-500 bg-clip-text drop-shadow-lg mb-2">
          Happy Birthday {userName}! 🎉
        </h1>
        <p className="text-xl text-white/90 drop-shadow-md">
          Make a wish and blow out the candles!
        </p>
      </div>

      {/* 3D Cake Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-96 h-96 transition-all duration-300 ${
          isInteracting ? 'scale-105' : 'hover:scale-105'
        } cursor-pointer drop-shadow-2xl`}
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
        style={{
          filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.3))'
        }}
      />

      {/* Floating particles around cake */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${20 + (i * 60) % 80}%`,
              top: `${30 + (i * 37) % 40}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + (i % 3)}s`
            }}
          >
            <span className="text-2xl opacity-70">
              {['🎈', '✨', '🎊', '🌟'][i % 4]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Controls Panel
const CakeControls = ({ 
  isMusicPlaying, 
  toggleMusic, 
  handleCutCake, 
  cakeCut, 
  cuttingAnimation,
  userName,
  onRotateCake,
  onZoomCake,
  onChangeTheme,
  activeTheme,
  revealStep,
  revealBtnDisabled,
  handleRevealNext
}) => {
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  
  const themes = [
    { id: 'default', name: 'Classic', color: 'from-pink-400 to-purple-500', emoji: '🎂' },
    { id: 'chocolate', name: 'Chocolate', color: 'from-amber-600 to-orange-700', emoji: '🍫' },
    { id: 'strawberry', name: 'Strawberry', color: 'from-pink-300 to-red-400', emoji: '🍓' },
    { id: 'vanilla', name: 'Vanilla', color: 'from-yellow-200 to-amber-300', emoji: '🍰' }
  ];

  return (
    <>
      {/* Main Controls Panel */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium text-sm">Cake Controls</span>
            </div>
            <button
              onClick={() => setShowMainMenu(!showMainMenu)}
              className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Settings className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Primary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={toggleMusic}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                isMusicPlaying
                  ? 'bg-green-500/80 text-white shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {isMusicPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-sm">{isMusicPlaying ? 'Playing' : 'Music'}</span>
            </button>

            <button
              onClick={handleRevealNext}
              disabled={revealBtnDisabled}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">Reveal</span>
            </button>
          </div>

          {/* Cake Interaction Controls */}
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => onRotateCake('left')}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Rotate Left"
            >
              <RotateCcw className="w-4 h-4 text-white mx-auto" />
            </button>
            <button
              onClick={() => onRotateCake('right')}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Rotate Right"
            >
              <RotateCw className="w-4 h-4 text-white mx-auto" />
            </button>
            <button
              onClick={() => onZoomCake('in')}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-white mx-auto" />
            </button>
            <button
              onClick={() => onZoomCake('out')}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-white mx-auto" />
            </button>
          </div>

          {/* Theme Selector */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${themes.find(t => t.id === activeTheme)?.color}`} />
                <span className="text-white text-sm">
                  {themes.find(t => t.id === activeTheme)?.name} Theme
                </span>
              </div>
              <Sparkles className="w-4 h-4 text-white" />
            </button>

            {showThemeMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl rounded-xl p-2 border border-white/20 shadow-2xl z-50">
                {themes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onChangeTheme(theme.id);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTheme === theme.id
                        ? 'bg-purple-100 text-purple-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{theme.emoji}</span>
                    <span className="text-sm font-medium">{theme.name}</span>
                    <div className={`ml-auto w-3 h-3 rounded-full bg-gradient-to-r ${theme.color}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cut Cake Button */}
          {!cakeCut && (
            <button
              onClick={handleCutCake}
              disabled={cuttingAnimation}
              className={`w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-semibold text-lg shadow-xl transition-all ${
                cuttingAnimation
                  ? 'bg-gradient-to-r from-orange-400 to-red-500 animate-pulse'
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 hover:scale-105'
              } text-white`}
            >
              <Heart className="w-5 h-5" />
              {cuttingAnimation ? 'Cutting...' : 'Cut the Cake!'}
            </button>
          )}
        </div>
      </div>

      {/* Extended Menu Panel */}
      {showMainMenu && (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl">
          <div className="flex flex-col gap-2">
            <h3 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
              <Star className="w-4 h-4" />
              More Actions
            </h3>
            
            <button className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors">
              <Camera className="w-4 h-4" />
              <span className="text-sm">Take Photo</span>
            </button>
            
            <button className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors">
              <Share className="w-4 h-4" />
              <span className="text-sm">Share Moment</span>
            </button>
            
            <button className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm">Save Memory</span>
            </button>
            
            <hr className="border-white/20 my-2" />
            
            <button className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors">
              <Home className="w-4 h-4" />
              <span className="text-sm">Back Home</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Main Cake Page Component
const CakePage = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  const [userName] = useState("Sarah");
  const [cuttingAnimation, setCuttingAnimation] = useState(false);
  const [cakeRotation, setCakeRotation] = useState(0);
  const [cakeZoom, setCakeZoom] = useState(1);
  const [activeTheme, setActiveTheme] = useState("default");
  const [showRevealPopup, setShowRevealPopup] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);
  const navigate = useNavigate();

  const { revealStep, revealBtnDisabled, handleRevealNext } = useCakeReveal();
  const { 
    cakeCutRef, showPopup, setShowPopup, showGalleryBtn, setShowGalleryBtn, 
    showGallery, setShowGallery, cuttingAnimation: cutAnimation, confetti: cutConfetti, setConfetti: setCutConfetti, cutCakeAnimation 
  } = useCakeCut();
  const { canvasRef, isLoading, leftSliceRef, rightSliceRef, updateCakeTransform } = useCakeScene(revealStep, activeTheme);

  const handleCutCake = () => {
    setCuttingAnimation(true);
    setTimeout(() => {
      setCakeCut(true);
      if (setCutConfetti) setCutConfetti();
      if (setShowPopup) setShowPopup();
      setTimeout(() => {
        if (setShowGallery) setShowGallery();
      }, 5000);
    }, 3500);
  };

  const handleRevealNextWithPopup = () => {
    handleRevealNext && handleRevealNext();
    setShowRevealPopup(true);
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(err => {
        console.log("Audio play error:", err);
      });
    }
    setIsMusicPlaying(!isMusicPlaying);
  };
  
  const handleRotateCake = (direction) => {
    setCakeRotation(prev => prev + (direction === 'right' ? 0.25 : -0.25));
  };
  
  const handleZoomCake = (direction) => {
    setCakeZoom(prev => {
      if (direction === 'in' && prev < 1.8) return prev + 0.1;
      if (direction === 'out' && prev > 0.6) return prev - 0.1;
      return prev;
    });
  };
  
  const changeTheme = (theme) => {
    setActiveTheme(theme);
  };

  // Dynamic background based on theme
  const getBackgroundStyle = () => {
    switch(activeTheme) {
      case 'chocolate':
        return 'bg-gradient-to-br from-amber-900 via-orange-800 to-red-900';
      case 'strawberry':
        return 'bg-gradient-to-br from-pink-600 via-rose-500 to-red-600';
      case 'vanilla':
        return 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600';
      default:
        return 'bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-700';
    }
  };
  
  return (
    <div className={`min-h-screen w-full flex flex-col overflow-hidden relative transition-all duration-1000 ${getBackgroundStyle()}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            <span className="text-4xl">
              {['🎈', '🎊', '✨', '🌟', '💖'][Math.floor(Math.random() * 5)]}
            </span>
          </div>
        ))}
      </div>

      {/* Cake Scene */}
      <CakeScene 
        userName={userName} 
        rotation={cakeRotation}
        zoom={cakeZoom}
        activeTheme={activeTheme}
      />
      
      {/* Interactive controls panel */}
      <div className="fixed top-6 left-6 z-50 flex flex-col gap-4">
        <CakeControls 
          isMusicPlaying={isMusicPlaying}
          toggleMusic={toggleMusic}
          handleCutCake={handleCutCake}
          cakeCut={cakeCut}
          cuttingAnimation={cuttingAnimation}
          userName={userName}
          onRotateCake={handleRotateCake}
          onZoomCake={handleZoomCake}
          onChangeTheme={changeTheme}
          activeTheme={activeTheme}
          revealStep={revealStep}
          revealBtnDisabled={revealBtnDisabled}
          handleRevealNext={handleRevealNextWithPopup}
        />
        {/* Show Gallery Button after cake is cut */}
        {cakeCut && (
          <button
            className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow hover:scale-105 transition"
            onClick={() => navigate("/gallery")}
          >
            🖼️ Go to Gallery
          </button>
        )}
      </div>

      {/* Celebration Status Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 shadow-xl">
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Celebration Live</span>
            </div>
            <div className="w-px h-4 bg-white/30" />
            <span className="text-sm">🎂 {userName}'s Special Day</span>
            <div className="w-px h-4 bg-white/30" />
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm">Make a wish!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} loop>
        <source src="/birthday-song.mp3" type="audio/mpeg" />
      </audio>

      {/* Confetti overlay (if triggered) */}
      {cutConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <span className="text-7xl animate-bounce">🎉</span>
        </div>
      )}
      {/* Cut Cake Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-xs">
            <span className="text-5xl">🎂</span>
            <h2 className="text-2xl font-bold text-pink-600">Cake Cut!</h2>
            <p className="text-center text-gray-700">Congratulations! The cake is cut. Check out the gallery for sweet memories.</p>
            <button
              className="mt-2 px-4 py-2 bg-gradient-to-r from-pink-400 to-yellow-400 text-white rounded-lg font-semibold shadow hover:scale-105 transition"
              onClick={() => { if (setShowPopup) setShowPopup(); navigate("/gallery"); }}
            >
              View Gallery
            </button>
            <button
              className="text-xs text-gray-400 mt-2 hover:underline"
              onClick={() => { if (setShowPopup) setShowPopup(); }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Gallery Popup */}
      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-xs">
            <span className="text-4xl">🖼️</span>
            <h2 className="text-xl font-bold text-purple-600">Gallery</h2>
            <p className="text-center text-gray-700">Here are your celebration memories! (Gallery content goes here.)</p>
            <button
              className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg font-semibold shadow hover:scale-105 transition"
              onClick={() => { if (setShowGallery) setShowGallery(); }}
            >
              Close Gallery
            </button>
          </div>
        </div>
      )}
      {/* Reveal Popup */}
      {showRevealPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-xs">
            <span className="text-5xl">✨</span>
            <h2 className="text-2xl font-bold text-purple-600">Surprise Revealed!</h2>
            <p className="text-center text-gray-700">A special surprise has been revealed. Enjoy the moment!</p>
            <button
              className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg font-semibold shadow hover:scale-105 transition"
              onClick={() => setShowRevealPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default CakePage;
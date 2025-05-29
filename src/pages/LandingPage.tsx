import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Gift, Calendar, Bell, Music, Settings, Heart } from "lucide-react";

// Mock context data for demonstration
const useBirthdayContext = () => ({
  isBirthdayTime: Math.random() > 0.5, // Random for demo
  setShowSurpriseModal: () => {}
});

const useTimeContext = () => ({
  currentTime: new Date()
});

const CountdownTimer = ({ targetDate }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      });
    }, 1000);

    // Redirect to CakePage after 2 seconds
    setTimeout(() => {
      navigate('/cake');
    }, 2000);

    return () => clearInterval(interval);

    return () => clearInterval(interval);
  }, [targetDate, navigate]);

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="bg-white/25 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
            <div className="text-3xl font-bold text-white mb-1">{value.toString().padStart(2, '0')}</div>
            <div className="text-xs text-white/80 uppercase tracking-wider">{unit}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FloatingParticle = ({ delay = 0, x = 0, y = 0, size = 20, emoji = "✨" }) => {
  const particleRef = useRef(null);

  useEffect(() => {
    if (!particleRef.current) return;
    
    const element = particleRef.current;
    let animationId;
    
    const animate = () => {
      const time = Date.now() * 0.001 + delay;
      const offsetY = Math.sin(time * 0.5) * 20;
      const offsetX = Math.cos(time * 0.3) * 10;
      const rotation = time * 20;
      
      element.style.transform = `translate(${x + offsetX}px, ${y + offsetY}px) rotate(${rotation}deg)`;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [delay, x, y]);

  return (
    <div
      ref={particleRef}
      className="absolute pointer-events-none opacity-60 select-none"
      style={{ fontSize: `${size}px` }}
    >
      {emoji}
    </div>
  );
};

const BackgroundBubble = ({ delay = 0, x = 0, size = 100, color = "bg-pink-200" }) => {
  const bubbleRef = useRef(null);

  useEffect(() => {
    if (!bubbleRef.current) return;
    
    const element = bubbleRef.current;
    let startTime = Date.now() + delay * 1000;
    let animationId;
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = (elapsed % 20) / 20; // 20 second cycle
      
      const y = window.innerHeight + 100 - (window.innerHeight + 200) * progress;
      const wobble = Math.sin(elapsed * 2) * 30;
      const scale = 0.5 + Math.sin(progress * Math.PI) * 0.5;
      const opacity = 0.3 + Math.sin(progress * Math.PI) * 0.3;
      
      element.style.transform = `translate(${x + wobble}px, ${y}px) scale(${scale})`;
      element.style.opacity = opacity;
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [delay, x]);

  return (
    <div
      ref={bubbleRef}
      className={`absolute rounded-full ${color} blur-sm`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}vw`,
      }}
    />
  );
};

const LandingPage = () => {
  const { isBirthdayTime, setShowSurpriseModal } = useBirthdayContext();
  const { currentTime } = useTimeContext();
  const [activeTheme, setActiveTheme] = useState("default");
  const [bubbles, setBubbles] = useState([]);
  const [particles, setParticles] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  // Create bubbles and particles for background
  useEffect(() => {
    const newBubbles = [];
    const colors = [
      "bg-gradient-to-br from-pink-400 to-pink-600",
      "bg-gradient-to-br from-purple-400 to-purple-600", 
      "bg-gradient-to-br from-blue-400 to-blue-600",
      "bg-gradient-to-br from-yellow-400 to-orange-500",
      "bg-gradient-to-br from-green-400 to-emerald-500"
    ];
    
    for (let i = 0; i < 12; i++) {
      newBubbles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 10,
        size: Math.random() * 80 + 40,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setBubbles(newBubbles);

    // Create floating particles
    const newParticles = [];
    const emojis = ["🎉", "🎈", "🎂", "🎁", "✨", "🌟", "💖", "🎊"];
    
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: Math.random() * 5,
        size: Math.random() * 15 + 20,
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
      });
    }
    setParticles(newParticles);
  }, []);
  
  const getBackgroundStyle = () => {
    switch(activeTheme) {
      case "pastel":
        return "bg-gradient-to-br from-pink-100 via-purple-50 via-blue-50 to-yellow-100";
      case "vibrant":
        return "bg-gradient-to-br from-purple-600 via-pink-500 via-orange-500 to-yellow-500";
      case "night":
        return "bg-gradient-to-br from-slate-900 via-purple-900 via-indigo-900 to-slate-800";
      case "sunset":
        return "bg-gradient-to-br from-orange-400 via-pink-500 via-purple-600 to-indigo-700";
      default:
        return "bg-gradient-to-br from-pink-400 via-purple-500 via-blue-500 to-indigo-600";
    }
  };
  
  const handleEnterParty = () => {
    // Add some celebration effect
    setIsHovering(true);
    setTimeout(() => setIsHovering(false), 200);
    
    if (isBirthdayTime) {
      console.log("Navigate to party!");
    } else {
      console.log("Set up notifications");
    }
  };

  const themes = [
    { id: "default", name: "Rainbow", icon: "🌈" },
    { id: "pastel", name: "Pastel", icon: "🌸" },
    { id: "vibrant", name: "Vibrant", icon: "🔥" },
    { id: "night", name: "Night", icon: "🌙" },
    { id: "sunset", name: "Sunset", icon: "🌅" },
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center overflow-hidden relative ${getBackgroundStyle()} transition-all duration-1000`}>
      {/* Animated bubble background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {bubbles.map(bubble => (
          <BackgroundBubble 
            key={bubble.id}
            delay={bubble.delay}
            x={bubble.x}
            size={bubble.size}
            color={bubble.color}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 -z-5 overflow-hidden">
        {particles.map(particle => (
          <FloatingParticle
            key={particle.id}
            delay={particle.delay}
            x={particle.x}
            y={particle.y}
            size={particle.size}
            emoji={particle.emoji}
          />
        ))}
      </div>
      
      {/* Header with brand and settings */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">Birthday Magic</h2>
            <p className="text-white/70 text-sm">Celebrate in style</p>
          </div>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="absolute top-20 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-2xl z-20 animate-in slide-in-from-top-5 duration-300">
          <h3 className="text-gray-800 font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Choose Your Vibe
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setActiveTheme(theme.id);
                  setShowSettings(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTheme === theme.id
                    ? "bg-purple-100 text-purple-800 font-medium shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{theme.icon}</span>
                <span className="text-sm">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Main content card */}
      <div className="w-full max-w-lg mx-auto text-center z-10 px-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
          {/* Header with icon */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">
              Birthday Celebration!
            </h1>
            <p className="text-white/80 text-lg">
              {isBirthdayTime ? "🎉 The party is live!" : "Something magical is coming..."}
            </p>
          </div>
          
          {/* Countdown timer */}
          <CountdownTimer targetDate={new Date()} />
          
          {/* Status message */}
          <div className="mb-8 p-4 bg-white/15 rounded-2xl border border-white/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              {isBirthdayTime ? (
                <>
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-white font-medium">Ready to Celebrate!</span>
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5 text-blue-300" />
                  <span className="text-white font-medium">Almost Time!</span>
                </>
              )}
            </div>
            <p className="text-white/90 text-sm">
              {isBirthdayTime
                ? "Join the celebration and make some memories!"
                : "Get notified when the party begins"}
            </p>
          </div>
          
          {/* Main action button */}
          <Button
            onClick={handleEnterParty}
            className={`w-full py-6 text-xl font-semibold rounded-2xl shadow-xl transform transition-all duration-200 ${
              isBirthdayTime
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            } ${isHovering ? "scale-105 shadow-2xl" : "hover:scale-105"}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="flex items-center justify-center gap-3">
              {isBirthdayTime ? (
                <>
                  <Music className="w-6 h-6" />
                  Enter the Party!
                </>
              ) : (
                <>
                  <Bell className="w-6 h-6" />
                  Notify Me!
                </>
              )}
            </div>
          </Button>
          
          {/* Additional info */}
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/70">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
            <span>•</span>
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 flex justify-center gap-4">
          <button className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors">
            <Gift className="w-6 h-6 text-white" />
          </button>
          <button className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors">
            <Music className="w-6 h-6 text-white" />
          </button>
          <button className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors">
            <Sparkles className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
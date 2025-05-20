import React, { useContext, useState, useEffect, useRef } from "react";
import CountdownTimer from "@/components/CountdownTimer";
import { Button } from "@/components/ui/button";
import { BirthdayContext, TimeContext } from "@/contexts/BirthdayContext";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

const BackgroundBubble = ({ delay = 0, x = 0, size = 100, color = "bg-pink-200" }: any) => {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bubbleRef.current) {
      gsap.fromTo(
        bubbleRef.current,
        {
          y: "120vh",
          x: `${x}vw`,
          scale: 0.5,
          opacity: 0.3,
        },
        {
          y: "-20vh",
          scale: 1,
          opacity: 0.6,
          duration: Math.random() * 10 + 15,
          delay,
          ease: "power1.inOut",
          repeat: -1,
        }
      );
    }
  }, [delay, x]);

  return (
    <div
      ref={bubbleRef}
      className={`absolute rounded-full ${color} blur-md`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    ></div>
  );
};

const LandingPage = () => {
  const { isBirthdayTime, setShowSurpriseModal } = useContext(BirthdayContext);
  const { currentTime } = useContext(TimeContext);
  const [activeTheme, setActiveTheme] = useState("default");
  const [bubbles, setBubbles] = useState<any[]>([]);
  const navigate = useNavigate();
  
  // Create bubbles for background
  useEffect(() => {
    const newBubbles = [];
    const colors = [
      "bg-pink-200/40", 
      "bg-purple-200/40", 
      "bg-blue-200/40", 
      "bg-birthday-gold/20",
      "bg-birthday-peach/40"
    ];
    
    for (let i = 0; i < 15; i++) {
      newBubbles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        size: Math.random() * 100 + 50,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    
    setBubbles(newBubbles);
  }, []);
  
  // Get background style based on theme
  const getBackgroundStyle = () => {
    switch(activeTheme) {
      case "pastel":
        return "bg-gradient-to-br from-pink-100 via-blue-50 to-purple-100";
      case "vibrant":
        return "bg-gradient-to-r from-purple-600 via-pink-600 to-red-500";
      case "night":
        return "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900";
      default:
        return "bg-gradient-to-br from-birthday-pink via-birthday-purple to-birthday-blue";
    }
  };
  
  const handleEnterParty = () => {
    // Check if it's birthday time before showing the modal
    if (isBirthdayTime) {
      // Instead of just showing the modal, navigate to the cake page
      navigate('/cake');
      // Optionally, still show the modal briefly on arrival, or handle it differently
      // setShowSurpriseModal(true);
    } else {
      // Handle case where it's not birthday time yet (e.g., show notification prompt)
      console.log("Not birthday time yet, maybe show a notification opt-in?");
      // For now, just show the modal for demonstration if needed, or do nothing.
      // setShowSurpriseModal(true);
    }
  };

  const renderThemeButtons = () => {
    const themes = [
      { id: "default", name: "Default" },
      { id: "pastel", name: "Pastel" },
      { id: "vibrant", name: "Vibrant" },
      { id: "night", name: "Night" },
    ];
    
    return (
      <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white/20 backdrop-blur-md p-2 rounded-lg border border-white/30">
        <p className="text-xs text-white font-medium">Theme</p>
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setActiveTheme(theme.id)}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              activeTheme === theme.id
                ? "bg-white/70 text-purple-800 font-medium"
                : "bg-white/30 text-white hover:bg-white/40"
            }`}
          >
            {theme.name}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex items-center justify-center overflow-hidden relative ${getBackgroundStyle()}`}>
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
      
      {/* Main content */}
      <div className="w-full max-w-md mx-auto text-center glass-card p-10 rounded-3xl backdrop-blur-md bg-white/20 border border-white/30 shadow-xl transform hover:scale-[1.02] transition-all">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white text-shadow-lg animate-fade-in">
          Birthday Celebration!
        </h1>
        
        <div className="mb-8">
          <CountdownTimer targetDate={new Date()} />
        </div>
        
        <p className="text-lg text-white mb-8">
          {isBirthdayTime
            ? "🎉 It's time to celebrate! Join the party!"
            : "The celebration is coming soon..."}
        </p>
        
        <Button
          onClick={handleEnterParty}
          variant="secondary"
          className="bg-birthday-gold hover:bg-birthday-gold/80 text-black font-medium px-8 py-6 text-xl animate-pulse-soft shadow-lg transform hover:scale-105 transition-all"
        >
          {isBirthdayTime ? "Enter the Party!" : "Get Notified"}
        </Button>
        
        <div className="mt-6 text-sm text-white/70">
          Current time: {currentTime.toLocaleTimeString()}
        </div>
      </div>
      
      {renderThemeButtons()}
    </div>
  );
};

export default LandingPage;

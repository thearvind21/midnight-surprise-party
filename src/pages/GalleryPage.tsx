
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Palette } from "lucide-react";
import { gsap } from "gsap";

const GalleryPage = () => {
  const navigate = useNavigate();
  const [activeTheme, setActiveTheme] = useState("confetti");
  const [photos] = useState([
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84",
      title: "Birthday Memories",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d",
      title: "Celebration Cake",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1532117892888-38f9db22ca7e",
      title: "Party Moments",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1529268209110-62be1d87fe75",
      title: "Friends Together",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1557693334-edfef4c0168f",
      title: "Birthday Fun",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1516559828984-fb3b99548b21",
      title: "Happy Moments",
    },
  ]);

  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [confetti, setConfetti] = useState<{ x: number, y: number, color: string }[]>([]);
  
  // Generate confetti particles for the confetti theme
  useEffect(() => {
    if (activeTheme === "confetti") {
      const particles = [];
      const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#FF8C42", "#A78BFA"];
      
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      
      setConfetti(particles);
    }
  }, [activeTheme]);
  
  // Animate photo cards on mount
  useEffect(() => {
    gsap.from(".photo-card", {
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out(1.2)",
    });
  }, []);
  
  // Get background style based on theme
  const getBackgroundStyle = () => {
    switch(activeTheme) {
      case "confetti":
        return "bg-gradient-to-br from-purple-500/40 via-pink-500/40 to-yellow-500/40";
      case "bubbles":
        return "bg-gradient-to-br from-blue-500/40 via-teal-500/40 to-green-500/40";
      case "stars":
        return "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800";
      case "elegant":
        return "bg-gradient-to-br from-slate-200 via-slate-100 to-white";
      default:
        return "bg-gradient-to-br from-birthday-purple via-birthday-peach to-birthday-blue";
    }
  };
  
  const themes = [
    { id: "confetti", name: "Confetti" },
    { id: "bubbles", name: "Bubbles" },
    { id: "stars", name: "Stars" },
    { id: "elegant", name: "Elegant" },
  ];

  return (
    <div className={`min-h-screen pb-16 ${getBackgroundStyle()} transition-colors duration-500`}>
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/10 py-4 px-6 flex justify-between items-center border-b border-white/20">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/cake")}
            className="rounded-full bg-white/20 hover:bg-white/30"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Button>
          <h1 className="text-2xl font-display font-bold text-white">Birthday Gallery</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-white" />
          <span className="text-white">Memories</span>
        </div>
      </header>
      
      {/* Theme selector */}
      <div className="fixed top-20 right-4 z-10 bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="h-4 w-4 text-white" />
          <span className="text-sm text-white font-medium">Themes</span>
        </div>
        <div className="flex flex-col gap-2">
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
      </div>
      
      {/* Confetti background */}
      {activeTheme === "confetti" && (
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {confetti.map((particle, i) => (
            <div
              key={i}
              className="absolute animate-float-medium"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                backgroundColor: particle.color,
                width: "8px",
                height: "8px",
                borderRadius: Math.random() > 0.5 ? "50%" : "0",
                transform: `rotate(${Math.random() * 360}deg)`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Stars background */}
      {activeTheme === "stars" && (
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse-soft"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: "#fff",
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                borderRadius: "50%",
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Bubbles background */}
      {activeTheme === "bubbles" && (
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-white/20 animate-float-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 100 + 20}px`,
                height: `${Math.random() * 100 + 20}px`,
                backdropFilter: "blur(1px)",
                animation: `float-${Math.random() > 0.5 ? 'slow' : 'medium'} ${Math.random() * 5 + 5}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Gallery content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-display font-bold text-white mb-8 text-center text-shadow-md">Photo Memories</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div 
              key={photo.id}
              className="photo-card rounded-xl overflow-hidden shadow-lg bg-white/20 backdrop-blur-md border border-white/30 cursor-pointer"
              onClick={() => setSelectedPhoto(photo.id)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-white">{photo.title}</h3>
                <p className="text-sm text-white/70 mt-1">Special moments to remember</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Lightbox modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-4xl w-full bg-white/10 backdrop-blur-md rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img
                src={photos.find(p => p.id === selectedPhoto)?.url}
                alt={photos.find(p => p.id === selectedPhoto)?.title}
                className="w-full h-auto"
              />
              <button 
                className="absolute top-4 right-4 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-colors"
                onClick={() => setSelectedPhoto(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-display font-bold text-white">
                {photos.find(p => p.id === selectedPhoto)?.title}
              </h2>
              <p className="mt-2 text-white/80">
                Beautiful memories from the birthday celebration. Special moments captured forever.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;

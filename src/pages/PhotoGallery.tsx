
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BirthdayContext } from "@/contexts/BirthdayContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Palette, GalleryHorizontal } from "lucide-react";
import { gsap } from "gsap";

const PhotoGallery = () => {
  const { isBirthdayTime, cakeCut } = useContext(BirthdayContext);
  const navigate = useNavigate();
  const [activeTheme, setActiveTheme] = useState("confetti");
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // High-quality placeholder photos
  const [photos] = useState([
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?q=80&w=1600",
      alt: "Birthday Memories",
      caption: "Remember our amazing birthday celebration last year? Those candles lit up the entire room!",
      date: "May 12, 2023"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1600",
      alt: "Celebration Cake",
      caption: "That beautiful three-tier cake with buttercream frosting and fresh berries.",
      date: "April 30, 2023"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1532117892888-38f9db22ca7e?q=80&w=1600",
      alt: "Party Moments",
      caption: "Everyone gathered around for the surprise party. Your expression was priceless!",
      date: "June 8, 2023"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1529268209110-62be1d87fe75?q=80&w=1600",
      alt: "Friends Together",
      caption: "All the friends together making memories that will last a lifetime.",
      date: "July 22, 2023"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1557693334-edfef4c0168f?q=80&w=1600",
      alt: "Birthday Fun",
      caption: "Games, laughter, and joy - the perfect combination for a birthday celebration.",
      date: "August 15, 2023"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1516559828984-fb3b99548b21?q=80&w=1600",
      alt: "Happy Moments",
      caption: "Capturing those spontaneous moments of pure happiness is what birthdays are all about.",
      date: "September 3, 2023"
    },
  ]);

  const [confetti, setConfetti] = useState<{ x: number, y: number, color: string }[]>([]);

  useEffect(() => {
    // Redirect if not birthdayTime or cake hasn't been cut
    if (!isBirthdayTime || !cakeCut) {
      navigate("/");
      return;
    }
    
    // Simulate loading images
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [isBirthdayTime, cakeCut, navigate]);
  
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
    if (!loading && galleryRef.current) {
      gsap.fromTo(".photo-card", 
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.2)",
        }
      );
    }
  }, [loading]);
  
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

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${getBackgroundStyle()} transition-colors duration-500`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white text-lg">Loading your memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-16 ${getBackgroundStyle()} transition-colors duration-500`}>
      {/* Header with glass effect */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/10 py-4 px-6 flex justify-between items-center border-b border-white/20 shadow-md">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/cake")}
            className="rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Button>
          <h1 className="text-2xl font-display font-bold text-white">Birthday Memories Gallery</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <GalleryHorizontal className="h-5 w-5 text-white" />
          <span className="text-white hidden md:inline">Photo Collection</span>
        </div>
      </header>
      
      {/* Theme selector with improved styling */}
      <div className="fixed top-20 right-4 z-10 bg-white/20 backdrop-blur-xl p-3 rounded-xl border border-white/30 shadow-lg transition-transform hover:scale-105">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="h-4 w-4 text-white" />
          <span className="text-sm text-white font-medium">Gallery Theme</span>
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
      
      {/* Decorative backgrounds based on theme */}
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
      
      {/* Gallery content with masonry layout */}
      <div className="container mx-auto px-4 py-8" ref={galleryRef}>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-3 text-shadow-md inline-flex items-center">
            <Sparkles className="h-6 w-6 mr-2" />
            Photo Memories
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-white/80">
            A collection of our favorite moments together. Happy Birthday!
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="photo-card rounded-xl overflow-hidden shadow-lg bg-white/20 backdrop-blur-md border border-white/30 cursor-pointer transform transition-all duration-300"
              onClick={() => setSelectedPhoto(photo.id)}
              style={{ opacity: 0 }} // Initial state for animation
            >
              <div className="relative aspect-[4/3] overflow-hidden group">
                <img
                  src={photo.src} 
                  alt={photo.alt} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-light">{photo.date}</p>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-medium text-white mb-2">{photo.alt}</h3>
                <p className="text-sm text-white/80">{photo.caption.substring(0, 70)}...</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button
            onClick={() => navigate("/cake")}
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-medium px-6 py-6 rounded-full border border-white/30 hover:scale-105 transition-all"
          >
            Return to Cake
          </Button>
        </div>
      </div>
      
      {/* Enhanced lightbox modal with animations */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-4xl w-full bg-white/10 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl animate-scale-in" 
            onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img
                src={photos.find(p => p.id === selectedPhoto)?.src}
                alt={photos.find(p => p.id === selectedPhoto)?.alt}
                className="w-full h-auto"
              />
              <button 
                className="absolute top-4 right-4 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-colors hover:scale-110 transform"
                onClick={() => setSelectedPhoto(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                {photos.find(p => p.id === selectedPhoto)?.alt}
              </h2>
              <p className="text-sm text-white/60 mb-3">
                {photos.find(p => p.id === selectedPhoto)?.date}
              </p>
              <p className="text-white/80">
                {photos.find(p => p.id === selectedPhoto)?.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;

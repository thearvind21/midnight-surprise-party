import React, { useEffect, useState, useRef } from "react";
import { 
  ArrowLeft, 
  Sparkles, 
  Palette, 
  GalleryHorizontal, 
  Heart,
  Share2,
  Download,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Filter,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PhotoGallery = () => {
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    // Your navigation logic here
  };
  const [activeTheme, setActiveTheme] = useState("confetti");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or masonry
  const [sortBy, setSortBy] = useState("date"); // date, name, favorites
  const [favorites, setFavorites] = useState(new Set([1, 3]));
  const [showFilters, setShowFilters] = useState(false);
  const galleryRef = useRef(null);
  
  // Enhanced photo data with more metadata
  const [photos] = useState([
    {
      id: 1,
      src: "images/1.png",
      alt: "Birthday Memories",
      caption: "My Birthday Time We met ",
      date: "Oct 21, 2020",
      location: "Home Sweet Home",
      tags: ["birthday", "candles", "celebration"],
      likes: 24
    },
    {
      id: 2,
      src: "images/2.jpg",
      alt: "Celebration Cake",
      caption: "Our Memorable Day",
      date: "April 30, 2023",
      location: "Bakery District",
      tags: ["cake", "dessert", "celebration"],
      likes: 31
    },
    {
      id: 3,
      src: "images/3.jpg",
      alt: "Party Moments",
      caption: "Your Favorite Pet  ",
      date: "June 8, 2023",
      location: "Home",
      tags: ["Dogs"],
      likes: 18
    },
    {
      id: 4,
      src: "images/4.png",
      alt: "Friends Together",
      caption: "We cant Take A pic with our favorite pet ",
      date: "Feb 27, 2025",
      location: "Dubai",
      tags: ["friends", "memories", "together"],
      likes: 27
    },
    {
      id: 5,
      src: "images/5.png",
      alt: "Friends Together",
      caption: "When i come to your home for Lunch ",
      date: "April 6, 2025",
      location: "City Park",
      tags: ["friends", "memories", "together"],
      likes: 27
    },

  ]);

  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    // Simulate loading images with staggered effect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Enhanced confetti generation
  useEffect(() => {
    if (activeTheme === "confetti") {
      const particles = [];
      const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#FF8C42", "#A78BFA", "#F472B6", "#34D399"];
      const shapes = ["circle", "square", "star"];
      
      for (let i = 0; i < 150; i++) {
        particles.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          size: Math.random() * 8 + 4,
          rotation: Math.random() * 360,
          delay: Math.random() * 5
        });
      }
      
      setConfetti(particles);
    }
  }, [activeTheme]);
  
  // Animate photo cards with enhanced stagger
  useEffect(() => {
    if (!loading && galleryRef.current) {
      const cards = galleryRef.current.querySelectorAll('.photo-card');
      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(60px) scale(0.9)';
        
        setTimeout(() => {
          card.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
      });
    }
  }, [loading, viewMode]);
  
  const getBackgroundStyle = () => {
    const styles = {
      confetti: "bg-gradient-to-br from-purple-600/50 via-pink-500/50 to-yellow-400/50",
      bubbles: "bg-gradient-to-br from-blue-600/50 via-teal-500/50 to-emerald-500/50",
      stars: "bg-gradient-to-br from-slate-900 via-purple-900/80 to-indigo-900",
      elegant: "bg-gradient-to-br from-rose-100 via-pink-50 to-teal-50",
      sunset: "bg-gradient-to-br from-orange-400/60 via-red-500/60 to-pink-600/60",
      ocean: "bg-gradient-to-br from-cyan-400/50 via-blue-500/50 to-indigo-600/50"
    };
    return styles[activeTheme] || styles.confetti;
  };
  
  const themes = [
    { id: "confetti", name: "Confetti", icon: "🎊" },
    { id: "bubbles", name: "Bubbles", icon: "🫧" },
    { id: "stars", name: "Stars", icon: "⭐" },
    { id: "elegant", name: "Elegant", icon: "🌸" },
    { id: "sunset", name: "Sunset", icon: "🌅" },
    { id: "ocean", name: "Ocean", icon: "🌊" }
  ];

  const toggleFavorite = (photoId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(photoId)) {
      newFavorites.delete(photoId);
    } else {
      newFavorites.add(photoId);
    }
    setFavorites(newFavorites);
  };

  const navigatePhoto = (direction) => {
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
    }
    
    setSelectedPhoto(photos[newIndex].id);
  };

  const sortedPhotos = [...photos].sort((a, b) => {
    switch(sortBy) {
      case 'name':
        return a.alt.localeCompare(b.alt);
      case 'favorites':
        return (favorites.has(b.id) ? 1 : 0) - (favorites.has(a.id) ? 1 : 0);
      case 'likes':
        return b.likes - a.likes;
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${getBackgroundStyle()} transition-all duration-1000`}>
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-400 rounded-full animate-spin mx-auto mt-2 ml-2" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
          </div>
          <div className="space-y-2">
            <p className="text-white text-xl font-medium">Loading your precious memories...</p>
            <div className="flex items-center justify-center space-x-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-16 ${getBackgroundStyle()} transition-all duration-1000 relative overflow-hidden`}>
      {/* Enhanced decorative backgrounds */}
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
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                borderRadius: particle.shape === 'circle' ? '50%' : particle.shape === 'star' ? '0' : '0',
                transform: `rotate(${particle.rotation}deg)`,
                opacity: 0.7,
                animationDelay: `${particle.delay}s`,
                clipPath: particle.shape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none'
              }}
            />
          ))}
        </div>
      )}
      
      {/* Enhanced header with better glass effect */}
      <header className="sticky top-0 z-20 backdrop-blur-2xl bg-white/10 py-4 px-6 border-b border-white/20 shadow-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/cake")}
              className="rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110 group p-3"
            >
              <ArrowLeft className="h-5 w-5 text-white group-hover:text-pink-200 transition-colors" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                Birthday Memories
              </h1>
              <p className="text-sm text-white/70">A collection of precious moments</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-white">
              <GalleryHorizontal className="h-5 w-5" />
              <span>{photos.length} Photos</span>
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all duration-300"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Enhanced filters panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 animate-slideDown">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-white/80 mb-2 block">View Mode</label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setViewMode("grid")}
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-full"
                  >
                    <Grid3X3 className="h-4 w-4 mr-1" />
                    Grid
                  </Button>
                  <Button
                    onClick={() => setViewMode("masonry")}
                    variant={viewMode === "masonry" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-full"
                  >
                    <List className="h-4 w-4 mr-1" />
                    Masonry
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-white/80 mb-2 block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white/20 text-white rounded-lg px-3 py-2 text-sm border border-white/30"
                >
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="favorites">Favorites</option>
                  <option value="likes">Most Liked</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-white/80 mb-2 block">Theme</label>
                <div className="grid grid-cols-3 gap-1">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setActiveTheme(theme.id)}
                      className={`p-2 text-xs rounded-lg transition-all duration-300 ${
                        activeTheme === theme.id
                          ? "bg-white/70 text-purple-800 scale-105"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg mb-1">{theme.icon}</div>
                        <div className="text-xs">{theme.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Enhanced gallery content */}
      <div className="container mx-auto px-4 py-8" ref={galleryRef}>
        <div className="mb-12 text-center space-y-4">
          <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Star className="h-8 w-8 text-yellow-300 animate-pulse" />
            Photo Memories Collection
            <Star className="h-8 w-8 text-yellow-300 animate-pulse" />
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-white/90 leading-relaxed">
            Every photo tells a story, every moment captures a memory. 
            Here's to celebrating another year of beautiful moments together! 🎉
          </p>
          <div className="flex justify-center items-center gap-6 text-white/70">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-400" />
              <span>{favorites.size} Favorites</span>
            </div>
            <div className="flex items-center gap-2">
              <GalleryHorizontal className="h-5 w-5 text-blue-400" />
              <span>{photos.length} Total Photos</span>
            </div>
          </div>
        </div>
        
        <div className={`grid gap-6 md:gap-8 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }`}>
          {sortedPhotos.map((photo, index) => (
            <div 
              key={photo.id} 
              className={`photo-card group relative rounded-2xl overflow-hidden shadow-2xl bg-white/15 backdrop-blur-lg border border-white/30 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-rotate-1 hover:shadow-3xl ${
                viewMode === "masonry" && index % 3 === 1 ? "lg:mt-8" : ""
              }`}
              onClick={() => setSelectedPhoto(photo.id)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={photo.src} 
                  alt={photo.alt} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                />
                
                {/* Enhanced overlay effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Favorite button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(photo.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110 group"
                >
                  <Heart 
                    className={`h-5 w-5 transition-all duration-300 ${
                      favorites.has(photo.id) 
                        ? "text-red-400 fill-red-400 scale-110" 
                        : "text-white hover:text-red-300"
                    }`} 
                  />
                </button>
                
                {/* Photo metadata overlay */}
                <div className="absolute bottom-0 left-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-sm font-medium mb-1">{photo.location}</p>
                  <p className="text-xs text-white/80">{photo.date}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {photo.likes}
                    </span>
                    <span>#{photo.tags[0]}</span>
                  </div>
                </div>
                
                {/* Zoom indicator */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                    <ZoomIn className="h-6 w-6 text-gray-800" />
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-white group-hover:text-pink-200 transition-colors">
                    {photo.alt}
                  </h3>
                  {favorites.has(photo.id) && (
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-white/80 leading-relaxed line-clamp-3">
                  {photo.caption}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {photo.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white/20 text-white/80 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button
            onClick={() => navigate("/cake")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full border-2 border-white/30 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3"
          >
            <Sparkles className="h-5 w-5" />
            Back to Celebration
            <Sparkles className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Enhanced lightbox modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-6xl w-full h-full flex items-center justify-center relative">
            {/* Navigation arrows */}
            <button 
              onClick={(e) => { e.stopPropagation(); navigatePhoto('prev'); }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white rounded-full p-3 hover:bg-white/30 transition-all duration-300 hover:scale-110 z-10"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); navigatePhoto('next'); }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white rounded-full p-3 hover:bg-white/30 transition-all duration-300 hover:scale-110 z-10"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Close button */}
            <button 
              className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white rounded-full p-3 hover:bg-white/30 transition-all duration-300 hover:scale-110 z-10"
              onClick={() => setSelectedPhoto(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Photo content */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl max-h-full w-full" 
              onClick={e => e.stopPropagation()}>
              <div className="relative">
                <img
                  src={photos.find(p => p.id === selectedPhoto)?.src}
                  alt={photos.find(p => p.id === selectedPhoto)?.alt}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>
              
              <div className="p-8 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white">
                      {photos.find(p => p.id === selectedPhoto)?.alt}
                    </h2>
                    <div className="flex items-center gap-4 text-white/60">
                      <span>{photos.find(p => p.id === selectedPhoto)?.date}</span>
                      <span>•</span>
                      <span>{photos.find(p => p.id === selectedPhoto)?.location}</span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {photos.find(p => p.id === selectedPhoto)?.likes}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white rounded-full">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white rounded-full">
                      <Download className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
                
                <p className="text-white/90 text-lg leading-relaxed">
                  {photos.find(p => p.id === selectedPhoto)?.caption}
                </p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {photos.find(p => p.id === selectedPhoto)?.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/20 text-white/80 text-sm rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;


import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface Image {
  id: number;
  src: string;
  caption: string;
}

const GalleryPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sample images - replace with your actual images
  const images: Image[] = [
    {
      id: 1,
      src: '/images/memory1.jpg',
      caption: 'Our first adventure together',
    },
    {
      id: 2,
      src: '/images/memory2.jpg',
      caption: 'That amazing sunset',
    },
    {
      id: 3,
      src: '/images/memory3.jpg',
      caption: 'Birthday celebration last year',
    },
    {
      id: 4,
      src: '/images/memory4.jpg',
      caption: 'Our trip to the mountains',
    },
    {
      id: 5,
      src: '/images/memory5.jpg',
      caption: 'Family dinner',
    },
    {
      id: 6,
      src: '/images/memory6.jpg',
      caption: 'Beach day',
    },
  ];

  const handleImageClick = (image: Image) => {
    const index = images.findIndex(img => img.id === image.id);
    setCurrentIndex(index);
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    document.body.style.overflow = '';
    gsap.to('.modal-content', {
      scale: 0.8,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => setSelectedImage(null),
    });
  };

  const handleBackToCake = () => {
    navigate('/cake');
  };

  const handlePrevImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNextImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevImage();
          break;
        case 'ArrowRight':
          handleNextImage();
          break;
        case 'Escape':
          handleCloseModal();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex, isAnimating]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-birthday-pink via-birthday-purple to-birthday-blue p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white text-shadow-lg font-display">Our Special Memories</h1>
          <button
            onClick={handleBackToCake}
            className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors border border-white/30 shadow-lg flex items-center gap-2"
          >
            <Sparkles className="h-5 w-5" />
            Back to Cake
            <Sparkles className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <motion.div
              key={image.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-xl cursor-pointer shadow-xl"
              onClick={() => handleImageClick(image)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: image.id * 0.1 }}
            >
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={image.src}
                  alt={image.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                <p className="text-white font-medium text-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {image.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Image Modal with navigation */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="modal-content relative bg-transparent max-w-5xl w-full mx-4 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-50 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Navigation buttons */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Image */}
              <motion.img
                key={`img-${selectedImage.id}`}
                src={selectedImage.src}
                alt={selectedImage.caption}
                className="w-full h-auto rounded-lg shadow-2xl max-h-[80vh] object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Caption */}
              <motion.div
                className="bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0 p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-white text-xl font-medium text-shadow-md">
                  {selectedImage.caption}
                </p>
                <p className="text-white/70 mt-2">
                  Image {currentIndex + 1} of {images.length}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;

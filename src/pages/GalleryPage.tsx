import { useState } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

interface Image {
  id: number;
  src: string;
  caption: string;
}

const GalleryPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

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
    // Add more images as needed
  ];

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
    gsap.from('.modal-content', {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: 'back.out(1.7)',
    });
  };

  const handleCloseModal = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900">Our Memories</h1>
          <button
            onClick={handleBackToCake}
            className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            Back to Cake
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-xl cursor-pointer transform transition-transform duration-300 hover:scale-105"
              onClick={() => handleImageClick(image)}
            >
              <img
                src={image.src}
                alt={image.caption}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-4">
                  {image.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="modal-content bg-white rounded-xl p-4 max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.caption}
              className="w-full h-auto rounded-lg"
            />
            <p className="text-center mt-4 text-lg text-gray-700">
              {selectedImage.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage; 
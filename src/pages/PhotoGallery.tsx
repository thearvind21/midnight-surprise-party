
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BirthdayContext } from "@/contexts/BirthdayContext";
import { Button } from "@/components/ui/button";

const PhotoGallery = () => {
  const { isBirthdayTime, cakeCut } = useContext(BirthdayContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not birthdayTime or cake hasn't been cut
    if (!isBirthdayTime || !cakeCut) {
      navigate("/");
    }
  }, [isBirthdayTime, cakeCut, navigate]);

  // Placeholder images and memories (replace with actual content)
  const photos = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1000",
      alt: "Birthday Celebration",
      caption: "Remember our amazing birthday celebration last year?"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1496024840928-4c417adf211d?q=80&w=1000",
      alt: "Beach Day",
      caption: "That perfect beach day we had!"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000",
      alt: "Hiking Adventure",
      caption: "Our hiking adventure in the mountains!"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1000",
      alt: "Movie Night",
      caption: "Movie night with popcorn and blankets."
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1000",
      alt: "Coffee Date",
      caption: "Our first coffee date at that cute café."
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1472653816316-3ad6f10a6592?q=80&w=1000",
      alt: "Concert",
      caption: "That amazing concert we attended!"
    },
  ];

  return (
    <div className="min-h-screen birthday-gradient px-4 py-16 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 animate-fade-in">
            Memories Gallery
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-80">
            A collection of our favorite moments together. Happy Birthday!
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="photo-card bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={photo.src} 
                  alt={photo.alt} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <p className="text-gray-700">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button
            onClick={() => navigate("/cake")}
            className="bg-birthday-purple hover:bg-birthday-purple/80 text-white font-medium"
          >
            Back to Cake
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoGallery;

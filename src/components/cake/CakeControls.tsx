
import React from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CakeControlsProps {
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  handleCutCake: () => void;
  cakeCut: boolean;
  cuttingAnimation: boolean;
  userName: string;
}

export const CakeControls: React.FC<CakeControlsProps> = ({ 
  isMusicPlaying, 
  toggleMusic, 
  handleCutCake, 
  cakeCut, 
  cuttingAnimation,
  userName
}) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="z-10 p-6 text-center relative">
        <div className="glass-card p-8 rounded-2xl backdrop-blur-md bg-white/30 border border-white/50 shadow-xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 text-white text-shadow-lg animate-fade-in">
            Happy Birthday, {userName}!
          </h1>
          
          {!cakeCut && !cuttingAnimation ? (
            <Button
              onClick={handleCutCake}
              className="bg-birthday-gold hover:bg-birthday-gold/80 text-black font-medium px-8 py-6 text-xl animate-pulse-soft shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              <Sparkles className="h-6 w-6" />
              Cut the Cake!
              <Sparkles className="h-6 w-6" />
            </Button>
          ) : (
            <div className="animate-scale-in">
              <h2 className="text-2xl font-display mb-4 text-white text-shadow-md">Making a wish! 🎂✨</h2>
              {cuttingAnimation && !cakeCut && (
                <p className="mb-4 text-white text-shadow-sm">Cutting the cake...</p>
              )}
              {cakeCut && (
                <>
                  <p className="mb-4 text-white text-shadow-sm">Redirecting to your photo gallery...</p>
                  <div className="w-12 h-12 border-4 border-birthday-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Music control */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMusic}
          className="glass-button w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/40 border-birthday-gold"
        >
          {isMusicPlaying ? <VolumeX className="h-6 w-6 text-white" /> : <Volume2 className="h-6 w-6 text-white" />}
        </Button>
      </div>
      
      {/* Go back button */}
      <div className="absolute bottom-4 left-4 z-20">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="glass-button bg-white/30 backdrop-blur-sm hover:bg-white/40 text-white border-white/50"
        >
          Go Back
        </Button>
      </div>
    </>
  );
};

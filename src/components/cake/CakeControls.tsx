import React from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Sparkles, RotateCcw, RotateCw, ZoomIn, ZoomOut, Palette, Scissors, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CakeControlsProps {
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  handleCutCake: () => void;
  cakeCut: boolean;
  cuttingAnimation: boolean;
  userName: string;
  onRotateCake?: (direction: 'left' | 'right') => void;
  onZoomCake?: (direction: 'in' | 'out') => void;
  onChangeTheme?: (theme: string) => void;
  activeTheme?: string;
  revealStep: number;
  handleRevealNext: () => void;
  revealBtnDisabled: boolean;
}

export const CakeControls: React.FC<CakeControlsProps> = ({ 
  isMusicPlaying, 
  toggleMusic, 
  handleCutCake, 
  cakeCut, 
  cuttingAnimation,
  userName,
  onRotateCake,
  onZoomCake,
  onChangeTheme,
  activeTheme = 'default',
  revealStep,
  handleRevealNext,
  revealBtnDisabled
}) => {
  const navigate = useNavigate();
  
  const themes = [
    { id: 'default', name: 'Default', color: 'bg-gradient-to-br from-pink-200 to-purple-200' },
    { id: 'pastel', name: 'Pastel', color: 'bg-gradient-to-br from-pink-200 via-blue-100 to-green-200' },
    { id: 'vibrant', name: 'Vibrant', color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500' },
    { id: 'night', name: 'Night', color: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' },
    { id: 'forest', name: 'Forest', color: 'bg-gradient-to-br from-emerald-500 to-teal-800' }
  ];
  
  return (
    <>
      {/* Main controls */}
      <div className="z-20 p-6 text-center relative">
        <div className="glass-card p-8 rounded-2xl backdrop-blur-md bg-white/30 border border-white/50 shadow-xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 text-white text-shadow-lg animate-fade-in">
            Happy Birthday, {userName}!
          </h1>
          
          {!cakeCut && !cuttingAnimation ? (
            <Button
              onClick={handleCutCake}
              className="bg-birthday-gold hover:bg-birthday-gold/80 text-black font-medium px-8 py-6 text-xl animate-pulse-soft shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              <Scissors className="h-6 w-6" />
              Cut the Cake!
              <Sparkles className="h-6 w-6" />
            </Button>
          ) : (
            <div className="animate-scale-in flex flex-col items-center justify-center text-center">
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

          {/* Add Next Layer button - visible when not cutting and not yet fully revealed */}
          {!cakeCut && !cuttingAnimation && revealStep < 5 && (
             <Button
              onClick={handleRevealNext}
              disabled={revealBtnDisabled}
              className="mt-4 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full shadow-lg text-lg transition-all transform hover:scale-105"
            >
              {revealStep === 0 && "Start Building Cake!"}
              {revealStep > 0 && revealStep < 4 && "Next Layer"}
              {revealStep === 4 && "Final Touch!"}
            </Button>
          )}

        </div>
      </div>
      
      {/* Interactive controls panel with glass effect */}
      <div className="fixed top-4 left-4 z-20 flex flex-col gap-3">
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 flex flex-col gap-2 border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-300">
          <h3 className="text-xs font-medium text-white px-2 flex items-center justify-center">Rotate Cake</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onRotateCake?.('left')}
              className="glass-button w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 border-white/20 hover:scale-110 transition-transform"
            >
              <RotateCcw className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onRotateCake?.('right')}
              className="glass-button w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 border-white/20 hover:scale-110 transition-transform"
            >
              <RotateCw className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 flex flex-col gap-2 border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-300">
          <h3 className="text-xs font-medium text-white px-2 flex items-center justify-center">Zoom</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onZoomCake?.('in')}
              className="glass-button w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 border-white/20 hover:scale-110 transition-transform"
            >
              <ZoomIn className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onZoomCake?.('out')}
              className="glass-button w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 border-white/20 hover:scale-110 transition-transform"
            >
              <ZoomOut className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 flex flex-col gap-2 border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-300">
          <div className="flex items-center justify-center px-2">
            <h3 className="text-xs font-medium text-white mr-1">Theme</h3>
            <Palette className="h-3 w-3 text-white" />
          </div>
          <div className="flex flex-col gap-2 px-1">
            {themes.map(theme => (
              <button
                key={theme.id}
                onClick={() => onChangeTheme?.(theme.id)}
                className={`w-full h-6 rounded-md ${theme.color} border ${activeTheme === theme.id ? 'border-white shadow-lg scale-110' : 'border-transparent'} transition-all hover:scale-105`}
                title={theme.name}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Music control with enhanced styling */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMusic}
          className="glass-button w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/40 border-birthday-gold hover:scale-110 transition-all duration-300"
          title={isMusicPlaying ? "Mute Music" : "Play Music"}
        >
          {isMusicPlaying ? (
            <VolumeX className="h-6 w-6 text-white animate-pulse" />
          ) : (
            <Volume2 className="h-6 w-6 text-white" />
          )}
        </Button>
      </div>
      
      {/* Return Home button positioned on the right side */}
      <div className="absolute bottom-4 right-4 z-20">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="glass-button bg-white/30 backdrop-blur-sm hover:bg-white/40 text-white border-white/50 hover:scale-105 transition-all shadow-lg flex items-center gap-2"
        >
          <Home className="h-5 w-5" />
          Return Home
        </Button>
      </div>
    </>
  );
};

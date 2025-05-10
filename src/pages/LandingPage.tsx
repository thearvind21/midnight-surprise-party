
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BirthdayContext, TimeContext } from "@/contexts/BirthdayContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import CountdownTimer from "@/components/CountdownTimer";
import Confetti from "@/components/Confetti";

const LandingPage = () => {
  const { isBirthdayTime, showSurpriseModal, setShowSurpriseModal } = useContext(BirthdayContext);
  const { currentTime } = useContext(TimeContext);
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // If it's birthday time, redirect to cake page if user has already confirmed
    const hasAccepted = localStorage.getItem("birthdayAccepted");
    if (isBirthdayTime && hasAccepted === "true") {
      navigate("/cake");
    }
  }, [isBirthdayTime, navigate]);

  const handleAccept = () => {
    setShowConfetti(true);
    localStorage.setItem("birthdayAccepted", "true");
    
    // Wait for confetti to show before navigating
    setTimeout(() => {
      navigate("/cake");
    }, 2000);
  };

  const handleDecline = () => {
    setShowSurpriseModal(false);
  };

  // Calculate target time (next midnight)
  const targetDate = new Date();
  targetDate.setHours(02, 24, 0, 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center birthday-gradient relative overflow-hidden">
      {showConfetti && <Confetti />}
      
      <div className="w-full max-w-3xl px-4 py-12 flex flex-col items-center text-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold font-display text-gray-800 mb-6 animate-fade-in">
          A Special Surprise Is Waiting For You
        </h1>
        
        <p className="text-lg md:text-xl text-gray-700 mb-12 animate-fade-in opacity-90">
          Something wonderful is about to happen... just wait a little longer!
        </p>
        
        <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full">
          <h2 className="text-2xl font-display font-semibold mb-6 text-gray-800">
            Coming Soon
          </h2>
          
          <CountdownTimer targetDate={targetDate} />
        </div>
        
        <div className="mt-16 animate-bounce-soft">
          <p className="text-sm text-gray-600">
            Make sure to come back at midnight!
          </p>
        </div>
      </div>

      {/* Birthday Surprise Modal */}
      <Dialog open={isBirthdayTime && showSurpriseModal} onOpenChange={setShowSurpriseModal}>
        <DialogContent className="sm:max-w-md bg-birthday-pink/90 backdrop-blur-md border-birthday-purple">
          <DialogHeader>
            <DialogTitle className="text-3xl font-display text-center">
              Happy Birthday Sai!
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6">
            <p className="text-lg text-center mb-4">
              Your special surprise is ready! Would you like to see it?
            </p>
            
            <div className="flex justify-center my-4">
              <div className="w-32 h-32 bg-birthday-gold/30 rounded-full flex items-center justify-center animate-pulse-soft">
                <span className="text-6xl">🎁</span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-center gap-4">
            <Button 
              variant="default" 
              onClick={handleAccept}
              className="bg-birthday-gold hover:bg-birthday-gold/80 text-black font-medium px-8 py-2"
            >
              Yes, show me!
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDecline}
              className="border-birthday-purple hover:bg-birthday-purple/20"
            >
              Not yet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;

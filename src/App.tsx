
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "@/pages/LandingPage";
import CakePage from "@/pages/CakePage"; // Import the CakePage component
import PhotoGallery from "@/pages/PhotoGallery"; // Import the PhotoGallery component
import NotFound from "@/pages/NotFound";
import { BirthdayContext, TimeContext } from "@/contexts/BirthdayContext";
import SurpriseModal from './components/SurpriseModal';

const queryClient = new QueryClient();

// Create a wrapper component for the app content that uses Router-dependent hooks
const AppContent = () => {
  const [isBirthdayTime, setIsBirthdayTime] = useState(false);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [name, setName] = useState('Sarah'); // Set the birthday person's name here
  const [cakeCut, setCakeCut] = useState(false);
  const navigate = useNavigate();

  // Check if it's midnight
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Check if it's midnight (12:00 AM)
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setIsBirthdayTime(true);
        setShowSurpriseModal(true);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // For demo purposes, set birthday time immediately
  useEffect(() => {
    // Comment this out in production if you want to only show on actual birthday
    setIsBirthdayTime(true);
    // Uncomment below if you want to show the modal immediately for testing
    // setShowSurpriseModal(true);
  }, []);

  // Function to set cake as cut
  const handleSetCakeCut = () => {
    setCakeCut(true);
  };
  
  // Function to handle navigation to cake page
  const handleShowSurprise = () => {
    navigate('/cake');
  };

  return (
    <TimeContext.Provider value={{ currentTime }}>
      <BirthdayContext.Provider 
        value={{ 
          isBirthdayTime, 
          setIsBirthdayTime,
          showSurpriseModal, 
          setShowSurpriseModal,
          cakeCut,
          setCakeCut: handleSetCakeCut
        }}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cake" element={<CakePage />} />
          <Route path="/gallery" element={<PhotoGallery />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Add SurpriseModal with navigation callback */}
        <SurpriseModal 
          isOpen={showSurpriseModal} 
          onClose={() => setShowSurpriseModal(false)} 
          name={name}
          onShowSurprise={handleShowSurprise}
        />
      </BirthdayContext.Provider>
    </TimeContext.Provider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <AppContent />
          <Toaster />
          <Sonner />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

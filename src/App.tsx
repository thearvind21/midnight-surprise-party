import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/NotFound";
import { BirthdayContext, TimeContext } from "@/contexts/BirthdayContext";
import { CakeScene } from '@/components/cake/CakeScene';
import GalleryPage from './pages/GalleryPage';
import SurpriseModal from './components/SurpriseModal';

const queryClient = new QueryClient();

const App = () => {
  const [isBirthdayTime, setIsBirthdayTime] = useState(false);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [name, setName] = useState('Sai'); // Set the birthday person's name here

  // Check if it's midnight
  useEffect(() => {
    // const timer = setInterval(() => {
    //   const now = new Date();
    //   setCurrentTime(now);
      
    //   // Check if it's midnight (12:00 AM)
    //   if (now.getHours() === 0 && now.getMinutes() === 0) {
        setIsBirthdayTime(true);
    //     setShowSurpriseModal(true);
    //   }
    // }, 1000);
    
    // return () => clearInterval(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TimeContext.Provider value={{ currentTime }}>
          <BirthdayContext.Provider 
            value={{ 
              isBirthdayTime, 
              setIsBirthdayTime,
              showSurpriseModal, 
              setShowSurpriseModal 
            }}
          >
            <Toaster />
            <Sonner />
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/cake" element={<CakeScene userName={name} />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </BirthdayContext.Provider>
        </TimeContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

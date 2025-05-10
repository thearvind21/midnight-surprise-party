
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "@/pages/LandingPage";
import CakePage from "@/pages/CakePage";
import PhotoGallery from "@/pages/PhotoGallery";
import NotFound from "@/pages/NotFound";
import { BirthdayContext, TimeContext } from "@/contexts/BirthdayContext";

const queryClient = new QueryClient();

const App = () => {
  const [isBirthdayTime, setIsBirthdayTime] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Check if we already passed birthday time from localStorage
  useEffect(() => {
    const savedBirthdayPassed = localStorage.getItem("birthdayPassed");
    const savedCakeCut = localStorage.getItem("cakeCut");
    
    if (savedBirthdayPassed === "true") {
      setIsBirthdayTime(true);
    }
    
    if (savedCakeCut === "true") {
      setCakeCut(true);
    }
    
    // Set up a timer that updates current time every second
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Check if it's birthday time (12:00 AM)
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      // For testing purposes, you might want to use the following condition:
      // if (true) {
      // But for production, use:
      if (hours === 0 && minutes === 0) {
        setIsBirthdayTime(true);
        setShowSurpriseModal(true);
        localStorage.setItem("birthdayPassed", "true");
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleCakeCut = () => {
    setCakeCut(true);
    localStorage.setItem("cakeCut", "true");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TimeContext.Provider value={{ currentTime }}>
          <BirthdayContext.Provider 
            value={{ 
              isBirthdayTime, 
              setIsBirthdayTime, 
              cakeCut, 
              setCakeCut: handleCakeCut, 
              showSurpriseModal, 
              setShowSurpriseModal 
            }}
          >
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/cake" element={<CakePage />} />
                <Route path="/gallery" element={<PhotoGallery />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </BirthdayContext.Provider>
        </TimeContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

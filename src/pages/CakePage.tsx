import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BirthdayContext } from "@/contexts/BirthdayContext";
import { CakeScene } from "@/components/cake/CakeScene";
import { CakeControls } from "@/components/cake/CakeControls";
import { CakeBackground } from "@/components/cake/CakeBackground";
import * as THREE from "three";

const CakePage = () => {
  const { isBirthdayTime, cakeCut, setCakeCut } = useContext(BirthdayContext);
  const navigate = useNavigate();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [userName] = useState("Sarah"); // Replace with actual name or from context
  const [cuttingAnimation, setCuttingAnimation] = useState(false);
  
  // Redirect if not birthday time yet
  useState(() => {
    if (!isBirthdayTime) {
      navigate("/");
    }
    
    // Initialize audio
    audioRef.current = new Audio("https://www.chosic.com/wp-content/uploads/2020/05/Happy-Birthday-To-You-Song.mp3");
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  });

  const handleCutCake = () => {
    // Start cutting animation first
    setCuttingAnimation(true);
    
    // Play cutting sound
    const cuttingSound = new Audio("https://freesound.org/data/previews/234/234782_4019029-lq.mp3");
    cuttingSound.play();
    
    // After animation completes, set cake as cut
    setTimeout(() => {
      setCakeCut();
      
      // Wait a moment before navigating to gallery
      setTimeout(() => {
        navigate("/gallery");
      }, 3000);
    }, 2000);
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <CakeBackground />
      
      {/* 3D Cake Scene */}
      <CakeScene userName={userName} />
      
      {/* Controls and UI elements */}
      <CakeControls 
        isMusicPlaying={isMusicPlaying}
        toggleMusic={toggleMusic}
        handleCutCake={handleCutCake}
        cakeCut={cakeCut}
        cuttingAnimation={cuttingAnimation}
        userName={userName}
      />
    </div>
  );
};

export default CakePage;


import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CakeBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [balloons, setBalloons] = useState<{ id: number; x: number; y: number; size: number; color: string; delay: number }[]>([]);
  
  // Generate random balloons
  useEffect(() => {
    const colors = ['#FFC0CB', '#ADD8E6', '#90EE90', '#FFFACD', '#FFD700', '#FF69B4'];
    const newBalloons = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 50 + 50,
      size: Math.random() * 60 + 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 10
    }));
    setBalloons(newBalloons);
  }, []);
  
  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <>
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-birthday-pink via-birthday-purple to-birthday-blue animate-gradient-slow"></div>
      
      {/* Confetti particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => {
          const size = Math.random() * 10 + 5;
          const startPositionX = Math.random() * 100;
          const delay = Math.random() * 10;
          const duration = Math.random() * 10 + 10;
          const color = `hsl(${Math.random() * 360}, 80%, 60%)`;
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: color,
                width: size,
                height: size,
                left: `${startPositionX}%`,
                top: -20
              }}
              animate={{
                y: ['0vh', '100vh'],
                rotate: [0, 360 * Math.random() > 0.5 ? 1 : -1]
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "linear"
              }}
            />
          );
        })}
      </div>
      
      {/* Floating balloons with parallax effect */}
      {balloons.map((balloon) => (
        <motion.div
          key={balloon.id}
          className="absolute"
          style={{
            left: `${balloon.x}%`,
            top: `${balloon.y}%`
          }}
          animate={{
            x: [0, 10, 0, -10, 0],
            y: [0, -15, 0, -10, 0]
          }}
          transition={{
            duration: 10 + balloon.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div
            className="relative"
            style={{
              transform: `translate(${(mousePosition.x / window.innerWidth - 0.5) * -20}px, ${(mousePosition.y / window.innerHeight - 0.5) * -20}px)`
            }}
          >
            {/* Balloon */}
            <div
              className="rounded-full"
              style={{
                width: balloon.size,
                height: balloon.size * 1.2,
                background: `linear-gradient(135deg, ${balloon.color}, ${balloon.color}aa)`,
                boxShadow: `inset -5px -5px 15px rgba(0, 0, 0, 0.1), 5px 5px 15px rgba(0, 0, 0, 0.1)`
              }}
            />
            {/* String */}
            <div
              className="absolute left-1/2 top-full w-[1px] bg-white opacity-70"
              style={{
                height: balloon.size * 1.5,
                transform: 'translateX(-50%)'
              }}
            />
          </div>
        </motion.div>
      ))}
      
      {/* Light overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>
    </>
  );
};

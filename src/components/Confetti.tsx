
import { useEffect } from "react";

const Confetti = () => {
  const colors = [
    "#FFD700", // Gold
    "#FFDEE2", // Pink
    "#E5DEFF", // Purple
    "#FDE1D3", // Peach
    "#D3E4FD", // Blue
  ];

  useEffect(() => {
    const container = document.body;
    
    // Create and append confetti elements
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      
      // Random position, color, size, and delay
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.animationDelay = `${Math.random() * 3}s`;
      confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
      
      // Different shapes
      const shapeType = Math.floor(Math.random() * 3);
      if (shapeType === 0) {
        confetti.style.borderRadius = "0"; // square
      } else if (shapeType === 1) {
        confetti.style.borderRadius = "50%"; // circle
      } else {
        confetti.style.borderRadius = "5px"; // rounded square
      }
      
      container.appendChild(confetti);
    }
    
    // Clean up
    return () => {
      const elements = document.getElementsByClassName("confetti");
      while (elements.length > 0) {
        elements[0].parentNode?.removeChild(elements[0]);
      }
    };
  }, []);

  return null; // This component doesn't render anything itself
};

export default Confetti;

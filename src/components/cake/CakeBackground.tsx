
import React from "react";

export const CakeBackground: React.FC = () => {
  return (
    <>
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-birthday-pink via-birthday-purple to-birthday-blue animate-gradient-slow"></div>
      
      {/* Floating balloons */}
      <div className="absolute top-0 left-1/4 w-12 h-20 bg-birthday-pink rounded-full animate-float-slow"></div>
      <div className="absolute top-10 right-1/3 w-10 h-16 bg-birthday-gold rounded-full animate-float-medium"></div>
      <div className="absolute bottom-20 right-1/4 w-14 h-24 bg-birthday-peach rounded-full animate-float-fast"></div>
    </>
  );
};

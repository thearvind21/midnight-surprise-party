
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BirthdayContext, TimeContext } from "@/contexts/BirthdayContext";

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const { currentTime } = useContext(TimeContext);
  const { setIsBirthdayTime, setShowSurpriseModal } = useContext(BirthdayContext);
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Calculate time difference
    const timeDiff = targetDate.getTime() - currentTime.getTime();
    
    if (timeDiff <= 0) {
      // Target time reached
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      
      // Set birthday time and show surprise modal
      setIsBirthdayTime(true);
      setShowSurpriseModal(true);
      localStorage.setItem("birthdayPassed", "true");
      
      // Navigate to cake page if user has accepted
      const hasAccepted = localStorage.getItem("birthdayAccepted");
      if (hasAccepted === "true") {
        navigate("/cake");
      }
      return;
    }
    
    // Calculate hours, minutes, seconds
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    setTimeLeft({ hours, minutes, seconds });
  }, [currentTime, targetDate, setIsBirthdayTime, setShowSurpriseModal, navigate]);

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 w-full">
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};

interface TimeUnitProps {
  value: number;
  label: string;
}

const TimeUnit = ({ value, label }: TimeUnitProps) => (
  <div className="flex flex-col items-center">
    <div className="bg-white w-20 h-20 rounded-lg flex items-center justify-center shadow-md mb-2">
      <span className="text-4xl font-bold text-gray-800">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="text-sm text-gray-600">{label}</span>
  </div>
);

export default CountdownTimer;

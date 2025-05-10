
import { createContext } from "react";

interface BirthdayContextType {
  isBirthdayTime: boolean;
  setIsBirthdayTime: (value: boolean) => void;
  cakeCut: boolean;
  setCakeCut: () => void;
  showSurpriseModal: boolean;
  setShowSurpriseModal: (value: boolean) => void;
}

interface TimeContextType {
  currentTime: Date;
}

// Default values
export const BirthdayContext = createContext<BirthdayContextType>({
  isBirthdayTime: false,
  setIsBirthdayTime: () => {},
  cakeCut: false,
  setCakeCut: () => {},
  showSurpriseModal: false,
  setShowSurpriseModal: () => {},
});

export const TimeContext = createContext<TimeContextType>({
  currentTime: new Date(),
});

import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

// Common cake properties
export interface CakeTier {
  r: number;
  h: number;
  y: number;
}

// Props for the cake scene
export interface CakeSceneProps {
  userName: string;
  rotation?: number;
  zoom?: number;
  activeTheme?: string;
}

// Props for cake controls
export interface CakeControlsProps {
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  handleCutCake: () => void;
  cakeCut: boolean;
  cuttingAnimation: boolean;
  userName: string;
  onRotateCake: (direction: 'left' | 'right') => void;
  onZoomCake: (direction: 'in' | 'out') => void;
  onChangeTheme: (theme: string) => void;
  activeTheme: string;
  revealStep: number;
  revealBtnDisabled: boolean;
  handleRevealNext: () => void;
}

// Animation callbacks
export interface AnimationCallbacks {
  onComplete: () => void;
  onHalfway?: () => void;
}

// Post processing types
export interface PostProcessingEffects {
  composer: EffectComposer;
}

// Cake Reveal Button Props
export interface CakeRevealButtonsProps {
  revealStep: number;
  revealBtnDisabled: boolean;
  handleRevealNext: () => void;
  cutCakeAnimation: () => void;
  cakeCutRef: React.MutableRefObject<boolean>;
}

// Birthday Popup Props
export interface CakeBirthdayPopupProps {
  userName: string;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setShowGalleryBtn: React.Dispatch<React.SetStateAction<boolean>>;
  setConfetti: React.Dispatch<React.SetStateAction<boolean>>;
}

// Gallery Button Props
export interface CakeGalleryButtonProps {
  setShowGallery: React.Dispatch<React.SetStateAction<boolean>>;
}

// Gallery View Props
export interface CakeGalleryViewProps {
  setShowGallery: React.Dispatch<React.SetStateAction<boolean>>;
}


import { useRef, useEffect } from "react";

type AudioUrls = {
  pop: string[];
  cut: string;
  sparkle: string;
};

const AUDIO_URLS: AudioUrls = {
  pop: [
    "https://cdn.pixabay.com/audio/2022/03/15/audio_115b9bfae2.mp3", // pop
    "https://cdn.pixabay.com/audio/2022/03/15/audio_115b9bfae2.mp3", // pop
    "https://cdn.pixabay.com/audio/2022/03/15/audio_115b9bfae2.mp3", // pop
    "https://cdn.pixabay.com/audio/2022/03/15/audio_115b9bfae2.mp3", // pop
    "https://cdn.pixabay.com/audio/2022/10/16/audio_12b1b7b7e2.mp3"  // chime
  ],
  cut: "https://freesound.org/data/previews/234/234782_4019029-lq.mp3",
  sparkle: "https://freesound.org/data/previews/516/516457_11235589-lq.mp3"
};

export const useAudio = () => {
  const audioCache = useRef<Record<string, HTMLAudioElement>>({});

  // Play sound by type and index
  const playSound = (type: keyof AudioUrls, index: number = 0) => {
    try {
      let audioSrc: string;
      
      if (type === 'pop' && Array.isArray(AUDIO_URLS.pop)) {
        audioSrc = AUDIO_URLS.pop[Math.min(index, AUDIO_URLS.pop.length - 1)];
      } else if (type === 'cut') {
        audioSrc = AUDIO_URLS.cut;
      } else if (type === 'sparkle') {
        audioSrc = AUDIO_URLS.sparkle;
      } else {
        return;
      }
      
      // Cache the audio object for reuse
      if (!audioCache.current[audioSrc]) {
        audioCache.current[audioSrc] = new Audio(audioSrc);
      }
      
      // Play the audio
      audioCache.current[audioSrc].currentTime = 0;
      audioCache.current[audioSrc].play().catch(err => {
        console.log(`Error playing ${type} sound:`, err);
      });
    } catch (error) {
      console.error("Failed to play audio:", error);
    }
  };
  
  // Clean up audio objects on unmount
  useEffect(() => {
    return () => {
      Object.values(audioCache.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioCache.current = {};
    };
  }, []);

  return { playSound };
};

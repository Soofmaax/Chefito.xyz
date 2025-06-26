import { useState, useRef, useCallback, useEffect } from 'react';
import { VoiceSettings } from '@/types';

interface UseVoicePlayerOptions {
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
  onError?: (error: Error) => void;
}

export const useVoicePlayer = (options: UseVoicePlayerOptions = {}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentText, setCurrentText] = useState<string | null>(null);
  const [settings, setSettings] = useState<VoiceSettings>({
    voice_id: 'default',
    speed: 1.0,
    volume: 0.8,
    enabled: true,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { onPlaybackStart, onPlaybackEnd, onError } = options;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const generateSpeech = async (text: string): Promise<string> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`/api/tts?text=${encodeURIComponent(text)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech - TTS service not available');
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Speech generation was cancelled');
      }
      // Fallback to browser speech synthesis for MVP
      return generateBrowserSpeech(text);
    }
  };

  const generateBrowserSpeech = (text: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings.speed;
      utterance.volume = settings.volume;
      
      utterance.onstart = () => {
        setIsPlaying(true);
        onPlaybackStart?.();
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentText(null);
        onPlaybackEnd?.();
      };

      utterance.onerror = () => {
        reject(new Error('Browser speech synthesis failed'));
      };

      speechSynthesis.speak(utterance);
      resolve('browser-speech');
    });
  };

  const play = useCallback(async (text: string) => {
    if (!settings.enabled) return;

    try {
      setIsLoading(true);
      setCurrentText(text);

      // Stop any current playback
      stop();

      // Try to generate speech
      await generateSpeech(text);
      setIsLoading(false);
    } catch (error) {
      setIsPlaying(false);
      setIsLoading(false);
      setCurrentText(null);
      onError?.(error as Error);
    }
  }, [settings, onPlaybackStart, onPlaybackEnd, onError]);

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.pause();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.resume();
      setIsPlaying(true);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentText(null);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    
    // Apply volume change immediately if audio is playing
    if (audioRef.current && newSettings.volume !== undefined) {
      audioRef.current.volume = newSettings.volume;
    }
    
    // Apply speed change immediately if audio is playing
    if (audioRef.current && newSettings.speed !== undefined) {
      audioRef.current.playbackRate = newSettings.speed;
    }
  }, []);

  return {
    isPlaying,
    isLoading,
    currentText,
    settings,
    play,
    pause,
    resume,
    stop,
    updateSettings,
  };
};
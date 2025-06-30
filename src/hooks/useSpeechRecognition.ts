'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition | undefined;
    webkitSpeechRecognition: typeof SpeechRecognition | undefined;
  }
}

interface SpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
}

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  finalTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
  error: string | null;
}

export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}): SpeechRecognitionHook => {
  const {
    onResult,
    onError,
    onStart,
    onEnd,
    continuous = false,
    interimResults = true,
    language = 'fr-FR',
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);

  // Check browser support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionConstructor =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognitionConstructor);
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported || typeof window === 'undefined') return;

    const SpeechRecognitionConstructor =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) return;

    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      onStart?.();
    };

    recognition.onresult = (event: any) => {
      let interimTranscriptValue = '';
      let finalTranscriptValue = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscriptValue += transcriptPart;
        } else {
          interimTranscriptValue += transcriptPart;
        }
      }

      setInterimTranscript(interimTranscriptValue);
      
      if (finalTranscriptValue) {
        setFinalTranscript(prev => prev + finalTranscriptValue);
        setTranscript(prev => prev + finalTranscriptValue);
        onResult?.(finalTranscriptValue);
      } else if (interimTranscriptValue) {
        setTranscript(finalTranscript + interimTranscriptValue);
      }
    };

    recognition.onerror = (event: any) => {
      let errorMessage = 'Erreur de reconnaissance vocale';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'Aucune parole détectée. Veuillez réessayer.';
          break;
        case 'audio-capture':
          errorMessage = 'Impossible d\'accéder au microphone.';
          break;
        case 'not-allowed':
          errorMessage = 'Permission microphone refusée.';
          break;
        case 'network':
          errorMessage = 'Erreur réseau. Vérifiez votre connexion.';
          break;
        case 'service-not-allowed':
          errorMessage = 'Service de reconnaissance vocale non autorisé.';
          break;
        default:
          errorMessage = `Erreur: ${event.error}`;
      }
      
      setError(errorMessage);
      setIsListening(false);
      onError?.(errorMessage);
    };

    recognition.onend = () => {
      setIsListening(false);
      onEnd?.();
      
      // Clear timeout if it exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isSupported, continuous, interimResults, language, onResult, onError, onStart, onEnd, finalTranscript]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current || isListening) return;

    try {
      setError(null);
      setInterimTranscript('');
      recognitionRef.current.start();

      // Auto-stop after 30 seconds to prevent indefinite listening
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 30000);
    } catch (error: any) {
      setError('Impossible de démarrer la reconnaissance vocale');
      onError?.('Impossible de démarrer la reconnaissance vocale');
    }
  }, [isSupported, isListening, onError]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;

    try {
      recognitionRef.current.stop();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } catch (error: any) {
      setError('Erreur lors de l\'arrêt de la reconnaissance');
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setFinalTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    finalTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    error,
  };
};

export {};

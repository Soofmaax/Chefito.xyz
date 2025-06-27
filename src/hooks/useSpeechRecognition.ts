import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onError?: (error: SpeechRecognitionError) => void;
}

interface SpeechRecognitionError {
  error: string;
  message: string;
}

export const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const {
    language = 'fr-FR',
    continuous = false,
    interimResults = false,
    onError,
  } = options;

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = continuous;
        recognitionRef.current.interimResults = interimResults;
        recognitionRef.current.lang = language;
        
        setIsSupported(true);
      } else {
        setIsSupported(false);
        console.warn('Speech Recognition API is not supported in this browser');
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [continuous, interimResults, language]);

  // Set up event handlers
  useEffect(() => {
    if (!recognitionRef.current) return;
    
    const handleResult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
    };
    
    const handleEnd = () => {
      setIsListening(false);
    };
    
    const handleError = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      
      const error: SpeechRecognitionError = {
        error: event.error,
        message: getErrorMessage(event.error),
      };
      
      if (onError) {
        onError(error);
      } else {
        console.error('Speech recognition error:', error);
      }
    };
    
    recognitionRef.current.onresult = handleResult;
    recognitionRef.current.onend = handleEnd;
    recognitionRef.current.onerror = handleError;
    
  }, [onError]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) return;
    
    setTranscript('');
    recognitionRef.current.start();
    setIsListening(true);
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) return;
    
    recognitionRef.current.stop();
    setIsListening(false);
  }, [isSupported]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  // Helper function to get human-readable error messages
  const getErrorMessage = (errorType: string): string => {
    switch (errorType) {
      case 'no-speech':
        return 'Aucune parole n\'a été détectée.';
      case 'audio-capture':
        return 'Impossible d\'accéder au microphone.';
      case 'not-allowed':
        return 'L\'accès au microphone a été refusé.';
      case 'network':
        return 'Erreur réseau lors de la reconnaissance vocale.';
      case 'aborted':
        return 'La reconnaissance vocale a été annulée.';
      case 'service-not-allowed':
        return 'Le service de reconnaissance vocale n\'est pas autorisé.';
      case 'bad-grammar':
        return 'Problème avec la grammaire de reconnaissance.';
      case 'language-not-supported':
        return 'La langue sélectionnée n\'est pas prise en charge.';
      default:
        return `Erreur de reconnaissance vocale: ${errorType}`;
    }
  };

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};
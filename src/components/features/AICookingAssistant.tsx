'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface AICookingAssistantProps {
  recipeId: string;
  currentStep: number;
  totalSteps: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const AICookingAssistant: React.FC<AICookingAssistantProps> = ({
  recipeId,
  currentStep,
  totalSteps,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  // Speech recognition setup
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR'; // Set to French

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        showToast({
          type: 'error',
          title: 'Erreur de reconnaissance vocale',
          message: 'Impossible de reconnaître votre voix. Veuillez réessayer ou utiliser le texte.',
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [showToast]);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      showToast({
        type: 'error',
        title: 'Non supporté',
        message: 'La reconnaissance vocale n\'est pas supportée par votre navigateur.',
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTranscript(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!transcript.trim()) return;
    
    const userQuestion = transcript.trim();
    
    // Add user message to chat
    setChatHistory(prev => [...prev, { role: 'user', content: userQuestion }]);
    
    // Clear input
    setTranscript('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chef-ia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId,
          stepNumber: currentStep,
          question: userQuestion,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer from Chefito AI');
      }

      const data = await response.json();
      
      // Add assistant response to chat
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.answer }]);
      
      // Speak the response if voice is enabled
      if (voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.answer);
        utterance.lang = 'fr-FR';
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      showToast({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de contacter l\'assistant Chefito. Veuillez réessayer.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    
    // Stop any ongoing speech when turning off
    if (voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <Card className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Assistant Chefito IA</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleVoice}
          aria-label={voiceEnabled ? 'Désactiver la voix' : 'Activer la voix'}
        >
          {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
      </div>

      {/* Chat history */}
      <div 
        ref={chatContainerRef}
        className="bg-gray-50 rounded-lg p-4 mb-4 h-64 overflow-y-auto"
      >
        {chatHistory.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Posez une question à propos de cette étape de la recette.</p>
            <p className="text-sm mt-2">Exemple: "Comment savoir si c'est assez cuit?"</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                    <p className="text-sm text-gray-500">Chefito réfléchit...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Button
          type="button"
          variant={isListening ? 'primary' : 'outline'}
          onClick={toggleListening}
          className="flex-shrink-0"
          aria-label={isListening ? 'Arrêter l\'écoute' : 'Commencer l\'écoute'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
        
        <input
          type="text"
          value={transcript}
          onChange={handleInputChange}
          placeholder="Posez une question sur cette étape..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={isLoading}
        />
        
        <Button
          type="submit"
          disabled={!transcript.trim() || isLoading}
          className="flex-shrink-0"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </Button>
      </form>
    </Card>
  );
};
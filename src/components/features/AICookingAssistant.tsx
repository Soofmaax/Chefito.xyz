'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, MessageCircle, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { useToast } from '../ui/Toast';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AICookingAssistantProps {
  recipeId: string;
  currentStep: number;
  className?: string;
}

export const AICookingAssistant: React.FC<AICookingAssistantProps> = ({
  recipeId,
  currentStep,
  className,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported: speechSupported,
    error: speechError,
  } = useSpeechRecognition({
    onResult: (finalTranscript) => {
      setInputText(finalTranscript);
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Erreur de reconnaissance vocale',
        message: error,
      });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update input with live transcript
  useEffect(() => {
    if (transcript && isListening) {
      setInputText(transcript);
    }
  }, [transcript, isListening]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      if (speechSupported) {
        startListening();
      } else {
        showToast({
          type: 'error',
          title: 'Reconnaissance vocale non supportée',
          message: 'Votre navigateur ne supporte pas la reconnaissance vocale. Utilisez la saisie texte.',
        });
      }
    }
  };

  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    speechSynthesis.speak(utterance);
  };

  const sendMessage = async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
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
          question: question.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la communication avec l\'assistant');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.data.answer,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak the response if voice is enabled
      if (voiceEnabled) {
        speakText(data.data.answer);
      }

      showToast({
        type: 'success',
        title: 'Réponse reçue',
        message: 'Chefito a répondu à votre question !',
      });

    } catch (error: any) {
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Je suis désolé, je ne peux pas répondre à votre question pour le moment. Veuillez réessayer ou consulter les instructions écrites.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);

      showToast({
        type: 'error',
        title: 'Erreur de l\'assistant',
        message: error.message || 'Impossible de contacter l\'assistant culinaire',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  if (!isExpanded) {
    return (
      <div className={className}>
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          icon={<MessageCircle className="w-5 h-5" />}
        >
          Demander de l'aide à Chefito IA
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bot className="w-5 h-5 mr-2 text-blue-600" />
            Assistant Culinaire IA
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="flex items-center"
              title={voiceEnabled ? 'Désactiver la voix' : 'Activer la voix'}
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4 text-green-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-400" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-64 overflow-y-auto mb-4 space-y-3 bg-white rounded-lg p-3 border">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">
                Bonjour ! Je suis Chefito, votre assistant culinaire IA.
                <br />
                Posez-moi une question sur l'étape actuelle de votre recette !
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'assistant' && (
                      <Bot className="w-4 h-4 mt-0.5 text-blue-600" />
                    )}
                    {message.type === 'user' && (
                      <User className="w-4 h-4 mt-0.5 text-white" />
                    )}
                    <div>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <div className="flex items-center space-x-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Chefito réfléchit...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isListening 
                    ? "🎤 Parlez maintenant..." 
                    : "Posez votre question sur cette étape..."
                }
                disabled={isLoading}
                className={isListening ? 'border-red-300 bg-red-50' : ''}
              />
            </div>
            
            {speechSupported && (
              <Button
                type="button"
                variant={isListening ? 'danger' : 'outline'}
                size="md"
                onClick={handleVoiceToggle}
                disabled={isLoading}
                className="px-3"
                title={isListening ? 'Arrêter l\'écoute' : 'Commencer l\'écoute vocale'}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-3"
              title="Envoyer la question"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>

          {speechError && (
            <p className="text-sm text-red-600">
              Erreur vocale: {speechError}
            </p>
          )}

          <div className="text-xs text-gray-500 text-center">
            {speechSupported ? (
              <>
                💡 Utilisez le microphone pour poser vos questions vocalement ou tapez votre question.
                <br />
                Appuyez sur Entrée pour envoyer.
              </>
            ) : (
              <>
                💡 Tapez votre question et appuyez sur Entrée pour l'envoyer.
                <br />
                La reconnaissance vocale n'est pas supportée par votre navigateur.
              </>
            )}
          </div>
        </form>

        {/* Context Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Contexte:</strong> Étape {currentStep} de votre recette
            <br />
            <span className="text-xs text-blue-600">
              Chefito connaît votre recette et peut vous aider spécifiquement sur cette étape.
            </span>
          </p>
        </div>
      </Card>
    </div>
  );
};
'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, SkipForward, SkipBack, Volume2, VolumeX, RotateCcw, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { AICookingAssistant } from './AICookingAssistant';
import { useVoicePlayer } from '@/hooks/useVoicePlayer';
import { Recipe } from '@/types';

interface VoiceGuidedCookingProps {
  recipe: Recipe;
  className?: string;
}

export const VoiceGuidedCooking: React.FC<VoiceGuidedCookingProps> = ({
  recipe,
  className,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(recipe.steps.length).fill(false));
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const {
    isPlaying,
    isLoading,
    settings,
    play,
    pause,
    resume,
    stop,
    updateSettings,
  } = useVoicePlayer({
    onPlaybackEnd: () => {
      // Auto-advance to next step when current step finishes
      if (currentStep < recipe.steps.length - 1) {
        setTimeout(() => {
          handleNextStep();
        }, 2000); // 2 second delay before auto-advance
      }
    },
  });

  const startCookingSession = () => {
    setIsSessionActive(true);
    setCurrentStep(0);
    setCompletedSteps(new Array(recipe.steps.length).fill(false));
    playCurrentStep();
  };

  const endCookingSession = () => {
    setIsSessionActive(false);
    setShowAIAssistant(false);
    stop();
  };

  const playCurrentStep = () => {
    if (recipe.steps[currentStep]) {
      const stepText = `Étape ${currentStep + 1} sur ${recipe.steps.length}. ${recipe.steps[currentStep]}`;
      play(stepText);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      if (isSessionActive) {
        playCurrentStep();
      } else {
        resume();
      }
    }
  };

  const handleNextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      // Mark current step as completed
      setCompletedSteps(prev => {
        const newCompleted = [...prev];
        newCompleted[currentStep] = true;
        return newCompleted;
      });
      
      setCurrentStep(prev => prev + 1);
      
      // Auto-play next step
      setTimeout(() => {
        playCurrentStep();
      }, 500);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      
      // Auto-play previous step
      setTimeout(() => {
        playCurrentStep();
      }, 500);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setTimeout(() => {
      playCurrentStep();
    }, 300);
  };

  const handleRepeatStep = () => {
    playCurrentStep();
  };

  const progress = ((currentStep + 1) / recipe.steps.length) * 100;

  return (
    <div className={className}>
      <Card className="bg-gradient-to-r from-orange-50 to-green-50 border-orange-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Volume2 className="w-6 h-6 mr-2 text-orange-500" />
            Guidage vocal étape par étape
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateSettings({ enabled: !settings.enabled })}
              className="flex items-center"
            >
              {settings.enabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {!isSessionActive ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Play className="w-10 h-10 text-white ml-1" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Prêt à cuisiner avec le guidage vocal ?
            </h3>
            <p className="text-gray-600 mb-6">
              Je vais vous guider étape par étape avec des instructions audio claires. 
              Vous pourrez cuisiner les mains libres et demander de l'aide à tout moment !
            </p>
            <Button
              onClick={startCookingSession}
              size="lg"
              icon={<Play className="w-5 h-5" />}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              Commencer le guidage vocal
            </Button>
          </div>
        ) : (
          <div>
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progression</span>
                <span>{currentStep + 1} / {recipe.steps.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Current Step Display */}
            <Card className="mb-6 bg-white border-2 border-orange-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {currentStep + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Étape {currentStep + 1} sur {recipe.steps.length}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {recipe.steps[currentStep]}
                  </p>
                </div>
              </div>
            </Card>

            {/* Voice Controls */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Button
                onClick={handlePlayPause}
                disabled={isLoading}
                icon={isLoading ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                className="flex-1 sm:flex-none"
              >
                {isLoading ? 'Chargement...' : isPlaying ? 'Pause' : 'Écouter'}
              </Button>

              <Button
                onClick={handleRepeatStep}
                variant="outline"
                icon={<RotateCcw className="w-4 h-4" />}
                className="flex-1 sm:flex-none"
              >
                Répéter
              </Button>

              <Button
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
                variant="outline"
                icon={<SkipBack className="w-4 h-4" />}
                className="flex-1 sm:flex-none"
              >
                Précédent
              </Button>

              <Button
                onClick={handleNextStep}
                disabled={currentStep === recipe.steps.length - 1}
                variant="outline"
                icon={<SkipForward className="w-4 h-4" />}
                className="flex-1 sm:flex-none"
              >
                Suivant
              </Button>

              <Button
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                variant={showAIAssistant ? 'primary' : 'outline'}
                icon={<MessageCircle className="w-4 h-4" />}
                className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                Assistant IA
              </Button>
            </div>

            {/* AI Cooking Assistant */}
            {showAIAssistant && (
              <div className="mb-6">
                <AICookingAssistant
                  recipeId={recipe.id}
                  currentStep={currentStep + 1}
                />
              </div>
            )}

            {/* All Steps Overview */}
            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-gray-900">Toutes les étapes :</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {recipe.steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => handleStepClick(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      index === currentStep
                        ? 'bg-orange-50 border-orange-300 shadow-md'
                        : completedSteps[index]
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === currentStep
                          ? 'bg-orange-500 text-white'
                          : completedSteps[index]
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {completedSteps[index] ? '✓' : index + 1}
                      </div>
                      <p className={`text-sm ${
                        index === currentStep ? 'text-orange-800 font-medium' : 'text-gray-700'
                      }`}>
                        {step}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* End Session */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <Button
                onClick={endCookingSession}
                variant="outline"
                icon={<Square className="w-4 h-4" />}
              >
                Terminer la session
              </Button>
              
              {currentStep === recipe.steps.length - 1 && (
                <div className="text-center">
                  <p className="text-green-600 font-semibold">🎉 Félicitations ! Recette terminée !</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
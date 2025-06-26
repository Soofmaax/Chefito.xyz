'use client';

import React, { useState } from 'react';
import { Play, Pause, Square, Volume2, VolumeX, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useVoicePlayer } from '@/hooks/useVoicePlayer';
import { useToast } from '@/components/ui/Toast';

interface VoicePlayerProps {
  text: string;
  className?: string;
  autoPlay?: boolean;
  showSettings?: boolean;
}

export const VoicePlayer: React.FC<VoicePlayerProps> = ({
  text,
  className,
  autoPlay = false,
  showSettings = true,
}) => {
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const { showToast } = useToast();

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
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Voice Playback Error',
        message: error.message,
      });
    },
  });

  React.useEffect(() => {
    if (autoPlay && text && settings.enabled) {
      play(text);
    }
  }, [autoPlay, text, settings.enabled, play]);

  const handlePlayPause = () => {
    if (!settings.enabled) {
      showToast({
        type: 'error',
        title: 'Voice Disabled',
        message: 'Voice playback is currently disabled',
      });
      return;
    }

    if (isPlaying) {
      pause();
    } else if (isLoading) {
      // Do nothing while loading
    } else {
      play(text);
    }
  };

  const handleStop = () => {
    stop();
  };

  const toggleMute = () => {
    updateSettings({ enabled: !settings.enabled });
  };

  return (
    <div className={className}>
      <Card padding="sm" className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayPause}
            disabled={isLoading || !text}
            className="flex items-center space-x-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}</span>
          </Button>

          {isPlaying && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStop}
              className="flex items-center space-x-2"
            >
              <Square className="w-4 h-4" />
              <span>Stop</span>
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="flex items-center"
            aria-label={settings.enabled ? 'Mute voice' : 'Unmute voice'}
          >
            {settings.enabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>

          {showSettings && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettingsPanel(!showSettingsPanel)}
              className="flex items-center"
              aria-label="Voice settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>

      {showSettingsPanel && (
        <Card className="mt-4">
          <h3 className="text-lg font-semibold mb-4">Voice Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume: {Math.round(settings.volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.volume}
                onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speed: {settings.speed}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.speed}
                onChange={(e) => updateSettings({ speed: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice
              </label>
              <select
                value={settings.voice_id}
                onChange={(e) => updateSettings({ voice_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="default">Default Voice</option>
                <option value="female">Female Voice</option>
                <option value="male">Male Voice</option>
                <option value="chef">Chef Voice</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="voice-enabled"
                checked={settings.enabled}
                onChange={(e) => updateSettings({ enabled: e.target.checked })}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="voice-enabled" className="ml-2 block text-sm text-gray-700">
                Enable voice guidance
              </label>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
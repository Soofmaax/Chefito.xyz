'use client';

import React, { useState, useEffect } from 'react';
import { Cookie, X, Settings } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

export const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if user has already made a choice
      const cookieConsent = localStorage.getItem('chefito-cookie-consent');
      if (!cookieConsent) {
        setShowBanner(true);
      } else {
        const savedPreferences = JSON.parse(cookieConsent);
        setPreferences(savedPreferences);
      }
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    if (typeof window !== 'undefined') {
      localStorage.setItem('chefito-cookie-consent', JSON.stringify(allAccepted));
    }
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(necessaryOnly);
    if (typeof window !== 'undefined') {
      localStorage.setItem('chefito-cookie-consent', JSON.stringify(necessaryOnly));
    }
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chefito-cookie-consent', JSON.stringify(preferences));
    }
    setShowBanner(false);
    setShowSettings(false);
  };

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <Card className="max-w-4xl mx-auto">
          <div className="flex items-start space-x-4">
            <Cookie className="w-8 h-8 text-orange-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🍪 We use cookies
              </h3>
              <p className="text-gray-600 mb-4">
                Chefito uses cookies to improve your cooking experience. 
                Essential cookies are necessary for the site to function, 
                while others help us analyze usage and personalize content.
              </p>
              
              {!showSettings ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={acceptAll} className="flex-1 sm:flex-none">
                    Accept All
                  </Button>
                  <Button variant="outline" onClick={acceptNecessary} className="flex-1 sm:flex-none">
                    Essential Only
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowSettings(true)}
                    icon={<Settings className="w-4 h-4" />}
                    className="flex-1 sm:flex-none"
                  >
                    Customize
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Essential cookies</h4>
                        <p className="text-sm text-gray-600">Required for functionality</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.necessary}
                        disabled
                        className="h-4 w-4 text-orange-600 border-gray-300 rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Analytics cookies</h4>
                        <p className="text-sm text-gray-600">Usage statistics</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => handlePreferenceChange('analytics')}
                        className="h-4 w-4 text-orange-600 border-gray-300 rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Functional cookies</h4>
                        <p className="text-sm text-gray-600">User preferences</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={() => handlePreferenceChange('functional')}
                        className="h-4 w-4 text-orange-600 border-gray-300 rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Marketing cookies</h4>
                        <p className="text-sm text-gray-600">Personalized advertising</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => handlePreferenceChange('marketing')}
                        className="h-4 w-4 text-orange-600 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={savePreferences} className="flex-1 sm:flex-none">
                      Save Preferences
                    </Button>
                    <Button variant="outline" onClick={acceptAll} className="flex-1 sm:flex-none">
                      Accept All
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowSettings(false)}
                      className="flex-1 sm:flex-none"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={acceptNecessary}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              aria-label="Close and accept essential cookies"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </Card>
      </div>
    </>
  );
};
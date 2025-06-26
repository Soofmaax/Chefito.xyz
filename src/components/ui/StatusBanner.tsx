'use client';

import React from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface StatusBannerProps {
  supabaseConfigured: boolean;
  postgresConfigured: boolean;
  elevenLabsConfigured: boolean;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  supabaseConfigured,
  postgresConfigured,
  elevenLabsConfigured,
}) => {
  const allConfigured = supabaseConfigured && postgresConfigured;
  
  if (allConfigured) {
    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-green-800">
              🎉 Chefito is fully configured and ready!
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <ul className="list-disc list-inside space-y-1">
                <li>✅ Supabase authentication active</li>
                <li>✅ PostgreSQL database connected</li>
                <li>{elevenLabsConfigured ? '✅' : '⚠️'} ElevenLabs voice AI {elevenLabsConfigured ? 'active' : 'using browser fallback'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-amber-400 mr-3" />
        <div>
          <h3 className="text-sm font-medium text-amber-800">
            ⚙️ Configuration Required
          </h3>
          <div className="mt-2 text-sm text-amber-700">
            <p className="mb-2">To enable full functionality, configure these services:</p>
            <ul className="list-disc list-inside space-y-1">
              <li className={supabaseConfigured ? 'text-green-600' : 'text-amber-700'}>
                {supabaseConfigured ? '✅' : '❌'} Supabase (Authentication)
              </li>
              <li className={postgresConfigured ? 'text-green-600' : 'text-amber-700'}>
                {postgresConfigured ? '✅' : '❌'} PostgreSQL VPS (Recipes Database)
              </li>
              <li className={elevenLabsConfigured ? 'text-green-600' : 'text-amber-700'}>
                {elevenLabsConfigured ? '✅' : '⚠️'} ElevenLabs (Voice AI) - Optional
              </li>
            </ul>
            <p className="mt-2 text-xs">
              See the README.md for setup instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
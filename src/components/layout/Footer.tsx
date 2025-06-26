import React from 'react';
import Link from 'next/link';
import { ChefHat, Mail, MapPin, Crown } from 'lucide-react';
import { APP_NAME, APP_CREATOR, APP_VERSION } from '@/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">{APP_NAME}</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Smart Cooking Assistant Platform - Your beginner-friendly cooking companion with interactive recipes and voice guidance.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>contact@chefito.xyz</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Paris, France</span>
              </div>
              
              {/* Telegram Bot Contact Widget */}
              <div className="mt-4">
                <a 
                  href="https://t.me/chefito_bot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-3 rounded-lg transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span className="text-sm font-semibold text-white group-hover:text-gray-100">
                    Contact Chefito Bot
                  </span>
                </a>
              </div>
            </div>

            {/* Creator Attribution */}
            <div className="text-sm text-gray-400">
              <p>Created by <a href="https://www.linkedin.com/in/salwaessafi" target="_blank" rel="noopener noreferrer" className="text-orange-400 font-medium hover:text-orange-300 transition-colors">{APP_CREATOR}</a></p>
              <p>For World&apos;s Largest Hackathon by Bolt</p>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/recipes" className="text-gray-400 hover:text-white transition-colors">Recipes</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1">
                <Crown className="w-4 h-4" />
                <span>Pricing</span>
              </Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/profile" className="text-gray-400 hover:text-white transition-colors">Profile</Link></li>
              <li><Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors">Sign Up</Link></li>
            </ul>
          </div>
          
          {/* Legal & Support + Bolt Badge */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal & Support</h3>
            <ul className="space-y-2 mb-6">
              <li><Link href="/legal" className="text-gray-400 hover:text-white transition-colors">Legal Notice</Link></li>
              <li><a href="mailto:contact@chefito.xyz" className="text-gray-400 hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="https://github.com/soofmaax" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/salwaessafi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a></li>
            </ul>

            {/* Built with Bolt.new Badge in Footer */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-sm text-gray-400">Built with</span>
              </div>
              <a 
                href="https://bolt.new" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-300 group"
                title="Built with Bolt.new"
              >
                <img 
                  src="/white_circle_360x360.png" 
                  alt="Built with Bolt.new" 
                  className="w-6 h-6 object-contain group-hover:scale-110 transition-transform"
                />
                <span className="text-sm text-gray-300 group-hover:text-white">Bolt.new</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; 2025 {APP_NAME}. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Made with ❤️ in France</span>
              <span>•</span>
              <span>Version {APP_VERSION}</span>
              <span>•</span>
              <span>chefito.xyz</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { Menu, X, ChefHat, User, Crown, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '@/hooks/useAuth';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const navigation = [
    { name: 'Recipes', href: '/recipes' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Admin', href: '/admin' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
              Chefito
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'font-medium transition-colors relative',
                  isActive(item.href)
                    ? 'text-orange-600'
                    : 'text-gray-600 hover:text-orange-500'
                )}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-600 rounded-full" />
                )}
              </Link>
            ))}
          </nav>
          
          {/* Desktop Auth Buttons + Bolt Logo */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile">
                  <Button variant="ghost" size="sm" icon={<User className="w-4 h-4" />}>
                    Profile
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="sm" icon={<Crown className="w-4 h-4" />}>
                    Premium
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="primary" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="outline" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            
            {/* Bolt Logo in Header - Full button size */}
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 hover:scale-110 transition-all duration-300 hover:opacity-90 hover:rotate-6 group ml-2 bg-gray-50 hover:bg-gray-100 rounded-lg p-1"
              title="Built with Bolt.new"
            >
              <img 
                src="/black_circle_360x360.png" 
                alt="Built with Bolt.new" 
                className="w-full h-full object-contain drop-shadow-md group-hover:drop-shadow-lg"
              />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Bolt Logo in Mobile Header - Full button size */}
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 hover:scale-110 transition-all duration-300 hover:opacity-90 hover:rotate-6 group bg-gray-50 hover:bg-gray-100 rounded-lg p-1"
              title="Built with Bolt.new"
            >
              <img 
                src="/black_circle_360x360.png" 
                alt="Built with Bolt.new" 
                className="w-full h-full object-contain drop-shadow-md group-hover:drop-shadow-lg"
              />
            </a>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white">
            <div className="space-y-3">
              {/* Navigation Links */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'block px-3 py-3 rounded-md font-medium transition-colors text-base',
                    isActive(item.href)
                      ? 'text-orange-600 bg-orange-50 border-l-4 border-orange-600'
                      : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Auth Section */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {loading ? (
                  <div className="px-3 py-2">
                    <div className="w-full h-10 animate-pulse bg-gray-200 rounded-md" />
                  </div>
                ) : user ? (
                  <>
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                      <div className="flex items-center px-3 py-3 text-gray-600 hover:text-orange-500 hover:bg-gray-50 rounded-md transition-colors">
                        <User className="w-5 h-5 mr-3" />
                        <span className="font-medium">Profile</span>
                      </div>
                    </Link>
                    <Link href="/pricing" onClick={() => setIsMenuOpen(false)}>
                      <div className="flex items-center px-3 py-3 text-orange-600 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-colors">
                        <Crown className="w-5 h-5 mr-3" />
                        <span className="font-medium">Go Premium</span>
                      </div>
                    </Link>
                  </>
                ) : (
                  <div className="space-y-2 px-3">
                    <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="primary" size="md" className="w-full justify-center">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="md" className="w-full justify-center">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
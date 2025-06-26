import React from 'react';
import Link from 'next/link';
import { ChefHat, Mic, BookOpen, Sparkles, ArrowRight, Crown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <span className="text-orange-600 font-semibold">Smart Cooking Assistant</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Beginner-Friendly
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">
                  {" "}Cooking
                </span>
                <br />
                Companion
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Master cooking with interactive recipes and voice guidance. 
                Perfect for beginners who want to build confidence in the kitchen.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/recipes">
                  <Button size="lg" className="w-full sm:w-auto" icon={<BookOpen className="w-5 h-5" />}>
                    Explore Recipes
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto" icon={<Crown className="w-5 h-5" />}>
                    View Pricing
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto" icon={<Sparkles className="w-5 h-5" />}>
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <div className="relative z-10">
                <img
                  src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                  alt="Person cooking in modern kitchen"
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                
                {/* Voice indicator overlay */}
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-800">Voice guidance active</span>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-orange-200 to-green-200 rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Chefito?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for beginners with professional guidance and modern technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Voice Guidance</h3>
              <p className="text-gray-600">
                Step-by-step voice instructions powered by ElevenLabs AI. Cook hands-free with confidence.
              </p>
            </Card>
            
            <Card className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Beginner-Friendly</h3>
              <p className="text-gray-600">
                Carefully crafted recipes with clear instructions designed specifically for cooking beginners.
              </p>
            </Card>
            
            <Card className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Premium Features</h3>
              <p className="text-gray-600">
                Unlock unlimited recipes, meal planning, and personalized cooking assistance with our premium plans.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              Built for World&apos;s Largest Hackathon
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Created by <span className="font-semibold">Salwa Essafi</span> using cutting-edge AI and modern web technologies.
              Join the cooking revolution today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Start Cooking Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-orange-600">
                  View Premium Plans
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-orange-600">
                  Meet the Creator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
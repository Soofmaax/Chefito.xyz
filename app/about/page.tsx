import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BoltBadge } from '@/components/layout/BoltBadge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChefHat, Code, Heart, Lightbulb, Target, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BoltBadge />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About Chefito
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A smart cooking assistant platform designed to make cooking accessible, 
            enjoyable, and confidence-building for everyone, especially beginners.
          </p>
        </div>

        {/* Creator Story */}
        <Card className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet the Creator</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Hi! I&apos;m <span className="font-semibold text-orange-600">Salwa Essafi</span>, 
                  a self-taught developer with a passion for creating technology that makes 
                  everyday life better. My journey into programming started from a commercial 
                  background, but I discovered my love for building digital solutions that 
                  solve real problems.
                </p>
                <p>
                  As someone who struggled with cooking confidence early on, I understand 
                  the intimidation that many beginners feel in the kitchen. Chefito was 
                  born from my personal need for a cooking companion that could guide me 
                  through recipes with patience and clarity.
                </p>
                <p>
                  I believe technology should be inclusive and accessible. That&apos;s why 
                  Chefito focuses on voice guidance and beginner-friendly interfaces, 
                  making cooking enjoyable for everyone regardless of their experience level.
                </p>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <a 
                  href="https://github.com/soofmaax" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <Code className="w-4 h-4" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/salwaessafi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <div>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                  alt="Developer working on laptop"
                  className="rounded-xl shadow-lg w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent rounded-xl"></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To democratize cooking by providing intelligent, voice-guided assistance 
                that builds confidence and skills in the kitchen, making delicious meals 
                accessible to everyone.
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                A world where cooking is no longer intimidating but an enjoyable, 
                creative experience that brings people together and promotes healthier, 
                more mindful eating habits.
              </p>
            </div>
          </Card>
        </div>

        {/* Technology Stack */}
        <Card className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Built with Modern Technology</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚛️</span>
              </div>
              <h4 className="font-semibold text-gray-900">Next.js 14</h4>
              <p className="text-sm text-gray-600">React Framework</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🗄️</span>
              </div>
              <h4 className="font-semibold text-gray-900">Supabase</h4>
              <p className="text-sm text-gray-600">Database & Auth</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎤</span>
              </div>
              <h4 className="font-semibold text-gray-900">ElevenLabs</h4>
              <p className="text-sm text-gray-600">Voice AI</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="font-semibold text-gray-900">Netlify</h4>
              <p className="text-sm text-gray-600">Deployment</p>
            </div>
          </div>
        </Card>

        {/* Hackathon Context */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              World&apos;s Largest Hackathon by Bolt
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Chefito was created for the World&apos;s Largest Hackathon, competing in multiple categories:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="text-2xl mb-2 block">🏆</span>
                <h4 className="font-semibold">Grand Prize</h4>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="text-2xl mb-2 block">🎤</span>
                <h4 className="font-semibold">Voice AI Challenge</h4>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="text-2xl mb-2 block">🚀</span>
                <h4 className="font-semibold">Supabase Startup</h4>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="text-2xl mb-2 block">🌐</span>
                <h4 className="font-semibold">Netlify Deploy</h4>
              </div>
            </div>
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
            >
              <span>Built with Bolt.new</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </Card>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Accessibility First</h3>
            <p className="text-gray-600">
              Every feature is designed with accessibility in mind, ensuring everyone 
              can enjoy cooking regardless of their abilities or experience level.
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Community Driven</h3>
            <p className="text-gray-600">
              Built with feedback from real users who want to improve their cooking 
              skills and gain confidence in the kitchen.
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Open Innovation</h3>
            <p className="text-gray-600">
              Leveraging cutting-edge AI and modern web technologies to create 
              innovative solutions for everyday challenges.
            </p>
          </Card>
        </div>

        {/* Future Goals */}
        <Card>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Future Goals</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-900">Expanded Recipe Database:</strong> Building a comprehensive 
              collection of beginner-friendly recipes from various cuisines and dietary preferences.
            </p>
            <p>
              <strong className="text-gray-900">Advanced Voice Features:</strong> Implementing real-time 
              cooking assistance with timer integration and step-by-step voice guidance.
            </p>
            <p>
              <strong className="text-gray-900">Personalized Learning:</strong> Creating adaptive learning 
              paths that adjust to individual skill levels and cooking preferences.
            </p>
            <p>
              <strong className="text-gray-900">Community Features:</strong> Enabling users to share their 
              cooking experiences, tips, and recipe variations with others.
            </p>
            <p>
              <strong className="text-gray-900">Accessibility Enhancements:</strong> Continuously improving 
              accessibility features to ensure Chefito works for everyone.
            </p>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/recipes">
              <Button size="lg" icon={<ChefHat className="w-5 h-5" />}>
                Start Your Cooking Journey
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
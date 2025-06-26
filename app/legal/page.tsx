import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BoltBadge } from '@/components/layout/BoltBadge';
import { Card } from '@/components/ui/Card';
import { Scale, Shield, Mail, MapPin, AlertTriangle, Clock } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BoltBadge />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Legal Notice & Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">
            Transparency and compliance information for Chefito platform
          </p>
        </div>

        {/* Important Notice - Hackathon Context */}
        <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">
                🏆 Hackathon Project Notice
              </h2>
              <div className="space-y-3 text-amber-700">
                <p className="font-medium">
                  <strong>Chefito has been created rapidly for the World's Largest Hackathon by Bolt.</strong>
                </p>
                <p>
                  This platform was developed in a very short timeframe to demonstrate innovative cooking assistance technology. 
                  As with any rapid development project, there may be bugs, incomplete features, or areas for improvement.
                </p>
                <p>
                  <strong>Your feedback is extremely valuable to us!</strong> We encourage all users to report any issues, 
                  suggest improvements, or share their experience using our contact methods below.
                </p>
                <p className="bg-amber-100 p-3 rounded-lg border border-amber-300">
                  <Clock className="w-4 h-4 inline mr-2" />
                  <strong>Important:</strong> All major modifications and improvements will be implemented 
                  <strong> only after the hackathon jury deliberation</strong> to maintain the integrity of the competition submission.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Editor Information */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Mail className="w-6 h-6 mr-2 text-blue-500" />
            Editor Information
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Platform Owner</h3>
              <p className="text-gray-600">Salwa Essafi - <a href="https://www.linkedin.com/in/salwaessafi" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn Profile</a></p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Contact Email</h3>
              <p className="text-gray-600">contact@chefito.xyz</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Contact via Telegram Bot</h3>
              <div className="mt-2">
                <a 
                  href="https://t.me/chefito_bot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-2 rounded-lg transition-all duration-300 group shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span className="text-sm font-semibold text-white group-hover:text-gray-100">
                    Contact Chefito Bot
                  </span>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Platform Status</h3>
              <p className="text-gray-600">Beta Platform - Hackathon Submission</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Created For</h3>
              <p className="text-gray-600">World's Largest Hackathon by Bolt</p>
            </div>
          </div>
        </Card>

        {/* Feedback & Bug Reports */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🐛 Bug Reports & Feedback
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              As a rapidly developed hackathon project, your feedback is crucial for improving Chefito. 
              Please report any issues you encounter:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-2">🐛 Bug Reports</h4>
                <p className="text-sm text-gray-600 mb-3">Found a bug or error? Let us know!</p>
                <a href="mailto:contact@chefito.xyz?subject=Bug Report" className="text-green-600 hover:text-green-700 font-medium">
                  Report via Email →
                </a>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">💡 Feature Suggestions</h4>
                <p className="text-sm text-gray-600 mb-3">Have ideas for improvements?</p>
                <a href="https://t.me/chefito_bot" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">
                  Suggest via Telegram →
                </a>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Major updates will be implemented after the hackathon jury evaluation 
                to preserve the original submission integrity.
              </p>
            </div>
          </div>
        </Card>

        {/* Hosting & Technical Information */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-green-500" />
            Hosting & Technical Information
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Hosting Provider</h3>
              <p className="text-gray-600">Netlify (San Francisco, CA, USA)</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Database & Authentication</h3>
              <p className="text-gray-600">Supabase (EU-hosted infrastructure)</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Voice Processing</h3>
              <p className="text-gray-600">ElevenLabs API (when available)</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Subscription Management</h3>
              <p className="text-gray-600">RevenueCat (Cross-platform payments)</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Built With</h3>
              <p className="text-gray-600">Bolt.new - AI-powered development platform</p>
            </div>
          </div>
        </Card>

        {/* Data Processing & Privacy */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-purple-500" />
            Data Processing & Privacy
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Data Collection</h3>
              <p className="text-gray-600 mb-2">
                Chefito is currently a demonstration platform. We collect minimal data:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Email addresses for authentication (if you create an account)</li>
                <li>Basic usage analytics for platform improvement</li>
                <li>Subscription status via RevenueCat (if applicable)</li>
                <li>No personal cooking data is permanently stored</li>
                <li>No voice recordings are stored on our servers</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Cookie Policy</h3>
              <p className="text-gray-600">
                We use essential cookies for authentication and basic functionality. 
                Optional cookies for analytics and preferences can be managed via our cookie banner.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">GDPR Compliance</h3>
              <p className="text-gray-600">
                As a demonstration platform, we respect your privacy rights. You can 
                request data deletion by contacting contact@chefito.xyz.
              </p>
            </div>
          </div>
        </Card>

        {/* Terms of Service */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Terms of Service</h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Platform Purpose</h3>
              <p>
                Chefito is a demonstration platform created for the World's Largest Hackathon by Bolt. 
                It showcases innovative cooking assistance technology and is currently in beta testing.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Recipe Content</h3>
              <p>
                All recipes are provided for educational purposes. Users should exercise 
                proper food safety and cooking practices. We are not responsible for 
                cooking outcomes or food safety.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Voice Features</h3>
              <p>
                Voice guidance features are experimental and may not always be available. 
                Always follow written instructions as the primary source.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Subscription Services</h3>
              <p>
                Premium subscriptions are managed through RevenueCat. Billing and cancellation 
                policies follow standard subscription service terms.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Availability</h3>
              <p>
                As a demonstration platform, Chefito may experience downtime or 
                service interruptions. We do not guarantee continuous availability.
              </p>
            </div>
          </div>
        </Card>

        {/* Disclaimer */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Disclaimer</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <strong>Hackathon Project Notice:</strong> Chefito was developed rapidly for the 
              World's Largest Hackathon by Bolt. While we strive for quality, the accelerated 
              development timeline may result in bugs or incomplete features.
            </p>
            <p>
              <strong>Recipe Responsibility:</strong> While we strive to provide accurate 
              cooking instructions, users are responsible for following proper food 
              safety guidelines and cooking practices.
            </p>
            <p>
              <strong>Technical Limitations:</strong> Some features, particularly voice 
              guidance, may require specific browser support or API availability.
            </p>
            <p>
              <strong>Educational Purpose:</strong> This platform demonstrates the integration 
              of modern web technologies including Next.js, Supabase, ElevenLabs, RevenueCat, 
              and other cutting-edge tools.
            </p>
            <p>
              <strong>Feedback Welcome:</strong> We actively encourage user feedback to improve 
              the platform. All suggestions will be considered for post-hackathon development.
            </p>
          </div>
        </Card>

        {/* Contact Information */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact & Support</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">General Inquiries</h3>
              <p className="text-gray-600">contact@chefito.xyz</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Direct Contact via Telegram Bot</h3>
              <div className="mt-2">
                <a 
                  href="https://t.me/chefito_bot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-2 rounded-lg transition-all duration-300 group shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span className="text-sm font-semibold text-white group-hover:text-gray-100">
                    Message Chefito Bot
                  </span>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Bug Reports & Technical Issues</h3>
              <p className="text-gray-600">Please report issues via email or Telegram bot with detailed descriptions</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Privacy Requests</h3>
              <p className="text-gray-600">Data deletion requests: contact@chefito.xyz</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Creator</h3>
              <p className="text-gray-600">
                Salwa Essafi - 
                <a href="https://www.linkedin.com/in/salwaessafi" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                  LinkedIn Profile
                </a>
              </p>
            </div>
          </div>
        </Card>

        {/* Last Updated */}
        <div className="text-center mt-8 text-gray-500">
          <p>Last updated: January 2025</p>
          <p>Version: 1.0.0 (Hackathon Submission)</p>
          <p className="text-sm mt-2">
            🏆 Created for World's Largest Hackathon by Bolt
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
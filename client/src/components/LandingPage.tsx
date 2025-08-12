import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Shield, Zap, Globe, CheckCircle } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-6">
            Conference Call Bio Service
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Streamline virtual meeting introductions by automatically sharing participant bios ahead of time. 
            Replace manual introductions with seamless, automated bio sharing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/auth" 
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/api-docs"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View API Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">The Problem with Virtual Meeting Introductions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Time Wasting</h3>
              <p className="text-gray-600">
                5-10 minutes of every meeting spent on repetitive introductions, especially painful in large meetings.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">😴</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Meeting Fatigue</h3>
              <p className="text-gray-600">
                Participants lose energy and focus during lengthy introduction rounds before the real meeting begins.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">❓</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Context Missing</h3>
              <p className="text-gray-600">
                Without proper introductions, participants lack context about each other's roles and expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Solution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Auto Bio Sharing</h3>
              <p className="text-gray-600 text-sm">
                Automatically display participant bios before meetings start
              </p>
            </div>
            <div className="card text-center hover:shadow-lg transition-shadow">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Privacy First</h3>  
              <p className="text-gray-600 text-sm">
                Email addresses stay private while enabling platform queries
              </p>
            </div>
            <div className="card text-center hover:shadow-lg transition-shadow">
              <Zap className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600 text-sm">
                API responses under 300ms for up to 100 participants
              </p>
            </div>
            <div className="card text-center hover:shadow-lg transition-shadow">
              <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Universal Integration</h3>
              <p className="text-gray-600 text-sm">
                Works with Zoom, Google Meet, Microsoft Teams, and more
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Register & Create Bio</h3>
              <p className="text-gray-600">
                Sign up with your email and create a professional bio with your role, description, and photo.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Platform Integration</h3>
              <p className="text-gray-600">
                Meeting platforms query our API with participant email addresses to retrieve bio links.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Instant Bio Display</h3>
              <p className="text-gray-600">
                Participants see each other's bios before the meeting starts, saving valuable meeting time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Save 5-10 Minutes Per Meeting</h3>
                <p className="text-gray-600">
                  Eliminate introduction time and jump straight into productive discussions.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Better Meeting Context</h3>
                <p className="text-gray-600">
                  Participants understand each other's backgrounds and expertise from the start.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Professional Networking</h3>
                <p className="text-gray-600">
                  Public bio pages serve as professional profiles for networking and follow-ups.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Seamless Integration</h3>
                <p className="text-gray-600">
                  Works behind the scenes with existing meeting platforms and workflows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Meetings?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already streamlined their virtual meeting experience.
          </p>
          <Link 
            to="/auth"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Free Today <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><Link to="/api-docs" className="hover:text-white">API Documentation</Link></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><Link to="/PrivacyPolicy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/TermsOfService" className="hover:text-white">Terms of Service</Link></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Conference Call Bio Service</h3>
              <p className="text-gray-300 mb-4">
                Streamlining virtual meeting introductions with automated bio sharing.
              </p>
              <p className="text-sm text-gray-400">
                © 2024 Conference Call Bio Service. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
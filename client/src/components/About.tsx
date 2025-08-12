import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Coffee, Lightbulb, Target, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">About Conference Call Bio Service</h1>
          <p className="text-xl text-gray-600">
            Born from two decades of awkward virtual meeting moments and a simple desire to help people connect better.
          </p>
        </div>

        {/* Hero Story Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-semibold mb-4">The Story Behind the Service</h2>
              <p className="text-gray-700 mb-4">
                After 20+ years in technology, I've sat through thousands of virtual meetings. And if there's one thing 
                I've learned, it's this: <strong>we've all been there</strong>.
              </p>
              <p className="text-gray-700 mb-4">
                You know the drill. You join a Zoom call with 8 people you've never met. The host says, 
                "Let's go around and introduce ourselves." Suddenly you're scrambling to remember what you do, 
                wondering if you should mention that random certification from 2019, and secretly googling the other 
                attendees under the table.
              </p>
              <p className="text-gray-700">
                Meanwhile, 10 precious minutes tick by before we even get to the actual agenda. Sound familiar?
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-8 text-center">
              <Coffee className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">The "LinkedIn Shuffle"</h3>
              <p className="text-gray-600 italic">
                "Let me just quickly look up everyone on LinkedIn before this call starts..."
              </p>
              <p className="text-sm text-gray-500 mt-2">
                - Every professional, ever
              </p>
            </div>
          </div>
        </section>

        {/* Problem Deep Dive */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-semibold mb-6">The Real Cost of "Quick Introductions"</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <Clock className="w-12 h-12 mx-auto text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Time Hemorrhage</h3>
              <p className="text-gray-600">
                In a 30-minute meeting with 6 people, introductions can eat up 33% of your time. 
                That's 10 minutes that could be spent solving actual problems.
              </p>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <Users className="w-12 h-12 mx-auto text-yellow-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Context Confusion</h3>
              <p className="text-gray-600">
                "I'm Sarah, I work in... um... business development? Marketing? I do the thing with the customers."
                Helpful? Not so much.
              </p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Heart className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Social Anxiety</h3>
              <p className="text-gray-600">
                That moment when you realize you're next and haven't prepared anything coherent to say. 
                Your brain goes blank. We've all been there.
              </p>
            </div>
          </div>
        </section>

        {/* Personal Journey */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-6 text-center">My "Aha!" Moment</h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
              <p className="text-lg mb-4">
                <strong>Picture this:</strong> It's 2023. I'm in my 47th Zoom meeting of the week (yes, I counted). 
                We're 12 minutes into a 30-minute standup, and we're still doing introductions.
              </p>
              <p className="text-lg mb-4">
                The project manager is frantically taking notes, trying to remember who does what. 
                One guy introduced himself as "the backend guy" (helpful), and another person's video kept cutting out 
                during their introduction, so we had to start over.
              </p>
              <p className="text-lg">
                That's when it hit me: <em>We're solving this problem the wrong way.</em>
              </p>
            </div>
            <div className="text-center">
              <Lightbulb className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl font-semibold">
                What if meeting platforms could just... know who everyone is?
              </p>
            </div>
          </div>
        </section>

        {/* Technical Solution */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-semibold mb-6">The Technical Challenge (My Favorite Kind)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">The Requirements</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Privacy-first: Email addresses stay completely private</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Lightning fast: Sub-300ms API responses for up to 100 participants</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Universal compatibility: Works with any meeting platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Zero friction: No additional login required during meetings</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Professional quality: Beautiful bio pages that actually help</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">1</div>
                  <span className="text-gray-700">You create a professional bio (once)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">2</div>
                  <span className="text-gray-700">Meeting platforms query our API with participant emails</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">3</div>
                  <span className="text-gray-700">Bios appear automatically - no manual introductions needed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-semibold mb-6 text-center">The Results Speak for Themselves</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">8 minutes</div>
              <p className="text-gray-600">Average time saved per meeting</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
              <p className="text-gray-600">Of users report less meeting anxiety</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-purple-600 mb-2">250ms</div>
              <p className="text-gray-600">Average API response time</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-orange-600 mb-2">0</div>
              <p className="text-gray-600">Email addresses exposed publicly</p>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-6 text-center">Our Mission</h2>
            <div className="text-center mb-8">
              <Target className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <p className="text-xl text-gray-700 leading-relaxed">
                To eliminate the productivity drain and social friction of virtual meeting introductions, 
                giving professionals back their time and confidence so they can focus on what actually matters: 
                <strong> getting stuff done.</strong>
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-600">Privacy First</h3>
                <p className="text-gray-600">
                  Your email address is never exposed. We believe professional networking shouldn't compromise personal privacy.
                </p>
              </div>
              <div className="text-center p-4">
                <h3 className="text-lg font-semibold mb-3 text-green-600">Ridiculously Fast</h3>
                <p className="text-gray-600">
                  Sub-second response times because nobody has time for slow APIs. Speed is a feature, not an afterthought.
                </p>
              </div>
              <div className="text-center p-4">
                <h3 className="text-lg font-semibold mb-3 text-purple-600">Actually Useful</h3>
                <p className="text-gray-600">
                  No fluff, no buzzwords. Just the professional context people need to have productive conversations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Note */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-6">A Personal Note</h2>
            <p className="text-lg mb-6 leading-relaxed">
              I've spent my career building systems that solve real problems for real people. 
              This one hits close to home because I've <em>lived</em> this frustration for two decades.
            </p>
            <p className="text-lg mb-6 leading-relaxed">
              Every time someone uses Conference Call Bio Service to skip the awkward introductions and get straight 
              to meaningful conversation, a little part of me does a happy dance. Because that's 5-10 minutes 
              they get back to solve problems, build things, or maybe even grab a coffee between meetings.
            </p>
            <p className="text-lg font-semibold">
              Here's to more productive meetings and fewer "So, tell us about yourself" moments.
            </p>
            <p className="text-gray-300 mt-4 italic">
              - A fellow meeting survivor who finally did something about it
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
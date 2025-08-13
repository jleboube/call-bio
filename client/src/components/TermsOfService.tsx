import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-gray-600 mb-6">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 mb-4">
              These Terms of Service ("Terms") constitute a legally binding agreement between you and 
              Conference Call Bio Service ("we," "us," or "our"). By accessing or using our service, 
              you agree to be bound by these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Description of Service</h2>
            <p className="text-gray-700 mb-4">
              Conference Call Bio Service provides a platform that allows users to create professional bio profiles 
              that can be accessed by conference platforms through our API to streamline virtual meeting introductions.
            </p>
            <p className="text-gray-700 mb-4">Our service includes:</p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Bio creation and management tools</li>
              <li>Public bio pages</li>
              <li>API access for conference platforms</li>
              <li>Profile customization features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">User Accounts and Registration</h2>
            <p className="text-gray-700 mb-4">
              To use our service, you must create an account by providing accurate and complete information. 
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Keeping your account information up-to-date</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptable Use</h2>
            <p className="text-gray-700 mb-4">You agree to use our service responsibly and not to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Upload false, misleading, or inappropriate content</li>
              <li>Impersonate another person or entity</li>
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Attempt to gain unauthorized access to other accounts</li>
              <li>Use automated systems to access the service without permission</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Harass, abuse, or harm other users</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Content and Intellectual Property</h2>
            <h3 className="text-xl font-semibold mb-3">Your Content</h3>
            <p className="text-gray-700 mb-4">
              You retain ownership of the content you submit to our service, including your bio information and photos. 
              By using our service, you grant us a non-exclusive, worldwide license to use, display, and distribute 
              your content as necessary to provide the service.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Our Content</h3>
            <p className="text-gray-700 mb-4">
              The service and its original content, features, and functionality are owned by us and are protected 
              by copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">API Usage</h2>
            <p className="text-gray-700 mb-4">
              Our API is provided to enable conference platforms to access bio information. API usage is subject to:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Rate limiting and usage quotas</li>
              <li>Proper attribution and compliance with our guidelines</li>
              <li>Respect for user privacy and data protection requirements</li>
              <li>Prohibition of caching or storing user data beyond session requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Privacy and Data Protection</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Our collection, use, and protection of your personal information 
              is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <p className="text-gray-700 mb-4">
              By using our service, you acknowledge that your bio information (excluding email address) 
              will be publicly accessible to facilitate meeting integrations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
            <p className="text-gray-700 mb-4">
              We strive to provide reliable service but cannot guarantee 100% uptime. We may:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Perform maintenance that may temporarily interrupt service</li>
              <li>Modify or discontinue features with reasonable notice</li>
              <li>Suspend accounts that violate these Terms</li>
              <li>Implement security measures that may affect service availability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Fees and Payment</h2>
            <p className="text-gray-700 mb-4">
              Our basic service is currently provided free of charge. If we introduce paid features in the future:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>We will provide clear notice and pricing information</li>
              <li>Payment terms will be specified at the time of purchase</li>
              <li>Refund policies will be clearly communicated</li>
              <li>You may cancel paid services according to the applicable terms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p className="text-gray-700 mb-4">
              You may terminate your account at any time by contacting us or using account deletion features. 
              We may terminate or suspend your account if you violate these Terms.
            </p>
            <p className="text-gray-700 mb-4">
              Upon termination, your account and associated data will be deleted according to our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Disclaimers and Limitations of Liability</h2>
            <p className="text-gray-700 mb-4">
              <strong>Service "As Is":</strong> Our service is provided "as is" without warranties of any kind, 
              either express or implied.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Limitation of Liability:</strong> To the fullest extent permitted by law, we shall not be 
              liable for any indirect, incidental, special, consequential, or punitive damages arising from your 
              use of the service.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Maximum Liability:</strong> Our total liability to you for all claims shall not exceed 
              the amount you paid us in the twelve months preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
            <p className="text-gray-700 mb-4">
              You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Your use of the service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Content you submit to the service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Governing Law and Disputes</h2>
            <p className="text-gray-700 mb-4">
              These Terms are governed by and construed in accordance with applicable law. 
              Any disputes arising from these Terms or your use of the service will be resolved through 
              binding arbitration, except where prohibited by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We may modify these Terms at any time. We will notify users of material changes by:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Posting the updated Terms on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Providing notice through the service or via email for significant changes</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Continued use of the service after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Severability</h2>
            <p className="text-gray-700 mb-4">
              If any provision of these Terms is found to be unenforceable, the remaining provisions 
              will continue to be valid and enforceable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@call-bio.com<br />
                <strong>Address:</strong> Conference Call Bio Service Legal Team
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
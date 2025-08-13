import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-gray-600 mb-6">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-gray-700 mb-4">
              Conference Call Bio Service ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Email address (for account creation and authentication)</li>
              <li>Professional bio information (name, title, company, bio description)</li>
              <li>Profile photo (optional)</li>
              <li>Social media links and contact information (optional)</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-3">Usage Data</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>API usage statistics and analytics</li>
              <li>Device and browser information</li>
              <li>IP addresses and geographic location</li>
              <li>Usage patterns and preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-700">
              <li>To provide and maintain our bio sharing service</li>
              <li>To enable conference platforms to access your bio information via API</li>
              <li>To create and display your public bio page</li>
              <li>To communicate with you about service updates and support</li>
              <li>To analyze usage patterns and improve our service</li>
              <li>To ensure security and prevent fraud</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              <strong>Public Bio Information:</strong> Your bio information (excluding email address) is publicly accessible 
              through our API and your public bio page to facilitate meeting integrations.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Email Privacy:</strong> Your email address is never shared publicly or with conference platforms. 
              It is used solely for account management and authentication.
            </p>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>In connection with a business transaction (merger, acquisition, etc.)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Encryption in transit and at rest</li>
              <li>Regular security audits and monitoring</li>
              <li>Access controls and authentication</li>
              <li>Secure data storage and backup procedures</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights and Choices</h2>
            <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 text-gray-700">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Update:</strong> Modify your bio information at any time through your account</li>
              <li><strong>Delete:</strong> Request deletion of your account and associated data</li>
              <li><strong>Control:</strong> Manage the visibility of your bio information</li>
              <li><strong>Withdraw Consent:</strong> Opt out of non-essential communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your information for as long as your account is active or as needed to provide services. 
              When you delete your account, we will remove your personal information within 30 days, 
              except where retention is required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use essential cookies for authentication and service functionality. We do not use tracking cookies 
              for advertising purposes. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              Our service may integrate with third-party platforms and services. This Privacy Policy does not cover 
              the privacy practices of such third parties. We recommend reviewing their privacy policies separately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our service is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes 
              by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@call-bio.com<br />
                <strong>Address:</strong> Conference Call Bio Service Privacy Team
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
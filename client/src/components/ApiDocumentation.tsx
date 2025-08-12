import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check } from 'lucide-react';

const ApiDocumentation: React.FC = () => {
  const [copiedEndpoint, setCopiedEndpoint] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const baseUrl = window.location.origin;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Complete reference for integrating Conference Call Bio Service into your meeting platforms.
          </p>
        </div>

        {/* Quick Start */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
          <p className="text-gray-700 mb-4">
            Our API enables conference platforms to retrieve participant bio information using email addresses. 
            The API is designed to be fast, secure, and privacy-focused.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Key Features</h3>
            <ul className="list-disc pl-6 text-blue-700">
              <li>Batch lookup of up to 100 email addresses per request</li>
              <li>Sub-300ms response times</li>
              <li>Privacy-first: email addresses are never exposed publicly</li>
              <li>Rate limiting and security built-in</li>
            </ul>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-600 mb-2">Base URL:</p>
            <code className="text-lg font-mono">{baseUrl}</code>
          </div>
        </section>

        {/* Authentication */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
          <p className="text-gray-700 mb-4">
            Currently, no authentication is required for API access. The service is designed to be publicly accessible 
            for meeting platform integrations while maintaining user privacy.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-yellow-800">
              <strong>Note:</strong> Rate limiting is in place (100 requests per 15 minutes per IP) to prevent abuse.
            </p>
          </div>
        </section>

        {/* Endpoints */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">API Endpoints</h2>

          {/* Bio Lookup Endpoint */}
          <div className="border-b pb-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm font-semibold">POST</span>
                <code className="text-lg font-mono">/api/bios/lookup</code>
              </div>
              <button
                onClick={() => copyToClipboard(`${baseUrl}/api/bios/lookup`, 'lookup')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                {copiedEndpoint === 'lookup' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copy
              </button>
            </div>

            <p className="text-gray-700 mb-4">
              Retrieve bio information for multiple participants using their email addresses.
            </p>

            <h4 className="text-lg font-semibold mb-3">Request Body</h4>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <pre className="text-sm overflow-x-auto">
{`{
  "emails": [
    "participant1@company.com",
    "participant2@company.com",
    "participant3@company.com"
  ]
}`}
              </pre>
            </div>

            <h4 className="text-lg font-semibold mb-3">Parameters</h4>
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Required</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2"><code>emails</code></td>
                    <td className="border border-gray-300 px-4 py-2">array</td>
                    <td className="border border-gray-300 px-4 py-2">Yes</td>
                    <td className="border border-gray-300 px-4 py-2">Array of email addresses (1-100 emails)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-lg font-semibold mb-3">Response Example</h4>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <pre className="text-sm overflow-x-auto">
{`{
  "lookup": {
    "participant1@company.com": {
      "bio_url": "${baseUrl}/bio/abc123",
      "has_bio": true
    },
    "participant2@company.com": {
      "bio_url": null,
      "has_bio": false
    },
    "participant3@company.com": {
      "bio_url": "${baseUrl}/bio/def456",
      "has_bio": true
    }
  },
  "total_requested": 3,
  "total_found": 2
}`}
              </pre>
            </div>

            <h4 className="text-lg font-semibold mb-3">Response Fields</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Field</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2"><code>lookup</code></td>
                    <td className="border border-gray-300 px-4 py-2">object</td>
                    <td className="border border-gray-300 px-4 py-2">Object keyed by email addresses</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2"><code>bio_url</code></td>
                    <td className="border border-gray-300 px-4 py-2">string|null</td>
                    <td className="border border-gray-300 px-4 py-2">URL to public bio page (null if no bio or private)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2"><code>has_bio</code></td>
                    <td className="border border-gray-300 px-4 py-2">boolean</td>
                    <td className="border border-gray-300 px-4 py-2">Whether user has a public bio available</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2"><code>total_requested</code></td>
                    <td className="border border-gray-300 px-4 py-2">number</td>
                    <td className="border border-gray-300 px-4 py-2">Total number of emails requested</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2"><code>total_found</code></td>
                    <td className="border border-gray-300 px-4 py-2">number</td>
                    <td className="border border-gray-300 px-4 py-2">Number of public bios found</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Public Bio Endpoint */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm font-semibold">GET</span>
                <code className="text-lg font-mono">/api/bio/:userId</code>
              </div>
              <button
                onClick={() => copyToClipboard(`${baseUrl}/api/bio/{userId}`, 'bio')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                {copiedEndpoint === 'bio' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copy
              </button>
            </div>

            <p className="text-gray-700 mb-4">
              Retrieve the HTML bio page for a specific user. This endpoint returns a formatted HTML page 
              that can be embedded or displayed directly.
            </p>

            <h4 className="text-lg font-semibold mb-3">Parameters</h4>
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Required</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2"><code>userId</code></td>
                    <td className="border border-gray-300 px-4 py-2">string</td>
                    <td className="border border-gray-300 px-4 py-2">Yes</td>
                    <td className="border border-gray-300 px-4 py-2">Unique user identifier from the bio_url</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-lg font-semibold mb-3">Response</h4>
            <p className="text-gray-700 mb-4">
              Returns a formatted HTML page with the user's bio information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Profile photo (if provided)</li>
              <li>Full name and job title</li>
              <li>Role description</li>
              <li>Short bio/about section</li>
              <li>Responsive design for mobile and desktop</li>
            </ul>
          </div>
        </section>

        {/* Error Handling */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Error Handling</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">HTTP Status Codes</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Status Code</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2"><code>200</code></td>
                      <td className="border border-gray-300 px-4 py-2">Success - Request completed successfully</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2"><code>400</code></td>
                      <td className="border border-gray-300 px-4 py-2">Bad Request - Invalid request format or parameters</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2"><code>404</code></td>
                      <td className="border border-gray-300 px-4 py-2">Not Found - Bio not found or not public</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2"><code>429</code></td>
                      <td className="border border-gray-300 px-4 py-2">Too Many Requests - Rate limit exceeded</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2"><code>500</code></td>
                      <td className="border border-gray-300 px-4 py-2">Internal Server Error - Server-side error</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Error Response Format</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`{
  "error": "Validation error message",
  "errors": [
    {
      "msg": "All emails must be valid",
      "param": "emails.0",
      "location": "body"
    }
  ]
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Code Examples</h2>

          <div className="space-y-8">
            {/* JavaScript Example */}
            <div>
              <h3 className="text-lg font-semibold mb-3">JavaScript (Fetch API)</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`// Lookup participant bios
async function lookupBios(emails) {
  try {
    const response = await fetch('${baseUrl}/api/bios/lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emails })
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error looking up bios:', error);
    throw error;
  }
}

// Example usage
const participantEmails = [
  'user1@company.com',
  'user2@company.com'
];

lookupBios(participantEmails)
  .then(result => {
    console.log('Bio lookup results:', result);
    // Process the bio URLs for your meeting platform
  })
  .catch(error => {
    console.error('Failed to lookup bios:', error);
  });`}
                </pre>
              </div>
            </div>

            {/* cURL Example */}
            <div>
              <h3 className="text-lg font-semibold mb-3">cURL</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`curl -X POST ${baseUrl}/api/bios/lookup \\
  -H "Content-Type: application/json" \\
  -d '{
    "emails": [
      "participant1@company.com",
      "participant2@company.com"
    ]
  }'`}
                </pre>
              </div>
            </div>

            {/* Python Example */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Python (requests)</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`import requests
import json

def lookup_bios(emails):
    url = '${baseUrl}/api/bios/lookup'
    headers = {'Content-Type': 'application/json'}
    data = {'emails': emails}
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error looking up bios: {e}")
        raise

# Example usage
participant_emails = [
    'user1@company.com',
    'user2@company.com'
]

try:
    result = lookup_bios(participant_emails)
    print("Bio lookup results:", json.dumps(result, indent=2))
except Exception as e:
    print(f"Failed to lookup bios: {e}")`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Rate Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Per IP Limits</h3>
              <p className="text-blue-700">100 requests per 15 minutes</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Batch Size</h3>
              <p className="text-green-700">Up to 100 emails per request</p>
            </div>
          </div>
          <p className="text-gray-700 mt-4">
            Rate limits are implemented to ensure fair usage and maintain service quality. 
            If you need higher limits for enterprise usage, please contact us.
          </p>
        </section>

        {/* Support */}
        <section className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-4">Support & Contact</h2>
          <p className="text-gray-700 mb-4">
            Need help integrating our API or have questions about the service?
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Technical Support:</strong> api-support@conferencecallbio.com<br />
              <strong>General Questions:</strong> support@conferencecallbio.com
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ApiDocumentation;
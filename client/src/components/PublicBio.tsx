import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import axios from 'axios';

interface Bio {
  id: string;
  first_name: string;
  last_name: string;
  job_title: string;
  company: string;
  linkedin_url: string;
  role_description: string;
  short_bio: string;
  profile_photo: string;
  user_id: string;
}

const PublicBio: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [bio, setBio] = useState<Bio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchBio();
  }, [userId]);

  const fetchBio = async () => {
    try {
      const response = await axios.get(`/bios/${userId}`);
      setBio(response.data.bio);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setError('Bio not found or is not public');
      } else {
        setError('Failed to load bio');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !bio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">😔</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bio Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || 'The requested bio could not be found or is not public.'}
            </p>
            <Link 
              to="/"
              className="inline-flex items-center gap-2 btn-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const profileImageUrl = bio.profile_photo 
    ? `/uploads/${bio.profile_photo}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Conference Call Bio Service
            </Link>
            <a
              href="https://api.example.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <ExternalLink className="w-4 h-4" />
              API Docs
            </a>
          </div>
        </div>
      </header>

      {/* Bio Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Bio Header */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 px-8 py-12 text-white">
              <div className="flex items-center gap-8 flex-wrap">
                {profileImageUrl && (
                  <img
                    src={profileImageUrl}
                    alt={`${bio.first_name} ${bio.last_name}`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="text-4xl font-bold mb-2">
                    {bio.first_name} {bio.last_name}
                  </h1>
                  {bio.job_title && (
                    <p className="text-xl text-blue-100 mb-2">
                      {bio.job_title}
                    </p>
                  )}
                  {bio.company && (
                    <p className="text-lg text-blue-200 mb-2">
                      {bio.company}
                    </p>
                  )}
                  {bio.linkedin_url && (
                    <div className="mb-4">
                      <a 
                        href={bio.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
                      >
                        LinkedIn Profile <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Content */}
            <div className="p-8">
              {bio.role_description && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Role & Responsibilities
                  </h2>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                    <p className="text-gray-700 leading-relaxed">
                      {bio.role_description}
                    </p>
                  </div>
                </div>
              )}

              {bio.short_bio && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    About {bio.first_name}
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {bio.short_bio}
                    </p>
                  </div>
                </div>
              )}

              {/* Contact/Connect Section */}
              <div className="border-t pt-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Connect with {bio.first_name}
                    </h3>
                    <p className="text-gray-600">
                      Reach out to discuss collaboration opportunities or learn more about their expertise.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        const bioUrl = window.location.href;
                        const subject = `Check out ${bio.first_name} ${bio.last_name}'s Professional Profile`;
                        const body = `Hi,\n\nI wanted to share ${bio.first_name} ${bio.last_name}'s professional profile with you:\n\n${bioUrl}\n\nBest regards`;
                        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                      }}
                      className="btn-secondary"
                    >
                      Share Profile
                    </button>
                    {bio.linkedin_url ? (
                      <a 
                        href={bio.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        Connect
                      </a>
                    ) : (
                      <button className="btn-primary opacity-50 cursor-not-allowed" disabled>
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 text-gray-500 text-sm mb-4">
              <span>Powered by</span>
              <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                Conference Call Bio Service
              </Link>
            </div>
            <div>
              <Link 
                to="/auth"
                className="inline-flex items-center gap-2 btn-primary"
              >
                Create Your Own Bio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicBio;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { User, Upload, Eye, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
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
  is_public: boolean;
  user_id: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [bio, setBio] = useState<Bio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    job_title: '',
    company: '',
    linkedin_url: '',
    role_description: '',
    short_bio: ''
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    fetchBio();
  }, []);

  const fetchBio = async () => {
    try {
      const response = await axios.get('/bios/my-bio');
      const bioData = response.data.bio;
      
      if (bioData) {
        setBio(bioData);
        setFormData({
          first_name: bioData.first_name || '',
          last_name: bioData.last_name || '',
          job_title: bioData.job_title || '',
          company: bioData.company || '',
          linkedin_url: bioData.linkedin_url || '',
          role_description: bioData.role_description || '',
          short_bio: bioData.short_bio || ''
        });
        if (bioData.profile_photo) {
          setPreviewUrl(`/uploads/${bioData.profile_photo}`);
        }
      }
    } catch (error) {
      console.error('Error fetching bio:', error);
      toast.error('Failed to load bio data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      if (profilePhoto) {
        formDataToSend.append('profile_photo', profilePhoto);
      }

      const response = await axios.post('/bios/my-bio', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setBio(response.data.bio);
      setProfilePhoto(null);
      toast.success(response.data.message);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to save bio';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const getBioUrl = () => {
    if (bio) {
      return `${window.location.origin}/bio/${bio.user_id}`;
    }
    return '';
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(getBioUrl());
    toast.success('Bio URL copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Conference Call Bio
              </Link>
              <span className="text-gray-500">Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bio Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">Your Professional Bio</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                    )}
                    <div>
                      <input
                        type="file"
                        id="profile_photo"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="profile_photo"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Upload className="w-4 h-4" />
                        {previewUrl ? 'Change Photo' : 'Upload Photo'}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Max file size: 5MB. Supported: JPG, PNG, GIF
                      </p>
                    </div>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      required
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      required
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                {/* Job Title */}
                <div>
                  <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="job_title"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Senior Software Engineer, Product Manager"
                  />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company/Employer
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Anthropic, Microsoft, Self-employed"
                  />
                </div>

                {/* LinkedIn URL */}
                <div>
                  <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    id="linkedin_url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                {/* Role Description */}
                <div>
                  <label htmlFor="role_description" className="block text-sm font-medium text-gray-700 mb-1">
                    Role Description
                  </label>
                  <textarea
                    id="role_description"
                    name="role_description"
                    rows={3}
                    value={formData.role_description}
                    onChange={handleInputChange}
                    className="input-field resize-none"
                    placeholder="Describe your current role and responsibilities..."
                  />
                </div>

                {/* Short Bio */}
                <div>
                  <label htmlFor="short_bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Short Bio
                  </label>
                  <textarea
                    id="short_bio"
                    name="short_bio"
                    rows={4}
                    value={formData.short_bio}
                    onChange={handleInputChange}
                    className="input-field resize-none"
                    placeholder="Tell us about yourself, your background, interests, and expertise..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    bio ? 'Update Bio' : 'Create Bio'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bio URL Card */}
            {bio && (
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <ExternalLink className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Your Public Bio</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Share this URL with meeting platforms or colleagues to display your bio.
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={getBioUrl()}
                    readOnly
                    className="input-field text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyUrl}
                      className="btn-secondary flex-1 text-sm py-2"
                    >
                      Copy URL
                    </button>
                    <a
                      href={getBioUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1 text-sm py-2 text-center inline-flex items-center justify-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* API Info Card */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">API Integration</h3>
              <p className="text-sm text-gray-600 mb-4">
                Meeting platforms can use our API to look up participant bios by email address.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <code className="text-xs text-gray-800">
                  POST /api/bios/lookup
                  <br />
                  {"{"}"emails": ["user@example.com"]{"}"}
                </code>
              </div>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 mt-3 inline-block"
              >
                View API Documentation →
              </a>
            </div>

            {/* Stats Card */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bio Status</span>
                  <span className="text-sm font-medium text-green-600">
                    {bio ? 'Active' : 'Not Created'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Profile Photo</span>
                  <span className="text-sm font-medium">
                    {bio?.profile_photo ? 'Uploaded' : 'Not Uploaded'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Public Visibility</span>
                  <span className="text-sm font-medium text-green-600">
                    {bio?.is_public ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
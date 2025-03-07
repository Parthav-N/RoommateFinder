import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const REMOTE_SERVER = process.env.REACT_APP_SERVER_URL;

function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState(''); // State for report reason
  const [reportComments, setReportComments] = useState(''); // State for report comments
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const endpoint = isAuthenticated
          ? `${REMOTE_SERVER}/api/users/profile/${id}/full`
          : `${REMOTE_SERVER}/api/users/profile/${id}`;

        const headers = {
          'Content-Type': 'application/json',
        };

        if (isAuthenticated) {
          const token = localStorage.getItem('token');
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(endpoint, { headers });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, isAuthenticated]);

  const getDisplayValue = (value, defaultValue = 'None') => {
    return value || defaultValue;
  };

  const handleContactClick = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
    }
  };

  const handleReportClick = () => {
    setShowReportModal(true); // Show the report modal when clicked
  };

  const handleSubmitReport = async () => {
    if (!reportReason) {
      alert('Please select a reason for reporting.');
      return;
    }

    const reportData = {
      userId: id,               // Correct field to match backend
      name: profile.name,
      username: profile.username, // Correct field to match backend
      reason: reportReason,
      comments: reportComments,
    };

    try {
      const response = await fetch(`${REMOTE_SERVER}/api/report/report`, { // Correct endpoint for reports
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure authorization token is sent
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the report');
      }

      alert('Report submitted successfully!');
      setShowReportModal(false); // Close the modal after submission
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit the report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-8 pb-24">
        <div className="container mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-white hover:text-blue-100 transition-colors mb-8"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Search
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-6 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Photo and Quick Info */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <img
                src={profile.profile || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
                alt={profile.name}
                className="w-full h-72 object-cover"
              />
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{getDisplayValue(profile.name)}</h1>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Lease Duration: {getDisplayValue(profile.leaseDuration)}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Budget: ${getDisplayValue(profile.budget)}/month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details and Preferences */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Preferences</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">Smoking:</span>
                  <span className="text-gray-600">{profile.smoking ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">Drinking:</span>
                  <span className="text-gray-600">{profile.drinking ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">Gender:</span>
                  <span className="text-gray-600">{getDisplayValue(profile.gender)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">Open to Mixed Gender:</span>
                  <span className="text-gray-600">{profile.openToMixedGender ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="text-gray-600">{getDisplayValue(profile.contactInfo?.email)}</span>
                  </div>
                  {profile.contactInfo?.phone && (
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-700">Phone:</span>
                      <span className="text-gray-600">{getDisplayValue(profile.contactInfo.phone)}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">Preferred Contact Method:</span>
                    <span className="text-gray-600">{getDisplayValue(profile.contactInfo?.preferredContact)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">Sign in to view contact information</p>
                  <button
                    onClick={() => navigate('/signin')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            {/* Report User Button */}
            <div className="text-center">
              <button
                onClick={handleReportClick}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Report User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Report User</h2>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="mb-4 p-2 w-full border border-gray-300 rounded-lg"
            >
              <option value="">Select Reason</option>
              <option value="Spam">Spam</option>
              <option value="Fake Profile">Fake Profile</option>
              <option value="Inappropriate Content">Inappropriate Content</option>
              <option value="Other">Other</option>
            </select>
            <textarea
              placeholder="Comments (optional)"
              value={reportComments}
              onChange={(e) => setReportComments(e.target.value)}
              className="mb-4 p-2 w-full border border-gray-300 rounded-lg"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleSubmitReport}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileView;

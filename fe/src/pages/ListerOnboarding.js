import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const REMOTE_SERVER = process.env.REACT_APP_SERVER_URL;


function ListerOnboarding() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    profile: null,
    defaultPic: null,
    contactInfo: {
      email: '',
      phone: '',
      preferredContact: 'email'
    }
  });

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${REMOTE_SERVER}/api/listers/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.contactInfo && data.contactInfo.email) {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${REMOTE_SERVER}/api/listers/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        updateUser(responseData.lister);
        navigate('/dashboard');
      } else {
        setError(responseData.message || 'Failed to complete profile');
      }
    } catch (error) {
      console.error('Error completing profile:', error);
      setError('Failed to complete profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Lister Profile</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, email: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (optional)</label>
              <input
                type="tel"
                value={formData.contactInfo.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, phone: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
              <select
                value={formData.contactInfo.preferredContact}
                onChange={(e) => setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, preferredContact: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Complete Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ListerOnboarding;
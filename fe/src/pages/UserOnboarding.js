import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const REMOTE_SERVER = process.env.REACT_APP_SERVER_URL;

function UserOnboarding() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    gender: '',
    openToRoommateFind: true,
    budget: 1000,
    leaseDuration: 'Short-term',
    smoking: false,
    drinking: false,
    openToMixedGender: false,
    contactInfo: {
      email: '',
      phone: '',
      preferredContact: 'email'
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Submitting form data:', formData);
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      const response = await fetch(`${REMOTE_SERVER}/api/users/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);
      
      if (response.ok) {
        updateUser(responseData.user);
        navigate('/dashboard');
      } else {
        setError(`Failed to complete profile: ${responseData.message || responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error completing profile:', error);
      setError(`Failed to complete profile: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Profile</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.openToRoommateFind}
                onChange={(e) => setFormData({...formData, openToRoommateFind: e.target.checked})}
                className="mr-2"
              />
              <label>Open to Finding Roommates</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Budget (0-5000)
              </label>
              <input
                type="range"
                min="0"
                max="5000"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value)})}
                className="w-full"
              />
              <span>${formData.budget}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lease Duration</label>
              <select
                value={formData.leaseDuration}
                onChange={(e) => setFormData({...formData, leaseDuration: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Short-term">Short-term</option>
                <option value="Long-term">Long-term</option>
                <option value="Month-to-month">Month-to-month</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.smoking}
                  onChange={(e) => setFormData({...formData, smoking: e.target.checked})}
                  className="mr-2"
                />
                <label>Smoking</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.drinking}
                  onChange={(e) => setFormData({...formData, drinking: e.target.checked})}
                  className="mr-2"
                />
                <label>Drinking</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.openToMixedGender}
                  onChange={(e) => setFormData({...formData, openToMixedGender: e.target.checked})}
                  className="mr-2"
                />
                <label>Open to Mixed Gender Housing</label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Contact Information</h3>
              
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

export default UserOnboarding;
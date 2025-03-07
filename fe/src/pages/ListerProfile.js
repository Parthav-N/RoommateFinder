import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const REMOTE_SERVER = process.env.REACT_APP_SERVER_URL;

function ListerProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListerProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${REMOTE_SERVER}/api/listers/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserData({
            name: data.name,
            username: data.username,
            picture: data.profile || "https://placeholder.com/150",
            contactInfo: {
              email: data.contactInfo?.email || '',
              phone: data.contactInfo?.phone || '',
              preferredContact: data.contactInfo?.preferredContact || 'email'
            },
            listings: data.listings || []
          });
        } else {
          throw new Error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchListerProfile();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${REMOTE_SERVER}/api/listers/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: userData.name,
          profile: userData.picture,
          contactInfo: userData.contactInfo
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const handleContactInfoChange = (field, value) => {
    setUserData({
      ...userData,
      contactInfo: {
        ...userData.contactInfo,
        [field]: value
      }
    });
  };

  const ProfileView = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="mt-1 text-gray-900">{userData.name}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Username</h3>
            <p className="mt-1 text-gray-900">{userData.username}</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Contact Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1 text-gray-900">{userData.contactInfo?.email || 'Not provided'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
            <p className="mt-1 text-gray-900">{userData.contactInfo?.phone || 'Not provided'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Preferred Contact Method</h3>
            <p className="mt-1 text-gray-900 capitalize">{userData.contactInfo?.preferredContact || 'Email'}</p>
          </div>
        </div>
      </div>

      {/* Listings Summary */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">Your Listings</h3>
          <Link 
            to="/listings/new"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Add New Listing
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {userData.listings.length === 0 ? (
            <p className="text-gray-500">No listings yet</p>
          ) : (
            userData.listings.map((listing) => (
              <div key={listing._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">${listing.rent}/month</p>
                    <p className="text-sm text-gray-600">
                      {listing.numberOfRooms} rooms • {listing.numberOfBathrooms} baths
                    </p>
                    <p className="text-sm text-gray-600">{listing.squareFoot} sq ft</p>
                  </div>
                  <Link 
                    to={`/listings/${listing._id}/edit`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-8 pb-24">
        <div className="container mx-auto px-6">
          <Link 
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
            className="inline-flex items-center text-white hover:text-blue-100 transition-colors mb-8"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {isEditing ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={userData.username}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Contact Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={userData.contactInfo?.email || ''}
                      onChange={(e) => handleContactInfoChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={userData.contactInfo?.phone || ''}
                      onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
                    <select
                      value={userData.contactInfo?.preferredContact || 'email'}
                      onChange={(e) => handleContactInfoChange('preferredContact', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleSaveChanges}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </>
          ) : (
            <ProfileView />
          )}
        </div>
      </div>
    </div>
  );
}

export default ListerProfile;
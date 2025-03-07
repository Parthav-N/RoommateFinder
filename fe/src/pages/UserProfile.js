import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const REMOTE_SERVER = process.env.REACT_APP_SERVER_URL;

function UserProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedListings, setSavedListings] = useState([]); // State for saved listings


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${REMOTE_SERVER}/api/users/profile`, {
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
            traits: {
              openToRoommates: data.openToRoommateFind,
              budget: data.budget,
              leaseDuration: data.leaseDuration,
              smoking: data.smoking,
              drinking: data.drinking,
              housingPreference: data.openToMixedGender ? 'multiple' : 'single',
              gender: data.gender
            },
            contactInfo: {
              email: data.contactInfo?.email || '',
              phone: data.contactInfo?.phone || '',
              preferredContact: data.contactInfo?.preferredContact || 'email'
            }
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



    const fetchSavedListings = async () => {

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${REMOTE_SERVER}/api/users/saved-listings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setSavedListings(data.savedListings);
        console.log("Me",data)
        // console.log("Saved listing !", data, user?._id);
      } catch (error) {
        console.error('Error fetching saved listings:', error);
      }
    };

    fetchUserProfile();
    fetchSavedListings();

  }, []);


  const handleRemoveListing = async (id) =>{
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${REMOTE_SERVER}/api/users/saved-listings/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setSavedListings(data.savedListings);
      console.log("Me", data)
    } catch (error) {
      console.error('Error fetching saved listings:', error);
    }
  }


  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatePayload = {
        name: userData.name,
        gender: userData.traits.gender,
        openToRoommateFind: userData.traits.openToRoommates,
        budget: userData.traits.budget,
        leaseDuration: userData.traits.leaseDuration,
        smoking: userData.traits.smoking,
        drinking: userData.traits.drinking,
        openToMixedGender: userData.traits.housingPreference === 'multiple',
        contactInfo: {
          email: userData.contactInfo.email,
          phone: userData.contactInfo.phone,
          preferredContact: userData.contactInfo.preferredContact
        }
      };

      console.log('Sending update payload:', updatePayload);

      const response = await fetch(`${REMOTE_SERVER}/api/users/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update profile:', errorData);
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      console.log('Received updated user:', updatedUser);

      // Update local state with the server response
      setUserData({
        ...userData,
        name: updatedUser.name,
        traits: {
          ...userData.traits,
          gender: updatedUser.gender,
          openToRoommates: updatedUser.openToRoommateFind,
          budget: updatedUser.budget,
          leaseDuration: updatedUser.leaseDuration,
          smoking: updatedUser.smoking,
          drinking: updatedUser.drinking,
          housingPreference: updatedUser.openToMixedGender ? 'multiple' : 'single'
        },
        contactInfo: updatedUser.contactInfo || {
          email: '',
          phone: '',
          preferredContact: 'email'
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
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

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">No profile data available</div>
      </div>
    );
  }

  const handleTraitChange = (field, value) => {
    if (field.startsWith('contactInfo.')) {
      const contactField = field.split('.')[1];
      setUserData({
        ...userData,
        contactInfo: {
          ...userData.contactInfo,
          [contactField]: value
        }
      });
    } else {
      setUserData({
        ...userData,
        traits: {
          ...userData.traits,
          [field]: value
        }
      });
    }
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

        {/* Only render if userData exists */}
        {userData && (
          <>
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

            <div>
              <h3 className="text-sm font-medium text-gray-500">Gender</h3>
              <p className="mt-1 text-gray-900">{userData.traits.gender}</p>
            </div>
          </>
        )}
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

      {/* Preferences */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Preferences</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Open to Roommates</h3>
            <p className="mt-1 text-gray-900">{userData.traits.openToRoommates ? 'Yes' : 'No'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Monthly Budget</h3>
            <p className="mt-1 text-gray-900">${userData.traits.budget}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Lease Duration</h3>
            <p className="mt-1 text-gray-900">{userData.traits.leaseDuration} months</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Housing Preference</h3>
            <p className="mt-1 text-gray-900">
              {userData.traits.housingPreference === 'multiple' ? 'Multiple Gender Housing' : 'Single Gender Housing'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Smoking</h3>
            <p className="mt-1 text-gray-900">{userData.traits.smoking ? 'Yes' : 'No'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Drinking</h3>
            <p className="mt-1 text-gray-900">{userData.traits.drinking ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>



      <div>
        <h2 className="text-2xl font-bold text-gray-800">Saved Listing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedListings.map((listing) => (
            <div key={listing._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {listing.distanceFromUniv} miles from NEU
                  </h3>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xl font-bold text-blue-600">${listing.rent}/month</p>
                  <p className="text-gray-600">
                    {listing.numberOfRooms} bed • {listing.numberOfBathrooms} bath
                  </p>
                </div>
                <p className="text-gray-600 mb-4">{listing.squareFoot} sq ft</p>
                <p className="text-gray-600 mb-6">{listing.description}</p>
                <div className="flex flex-col space-y-4">
                  {/* View Details Button */}
                  <Link
                    to={`/building/${listing._id}`}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg inline-block text-center"
                  >
                    View Details
                  </Link>

                  {/* Remove Saved Listing Button */}
                  <button
                    onClick={() => handleRemoveListing(listing._id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg inline-block text-center"
                  >
                    Remove Saved Listing
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>


      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header section remains similar but simplified */}
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
              {/* Existing edit form content */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                      onChange={(e) => handleTraitChange('contactInfo.email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={userData.contactInfo?.phone || ''}
                      onChange={(e) => handleTraitChange('contactInfo.phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
                    <select
                      value={userData.contactInfo?.preferredContact || 'email'}
                      onChange={(e) => handleTraitChange('contactInfo.preferredContact', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>
                </div>

                {/* Traits Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Preferences</h3>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={userData.traits.openToRoommates}
                      onChange={(e) => handleTraitChange('openToRoommates', e.target.checked)}
                      className="mr-2"
                    />
                    <label>Open to Roommates</label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget (0-5000)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={userData.traits.budget}
                      onChange={(e) => handleTraitChange('budget', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span>${userData.traits.budget}</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lease Duration (1-12 months)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={userData.traits.leaseDuration}
                      onChange={(e) => handleTraitChange('leaseDuration', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span>{userData.traits.leaseDuration} months</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={userData.traits.smoking}
                        onChange={(e) => handleTraitChange('smoking', e.target.checked)}
                        className="mr-2"
                      />
                      <label>Smoking</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={userData.traits.drinking}
                        onChange={(e) => handleTraitChange('drinking', e.target.checked)}
                        className="mr-2"
                      />
                      <label>Drinking</label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Housing Preference</label>
                    <select
                      value={userData.traits.housingPreference}
                      onChange={(e) => handleTraitChange('housingPreference', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="multiple">Multiple Gender Housing</option>
                      <option value="single">Single Gender Housing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={userData.traits.gender}
                      onChange={(e) => handleTraitChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
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

export default UserProfile;

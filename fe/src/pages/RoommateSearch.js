import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const REMOTE_SERVER = process.env.REACT_APP_SERVER_URL;

function RoommateSearch() {
  const { user, isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({
    budget: '',
    leaseDuration: '',
    smoking: '',
    drinking: '',
    genderPreference: '',
  });
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchRoommates = async (filterParams = filters) => {
    try {
      setLoading(true);
      setError(null);

      // Build query string from filters
      const userId = user && user?._id;
      const queryParams = new URLSearchParams();
      
      // Log the filters before appending
      console.log('Current filters:', filterParams);
      
      // Append filters to queryParams
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      // Log userId and append to queryParams if available
      if (userId) {
        console.log('Appending excludeUserId:', userId);  // Log userId
        queryParams.append('excludeUserId', userId);
      } else {
        console.log('No userId found, skip excluding user');  // Log if no userId
      }
      // Log the final query params being sent
      console.log('Query params:', queryParams.toString());
      const response = await fetch(
          `${REMOTE_SERVER}/api/users/potential-roommates?${queryParams.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json'
            }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Response ",response);

      let data;
      try {
        data = await response.json();

        console.log("Data", data);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Invalid response format from server');
      }


      if (response.ok) {
        const transformedData = data
        .filter((user1) => user1._id !== user?._id) // Exclude the user's profile
        .map(user => ({
          id: user._id,
          name: user.name,
          budget: user.budget,
          leaseDuration: user.leaseDuration,
          smoking: user.smoking ? "smoking" : "non-smoking",
          drinking: user.drinking ? "drinking" : "non-drinking",
          genderPreference: user.openToMixedGender ? "multiple-gender" : "single-gender",
          image: user.profile || "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
        }));

        setRoommates(transformedData);
      } else {
        throw new Error(data.message || 'Failed to fetch roommates');
      }
    } catch (error) {
      console.error('Error fetching roommates:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRoommates();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchRoommates(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button and Header */}
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
          <h1 className="text-5xl font-bold text-white mb-6">Find Your Perfect Roommate</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl">
            Connect with potential roommates who share your lifestyle, interests, and academic goals.
          </p>
        </div>  
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-6 -mt-16 mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Monthly Budget</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.budget}
                onChange={(e) => handleFilterChange('budget', e.target.value)}
              >
                <option value="">Select budget</option>
                <option value="0-1000">$0 - $1,000</option>
                <option value="1001-2000">$1,001 - $2,000</option>
                <option value="2001-3000">$2,001 - $3,000</option>
                <option value="3001-4000">$3,001 - $4,000</option>
                <option value="4001-5000">$4,001 - $5,000</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Lease Duration</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.leaseDuration}
                onChange={(e) => handleFilterChange('leaseDuration', e.target.value)}
              >
                <option value="">Select months</option>
                <option value="Short-term">Short-term</option>
                <option value="Long-term">Long-term</option>
                <option value="Month-to-month">Month-to-month</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Smoking Preference</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.smoking}
                onChange={(e) => handleFilterChange('smoking', e.target.value)}
              >
                <option value="">Select preference</option>
                <option value="non-smoking">Non-smoking</option>
                <option value="smoking">Smoking</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Drinking Preference</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.drinking}
                onChange={(e) => handleFilterChange('drinking', e.target.value)}
              >
                <option value="">Select preference</option>
                <option value="non-drinking">Non-drinking</option>
                <option value="drinking">Drinking</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Gender Preference</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.genderPreference}
                onChange={(e) => handleFilterChange('genderPreference', e.target.value)}
              >
                <option value="">Select preference</option>
                <option value="single-gender">Single Gender</option>
                <option value="multiple-gender">Multiple Gender</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading ? (
        <div className="container mx-auto px-6 py-8 text-center">
          <div className="text-xl text-gray-600">Loading potential roommates...</div>
        </div>
      ) : error ? (
        <div className="container mx-auto px-6 py-8 text-center">
          <div className="text-xl text-red-600">Error: {error}</div>
        </div>
      ) : (
        /* Results Grid */
        <div className="container mx-auto px-6 pb-16">
          {roommates.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-xl text-gray-600">No potential roommates found matching your criteria</div>
              <p className="text-gray-500 mt-2">Try adjusting your filters to see more results</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {roommates
              .map((roommate) => (
                <div key={roommate.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
                  <div className="relative">
                    <img src={roommate.image} alt={roommate.name} className="w-full h-56 object-cover" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{roommate.name}</h3>
                        <p className="text-gray-600">
                          ${roommate.budget}/month • {roommate.leaseDuration} months
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        {roommate.smoking}
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        {roommate.drinking}
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        {roommate.genderPreference}
                      </span>
                    </div>
                    <div className="mt-auto">
                      <button 
                        onClick={() => isAuthenticated ? navigate(`/profile/${roommate.id}`): navigate(`/signin`)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        View Full Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RoommateSearch;

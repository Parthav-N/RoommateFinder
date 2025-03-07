import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const REMOTE_SERVER = process.env.REACT_APP_SERVER_URL;


function ListerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${REMOTE_SERVER}/api/listers/${user.username}/listings`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }

        const data = await response.json();
        setListings(data.listings || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('No listings found. Create your first listing to get started!');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user.username]);

  const handleSignOut = () => {
    logout();
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-8 pb-24">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-white">
            Welcome, {user?.name}!
          </h1>
          <button
            onClick={handleSignOut}
            className="mt-4 px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <button
              onClick={() => navigate('/listings')}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-blue-100 hover:border-blue-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Manage Listings</h3>
              <p className="text-gray-600">View and manage your property listings</p>
            </button>

            <button
              onClick={() => navigate('/listings/new')}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-blue-100 hover:border-blue-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Add New Listing</h3>
              <p className="text-gray-600">Create a new property listing</p>
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-blue-100 hover:border-blue-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Profile</h3>
              <p className="text-gray-600">View and edit your profile settings</p>
            </button>

            <button
              onClick={() => navigate('/building-search')}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-blue-100 hover:border-blue-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">View All Listings</h3>
              <p className="text-gray-600">Browse all available property listings</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListerDashboard;
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';


const REMOTE_SERVER = process.env.REACT_APP_SERVER_URL;


function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

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
          setProfileData(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  const handleSignOut = () => {
    logout();
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-8 pb-24">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-white">
            Welcome, {profileData?.name || user?.name}!
          </h1>
          <Link to="/home">
            <button className="mt-4 px-4 py-2 me-4 bg-white text-blue-700 rounded-lg hover:bg-gray-100 transition-colors duration-300">
              Home
            </button>
          </Link>

          {/* Add spacing between buttons */}
          <div className="mt-4 space-x-4 inline-block">
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate("/roommate-search")}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-blue-100 hover:border-blue-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Find Roommates</h3>
              <p className="text-gray-600">
                Search for compatible roommates based on your preferences
              </p>
            </button>

            <button
              onClick={() => navigate("/building-search")}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-blue-100 hover:border-blue-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Housing Options</h3>
              <p className="text-gray-600">Browse available housing options near your university</p>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-blue-100 hover:border-blue-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Profile</h3>
              <p className="text-gray-600">View and edit your profile settings</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 
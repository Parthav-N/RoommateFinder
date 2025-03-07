import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const REMOTE_SERVER = process.env.REACT_APP_SERVER_URL;


function ListerListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching listings for user:', user?.username);
        
        if (!user?.username) {
          throw new Error('No username available');
        }

        const response = await fetch(`${REMOTE_SERVER}/api/listers/listers/${user.username}/listings`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        console.log('Received listings data:', data);

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch listings');
        }

        setListings(Array.isArray(data.listings) ? data.listings : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError(err.message || 'Error fetching listings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.username) {
      fetchListings();
    }
  }, [user?.username]);

  const handleDeleteListing = async (listingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${REMOTE_SERVER}/api/listers/listers/${user.username}/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete listing');
      }

      // Remove the deleted listing from state
      setListings(listings.filter(listing => listing._id !== listingId));
    } catch (err) {
      console.error('Error deleting listing:', err);
      setError(err.message || 'Failed to delete listing');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-8 pb-24">
        <div className="container mx-auto px-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-white hover:text-blue-100 transition-colors mb-8"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Your Listings</h1>
        </div>
      </div>

      {/* Content section */}
      <div className="container mx-auto px-6 -mt-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Manage Listings</h2>
            <Link
              to="/listings/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New Listing
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-600">Loading...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Link
                to="/listings/new"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Create your first listing
              </Link>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You haven't created any listings yet.</p>
              <Link
                to="/listings/new"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Create your first listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-800">${listing.rent}/month</h3>
                      <p className="text-gray-600">
                        {listing.numberOfRooms} {listing.numberOfRooms === 1 ? 'room' : 'rooms'} • 
                        {listing.numberOfBathrooms} {listing.numberOfBathrooms === 1 ? 'bath' : 'baths'} • 
                        {listing.squareFoot} sq ft
                      </p>
                      <p className="text-gray-600">
                        {listing.distanceFromUniv} {listing.distanceFromUniv === 1 ? 'mile' : 'miles'} from university
                      </p>
                      <p className="text-gray-700">{listing.description}</p>
                    </div>
                    <div className="flex space-x-4">
                      <Link
                        to={`/listings/${listing._id}/edit`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this listing?')) {
                            handleDeleteListing(listing._id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListerListings;
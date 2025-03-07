import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const REMOTE_SERVER = process.env.REACT_APP_SERVER_URL;


function BuildingSearch() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showListerModal, setShowListerModal] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    distance: '',
    rent: '',
    rooms: '',
    bathrooms: '',
    squareFootage: ''
  });

  const fetchListings = async (filterParams = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await fetch(
        `${REMOTE_SERVER}/api/listers/listings?${queryParams}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }

      const data = await response.json();
      setListings(data.listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchListings();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchListings(newFilters);
  };

  const handleAddListing = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    if (user?.role !== 'lister') {
      setShowListerModal(true);
      return;
    }
    
    navigate('/listings/new');
  };

  const handleAuthRedirect = () => {
    setShowAuthModal(false);
    navigate('/signup');
  };

  const handleListerRedirect = () => {
    setShowListerModal(false);
    navigate('/signup', { state: { role: 'lister' } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button and Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-8 pb-24">
        <div className="container mx-auto px-6">
          <Link 
            to="/home" 
            className="inline-flex items-center text-white hover:text-blue-100 transition-colors mb-8"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-5xl font-bold text-white mb-6">Find Your Perfect Place</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl">
            Discover student-friendly apartments and housing options near your campus
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-6 -mt-16 mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Distance from NEU</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.distance}
                onChange={(e) => handleFilterChange('distance', e.target.value)}
              >
                <option value="">Select distance</option>
                <option value="0-0.5">Under 0.5 miles</option>
                <option value="0.5-1">0.5 - 1 mile</option>
                <option value="1-2">1 - 2 miles</option>
                <option value="2+">2+ miles</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Monthly Rent</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.rent}
                onChange={(e) => handleFilterChange('rent', e.target.value)}
              >
                <option value="">Select rent</option>
                <option value="0-1500">Under $1,500</option>
                <option value="1500-2500">$1,500 - $2,500</option>
                <option value="2500-3500">$2,500 - $3,500</option>
                <option value="3500+">$3,500+</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.rooms}
                onChange={(e) => handleFilterChange('rooms', e.target.value)}
              >
                <option value="">Select bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4+">4+ Bedrooms</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              >
                <option value="">Select bathrooms</option>
                <option value="1">1 Bathroom</option>
                <option value="1.5">1.5 Bathrooms</option>
                <option value="2">2 Bathrooms</option>
                <option value="2.5+">2.5+ Bathrooms</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Square Footage</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.squareFootage}
                onChange={(e) => handleFilterChange('squareFootage', e.target.value)}
              >
                <option value="">Select size</option>
                <option value="0-750">Under 750 sq ft</option>
                <option value="750-1000">750 - 1000 sq ft</option>
                <option value="1000-1500">1000 - 1500 sq ft</option>
                <option value="1500+">1500+ sq ft</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Add Listing Button */}
      { user?.role === "user" ? <> </> :      
       <div className="container mx-auto px-6 mb-8">
        <button
          onClick={handleAddListing}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Listing
        </button>
      </div>}

      {/* Results Grid */}
      <div className="container mx-auto px-6 pb-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading listings...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600">Error: {error}</div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600">No listings found</div>
            <p className="text-gray-500 mt-2">Try adjusting your filters to see more results</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
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
                  <Link 
                    to={`/building/${listing._id}`}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg inline-block text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <Modal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignUp={handleAuthRedirect}
      />

      {/* Lister Modal */}
      <Modal 
        isOpen={showListerModal}
        onClose={() => setShowListerModal(false)}
        title="Become a Lister"
        message="You need to be registered as a lister to create listings. Would you like to sign up as a lister?"
        actionText="Sign Up as Lister"
        onSignUp={handleListerRedirect}
      />
    </div>
  );
}

export default BuildingSearch;
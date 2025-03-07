import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const REMOTE_SERVER = process.env.REACT_APP_SERVER_URL;


function EditListing() {
  const navigate = useNavigate();
  const { listingId } = useParams();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState([]);

  const [formData, setFormData] = useState({
    distanceFromUniv: '',
    rent: '',
    description: '',
    numberOfRooms: '',
    numberOfBathrooms: '',
    squareFoot: '',
    address: '',
    latitude: '',
    longitude:''
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${REMOTE_SERVER}/api/listers/listers/${user.username}/listings/${listingId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch listing');
        }

        setFormData({
          distanceFromUniv: data.listing.distanceFromUniv,
          rent: data.listing.rent,
          description: data.listing.description,
          numberOfRooms: data.listing.numberOfRooms,
          numberOfBathrooms: data.listing.numberOfBathrooms,
          squareFoot: data.listing.squareFoot,
          address: data.listing.address
        });
      } catch (error) {
        console.error('Error fetching listing:', error);
        setError(error.message || 'Failed to fetch listing details');
      } finally {
        setLoading(false);
      }
    };

    if (user?.username && listingId) {
      fetchListing();
    }
  }, [user?.username, listingId]);


   const handleSuggestionClick = (suggestion) => {
    const { lat, lon } = suggestion;
    setFormData({
      ...formData,
      address: suggestion.display_name,
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
    });
    // setQuery(suggestion.display_name); // Update query input with the selected address
    setSuggestions([]); // Clear suggestions after selection
  };


    const handleInputChange = async (e) => {
    const value = e.target.value;
    // setQuery(value);
    setFormData({ ...formData, address: value });

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${value}&countrycodes=US`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!user || !user.username) {
        setError('User information not available');
        return;
      }

      const numericFormData = {
        distanceFromUniv: Number(formData.distanceFromUniv),
        rent: Number(formData.rent),
        numberOfRooms: Number(formData.numberOfRooms),
        numberOfBathrooms: Number(formData.numberOfBathrooms),
        squareFoot: Number(formData.squareFoot),
        description: formData.description,
        address: formData.address,
        latitude:formData.latitude,
        longitude: formData.longitude
      };

      const response = await fetch(`${REMOTE_SERVER}/api/listers/listers/${user.username}/listings/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(numericFormData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update listing');
      }

      navigate('/listings');
    } catch (error) {
      console.error('Error updating listing:', error);
      setError(error.message || 'Failed to update listing. Please try again.');
    }
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
          <Link
            to="/listings"
            className="inline-flex items-center text-white hover:text-blue-100 transition-colors mb-8"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Listings
          </Link>
          <h1 className="text-3xl font-bold text-white">Edit Listing</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
               <input
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Search for a location"
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
                {suggestions.length > 0 && (
                  <ul className="bg-white border border-gray-200 mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10 absolute w-full">
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion.place_id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {suggestion.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distance from NEU (miles)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.distanceFromUniv}
                  onChange={(e) => setFormData({...formData, distanceFromUniv: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Rent ($)
                </label>
                <input
                  type="number"
                  value={formData.rent}
                  onChange={(e) => setFormData({...formData, rent: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Bedrooms
                </label>
                <input
                  type="number"
                  value={formData.numberOfRooms}
                  onChange={(e) => setFormData({...formData, numberOfRooms: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Bathrooms
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.numberOfBathrooms}
                  onChange={(e) => setFormData({...formData, numberOfBathrooms: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Square Footage
                </label>
                <input
                  type="number"
                  value={formData.squareFoot}
                  onChange={(e) => setFormData({...formData, squareFoot: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="4"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditListing;
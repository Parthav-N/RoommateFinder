import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [logoutModal, setLogoutModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [removeModal, setRemoveModal] = useState(false);
  ; const [activeTab, setActiveTab] = useState('users');
  const [data, setData] = useState({
    users: [],
    listers: [],
    listings: [],
    reports: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let result;
      switch (activeTab) {
        case 'users':
          result = await adminService.getAllUsers();
          setData(prev => ({ ...prev, users: result.users }));
          break;
        case 'listers':
          result = await adminService.getAllListers();
          setData(prev => ({ ...prev, listers: result.listers }));
          break;
        case 'listings':
          result = await adminService.getAllListings();
          setData(prev => ({ ...prev, listings: result.listings }));
          break;
        case 'reports':
          result = await adminService.getAllReports();  // Fetch reports data
          setData(prev => ({ ...prev, reports: result }));
          break;
          default:
            break;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleRemoveClick = (type, id) => {
    setSelectedItem({ type, id });
    setRemoveModal(true);
  };



  const confirmRemove = async () => {
    try {
      if (selectedItem) {
        const { type, id } = selectedItem;
        switch (type) {
          case "users":
            await adminService.removeUser(id);
            break;
          case "listers":
            await adminService.removeLister(id);
            break;
          case "listings":
            await adminService.removeListing(id);
            break;
          case 'reports':
            await adminService.removeReport(id);  // Remove report
            break;
          default:
            throw new Error('Invalid type');
        }
        fetchData(); // Refresh data after removal
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRemoveModal(false);
      setSelectedItem(null);
    }
  };


  const handleLogout = () => {
    setLogoutModal(false);
    logout();
    navigate('/signin');
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
      return <div className="text-center py-4 text-red-600">{error}</div>;
    }

    const filteredData = data[activeTab]?.filter((item) => {
      const searchTermLower = searchTerm.toLowerCase();

      switch (activeTab) {
        case "listings":
          return (
            item.description?.toLowerCase().includes(searchTermLower) ||
            item.lister?.username?.toLowerCase().includes(searchTermLower)
          );
        case "users":
        case "listers":
          return (
            item.username?.toLowerCase().includes(searchTermLower) ||
            item.name?.toLowerCase().includes(searchTermLower)
          );
        case 'reports':
          return (
            item.username?.toLowerCase().includes(searchTermLower) ||
            item.reason?.toLowerCase().includes(searchTermLower) ||
            item.comments?.toLowerCase().includes(searchTermLower)
          );
        default:
          return true;
      }
    });

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {activeTab === "users" && (
                <>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </>
              )}
              {activeTab === "listers" && (
                <>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                    Listings Count
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </>
              )}
              {activeTab === "listings" && (
                <>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                    Distance
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Rent</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                    Lister
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </>
              )}
              {activeTab === 'reports' && (
                <>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Username</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Reason</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Comments</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item._id} className="bg-white hover:bg-gray-50">
                {activeTab === "users" && (
                  <>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.contactInfo.email} </td>
                  </>
                )}
                {activeTab === "listers" && (
                  <>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.listings?.length || 0}
                    </td>
                  </>
                )}
                {activeTab === "listings" && (
                  <>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.distanceFromUniv} miles
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">${item.rent}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.listerUsername}</td>
                  </>
                )}
                {activeTab === 'reports' && (
                  <>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.reason}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.comments || 'No comments'}</td>
                  </>
                )}
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleRemoveClick(activeTab, item._id)}
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="text-center py-4 text-gray-500">No {activeTab} found</div>
        )}
        <Modal
          isOpen={removeModal}
          onClose={() => setRemoveModal(false)}
          title="Remove Item"
          message="Are you sure you want to remove this item?"
          actionText="Remove"
          onSignUp={confirmRemove}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-8 pb-24">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <Link
              to="/home"
              className="inline-flex items-center text-white hover:text-blue-100 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Home
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/profile"
                className="inline-flex items-center text-white hover:text-blue-100 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                My Profile
              </Link>
              <button
                onClick={() => setLogoutModal(true)}
                className="inline-flex items-center text-white hover:text-blue-100 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-xl text-blue-100">Manage users, listers, listings and reports </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 -mt-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            {["users", "listers", "listings", "reports"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium ${activeTab === tab ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Content */}
          {renderContent()}

        </div>
        <Modal
          isOpen={logoutModal}
          onClose={() => setLogoutModal(false)}
          title="Log Out"
          message="Are you sure you want to logout?"
          actionText="Log out"
          onSignUp={handleLogout}
        />
      </div>

    </div>
  );
}

export default AdminDashboard;

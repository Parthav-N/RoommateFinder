
const REMOTE_SERVER = process.env.REACT_APP_SERVER_URL;

const BASE_URL = `${REMOTE_SERVER}/api/admin`;

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const adminService = {
  // User management
  async getAllUsers() {
    const response = await fetch(`${BASE_URL}/users`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  async removeUser(userId) {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to remove user');
    }
    return response.json();
  },

  // Lister management
  async getAllListers() {
    const response = await fetch(`${BASE_URL}/listers`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch listers');
    }
    return response.json();
  },

  async removeLister(listerId) {
    const response = await fetch(`${BASE_URL}/listers/${listerId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to remove lister');
    }
    return response.json();
  },

  // Listing management
  async getAllListings() {
    const response = await fetch(`${BASE_URL}/listings`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }
    return response.json();
  },

  async removeListing(listingId) {
    const response = await fetch(`${BASE_URL}/listings/${listingId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to remove listing');
    }
    return response.json();
  },


  async getAllReports() {
    const response = await fetch(`${REMOTE_SERVER}/api/report/report`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }
    return response.json();
  },

  async removeReport(reportId) {
    const response = await fetch(`${REMOTE_SERVER}/api/report/report/${reportId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to remove report');
    }
    return response.json();
  },
};
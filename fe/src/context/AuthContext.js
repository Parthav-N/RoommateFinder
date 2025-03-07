import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

const REMOTE_SERVER = process.env.REACT_APP_SERVER_URL;

const API_URL = `${REMOTE_SERVER}/api/auth`

// 'http://localhost:5001/api/auth';




export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token;
  });

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          username: payload.username,
          role: payload.role,
          name: payload.name,
          hasCompletedOnboarding: false
        };
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    const checkProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) return;

      try {
        const response = await fetch(`${REMOTE_SERVER}/api/${user.role === 'lister' ? 'listers' : 'users'}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const profileData = await response.json();
          setUser(prev => ({
            ...prev,
            hasCompletedOnboarding: true,
            ...profileData
          }));
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    };

    checkProfile();
  }, [user?.role]);

  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = async (username, password) => {
    try {
      if (username === 'admin' && password === 'admin123') {
        const adminUser = {
          id: 'admin-1',
          username: 'admin',
          name: 'Admin User',
          role: 'admin',
          hasCompletedOnboarding: true
        };
        
        const adminToken = btoa(JSON.stringify({
          username: 'admin',
          role: 'admin',
          name: 'Admin User'
        }));
        
        localStorage.setItem('token', adminToken);
        setToken(adminToken);
        setUser(adminUser);
        setIsAuthenticated(true);
        return { user: adminUser, token: adminToken };
      }

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);

      if (data.user.role !== 'admin') {
        const profileResponse = await fetch(`${REMOTE_SERVER}/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${data.token}`
          }
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUser({
            ...data.user,
            hasCompletedOnboarding: true
          });
        } else {
          setUser({
            ...data.user,
            hasCompletedOnboarding: false
          });
        }
      } else {
        setUser(data.user);
      }

      setIsAuthenticated(true);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData,
      hasCompletedOnboarding: true
    }));
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      token,
      login, 
      logout,
      signup,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
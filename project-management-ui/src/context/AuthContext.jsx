import { createContext, useState, useEffect } from 'react';
import { fetchWrapper } from '../utils/fetchWrapper';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const userData = await fetchWrapper('/users/me');
        if (userData) {
          setUser({ ...userData, role: userData.primaryRole });
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Only clear token if it's an authentication error
        if (error.message.toLowerCase().includes('unauthorized') || error.message.includes('401')) {
          localStorage.removeItem('token');
          setUser(null);
        }
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetchWrapper('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!response.user.active) {
        throw new Error('Your account is pending approval. Please wait for admin approval before logging in.');
      }

      localStorage.setItem('token', response.access_token);
      setUser({ ...response.user, role: response.user.primaryRole });
      setError(null);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
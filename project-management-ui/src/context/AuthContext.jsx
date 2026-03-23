import { createContext, useState, useEffect } from 'react';
import { fetchWrapper } from '../utils/fetchWrapper';
import { DEMO_USER, DEMO_TOKEN } from '../utils/demoData';

const IS_DEMO = import.meta.env.VITE_DEMO_MODE === 'true';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (IS_DEMO) {
      // In demo mode seed a token so protected routes work on page refresh
      localStorage.setItem('token', DEMO_TOKEN);
      setUser({ ...DEMO_USER, role: DEMO_USER.primaryRole });
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await fetchWrapper('/user-management/me');
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
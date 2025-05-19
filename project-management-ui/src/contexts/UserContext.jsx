import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchWrapper } from '../utils/fetchWrapper';
import { AuthContext } from '../context/AuthContext';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user: authUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        if (!authUser) {
          setUser(null);
          setLoading(false);
          return;
        }
        const data = await fetchWrapper('/user-management/me');
        setUser(data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [authUser]);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

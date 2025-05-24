import { createContext, useState, useEffect } from 'react';
import { getMe } from './api/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchMe = async () => {
    try {
      const data = await getMe();
      setUser(data);
      return data;
    } catch (error) {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchMe }}>
      {children}
    </UserContext.Provider>
  );
};

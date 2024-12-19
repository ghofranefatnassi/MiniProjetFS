import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the UserContext
const UserContext = createContext();

// Custom hook to access user context
export const useUser = () => {
  return useContext(UserContext);
};

// UserProvider component to provide user data to the application
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // To store the user data
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // For capturing errors during the fetching process

  // Set the base URL for axios globally (if needed)
  axios.defaults.baseURL = 'http://localhost:3001'; // Your backend API base URL

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user data if a token is present
      axios.get('/api/visiteurs/me', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(response => {
          setUser(response.data); // Set the logged-in user data
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token'); // Remove token if there's an error
          setError('Failed to fetch user data. Please log in again.');
        })
        .finally(() => setLoading(false)); // Always stop loading after the request
    } else {
      setLoading(false); // If there's no token, stop loading
    }
  }, []); // Run only once when the component mounts

  // Login function to set user data
  const login = (userInfo) => {
    setUser(userInfo); // Set user when logged in
  };

  // Logout function to clear user data and token
  const logout = () => {
    setUser(null); // Clear user data
    localStorage.removeItem('token'); // Remove the token on logout
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {/* Show loading indicator while fetching user data */}
      {loading ? <div>Loading...</div> : error ? <div>{error}</div> : children}
    </UserContext.Provider>
  );
};

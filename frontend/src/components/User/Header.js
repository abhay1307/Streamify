// src/components/User/Header.js
import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { getUserSession } from '../utils/authUtils'; // Import the function

const Header = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getUserSession(); // Use the function to get user session
    if (userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <header className="dashboard__header">
      <h1>Welcome, {user ? user.given_name : "User"} </h1>
      <div className="dashboard__search-container">
        <input type="text" className="dashboard__search-box" placeholder="Search..." />
        <button className="dashboard__search-button">Search</button>
      </div>
    </header>
  );
};

export default Header;

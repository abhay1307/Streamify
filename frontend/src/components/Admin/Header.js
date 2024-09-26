import React from 'react';
import './Header.css';
import { FaBell, FaUser } from 'react-icons/fa';

const Header = ({ userName }) => {
  return (
    <header className="header">
      <h1>Welcome</h1>
      <div className="header__actions">
        <div className="header__user">
          <FaUser />
          <span>{userName}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
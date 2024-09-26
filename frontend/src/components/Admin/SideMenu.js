import React from 'react';
import './SideMenu.css';
import { FaHome, FaUsers, FaFilm, FaChartBar, FaUpload, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { handleLogout } from '../utils/authUtils';
import { Link } from 'react-router-dom';

const SideMenu = () => {
  return (
    <aside className="sidemenu">
      <div className="sidemenu__logo">Streamify Admin</div>
      <nav className="sidemenu__nav">
        <Link to="/admin" className="sidemenu__link">
          <FaHome className="sidemenu__icon" /> Dashboard
        </Link>
        <Link to="/users" className="sidemenu__link">
          <FaUsers className="sidemenu__icon" /> User Management
        </Link>
        <Link to="/content" className="sidemenu__link">
          <FaFilm className="sidemenu__icon" /> Content Management
        </Link>
        <Link to="/analytics" className="sidemenu__link">
          <FaChartBar className="sidemenu__icon" /> Analytics
        </Link>
        <Link to="/media_upload" className="sidemenu__link">
          <FaUpload className="sidemenu__icon" /> Media Upload
        </Link>
        <Link to="/media" className="sidemenu__link">
          <FaUpload className="sidemenu__icon" /> Media List - old menu
        </Link>
        <Link to="/upload" className="sidemenu__link">
          <FaUpload className="sidemenu__icon" /> Upload Video - old menu
        </Link>
        <a href="#logout" className="sidemenu__link" onClick={handleLogout}>
          <FaSignOutAlt className="sidemenu__icon" /> Logout
        </a>
      </nav>
    </aside>
  );
};

export default SideMenu;
import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Generate transaction id
const generateCustomId = () => {
  // Get the current date in 'dmY' format (day, month, year)
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JS
  const year = currentDate.getFullYear();
  const formattedDate = `${day}${month}${year}`;

  // Generate a random unique ID
  const uniqid = () => {
      return 'x'.repeat(16).replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          return r.toString(16);
      });
  };

  // Generate the md5-like hash (simulating PHP's md5(uniqid(...)))
  const hash = () => {
      const randomStr = uniqid();
      let hash = 0;
      for (let i = 0; i < randomStr.length; i++) {
          const char = randomStr.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash |= 0; // Convert to 32bit integer
      }
      return hash.toString(16);
  };

  // Combine date, 'o', and hash
  const customId = `${formattedDate}o${hash()}`;
    return customId;
  };

  // Signin button configuration
  const handleButtonJoinNow = () => {
    const generatedId = generateCustomId();
    const joinNowButton = `${process.env.REACT_APP_ONEACCESS_HOST_URL}/cl_gsi?client_id=${process.env.REACT_APP_ONEACCESS_CLIENT_ID}&channel_transaction=${generatedId}&origin=${process.env.REACT_APP_HOST_URL}`;
    
    // Navigate to the generated URL
    window.location.href = joinNowButton;
  };

  return (
    <header className="header">
      <div className="header__logo">Streamify</div>
      <div className="header__menu-icon" onClick={toggleMenu}>
        &#9776;
      </div>
      <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
        <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Contact us</a>
        <div className="header__auth">
          <button className="header__button header" onClick={handleButtonJoinNow}>Join Now</button>
        </div>
      </nav>
    </header>
  );
};

export default Header;

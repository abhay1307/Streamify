import React from 'react';
import './Footer.css'; // Create this CSS file for Footer styles

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__links">
          <a href="#terms">Terms of Service</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#help">Help</a>
        </div>
        <div className="footer__social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
      <div className="footer__bottom">
        <p>&copy; 2024 Streamify. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <p className="personal-message">
            Finding the right roommate starts with the right match. Good luck with your search! 🏠
          </p>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Roommate Matcher. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

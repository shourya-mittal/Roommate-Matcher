import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from './Skeleton';
import Tooltip from './Tooltip';
import AdDisplay from './AdDisplay';
import './Menu.css';

function Menu({ onMenuSelect, onLogout }) {
  const navigate = useNavigate();
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate loading for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="menu-container">
        <Skeleton type="title" />
        <div className="menu-options">
          <Skeleton type="button" count={4} />
        </div>
      </div>
    );
  }

  const handleStatusSelect = (status) => {
    onMenuSelect(status);
    setShowStatusOptions(false);
  };

  return (
    <div className="menu-container">
      <h2 className="menu-title">What would you like to do?</h2>
      
      <div className="menu-options">
        <div className="menu-option">
          <Tooltip text="Update your profile information and preferences">
            <h3>Edit Profile</h3>
            <p>Update your preferences and information</p>
            <button onClick={() => navigate('/profile')}>Edit Profile</button>
          </Tooltip>
        </div>

        <div className="menu-option">
          <Tooltip text="Let others know if you've found a roommate or are still looking">
            <h3>Update Status</h3>
            <p>Update your roommate status</p>
            <button onClick={() => setShowStatusOptions(true)}>Update Status</button>
          </Tooltip>
        </div>

        <div className="menu-option">
          <Tooltip text="View your potential roommate matches">
            <h3>View Matches</h3>
            <p>See your potential roommate matches</p>
            <button onClick={() => navigate('/matches')}>View Matches</button>
          </Tooltip>
        </div>

        <div className="menu-option">
          <Tooltip text="Sign out of your account" position="bottom">
            <h3>Logout</h3>
            <p>Sign out of your account</p>
            <button onClick={onLogout}>Logout</button>
          </Tooltip>
        </div>
      </div>

      {showStatusOptions && (
        <div className="status-section">
          <h3>Have you found a roommate?</h3>
          <div className="status-options">
            <div 
              className="status-option"
              onClick={() => handleStatusSelect('found')}
            >
              <Tooltip text="Click if you've found your perfect match!">
                <h4>Found a Roommate</h4>
                <p>I've found my perfect match!</p>
              </Tooltip>
            </div>
            
            <div 
              className="status-option"
              onClick={() => handleStatusSelect('looking')}
            >
              <Tooltip text="Click if you're still looking for a roommate">
                <h4>Still Looking</h4>
                <p>I'm still searching for a roommate</p>
              </Tooltip>
            </div>
          </div>
        </div>
      )}
      <AdDisplay />
    </div>
  );
}

export default Menu; 
import React from 'react';
import './ViewProfile.css';

const ViewProfile = ({ user, onClose }) => {
  if (!user) return null;

  const formatAttribute = (attr) => {
    switch (attr) {
      case 'diet':
        return {
          label: '🥗 Diet',
          value: user.diet,
          tolerance: user.issueWithDifferentDiet === 'no' ? '(Flexible with different diets)' : ''
        };
      case 'smokingFrequency':
        return {
          label: '🚬 Smoking',
          value: user.smokingFrequency,
          tolerance: user.issueWithSmoking === 'no' ? '(Okay with smokers)' : ''
        };
      case 'alcoholFrequency':
        return {
          label: '🍷 Alcohol',
          value: user.alcoholFrequency,
          tolerance: user.issueWithAlcohol === 'no' ? '(Okay with drinkers)' : ''
        };
      case 'sleepingHabit':
        return {
          label: '😴 Sleep Schedule',
          value: user.sleepingHabit.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
        };
      case 'cleanliness':
        return {
          label: '🧼 Cleanliness',
          value: `${user.cleanliness}/5`,
          tolerance: user.issueWithCleanliness === 'no' ? '(Flexible with cleanliness levels)' : ''
        };
      case 'flatmates':
        return {
          label: '🏠 Preferred Flatmates',
          value: Array.isArray(user.flatmates) ? user.flatmates.join(', ') : 'N/A'
        };
      default:
        return { label: attr, value: user[attr] };
    }
  };

  return (
    <div className="view-profile-overlay">
      <div className="view-profile-modal">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="profile-header">
          <h2>{user.name}</h2>
          <p className="location">📍 {user.location.replace('location_', '').replace(/\b\w/g, l => l.toUpperCase())}</p>
        </div>

        {user.bio && (
          <div className="bio-section">
            <h3>About</h3>
            <p>{user.bio}</p>
          </div>
        )}

        <div className="preferences-section">
          <h3>Preferences</h3>
          <div className="preferences-grid">
            {['diet', 'smokingFrequency', 'alcoholFrequency', 'sleepingHabit', 'cleanliness', 'flatmates'].map(attr => {
              const { label, value, tolerance } = formatAttribute(attr);
              return (
                <div key={attr} className="preference-item">
                  <span className="preference-label">{label}</span>
                  <span className="preference-value">{value}</span>
                  {tolerance && <span className="preference-tolerance">{tolerance}</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="contact-section">
          <h3>Contact Information</h3>
          <p>📞 {user.contactNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile; 
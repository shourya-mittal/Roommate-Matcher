import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./MatchResults.css";
import MatchUser, { findMatches } from './MatchUser';
import { getDocs, collection } from 'firebase/firestore';
import firebase from '../firebase';
import Skeleton from './Skeleton';
import ViewProfile from './ViewProfile';

const MatchResults = ({ user }) => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user || !user.email) {
        setError('User data not available. Please try logging in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get all users from Firestore
        const usersRef = collection(firebase, "users");
        const querySnapshot = await getDocs(usersRef);
        const allUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Use findMatches to get compatible matches
        const potentialMatches = findMatches(user, allUsers);

        setMatches(potentialMatches);
      } catch (err) {
        setError('Failed to fetch matches. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user]);

  const handleBack = () => {
    navigate('/menu');
  };

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
  };

  const handleCloseProfile = () => {
    setSelectedProfile(null);
  };

  if (loading) {
    return (
      <div className="match-results-container">
        <div className="match-results-header">
          <button onClick={handleBack} className="back-button">
            Back to Menu
          </button>
          <h2>Finding your matches...</h2>
        </div>
        <div className="matches-grid">
          {[1, 2, 3].map((index) => (
            <div key={index} className="match-card skeleton-card">
              <Skeleton type="title" />
              <Skeleton type="text" count={3} />
              <Skeleton type="button" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="match-results-container">
        <div className="match-results-header">
          <button onClick={handleBack} className="back-button">
            Back to Menu
          </button>
          <h2>Error</h2>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="match-results-container">
      <div className="match-results-header">
        <button onClick={handleBack} className="back-button">
          Back to Menu
        </button>
        <h2>Your Matches</h2>
      </div>

      {!matches || matches.length === 0 ? (
        <div className="no-matches">
          <p>No potential matches found yet. This could be because:</p>
          <ul>
            <li>No users in your location have signed up yet</li>
            <li>No users of the same gender are available</li>
            <li>Your preferences might be too specific</li>
          </ul>
          <p>What you can do:</p>
          <ol>
            <li>Update your preferences to be more flexible</li>
            <li>Check back later for new users</li>
            <li>Share the app with friends in your area</li>
          </ol>
          <button 
            className="update-preferences-button"
            onClick={() => navigate('/profile')}
          >
            Update Your Preferences
          </button>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map(match => (
            <MatchUser
              key={match.id}
              user={match}
              currentUser={user}
              onViewProfile={() => handleViewProfile(match)}
            />
          ))}
        </div>
      )}

      {selectedProfile && (
        <ViewProfile
          user={selectedProfile}
          onClose={handleCloseProfile}
        />
      )}
    </div>
  );
};

export default MatchResults;

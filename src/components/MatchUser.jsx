import React, { useState } from 'react';
import './MatchUser.css';

// Helper function to capitalize first letter
const capitalizeFirstLetter = (str) => {
  if (!str) return 'Not specified';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Format location for display (stored as plain lowercase text)
const formatLocation = (location) => capitalizeFirstLetter(location);

// Define weights for different matching criteria
const MATCH_WEIGHTS = {
  diet: 1.0,
  smokingFrequency: 1.2,
  alcoholFrequency: 1.2,
  sleepingHabit: 1.5,
  cleanliness: 1.5,
  flatmates: 1.0,
  budgetRange: 1.8,
  apartmentType: 1.8
};

function calculateCompatibility(userA, userB) {
  // Helper function to check deal-breakers
  const checkDealBreaker = (userA, userB, attrA, attrB, dealBreakerA, dealBreakerB) => {
    if (dealBreakerA && attrA !== attrB) return false;
    if (dealBreakerB && attrA !== attrB) return false;
    return true;
  };

  // Check all deal-breakers first
  if (!checkDealBreaker(userA, userB, userA.diet, userB.diet, userA.dietDealBreaker, userB.dietDealBreaker)) return 0;
  if (!checkDealBreaker(userA, userB, userA.smokingFrequency, userB.smokingFrequency, userA.smokingDealBreaker, userB.smokingDealBreaker)) return 0;
  if (!checkDealBreaker(userA, userB, userA.alcoholFrequency, userB.alcoholFrequency, userA.alcoholDealBreaker, userB.alcoholDealBreaker)) return 0;
  if (!checkDealBreaker(userA, userB, userA.sleepingHabit, userB.sleepingHabit, userA.sleepingDealBreaker, userB.sleepingDealBreaker)) return 0;
  if (!checkDealBreaker(userA, userB, userA.cleanliness, userB.cleanliness, userA.cleanlinessDealBreaker, userB.cleanlinessDealBreaker)) return 0;
  if (!checkDealBreaker(userA, userB, userA.budgetRange, userB.budgetRange, userA.budgetDealBreaker, userB.budgetDealBreaker)) return 0;

  let totalScore = 0;
  let maxPossibleScore = 0;

  // Helper function to calculate weighted score
  const calculateWeightedScore = (isMatch, weight) => {
    maxPossibleScore += weight;
    return isMatch ? weight : 0;
  };

  // Diet match
  const dietMatch = userA.diet === userB.diet || 
    (userA.issueWithDifferentDiet === "no" && userB.issueWithDifferentDiet === "no");
  totalScore += calculateWeightedScore(dietMatch, MATCH_WEIGHTS.diet);

  // Mutual tolerance helper for smoking and alcohol
  const mutualTolerance = (freqA, issueA, freqB, issueB) => {
    if (freqA === freqB) return true;
    if (freqA !== "never" && freqB !== "never") return true;
    if ((freqA === "never" && issueA === "no") || (freqB === "never" && issueB === "no")) {
      return true;
    }
    return false;
  };

  // Smoking compatibility
  const smokingMatch = mutualTolerance(
    userA.smokingFrequency,
    userA.issueWithSmoking,
    userB.smokingFrequency,
    userB.issueWithSmoking
  );
  totalScore += calculateWeightedScore(smokingMatch, MATCH_WEIGHTS.smokingFrequency);

  // Alcohol compatibility
  const alcoholMatch = mutualTolerance(
    userA.alcoholFrequency,
    userA.issueWithAlcohol,
    userB.alcoholFrequency,
    userB.issueWithAlcohol
  );
  totalScore += calculateWeightedScore(alcoholMatch, MATCH_WEIGHTS.alcoholFrequency);

  // Sleeping habit
  const sleepingMatch = userA.sleepingHabit === userB.sleepingHabit;
  totalScore += calculateWeightedScore(sleepingMatch, MATCH_WEIGHTS.sleepingHabit);

  // Flatmate count overlap
  const roommatesMatch = String(userA.numberOfRoommates || '').trim() === String(userB.numberOfRoommates || '').trim();
  totalScore += calculateWeightedScore(roommatesMatch, MATCH_WEIGHTS.flatmates);

  // Cleanliness tolerance
  const cleanDiff = Math.abs(parseInt(userA.cleanliness) - parseInt(userB.cleanliness));
  const cleanlinessMatch = cleanDiff <= 1 || 
    (userA.issueWithCleanliness === "no" && userB.issueWithCleanliness === "no");
  totalScore += calculateWeightedScore(cleanlinessMatch, MATCH_WEIGHTS.cleanliness);

  // Budget range compatibility
  const budgetMatch = userA.budgetRange === userB.budgetRange || 
    (userA.issueWithDifferentBudget === "no" && userB.issueWithDifferentBudget === "no");
  totalScore += calculateWeightedScore(budgetMatch, MATCH_WEIGHTS.budgetRange);

  // Apartment type compatibility
  const apartmentTypeMatch = userA.preferredApartmentType?.some(type => 
    userB.preferredApartmentType?.includes(type)
  ) || (userA.issueWithDifferentApartmentType === "no" && 
        userB.issueWithDifferentApartmentType === "no");
  totalScore += calculateWeightedScore(apartmentTypeMatch, MATCH_WEIGHTS.apartmentType);

  // Calculate final score as a percentage
  const finalScore = Math.round((totalScore / maxPossibleScore) * 100);
  return finalScore;
}

export function findMatches(currentUser, allUsers) {
  if (!currentUser || !currentUser.email) return [];

  // Step 1: Filter out current user
  const otherUsers = allUsers.filter(u => u.email !== currentUser.email);

  // Step 2: Filter by location first (most important constraint)
  const locationMatches = otherUsers.filter(u => 
    u.location === currentUser.location
  );

  // Step 3: Filter by gender preference
  const genderMatches = locationMatches.filter(u => 
    u.gender === currentUser.gender &&  // Keep same gender for roommate matching
    u.roommateStatus !== 'found'  // Only show users who are still looking
  );

  // Step 4: Calculate compatibility scores and sort
  const scoredMatches = genderMatches.map(user => {
    const score = calculateCompatibility(currentUser, user);
    return {
      ...user,
      score,
    };
  });

  // Filter out matches with score 0 (deal-breaker mismatch) and below threshold
  const MINIMUM_MATCH_SCORE = 60; // Minimum 60% compatibility required
  const validMatches = scoredMatches.filter(match => match.score >= MINIMUM_MATCH_SCORE);
  
  // Sort by compatibility score in descending order
  validMatches.sort((a, b) => b.score - a.score);
  return validMatches;
}

function MatchUser({ user, currentUser }) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Early return if user data is not available
  if (!user || !currentUser) {
    return (
      <div className="match-user-card error">
        <p>Unable to load user data</p>
      </div>
    );
  }

  // Calculate compatibility score
  const compatibilityScore = calculateCompatibility(currentUser, user);

  // If score is 0, don't show the card
  if (compatibilityScore === 0) {
    return null;
  }

  return (
    <div className="match-user-card">
      <div className="match-user-header">
        <h3>{user.name || 'Anonymous'}</h3>
        <div className="match-score">
          {compatibilityScore}% Match
        </div>
      </div>

      <div className="match-user-basic-info">
        <div className="info-item">
          <strong>Gender:</strong> {user.gender ? capitalizeFirstLetter(user.gender) : 'Not specified'}
        </div>
        <div className="info-item">
          <strong>Location:</strong> {formatLocation(user.location)}
        </div>
        <div className="info-item">
          <strong>Accommodation Type:</strong> {capitalizeFirstLetter(user.accommodationType)}
        </div>
        {user.accommodationType === 'flat' && user.preferredApartmentType && (
          <div className="info-item">
            <strong>Preferred Apartment Types:</strong> {user.preferredApartmentType.join(', ')}
          </div>
        )}
        <div className="info-item">
          <strong>Number of Roommates:</strong> {user.numberOfRoommates || 'Not specified'}
        </div>
        <div className="info-item">
          <strong>Phone:</strong> {user.contactNumber || 'Not specified'}
        </div>
      </div>

      <button 
        className="toggle-details-button"
        onClick={toggleDetails}
      >
        {showDetails ? 'Hide Details' : 'Show Details'}
      </button>

      {showDetails && (
        <div className="match-user-details">
          <div className="preferences-section">
            <h4>Living Preferences</h4>
            <div className="preferences-grid">
              <div className="preference-item">
                <strong>Diet:</strong> {capitalizeFirstLetter(user.diet)}
              </div>
              <div className="preference-item">
                <strong>Smoking:</strong> {capitalizeFirstLetter(user.smokingFrequency)}
              </div>
              <div className="preference-item">
                <strong>Alcohol:</strong> {capitalizeFirstLetter(user.alcoholFrequency)}
              </div>
              <div className="preference-item">
                <strong>Sleep Schedule:</strong> {capitalizeFirstLetter(user.sleepingHabit)}
              </div>
              <div className="preference-item">
                <strong>Cleanliness:</strong> {user.cleanliness ? `${user.cleanliness}/5` : 'Not specified'}
              </div>
              <div className="preference-item">
                <strong>Budget Range:</strong> {user.budgetRange || 'Not specified'}
              </div>
              <div className="preference-item">
                <strong>Number of Roommates:</strong> {user.numberOfRoommates || 'Not specified'}
              </div>
            </div>
          </div>

          <div className="deal-breakers-section">
            <h4>Deal Breakers</h4>
            <div className="deal-breakers-grid">
              {user.dietDealBreaker && <div className="deal-breaker">Diet</div>}
              {user.smokingDealBreaker && <div className="deal-breaker">Smoking</div>}
              {user.alcoholDealBreaker && <div className="deal-breaker">Alcohol</div>}
              {user.sleepingDealBreaker && <div className="deal-breaker">Sleep Schedule</div>}
              {user.cleanlinessDealBreaker && <div className="deal-breaker">Cleanliness</div>}
              {user.budgetDealBreaker && <div className="deal-breaker">Budget</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchUser; 
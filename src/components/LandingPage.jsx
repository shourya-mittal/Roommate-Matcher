import React, { useState } from "react";
import ProfileForm from "./ProfileForm";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import db from "../firebase";
import { normalizeUserLocation } from "../utils/locationUtils";
import "./LandingPage.css";
import HowItWorks from './HowItWorks';

const LandingPage = ({ onLogin }) => {
  const [isNewUser, setIsNewUser] = useState(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Query Firestore for the email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User exists - get their data
        const userDoc = querySnapshot.docs[0];
        const userData = normalizeUserLocation({ id: userDoc.id, ...userDoc.data() });
        onLogin(userData);
      } else {
        // New user - show registration form
        setIsNewUser(true);
      }
    } catch (err) {
      console.error("Error checking email:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (profileData) => {
    try {
      setLoading(true);
      setError("");

      // Add the email to the profile data
      const userData = { 
        ...profileData, 
        email,
        lastUpdated: new Date().toISOString(),
        roommateStatus: 'looking' // Set default status
      };

      // Save to Firestore
      const userRef = doc(db, "users", email);
      await setDoc(userRef, userData);

      // Update local state
      onLogin(userData);
    } catch (err) {
      console.error("Error creating profile:", err);
      setError("Failed to create profile. Please try again.");
      throw err; // Re-throw to let ProfileForm handle the error
    } finally {
      setLoading(false);
    }
  };

  if (isNewUser === null) {
    return (
      <div className="landing-container">
        <div className="landing-content">
          <h1>Welcome to Roommate Matcher</h1>
          <p>Find your perfect roommate match!</p>
          
          <div className="auth-form">
            <h2>Enter your email to continue</h2>
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button 
                type="submit" 
                className="primary-button"
                disabled={loading}
              >
                {loading ? "Checking..." : "Continue"}
              </button>
            </form>
          </div>
        </div>
        <HowItWorks />
      </div>
    );
  }

  if (isNewUser) {
    return <ProfileForm onSubmit={handleProfileSubmit} initialEmail={email} />;
  }

  return null;
};

export default LandingPage; 
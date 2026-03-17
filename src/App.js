import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import db from "./firebase";
import LandingPage from "./components/LandingPage";
import ProfileForm from "./components/ProfileForm";
import MatchResults from "./components/MatchResults";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import MatchUser, { findMatches } from './components/MatchUser';
import { normalizeUserLocation } from './utils/locationUtils';

function App() {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = localStorage.getItem('userSession');
        if (session) {
          const userData = JSON.parse(session);
          console.log("Found saved session:", userData);
          
          // Ensure arrays are properly handled
          const restoredUserData = normalizeUserLocation({
            ...userData,
            preferredApartmentType: Array.isArray(userData.preferredApartmentType) 
              ? [...userData.preferredApartmentType] 
              : [],
            flatmates: Array.isArray(userData.flatmates) 
              ? [...userData.flatmates] 
              : []
          });
          
          // Verify user still exists in database
          const userRef = doc(db, "users", restoredUserData.email);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            console.log("User verified in database");
            setUser(restoredUserData);
            
            // Fetch matches
            const usersSnapshot = await getDocs(collection(db, "users"));
            const allUsers = usersSnapshot.docs.map(doc => normalizeUserLocation(doc.data()));
            const userMatches = findMatches(restoredUserData, allUsers);
            setMatches(userMatches);
          } else {
            console.log("User not found in database, clearing session");
            localStorage.removeItem('userSession');
          }
        }
      } catch (err) {
        console.error("Error checking session:", err);
        setError("Failed to restore session. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('userSession', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userSession');
    setMatches([]);
  };

  const handleSaveProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      // Ensure we have the user's email
      if (!user?.email) {
        throw new Error("User email is required");
      }

      // Clean up the data
      const cleanedData = {
        ...profileData,
        email: user.email, // Ensure we use the email from the user object
        lastUpdated: new Date().toISOString(),
        roommateStatus: 'looking' // Set default status
      };

      console.log("Saving profile data:", cleanedData); // Debug log

      // Update user in Firestore
      const userRef = doc(db, "users", user.email);
      await setDoc(userRef, cleanedData, { merge: true });

      // Update local state and localStorage
      const updatedUser = { ...user, ...cleanedData };
      setUser(updatedUser);
      localStorage.setItem('userSession', JSON.stringify(updatedUser));

      // Show success message and navigate to menu
      alert("Profile saved successfully! 🎉");
      navigate('/menu');
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(`Failed to save profile: ${err.message}`);
      alert(`Failed to save profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuSelect = async (option) => {
    if (option === "found" || option === "looking") {
      try {
        setLoading(true);
        setError(null);
        
        const updatedUser = {
          ...user,
          roommateStatus: option,
          lastUpdated: new Date().toISOString()
        };

        // Update user status in Firestore
        const userRef = doc(db, "users", user.email);
        await setDoc(userRef, updatedUser, { merge: true });

        // Update localStorage
        localStorage.setItem('userSession', JSON.stringify(updatedUser));

        // Update local user state
        setUser(updatedUser);

        // If user found a roommate, clear their matches
        if (option === 'found') {
          setMatches([]);
        } else {
          // If user is still looking, refresh their matches
          const usersSnapshot = await getDocs(collection(db, "users"));
          const allUsers = usersSnapshot.docs.map(doc => normalizeUserLocation(doc.data()));
          const userMatches = findMatches(user, allUsers);
          setMatches(userMatches);
        }

        // Show success message
        alert(option === "found" 
          ? "Congratulations on finding a roommate! 🎉 You've been removed from the matching pool." 
          : "Your status has been updated. Good luck with your search! 🍀"
        );
      } catch (err) {
        console.error("Error updating status:", err);
        setError(`Failed to update status: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => setError(null)}>Try Again</button>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="app">
        <ThemeToggle />
        <ErrorBoundary>
          <Routes>
            <Route 
              path="/" 
              element={
                !user ? (
                  <LandingPage onLogin={handleLogin} />
                ) : (
                  <Navigate to="/menu" replace />
                )
              } 
            />
            <Route 
              path="/profile" 
              element={
                user ? (
                  <ProfileForm 
                    onSubmit={handleSaveProfile}
                    initialData={user}
                    initialEmail={user.email}
                    onBack={() => navigate('/menu')}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/menu" 
              element={
                user ? (
                  <Menu 
                    user={user} 
                    onLogout={handleLogout}
                    onMenuSelect={handleMenuSelect}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/matches" 
              element={
                user ? (
                  <MatchResults 
                    matches={matches}
                    user={user}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
          </Routes>
        </ErrorBoundary>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

// Wrap App with BrowserRouter
function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWithRouter;

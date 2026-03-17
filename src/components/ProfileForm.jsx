import React, { useState, useEffect } from "react";
import "./ProfileForm.css";
import Skeleton from './Skeleton';
import { useNavigate } from 'react-router-dom';

function ProfileForm({ onSubmit, initialData = {}, initialEmail = "", onBack }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialEmail || initialData?.email || "",
    gender: initialData?.gender || "",
    location: initialData?.location || "",
    diet: initialData?.diet || "",
    issueWithDifferentDiet: initialData?.issueWithDifferentDiet || "",
    smokingFrequency: initialData?.smokingFrequency || "",
    issueWithSmoking: initialData?.issueWithSmoking || "",
    alcoholFrequency: initialData?.alcoholFrequency || "",
    issueWithAlcohol: initialData?.issueWithAlcohol || "",
    sleepingHabit: initialData?.sleepingHabit || "",
    cleanliness: initialData?.cleanliness || 3,
    issueWithCleanliness: initialData?.issueWithCleanliness || "",
    contactNumber: initialData?.contactNumber || "",
    budgetRange: initialData?.budgetRange || "",
    preferredApartmentType: Array.isArray(initialData?.preferredApartmentType) 
      ? [...initialData.preferredApartmentType] 
      : [],
    issueWithDifferentApartmentType: initialData?.issueWithDifferentApartmentType || "",
    issueWithDifferentBudget: initialData?.issueWithDifferentBudget || "",
    dietDealBreaker: initialData?.dietDealBreaker || false,
    smokingDealBreaker: initialData?.smokingDealBreaker || false,
    alcoholDealBreaker: initialData?.alcoholDealBreaker || false,
    sleepingDealBreaker: initialData?.sleepingDealBreaker || false,
    cleanlinessDealBreaker: initialData?.cleanlinessDealBreaker || false,
    budgetDealBreaker: initialData?.budgetDealBreaker || false,
    accommodationType: initialData?.accommodationType || "",
    numberOfRoommates: initialData?.numberOfRoommates || ""
  });

  const [loading, setLoading] = useState(true);
  const isEditing = !!initialData?.email;
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="profile-form-container">
        <div className="profile-form skeleton-form">
          <Skeleton type="title" />
          <div className="form-group">
            <Skeleton type="text" />
            <Skeleton type="text" />
          </div>
          <div className="form-group">
            <Skeleton type="text" />
            <div className="radio-group">
              <Skeleton type="checkbox" count={3} />
            </div>
          </div>
          <div className="form-group">
            <Skeleton type="text" />
            <Skeleton type="text" />
          </div>
          <div className="form-group">
            <Skeleton type="text" />
            <div className="checkbox-group">
              <Skeleton type="checkbox" count={5} />
            </div>
          </div>
          <div className="form-group">
            <Skeleton type="button" />
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (name === "flatmates") {
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          flatmates: [...prev.flatmates, value],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          flatmates: prev.flatmates.filter((v) => v !== value),
        }));
      }
    } else if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === "range" ? parseInt(value) : value
        }
      }));
    } else {
      setFormData((prev) => {
        let updated = {
          ...prev,
          [name]: type === "range" ? parseInt(value) : value,
        };
  
        if (name === "smokingFrequency" && value !== "never") {
          updated.issueWithSmoking = "";
        }
  
        if (name === "alcoholFrequency" && value !== "never") {
          updated.issueWithAlcohol = "";
        }
  
        return updated;
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApartmentTypeChange = (type) => {
    setFormData(prev => {
      const currentTypes = Array.isArray(prev.preferredApartmentType) 
        ? [...prev.preferredApartmentType] 
        : [];
      
      const newTypes = currentTypes.includes(type)
        ? currentTypes.filter(t => t !== type)
        : [...currentTypes, type];
      
      return {
        ...prev,
        preferredApartmentType: newTypes
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!formData.contactNumber.match(/^\d{10}$/)) {
      alert("Please enter a valid 10-digit contact number. No fancy characters, please!");
      return;
    }

    if (!formData.location) {
      alert("Please select your location.");
      return;
    }

    if (!formData.accommodationType) {
      alert("Please select your accommodation type.");
      return;
    }

    if (formData.accommodationType === "flat" && (!formData.preferredApartmentType || formData.preferredApartmentType.length === 0)) {
      alert("Please select at least one apartment type.");
      return;
    }

    // Clean up the data before submission
    const submitData = {
      ...formData,
      name: formData.name.trim(),
      contactNumber: formData.contactNumber.trim(),
      preferredApartmentType: Array.isArray(formData.preferredApartmentType) 
        ? formData.preferredApartmentType 
        : [],
      flatmates: Array.isArray(formData.flatmates) 
        ? formData.flatmates 
        : [],
      lastUpdated: new Date().toISOString()
    };

    try {
      await onSubmit(submitData);
      navigate('/menu'); // Navigate back to menu after successful submission
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert(`Failed to save profile: ${error.message}`);
    }
  };

  return (
    <div className="profile-form-container">
      <form onSubmit={handleSubmit} className="profile-form">
        <h2>{isEditing ? "Edit Profile" : "Create Your Profile"}</h2>
        
        <button 
          type="button" 
          className="back-button"
          onClick={onBack}
        >
          Back to Menu
        </button>

        <div className="form-group">
          <label htmlFor="name">What's your name?</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">What's your gender?</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="location">Which city are you looking for accommodation in?</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value.trim().toLowerCase())}
            placeholder="e.g. Austin, Berlin, Mumbai…"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact">Your contact number:</label>
          <input
            id="contactNumber"
            type="tel"
            name="contactNumber"
            placeholder="10-digit number"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="diet">What's your diet preference?</label>
          <select
            id="diet"
            name="diet"
            value={formData.diet}
            onChange={handleChange}
            required
          >
            <option value="">Select your diet</option>
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
          <div className="deal-breaker-option">
            <input
              type="checkbox"
              id="dietDealBreaker"
              checked={formData.dietDealBreaker}
              onChange={(e) => handleInputChange("dietDealBreaker", e.target.checked)}
            />
            <label htmlFor="dietDealBreaker">This is a deal-breaker for me</label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="issueWithDifferentDiet">Would you be okay with a roommate who has a different diet?</label>
          <select
            id="issueWithDifferentDiet"
            name="issueWithDifferentDiet"
            value={formData.issueWithDifferentDiet}
            onChange={handleChange}
            required
          >
            <option value="">Select your preference</option>
            <option value="yes">I prefer someone with the same diet</option>
            <option value="no">I'm cool with different diets</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="smokingFrequency">How often do you smoke?</label>
          <select
            id="smokingFrequency"
            name="smokingFrequency"
            value={formData.smokingFrequency}
            onChange={handleChange}
            required
          >
            <option value="">Select frequency</option>
            <option value="never">Never</option>
            <option value="sometimes">Sometimes</option>
            <option value="often">Often</option>
          </select>
          <div className="deal-breaker-option">
            <input
              type="checkbox"
              id="smokingDealBreaker"
              checked={formData.smokingDealBreaker}
              onChange={(e) => handleInputChange("smokingDealBreaker", e.target.checked)}
            />
            <label htmlFor="smokingDealBreaker">This is a deal-breaker for me</label>
          </div>
        </div>

        {formData.smokingFrequency === "never" && (
          <div className="form-group">
            <label htmlFor="issueWithSmoking">Would you be okay with a roommate who smokes?</label>
            <select
              id="issueWithSmoking"
              name="issueWithSmoking"
              value={formData.issueWithSmoking}
              onChange={handleChange}
              required
            >
              <option value="">Select your preference</option>
              <option value="yes">I prefer a non-smoking roommate</option>
              <option value="no">I'm okay with smokers</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="alcoholFrequency">How often do you drink alcohol?</label>
          <select
            id="alcoholFrequency"
            name="alcoholFrequency"
            value={formData.alcoholFrequency}
            onChange={handleChange}
            required
          >
            <option value="">Select frequency</option>
            <option value="never">Never</option>
            <option value="sometimes">Sometimes</option>
            <option value="often">Often</option>
          </select>
          <div className="deal-breaker-option">
            <input
              type="checkbox"
              id="alcoholDealBreaker"
              checked={formData.alcoholDealBreaker}
              onChange={(e) => handleInputChange("alcoholDealBreaker", e.target.checked)}
            />
            <label htmlFor="alcoholDealBreaker">This is a deal-breaker for me</label>
          </div>
        </div>

        {formData.alcoholFrequency === "never" && (
          <div className="form-group">
            <label htmlFor="issueWithAlcohol">Would you be okay with a roommate who drinks?</label>
            <select
              id="issueWithAlcohol"
              name="issueWithAlcohol"
              value={formData.issueWithAlcohol}
              onChange={handleChange}
              required
            >
              <option value="">Select your preference</option>
              <option value="yes">I prefer a non-drinking roommate</option>
              <option value="no">I'm okay with drinkers</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="sleepingHabit">What's your sleeping habit?</label>
          <select
            id="sleepingHabit"
            name="sleepingHabit"
            value={formData.sleepingHabit}
            onChange={handleChange}
            required
          >
            <option value="">Select your sleeping habit</option>
            <option value="early">Early bird (sleep early, wake early)</option>
            <option value="late">Night owl (sleep late, wake late)</option>
            <option value="flexible">Flexible</option>
          </select>
          <div className="deal-breaker-option">
            <input
              type="checkbox"
              id="sleepingDealBreaker"
              checked={formData.sleepingDealBreaker}
              onChange={(e) => handleInputChange("sleepingDealBreaker", e.target.checked)}
            />
            <label htmlFor="sleepingDealBreaker">This is a deal-breaker for me</label>
          </div>
        </div>

        <div className="form-group">
          <label>What type of accommodation are you looking for?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="accommodationType"
                value="pg"
                checked={formData.accommodationType === "pg"}
                onChange={handleChange}
              />
              PG
            </label>
            <label>
              <input
                type="radio"
                name="accommodationType"
                value="flat"
                checked={formData.accommodationType === "flat"}
                onChange={handleChange}
              />
              Flat/Apartment
            </label>
          </div>
        </div>

        {formData.accommodationType === "flat" && (
          <div className="form-group">
            <label>What type of apartment are you looking for?</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.preferredApartmentType.includes("1BHK")}
                  onChange={() => handleApartmentTypeChange("1BHK")}
                />
                1 BHK
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.preferredApartmentType.includes("2BHK")}
                  onChange={() => handleApartmentTypeChange("2BHK")}
                />
                2 BHK
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.preferredApartmentType.includes("3BHK")}
                  onChange={() => handleApartmentTypeChange("3BHK")}
                />
                3 BHK
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.preferredApartmentType.includes("4BHK")}
                  onChange={() => handleApartmentTypeChange("4BHK")}
                />
                4 BHK
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.preferredApartmentType.includes("Studio")}
                  onChange={() => handleApartmentTypeChange("Studio")}
                />
                Studio
              </label>
            </div>
            <div className="deal-breaker-option">
              <input
                type="checkbox"
                id="apartmentTypeDealBreaker"
                checked={formData.issueWithDifferentApartmentType === "deal-breaker"}
                onChange={(e) => handleInputChange("issueWithDifferentApartmentType", e.target.checked ? "deal-breaker" : "")}
              />
              <label htmlFor="apartmentTypeDealBreaker">This is a deal-breaker for me</label>
            </div>
          </div>
        )}

        <div className="form-group">
          <label>How many roommates are you looking for?</label>
          <div className="radio-group">
            {[1, 2, 3, 4, 5].map((num) => (
              <label key={num}>
                <input
                  type="radio"
                  name="numberOfRoommates"
                  value={num}
                  checked={formData.numberOfRoommates === num.toString()}
                  onChange={(e) => handleChange({ target: { name: "numberOfRoommates", value: e.target.value } })}
                />
                {num}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="cleanliness">How clean do you like to keep your space?</label>
          <select
            id="cleanliness"
            name="cleanliness"
            value={formData.cleanliness}
            onChange={handleChange}
            required
          >
            <option value="">Select your cleanliness preference</option>
            <option value="1">Very relaxed</option>
            <option value="2">Somewhat relaxed</option>
            <option value="3">Moderate</option>
            <option value="4">Somewhat strict</option>
            <option value="5">Very strict</option>
          </select>
          <div className="deal-breaker-option">
            <input
              type="checkbox"
              id="cleanlinessDealBreaker"
              checked={formData.cleanlinessDealBreaker}
              onChange={(e) => handleInputChange("cleanlinessDealBreaker", e.target.checked)}
            />
            <label htmlFor="cleanlinessDealBreaker">This is a deal-breaker for me</label>
          </div>
        </div>

        <div className="form-group">
          <label>
            Would you be okay with a roommate who has different cleanliness standards?
            <select
              name="issueWithCleanliness"
              value={formData.issueWithCleanliness}
              onChange={handleChange}
              required
            >
              <option value="">Select your preference</option>
              <option value="yes">I prefer similar cleanliness levels</option>
              <option value="no">I'm flexible with cleanliness</option>
            </select>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="budgetRange">What's your monthly budget range? (in your local currency)</label>
          <select
            id="budgetRange"
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            required
          >
            <option value="">Select your budget range</option>
            <option value="budget-low">Low  (up to ~$500 / ₹20k equivalent)</option>
            <option value="budget-mid-low">Mid-low  (~$500–$1,000 / ₹20k–₹40k)</option>
            <option value="budget-mid">Mid  (~$1,000–$1,500 / ₹40k–₹60k)</option>
            <option value="budget-mid-high">Mid-high  (~$1,500–$2,000 / ₹60k–₹80k)</option>
            <option value="budget-high">High  ($2,000+ / ₹80k+)</option>
          </select>
          <div className="deal-breaker-option">
            <input
              type="checkbox"
              id="budgetDealBreaker"
              checked={formData.budgetDealBreaker}
              onChange={(e) => handleInputChange("budgetDealBreaker", e.target.checked)}
            />
            <label htmlFor="budgetDealBreaker">This is a deal-breaker for me</label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="issueWithDifferentBudget">Would you be okay with a roommate who has a different budget range?</label>
          <select
            id="issueWithDifferentBudget"
            name="issueWithDifferentBudget"
            value={formData.issueWithDifferentBudget}
            onChange={handleChange}
            required
          >
            <option value="">Select your preference</option>
            <option value="yes">I prefer someone with similar budget</option>
            <option value="no">I'm flexible with budget differences</option>
          </select>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className={`submit-button ${isEditing ? 'update' : 'create'}`}
          >
            {isEditing ? "Update Profile" : "Create Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;

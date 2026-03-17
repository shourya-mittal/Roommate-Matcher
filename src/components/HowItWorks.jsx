import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      icon: "👤",
      title: "Create Your Profile",
      description: "Tell us about your preferences, lifestyle, and what you're looking for in a roommate."
    },
    {
      icon: "🔍",
      title: "Find Matches",
      description: "Our algorithm matches you with compatible roommates based on your preferences and lifestyle."
    },
    {
      icon: "💬",
      title: "Connect",
      description: "View detailed profiles of your matches and connect with potential roommates."
    },
    {
      icon: "🏠",
      title: "Move In",
      description: "Once you find your perfect match, you can start planning your living arrangement!"
    }
  ];

  return (
    <section className="how-it-works">
      <h2>How It Works</h2>
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step-card" style={{ animationDelay: `${index * 0.2}s` }}>
            <div className="step-icon">{step.icon}</div>
            <div className="step-number">{index + 1}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks; 
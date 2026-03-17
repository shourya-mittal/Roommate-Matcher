import React from 'react';
import './Skeleton.css';

function Skeleton({ type, count = 1 }) {
  const elements = Array(count).fill(0);
  
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return <div className="skeleton skeleton-text" />;
      case 'title':
        return <div className="skeleton skeleton-title" />;
      case 'avatar':
        return <div className="skeleton skeleton-avatar" />;
      case 'thumbnail':
        return <div className="skeleton skeleton-thumbnail" />;
      case 'button':
        return <div className="skeleton skeleton-button" />;
      case 'checkbox':
        return <div className="skeleton skeleton-checkbox" />;
      default:
        return <div className="skeleton skeleton-text" />;
    }
  };

  return (
    <div className="skeleton-wrapper">
      {elements.map((_, index) => (
        <div key={index} className="skeleton-container">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}

export default Skeleton; 
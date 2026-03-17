import React, { useState } from 'react';
import './Tooltip.css';

function Tooltip({ text, children, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`tooltip tooltip-${position}`}>
          {text}
          <div className="tooltip-arrow" />
        </div>
      )}
    </div>
  );
}

export default Tooltip; 
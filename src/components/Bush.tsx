import React from 'react';
import './Palmo.css';
import image1 from '/bush1.png';
import image2 from '/bush2.png';

const Bush = ({ speed = 1 }) => {
  return (
    <div className="bush-pixel-container">
      {/* Background Image */}
      <img src={image1} alt="frame-1" className="base-pixel" />
      
      {/* Top Image that snaps in and out */}
      <img 
        src={image2} 
        alt="frame-2" 
        className="top-pixel" 
        style={{ animationDuration: `${speed}s` }}
      />
    </div>
  );
};

export default Bush;
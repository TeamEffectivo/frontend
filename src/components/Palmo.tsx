import React from 'react';
import './Palmo.css';
import image1 from '/palmo1.png';
import image2 from '/palmo2.png';

const Palmo = ({ speed = 1 }) => {
  return (
    <div className="pixel-container">
      {/* Background Image */}
      <img src={image1} alt="frame-1" width="80px" height="120px" className="base-pixel" />
      
      {/* Top Image that snaps in and out */}
      <img 
        src={image2} 
        alt="frame-2" 
        className="top-pixel" 
        width="80px" height="120px" 
        style={{ animationDuration: `${speed}s` }}
      />
    </div>
  );
};

export default Palmo;
import React from 'react';
import './Palmo.css';
import image1 from '../../public/flower1.png';
import image2 from '../../public/flower2.png';

const Flower = ({ speed = 1 }) => {
  return (
    <div className="flower-pixel-container">
      <img src={image1} alt="frame-1" className="flower-base-pixel" />
      
      <img 
        src={image2} 
        alt="frame-2" 
        className="flower-top-pixel" 
        style={{ animationDuration: `${speed}s` }}
      />
    </div>
  );
};

export default Flower;
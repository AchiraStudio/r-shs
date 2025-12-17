// ImageCarousel.jsx
import React, { memo, useEffect, useState } from 'react';
import './ImageCarousel.css';

const images = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a',
  'https://images.unsplash.com/photo-1519452575417-564c1401ecc0'
];

const ImageCarousel = memo(() => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel">
      {images.map((src, i) => (
        <div
          key={i}
          className={`carousel-slide ${i === index ? 'active' : ''}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}

      <div className="carousel-glass-overlay" />
    </div>
  );
});

export default ImageCarousel;

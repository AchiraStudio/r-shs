import { useState, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  placeholderSrc, 
  alt, 
  onLoad, 
  loaded, 
  placeholderColor 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (loaded) {
      setIsLoaded(true);
    }
  }, [loaded]);

  return (
    <div className="image-container">
      {!isLoaded && (
        <div 
          className="image-placeholder" 
          style={{ background: placeholderColor || 'var(--gradient-default)' }}
        >
          {placeholderSrc && (
            <img 
              src={placeholderSrc} 
              alt="" 
              className="placeholder-image" 
              aria-hidden="true"
            />
          )}
        </div>
      )}
      <img
        data-src={src}
        src={isLoaded ? src : ''}
        alt={alt}
        className={`main-image ${isLoaded ? 'loaded' : ''}`}
        onLoad={() => {
          setIsLoaded(true);
          onLoad();
        }}
        loading="lazy"
      />
    </div>
  );
};

export default OptimizedImage;
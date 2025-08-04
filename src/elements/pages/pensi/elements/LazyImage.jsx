import { useState, useEffect, useRef } from 'react'; // Added useRef to imports

const LazyImage = ({ src, alt, onLoad, loaded, placeholderColor }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.01 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <div className="image-container" ref={imgRef}>
      {!loaded && (
        <div 
          className="image-placeholder" 
          style={{ '--placeholder-color': placeholderColor }}
        />
      )}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          onLoad={onLoad}
          className={loaded ? 'loaded' : ''}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;
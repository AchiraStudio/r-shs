import { useState, useMemo, lazy, Suspense, memo, useRef, useEffect } from 'react';

// Lazy-loaded optimized image component
const OptimizedImage = lazy(() => import('./OptimizedImage'));

// Memoized gallery item with 3D effects
const GalleryItem = memo(({ img, tab }) => {
  const [loaded, setLoaded] = useState(false);
  const itemRef = useRef(null);
  
  // 3D tilt effect
  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    const handleMove = (e) => {
      const x = e.clientX - item.getBoundingClientRect().left;
      const y = e.clientY - item.getBoundingClientRect().top;
      const centerX = item.offsetWidth / 2;
      const centerY = item.offsetHeight / 2;
      const rotateY = (x - centerX) / 25;
      const rotateX = (centerY - y) / 25;
      
      item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      item.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 30px rgba(0, 0, 0, 0.3)`;
    };

    const handleLeave = () => {
      item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      item.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
    };

    item.addEventListener('mousemove', handleMove);
    item.addEventListener('mouseleave', handleLeave);

    return () => {
      item.removeEventListener('mousemove', handleMove);
      item.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div 
      className="gallery-item"
      ref={itemRef}
      data-aspect-ratio={img.aspectRatio || '1/1'}
    >
      <Suspense fallback={
        <div 
          className="image-placeholder" 
          style={{ background: img.color || 'var(--gradient-default)' }}
        />
      }>
        <OptimizedImage
          src={img.url}
          placeholderSrc={img.placeholder}
          alt={img.label}
          onLoad={() => setLoaded(true)}
          loaded={loaded}
          placeholderColor={img.color}
        />
      </Suspense>
      <div className="image-overlay">
        <span className="image-label">{img.label}</span>
        <div className="image-reflection"></div>
      </div>
    </div>
  );
});

function Landing() {
  const [activeTab, setActiveTab] = useState('tab1');
  const galleryRef = useRef(null);

  // Memoized image data with optimized sizes
  const tabImages = useMemo(() => ({
    tab1: [
      {
        id: 1,
        url: 'https://picsum.photos/id/1018/600/400',
        placeholder: 'https://picsum.photos/id/1018/60/40',
        label: 'Product View',
        color: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
        aspectRatio: '3/2'
      },
      {
        id: 2,
        url: 'https://picsum.photos/id/1015/600/600',
        placeholder: 'https://picsum.photos/id/1015/60/60',
        label: 'Details',
        color: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        aspectRatio: '1/1'
      },
      {
        id: 3,
        url: 'https://picsum.photos/id/1016/800/600',
        placeholder: 'https://picsum.photos/id/1016/80/60',
        label: 'Features',
        color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        aspectRatio: '4/3'
      },
      {
        id: 4,
        url: 'https://picsum.photos/id/1025/1280/720',
        placeholder: 'https://picsum.photos/id/1025/128/72',
        label: 'Gallery',
        color: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        aspectRatio: '16/9'
      }
    ],
    tab2: [
      {
        id: 5,
        url: 'https://picsum.photos/id/1035/400/600',
        placeholder: 'https://picsum.photos/id/1035/40/60',
        label: 'Option 1',
        color: 'linear-gradient(135deg, #a6c1ee 0%, #fbc2eb 100%)',
        aspectRatio: '2/3'
      },
      {
        id: 6,
        url: 'https://picsum.photos/id/1041/600/600',
        placeholder: 'https://picsum.photos/id/1041/60/60',
        label: 'Option 2',
        color: 'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)',
        aspectRatio: '1/1'
      },
      {
        id: 7,
        url: 'https://picsum.photos/id/1047/450/600',
        placeholder: 'https://picsum.photos/id/1047/45/60',
        label: 'Bundle',
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        aspectRatio: '3/4'
      },
      {
        id: 8,
        url: 'https://picsum.photos/id/1053/400/700',
        placeholder: 'https://picsum.photos/id/1053/40/70',
        label: 'Special Edition',
        color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        aspectRatio: '9/16'
      }
    ]
  }), []);

  // Memoize current images
  const currentImages = useMemo(() => tabImages[activeTab], [activeTab, tabImages]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!galleryRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target.querySelector('img');
          if (img && img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
        }
      });
    }, { rootMargin: '200px' });

    const items = galleryRef.current.querySelectorAll('.gallery-item');
    items.forEach(item => observer.observe(item));

    return () => {
      items.forEach(item => observer.unobserve(item));
    };
  }, [currentImages]);

  return (
    <section className="landing" id="landing">
      <div className="landing__container">
        {/* Left: Tabs + Content */}
        <div className="landing__left">
          <div className="landing__tabs">
            {['tab1', 'tab2'].map((tab) => (
              <div
                key={tab}
                className={`tab_button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {`Tab ${tab.slice(-1)}`}
              </div>
            ))}
          </div>

          <div className="landing__contentbox">
            {activeTab === 'tab1' && (
              <div className="tab_content">
                <h2>Premium Collection</h2>
                <p>Experience our finest products with cutting-edge design and exceptional quality.</p>
                <button className="landing_button">
                  EXPLORE
                </button>
              </div>
            )}
            {activeTab === 'tab2' && (
              <div className="tab_content">
                <h2>Exclusive Offers</h2>
                <p>Discover limited edition bundles and special promotions available now.</p>
                <button className="landing_button">
                  SHOP NOW
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Enhanced Image Gallery */}
        <div className="landing__right">
          <div className="image-gallery" ref={galleryRef}>
            {currentImages.map((img) => (
              <GalleryItem 
                key={`${activeTab}-${img.id}`}
                img={img}
                tab={activeTab}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Landing;
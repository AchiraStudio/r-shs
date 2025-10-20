import { useState, useMemo, lazy, Suspense, memo, useRef, useEffect } from 'react';

// Lazy-loaded optimized image component
const OptimizedImage = lazy(() => import('./OptimizedImage'));

// Memoized gallery item with enhanced 3D effects
const GalleryItem = memo(({ img, tab, index }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const itemRef = useRef(null);
  
  // Intersection Observer for staggered animations
  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3, rootMargin: '50px' }
    );

    observer.observe(item);
    return () => observer.unobserve(item);
  }, []);

  // Enhanced 3D tilt effect with performance optimization
  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    let rafId;
    const handleMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        const rotateY = x * 8;
        const rotateX = -y * 8;
        const translateZ = Math.abs(x + y) * 20;
        
        item.style.transform = `
          perspective(1200px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg) 
          translateZ(${translateZ}px)
        `;
        
        const shadowX = -rotateY * 3;
        const shadowY = rotateX * 3;
        item.style.boxShadow = `
          ${shadowX}px ${shadowY}px 40px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `;
      });
    };

    const handleLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        item.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateZ(0)';
        item.style.boxShadow = `
          0 20px 50px rgba(0, 0, 0, 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.05)
        `;
      });
    };

    item.addEventListener('mousemove', handleMove, { passive: true });
    item.addEventListener('mouseleave', handleLeave, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      item.removeEventListener('mousemove', handleMove);
      item.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div 
      className={`gallery-item ${inView ? 'visible' : ''}`}
      ref={itemRef}
      data-aspect-ratio={img.aspectRatio || '1/1'}
      style={{ '--delay': `${index * 0.1}s` }}
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
        <div className="overlay-content">
          <span className="image-label">{img.label}</span>
          <div className="image-cta">
            <button className="cta-button">View Details</button>
          </div>
        </div>
        <div className="image-reflection"></div>
      </div>
      <div className="item-glow"></div>
    </div>
  );
});

function Landing() {
  const [activeTab, setActiveTab] = useState('tab1');
  const [isScrolling, setIsScrolling] = useState(false);
  const galleryRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Enhanced image data with optimized metadata
  const tabImages = useMemo(() => ({
    tab1: [
      {
        id: 1,
        url: 'https://picsum.photos/id/1018/800/600',
        placeholder: 'https://picsum.photos/id/1018/80/60',
        label: 'Premium Design',
        description: 'Elegant and sophisticated',
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        aspectRatio: '4/3',
        category: 'design'
      },
      {
        id: 2,
        url: 'https://picsum.photos/id/1015/700/700',
        placeholder: 'https://picsum.photos/id/1015/70/70',
        label: 'Innovation',
        description: 'Cutting-edge technology',
        color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        aspectRatio: '1/1',
        category: 'tech'
      },
      {
        id: 3,
        url: 'https://picsum.photos/id/1016/900/600',
        placeholder: 'https://picsum.photos/id/1016/90/60',
        label: 'Quality Craft',
        description: 'Exceptional craftsmanship',
        color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        aspectRatio: '3/2',
        category: 'craft'
      },
      {
        id: 4,
        url: 'https://picsum.photos/id/1025/1200/675',
        placeholder: 'https://picsum.photos/id/1025/120/68',
        label: 'Exclusive Collection',
        description: 'Limited edition pieces',
        color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        aspectRatio: '16/9',
        category: 'exclusive'
      }
    ],
    tab2: [
      {
        id: 5,
        url: 'https://picsum.photos/id/1035/600/900',
        placeholder: 'https://picsum.photos/id/1035/60/90',
        label: 'Modern Style',
        description: 'Contemporary aesthetics',
        color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        aspectRatio: '2/3',
        category: 'style'
      },
      {
        id: 6,
        url: 'https://picsum.photos/id/1041/800/800',
        placeholder: 'https://picsum.photos/id/1041/80/80',
        label: 'Premium Materials',
        description: 'Finest quality resources',
        color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        aspectRatio: '1/1',
        category: 'materials'
      },
      {
        id: 7,
        url: 'https://picsum.photos/id/1047/675/900',
        placeholder: 'https://picsum.photos/id/1047/68/90',
        label: 'Custom Solutions',
        description: 'Tailored to your needs',
        color: 'linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)',
        aspectRatio: '3/4',
        category: 'custom'
      },
      {
        id: 8,
        url: 'https://picsum.photos/id/1053/600/1050',
        placeholder: 'https://picsum.photos/id/1053/60/105',
        label: 'Luxury Edition',
        description: 'Ultimate premium experience',
        color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        aspectRatio: '9/16',
        category: 'luxury'
      }
    ]
  }), []);

  const currentImages = useMemo(() => tabImages[activeTab], [activeTab, tabImages]);

  // Enhanced scroll handling with debouncing
  const handleGalleryScroll = () => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  };

  useEffect(() => {
    const gallery = galleryRef.current;
    if (gallery) {
      gallery.addEventListener('scroll', handleGalleryScroll, { passive: true });
      return () => {
        gallery.removeEventListener('scroll', handleGalleryScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, []);

  return (
    <section className="landing" id="landing">
      {/* Animated background elements */}
      <div className="background-elements">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
        <div className="bg-grid"></div>
      </div>

      <div className="landing__container">
        {/* Enhanced Left Section */}
        <div className="landing__left">
          <div className="content-wrapper">
            {/* Modern Tab Navigation */}
            <nav className="tab-navigation">
              {['tab1', 'tab2'].map((tab, index) => (
                <button
                  key={tab}
                  className={`nav-item ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                  style={{ '--item-index': index }}
                >
                  <span className="nav-icon">
                    {tab === 'tab1' ? '✨' : '⭐'}
                  </span>
                  <span className="nav-text">
                    {tab === 'tab1' ? 'Premium Collection' : 'Exclusive Offers'}
                  </span>
                  <div className="nav-indicator"></div>
                </button>
              ))}
            </nav>

            {/* Enhanced Content Area */}
            <div className="content-area">
              <div className="content-scroll">
                {activeTab === 'tab1' && (
                  <div className="content-section">
                    <div className="badge">New Arrival</div>
                    <h1 className="content-title">
                      Redefining
                      <span className="title-accent"> Excellence</span>
                    </h1>
                    <p className="content-description">
                      Discover our curated collection of premium products designed 
                      for those who appreciate exceptional quality and innovative design. 
                      Each piece tells a story of craftsmanship and attention to detail.
                    </p>
                    <div className="content-stats">
                      <div className="stat">
                        <div className="stat-number">99%</div>
                        <div className="stat-label">Customer Satisfaction</div>
                      </div>
                      <div className="stat">
                        <div className="stat-number">5Y</div>
                        <div className="stat-label">Warranty</div>
                      </div>
                    </div>
                    <div className="action-buttons">
                      <button className="btn btn-primary">
                        <span>Explore Collection</span>
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path fill="currentColor" d="M5 12h14m-7-7l7 7-7 7"/>
                        </svg>
                      </button>
                      <button className="btn btn-secondary">
                        Watch Story
                      </button>
                    </div>
                  </div>
                )}
                {activeTab === 'tab2' && (
                  <div className="content-section">
                    <div className="badge badge-special">Limited Time</div>
                    <h1 className="content-title">
                      Exclusive
                      <span className="title-accent"> Offers</span>
                    </h1>
                    <p className="content-description">
                      Unlock special promotions and limited edition bundles 
                      crafted for our most discerning clients. Experience 
                      unparalleled value with our exclusive partnerships.
                    </p>
                    <div className="offer-highlights">
                      <div className="highlight">
                        <div className="highlight-icon">🎁</div>
                        <div className="highlight-text">Free Premium Gift</div>
                      </div>
                      <div className="highlight">
                        <div className="highlight-icon">🚚</div>
                        <div className="highlight-text">Express Shipping</div>
                      </div>
                    </div>
                    <div className="action-buttons">
                      <button className="btn btn-primary">
                        <span>Shop Now</span>
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path fill="currentColor" d="M5 12h14m-7-7l7 7-7 7"/>
                        </svg>
                      </button>
                      <button className="btn btn-secondary">
                        View Offers
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Right Gallery */}
        <div className="landing__right">
          <div className="gallery-header">
            <h3 className="gallery-title">Featured Gallery</h3>
            <div className="gallery-controls">
              <button className="control-btn">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
              <button className="control-btn">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                </svg>
              </button>
            </div>
          </div>
          <div 
            className={`image-gallery ${isScrolling ? 'scrolling' : ''}`}
            ref={galleryRef}
          >
            {currentImages.map((img, index) => (
              <GalleryItem 
                key={`${activeTab}-${img.id}`}
                img={img}
                tab={activeTab}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Landing;
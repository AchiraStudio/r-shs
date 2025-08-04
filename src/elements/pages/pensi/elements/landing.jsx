import { useState, useMemo, lazy, Suspense, memo } from 'react';

// Lazy-loaded image component
const LazyImage = lazy(() => import('./LazyImage'));

// Memoized image component
const GalleryItem = memo(({ img, tab }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div 
      className="gallery-item"
      data-aspect-ratio={img.aspectRatio || '1/1'}
    >
      <Suspense fallback={
        <div 
          className="image-placeholder" 
          style={{ background: img.color || 'var(--gradient-default)' }}
        />
      }>
        <LazyImage
          src={img.url}
          alt={img.label}
          onLoad={() => setLoaded(true)}
          loaded={loaded}
          placeholderColor={img.color}
        />
      </Suspense>
      <span className="image-label">{img.label}</span>
    </div>
  );
});

function Landing() {
  const [activeTab, setActiveTab] = useState('tab1');

  // Memoized image data
  const tabImages = useMemo(() => ({
    tab1: [
    {
      id: 1,
      url: 'https://picsum.photos/id/1018/600/400',
      label: 'Product View',
      color: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
      aspectRatio: '3/2'
    },
    {
      id: 2,
      url: 'https://picsum.photos/id/1015/600/600',
      label: 'Details',
      color: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      aspectRatio: '1/1'
    },
    {
      id: 3,
      url: 'https://picsum.photos/id/1016/800/600',
      label: 'Features',
      color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      aspectRatio: '4/3'
    },
    {
      id: 4,
      url: 'https://picsum.photos/id/1025/1280/720',
      label: 'Gallery',
      color: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
      aspectRatio: '16/9'
    }
  ],
  tab2: [
    {
      id: 5,
      url: 'https://picsum.photos/id/1035/400/600',
      label: 'Option 1',
      color: 'linear-gradient(135deg, #a6c1ee 0%, #fbc2eb 100%)',
      aspectRatio: '2/3'
    },
    {
      id: 6,
      url: 'https://picsum.photos/id/1041/600/600',
      label: 'Option 2',
      color: 'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)',
      aspectRatio: '1/1'
    },
    {
      id: 7,
      url: 'https://picsum.photos/id/1047/450/600',
      label: 'Bundle',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      aspectRatio: '3/4'
    },
    {
      id: 8,
      url: 'https://picsum.photos/id/1053/400/700',
      label: 'Special Edition',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      aspectRatio: '9/16'
    }
  ]
  }), []);

  // Memoize current images
  const currentImages = useMemo(() => tabImages[activeTab], [activeTab, tabImages]);

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
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, tenetur!</p>
                <button className="landing_button">
                  SCROLL!
                </button>
              </div>
            )}
            {activeTab === 'tab2' && (
              <div className="tab_content">
                <h2>Get Our Tickets!</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, omnis.</p>
                <button className="landing_button">
                  GET IT NOW!
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Images */}
        <div className="landing__right">
          <div className="image-gallery">
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
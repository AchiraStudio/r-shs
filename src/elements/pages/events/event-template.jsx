import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import './css/template.css';
import '../css/header.css';

function Navbar() {
    return (
        <header className="nav" id="nav">
            <a href="../index.html" className="logo">
                R-SHS
            </a>
            <nav>
                <a href="#album">Album</a>
            </nav>
        </header>
    );
}

const imageModules = import.meta.glob('../assets/gallery/*.{jpg,jpeg,png,gif,webp}', { eager: true });

const galleryImages = Object.entries(imageModules).map(([path, module]) => ({
  src: module.default,
  alt: path.split('/').pop().replace(/\.[^/.]+$/, ""), // Remove file extension
  width: 280,
  height: 280
}));

// Cache name
const IMAGE_CACHE_NAME = 'image-cache-v1';

const EventTemplate = ({ 
  eventType = 'christmas',
  coverImage,
  title,
  subtitle,
  description,
  audioSrc,
  galleryImages = []
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [coverImageLoaded, setCoverImageLoaded] = useState(false);
    const [loadedImages, setLoadedImages] = useState(new Set());
    const [cachedImages, setCachedImages] = useState(new Set());
    const observerRef = useRef(null);
    const audioRef = useRef(null);
    
    const themes = useMemo(() => ({
        christmas: {
            colors: {
                primary: '--christmas-primary',
                secondary: '--christmas-secondary',
                background: '--christmas-bg',
                text: '--christmas-text'
            },
            particles: 'snowflakes',
            icon: '🎄'
        },
        valentine: {
            colors: {
                primary: '--valentine-primary',
                secondary: '--valentine-secondary',
                background: '--valentine-bg',
                text: '--valentine-text'
            },
            particles: 'hearts',
            icon: '❤️'
        },
    }), []);
    
    const theme = themes[eventType] || themes.christmas;

    // Initialize cache and check for cached images
    useEffect(() => {
        const initCache = async () => {
            try {
                if ('caches' in window) {
                    const cache = await caches.open(IMAGE_CACHE_NAME);
                    const cachedUrls = new Set();
                    
                    // Check which images are already cached
                    const requests = galleryImages.map(img => new Request(img.src));
                    const responses = await Promise.all(
                        requests.map(request => 
                            cache.match(request).then(response => ({
                                request,
                                response
                            }))
                        )
                    );
                    
                    responses.forEach(({ request, response }) => {
                        if (response) {
                            cachedUrls.add(request.url);
                        }
                    });
                    
                    setCachedImages(cachedUrls);
                }
            } catch (error) {
                console.error('Cache initialization failed:', error);
            }
        };

        initCache();
    }, [galleryImages]);

    // Cache images when they load
    const cacheImage = useCallback(async (src) => {
        try {
            if ('caches' in window) {
                const cache = await caches.open(IMAGE_CACHE_NAME);
                await cache.add(src);
                setCachedImages(prev => new Set(prev).add(src));
            }
        } catch (error) {
            console.error('Failed to cache image:', src, error);
        }
    }, []);

    // Image loading handler
    const handleImageLoad = useCallback(async (index, src) => {
        setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(index);
            return newSet;
        });
        
        // Cache the image after it loads
        if (!cachedImages.has(src)) {
            await cacheImage(src);
        }
    }, [cachedImages, cacheImage]);

    // Preload images and connections
    useEffect(() => {
        // Preconnect to domains if using external resources
        const preconnectLinks = [
            // { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
            // { rel: 'preconnect', href: 'https://your-cdn.com', crossorigin: true }
        ];
        
        preconnectLinks.forEach(link => {
            const el = document.createElement('link');
            Object.entries(link).forEach(([key, value]) => {
                el[key] = value;
            });
            document.head.appendChild(el);
        });

        // Preload critical images
        const preloadImages = [coverImage];
        if (galleryImages.length > 0) {
            preloadImages.push(...galleryImages.slice(0, 3).map(img => img.src));
        }

        preloadImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        return () => {
            // Cleanup if needed
        };
    }, [coverImage, galleryImages]);

    // Lazy load images with Intersection Observer
    useEffect(() => {
        if (!('IntersectionObserver' in window)) {
            // Fallback: load all images if IntersectionObserver is not supported
            galleryImages.forEach((img, index) => handleImageLoad(index, img.src));
            return;
        }

        const observerOptions = {
            rootMargin: '200px 0px',
            threshold: 0.01
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const imgIndex = parseInt(entry.target.dataset.index, 10);
                    if (!isNaN(imgIndex) && !loadedImages.has(imgIndex)) {
                        const imgSrc = galleryImages[imgIndex]?.src;
                        if (imgSrc) {
                            handleImageLoad(imgIndex, imgSrc);
                        }
                        observerRef.current?.unobserve(entry.target);
                    }
                }
            });
        };

        observerRef.current = new IntersectionObserver(observerCallback, observerOptions);

        const imageElements = document.querySelectorAll('.gallery-item');
        imageElements.forEach((el, index) => {
            if (index >= 3 && !loadedImages.has(index)) { // Skip first 3 images
                observerRef.current.observe(el);
            }
        });

        return () => {
            observerRef.current?.disconnect();
        };
    }, [galleryImages, loadedImages, handleImageLoad]);

    // Audio controls
    const togglePlay = useCallback(() => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    const handleProgressChange = useCallback((e) => {
        const newTime = (e.target.value / 100) * duration;
        audioRef.current.currentTime = newTime;
        setProgress(e.target.value);
    }, [duration]);

    const handleVolumeChange = useCallback((e) => {
        const newVolume = e.target.value;
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        
        const updateTime = () => {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / duration) * 100);
        };
        
        const setAudioData = () => {
            setDuration(audio.duration);
        };
        
        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', setAudioData);
        
        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', setAudioData);
        };
    }, [duration]);

    const formatTime = useCallback((time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, []);

    return (
        <div className={`event-template ${eventType}-theme`}>
            <Navbar />
            <header className="event-header">
                <div className="media-player">
                    <div className={`particles-container ${theme.particles}-container`} />
                    
                    <div className="cover-art-container">
                        <img
                            src={coverImage}
                            alt={`${title} Cover`}
                            className={`cover-art ${coverImageLoaded ? 'loaded' : 'loading'}`}
                            loading="eager"
                            decoding="async"
                            width="250"
                            height="250"
                            onLoad={() => setCoverImageLoaded(true)}
                        />
                        {!coverImageLoaded && (
                            <div className="cover-art-placeholder" />
                        )}
                        <span className="theme-icon" aria-hidden="true">
                            {theme.icon}
                        </span>
                    </div>
                    
                    <div className="event-info">
                        <h1 className="event-title">{title}</h1>
                        <p className="event-subtitle">{subtitle}</p>
                    </div>
                    
                    <div className="audio-controls">
                        <div className="progress-container">
                            <input
                                type="range"
                                className="progress-bar"
                                value={progress}
                                onChange={handleProgressChange}
                            />
                            <div className="time-display">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>
                        
                        <div className="control-buttons">
                            <button className="control-btn" aria-label="Previous track">
                                <i className="fas fa-step-backward" />
                            </button>
                            <button 
                                className={`control-btn play-btn ${isPlaying ? 'playing' : ''}`}
                                onClick={togglePlay}
                                aria-label={isPlaying ? 'Pause' : 'Play'}
                            >
                                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
                            </button>
                            <button className="control-btn" aria-label="Next track">
                                <i className="fas fa-step-forward" />
                            </button>
                        </div>
                        
                        <div className="volume-control">
                            <i className={`fas ${volume > 0 ? 'fa-volume-up' : 'fa-volume-mute'}`} />
                            <input
                                type="range"
                                className="volume-slider"
                                value={volume}
                                min={0}
                                max={1}
                                step="0.01"
                                onChange={handleVolumeChange}
                                aria-label="Volume control"
                            />
                        </div>
                    </div>
                    
                    <audio 
                        ref={audioRef}
                        loop
                        id="event-audio"
                        src={audioSrc}
                        preload="metadata"
                    />
                </div>
            </header>
            
            <main className="event-main">
                <section className="about-section">
                    <div className="about-content">
                        <h2>About This Event</h2>
                        <p>{description}</p>
                    </div>
                </section>
                
                {galleryImages.length > 0 && (
                    <section className="gallery-section">
                        <h2>Event Gallery</h2>
                        <div className="gallery-grid">
                            {galleryImages.map((img, index) => (
                                <div 
                                    className="gallery-item" 
                                    key={index}
                                    data-index={index}
                                >
                                    {(index < 3 || loadedImages.has(index)) ? (
                                        <img 
                                            src={img.src}
                                            alt={img.alt}
                                            loading={index < 3 ? "eager" : "lazy"}
                                            decoding="async"
                                            width={img.width}
                                            height={img.height}
                                            className={`gallery-image ${loadedImages.has(index) ? 'loaded' : 'loading'}`}
                                            onLoad={() => handleImageLoad(index, img.src)}
                                        />
                                    ) : (
                                        <div className="image-placeholder" style={{
                                            width: img.width,
                                            height: img.height,
                                        }} />
                                    )}
                                    {cachedImages.has(img.src) && (
                                        <div className="cache-indicator" title="Cached image">
                                            <i className="fas fa-check-circle" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
            
            <footer className="event-footer">
                <p>© {new Date().getFullYear()} Event Template. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default EventTemplate;
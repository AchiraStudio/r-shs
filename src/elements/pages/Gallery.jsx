import React, { useState, useEffect, useRef } from 'react';
import './Gallery.css';
import DynamicIsland from '../../rshs/Components/DynamicI';

// Sample data - in a real app, you would fetch this from an API
import galleryData from '../json/events.json';

function Gallery() {
  const [currentView, setCurrentView] = useState('albums'); 
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const audioRef = useRef(null);

  // Debug: Check if data is loading
  useEffect(() => {
    console.log('Gallery Data:', galleryData);
    console.log('Events:', galleryData.events);
  }, []);

  const openAlbum = (albumKey) => {
    const album = galleryData.events[albumKey];
    console.log('Opening album:', albumKey, album);
    
    if (album && album.galleryImages) {
      setSelectedAlbum(album);
      setCurrentView('album');
      setSelectedImageIndex(0);
      setIsPlaying(false);
    } else {
      console.error('Album not found or no images:', albumKey);
    }
  };

  const openLightbox = (index) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const navigateImage = (direction) => {
    if (!selectedAlbum) return;
    
    if (direction === 'next') {
      setSelectedImageIndex((prev) => 
        prev === selectedAlbum.galleryImages.length - 1 ? 0 : prev + 1
      );
    } else {
      setSelectedImageIndex((prev) => 
        prev === 0 ? selectedAlbum.galleryImages.length - 1 : prev - 1
      );
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Audio playback failed:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const backToAlbums = () => {
    setCurrentView('albums');
    setSelectedAlbum(null);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Filter and sort albums
  const filteredAndSortedAlbums = Object.entries(galleryData.events)
    .filter(([key, album]) => 
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort(([keyA, albumA], [keyB, albumB]) => {
      switch (sortBy) {
        case 'name':
          return albumA.title.localeCompare(albumB.title);
        case 'date':
          return (albumB.date || 0) - (albumA.date || 0);
        case 'size':
          return (albumB.galleryImages?.length || 0) - (albumA.galleryImages?.length || 0);
        default:
          return 0;
      }
    });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      
      if (e.key === 'ArrowRight') navigateImage('next');
      if (e.key === 'ArrowLeft') navigateImage('prev');
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, selectedAlbum]);

  // Check if we have data
  if (!galleryData || !galleryData.events) {
    return (
      <div className="gallery-app">
        <div className="loading-state">
          <div className="glass-card">
            <h2>Loading Gallery...</h2>
            <p>No gallery data found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <DynamicIsland></DynamicIsland>
    <div className="gallery-app">
      {/* Liquid Glass Background Elements */}
      <div className="liquid-background">
        <div className="liquid-blob blob-1"></div>
        <div className="liquid-blob blob-2"></div>
        <div className="liquid-blob blob-3"></div>
        <div className="glass-morph"></div>
      </div>

      {currentView === 'albums' ? (
        <div className="explorer-container">
          {/* Explorer Header */}
          <header className="explorer-header">
            <div className="header-left">
              <div className="folder-icon">
                <div className="folder-tab"></div>
                <div className="folder-body"></div>
              </div>
              <h1>R-SHS Album</h1>
            </div>
            <div className="header-right">
              <div className="search-box glass-input">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search albums..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* <select 
                className="sort-select glass-input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
                <option value="size">Sort by Size</option>
              </select> */}
            </div>
          </header>

          {/* Explorer Content */}
          <div className="explorer-content">
            <div className="sidebar glass-card">
              <div className="sidebar-section">
                <h3>Quick Access</h3>
                <div className="sidebar-item active">
                  <span className="sidebar-icon">📁</span>
                  All Albums
                </div>
                {/* <div className="sidebar-item">
                  <span className="sidebar-icon">⭐</span>
                  Favorites
                </div>
                <div className="sidebar-item">
                  <span className="sidebar-icon">🕒</span>
                  Recent
                </div> */}
              </div>
              {/* <div className="sidebar-section">
                <h3>Categories</h3>
                <div className="sidebar-item">
                  <span className="sidebar-icon">🎉</span>
                  Events
                </div>
                <div className="sidebar-item">
                  <span className="sidebar-icon">🏞️</span>
                  Landscapes
                </div>
                <div className="sidebar-item">
                  <span className="sidebar-icon">👥</span>
                  Portraits
                </div>
              </div> */}
            </div>

            <div className="main-content">
              <div className="content-header">
                <div className="breadcrumb">
                  <span>R-SHS Album</span>
                  <span className="separator">/</span>
                  <span className="current">All Albums</span>
                </div>
                <div className="view-stats">
                  {filteredAndSortedAlbums.length} items
                </div>
              </div>

              <div className="files-grid">
                {filteredAndSortedAlbums.map(([key, album]) => (
                  <div 
                    key={key} 
                    className="file-item glass-card"
                    onClick={() => openAlbum(key)}
                  >
                    <div className="file-icon">
                      <div className="folder-preview">
                        <img 
                          src={album.coverImage} 
                          alt={album.title}
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                          }}
                        />
                        <div className="folder-overlay">
                          <div className="file-type">ALBUM</div>
                        </div>
                      </div>
                    </div>
                    <div className="file-info">
                      <h3 className="file-name">{album.title}</h3>
                      <p className="file-desc">{album.description}</p>
                      <div className="file-meta">
                        <span className="file-size">{album.galleryImages?.length || 0} items</span>
                        <span className="file-date">{album.date || 'Unknown date'}</span>
                      </div>
                    </div>
                    <div className="file-actions">
                      <button className="action-btn">···</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="album-explorer">
          {/* Album Explorer Header */}
          <header className="explorer-header">
            <div className="header-left">
              <button className="back-button glass-button" onClick={backToAlbums}>
                <span className="back-arrow">←</span>
                Back
              </button>
              <div className="breadcrumb">
                <span onClick={backToAlbums} className="clickable">R-SHS Album</span>
                <span className="separator">/</span>
                <span className="current">{selectedAlbum?.title}</span>
              </div>
            </div>
            <div className="header-right">
              {selectedAlbum?.audioSrc && (
                <button 
                  className={`audio-toggle glass-button ${isPlaying ? 'playing' : ''}`}
                  onClick={toggleAudio}
                >
                  <span className="audio-icon">{isPlaying ? '⏸' : '▶'}</span>
                  {isPlaying ? 'Pause Soundtrack' : 'Play Soundtrack'}
                </button>
              )}
              <div className="view-controls">
                <button className="view-btn active">🖼️</button>
                <button className="view-btn">📄</button>
              </div>
            </div>
          </header>

          {/* Album Info Panel */}
          <div className="album-info-panel glass-card">
            <div className="album-cover-large">
              <img 
                src={selectedAlbum?.coverImage} 
                alt={selectedAlbum?.title}
              />
            </div>
            <div className="album-details">
              <h1>{selectedAlbum?.title}</h1>
              <p className="album-subtitle">{selectedAlbum?.subtitle}</p>
              <p className="album-description">{selectedAlbum?.description}</p>
              <div className="album-stats">
                <div className="stat">
                  <span className="stat-number">{selectedAlbum?.galleryImages?.length || 0}</span>
                  <span className="stat-label">Images</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{selectedAlbum?.date || 'N/A'}</span>
                  <span className="stat-label">Date</span>
                </div>
              </div>
            </div>
          </div>

          {/* Images Grid */}
          {selectedAlbum?.galleryImages && selectedAlbum.galleryImages.length > 0 ? (
            <div className="images-grid">
              {selectedAlbum.galleryImages.map((image, index) => (
                <div 
                  key={index} 
                  className="image-item glass-card"
                  onClick={() => openLightbox(index)}
                >
                  <div className="image-container">
                    <img 
                      src={image.src} 
                      alt={image.alt || `Image ${index + 1}`} 
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                      }}
                    />
                    <div className="image-overlay">
                      <div className="image-actions">
                        <button className="action-btn">👁️</button>
                        <button className="action-btn">⭐</button>
                      </div>
                    </div>
                  </div>
                  <div className="image-info">
                    <span className="image-name">{image.alt || `Image ${index + 1}`}</span>
                    <span className="image-type">JPEG</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-images glass-card">
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <h3>No images found</h3>
                <p>This album doesn't contain any images yet.</p>
              </div>
            </div>
          )}
          
          {selectedAlbum?.audioSrc && (
            <audio 
              ref={audioRef} 
              src={selectedAlbum.audioSrc} 
              loop
              onError={(e) => console.error('Audio loading error:', e)}
            />
          )}
        </div>
      )}
      
      {/* Enhanced Lightbox */}
      {isLightboxOpen && selectedAlbum && selectedAlbum.galleryImages && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <div className="lightbox-info">
                <h3>{selectedAlbum.title}</h3>
                <span className="image-counter">
                  {selectedImageIndex + 1} of {selectedAlbum.galleryImages.length}
                </span>
              </div>
              <div className="lightbox-controls">
                {/* <button className="control-btn">⭐</button>
                <button className="control-btn">📥</button> */}
                <button className="control-btn close-btn" onClick={closeLightbox}>✕</button>
              </div>
            </div>
            
            <div className="lightbox-content">
              <button 
                className="nav-button prev" 
                onClick={() => navigateImage('prev')}
              >
                ‹
              </button>
              
              <div className="image-viewer">
                <img 
                  src={selectedAlbum.galleryImages[selectedImageIndex]?.src} 
                  alt={selectedAlbum.galleryImages[selectedImageIndex]?.alt || `Image ${selectedImageIndex + 1}`} 
                />
              </div>
              
              <button 
                className="nav-button next" 
                onClick={() => navigateImage('next')}
              >
                ›
              </button>
            </div>
            
            <div className="lightbox-footer">
              <div className="image-caption glass-card">
                {selectedAlbum.galleryImages[selectedImageIndex]?.alt || `Image ${selectedImageIndex + 1}`}
              </div>
              <div className="navigation-dots">
                {selectedAlbum.galleryImages.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <footer className="status-bar">
        <div className="status-left">
          <span>{filteredAndSortedAlbums.length} items</span>
          <span className="status-separator">|</span>
          <span>R-SHS Album Explorer v1.0</span>
        </div>
        <div className="status-right">
          <span>Ready</span>
        </div>
      </footer>
    </div>
    </>
  );
}

export default Gallery;
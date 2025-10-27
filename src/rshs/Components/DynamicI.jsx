import { useState, useEffect, useRef } from 'react';
import { FaInstagram, FaSearch } from "react-icons/fa";
import { GrDomain } from "react-icons/gr";
import * as XLSX from 'xlsx';
import './DynamicIsland.css';
import './SearchBox.css';

const DynamicIsland = ({ onInstagramClick }) => {
  const [isActive, setIsActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pages, setPages] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);
  const islandRef = useRef(null);

  // ✅ Load spreadsheet once
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('data/events.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        setPages(json);
        setFilteredPages(json);
      } catch (error) {
        console.error('Failed to load spreadsheet:', error);
      }
    };
    loadData();
  }, []);

  // ✅ Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Prevent closing when search is active
  const toggleIsland = (e) => {
    e.stopPropagation();

    // if search is open, ignore clicks that would close it
    if (showSearch) return;

    if (isActive) {
      setIsExiting(true);
      setTimeout(() => {
        setIsActive(false);
        setIsExiting(false);
      }, 300);
    } else {
      setIsActive(true);
    }
  };

  // ✅ Close island when clicking outside (only if not searching)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        islandRef.current &&
        !islandRef.current.contains(e.target) &&
        isActive &&
        !showSearch
      ) {
        setIsExiting(true);
        setTimeout(() => {
          setIsActive(false);
          setIsExiting(false);
        }, 300);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isActive, showSearch]);

  // ✅ Button actions
  const handleAction = (action) => {
    switch (action) {
      case 'instagram':
        onInstagramClick?.() || window.open('https://instagram.com/recisshs', '_blank');
        break;
      case 'main':
        window.location.href = '/r-shs/';
        break;
      case 'search':
        // Open search & keep island active
        setShowSearch((prev) => {
          const newState = !prev;
          if (newState) setIsActive(true);
          return newState;
        });
        break;
      default:
        break;
    }
  };

  // ✅ Search filter
  useEffect(() => {
    if (!searchQuery) {
      setFilteredPages(pages);
    } else {
      const filtered = pages.filter(page =>
        page.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPages(filtered);
    }
  }, [searchQuery, pages]);

  return (
    <div className={`dynamic-island ${isScrolled ? 'scrolled' : ''}`} ref={islandRef}>
      <div
        className={`di-compact ${isActive ? 'active' : ''} ${isExiting ? 'exiting' : ''}`}
        onClick={toggleIsland}
      >
        <div className="di-idle">
          <span className="di-dot"></span>
          <span className="di-label">@rshs</span>
        </div>

        {isActive && (
          <div className={`di-grid ${isExiting ? 'exiting' : ''}`}>
            <div className="di-grid-button" onClick={() => handleAction('instagram')}>
              <FaInstagram />
            </div>
            <div className="di-grid-button" onClick={() => handleAction('main')}>
              <GrDomain />
            </div>
            <div className="di-grid-button" onClick={(e) => { e.stopPropagation(); handleAction('search'); }}>
              <FaSearch />
            </div>
          </div>
        )}
      </div>

      {/* Absolute Search Box */}
      {showSearch && (
        <div
          className="search-box-overlay"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="search-box">
            <div className="search-header">
              <input
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                className="search-close"
                onClick={() => {
                  const box = document.querySelector('.search-box-container');
                  if (box) {
                    box.classList.add('closing');
                    setTimeout(() => setShowSearch(false), 250); // wait for animation
                  } else {
                    setShowSearch(false);
                  }
                }}
              >
                ✕
              </button>
            </div>
            <div className="search-results">
              {filteredPages.length > 0 ? (
                filteredPages.map((page, i) => (
                  <div
                    key={i}
                    className="search-item"
                    onClick={() => (window.location.href = page.link || '/')}
                  >
                    <div className="search-name">{page.name}</div>
                    <div className="search-meta">
                      <span className="search-date">{page.date || ' '}</span>
                      <span className="search-category">{page.category}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">No results found.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicIsland;

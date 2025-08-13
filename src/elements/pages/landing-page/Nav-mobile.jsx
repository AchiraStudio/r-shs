import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import '../css/defaults.css';
import '../css/mobile.css';
import { FaSearch } from "react-icons/fa";
import { LuSquareMenu } from "react-icons/lu";
import { Link } from 'react-router-dom';
import { debounce, loadEventsData, detectPageSections, safeToString } from './utils/navUtils.js';

function NavMobile() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeButton, setActiveButton] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [eventsData, setEventsData] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [pageSections, setPageSections] = useState([]);
    const searchContainerRef = useRef(null);
    const menuContainerRef = useRef(null);

    // Load data and detect sections
    useEffect(() => {
        const fetchInitialData = async () => {
            const [data, sections] = await Promise.all([
                loadEventsData(),
                Promise.resolve(detectPageSections())
            ]);
            setEventsData(data);
            setPageSections(sections);
        };
        
        fetchInitialData();
        
        const observer = new MutationObserver(() => {
            setPageSections(detectPageSections());
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, []);

    // Scroll effect with throttling
    useEffect(() => {
        const handleScroll = debounce(() => {
            setIsScrolled(window.scrollY > 10);
        }, 50);
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Memoized search function
    const performSearch = useMemo(() => debounce((query, data) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = data.filter(event => 
            Object.values(event).some(value => 
                safeToString(value).toLowerCase().includes(lowerQuery)
            )
        ).slice(0, 5);

        setSearchResults(results);
    }, 300), []);

    // Handle search input changes
    useEffect(() => {
        performSearch(searchQuery, eventsData);
    }, [searchQuery, eventsData, performSearch]);

    // deactivate all
    const deactivateAll = useCallback(() => {
        setIsVisible(false);
        setIsMenuOpen(false);
        setActiveButton(null);
        setSearchQuery('');
    }, []);

    // Click outside handler
    const handleClickOutside = useCallback((event) => {
        const isSearchClick = searchContainerRef.current && searchContainerRef.current.contains(event.target);
        const isMenuClick = menuContainerRef.current && menuContainerRef.current.contains(event.target);
        const isNavButtonClick = event.target.closest('.search, .menu, .logo-link');
        
        if (!isSearchClick && !isMenuClick && !isNavButtonClick) {
            deactivateAll();
        }
    }, [deactivateAll]);

    // Modified logo click handler
    const handleLogoClick = useCallback((e) => {
        e.preventDefault();
        deactivateAll();
        window.location.href = "https://www.instagram.com/recisshs";
    }, [deactivateAll]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    // Button handlers
    const handleSearchClick = useCallback(() => {
        const newState = !isVisible;
        setIsVisible(newState);
        setIsMenuOpen(false);
        setActiveButton(newState ? 'search' : null);
        if (!newState) setSearchQuery('');
    }, [isVisible]);

    const handleMenuClick = useCallback(() => {
        const newState = !isMenuOpen;
        setIsMenuOpen(newState);
        setIsVisible(false);
        setActiveButton(newState ? 'menu' : null);
    }, [isMenuOpen]);

    const handleMenuLinkClick = useCallback((sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
        setActiveButton(null);
    }, []);

    const handleSearchSubmit = useCallback((e) => {
        e.preventDefault();
        if (searchResults.length > 0) {
            window.location.href = searchResults[0].link || '#';
        }
    }, [searchResults]);

     return (
        <div className="holder-main">
            <div className={`nav-mobile ${isScrolled ? 'scrolled' : ''}`}>
                <div className="holder">
                    <div className="logo icon">
                        <a 
                            href="https://www.instagram.com/recisshs" 
                            className="logo-link" 
                            aria-label="Instagram"
                            onClick={handleLogoClick}
                        >
                            <h1>@rshs</h1>
                        </a>
                    </div>
                    <button 
                        className={`logo search ${activeButton === 'search' ? 'active' : ''}`} 
                        onClick={handleSearchClick}
                        aria-label="Search"
                        aria-expanded={isVisible}
                    >
                        <FaSearch className='search-logo' />
                        <span className="pulse-ring"></span>
                    </button>
                    <button 
                        className={`logo menu ${activeButton === 'menu' ? 'active' : ''}`}
                        onClick={handleMenuClick}
                        aria-label="Menu"
                        aria-expanded={isMenuOpen}
                    >
                        <LuSquareMenu className='menu-logo' />
                        <span className="pulse-ring"></span>
                    </button>
                </div>
            </div>

            <div 
                className={`search-container-mobile ${isVisible ? 'visible' : ''}`} 
                ref={searchContainerRef}
                aria-hidden={!isVisible}
            >
                <form onSubmit={handleSearchSubmit}>
                    <input 
                        type="text" 
                        placeholder="Search events..." 
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search events"
                    />
                </form>
                
                {searchQuery && (
                    <div className="result-box" role="listbox">
                        {searchResults.length > 0 ? (
                            searchResults.map((result, index) => (
                                <Link 
                                    key={`${result.name}-${index}`}
                                    to={result.link || '#'} 
                                    className="results"
                                    role="option"
                                    style={{ transitionDelay: `${index * 50}ms` }}
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSearchResults([]);
                                    }}
                                >
                                    <div className="result-name">
                                        <h1>{result.name || 'Untitled Event'}</h1>
                                        <h2>{result.date || 'No date specified'}</h2>
                                    </div>
                                    <div className="result-category">
                                        <h1>{result.category || 'Uncategorized'}</h1>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="results no-results">
                                <div className="result-name">
                                    <h1>No events found</h1>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div 
                className={`menu-container-mobile ${isMenuOpen ? 'visible' : ''}`} 
                ref={menuContainerRef}
                aria-hidden={!isMenuOpen}
            >
                <div className="menu-box">
                    {pageSections.length > 0 ? (
                        pageSections.map((section, index) => (
                            <button
                                key={section.id}
                                className="menu-item"
                                onClick={() => handleMenuLinkClick(section.id)}
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                <div className="menu-item-name">
                                    <h1>{section.name || `Section ${index + 1}`}</h1>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="menu-item no-sections">
                            <div className="menu-item-name">
                                <h1>No sections found</h1>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NavMobile;
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import '../css/header.css';
import { LuSquareMenu } from "react-icons/lu";
import { Link } from 'react-router-dom';
import { debounce, loadEventsData, safeToString } from './utils/navUtils.js';

function Header() {
    const navRef = useRef(null);
    const logoRef = useRef(null);
    const navLinksRef = useRef([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [eventsData, setEventsData] = useState([]);
    const searchContainerRef = useRef(null);

    // Load data with error handling
    useEffect(() => {
        const fetchData = async () => {
            const data = await loadEventsData();
            setEventsData(data);
        };
        fetchData();
    }, []);

    // Memoized search function with debounce
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

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setSearchQuery('');
                setSearchResults([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll handling with performance optimization
    const handleScroll = useCallback(() => {
        if (isMenuOpen) return;

        const currentScrollPosition = window.scrollY;
        const scrollThreshold90 = window.innerHeight * 0.9;
        const scrollThreshold110 = window.innerHeight * 1.1;

        const nav = navRef.current;
        const logo = logoRef.current;
        const links = navLinksRef.current;

        if (currentScrollPosition > scrollThreshold90) {
            nav?.classList.add('scrolled');
            logo?.classList.add('scrolled');
            links.forEach(link => link?.classList.add('scrolled'));
        } else {
            nav?.classList.remove('scrolled');
            logo?.classList.remove('scrolled');
            links.forEach(link => link?.classList.remove('scrolled'));
        }

        if (currentScrollPosition > scrollThreshold110) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
    }, [isMenuOpen]);

    useEffect(() => {
        const throttledScroll = debounce(handleScroll, 50);
        window.addEventListener('scroll', throttledScroll);
        return () => window.removeEventListener('scroll', throttledScroll);
    }, [handleScroll]);

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        if (searchResults.length > 0) {
            window.location.href = searchResults[0].link || '#';
        }
    }, [searchResults]);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

    return (
        <header className="header">
            <div className="nav" ref={navRef}>
                <a
                    href="https://www.instagram.com/recisshs?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                    className="logo"
                    ref={logoRef}
                    aria-label="Instagram profile"
                >
                    @recisshs
                </a>

                <div className="search-large" ref={searchContainerRef}>
                    <form className="search-container" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                            aria-label="Search events"
                        />
                        <button type="submit" className="search-button" aria-label="Submit search">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
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

                <button 
                    className={`hamburger ${isMenuOpen ? 'open' : ''}`} 
                    onClick={toggleMenu}
                    aria-label="Menu"
                    aria-expanded={isMenuOpen}
                >
                    <LuSquareMenu className='hamburger-icon'/>
                </button>

                <nav className={`sidebar-menu ${isMenuOpen ? 'open' : ''}`} aria-hidden={!isMenuOpen}>
                    {['#timeline', '#about', '#crew'].map((href, i) => (
                        <a
                            key={href}
                            href={href}
                            ref={el => (navLinksRef.current[i] = el)}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {['Timeline', 'About Us', 'Our Crew'][i]}
                        </a>
                    ))}
                </nav>

                {isMenuOpen && (
                    <div 
                        className="menu-overlay" 
                        onClick={() => setIsMenuOpen(false)}
                        role="button"
                        aria-label="Close menu"
                        tabIndex={0}
                    />
                )}
            </div>
        </header>
    );
}

export default Header;
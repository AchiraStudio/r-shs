import { useEffect, useRef, useState } from 'react';
import '../css/header.css';
import { LuSquareMenu } from "react-icons/lu";
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';

function Header() {
    const navRef = useRef(null);
    const logoRef = useRef(null);
    const navLinksRef = useRef([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [eventsData, setEventsData] = useState([]);
    const searchContainerRef = useRef(null);

    // Sample data - replace this with your XLSX loading logic
    useEffect(() => {

        // To load from XLSX file (place your file in public folder):
        const fetchData = async () => {
            try {
                const response = await fetch('data/events.xlsx');
                const arrayBuffer = await response.arrayBuffer();
                const data = new Uint8Array(arrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                setEventsData(jsonData);
            } catch (error) {
                console.error('Error loading XLSX data:', error);
            }
        };
        fetchData();
    }, []);

    // Handle search input changes
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        const results = eventsData.filter(event => 
            event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.category.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5); // Limit to 5 results

        setSearchResults(results);
    }, [searchQuery, eventsData]);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setSearchQuery('');
                setSearchResults([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Scroll handling (your existing code)
    useEffect(() => {
        let lastScrollPosition = 0;
        const isMenuOpenRef = { current: isMenuOpen };

        const handleScroll = () => {
            if (isMenuOpenRef.current) return;

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

            if (currentScrollPosition > scrollThreshold110 && currentScrollPosition > lastScrollPosition) {
                nav.style.transform = 'translateY(-100%)';
                nav.style.transition = 'transform 0.3s ease-in-out';
            } else {
                nav.style.transform = 'translateY(0)';
                nav.style.transition = 'transform 0.3s ease-in-out';
            }

            lastScrollPosition = currentScrollPosition;
        };

        const updateMenuOpenRef = () => {
            isMenuOpenRef.current = isMenuOpen;
        };

        const observer = new MutationObserver(updateMenuOpenRef);
        const targetNode = document.body;
        observer.observe(targetNode, { attributes: true, childList: false, subtree: false });

        document.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, [isMenuOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchResults.length > 0) {
            window.location.href = searchResults[0].link;
        }
    };

    return (
        <header className="header">
            <div className="nav" ref={navRef}>
                <a
                    href="https://www.instagram.com/recisshs?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                    className="logo"
                    ref={logoRef}
                >
                    @recisshs
                </a>

                {/* Search Bar */}
                <div className="search-large" ref={searchContainerRef}>
                    <form className="search-container" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </form>
                    
                    {/* Results Box */}
                    {searchQuery && (
                        <div className="result-box">
                            {searchResults.length > 0 ? (
                                searchResults.map((result, index) => (
                                    <Link 
                                        key={index} 
                                        to={result.link} 
                                        className="results"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSearchResults([]);
                                        }}
                                    >
                                    <div className="result-name">
                                        <h1>{result.name}</h1>
                                        <h2>{result.date.toString()}</h2>
                                    </div>
                                    <div className="result-category">
                                        <h1>{result.category}</h1>
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

                {/* Hamburger Menu Button */}
                <button 
                    className={`hamburger ${isMenuOpen ? 'open' : ''}`} 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Menu"
                >
                    <LuSquareMenu className='hamburger-icon'/>
                </button>

                {/* Sidebar Menu */}
                <div className={`sidebar-menu ${isMenuOpen ? 'open' : ''}`}>
                    <nav>
                        {['#timeline', '#about', '#crew'].map((href, i) => (
                            <a
                                key={i}
                                href={href}
                                ref={el => (navLinksRef.current[i] = el)}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {['Timeline', 'About Us', 'Our Crew'][i]}
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Overlay for when menu is open */}
                {isMenuOpen && (
                    <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />
                )}
            </div>
        </header>
    );
}

export default Header;
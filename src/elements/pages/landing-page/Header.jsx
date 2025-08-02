import { useEffect, useRef, useState } from 'react';
import '../css/header.css';
import { LuSquareMenu } from "react-icons/lu";

function Header() {
    const navRef = useRef(null);
    const logoRef = useRef(null);
    const navLinksRef = useRef([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        let lastScrollPosition = 0;
        const isMenuOpenRef = { current: isMenuOpen };

        const handleScroll = () => {
            if (isMenuOpenRef.current) return; // Skip if menu is open

            const currentScrollPosition = window.scrollY;
            const scrollThreshold90 = window.innerHeight * 0.9;
            const scrollThreshold110 = window.innerHeight * 1.1;

            const nav = navRef.current;
            const logo = logoRef.current;
            const links = navLinksRef.current;

            // Add/remove .scrolled class at 90vh
            if (currentScrollPosition > scrollThreshold90) {
                nav?.classList.add('scrolled');
                logo?.classList.add('scrolled');
                links.forEach(link => link?.classList.add('scrolled'));
            } else {
                nav?.classList.remove('scrolled');
                logo?.classList.remove('scrolled');
                links.forEach(link => link?.classList.remove('scrolled'));
            }

            // Slide nav away at 110vh if scrolling down
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
        // Handle search functionality here
        console.log('Searching for:', searchQuery);
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
                <form className="search-container" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search..."
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
import { useEffect, useRef } from 'react';
import '../css/header.css';

function Header() {
    const navRef = useRef(null);
    const logoRef = useRef(null);
    const navLinksRef = useRef([]);

    useEffect(() => {
        let lastScrollPosition = 0;

        const handleScroll = () => {
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

        document.addEventListener('scroll', handleScroll);
        return () => document.removeEventListener('scroll', handleScroll);
    }, []);

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
                <nav>
                    {['#timeline', '#about', '#crew'].map((href, i) => (
                        <a
                            key={i}
                            href={href}
                            ref={el => (navLinksRef.current[i] = el)}
                        >
                            {['Timeline', 'About Us', 'Our Crew'][i]}
                        </a>
                    ))}
                </nav>
            </div>
        </header>
    );
}

export default Header;

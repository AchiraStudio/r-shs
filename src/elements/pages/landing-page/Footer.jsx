import '../css/footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaTiktok } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const links = [
        { name: 'Home', href: '#home' },
        { name: 'Timeline', href: '#main' },
        { name: 'About Us', href: '#about' },
        { name: 'Our Crew', href: '#crew' },
        { name: 'Instagram', href: 'https://www.instagram.com/recisshs' }
    ];

    const socialIcons = [
        { icon: <FaTiktok />, href: 'https://tiktok.com' },
        { icon: <FaInstagram />, href: 'https://www.instagram.com/recisshs' }
    ];

    return (
        <footer className="footer">
            <div className="footer-container">
                <nav className="footer-nav">
                    <ul className="footer-links">
                        {links.map((link, index) => (
                            <li key={index}>
                                <a
                                    href={link.href}
                                    target={link.href.startsWith('http') ? '_blank' : '_self'}
                                    rel="noopener noreferrer"
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="social-links">
                    {socialIcons.map((social, index) => (
                        <a
                            key={index}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${social.icon.type.displayName} link`}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>

                <div className="copyright">
                    © {currentYear} SMA Regina Pacis Bogor. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
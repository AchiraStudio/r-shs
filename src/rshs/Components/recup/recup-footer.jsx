import React from 'react';
import './css/footer.css';

const RecupFooter = () => {
  const sponsors = [
    {
      id: 1,
      name: "Olympus Beverages",
      logo: "./assets/recup/sponsor1.webp",
      tier: "platinum"
    },
    {
      id: 2,
      name: "Athena Tech",
      logo: "./assets/recup/sponsor2.webp",
      tier: "platinum"
    },
    {
      id: 3,
      name: "Zeus Energy",
      logo: "./assets/recup/sponsor3.webp",
      tier: "gold"
    },
    {
      id: 4,
      name: "Hercules Fitness",
      logo: "./assets/recup/sponsor4.webp",
      tier: "gold"
    },
    {
      id: 5,
      name: "Apollo Media",
      logo: "./assets/recup/sponsor5.webp",
      tier: "silver"
    },
    {
      id: 6,
      name: "Artemis Security",
      logo: "./assets/recup/sponsor6.webp",
      tier: "silver"
    }
  ];

  const footerLinks = [
    {
      title: "Event",
      links: [
        { name: "About", href: "#" },
        { name: "Schedule", href: "#" },
        { name: "Venue", href: "#" },
        { name: "FAQ", href: "#" }
      ]
    },
    {
      title: "Competitions",
      links: [
        { name: "Sports", href: "#" },
        { name: "Academic", href: "#" },
        { name: "Arts", href: "#" },
        { name: "Rules", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Guidebook", href: "#" },
        { name: "Registration", href: "#" },
        { name: "Contact", href: "#" },
        { name: "Support", href: "#" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "f", href: "#" },
    { name: "Twitter", icon: "𝕏", href: "#" },
    { name: "Instagram", icon: "📷", href: "#" },
    { name: "YouTube", icon: "▶", href: "#" }
  ];

  return (
    <footer className="recup-footer">
      <div className="footer-decoration">
        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>
        <div className="wave wave-3"></div>
      </div>
      
      <div className="footer-content">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-logo">
              <img src="./assets/recup/title.webp" alt="Recup Logo" />
              <p className="footer-tagline">Celebrating the Spirit of Ancient Greece</p>
            </div>
            
            <div className="footer-links-container">
              {footerLinks.map((section, index) => (
                <div key={index} className="footer-links-section">
                  <h3 className="footer-links-title">{section.title}</h3>
                  <ul className="footer-links-list">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a href={link.href}>{link.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            {/* <div className="footer-newsletter">
              <h3 className="footer-links-title">Stay Updated</h3>
              <p className="newsletter-description">Subscribe to get the latest news and updates</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email address" className="newsletter-input" />
                <button className="newsletter-button">Subscribe</button>
              </div>
            </div> */}
          </div>
          
          {/* <div className="footer-sponsors">
            <h3 className="sponsors-title">Our Sponsors</h3>
            
            <div className="sponsor-tiers">
              <div className="sponsor-tier">
                <h4 className="tier-title">Platinum</h4>
                <div className="sponsor-list">
                  {sponsors.filter(s => s.tier === 'platinum').map(sponsor => (
                    <div key={sponsor.id} className="sponsor-item platinum">
                      <img src={sponsor.logo} alt={sponsor.name} title={sponsor.name} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="sponsor-tier">
                <h4 className="tier-title">Gold</h4>
                <div className="sponsor-list">
                  {sponsors.filter(s => s.tier === 'gold').map(sponsor => (
                    <div key={sponsor.id} className="sponsor-item gold">
                      <img src={sponsor.logo} alt={sponsor.name} title={sponsor.name} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="sponsor-tier">
                <h4 className="tier-title">Silver</h4>
                <div className="sponsor-list">
                  {sponsors.filter(s => s.tier === 'silver').map(sponsor => (
                    <div key={sponsor.id} className="sponsor-item silver">
                      <img src={sponsor.logo} alt={sponsor.name} title={sponsor.name} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div> */}
          
          <div className="footer-bottom">
            <div className="footer-copyright">
              <p>&copy; {new Date().getFullYear()} Recup. All rights reserved.</p>
            </div>
            
            {/* <div className="footer-social">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href} className="social-link" title={social.name}>
                  <span className="social-icon">{social.icon}</span>
                </a>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default RecupFooter;
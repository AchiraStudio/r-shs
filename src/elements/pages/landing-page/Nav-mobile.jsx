import { useState } from 'react';
import '../css/defaults.css'
import '../css/mobile.css'
import { FaSearch } from "react-icons/fa";
import { LuSquareMenu } from "react-icons/lu";

function NavMobile() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeButton, setActiveButton] = useState(null);

    const handleSearchClick = () => {
        setIsVisible(prev => !prev);
        setActiveButton(prev => prev === 'search' ? null : 'search');
    }

    const handleMenuClick = () => {
        setActiveButton(prev => prev === 'menu' ? null : 'menu');
        // Add your menu functionality here
    }

    return(
        <div className="holder-main">
            <div className="nav-mobile">
                <div className="holder">
                    <div className="logo icon">
                        <a href="https://www.instagram.com/recisshs"><h1>@rshs</h1></a>
                    </div>
                    <div 
                        className={`logo search ${activeButton === 'search' ? 'active' : ''}`} 
                        onClick={handleSearchClick}
                    >
                        <FaSearch className='search-logo' />
                    </div>
                    <div 
                        className={`logo menu ${activeButton === 'menu' ? 'active' : ''}`}
                        onClick={handleMenuClick}
                    >
                        <LuSquareMenu className='menu-logo' />
                    </div>
                </div>
            </div>
            <div className={`search-container-mobile ${isVisible ? 'visible' : ''}`}>
                <input type="text" placeholder="Search" className="search-input"/>
            </div>
        </div>
    )
}

export default NavMobile
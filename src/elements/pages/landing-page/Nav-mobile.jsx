import { useState, useEffect, useRef } from 'react';
import '../css/defaults.css';
import '../css/mobile.css';
import { FaSearch } from "react-icons/fa";
import { LuSquareMenu } from "react-icons/lu";
import * as XLSX from 'xlsx';

function NavMobile() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeButton, setActiveButton] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [eventsData, setEventsData] = useState([]);
    const searchContainerRef = useRef(null);

    // Load sample data (replace with XLSX loading if needed)
    useEffect(() => {
        // Uncomment to load from XLSX (place file in public folder)
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
        ).slice(0, 5);

        setSearchResults(results);
    }, [searchQuery, eventsData]);

    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsVisible(false);
                setActiveButton(null);
                setSearchQuery('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchClick = () => {
        const newState = !isVisible;
        setIsVisible(newState);
        setActiveButton(newState ? 'search' : null);
        if (!newState) setSearchQuery('');
    };

    const handleMenuClick = () => {
        setActiveButton(prev => prev === 'menu' ? null : 'menu');
        // Add your menu functionality here
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchResults.length > 0) {
            window.location.href = searchResults[0].link;
        }
    };

    return (
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

            <div 
                className={`search-container-mobile ${isVisible ? 'visible' : ''}`} 
                ref={searchContainerRef}
            >
                <form onSubmit={handleSearchSubmit}>
                    <input 
                        type="text" 
                        placeholder="Search events..." 
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
                
                {searchQuery && (
                    <div className="result-box">
                        {searchResults.length > 0 ? (
                            searchResults.map((result, index) => (
                                <a 
                                    key={index} 
                                    href={result.link} 
                                    className="results"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setIsVisible(false);
                                        setActiveButton(null);
                                    }}
                                >
                                    <div className="result-name">
                                        <h1>{result.name}</h1>
                                        <h2>{new Date(result.date).toLocaleDateString()}</h2>
                                    </div>
                                    <div className="result-category">
                                        <h1>{result.category}</h1>
                                    </div>
                                </a>
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
        </div>
    );
}

export default NavMobile;
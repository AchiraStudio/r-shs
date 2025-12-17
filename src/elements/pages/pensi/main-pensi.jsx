import { useEffect } from 'react';
import Landing from "./elements/landing";
import About from "./elements/about";
import Shop from "./elements/shop";
import '../css/defaults.css'
import './elements/css/landing.css'
import './elements/css/about.css'
import './elements/css/shop.css'

function Pensi() {
    useEffect(() => {
        document.title = '<Placeholder Name>';
    }, []);
    return(
        <>
            <section className="pensi" id="pensi">
                <Landing></Landing>
                <Shop></Shop>
                <About></About>
                
            </section>
        </>
    )
}

export default Pensi
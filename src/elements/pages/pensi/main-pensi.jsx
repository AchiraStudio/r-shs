import { useEffect } from 'react';
import Header from "../landing-page/Header";
import NavMobile from "../landing-page/Nav-mobile";
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
            <Header></Header>
            <NavMobile></NavMobile>
            <section className="pensi" id="pensi">
                <Landing></Landing>
                <Shop></Shop>
                <About></About>
                
            </section>
        </>
    )
}

export default Pensi
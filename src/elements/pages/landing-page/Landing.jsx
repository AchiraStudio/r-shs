import '../css/landing.css'
import { Slide1, Slide2, Slide3, Slide4, Slide5, Slide6 } from './sliders/slides.jsx'

function Landing() {
    return(
        <section className="landing" id='landing'>
            <div className="css-slider-wrapper">
                <input type="radio" name="slider" className="slide-radio1" id="slider_1" />
                <input type="radio" name="slider" className="slide-radio2" id="slider_2" />
                <input type="radio" name="slider" className="slide-radio3" id="slider_3" />
                <input type="radio" name="slider" className="slide-radio4" id="slider_4" />
                <input
                    type="radio"
                    name="slider"
                    className="slide-radio_open"
                    id="slider_open"
                    defaultChecked=""
                />
                <input type="radio" name="slider" className="slide-radio_70rp" id="slider_70rp" />
                {/* Slider Pagination */}
                <div className="slider-pagination">
                    <label htmlFor="slider_1" className="page1" />
                    <label htmlFor="slider_2" className="page2" />
                    <label htmlFor="slider_3" className="page3" />
                    <label htmlFor="slider_4" className="page4" />
                    <label htmlFor="slider_open" className="page_open" />
                    <label htmlFor="slider_70rp" className="page_70rp" />
                </div>
                {/* Slider #1 Main Slider */}
                <Slide1 />
                {/* Slider #2 Christmas Slider */}
                <Slide2 />
                {/* Slider #3 Valentine's Slider */}
                <Slide3 />
                {/* Slider #4 Easter Slider */}
                <Slide4 />
                {/* Slider #5 Open Recruit Slider */}
                <Slide5 />
                {/* Slider #6 70th RP Slider */}
                <Slide6 />
            </div>
        </section>
    )
}

export default Landing
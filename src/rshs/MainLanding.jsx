import { createContext } from "react";
import "./MainLanding.css";
import { Slide1 } from "./Components/Slides";

// Context (kept for future use)
export const SliderContext = createContext();

// Provider wrapper (if something else depends on it)
export const SliderProvider = ({ children, value }) => {
  return (
    <SliderContext.Provider value={value}>
      {children}
    </SliderContext.Provider>
  );
};

// Single Slide Component Container
const SlideContainer = ({ children, isActive }) => {
  return (
    <div className={`slide ${isActive ? "slide--active" : ""}`}>
      {children}
    </div>
  );
};

// Main Landing Component
function Landing() {
  // Static config for a single slide
  const SLIDES_CONFIG = [
    {
      id: "main",
      component: Slide1,
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      type: "main",
    },
  ];

  // Single slide only — always active
  const currentSlide = 0;
  const currentConfig = SLIDES_CONFIG[currentSlide];

  // Set static background
  document.body.style.background = currentConfig.background;
  document.body.style.transition = "background 0.8s ease";

  return (
    <SliderProvider value={{ currentSlide, slidesCount: 1 }}>
      <section className="landing" id="landing">
        <div className="slider-container">
          <div className="slider-track">
            <SlideContainer isActive={true}>
              <currentConfig.component />
            </SlideContainer>
          </div>
        </div>
      </section>
    </SliderProvider>
  );
}

export default Landing;

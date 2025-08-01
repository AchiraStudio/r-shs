import './css/defaults.css'
import Header from './landing-page/Header.jsx'
import Landing from './landing-page/Landing.jsx'
import Timeline from './landing-page/Timeline.jsx'
import About from './landing-page/About.jsx'
import CrewSection from './landing-page/Crew.jsx'
import Footer from './landing-page/Footer.jsx'
import NavMobile from './landing-page/Nav-mobile.jsx'

function Main() {
  return (
    <>
      <NavMobile></NavMobile>
      <Header />
      <Landing />
      <Timeline />
      <About />
      <CrewSection />
      <Footer />
    </>
  )
}

export default Main
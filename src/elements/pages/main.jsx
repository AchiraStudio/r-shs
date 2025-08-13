import './css/defaults.css'
import { Suspense, lazy } from 'react'
import NavMobile from './landing-page/Nav-mobile.jsx'
import Header from './landing-page/Header.jsx'
import Landing from './landing-page/Landing.jsx'

// Lazy load heavy sections
const Timeline = lazy(() => import('./landing-page/Timeline.jsx'))
const About = lazy(() => import('./landing-page/About.jsx'))
const CrewSection = lazy(() => import('./landing-page/Crew.jsx'))
const Footer = lazy(() => import('./landing-page/Footer.jsx'))

function Main() {
  return (
    <>
      <NavMobile />
      <Header />
      <Landing />

      <Suspense fallback={<div>Loading...</div>}>
        <Timeline />
        <About />
        <CrewSection />
        <Footer />
      </Suspense>
    </>
  )
}

export default Main

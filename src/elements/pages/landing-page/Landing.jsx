import { useEffect, useRef } from 'react'
import '../css/landing.css'
import { Slide1, Slide2, Slide3, Slide4, Slide5, Slide6 } from './sliders/slides.jsx'

function Landing() {
  const sliderRef = useRef(null)

  useEffect(() => {
    const el = sliderRef.current
    if (!el) return

    const radios = () => Array.from(el.querySelectorAll('input[name="slider"]'))
    const currentIndex = () => radios().findIndex(r => r.checked)

    const goToIndex = (i) => {
      const r = radios()
      if (!r.length) return
      const wrap = true
      let next = i
      if (wrap) next = (i + r.length) % r.length
      else next = Math.min(Math.max(i, 0), r.length - 1)
      r[next].checked = true
      updateBackground()
    }

    const goNext = () => goToIndex(currentIndex() + 1)
    const goPrev = () => goToIndex(currentIndex() - 1)

    const threshold = 50
    let startX = 0
    let lastX = 0
    let isDragging = false

    // ----- Swipe / Drag -----
    const onPointerDown = (e) => {
      isDragging = true
      startX = lastX = e.clientX
      el.classList.add('dragging')
    }
    const onPointerMove = (e) => {
      if (!isDragging) return
      lastX = e.clientX
    }
    const onPointerUp = () => {
      if (!isDragging) return
      isDragging = false
      el.classList.remove('dragging')
      const diff = lastX - startX
      if (Math.abs(diff) >= threshold) diff < 0 ? goNext() : goPrev()
      startX = lastX = 0
    }

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX
      lastX = startX
    }
    const onTouchMove = (e) => {
      lastX = e.touches[0].clientX
    }
    const onTouchEnd = () => {
      const diff = lastX - startX
      if (Math.abs(diff) >= threshold) diff < 0 ? goNext() : goPrev()
      startX = lastX = 0
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove, { passive: true })
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointerleave', onPointerUp)

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onTouchEnd)

    // ✅ Gradient Background Handling
    const colors = {
      slider_1: 'linear-gradient(135deg, #001a2c 0%, #003a5b 100%)',
      slider_2: 'linear-gradient(135deg, #0a0e27 0%, #0a0e27 100%)',
      slider_3: 'pink',
      slider_4: 'linear-gradient(135deg, #ffcce6, #ccf2ff)',
      slider_open: 'linear-gradient(135deg, #1a3a8f, #0c2461)',
      slider_70rp: 'linear-gradient(135deg, #42275a 0%, #734b6d 100%)',
    }

    const updateBackground = () => {
      const checked = radios().find(r => r.checked)
      if (checked) {
        const bg = colors[checked.id] || 'linear-gradient(135deg, #001a2c 0%, #003a5b 100%)'
        document.body.style.background = bg
        document.body.style.transition = 'background 0.8s ease'
      }
    }

    // React to manual radio clicks
    radios().forEach(radio => {
      radio.addEventListener('change', updateBackground)
    })

    updateBackground()

    return () => {
      radios().forEach(radio => {
        radio.removeEventListener('change', updateBackground)
      })
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointerleave', onPointerUp)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return (
    <section className="landing" id="landing">
      <div className="css-slider-wrapper" ref={sliderRef}>
        <input type="radio" name="slider" id="slider_1" className="slide-radio1" defaultChecked/>
        <input type="radio" name="slider" id="slider_2" className="slide-radio2" />
        <input type="radio" name="slider" id="slider_3" className="slide-radio3" />
        <input type="radio" name="slider" id="slider_4" className="slide-radio4" />
        <input type="radio" name="slider" id="slider_open" className="slide-radio_open"/>
        <input type="radio" name="slider" id="slider_70rp" className="slide-radio_70rp" />

        <div className="slider-pagination">
          <label htmlFor="slider_1" className="page1" />
          <label htmlFor="slider_2" className="page2" />
          <label htmlFor="slider_3" className="page3" />
          <label htmlFor="slider_4" className="page4" />
          <label htmlFor="slider_open" className="page_open" />
          <label htmlFor="slider_70rp" className="page_70rp" />
        </div>

        <Slide1 />
        <Slide2 />
        <Slide3 />
        <Slide4 />
        <Slide5 />
        <Slide6 />
      </div>
    </section>
  )
}

export default Landing

// Immediately run a check to ensure content is visible
(function() {
  // Function to make elements visible
  const makeElementsVisible = () => {
    // Critical elements that should always be visible
    const criticalElements = document.querySelectorAll('.slide-content, .liquid-background, .particles-container');
    criticalElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    
    // Elements to animate
    const animatedElements = document.querySelectorAll(
      '.glass-morphism, .slide-title, .slide-subtitle, .feature-item, .floating-card, .liquid-shape, .particle'
    );
    
    // Make them visible with a slight delay for animation
    setTimeout(() => {
      animatedElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('visible');
        }, index * 100); // Stagger the animations
      });
    }, 100);
  };
  
  // Run immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', makeElementsVisible);
  } else {
    makeElementsVisible();
  }
  
  // Set up Intersection Observer for scroll animations
  const setupScrollAnimations = () => {
    const elementsToObserve = document.querySelectorAll(
      '.glass-morphism, .slide-title, .slide-subtitle, .feature-item, .floating-card'
    );
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    elementsToObserve.forEach(element => {
      observer.observe(element);
    });
  };
  
  // Set up scroll animations after a short delay
  setTimeout(setupScrollAnimations, 500);
  
  // Add staggered delays to feature items and floating cards
  const addStaggeredDelays = () => {
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
      item.classList.add(`delay-${(index % 5) + 1}`);
    });
    
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
      card.classList.add(`delay-${(index % 5) + 1}`);
    });
  };
  
  addStaggeredDelays();
})();
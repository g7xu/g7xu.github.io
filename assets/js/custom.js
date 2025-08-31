// Custom JavaScript for enhanced interactivity
document.addEventListener('DOMContentLoaded', function() {
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Enhanced project item interactions - be more careful
  const projectItems = document.querySelectorAll('.project-item, .research-item');
  
  projectItems.forEach(item => {
    // Only add hover effects, don't change visibility
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.transition = 'transform 0.3s ease';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Add loading animations with Intersection Observer - only for visibility
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Only add a subtle animation class, don't change display
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all project and research items
  projectItems.forEach(item => {
    // Set initial state for animation
    item.style.opacity = '0.8';
    item.style.transform = 'translateY(10px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });

  // Don't interfere with existing news toggle functionality
  // Let the existing JavaScript handle it

  // Add typing effect to page titles (optional) - only on homepage
  const pageTitle = document.querySelector('h1');
  if (pageTitle && pageTitle.textContent.length > 0 && 
      (window.location.pathname === '/' || window.location.pathname === '/index.html')) {
    
    // Only add typing effect if it's the main page title
    if (pageTitle.textContent.includes('About me') || pageTitle.textContent.includes('Home')) {
      const originalText = pageTitle.textContent;
      pageTitle.textContent = '';
      pageTitle.style.borderRight = '2px solid #007acc';
      
      let i = 0;
      const typeWriter = () => {
        if (i < originalText.length) {
          pageTitle.textContent += originalText.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
        } else {
          pageTitle.style.borderRight = 'none';
        }
      };
      
      typeWriter();
    }
  }
});

// Epic CV Portfolio JavaScript
// Advanced animations and interactions

document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  });

  // Epic Typewriter Effect
  initTypewriter();
  
  // Counter Animation
  initCounters();
  
  // Particle System
  initParticles();
  
  // Smooth Scrolling
  initSmoothScroll();
  
  // Interactive Elements
  initInteractiveElements();
  
  // Scroll Animations
  initScrollAnimations();
  
  // Skill Bars Animation
  initSkillBars();
  
  // Timeline Animation
  initTimelineAnimation();
});

// Epic Typewriter Effect
function initTypewriter() {
  const typewriterText = "Hard-working, conscientious, committed and pragmatic";
  const typewriterElement = document.getElementById('typewriter-text');
  
  if (typewriterElement) {
    let i = 0;
    const typeSpeed = 80; // milliseconds per character
    
    function typeWriter() {
      if (i < typewriterText.length) {
        typewriterElement.textContent += typewriterText.charAt(i);
        i++;
        setTimeout(typeWriter, typeSpeed);
      }
    }
    
    // Start typewriter effect after a delay
    setTimeout(typeWriter, 1500);
  }
}

// Counter Animation
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    updateCounter();
  };
  
  // Intersection Observer for counters
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  });
  
  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

// Particle System
function initParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;
  
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    createParticle(particlesContainer);
  }
}

function createParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  // Random properties
  const size = Math.random() * 4 + 1;
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  const duration = Math.random() * 20 + 10;
  const delay = Math.random() * 5;
  
  particle.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background: rgba(102, 126, 234, 0.6);
    border-radius: 50%;
    left: ${x}px;
    top: ${y}px;
    animation: float-particle ${duration}s ${delay}s infinite linear;
    pointer-events: none;
  `;
  
  container.appendChild(particle);
  
  // Remove particle after animation
  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
    }
  }, (duration + delay) * 1000);
  
  // Create new particle
  setTimeout(() => {
    createParticle(container);
  }, Math.random() * 3000 + 1000);
}

// Add particle animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes float-particle {
    0% {
      transform: translateY(0px) translateX(0px);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) translateX(50px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Smooth Scrolling
function initSmoothScroll() {
  const links = document.querySelectorAll('a.smooth-scroll');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Interactive Elements
function initInteractiveElements() {
  // Profile image hover effect
  const profileImage = document.querySelector('.profile-image');
  if (profileImage) {
    profileImage.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
    });
    
    profileImage.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  }
  
  // Button ripple effects
  const buttons = document.querySelectorAll('.btn-hero');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = this.querySelector('.btn-ripple');
      if (ripple) {
        ripple.style.width = '300px';
        ripple.style.height = '300px';
        
        setTimeout(() => {
          ripple.style.width = '0';
          ripple.style.height = '0';
        }, 600);
      }
    });
  });
  
  // Social links animation
  const socialLinks = document.querySelectorAll('.social-link');
  socialLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px) scale(1.1)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// Scroll Animations
function initScrollAnimations() {
  // Parallax effect for hero background
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-shapes, .particles');
    
    parallaxElements.forEach(element => {
      const speed = 0.5;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
  
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    });
  }
  
  // Reveal animations
  const revealElements = document.querySelectorAll('.timeline-item, .experience-card');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('loaded');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(element => {
    element.classList.add('loading');
    revealObserver.observe(element);
  });
}

// Advanced hover effects for experience cards
document.addEventListener('DOMContentLoaded', function() {
  const experienceCards = document.querySelectorAll('.experience-card');
  
  experienceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
      this.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
    });
  });
});

// Dynamic typing effect for different texts
function createTypingEffect(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Add loading animation
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
  
  // Animate hero elements
  const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-actions');
  heroElements.forEach((element, index) => {
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 200);
  });
});

// Add epic cursor effect
document.addEventListener('mousemove', function(e) {
  const cursor = document.querySelector('.epic-cursor');
  if (cursor) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  }
});

// Create epic cursor element
const epicCursor = document.createElement('div');
epicCursor.className = 'epic-cursor';
epicCursor.style.cssText = `
  position: fixed;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.1s ease;
`;
document.body.appendChild(epicCursor);

// Add cursor hover effects
const interactiveElements = document.querySelectorAll('a, button, .btn');
interactiveElements.forEach(element => {
  element.addEventListener('mouseenter', function() {
    epicCursor.style.transform = 'scale(2)';
    epicCursor.style.background = 'radial-gradient(circle, rgba(102, 126, 234, 1) 0%, transparent 70%)';
  });
  
  element.addEventListener('mouseleave', function() {
    epicCursor.style.transform = 'scale(1)';
    epicCursor.style.background = 'radial-gradient(circle, rgba(102, 126, 234, 0.8) 0%, transparent 70%)';
  });
});

// Performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Skill Bars Animation
function initSkillBars() {
  const skillItems = document.querySelectorAll('.skill-item');
  
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillItem = entry.target;
        const skillProgress = skillItem.querySelector('.skill-progress');
        const width = skillProgress.getAttribute('data-width');
        
        // Add animation class
        skillItem.classList.add('in-view');
        
        // Set CSS custom property for animation
        skillProgress.style.setProperty('--skill-width', width + '%');
        
        // Animate the progress bar
        setTimeout(() => {
          skillProgress.style.width = width + '%';
        }, 200);
        
        skillObserver.unobserve(skillItem);
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  });
  
  skillItems.forEach(item => {
    skillObserver.observe(item);
  });
}

// Timeline Animation
function initTimelineAnimation() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add delay for staggered animation
        setTimeout(() => {
          entry.target.classList.add('animate');
        }, index * 200);
        
        timelineObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });
  
  timelineItems.forEach(item => {
    timelineObserver.observe(item);
  });
  
  // Add hover effects for timeline cards
  const epicCards = document.querySelectorAll('.epic-card');
  epicCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-15px) scale(1.02)';
      this.style.boxShadow = '0 25px 50px rgba(102, 126, 234, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
    });
  });
  
  // Add click effects for tech tags
  const techTags = document.querySelectorAll('.tech-tag');
  techTags.forEach(tag => {
    tag.addEventListener('click', function() {
      this.style.transform = 'translateY(-2px) scale(1.05)';
      setTimeout(() => {
        this.style.transform = 'translateY(-2px) scale(1)';
      }, 150);
    });
  });
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
  // Scroll-based animations here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Portfolio Lightbox and Filtering
function initPortfolioLightbox() {
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDescription = document.getElementById('lightboxDescription');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  
  if (!lightboxModal) {
    console.log('Lightbox modal not found');
    return;
  }
  
  console.log('Lightbox elements found:', {
    modal: !!lightboxModal,
    image: !!lightboxImage,
    title: !!lightboxTitle,
    description: !!lightboxDescription,
    close: !!lightboxClose,
    prev: !!lightboxPrev,
    next: !!lightboxNext
  });
  
  let currentIndex = 0;
  let portfolioItems = [];
  
  // Get all portfolio items
  const portfolioButtons = document.querySelectorAll('.portfolio-btn');
  console.log('Found portfolio buttons:', portfolioButtons.length);
  
  portfolioItems = Array.from(portfolioButtons).map(btn => ({
    image: btn.dataset.image,
    title: btn.dataset.title,
    description: btn.dataset.description
  }));
  
  // Open lightbox
  portfolioButtons.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Portfolio button clicked:', index);
      currentIndex = index;
      openLightbox(index);
    });
  });
  
  // Backup: Add click listeners directly to portfolio cards
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  portfolioCards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      // Only trigger if clicking on the card itself, not on buttons
      if (e.target === card || e.target.closest('.portfolio-image')) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Portfolio card clicked:', index);
        currentIndex = index;
        openLightbox(index);
      }
    });
  });
  
  // Close lightbox
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-overlay')) {
        closeLightbox();
      }
    });
  }
  
  // Navigation
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + portfolioItems.length) % portfolioItems.length;
      openLightbox(currentIndex);
    });
  }
  
  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % portfolioItems.length;
      openLightbox(currentIndex);
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    
    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        if (lightboxPrev) lightboxPrev.click();
        break;
      case 'ArrowRight':
        if (lightboxNext) lightboxNext.click();
        break;
    }
  });
  
  function openLightbox(index) {
    console.log('Opening lightbox for index:', index);
    const item = portfolioItems[index];
    if (!item) {
      console.log('No item found for index:', index);
      return;
    }
    
    console.log('Setting lightbox content:', item);
    console.log('Image path:', item.image);
    
    // Set image source and add load event listener
    lightboxImage.src = item.image;
    lightboxImage.alt = item.title;
    
    // Add load event listener to check if image loads
    lightboxImage.onload = function() {
      console.log('Image loaded successfully:', item.image);
    };
    
    lightboxImage.onerror = function() {
      console.error('Image failed to load:', item.image);
    };
    
    lightboxTitle.textContent = item.title;
    lightboxDescription.textContent = item.description;
    
    console.log('Adding active class to modal');
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('Modal classes:', lightboxModal.className);
    console.log('Modal display style:', window.getComputedStyle(lightboxModal).display);
    console.log('Image element:', lightboxImage);
    console.log('Image src:', lightboxImage.src);
  }
  
  function closeLightbox() {
    console.log('Closing lightbox');
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Portfolio Filtering
function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const portfolioGrid = document.querySelector('.portfolio-grid');
  
  console.log('Found filter buttons:', filterButtons.length);
  console.log('Found portfolio items:', portfolioItems.length);
  
  function updateGridSize() {
    const visibleItems = document.querySelectorAll('.portfolio-item:not(.hidden)');
    const count = visibleItems.length;
    
    // Remove all size classes
    portfolioGrid.classList.remove('few-items-1', 'few-items-2', 'few-items-3');
    
    // Add appropriate class based on visible item count
    if (count <= 1) {
      portfolioGrid.classList.add('few-items-1');
    } else if (count <= 2) {
      portfolioGrid.classList.add('few-items-2');
    } else if (count <= 3) {
      portfolioGrid.classList.add('few-items-3');
    }
  }
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      console.log('Filtering by:', filter);
      
      portfolioItems.forEach((item, index) => {
        const category = item.dataset.category;
        console.log(`Item ${index}: category=${category}, filter=${filter}`);
        
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          item.style.display = 'block';
          // Trigger AOS animation
          item.setAttribute('data-aos', 'fade-up');
        } else {
          item.classList.add('hidden');
          item.style.display = 'none';
        }
      });
      
      // Update grid size based on visible items
      updateGridSize();
      
      // Reinitialize AOS for visible items
      setTimeout(() => {
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      }, 300);
    });
  });
  
  // Initial grid size update
  updateGridSize();
}

// Initialize portfolio functions when DOM is ready
function initPortfolio() {
  console.log('Initializing portfolio...');
  
  // Wait for all elements to be available
  const checkElements = () => {
    const modal = document.getElementById('lightboxModal');
    const buttons = document.querySelectorAll('.portfolio-btn');
    const filters = document.querySelectorAll('.filter-btn');
    
    if (modal && buttons.length > 0 && filters.length > 0) {
      console.log('All portfolio elements found, initializing...');
      initPortfolioLightbox();
      initPortfolioFilters();
    } else {
      console.log('Waiting for portfolio elements...', {
        modal: !!modal,
        buttons: buttons.length,
        filters: filters.length
      });
      setTimeout(checkElements, 100);
    }
  };
  
  checkElements();
}

// Call when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
  initPortfolio();
}

// Debug function to test portfolio
window.testPortfolio = function() {
  console.log('Testing portfolio...');
  const buttons = document.querySelectorAll('.portfolio-btn');
  const filters = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  const modal = document.getElementById('lightboxModal');
  
  console.log('Portfolio buttons:', buttons.length);
  console.log('Filter buttons:', filters.length);
  console.log('Portfolio items:', items.length);
  console.log('Lightbox modal:', modal ? 'Found' : 'Not found');
  
  return {
    buttons: buttons.length,
    filters: filters.length,
    items: items.length,
    modal: modal ? 'Found' : 'Not found'
  };
};

// Test function to manually open lightbox
window.testLightbox = function(index = 0) {
  console.log('Testing lightbox manually...');
  const modal = document.getElementById('lightboxModal');
  const image = document.getElementById('lightboxImage');
  const title = document.getElementById('lightboxTitle');
  const description = document.getElementById('lightboxDescription');
  
  if (modal && image && title && description) {
    image.src = 'portfolio/CCNA-RoutingSwitchingConnectingNetworks.jpg';
    image.alt = 'Test Image';
    title.textContent = 'Test Title';
    description.textContent = 'Test Description';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('Lightbox should be visible now');
    console.log('Modal classes:', modal.className);
    console.log('Modal display style:', window.getComputedStyle(modal).display);
    console.log('Image src:', image.src);
    console.log('Image naturalWidth:', image.naturalWidth);
    console.log('Image naturalHeight:', image.naturalHeight);
  } else {
    console.log('Missing lightbox elements:', {
      modal: !!modal,
      image: !!image,
      title: !!title,
      description: !!description
    });
  }
};

// Simple test to check if lightbox elements exist
window.checkLightbox = function() {
  const modal = document.getElementById('lightboxModal');
  const image = document.getElementById('lightboxImage');
  const buttons = document.querySelectorAll('.portfolio-btn');
  
  console.log('Lightbox check:', {
    modal: modal ? 'Found' : 'Missing',
    image: image ? 'Found' : 'Missing',
    buttons: buttons.length,
    modalHTML: modal ? modal.outerHTML.substring(0, 200) + '...' : 'No modal'
  });
  
  return {
    modal: !!modal,
    image: !!image,
    buttons: buttons.length
  };
};

// Force initialize portfolio on page load
window.addEventListener('load', function() {
  console.log('Page fully loaded, force initializing portfolio...');
  setTimeout(() => {
    initPortfolio();
  }, 500);
});

// Simple direct lightbox function as fallback
window.openLightboxDirect = function(imageSrc, title, description) {
  console.log('Opening lightbox directly with:', imageSrc);
  const modal = document.getElementById('lightboxModal');
  const image = document.getElementById('lightboxImage');
  const titleEl = document.getElementById('lightboxTitle');
  const descEl = document.getElementById('lightboxDescription');
  
  if (modal && image && titleEl && descEl) {
    // Force image to be visible
    image.style.display = 'block';
    image.style.visibility = 'visible';
    image.style.opacity = '1';
    image.style.width = 'auto';
    image.style.height = 'auto';
    
    image.src = imageSrc;
    image.alt = title;
    titleEl.textContent = title;
    descEl.textContent = description;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('Direct lightbox opened');
    console.log('Image src set to:', image.src);
    console.log('Image dimensions:', image.naturalWidth, 'x', image.naturalHeight);
  } else {
    console.log('Missing elements for direct lightbox');
  }
};

// SUPER SIMPLE TEST - just show an image
window.testImage = function() {
  console.log('Testing image display...');
  const modal = document.getElementById('lightboxModal');
  const image = document.getElementById('lightboxImage');
  
  if (modal && image) {
    // Set a simple test image
    image.src = 'https://via.placeholder.com/400x300/ff0000/ffffff?text=TEST+IMAGE';
    image.alt = 'Test Image';
    image.style.display = 'block';
    image.style.visibility = 'visible';
    image.style.opacity = '1';
    image.style.width = '400px';
    image.style.height = '300px';
    image.style.border = '2px solid red';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('Test image should be visible now');
  } else {
    console.log('Modal or image not found');
  }
};

// SIMPLE FIX: Add direct click listeners to all portfolio buttons
document.addEventListener('DOMContentLoaded', function() {
  console.log('Adding direct click listeners...');
  
  // Wait a bit for all elements to load
  setTimeout(() => {
    const buttons = document.querySelectorAll('.portfolio-btn');
    console.log('Found buttons:', buttons.length);
    
    buttons.forEach((button, index) => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const imageSrc = button.dataset.image;
        const title = button.dataset.title;
        const description = button.dataset.description;
        
        console.log('Button clicked:', { imageSrc, title, description });
        
        // Open lightbox directly
        openLightboxDirect(imageSrc, title, description);
      });
    });
    
    // Also add click listeners to portfolio cards
    const cards = document.querySelectorAll('.portfolio-card');
    cards.forEach((card, index) => {
      card.addEventListener('click', function(e) {
        if (e.target.closest('.portfolio-btn')) return; // Don't double-trigger
        
        const button = card.querySelector('.portfolio-btn');
        if (button) {
          const imageSrc = button.dataset.image;
          const title = button.dataset.title;
          const description = button.dataset.description;
          
          console.log('Card clicked:', { imageSrc, title, description });
          openLightboxDirect(imageSrc, title, description);
        }
      });
    });
    
    console.log('Direct listeners added!');
  }, 1000);
});

// RELIABLE LIGHTBOX FUNCTION - This will definitely work
function initReliableLightbox() {
  console.log('Initializing reliable lightbox...');
  
  // Get all portfolio buttons
  const portfolioButtons = document.querySelectorAll('.portfolio-btn');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDescription = document.getElementById('lightboxDescription');
  const lightboxClose = document.getElementById('lightboxClose');
  
  if (!lightboxModal || !lightboxImage || !lightboxTitle || !lightboxDescription || !lightboxClose) {
    console.error('Lightbox elements not found!');
    return;
  }
  
  console.log('Found', portfolioButtons.length, 'portfolio buttons');
  
  // Add click listeners to all portfolio buttons
  portfolioButtons.forEach((button, index) => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const imageSrc = button.dataset.image;
      const title = button.dataset.title;
      const description = button.dataset.description;
      
      console.log('Opening lightbox for:', title);
      
      // Set the content
      lightboxImage.src = imageSrc;
      lightboxImage.alt = title;
      lightboxTitle.textContent = title;
      lightboxDescription.textContent = description;
      
      // Show the modal
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      console.log('Lightbox should be visible now');
    });
  });
  
  // Close lightbox when clicking close button
  lightboxClose.addEventListener('click', function() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // Close lightbox when clicking overlay
  lightboxModal.addEventListener('click', function(e) {
    if (e.target === lightboxModal || e.target.classList.contains('lightbox-overlay')) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Close lightbox with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  console.log('Reliable lightbox initialized successfully!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReliableLightbox);
} else {
  initReliableLightbox();
}

// Also initialize after a delay to ensure everything is loaded
setTimeout(initReliableLightbox, 2000);

// DEBUG FUNCTION - Test the lightbox manually
window.testLightboxNow = function() {
  console.log('Testing lightbox manually...');
  const modal = document.getElementById('lightboxModal');
  const image = document.getElementById('lightboxImage');
  const title = document.getElementById('lightboxTitle');
  const description = document.getElementById('lightboxDescription');
  
  if (modal && image && title && description) {
    // Use the first portfolio image as test
    image.src = 'portfolio/CCNA-RoutingSwitchingConnectingNetworks.jpg';
    image.alt = 'CCNA Connecting Networks';
    title.textContent = 'CCNA Connecting Networks';
    description.textContent = 'Cisco Certified Network Associate - Connecting Networks certification';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('Test lightbox opened! Modal classes:', modal.className);
    console.log('Image src:', image.src);
    return true;
  } else {
    console.log('Missing elements:', {
      modal: !!modal,
      image: !!image,
      title: !!title,
      description: !!description
    });
    return false;
  }
};

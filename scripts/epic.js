// Epic CV Portfolio JavaScript
// Advanced animations and interactions

// Language Translation System
const translations = {
  en: {
    // Navigation
    about: "About",
    experience: "Experience", 
    education: "Education",
    skills: "Skills",
    portfolio: "Portfolio",
    contact: "Contact",
    
    // Hero Section
    heroTitle1: "Iago Santos",
    heroTitle2: "Pardo",
    heroSubtitle: "Senior DevOps Engineer",
    heroDescription: "Hard-working, conscientious, committed and pragmatic.",
    hireMe: "Hire Me",
    downloadCV: "Download my CV",
    scrollToExplore: "Scroll to explore",
    
    // About Section
    aboutTitle: "Professional Summary",
    aboutText: "I am an attentive and efficient professional seeking solutions to provide the best results, while constantly trying to create a conductive and positive atmosphere through an optimistic and constructive attitude. I regularly propose activities to improve the team environment and am committed to working overtime when required by the needs of the company.",
    contactInfo: "Contact Information",
    email: "Email:",
    phone: "Phone:",
    location: "Location:",
    languages: "Languages:",
    
    // Experience Section
    experienceTitle: "Professional Journey",
    experienceSubtitle: "Building the future of DevOps, one project at a time",
    
    // Education Section
    educationTitle: "🎓 Academic Journey",
    educationSubtitle: "From Engineering to Business Leadership",
    
    // Skills Section
    skillsTitle: "Technical Expertise",
    skillsSubtitle: "Mastering the tools that power modern DevOps",
    
    // Portfolio Section
    portfolioTitle: "🏆 Certifications & Achievements",
    portfolioSubtitle: "Professional certifications and technical achievements",
    all: "All",
    cisco: "Cisco",
    microsoft: "Microsoft",
    gitlab: "GitLab",
    
    // Contact Section
    contactTitle: "🚀 Let's Connect",
    contactSubtitle: "Ready to build something amazing together?",
    sendMessage: "Send me a message",
    getInTouch: "Get in Touch",
    yourName: "Your Name",
    yourEmail: "Your Email",
    subject: "Subject",
    yourMessage: "Your Message",
    send: "Send",
    
    // Footer
    allRightsReserved: "All rights reserved."
  },
  
  fr: {
    // Navigation
    about: "À propos",
    experience: "Expérience",
    education: "Formation",
    skills: "Compétences",
    portfolio: "Portfolio",
    contact: "Contact",
    
    // Hero Section
    heroTitle1: "Iago Santos",
    heroTitle2: "Pardo",
    heroSubtitle: "Ingénieur DevOps Senior",
    heroDescription: "Travailleur, consciencieux, engagé et pragmatique.",
    hireMe: "Engagez-moi",
    downloadCV: "Télécharger mon CV",
    scrollToExplore: "Faites défiler pour explorer",
    
    // About Section
    aboutTitle: "Résumé Professionnel",
    aboutText: "Je suis un professionnel attentif et efficace qui cherche des solutions pour fournir les meilleurs résultats, tout en essayant constamment de créer une atmosphère positive et constructive grâce à une attitude optimiste. Je propose régulièrement des activités pour améliorer l'environnement de l'équipe et je m'engage à faire des heures supplémentaires lorsque les besoins de l'entreprise l'exigent.",
    contactInfo: "Informations de Contact",
    email: "Email:",
    phone: "Téléphone:",
    location: "Localisation:",
    languages: "Langues:",
    
    // Experience Section
    experienceTitle: "Parcours Professionnel",
    experienceSubtitle: "Construire l'avenir du DevOps, un projet à la fois",
    
    // Education Section
    educationTitle: "🎓 Parcours Académique",
    educationSubtitle: "De l'Ingénierie au Leadership Commercial",
    
    // Skills Section
    skillsTitle: "Expertise Technique",
    skillsSubtitle: "Maîtriser les outils qui alimentent le DevOps moderne",
    
    // Portfolio Section
    portfolioTitle: "🏆 Certifications et Réalisations",
    portfolioSubtitle: "Certifications professionnelles et réalisations techniques",
    all: "Tout",
    cisco: "Cisco",
    microsoft: "Microsoft",
    gitlab: "GitLab",
    
    // Contact Section
    contactTitle: "🚀 Connectons-nous",
    contactSubtitle: "Prêt à construire quelque chose d'incroyable ensemble?",
    sendMessage: "Envoyez-moi un message",
    getInTouch: "Entrer en contact",
    yourName: "Votre Nom",
    yourEmail: "Votre Email",
    subject: "Sujet",
    yourMessage: "Votre Message",
    send: "Envoyer",
    
    // Footer
    allRightsReserved: "Tous droits réservés."
  },
  
  es: {
    // Navigation
    about: "Acerca de",
    experience: "Experiencia",
    education: "Educación",
    skills: "Habilidades",
    portfolio: "Portfolio",
    contact: "Contacto",
    
    // Hero Section
    heroTitle1: "Iago Santos",
    heroTitle2: "Pardo",
    heroSubtitle: "Ingeniero DevOps Senior",
    heroDescription: "Trabajador, concienzudo, comprometido y pragmático.",
    hireMe: "Contrátame",
    downloadCV: "Descargar mi CV",
    scrollToExplore: "Desplázate para explorar",
    
    // About Section
    aboutTitle: "Resumen Profesional",
    aboutText: "Soy un profesional atento y eficiente que busca soluciones para proporcionar los mejores resultados, mientras trato constantemente de crear una atmósfera positiva y constructiva a través de una actitud optimista. Propongo regularmente actividades para mejorar el ambiente del equipo y me comprometo a trabajar horas extra cuando las necesidades de la empresa lo requieran.",
    contactInfo: "Información de Contacto",
    email: "Email:",
    phone: "Teléfono:",
    location: "Ubicación:",
    languages: "Idiomas:",
    
    // Experience Section
    experienceTitle: "Trayectoria Profesional",
    experienceSubtitle: "Construyendo el futuro del DevOps, un proyecto a la vez",
    
    // Education Section
    educationTitle: "🎓 Trayectoria Académica",
    educationSubtitle: "De la Ingeniería al Liderazgo Empresarial",
    
    // Skills Section
    skillsTitle: "Experiencia Técnica",
    skillsSubtitle: "Dominando las herramientas que impulsan el DevOps moderno",
    
    // Portfolio Section
    portfolioTitle: "🏆 Certificaciones y Logros",
    portfolioSubtitle: "Certificaciones profesionales y logros técnicos",
    all: "Todo",
    cisco: "Cisco",
    microsoft: "Microsoft",
    gitlab: "GitLab",
    
    // Contact Section
    contactTitle: "🚀 Conectemos",
    contactSubtitle: "¿Listo para construir algo increíble juntos?",
    sendMessage: "Envíame un mensaje",
    getInTouch: "Ponte en contacto",
    yourName: "Tu Nombre",
    yourEmail: "Tu Email",
    subject: "Asunto",
    yourMessage: "Tu Mensaje",
    send: "Enviar",
    
    // Footer
    allRightsReserved: "Todos los derechos reservados."
  },
  
  gl: {
    // Navigation
    about: "Acerca de",
    experience: "Experiencia",
    education: "Educación",
    skills: "Habilidades",
    portfolio: "Portfolio",
    contact: "Contacto",
    
    // Hero Section
    heroTitle1: "Iago Santos",
    heroTitle2: "Pardo",
    heroSubtitle: "Enxeñeiro DevOps Senior",
    heroDescription: "Traballador, concienzudo, comprometido e pragmático.",
    hireMe: "Contrátame",
    downloadCV: "Descargar o meu CV",
    scrollToExplore: "Desprazate para explorar",
    
    // About Section
    aboutTitle: "Resumo Profesional",
    aboutText: "Son un profesional atento e eficiente que busca solucións para proporcionar os mellores resultados, mentres trato constantemente de crear unha atmosfera positiva e construtiva a través dunha actitude optimista. Propoño regularmente actividades para mellorar o ambiente do equipo e comprométome a traballar horas extra cando as necesidades da empresa o requiran.",
    contactInfo: "Información de Contacto",
    email: "Email:",
    phone: "Teléfono:",
    location: "Ubicación:",
    languages: "Idiomas:",
    
    // Experience Section
    experienceTitle: "Traxectoria Profesional",
    experienceSubtitle: "Construíndo o futuro do DevOps, un proxecto á vez",
    
    // Education Section
    educationTitle: "🎓 Traxectoria Académica",
    educationSubtitle: "Da Enxeñería ao Liderado Empresarial",
    
    // Skills Section
    skillsTitle: "Experiencia Técnica",
    skillsSubtitle: "Dominando as ferramentas que impulsan o DevOps moderno",
    
    // Portfolio Section
    portfolioTitle: "🏆 Certificacións e Logros",
    portfolioSubtitle: "Certificacións profesionais e logros técnicos",
    all: "Todo",
    cisco: "Cisco",
    microsoft: "Microsoft",
    gitlab: "GitLab",
    
    // Contact Section
    contactTitle: "🚀 Conectemos",
    contactSubtitle: "¿Listo para construír algo incrible xuntos?",
    sendMessage: "Envíame unha mensaxe",
    getInTouch: "Ponte en contacto",
    yourName: "O teu Nome",
    yourEmail: "O teu Email",
    subject: "Asunto",
    yourMessage: "A túa Mensaxe",
    send: "Enviar",
    
    // Footer
    allRightsReserved: "Todos os dereitos reservados."
  }
};

// Current language
let currentLanguage = 'en';

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
  
  // Language Selector
  initLanguageSelector();
  
  // Force language selector initialization after a delay
  setTimeout(() => {
    initLanguageSelector();
  }, 1000);
  
  // URL Routing
  initURLRouting();
  
  // Scroll Animations
  initScrollAnimations();
  
  // Skill Bars Animation
  initSkillBars();
  
  // Timeline Animation
  initTimelineAnimation();
});

// Epic Typewriter Effect
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter-text');
  
  if (typewriterElement) {
    // Get the text from the translation system
    const typewriterText = typewriterElement.textContent || typewriterElement.getAttribute('data-translate');
    
    if (typewriterText) {
      // Clear the element first
      typewriterElement.textContent = '';
      
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
        const offsetTop = targetElement.offsetTop - 100; // Account for fixed header (increased for better visibility)
        
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
  // Profile image hover effect and click to zoom
  const profileImage = document.querySelector('.profile-image');
  if (profileImage) {
    profileImage.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
    });
    
    profileImage.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
    
    // Click to zoom functionality
    profileImage.addEventListener('click', function() {
      console.log('Profile image clicked - opening zoom...');
      const imgSrc = this.querySelector('img').src;
      const imgAlt = this.querySelector('img').alt;
      
      // Use the simple lightbox to show the profile image
      if (window.showImage) {
        window.showImage(imgSrc, imgAlt, 'Iago Santos Pardo - DevOps Engineer');
      } else {
        console.log('Simple lightbox not available');
      }
    });
    
    // Add cursor pointer to indicate it's clickable
    profileImage.style.cursor = 'pointer';
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
  
  // Navbar scroll effect - Enhanced for sticky header
  const navbar = document.querySelector('#mainNavbar');
  if (navbar) {
    // Force fixed positioning with JavaScript
    navbar.style.position = 'fixed';
    navbar.style.top = '0';
    navbar.style.left = '0';
    navbar.style.right = '0';
    navbar.style.width = '100%';
    navbar.style.zIndex = '9999';
    navbar.style.transform = 'translateZ(0)'; // Force hardware acceleration
    
    // Ensure it's always visible
    navbar.style.display = 'block';
    navbar.style.visibility = 'visible';
    
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
        navbar.classList.remove('navbar-transparent');
      } else {
        navbar.classList.remove('navbar-scrolled');
        navbar.classList.add('navbar-transparent');
      }
    });
    
    // Force navbar to stay fixed on window resize
    window.addEventListener('resize', function() {
      navbar.style.position = 'fixed';
      navbar.style.top = '0';
      navbar.style.left = '0';
      navbar.style.right = '0';
      navbar.style.width = '100%';
      navbar.style.zIndex = '9999';
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
  
  console.log('Initializing skill bars, found items:', skillItems.length);
  
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillItem = entry.target;
        const skillProgress = skillItem.querySelector('.skill-progress');
        const width = skillProgress.getAttribute('data-width');
        
        console.log('Animating skill bar:', skillItem.querySelector('.skill-name').textContent, 'Width:', width);
        
        // Add animation class
        skillItem.classList.add('in-view');
        
        // Set CSS custom property for animation
        skillProgress.style.setProperty('--skill-width', width + '%');
        
        // Animate the progress bar directly
        setTimeout(() => {
          skillProgress.style.width = width + '%';
          console.log('Set width to:', width + '%');
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
  
  // Fallback: If IntersectionObserver doesn't work, animate after a delay
  setTimeout(() => {
    skillItems.forEach(item => {
      if (!item.classList.contains('in-view')) {
        const skillProgress = item.querySelector('.skill-progress');
        const width = skillProgress.getAttribute('data-width');
        if (width) {
          console.log('Fallback animation for:', item.querySelector('.skill-name').textContent);
          item.classList.add('in-view');
          skillProgress.style.setProperty('--skill-width', width + '%');
          setTimeout(() => {
            skillProgress.style.width = width + '%';
          }, 200);
        }
      }
    });
  }, 2000);
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
  console.log('=== INITIALIZING PORTFOLIO LIGHTBOX ===');
  
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDescription = document.getElementById('lightboxDescription');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  
  console.log('Lightbox elements found:', {
    modal: !!lightboxModal,
    image: !!lightboxImage,
    title: !!lightboxTitle,
    description: !!lightboxDescription,
    close: !!lightboxClose,
    prev: !!lightboxPrev,
    next: !!lightboxNext
  });
  
  if (!lightboxModal) {
    console.error('Lightbox modal not found!');
    return;
  }
  
  
  let currentIndex = 0;
  let portfolioItems = [];
  
  // Get all portfolio items
  const portfolioButtons = document.querySelectorAll('.portfolio-btn');
  console.log('Found portfolio buttons:', portfolioButtons.length);
  
  portfolioItems = Array.from(portfolioButtons).map(btn => ({
    image: btn.getAttribute('data-image'),
    title: btn.getAttribute('data-title'),
    description: btn.getAttribute('data-description')
  }));
  
  console.log('Portfolio items:', portfolioItems);
  
  // DISABLED - Using simpleLightbox from HTML instead
  // Open lightbox
  // portfolioButtons.forEach((btn, index) => {
  //   btn.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     currentIndex = index;
  //     openLightbox(index);
  //   });
  // });
  
  // DISABLED - Using simpleLightbox from HTML instead
  // Backup: Add click listeners directly to portfolio cards
  // const portfolioCards = document.querySelectorAll('.portfolio-card');
  // portfolioCards.forEach((card, index) => {
  //   card.addEventListener('click', (e) => {
  //     // Only trigger if clicking on the card itself, not on buttons
  //     if (e.target === card || e.target.closest('.portfolio-image')) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       currentIndex = index;
  //       openLightbox(index);
  //     }
  //   });
  // });
  
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
    const item = portfolioItems[index];
    if (!item) {
      console.error('No item found at index:', index);
      return;
    }
    
    console.log('=== OPENING LIGHTBOX ===');
    console.log('Item:', item);
    
    // Set image source
    lightboxImage.src = item.image;
    lightboxImage.alt = item.title;
    
    // Set title and description
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxDescription) lightboxDescription.textContent = item.description;
    
    // Show modal using inline styles
    lightboxModal.style.display = 'flex';
    lightboxModal.style.opacity = '1';
    lightboxModal.style.visibility = 'visible';
    lightboxModal.style.zIndex = '9999';
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('Modal should be visible now');
    console.log('Modal styles:', {
      display: lightboxModal.style.display,
      opacity: lightboxModal.style.opacity,
      visibility: lightboxModal.style.visibility,
      zIndex: lightboxModal.style.zIndex
    });
  }
  
  function closeLightbox() {
    console.log('=== CLOSING LIGHTBOX ===');
    lightboxModal.style.display = 'none';
    lightboxModal.style.opacity = '0';
    lightboxModal.style.visibility = 'hidden';
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
    console.log('Modal closed');
  }
  
  console.log('Portfolio lightbox initialized successfully!');
}

// Portfolio Filtering
function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const portfolioGrid = document.querySelector('.portfolio-grid');
  
  
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
      
      portfolioItems.forEach((item, index) => {
        const category = item.dataset.category;
        
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
  
  // Wait for all elements to be available
  const checkElements = () => {
    const modal = document.getElementById('lightboxModal');
    const buttons = document.querySelectorAll('.portfolio-btn');
    const filters = document.querySelectorAll('.filter-btn');
    
    if (modal && buttons.length > 0 && filters.length > 0) {
      // initPortfolioLightbox(); // DISABLED - Using simpleLightbox from HTML instead
      initPortfolioFilters();
    } else {
      console.log({
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
  const buttons = document.querySelectorAll('.portfolio-btn');
  const filters = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  const modal = document.getElementById('lightboxModal');
  
  
  return {
    buttons: buttons.length,
    filters: filters.length,
    items: items.length,
    modal: modal ? 'Found' : 'Not found'
  };
};

// Test function to manually open lightbox
window.testLightbox = function(index = 0) {
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
    
  } else {
    console.log({
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
  
  console.log({
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
  setTimeout(() => {
    initPortfolio();
  }, 500);
});

// Simple direct lightbox function as fallback
window.openLightboxDirect = function(imageSrc, title, description) {
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
    
  } else {
  }
};

// SUPER SIMPLE TEST - just show an image
window.testImage = function() {
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
    
  } else {
  }
};

// DISABLED - Using simpleLightbox from HTML instead
// SIMPLE FIX: Add direct click listeners to all portfolio buttons
// document.addEventListener('DOMContentLoaded', function() {
//   
//   // Wait a bit for all elements to load
//   setTimeout(() => {
//     const buttons = document.querySelectorAll('.portfolio-btn');
//     
//     buttons.forEach((button, index) => {
//       button.addEventListener('click', function(e) {
//         e.preventDefault();
//         e.stopPropagation();
//         
//         const imageSrc = button.dataset.image;
//         const title = button.dataset.title;
//         const description = button.dataset.description;
//         
//         
//         // Open lightbox directly
//         openLightboxDirect(imageSrc, title, description);
//       });
//     });
    
    // DISABLED - Using simpleLightbox from HTML instead
    // Also add click listeners to portfolio cards
    // const cards = document.querySelectorAll('.portfolio-card');
    // cards.forEach((card, index) => {
    //   card.addEventListener('click', function(e) {
    //     if (e.target.closest('.portfolio-btn')) return; // Don't double-trigger
    //     
    //     const button = card.querySelector('.portfolio-btn');
    //     if (button) {
    //       const imageSrc = button.dataset.image;
    //       const title = button.dataset.title;
    //       const description = button.dataset.description;
    //       
    //       openLightboxDirect(imageSrc, title, description);
    //     }
    //   });
    // });
    
  // }, 1000);
// });

// RELIABLE LIGHTBOX FUNCTION - This will definitely work
function initReliableLightbox() {
  
  // Get all portfolio buttons
  const portfolioButtons = document.querySelectorAll('.portfolio-btn');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDescription = document.getElementById('lightboxDescription');
  const lightboxClose = document.getElementById('lightboxClose');
  
  if (!lightboxModal || !lightboxImage || !lightboxTitle || !lightboxDescription || !lightboxClose) {
    return;
  }
  
  
  // Add click listeners to all portfolio buttons
  portfolioButtons.forEach((button, index) => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const imageSrc = button.dataset.image;
      const title = button.dataset.title;
      const description = button.dataset.description;
      
      
      // Set the content
      lightboxImage.src = imageSrc;
      lightboxImage.alt = title;
      lightboxTitle.textContent = title;
      lightboxDescription.textContent = description;
      
      // Show the modal
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
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
  
}

// DISABLED - Using simpleLightbox from HTML instead
// Initialize when DOM is ready
// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', initReliableLightbox);
// } else {
//   initReliableLightbox();
// }

// Also initialize after a delay to ensure everything is loaded
// setTimeout(initReliableLightbox, 2000);

// Debug function for language selector
window.debugLanguageSelector = function() {
  const languageBtn = document.getElementById("languageBtn");
  const languageDropdown = document.getElementById("languageDropdown");
  const languageOptions = document.querySelectorAll(".language-option");
  
  console.log("Language Selector Debug:");
  console.log("Button:", languageBtn);
  console.log("Dropdown:", languageDropdown);
  console.log("Options:", languageOptions.length);
  
  if (languageBtn) {
    console.log("Button classes:", languageBtn.className);
    console.log("Button dataset:", languageBtn.dataset);
  }
  
  if (languageDropdown) {
    console.log("Dropdown classes:", languageDropdown.className);
  }
  
  return {
    button: !!languageBtn,
    dropdown: !!languageDropdown,
    options: languageOptions.length
  };
};

// Force language selector to work
window.forceLanguageSelector = function() {
  initLanguageSelector();
  console.log("Language selector forced to initialize");
};

// EMERGENCY FIX - Run immediately
(function() {
  console.log("=== EMERGENCY LANGUAGE SELECTOR FIX ===");
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initLanguageSelector, 500);
    });
  } else {
    setTimeout(initLanguageSelector, 500);
  }
  
  // Also try after 2 seconds
  setTimeout(initLanguageSelector, 2000);
  
  // And after 5 seconds as last resort
  setTimeout(initLanguageSelector, 5000);
})();

// DEBUG FUNCTION - Test the lightbox manually
window.testLightboxNow = function() {
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
    
    return true;
  } else {
    console.log({
      modal: !!modal,
      image: !!image,
      title: !!title,
      description: !!description
    });
    return false;
  }
};


// Language Selector Functions - UPDATED FOR NEW HEADER
let languageSelectorInitialized = false;
let lastLanguageClick = 0;

function initLanguageSelector() {
  if (languageSelectorInitialized) {
    console.log("Language selector already initialized, skipping...");
    return;
  }
  
  console.log("=== INITIALIZING LANGUAGE SELECTOR ===");
  
  const languageBtn = document.getElementById("languageBtn");
  const mobileLanguageBtn = document.getElementById("mobileLanguageBtn");
  
  if (!languageBtn && !mobileLanguageBtn) {
    console.error("Language buttons not found!");
    return;
  }
  
  console.log("Language buttons found:", { languageBtn, mobileLanguageBtn });
  
  // Define language cycle order
  const languageCycle = ['en', 'es', 'gl', 'fr'];
  const languageNames = {
    'en': 'English',
    'es': 'Español', 
    'gl': 'Galego',
    'fr': 'Français'
  };
  const languageFlags = {
    'en': '🇬🇧',
    'es': '🇪🇸',
    'gl': '🏴‍☠️',
    'fr': '🇫🇷'
  };
  
  // Function to update language
  function updateLanguage(newLang) {
    console.log("Updating language to:", newLang);
    
    // Update desktop button
    if (languageBtn) {
      languageBtn.dataset.current = newLang;
      const flagEmoji = languageBtn.querySelector(".flag-emoji");
      if (flagEmoji) {
        flagEmoji.textContent = languageFlags[newLang];
      }
    }
    
    // Update mobile button
    if (mobileLanguageBtn) {
      mobileLanguageBtn.dataset.current = newLang;
      const mobileFlagEmoji = mobileLanguageBtn.querySelector(".flag-emoji");
      const mobileLanguageText = mobileLanguageBtn.querySelector(".language-text");
      if (mobileFlagEmoji) {
        mobileFlagEmoji.textContent = languageFlags[newLang];
      }
      if (mobileLanguageText) {
        mobileLanguageText.textContent = languageNames[newLang];
      }
    }
    
    // Switch language
    switchLanguage(newLang);
  }
  
  // Add click listeners to both buttons
  if (languageBtn) {
    languageBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Debounce: prevent clicks too close together
      const now = Date.now();
      if (now - lastLanguageClick < 500) {
        console.log("Click too fast, ignoring...");
        return;
      }
      lastLanguageClick = now;
      
      console.log("=== DESKTOP LANGUAGE BUTTON CLICKED ===");
      
      const currentLang = languageBtn.dataset.current || 'en';
      const currentIndex = languageCycle.indexOf(currentLang);
      const nextIndex = (currentIndex + 1) % languageCycle.length;
      const nextLang = languageCycle[nextIndex];
      
      console.log("Language cycle:", languageCycle);
      console.log("Current language:", currentLang);
      console.log("Current index:", currentIndex);
      console.log("Next index:", nextIndex);
      console.log("Next language:", nextLang);
      
      updateLanguage(nextLang);
    });
  }
  
  if (mobileLanguageBtn) {
    mobileLanguageBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Debounce: prevent clicks too close together
      const now = Date.now();
      if (now - lastLanguageClick < 500) {
        console.log("Click too fast, ignoring...");
        return;
      }
      lastLanguageClick = now;
      
      console.log("=== MOBILE LANGUAGE BUTTON CLICKED ===");
      
      const currentLang = mobileLanguageBtn.dataset.current || 'en';
      const currentIndex = languageCycle.indexOf(currentLang);
      const nextIndex = (currentIndex + 1) % languageCycle.length;
      const nextLang = languageCycle[nextIndex];
      
      console.log("Language cycle:", languageCycle);
      console.log("Current language:", currentLang);
      console.log("Current index:", currentIndex);
      console.log("Next index:", nextIndex);
      console.log("Next language:", nextLang);
      
      updateLanguage(nextLang);
    });
  }
  
  // Initialize with current language
  const currentLang = languageBtn?.dataset.current || mobileLanguageBtn?.dataset.current || 'en';
  updateLanguage(currentLang);
  
  // Mark as initialized
  languageSelectorInitialized = true;
  
  console.log("Language selector initialized successfully!");
}

// Test function for language cycling
window.testLanguageCycle = function() {
  console.log("=== TESTING LANGUAGE CYCLE ===");
  const languageBtn = document.getElementById("languageBtn");
  const mobileLanguageBtn = document.getElementById("mobileLanguageBtn");
  
  if (languageBtn) {
    console.log("Desktop button current language:", languageBtn.dataset.current);
  }
  if (mobileLanguageBtn) {
    console.log("Mobile button current language:", mobileLanguageBtn.dataset.current);
  }
  
  // Test the cycle
  const languageCycle = ['en', 'es', 'gl', 'fr'];
  console.log("Language cycle:", languageCycle);
  
  // Simulate clicks
  if (languageBtn) {
    console.log("Testing desktop button clicks...");
    for (let i = 0; i < 5; i++) {
      const currentLang = languageBtn.dataset.current || 'en';
      const currentIndex = languageCycle.indexOf(currentLang);
      const nextIndex = (currentIndex + 1) % languageCycle.length;
      const nextLang = languageCycle[nextIndex];
      console.log(`Click ${i + 1}: ${currentLang} → ${nextLang}`);
    }
  }
};

// Reset language selector if it gets stuck
window.resetLanguageSelector = function() {
  console.log("=== RESETTING LANGUAGE SELECTOR ===");
  languageSelectorInitialized = false;
  lastLanguageClick = 0;
  
  // Remove existing event listeners by cloning the buttons
  const languageBtn = document.getElementById("languageBtn");
  const mobileLanguageBtn = document.getElementById("mobileLanguageBtn");
  
  if (languageBtn) {
    const newBtn = languageBtn.cloneNode(true);
    languageBtn.parentNode.replaceChild(newBtn, languageBtn);
  }
  
  if (mobileLanguageBtn) {
    const newMobileBtn = mobileLanguageBtn.cloneNode(true);
    mobileLanguageBtn.parentNode.replaceChild(newMobileBtn, mobileLanguageBtn);
  }
  
  // Reinitialize
  setTimeout(() => {
    initLanguageSelector();
    console.log("Language selector reset and reinitialized");
  }, 100);
};

function switchLanguage(lang) {
  if (!translations[lang]) {
    console.log("Language not found:", lang);
    return;
  }
  
  console.log("Switching to language:", lang);
  currentLanguage = lang;
  localStorage.setItem("selectedLanguage", lang);
  
  // Update language button
  const languageBtn = document.getElementById("languageBtn");
  if (languageBtn) {
    const flagEmoji = languageBtn.querySelector(".flag-emoji");
    languageBtn.dataset.current = lang;
    
    // Update flag emoji based on language
    const flagMap = {
      "en": "🇬🇧",
      "es": "🇪🇸", 
      "gl": "🏴‍☠️",
      "fr": "🇫🇷"
    };
    
    if (flagEmoji && flagMap[lang]) {
      // Update the emoji
      flagEmoji.textContent = flagMap[lang];
    }
  }
  
  // Update all translatable elements
  updateTranslations();
  
  // Update URL
  updateURL(lang);
}

function updateTranslations() {
  const t = translations[currentLanguage];
  if (!t) return;
  
  // Update navigation
  updateElementText("[data-translate=\"about\"]", t.about);
  updateElementText("[data-translate=\"experience\"]", t.experience);
  updateElementText("[data-translate=\"education\"]", t.education);
  updateElementText("[data-translate=\"skills\"]", t.skills);
  updateElementText("[data-translate=\"portfolio\"]", t.portfolio);
  updateElementText("[data-translate=\"contact\"]", t.contact);
  
  // Update hero section
  updateElementText("[data-translate=\"heroTitle1\"]", t.heroTitle1);
  updateElementText("[data-translate=\"heroTitle2\"]", t.heroTitle2);
  updateElementText("[data-translate=\"heroSubtitle\"]", t.heroSubtitle);
  updateElementText("[data-translate=\"heroDescription\"]", t.heroDescription);
  updateElementText("[data-translate=\"hireMe\"]", t.hireMe);
  updateElementText("[data-translate=\"downloadCV\"]", t.downloadCV);
  updateElementText("[data-translate=\"scrollToExplore\"]", t.scrollToExplore);
  
  // Update about section
  updateElementText("[data-translate=\"aboutTitle\"]", t.aboutTitle);
  updateElementText("[data-translate=\"aboutText\"]", t.aboutText);
  updateElementText("[data-translate=\"contactInfo\"]", t.contactInfo);
  updateElementText("[data-translate=\"email\"]", t.email);
  updateElementText("[data-translate=\"phone\"]", t.phone);
  updateElementText("[data-translate=\"location\"]", t.location);
  updateElementText("[data-translate=\"languages\"]", t.languages);
  
  // Update experience section
  updateElementText("[data-translate=\"experienceTitle\"]", t.experienceTitle);
  updateElementText("[data-translate=\"experienceSubtitle\"]", t.experienceSubtitle);
  
  // Update education section
  updateElementText("[data-translate=\"educationTitle\"]", t.educationTitle);
  updateElementText("[data-translate=\"educationSubtitle\"]", t.educationSubtitle);
  
  // Update skills section
  updateElementText("[data-translate=\"skillsTitle\"]", t.skillsTitle);
  updateElementText("[data-translate=\"skillsSubtitle\"]", t.skillsSubtitle);
  
  // Update portfolio section
  updateElementText("[data-translate=\"portfolioTitle\"]", t.portfolioTitle);
  updateElementText("[data-translate=\"portfolioSubtitle\"]", t.portfolioSubtitle);
  updateElementText("[data-translate=\"all\"]", t.all);
  updateElementText("[data-translate=\"cisco\"]", t.cisco);
  updateElementText("[data-translate=\"microsoft\"]", t.microsoft);
  updateElementText("[data-translate=\"gitlab\"]", t.gitlab);
  
  // Update contact section
  updateElementText("[data-translate=\"contactTitle\"]", t.contactTitle);
  updateElementText("[data-translate=\"contactSubtitle\"]", t.contactSubtitle);
  updateElementText("[data-translate=\"sendMessage\"]", t.sendMessage);
  updateElementText("[data-translate=\"getInTouch\"]", t.getInTouch);
  updateElementText("[data-translate=\"yourName\"]", t.yourName);
  updateElementText("[data-translate=\"yourEmail\"]", t.yourEmail);
  updateElementText("[data-translate=\"subject\"]", t.subject);
  updateElementText("[data-translate=\"yourMessage\"]", t.yourMessage);
  updateElementText("[data-translate=\"send\"]", t.send);
  
  // Update footer
  updateElementText("[data-translate=\"allRightsReserved\"]", t.allRightsReserved);
}

function updateElementText(selector, text) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    if (element.tagName === "INPUT" && element.type === "text") {
      element.placeholder = text;
    } else if (element.tagName === "INPUT" && element.type === "email") {
      element.placeholder = text;
    } else if (element.tagName === "TEXTAREA") {
      element.placeholder = text;
    } else {
      element.textContent = text;
    }
  });
}

// URL Routing for Languages
function initURLRouting() {
  // Check URL for language parameter
  const path = window.location.pathname;
  const langFromURL = path.split('/')[1];
  
  if (langFromURL && ['en', 'es', 'gl', 'fr'].includes(langFromURL)) {
    switchLanguage(langFromURL);
  }
  
  // Listen for browser back/forward buttons
  window.addEventListener('popstate', function(event) {
    const path = window.location.pathname;
    const langFromURL = path.split('/')[1];
    if (langFromURL && ['en', 'es', 'gl', 'fr'].includes(langFromURL)) {
      switchLanguage(langFromURL);
    } else {
      switchLanguage('en');
    }
  });
}

// ========================================
// NEW HEADER FUNCTIONALITY - FROM SCRATCH
// ========================================

function initNewHeader() {
  console.log('=== INITIALIZING NEW HEADER ===');
  
  const header = document.querySelector('#mainHeader');
  if (!header) {
    console.error('Header not found!');
    return;
  }
  
  console.log('Header found, initializing...');
  
  // Scroll effect
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Mobile menu functionality - SIMPLIFIED VERSION
  const mobileMenuBtn = document.querySelector('#mobileMenuBtn');
  const mobileNav = document.querySelector('#mobileNav');
  
  console.log('Mobile menu elements:', { mobileMenuBtn, mobileNav });
  
  if (mobileMenuBtn && mobileNav) {
    console.log('Mobile menu elements found, adding functionality...');
    
    // Simple click handler
    mobileMenuBtn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('=== MOBILE MENU BUTTON CLICKED ===');
      
      // Check current state
      const isOpen = mobileNav.classList.contains('active');
      console.log('Current state:', isOpen ? 'open' : 'closed');
      
      if (isOpen) {
        // Close menu
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        console.log('Menu CLOSED');
      } else {
        // Open menu
        mobileMenuBtn.classList.add('active');
        mobileNav.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        console.log('Menu OPENED');
      }
      
      // Log final state
      console.log('Final state:', {
        btnClasses: mobileMenuBtn.className,
        navClasses: mobileNav.className,
        isOpen: mobileNav.classList.contains('active')
      });
    };
    
    // Close menu when clicking on links
    const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        console.log('Mobile menu closed by link click');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!header.contains(e.target) && mobileNav.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        console.log('Mobile menu closed by outside click');
      }
    });
    
  } else {
    console.error('Mobile menu elements not found!');
  }
  
  // Language selector functionality
  initLanguageSelector();
  
  // Test function for debugging
  window.testMobileMenu = function() {
    console.log('=== TESTING MOBILE MENU ===');
    const btn = document.querySelector('#mobileMenuBtn');
    const nav = document.querySelector('#mobileNav');
    console.log('Elements:', { btn, nav });
    if (btn && nav) {
      console.log('Forcing menu open...');
      btn.classList.add('active');
      nav.classList.add('active');
      console.log('Classes after force open:', {
        btn: btn.className,
        nav: nav.className
      });
    }
  };
  
  // Debug function to check if mobile menu is working
  window.debugMobileMenu = function() {
    console.log('=== MOBILE MENU DEBUG ===');
    const btn = document.querySelector('#mobileMenuBtn');
    const nav = document.querySelector('#mobileNav');
    const header = document.querySelector('header');
    
    console.log('Elements found:', {
      button: !!btn,
      nav: !!nav,
      header: !!header
    });
    
    if (btn) {
      console.log('Button classes:', btn.className);
      console.log('Button onclick:', typeof btn.onclick);
    }
    
    if (nav) {
      console.log('Nav classes:', nav.className);
    }
    
    // Test click
    if (btn) {
      console.log('Testing button click...');
      btn.click();
    }
  };
  
  // Test function for lightbox
  window.testLightbox = function() {
    console.log('=== TESTING LIGHTBOX ===');
    const modal = document.querySelector('#lightboxModal');
    const buttons = document.querySelectorAll('.portfolio-btn');
    console.log('Modal:', modal);
    console.log('Buttons found:', buttons.length);
    if (modal && buttons.length > 0) {
      console.log('Forcing lightbox open...');
      modal.classList.add('active');
      console.log('Modal classes after force open:', modal.className);
    }
  };
  
  console.log('New header initialized successfully!');
}

// Legacy function for compatibility
function makeNavbarSticky() {
  initNewHeader();
}

// Initialize navbar fix
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing navbar...');
  setTimeout(makeNavbarSticky, 100);
});

// FORCE IMAGE VIEWER - IMMEDIATE EXECUTION
console.log('=== FORCE IMAGE VIEWER STARTING ===');

// Create viewer immediately
const forceViewer = document.createElement('div');
forceViewer.id = 'forceImageViewer';
forceViewer.style.cssText = `
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background: rgba(0, 0, 0, 0.95) !important;
  z-index: 999999 !important;
  display: none !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
`;

forceViewer.innerHTML = `
  <div style="position: relative; max-width: 90vw; max-height: 90vh; display: flex; align-items: center; justify-content: center; background: red; padding: 20px; border: 5px solid yellow;">
    <img id="forceImage" src="" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); background: yellow; border: 5px solid blue;">
    <button id="forceClose" style="position: absolute; top: 20px; right: 20px; background: #ff4444; color: white; border: none; border-radius: 50%; width: 50px; height: 50px; cursor: pointer; font-size: 24px; z-index: 1000000;">×</button>
    <div style="position: absolute; top: 20px; left: 20px; background: white; padding: 15px; border-radius: 5px; font-size: 14px; z-index: 1000000; border: 2px solid black;">
      <div>FORCE IMAGE VIEWER</div>
      <div>Image loaded: <span id="forceImageLoaded">No</span></div>
      <div>Image src: <span id="forceImageSrc">None</span></div>
      <div>Viewer display: <span id="forceViewerDisplay">None</span></div>
    </div>
  </div>
`;

document.body.appendChild(forceViewer);
console.log('Force viewer created and appended to body');

const forceImage = document.getElementById('forceImage');
const forceClose = document.getElementById('forceClose');
const forceImageLoadedSpan = document.getElementById('forceImageLoaded');
const forceImageSrcSpan = document.getElementById('forceImageSrc');
const forceViewerDisplaySpan = document.getElementById('forceViewerDisplay');

function forceShowImage(imageSrc) {
  console.log('=== FORCE SHOWING IMAGE ===');
  console.log('Image src:', imageSrc);
  
  // Update debug info
  forceImageSrcSpan.textContent = imageSrc;
  
  // Set image source
  forceImage.src = imageSrc;
  
  // Add load/error handlers
  forceImage.onload = function() {
    console.log('✅ Force image loaded successfully!');
    forceImageLoadedSpan.textContent = 'Yes';
    forceImageLoadedSpan.style.color = 'green';
  };
  
  forceImage.onerror = function() {
    console.error('❌ Force image failed to load!');
    forceImageLoadedSpan.textContent = 'Error';
    forceImageLoadedSpan.style.color = 'red';
  };
  
  // Show viewer
  forceViewer.style.display = 'flex';
  forceViewerDisplaySpan.textContent = 'flex';
  document.body.style.overflow = 'hidden';
  
  console.log('Force viewer should be visible now');
}

function forceHideImage() {
  console.log('Force hiding image');
  forceViewer.style.display = 'none';
  forceViewerDisplaySpan.textContent = 'none';
  document.body.style.overflow = '';
}

// Close button
forceClose.addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  forceHideImage();
});

// Click outside to close
forceViewer.addEventListener('click', function(e) {
  if (e.target === forceViewer) {
    forceHideImage();
  }
});

// Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && forceViewer.style.display === 'flex') {
    forceHideImage();
  }
});

// Global test function
window.forceTestImage = function() {
  console.log('Force testing image...');
  forceShowImage('portfolio/CCNA-RoutingSwitchingConnectingNetworks.jpg');
};

// Auto-test removed - only show on click

// DISABLED - Using simpleLightbox from HTML instead
// Wait for DOM and add click listeners
// function addForceListeners() {
//   const buttons = document.querySelectorAll('.portfolio-btn');
//   console.log('Found portfolio buttons for force viewer:', buttons.length);
//   
//   buttons.forEach((button, index) => {
//     button.addEventListener('click', function(e) {
//       e.preventDefault();
//       e.stopPropagation();
//       const imageSrc = button.getAttribute('data-image');
//       console.log('Force button clicked:', index, 'Image:', imageSrc);
//       forceShowImage(imageSrc);
//     });
//   });
// }

// Initialize listeners
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addForceListeners);
} else {
  addForceListeners();
}

// Test function for skill bars
window.testSkillBars = function() {
  console.log('Testing skill bars...');
  const skillItems = document.querySelectorAll('.skill-item');
  console.log('Found skill items:', skillItems.length);
  
  skillItems.forEach((item, index) => {
    const skillProgress = item.querySelector('.skill-progress');
    const width = skillProgress.getAttribute('data-width');
    const skillName = item.querySelector('.skill-name').textContent;
    
    console.log(`Skill ${index + 1}: ${skillName} - Width: ${width}%`);
    
    // Force animation
    item.classList.add('in-view');
    skillProgress.style.setProperty('--skill-width', width + '%');
    setTimeout(() => {
      skillProgress.style.width = width + '%';
      console.log(`Animated ${skillName} to ${width}%`);
    }, index * 100); // Stagger animations
  });
};

console.log('Force image viewer ready!');

// Also run on window load as backup
window.addEventListener('load', function() {
  console.log('Window loaded, re-initializing navbar...');
  setTimeout(makeNavbarSticky, 200);
});

// Debug function to check navbar status
function debugNavbar() {
  const navbar = document.querySelector('#mainNavbar');
  if (navbar) {
    const styles = window.getComputedStyle(navbar);
    console.log('Navbar debug info:');
    console.log('- Position:', styles.position);
    console.log('- Top:', styles.top);
    console.log('- Z-index:', styles.zIndex);
    console.log('- Display:', styles.display);
    console.log('- Visibility:', styles.visibility);
    console.log('- Classes:', navbar.className);
  } else {
    console.log('Navbar not found!');
  }
}

// Run debug after a delay
setTimeout(debugNavbar, 1000);

function updateURL(lang) {
  // For now, just update the URL without changing the page
  const newURL = lang === 'en' ? '/' : `/${lang}`;
  
  if (window.location.pathname !== newURL) {
    window.history.pushState({}, '', newURL);
  }
}


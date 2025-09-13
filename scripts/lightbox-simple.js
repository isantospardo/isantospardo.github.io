// SIMPLE LIGHTBOX WITH NAVIGATION - This will definitely work
document.addEventListener('DOMContentLoaded', function() {
    
    // Get elements
    const modal = document.getElementById('lightboxModal');
    const modalImage = document.getElementById('lightboxImage');
    const modalTitle = document.getElementById('lightboxTitle');
    const modalDescription = document.getElementById('lightboxDescription');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    
    if (!modal || !modalImage || !modalTitle || !modalDescription || !closeBtn) {
        return;
    }
    
    
    // Get all portfolio buttons and create array of portfolio items
    const portfolioButtons = document.querySelectorAll('.portfolio-btn');
    const portfolioItems = Array.from(portfolioButtons).map(function(button) {
        return {
            image: button.getAttribute('data-image'),
            title: button.getAttribute('data-title'),
            description: button.getAttribute('data-description')
        };
    });
    
    
    let currentIndex = 0;
    
    // Function to show current item
    function showItem(index) {
        if (index < 0 || index >= portfolioItems.length) return;
        
        currentIndex = index;
        const item = portfolioItems[currentIndex];
        
        
        // Set modal content
        modalImage.src = item.image;
        modalImage.alt = item.title;
        modalTitle.textContent = item.title;
        modalDescription.textContent = item.description;
        
        // Show modal
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
    }
    
    // Add click listeners to portfolio buttons
    portfolioButtons.forEach(function(button, index) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            showItem(index);
        });
    });
    
    // Navigation functions
    function showPrev() {
        const newIndex = (currentIndex - 1 + portfolioItems.length) % portfolioItems.length;
        showItem(newIndex);
    }
    
    function showNext() {
        const newIndex = (currentIndex + 1) % portfolioItems.length;
        showItem(newIndex);
    }
    
    // Add navigation listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showPrev();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showNext();
        });
    }
    
    // Close modal functions
    function closeModal() {
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        document.body.style.overflow = '';
    }
    
    // Close button
    closeBtn.addEventListener('click', closeModal);
    
    // Click outside modal to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('lightbox-overlay')) {
            closeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display !== 'flex') return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                showPrev();
                break;
            case 'ArrowRight':
                showNext();
                break;
        }
    });
    
});

// Test function
window.testLightbox = function() {
    const modal = document.getElementById('lightboxModal');
    const image = document.getElementById('lightboxImage');
    
    if (modal && image) {
        image.src = 'portfolio/CCNA-RoutingSwitchingConnectingNetworks.jpg';
        image.alt = 'Test Image';
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
        return true;
    } else {
        return false;
    }
};

// EPIC CONTACT FORM INTERACTIONS
document.addEventListener('DOMContentLoaded', function() {
    
    // Form input animations
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(function(input) {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Epic send button animation
    const sendButton = document.querySelector('.btn-epic-send');
    if (sendButton) {
        sendButton.addEventListener('click', function(e) {
            // Add loading state
            this.classList.add('loading');
            this.innerHTML = '<span class="btn-text">Opening Email...</span><span class="btn-icon"><i class="fas fa-spinner fa-spin"></i></span>';
            
            // Simulate opening email client
            setTimeout(() => {
                this.classList.remove('loading');
                this.innerHTML = '<span class="btn-text">Email Client Opened!</span><span class="btn-icon"><i class="fas fa-check"></i></span>';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    this.innerHTML = '<span class="btn-text">Send Message</span><span class="btn-icon"><i class="fas fa-paper-plane"></i></span><div class="btn-ripple"></div>';
                }, 2000);
            }, 1000);
        });
    }
    
    // Animated counters functionality
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        counters.forEach((counter, index) => {
            const target = parseInt(counter.getAttribute('data-count').replace('+', ''));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            
            // Add animation class
            counter.classList.add('animating');
            
            // Delay each counter slightly for staggered effect
            setTimeout(() => {
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = counter.getAttribute('data-count');
                        counter.classList.remove('animating');
                    }
                };
                
                updateCounter();
            }, index * 200); // 200ms delay between each counter
        });
    }
    
    // Multiple ways to trigger counters
    function initCounters() {
        // Method 1: Intersection Observer
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe the stats section
        const statsSection = document.querySelector('.profile-stats');
        if (statsSection) {
            counterObserver.observe(statsSection);
        } else {
        }
        
        // Method 2: Fallback - trigger after 1 second if not triggered by observer
        setTimeout(() => {
            const counters = document.querySelectorAll('.stat-number[data-count]');
            const firstCounter = counters[0];
            if (firstCounter && firstCounter.textContent === '0') {
                animateCounters();
            }
        }, 1000);
        
        // Method 3: Manual trigger on scroll
        let countersTriggered = false;
        window.addEventListener('scroll', () => {
            if (!countersTriggered) {
                const statsSection = document.querySelector('.profile-stats');
                if (statsSection) {
                    const rect = statsSection.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    if (isVisible) {
                        animateCounters();
                        countersTriggered = true;
                    }
                }
            }
        });
    }
    
    // Initialize counters
    initCounters();
    
    // Test function - you can call this from browser console: testCounters()
    window.testCounters = function() {
        animateCounters();
    };
    
    // Animated progress bars functionality
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.skill-progress[data-width]');
        
        progressBars.forEach((bar, index) => {
            const targetWidth = parseInt(bar.getAttribute('data-width'));
            const duration = 2000; // 2 seconds
            const increment = targetWidth / (duration / 16); // 60fps
            let currentWidth = 0;
            
            
            // Reset width to 0 using CSS custom property
            bar.style.setProperty('--progress-width', '0%');
            bar.classList.add('animating');
            
            // Delay each bar slightly for staggered effect
            setTimeout(() => {
                const updateProgress = () => {
                    currentWidth += increment;
                    if (currentWidth < targetWidth) {
                        bar.style.setProperty('--progress-width', Math.floor(currentWidth) + '%');
                        requestAnimationFrame(updateProgress);
                    } else {
                        bar.style.setProperty('--progress-width', targetWidth + '%');
                        bar.classList.remove('animating');
                    }
                };
                
                updateProgress();
            }, index * 100); // 100ms delay between each bar
        });
    }
    
    // Intersection Observer for progress bars
    const progressObserverOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
                progressObserver.unobserve(entry.target);
            }
        });
    }, progressObserverOptions);
    
    // Observe the skills section
    const skillsSection = document.querySelector('.skills-grid');
    if (skillsSection) {
        progressObserver.observe(skillsSection);
    } else {
    }
    
    // Fallback for progress bars
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.skill-progress[data-width]');
        const firstBar = progressBars[0];
        if (firstBar && firstBar.style.width === '') {
            animateProgressBars();
        }
    }, 1500);
    
    // Test function for progress bars
    window.testProgressBars = function() {
        animateProgressBars();
    };
    
    // Portfolio filter functionality
    function initPortfolioFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Filter portfolio items
                portfolioItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        
                        // Animate in
                        setTimeout(() => {
                            item.style.transition = 'all 0.3s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.transition = 'all 0.3s ease';
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        
                        // Hide after animation
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Initialize portfolio filter
    initPortfolioFilter();
    
    // Contact info item hover effects
    const contactItems = document.querySelectorAll('.contact-info-item');
    contactItems.forEach(function(item) {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });
    
    // Social links animation
    const socialLinks = document.querySelectorAll('.social-link-contact');
    socialLinks.forEach(function(link) {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
});

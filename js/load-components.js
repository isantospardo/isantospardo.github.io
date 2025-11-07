/**
 * Load reusable components (header and footer) dynamically
 */
(function() {
  'use strict';

  // Function to load HTML content into an element
  function loadComponent(elementId, componentPath) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn('Element with id "' + elementId + '" not found');
      return;
    }

    fetch(componentPath)
      .then(response => {
        if (!response.ok) {
          throw new Error('HTTP error! status: ' + response.status);
        }
        return response.text();
      })
      .then(html => {
        element.innerHTML = html;
        
        // Update copyright year after footer is loaded
        if (elementId === 'footer-container') {
          const yearElement = document.getElementById('current-year');
          if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
          }
          
          // Reinitialize i18n after footer is loaded
          setTimeout(function() {
            if (typeof initI18n === 'function') {
              initI18n();
            } else if (window.i18nInit) {
              window.i18nInit();
            }
          }, 100);
        }
        
        // Reinitialize Bootstrap collapse for navbar after header is loaded
        if (elementId === 'header-container') {
          // Wait a bit for the HTML to be inserted
          setTimeout(function() {
            // Reinitialize Bootstrap collapse
            if (typeof $ !== 'undefined') {
              // Reinitialize collapse component
              var collapseElements = document.querySelectorAll('[data-toggle="collapse"]');
              collapseElements.forEach(function(element) {
                // Remove existing event listeners and reinitialize
                var $element = $(element);
                var target = $element.data('target');
                if (target) {
                  // Initialize collapse manually if needed
                  $element.off('click').on('click', function(e) {
                    e.preventDefault();
                    var $target = $(target);
                    $target.collapse('toggle');
                  });
                }
              });
            }
            
            // Update translations for header after it's loaded
            function updateHeaderTranslations() {
              // Try multiple times to ensure translations are applied
              var attempts = 0;
              var maxAttempts = 10;
              
              function tryUpdate() {
                attempts++;
                
                if (window.i18nextInstance && typeof window.updatePageContent === 'function') {
                  // Force update all translations
                  window.updatePageContent();
                  
                  // Verify navbar was translated
                  var navLinks = document.querySelectorAll('#mainNav .nav-link[data-i18n]');
                  var allTranslated = true;
                  navLinks.forEach(function(link) {
                    var key = link.getAttribute('data-i18n');
                    var currentText = link.textContent.trim();
                    var expectedText = window.i18nextInstance.t(key);
                    if (currentText === key || (expectedText && currentText !== expectedText)) {
                      allTranslated = false;
                    }
                  });
                  
                  if (allTranslated || attempts >= maxAttempts) {
                    console.log('Navbar translations applied after', attempts, 'attempts');
                    return;
                  }
                  
                  // Try again
                  setTimeout(tryUpdate, 200);
                } else if (window.i18nInit) {
                  // If i18n is not initialized yet, initialize it
                  window.i18nInit();
                  setTimeout(tryUpdate, 500);
                } else if (attempts < maxAttempts) {
                  // Wait a bit and try again
                  setTimeout(tryUpdate, 300);
                }
              }
              
              // Start trying immediately
              setTimeout(tryUpdate, 100);
              
              // Also try after longer delays
              setTimeout(tryUpdate, 500);
              setTimeout(tryUpdate, 1000);
              setTimeout(tryUpdate, 2000);
            }
            
            updateHeaderTranslations();
            
            // Dispatch event to notify that header is loaded
            window.dispatchEvent(new CustomEvent('headerLoaded'));
          }, 100);
        }
      })
      .catch(error => {
        console.error('Error loading component from ' + componentPath + ':', error);
        element.innerHTML = '<div class="alert alert-warning">Error loading component. Please refresh the page.</div>';
      });
  }

  // Load components when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      loadComponent('header-container', 'components/header.html');
      loadComponent('footer-container', 'components/footer.html');
    });
  } else {
    // DOM is already ready
    loadComponent('header-container', 'components/header.html');
    loadComponent('footer-container', 'components/footer.html');
  }
})();


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
        }
        
        // Reinitialize Bootstrap components if needed
        if (typeof bootstrap !== 'undefined') {
          // Reinitialize dropdowns, modals, etc. if needed
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


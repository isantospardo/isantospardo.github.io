/**
 * Internationalization (i18n) System using i18next
 * Handles language selection and automatic translation
 */

(function() {
  'use strict';

  // Language names mapping
  const LANG_NAMES = {
    'es': 'Español',
    'en': 'English',
    'fr': 'Français',
    'gl': 'Galego',
    'pt': 'Português'
  };

  let i18nextInstance = null;
  let linkInterceptorSetup = false;

  // Get current language from URL query parameter or localStorage
  function getCurrentLanguage() {
    // Check URL query parameter (e.g., ?lang=en)
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && LANG_NAMES[langParam]) {
      return langParam;
    }
    
    // Check URL path for language prefix (e.g., /en/, /fr/) - for future use
    const path = window.location.pathname;
    const langMatch = path.match(/^\/(es|en|fr|gl|pt)\//);
    if (langMatch) {
      return langMatch[1];
    }
    
    // Check localStorage
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && LANG_NAMES[savedLang]) {
      return savedLang;
    }
    
    // Default to Spanish
    return 'es';
  }

  // Initialize i18next
  function initI18n() {
    // Check if footer is already loaded, if not, wait a bit
    const langCurrentFooter = document.getElementById('langCurrentFooter');
    if (!langCurrentFooter) {
      // Footer not loaded yet, try again in a bit
      setTimeout(initI18n, 200);
      return;
    }

    const currentLang = getCurrentLanguage();

    // Initialize i18next
    i18next
      .use(i18nextBrowserLanguageDetector)
      .init({
        lng: currentLang,
        fallbackLng: 'es',
        debug: false,
        resources: {
          es: {
            translation: {}
          },
          en: {
            translation: {}
          },
          fr: {
            translation: {}
          },
          gl: {
            translation: {}
          },
          pt: {
            translation: {}
          }
        },
        interpolation: {
          escapeValue: false
        }
      })
      .then(function() {
        // Load translation files
        return Promise.all([
          fetch('locales/es/translation.json').then(r => r.json()),
          fetch('locales/en/translation.json').then(r => r.json()),
          fetch('locales/fr/translation.json').then(r => r.json()),
          fetch('locales/gl/translation.json').then(r => r.json()),
          fetch('locales/pt/translation.json').then(r => r.json())
        ]);
      })
      .then(function([es, en, fr, gl, pt]) {
        // Add resources to i18next
        i18next.addResourceBundle('es', 'translation', es, true, true);
        i18next.addResourceBundle('en', 'translation', en, true, true);
        i18next.addResourceBundle('fr', 'translation', fr, true, true);
        i18next.addResourceBundle('gl', 'translation', gl, true, true);
        i18next.addResourceBundle('pt', 'translation', pt, true, true);
        
        // Change language if needed
        const currentLang = getCurrentLanguage();
        if (i18next.language !== currentLang) {
          i18next.changeLanguage(currentLang);
        }
        
        i18nextInstance = i18next;
        
        // Update page content immediately
        updatePageContent();
        
        // Also update after a short delay to ensure navbar is ready
        setTimeout(function() {
          updatePageContent();
        }, 100);
        
        // Setup link interceptor to preserve language on navigation
        setupLinkInterceptor();
        
        // Update internal links to preserve language
        updateInternalLinks();
        
        // Setup language selector
        setupLanguageSelector();
        
        // Listen for language changes
        i18next.on('languageChanged', function(lng) {
          // Update page content immediately
          updatePageContent();
          setCurrentLanguage(lng);
          updateInternalLinks();
          
          // Force update navbar specifically
          setTimeout(function() {
            updatePageContent();
            // Also specifically update navbar elements
            var navElements = document.querySelectorAll('#mainNav [data-i18n]');
            navElements.forEach(function(element) {
              var key = element.getAttribute('data-i18n');
              if (key && i18nextInstance) {
                var translation = i18nextInstance.t(key);
                if (translation && translation !== key) {
                  element.textContent = translation;
                }
              }
            });
          }, 50);
          
          // Also update again after a short delay to catch any dynamically loaded content
          setTimeout(function() {
            updatePageContent();
          }, 200);
          
          // One more time for good measure
          setTimeout(function() {
            updatePageContent();
          }, 500);
          
          // Trigger custom event for other scripts that need to update
          window.dispatchEvent(new CustomEvent('i18nLanguageChanged', { detail: { language: lng } }));
        });
      })
      .catch(function(error) {
        console.error('Error loading translations:', error);
        // Fallback: setup language selector anyway
        setupLanguageSelector();
      });
  }

  // Update page content with translations
  function updatePageContent() {
    if (!i18nextInstance) {
      console.warn('i18nextInstance not available for updatePageContent');
      return;
    }

    // Update elements with data-i18n attribute
    const elementsToTranslate = document.querySelectorAll('[data-i18n]');
    console.log('Updating translations for', elementsToTranslate.length, 'elements');
    
    // Specifically target navbar elements first
    const navElements = document.querySelectorAll('#mainNav [data-i18n]');
    console.log('Found', navElements.length, 'navbar elements to translate');
    
    // Update navbar elements first
    navElements.forEach(function(element) {
      const key = element.getAttribute('data-i18n');
      if (!key) return;
      
      const translation = i18nextInstance.t(key);
      if (translation && translation !== key) {
        element.textContent = translation;
        console.log('Translated navbar element:', key, '->', translation);
      }
    });
    
    // Update all other elements
    elementsToTranslate.forEach(function(element) {
      // Skip if already processed (navbar elements)
      if (element.closest('#mainNav')) {
        return;
      }
      
      const key = element.getAttribute('data-i18n');
      if (!key) return;
      
      // Get interpolation options if present
      let options = {};
      const optionsAttr = element.getAttribute('data-i18n-options');
      if (optionsAttr) {
        try {
          options = JSON.parse(optionsAttr);
        } catch (e) {
          console.warn('Invalid data-i18n-options:', optionsAttr);
        }
      }
      
      const translation = i18nextInstance.t(key, options);
      
      if (!translation || translation === key) {
        console.warn('Translation not found for key:', key);
        return;
      }
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        // Update placeholder
        if (element.hasAttribute('placeholder')) {
          element.placeholder = translation;
        }
        // Update validation message if present
        if (element.hasAttribute('data-validation-required-message')) {
          element.setAttribute('data-validation-required-message', translation);
        }
      } else if (element.hasAttribute('data-i18n-html')) {
        element.innerHTML = translation;
      } else {
        // Preserve year span if it exists
        const yearSpan = element.querySelector('#current-year');
        if (yearSpan && key === 'footer.copyright') {
          const year = new Date().getFullYear();
          element.textContent = translation.replace('{{year}}', year);
          if (yearSpan) yearSpan.textContent = year;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update validation messages separately
    document.querySelectorAll('[data-i18n-validation]').forEach(function(element) {
      const key = element.getAttribute('data-i18n-validation');
      if (!key || !i18nextInstance) return;
      
      const translation = i18nextInstance.t(key);
      if (element.hasAttribute('data-validation-required-message')) {
        // Update the HTML attribute
        element.setAttribute('data-validation-required-message', translation);
        
        // Also update the jQuery data attribute that jqBootstrapValidation uses
        if (window.$ && window.$.fn) {
          const $element = window.$(element);
          if ($element && $element.data) {
            // Update jQuery data - jqBootstrapValidation reads from data('validationRequiredMessage')
            $element.data('validationRequiredMessage', translation);
            
            // Update the validation message in jqBootstrapValidation if it's already initialized
            const jqValidation = $element.data('jqBootstrapValidation');
            if (jqValidation && jqValidation.validators) {
              // Update messages in all validators
              Object.keys(jqValidation.validators).forEach(function(validatorType) {
                if (jqValidation.validators[validatorType]) {
                  jqValidation.validators[validatorType].forEach(function(validator) {
                    if (validator && validator.name === 'required') {
                      validator.message = translation;
                    }
                  });
                }
              });
            }
          }
        }
      }
    });
    
    // Reinicializar jqBootstrapValidation después de actualizar los mensajes
    // Esto asegura que los nuevos mensajes se lean correctamente
    if (window.$ && window.$.fn && window.$.fn.jqBootstrapValidation) {
      setTimeout(function() {
        const $form = window.$('#contactForm');
        if ($form && $form.length) {
          // Reinicializar validación en todos los inputs y textareas
          $form.find('input, textarea').each(function() {
            const $input = window.$(this);
            // Remover validación existente si existe
            if ($input.data('jqBootstrapValidation')) {
              try {
                $input.off('blur.jqBootstrapValidation');
                $input.off('focus.jqBootstrapValidation');
                $input.off('change.jqBootstrapValidation');
                $input.removeData('jqBootstrapValidation');
              } catch (e) {
                // Si falla, continuar
              }
            }
            // Reinicializar con los nuevos mensajes
            if ($input.attr('required') || $input.attr('data-validation-required-message')) {
              $input.jqBootstrapValidation({
                preventSubmit: true,
                filter: function() {
                  return window.$(this).is(':visible');
                }
              });
            }
          });
        }
      }, 200);
    }

    // Update elements with data-i18n-attr (for attributes like title, aria-label, etc.)
    document.querySelectorAll('[data-i18n-attr]').forEach(function(element) {
      const attrData = element.getAttribute('data-i18n-attr');
      const [attr, key] = attrData.split(':');
      const translation = i18nextInstance.t(key);
      element.setAttribute(attr, translation);
    });

    // Update meta tags
    updateMetaTags();
  }

  // Update meta tags for SEO
  function updateMetaTags() {
    if (!i18nextInstance) return;

    const lang = i18nextInstance.language;
    
    // Update html lang attribute
    document.documentElement.lang = lang;
    
    // Update title if it has translation
    const titleKey = document.querySelector('title')?.getAttribute('data-i18n');
    if (titleKey) {
      document.title = i18nextInstance.t(titleKey);
    }
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      const descKey = metaDesc.getAttribute('data-i18n');
      if (descKey) {
        metaDesc.content = i18nextInstance.t(descKey);
      }
    }
  }

  // Update internal links to preserve language
  function updateInternalLinks() {
    const currentLang = getCurrentLanguage();
    
    // Find all internal links (links to HTML files in the same domain)
    document.querySelectorAll('a[href]').forEach(function(link) {
      const href = link.getAttribute('href');
      if (!href) return;
      
      // Skip external links, anchors, and special protocols
      if (href.startsWith('http://') || 
          href.startsWith('https://') || 
          href.startsWith('mailto:') || 
          href.startsWith('tel:') ||
          href.startsWith('#') ||
          href.startsWith('javascript:') ||
          href.startsWith('//')) {
        return;
      }
      
      // Skip links that already have lang parameter
      if (href.includes('?lang=')) {
        return;
      }
      
      // Parse the URL
      try {
        const url = new URL(href, window.location.origin);
        
        // Only update links to HTML files or root
        const pathname = url.pathname;
        if (pathname.endsWith('.html') || pathname === '/' || pathname.endsWith('/')) {
          // Remove existing lang parameter if any
          url.searchParams.delete('lang');
          
          // Add lang parameter if not Spanish
          if (currentLang !== 'es') {
            url.searchParams.set('lang', currentLang);
          }
          
          // Update the href
          const newHref = url.pathname + (url.search ? url.search : '') + (url.hash || '');
          link.setAttribute('href', newHref);
        }
      } catch (e) {
        // If URL parsing fails, try simple string manipulation
        if (href.includes('.html') || href === 'index.html' || href === '/') {
          let newHref = href;
          
          // Remove existing query string
          const hashIndex = newHref.indexOf('#');
          const hash = hashIndex >= 0 ? newHref.substring(hashIndex) : '';
          const baseHref = hashIndex >= 0 ? newHref.substring(0, hashIndex) : newHref;
          
          // Remove existing lang parameter
          const queryIndex = baseHref.indexOf('?');
          let basePath = baseHref;
          let queryParams = '';
          
          if (queryIndex >= 0) {
            basePath = baseHref.substring(0, queryIndex);
            queryParams = baseHref.substring(queryIndex + 1);
            const params = new URLSearchParams(queryParams);
            params.delete('lang');
            if (currentLang !== 'es') {
              params.set('lang', currentLang);
            }
            queryParams = params.toString() ? '?' + params.toString() : '';
          } else if (currentLang !== 'es') {
            queryParams = '?lang=' + currentLang;
          }
          
          link.setAttribute('href', basePath + queryParams + hash);
        }
      }
    });
  }

  // Intercept clicks on internal links to preserve language
  function setupLinkInterceptor() {
    // Only setup once
    if (linkInterceptorSetup) return;
    linkInterceptorSetup = true;
    
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href]');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href) return;
      
      // Skip external links, anchors, and special protocols
      if (href.startsWith('http://') || 
          href.startsWith('https://') || 
          href.startsWith('mailto:') || 
          href.startsWith('tel:') ||
          href.startsWith('#') ||
          href.startsWith('javascript:') ||
          href.startsWith('//')) {
        return;
      }
      
      // Skip if link already has lang parameter
      if (href.includes('?lang=')) {
        return;
      }
      
      const currentLang = getCurrentLanguage();
      
      // Only process internal HTML links
      if (href.includes('.html') || href === 'index.html' || href === '/' || href.endsWith('/')) {
        // Check if it's a relative link
        try {
          const url = new URL(href, window.location.origin);
          
          // Only intercept if it's the same origin
          if (url.origin === window.location.origin) {
            // Add lang parameter if not Spanish
            if (currentLang !== 'es') {
              url.searchParams.set('lang', currentLang);
              const newHref = url.pathname + (url.search ? url.search : '') + (url.hash || '');
              link.setAttribute('href', newHref);
            }
          }
        } catch (e) {
          // If URL parsing fails, try simple string manipulation
          if (currentLang !== 'es' && !href.includes('?')) {
            const hashIndex = href.indexOf('#');
            const hash = hashIndex >= 0 ? href.substring(hashIndex) : '';
            const baseHref = hashIndex >= 0 ? href.substring(0, hashIndex) : href;
            link.setAttribute('href', baseHref + '?lang=' + currentLang + hash);
          }
        }
      }
    }, true); // Use capture phase to intercept before navigation
  }

  // Setup language selector
  function setupLanguageSelector() {
    // Footer selector
    const langCurrentFooter = document.getElementById('langCurrentFooter');
    const langDropdownFooter = document.getElementById('langDropdownFooter');
    
    const langOptions = document.querySelectorAll('.lang-option-footer');
    
    // Update current language display
    const currentLang = getCurrentLanguage();
    setCurrentLanguage(currentLang);
    
    // Toggle dropdown on footer current button click
    if (langCurrentFooter && langDropdownFooter) {
      // Remove any existing event listeners by cloning
      const newButton = langCurrentFooter.cloneNode(true);
      langCurrentFooter.parentNode.replaceChild(newButton, langCurrentFooter);
      
      // Get the new reference
      const btn = document.getElementById('langCurrentFooter');
      const dropdown = document.getElementById('langDropdownFooter');
      
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = dropdown.classList.contains('show');
        
        if (isOpen) {
          dropdown.classList.remove('show');
          const icon = btn.querySelector('i');
          if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
          dropdown.classList.add('show');
          const icon = btn.querySelector('i');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    }
    
    // Handle language option clicks
    langOptions.forEach(option => {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        const selectedLang = this.getAttribute('data-lang');
        changeLanguage(selectedLang);
        
        // Close dropdown
        if (langDropdownFooter) {
          langDropdownFooter.classList.remove('show');
        }
        // Reset icon rotation
        if (langCurrentFooter) {
          const icon = langCurrentFooter.querySelector('i');
          if (icon) {
            icon.style.transform = 'rotate(0deg)';
          }
        }
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (langDropdownFooter && langCurrentFooter) {
        if (!e.target.closest('.language-selector-footer')) {
          langDropdownFooter.classList.remove('show');
          // Reset icon rotation
          const icon = langCurrentFooter.querySelector('i');
          if (icon) {
            icon.style.transform = 'rotate(0deg)';
          }
        }
      }
    });
  }

  // Change language
  function changeLanguage(lang) {
    if (!LANG_NAMES[lang]) return;
    
    // Save preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Change language using i18next (no page reload needed)
    if (i18nextInstance) {
      i18nextInstance.changeLanguage(lang).then(function() {
        // Update URL with query parameter for SEO and bookmarking
        updateUrlWithLanguage(lang);
        // Update all internal links to preserve new language
        updateInternalLinks();
      });
    } else {
      // If i18next not initialized yet, just update URL
      updateUrlWithLanguage(lang);
      // Reload page to reinitialize
      window.location.reload();
    }
  }
  
  // Update URL with language parameter (without page reload)
  function updateUrlWithLanguage(lang) {
    const url = new URL(window.location);
    
    // Remove existing lang parameter
    url.searchParams.delete('lang');
    
    // Add new lang parameter (only if not Spanish, to keep URLs cleaner)
    if (lang !== 'es') {
      url.searchParams.set('lang', lang);
    }
    
    // Update URL without reloading page
    window.history.replaceState({}, '', url);
  }

  // Set current language display
  function setCurrentLanguage(lang) {
    // Update footer selector with language name
    const langCurrentFooter = document.getElementById('langCurrentFooter');
    const langNameFooter = langCurrentFooter ? langCurrentFooter.querySelector('.lang-name-current') : null;
    
    if (langNameFooter && LANG_NAMES[lang]) {
      langNameFooter.textContent = LANG_NAMES[lang];
    }
    
    // Update active option in dropdown
    const langOptions = document.querySelectorAll('.lang-option-footer');
    langOptions.forEach(option => {
      const optionLang = option.getAttribute('data-lang');
      if (optionLang === lang) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }

  // Make initI18n and updatePageContent available globally for load-components.js
  window.i18nInit = initI18n;
  window.updatePageContent = updatePageContent;
  
  // Expose i18nextInstance getter
  Object.defineProperty(window, 'i18nextInstance', {
    get: function() {
      return i18nextInstance;
    }
  });
  
  // Listen for header load event to update navbar translations
  window.addEventListener('headerLoaded', function() {
    if (window.i18nextInstance && typeof window.updatePageContent === 'function') {
      // Update immediately
      window.updatePageContent();
      
      // Update again after delays
      setTimeout(function() {
        window.updatePageContent();
      }, 100);
      setTimeout(function() {
        window.updatePageContent();
      }, 300);
      setTimeout(function() {
        window.updatePageContent();
      }, 600);
    }
  });
  
  // Also set up a periodic check for navbar translations (as a fallback)
  setInterval(function() {
    if (window.i18nextInstance && document.querySelector('#mainNav')) {
      var navLinks = document.querySelectorAll('#mainNav .nav-link[data-i18n]');
      var needsUpdate = false;
      navLinks.forEach(function(link) {
        var key = link.getAttribute('data-i18n');
        var currentText = link.textContent.trim();
        var expectedText = window.i18nextInstance.t(key);
        // Check if text matches the key (not translated) or doesn't match expected translation
        if (key && expectedText && (currentText === key || currentText !== expectedText)) {
          needsUpdate = true;
        }
      });
      
      if (needsUpdate && typeof window.updatePageContent === 'function') {
        console.log('Periodic check: updating navbar translations');
        window.updatePageContent();
      }
    }
  }, 2000); // Check every 2 seconds

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Wait a bit for components to load
      setTimeout(initI18n, 300);
    });
  } else {
    // Wait a bit for components to load
    setTimeout(initI18n, 300);
  }

})();

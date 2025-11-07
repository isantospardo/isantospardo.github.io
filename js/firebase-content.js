// Firebase Content Loader for Frontend
// This file loads dynamic content from Firebase Firestore

(function() {
  'use strict';

  // Initialize Firebase (use same config as admin)
  // Make sure to include this in your HTML pages that need dynamic content
  
  // Load blogs dynamically
  async function loadBlogs(category = null) {
    if (!window.firebaseServices || !window.firebaseServices.db) {
      console.warn('Firebase not initialized');
      return [];
    }

    try {
      let query = window.firebaseServices.db.collection('blogs')
        .where('status', '==', 'published')
        .orderBy('createdAt', 'desc');

      if (category) {
        query = query.where('category', '==', category);
      }

      const snapshot = await query.limit(10).get();
      const blogs = [];

      snapshot.forEach(doc => {
        const blog = doc.data();
        blogs.push({
          id: doc.id,
          ...blog,
          createdAt: blog.createdAt ? blog.createdAt.toDate() : new Date()
        });
      });

      return blogs;
    } catch (error) {
      console.error('Error loading blogs:', error);
      return [];
    }
  }

  // Load page content
  async function loadPageContent(page, fieldKey) {
    if (!window.firebaseServices || !window.firebaseServices.db) {
      return null;
    }

    try {
      const snapshot = await window.firebaseServices.db.collection('pageContent')
        .where('page', '==', page)
        .where('fieldKey', '==', fieldKey)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const content = doc.data();
      
      // Get content based on current language
      const lang = getCurrentLanguage();
      const langKey = `content${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
      
      return content[langKey] || content.contentEs || '';
    } catch (error) {
      console.error('Error loading page content:', error);
      return null;
    }
  }

  // Get current language from i18next or URL
  function getCurrentLanguage() {
    if (window.i18nextInstance) {
      return window.i18nextInstance.language || 'es';
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang');
    return lang || 'es';
  }

  // Render blog list
  async function renderBlogs(containerId, category = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Show loading state
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
          <span class="sr-only">Cargando...</span>
        </div>
        <p class="text-muted">Cargando artículos...</p>
      </div>
    `;

    try {
      const blogs = await loadBlogs(category);
      
      if (blogs.length === 0) {
        container.innerHTML = `
          <div class="col-12">
            <div class="empty-blogs-state text-center py-5">
              <div class="empty-icon mb-4">
                <i class="fas fa-newspaper fa-4x text-muted" style="opacity: 0.3;"></i>
              </div>
              <h3 class="text-muted mb-3">Próximamente</h3>
              <p class="lead text-muted mb-4" style="max-width: 600px; margin: 0 auto;">
                Estamos preparando contenido interesante para ti.<br>
                Vuelve pronto para leer nuestros últimos artículos sobre novedades fiscales, laborales y legales.
              </p>
              <div class="mt-4">
                <a href="contact.html" class="btn btn-outline-primary">
                  <i class="fas fa-envelope mr-2"></i> Contáctanos para más información
                </a>
              </div>
            </div>
          </div>
        `;
        return;
      }

      let html = '<div class="row">';
      blogs.forEach((blog, index) => {
        const date = blog.createdAt.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Convert Quill Delta to HTML (simplified)
        let contentHtml = '';
        if (blog.contentEs && blog.contentEs.ops) {
          contentHtml = convertQuillDeltaToHTML(blog.contentEs);
        }

        // Extract plain text from HTML for excerpt
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contentHtml;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        const excerpt = plainText.length > 200 ? plainText.substring(0, 200) + '...' : plainText;
        
        // Category colors
        const categoryColors = {
          'fiscal': 'primary',
          'laboral': 'success',
          'legal': 'warning',
          'sucesiones': 'info',
          'general': 'secondary'
        };
        const categoryColor = categoryColors[blog.category?.toLowerCase()] || 'secondary';
        
        html += `
          <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
            <article class="blog-card card h-100 shadow-sm border-0">
              <div class="blog-image-wrapper position-relative overflow-hidden" style="height: 220px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
                ${blog.featuredImage ? 
                  `<img src="${blog.featuredImage}" class="card-img-top w-100 h-100" alt="${blog.titleEs}" style="object-fit: cover; transition: transform 0.3s ease;">` : 
                  `<div class="d-flex align-items-center justify-content-center h-100">
                    <i class="fas fa-file-alt fa-4x text-muted" style="opacity: 0.4;"></i>
                  </div>`
                }
                <div class="blog-category-badge position-absolute" style="top: 15px; right: 15px;">
                  <span class="badge badge-${categoryColor} px-3 py-2" style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${blog.category || 'General'}
                  </span>
                </div>
              </div>
              <div class="card-body d-flex flex-column p-4">
                <div class="blog-meta mb-3">
                  <small class="text-muted">
                    <i class="far fa-calendar-alt mr-1"></i>
                    ${date}
                  </small>
                </div>
                <h4 class="card-title mb-3" style="font-size: 1.25rem; font-weight: 600; line-height: 1.4; color: #2c3e50;">
                  ${blog.titleEs}
                </h4>
                <p class="card-text text-muted flex-grow-1 mb-4" style="line-height: 1.6; font-size: 0.95rem;">
                  ${excerpt || 'Sin descripción disponible.'}
                </p>
                <a href="blog.html?id=${blog.id}" class="btn btn-primary mt-auto align-self-start" style="border-radius: 25px; padding: 0.5rem 1.5rem; font-weight: 500; transition: all 0.3s ease;">
                  Leer más 
                  <i class="fas fa-arrow-right ml-2" style="font-size: 0.875rem;"></i>
                </a>
              </div>
            </article>
          </div>
        `;
      });
      html += '</div>';
      container.innerHTML = html;

      // Add hover effects to blog cards
      const blogCards = container.querySelectorAll('.blog-card');
      blogCards.forEach(card => {
        const img = card.querySelector('img');
        if (img) {
          card.addEventListener('mouseenter', function() {
            img.style.transform = 'scale(1.05)';
          });
          card.addEventListener('mouseleave', function() {
            img.style.transform = 'scale(1)';
          });
        }
      });

    } catch (error) {
      console.error('Error rendering blogs:', error);
      container.innerHTML = `
        <div class="col-12">
          <div class="alert alert-warning text-center py-4" role="alert">
            <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
            <h4 class="alert-heading">Error al cargar los artículos</h4>
            <p class="mb-0">No se pudieron cargar los artículos en este momento. Por favor, intenta de nuevo más tarde.</p>
          </div>
        </div>
      `;
    }
  }

  // Convert Quill Delta to HTML (simplified version)
  function convertQuillDeltaToHTML(delta) {
    if (!delta || !delta.ops) return '';
    
    let html = '';
    let currentParagraph = '';
    
    delta.ops.forEach((op, index) => {
      if (op.insert) {
        if (typeof op.insert === 'string') {
          let text = op.insert.replace(/\n/g, '<br>');
          
          if (op.attributes) {
            if (op.attributes.bold) text = `<strong>${text}</strong>`;
            if (op.attributes.italic) text = `<em>${text}</em>`;
            if (op.attributes.underline) text = `<u>${text}</u>`;
            if (op.attributes.header) {
              const level = op.attributes.header;
              // Close previous paragraph if exists
              if (currentParagraph) {
                html += `<p>${currentParagraph}</p>`;
                currentParagraph = '';
              }
              text = `<h${level}>${text}</h${level}>`;
              html += text;
              return;
            }
            if (op.attributes.link) {
              text = `<a href="${op.attributes.link}" target="_blank">${text}</a>`;
            }
            if (op.attributes.list) {
              // Handle lists (simplified)
              if (op.attributes.list === 'ordered') {
                text = `<li>${text}</li>`;
              } else {
                text = `<li>${text}</li>`;
              }
            }
          }
          
          currentParagraph += text;
        } else if (op.insert.image) {
          // Close paragraph before image
          if (currentParagraph) {
            html += `<p>${currentParagraph}</p>`;
            currentParagraph = '';
          }
          html += `<img src="${op.insert.image}" alt="" class="img-fluid mb-3">`;
        }
      }
    });
    
    // Close last paragraph
    if (currentParagraph) {
      html += `<p>${currentParagraph}</p>`;
    }
    
    return html || '<p>Sin contenido</p>';
  }

  // Update page content dynamically
  async function updatePageContent(page) {
    const elements = document.querySelectorAll(`[data-firebase-page="${page}"]`);
    
    elements.forEach(async element => {
      const fieldKey = element.getAttribute('data-firebase-field');
      if (!fieldKey) return;

      const content = await loadPageContent(page, fieldKey);
      if (content) {
        if (element.hasAttribute('data-firebase-html')) {
          element.innerHTML = content;
        } else {
          element.textContent = content;
        }
      }
    });
  }

  // Export functions
  window.firebaseContent = {
    loadBlogs,
    loadPageContent,
    renderBlogs,
    updatePageContent
  };

})();


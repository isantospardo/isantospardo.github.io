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

  // Load featured news
  async function loadFeaturedNews() {
    console.log('🔍 loadFeaturedNews called');
    if (!window.firebaseServices || !window.firebaseServices.db) {
      console.error('❌ Firebase not initialized');
      console.log('firebaseServices:', window.firebaseServices);
      return [];
    }

    try {
      console.log('📡 Querying featuredNews collection...');
      // Try to get all featured news, then filter
      let snapshot;
      try {
        // Try with orderBy first
        snapshot = await window.firebaseServices.db.collection('featuredNews')
          .orderBy('order', 'asc')
          .limit(50) // Get more to filter
          .get();
      } catch (orderByError) {
        console.warn('⚠️ orderBy failed, trying without it:', orderByError);
        // If orderBy fails (no index), get all and sort in memory
        snapshot = await window.firebaseServices.db.collection('featuredNews')
          .limit(50)
          .get();
      }

      console.log('📦 Snapshot received:', snapshot.size, 'documents');

      const featuredNews = [];
      snapshot.forEach(doc => {
        const featured = doc.data();
        
        // Get all field values - be very explicit about checking
        // Firebase may return undefined, null, false, or true
        const draftValue = featured.draft;
        const statusValue = featured.status;
        const hiddenValue = featured.hidden;
        const archivedValue = featured.archived;
        
        // Check if explicitly excluded
        // Match admin logic exactly: published = NOT archived AND NOT hidden AND NOT draft
        // Admin logic: if (isArchived) archived, else if (isHidden) hidden, else if (isDraft) drafts, else published
        const isDraft = statusValue === 'draft' || draftValue === true;
        const isHidden = hiddenValue === true;
        const isArchived = archivedValue === true;
        
        // Include if NOT archived AND NOT hidden AND NOT draft
        // This matches the admin logic exactly
        const shouldInclude = !isArchived && !isHidden && !isDraft;
        
        console.log('📄 News:', {
          id: doc.id,
          title: featured.title || 'Sin título',
          draft: draftValue,
          status: statusValue,
          hidden: hiddenValue,
          archived: archivedValue,
          isDraft: isDraft,
          isHidden: isHidden,
          isArchived: isArchived,
          shouldInclude: shouldInclude
        });
        
        // Solo incluir noticias publicadas (no draft, no hidden, no archived)
        if (shouldInclude) {
          console.log('✅ INCLUDING:', featured.title);
          featuredNews.push({
            id: doc.id,
            ...featured,
            // Handle both Timestamp and Date formats
            createdAt: featured.createdAt 
              ? (featured.createdAt.toDate ? featured.createdAt.toDate() : featured.createdAt)
              : new Date()
          });
        } else {
          const reason = isDraft ? 'DRAFT' : isHidden ? 'HIDDEN' : isArchived ? 'ARCHIVED' : 'UNKNOWN';
          console.log('❌ EXCLUDING:', featured.title, '- Reason:', reason, {
            draft: draftValue,
            status: statusValue,
            hidden: hiddenValue,
            archived: archivedValue
          });
        }
      });
      
      console.log('📊 Featured news before filtering:', snapshot.size);
      console.log('📊 Featured news after filtering:', featuredNews.length);
      
      // Si no hay noticias después del filtro, mostrar información detallada
      if (featuredNews.length === 0 && snapshot.size > 0) {
        console.warn('⚠️ Todas las noticias fueron filtradas!');
        console.log('📋 Detalles de las noticias filtradas:');
        snapshot.forEach(doc => {
          const data = doc.data();
          console.log(`  - ${data.title || doc.id}:`, {
            draft: data.draft,
            status: data.status,
            hidden: data.hidden,
            archived: data.archived
          });
        });
      }
      
      // Sort by order
      featuredNews.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      // Limit to 6 after filtering
      const result = featuredNews.slice(0, 6);
      
      console.log('📊 Final result:', result.length, 'items');
      console.log('📊 Total in database:', snapshot.size);
      console.log('📊 Featured news after filter:', featuredNews.length, 'items');
      
      if (result.length > 0) {
        console.log('✅ Featured news to display:', result.map(n => n.title));
      } else {
        console.warn('⚠️ No featured news to display!');
        console.log('📋 Total in database:', snapshot.size);
        console.log('📋 Featured news after filter:', featuredNews.length);
        if (snapshot.size > 0) {
          console.warn('⚠️ Hay noticias en la BD pero todas fueron filtradas. Verifica los campos draft, hidden, archived.');
        } else {
          console.warn('⚠️ No hay noticias en la colección featuredNews. Agrega noticias desde el admin.');
        }
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error loading featured news:', error);
      console.error('Error details:', error.message, error.stack);
      return [];
    }
  }

  // Render blog list
  async function renderBlogs(containerId, category = null, useFeatured = false) {
    console.log('🎨 renderBlogs called:', { containerId, category, useFeatured });
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('❌ Container not found:', containerId);
      return;
    }

    console.log('📦 Container found, clearing content...');
    // Clear container completely - remove all child nodes
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // Show loading state
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
          <span class="sr-only">Cargando...</span>
        </div>
        <p class="text-muted">Cargando artículos...</p>
      </div>
    `;
    console.log('⏳ Loading state set');

    try {
      // Si useFeatured es true, cargar noticias destacadas
      let blogs = [];
      if (useFeatured) {
        console.log('🔄 Loading featured news for rendering...');
        blogs = await loadFeaturedNews();
        console.log('✅ Featured news loaded for rendering:', blogs.length, 'items');
        console.log('📦 Full blogs array:', blogs);
        if (blogs.length > 0) {
          console.log('📰 Titles:', blogs.map(b => b.title || b.titleEs));
          console.log('📰 First blog:', blogs[0]);
        } else {
          console.warn('⚠️ NO BLOGS TO RENDER - showing empty state');
        }
      } else {
        blogs = await loadBlogs(category);
      }
      
      console.log('📊 Total blogs to render:', blogs.length);
      
      if (blogs.length === 0) {
        console.warn('⚠️ No blogs to display, showing empty state');
        console.warn('⚠️ Debug info:', {
          useFeatured,
          containerId,
          firebaseReady: !!window.firebaseServices?.db
        });
        
        // Clear container completely
        container.innerHTML = '';
        
        // Show debug info (always show if useFeatured is true)
        let debugInfo = '';
        if (useFeatured) {
          debugInfo = `
            <div class="alert alert-info mt-3" style="max-width: 600px; margin: 0 auto;">
              <small>
                <strong>Debug:</strong> No se encontraron noticias destacadas publicadas.<br>
                Ejecuta <code>window.debugFeaturedNews()</code> en la consola para ver todas las noticias en la base de datos.<br>
                <strong>Nota:</strong> Las noticias deben estar publicadas (no marcadas como borrador, ocultas o archivadas).
              </small>
            </div>
          `;
        }
        
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
              ${debugInfo}
              <div class="mt-4">
                <a href="contact.html" class="btn btn-outline-primary">
                  <i class="fas fa-envelope mr-2"></i> Contáctanos para más información
                </a>
              </div>
            </div>
          </div>
        `;
        console.log('✅ Empty state rendered');
        return;
      }

      let html = '<div class="row">';
      blogs.forEach((blog, index) => {
        // Handle both blog format (titleEs) and featured news format (title)
        const title = blog.title || blog.titleEs || 'Sin título';
        const subtitle = blog.subtitle || blog.description || blog.subtitleEs || '';
        const date = blog.createdAt ? blog.createdAt.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : '';

        // Convert Quill Delta to HTML (simplified)
        let contentHtml = '';
        if (blog.contentEs && blog.contentEs.ops) {
          contentHtml = convertQuillDeltaToHTML(blog.contentEs);
        }

        // Extract plain text from HTML for excerpt, or use subtitle/description
        let excerpt = subtitle;
        if (contentHtml) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = contentHtml;
          const plainText = tempDiv.textContent || tempDiv.innerText || '';
          excerpt = plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
        }
        if (!excerpt) {
          excerpt = 'Sin descripción disponible.';
        }
        
        // Category colors and icons
        const categoryInfo = {
          'fiscal': { color: 'primary', icon: 'calculator', name: 'Fiscal' },
          'laboral': { color: 'success', icon: 'briefcase', name: 'Laboral' },
          'legal': { color: 'warning', icon: 'gavel', name: 'Legal' },
          'sucesiones': { color: 'info', icon: 'file-invoice', name: 'Sucesiones' },
          'general': { color: 'secondary', icon: 'file-alt', name: 'General' }
        };
        const catInfo = categoryInfo[blog.category?.toLowerCase()] || categoryInfo.general;
        
        // Render as small vignette/card
        html += `
          <div class="col-lg-4 col-md-6 mb-3" data-aos="fade-up" data-aos-delay="${index * 100}">
            <article class="featured-news-card card h-100 shadow-sm border-0" style="transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: pointer;" onclick="window.location.href='blog.html?id=${blog.id}'">
              <div class="card-body p-3">
                <div class="d-flex align-items-start mb-2">
                  <div class="flex-grow-1">
                    <div class="d-flex align-items-center mb-2">
                      <span class="badge badge-${catInfo.color} px-2 py-1 mr-2" style="font-size: 0.7rem; font-weight: 600;">
                        <i class="fas fa-${catInfo.icon} mr-1"></i> ${catInfo.name}
                      </span>
                      ${date ? `
                      <small class="text-muted" style="font-size: 0.75rem;">
                        <i class="far fa-calendar-alt mr-1"></i>${date}
                      </small>
                      ` : ''}
                    </div>
                    <h5 class="card-title mb-2" style="font-size: 1rem; font-weight: 600; line-height: 1.3; color: #2c3e50; margin: 0;">
                      ${title}
                    </h5>
                  </div>
                </div>
                <p class="card-text text-muted mb-2" style="font-size: 0.85rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                  ${excerpt}
                </p>
                <div class="d-flex justify-content-between align-items-center mt-2">
                  <a href="blog.html?id=${blog.id}" class="btn btn-sm btn-outline-${catInfo.color}" style="font-size: 0.8rem; padding: 0.25rem 0.75rem; border-radius: 15px;" onclick="event.stopPropagation();">
                    Leer más <i class="fas fa-arrow-right ml-1" style="font-size: 0.7rem;"></i>
                  </a>
                </div>
              </div>
            </article>
          </div>
        `;
      });
      html += '</div>';
      
      console.log('✅ Rendering', blogs.length, 'blogs to container');
      // Clear and set new content
      container.innerHTML = '';
      container.innerHTML = html;
      console.log('✅ Content rendered successfully');

      // Add hover effects to featured news cards
      const featuredCards = container.querySelectorAll('.featured-news-card');
      featuredCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-3px)';
          this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });
        card.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = '';
        });
      });

    } catch (error) {
      console.error('❌ Error rendering blogs:', error);
      console.error('Error stack:', error.stack);
      // Clear container completely
      container.innerHTML = '';
      container.innerHTML = `
        <div class="col-12">
          <div class="alert alert-warning text-center py-4" role="alert">
            <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
            <h4 class="alert-heading">Error al cargar los artículos</h4>
            <p class="mb-0">No se pudieron cargar los artículos en este momento. Por favor, intenta de nuevo más tarde.</p>
            <p class="mt-2 small text-muted">Error: ${error.message}</p>
          </div>
        </div>
      `;
      console.log('✅ Error state rendered');
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
          
          // Manejar tanto string como objeto para insert.image
          let imgSrc = '';
          let imgStyle = '';
          
          // Obtener el src de la imagen
          if (typeof op.insert.image === 'string') {
            // Formato estándar: string (URL)
            imgSrc = op.insert.image;
          } else if (typeof op.insert.image === 'object' && op.insert.image !== null) {
            // Formato nuevo: objeto con src, width, height
            imgSrc = op.insert.image.src || op.insert.image || '';
            if (op.insert.image.width) {
              imgStyle += `width: ${op.insert.image.width}; `;
            }
            if (op.insert.image.height) {
              imgStyle += `height: ${op.insert.image.height}; `;
            }
          } else {
            // Fallback: intentar obtener el src de cualquier manera
            imgSrc = op.insert.image || '';
          }
          
          // También verificar atributos (formato estándar donde se guardan los estilos)
          if (op.attributes) {
            if (op.attributes['data-width']) {
              imgStyle += `width: ${op.attributes['data-width']}; `;
            }
            if (op.attributes['data-height']) {
              imgStyle += `height: ${op.attributes['data-height']}; `;
            }
          }
          
          // Solo agregar la imagen si tiene un src válido
          if (imgSrc) {
            // Si hay estilos personalizados, usar !important y no usar img-fluid
            if (imgStyle) {
              // Agregar !important a cada propiedad y también agregar object-fit: contain para mantener proporción
              const importantStyle = imgStyle
                .split(';')
                .filter(s => s.trim())
                .map(s => s.trim() + ' !important')
                .join('; ') + '; object-fit: contain !important;';
              html += `<img src="${imgSrc}" alt="" class="mb-3" style="${importantStyle}">`;
            } else {
              html += `<img src="${imgSrc}" alt="" class="img-fluid mb-3">`;
            }
          }
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
    loadFeaturedNews,
    loadPageContent,
    renderBlogs,
    updatePageContent
  };

})();


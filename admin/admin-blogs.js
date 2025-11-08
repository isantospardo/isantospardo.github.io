  // Blog Management
  (function() {
    'use strict';

  const { db, auth, storage } = window.firebaseServices;
  let quillEditor = null;
  let currentCategoryFilter = 'fiscal'; // Filtro inicial: fiscal
  let allBlogs = [];

  // Definir colores de importancia personalizados (global)
  const importanceColors = {
    'green': '#d4edda',    // Verde claro - Importante
    'yellow': '#fff3cd',   // Amarillo claro - Advertencia
    'red': '#f8d7da'       // Rojo claro - Crítico
  };

  // Función para agregar botones de importancia al toolbar
  function addImportanceButtons(editor) {
    const toolbar = editor.getModule('toolbar');
    const toolbarContainer = toolbar.container;
    
    // Verificar si los botones ya existen
    if (toolbarContainer.querySelector('.ql-importance-group')) {
      return; // Ya están agregados
    }
    
    // Crear contenedor principal - los estilos están en CSS
    const importanceGroup = document.createElement('span');
    importanceGroup.className = 'ql-formats ql-importance-group';
    
    // Crear botones con diseño elegante - solo emoji por defecto, texto en hover
    const createImportanceButton = (color, label, icon, title) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `ql-importance-${color}`;
      button.title = title;
      button.innerHTML = `<span class="ql-importance-icon">${icon}</span><span class="ql-importance-text">${label}</span>`;
      return button;
    };
    
    // Crear botón para quitar resaltado
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'ql-importance-remove';
    removeButton.title = 'Quitar resaltado';
    removeButton.innerHTML = '<span class="ql-importance-icon"><i class="fas fa-eraser"></i></span><span class="ql-importance-text">Quitar</span>';
    
    // Agregar botones al grupo
    importanceGroup.appendChild(createImportanceButton('green', 'Importante', '🟢', 'Resaltar en verde (Importante)'));
    importanceGroup.appendChild(createImportanceButton('yellow', 'Advertencia', '🟡', 'Resaltar en amarillo (Advertencia)'));
    importanceGroup.appendChild(createImportanceButton('red', 'Crítico', '🔴', 'Resaltar en rojo (Crítico)'));
    importanceGroup.appendChild(removeButton);
    
    // Insertar después del último grupo de formatos
    const lastFormatGroup = toolbarContainer.querySelector('.ql-formats:last-of-type');
    if (lastFormatGroup) {
      toolbarContainer.insertBefore(importanceGroup, lastFormatGroup.nextSibling);
    } else {
      toolbarContainer.appendChild(importanceGroup);
    }

    // Agregar event listeners
    importanceGroup.querySelector('.ql-importance-green').addEventListener('click', function(e) {
      e.preventDefault();
      editor.format('background', importanceColors.green);
    });
    
    importanceGroup.querySelector('.ql-importance-yellow').addEventListener('click', function(e) {
      e.preventDefault();
      editor.format('background', importanceColors.yellow);
    });
    
    importanceGroup.querySelector('.ql-importance-red').addEventListener('click', function(e) {
      e.preventDefault();
      editor.format('background', importanceColors.red);
    });
    
    removeButton.addEventListener('click', function(e) {
      e.preventDefault();
      editor.format('background', false);
    });
  }

  // Módulo personalizado para redimensionar imágenes en Quill
  // NOTA: No modificamos el formato de imagen de Quill, solo agregamos funcionalidad de redimensionamiento
  // Los estilos se guardan en op.attributes['data-width'] y op.attributes['data-height']
  
  // Agregar funcionalidad de redimensionamiento a las imágenes
  function addImageResizeHandlers(editor) {
    if (!editor || !editor.root) {
      console.error('Editor no válido para agregar handles de redimensionamiento');
      return;
    }
    
    const quill = editor;
    const editorContainer = quill.root;
    const editorElement = editorContainer.parentElement; // El contenedor .ql-editor
    
    console.log('🔧 Inicializando redimensionamiento de imágenes en:', editorContainer);
    
    // Limpiar cualquier inicialización anterior
    const existingHandles = document.querySelectorAll('.ql-image-resize-handle');
    existingHandles.forEach(handle => handle.remove());
    
    // Limpiar overlay si existe
    const existingOverlay = document.getElementById('ql-image-resize-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }
    
    // Crear un overlay absoluto para los handles
    let overlay = document.getElementById('ql-image-resize-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'ql-image-resize-overlay';
      overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10000;
      `;
      
      // Insertar el overlay después del editor
      if (editorElement) {
        editorElement.style.position = 'relative';
        editorElement.appendChild(overlay);
      } else {
        editorContainer.parentElement.appendChild(overlay);
      }
    }
    
    // Función para crear handles de redimensionamiento
    function createResizeHandle(position, imgRect, overlayRect) {
      const handle = document.createElement('div');
      handle.className = 'ql-image-resize-handle';
      handle.dataset.position = position;
      
      // Cursor según la posición
      const cursors = {
        'nw': 'nwse-resize',
        'ne': 'nesw-resize',
        'sw': 'nesw-resize',
        'se': 'nwse-resize'
      };
      
      const handleSize = 20;
      const offset = -handleSize / 2;
      
      // Calcular posición absoluta relativa al overlay
      let left = 0, top = 0;
      if (position === 'nw') {
        left = imgRect.left - overlayRect.left + offset;
        top = imgRect.top - overlayRect.top + offset;
      } else if (position === 'ne') {
        left = imgRect.right - overlayRect.left + offset;
        top = imgRect.top - overlayRect.top + offset;
      } else if (position === 'sw') {
        left = imgRect.left - overlayRect.left + offset;
        top = imgRect.bottom - overlayRect.top + offset;
      } else if (position === 'se') {
        left = imgRect.right - overlayRect.left + offset;
        top = imgRect.bottom - overlayRect.top + offset;
      }
      
      // Aplicar estilos inline para asegurar visibilidad - SIEMPRE VISIBLES
      handle.style.cssText = `
        position: absolute !important;
        width: ${handleSize}px !important;
        height: ${handleSize}px !important;
        background: #007f7e !important;
        border: 3px solid white !important;
        border-radius: 50% !important;
        cursor: ${cursors[position] || 'nwse-resize'} !important;
        z-index: 10001 !important;
        display: block !important;
        visibility: visible !important;
        box-shadow: 0 3px 8px rgba(0,0,0,0.5) !important;
        pointer-events: all !important;
        user-select: none !important;
        opacity: 1 !important;
        margin: 0 !important;
        padding: 0 !important;
        left: ${left}px !important;
        top: ${top}px !important;
      `;
      
      // Asegurar que siempre estén visibles
      handle.setAttribute('data-always-visible', 'true');
      
      return handle;
    }
    
    // Función para actualizar handles de una imagen
    function updateImageHandles(img) {
      if (!img) {
        return;
      }
      
      // Asegurar que el overlay existe
      let overlay = document.getElementById('ql-image-resize-overlay');
      if (!overlay) {
        console.warn('Overlay no encontrado, recreando...');
        overlay = document.createElement('div');
        overlay.id = 'ql-image-resize-overlay';
        overlay.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 10000;
        `;
        const editorElement = editorContainer.parentElement;
        if (editorElement) {
          editorElement.style.position = 'relative';
          editorElement.appendChild(overlay);
        }
      }
      
      if (!overlay) {
        return;
      }
      
      // Asegurar que los estilos de la imagen se preserven
      if (img.style.width) {
        img.setAttribute('data-width', img.style.width);
      }
      if (img.style.height) {
        img.setAttribute('data-height', img.style.height);
      }
      
      // Obtener posición de la imagen y del overlay
      const imgRect = img.getBoundingClientRect();
      const overlayRect = overlay.getBoundingClientRect();
      
      // Eliminar handles existentes para esta imagen
      const existingHandles = overlay.querySelectorAll(`[data-image-id="${img.dataset.imageId}"]`);
      existingHandles.forEach(h => h.remove());
      
      // Crear ID único para la imagen si no existe
      if (!img.dataset.imageId) {
        img.dataset.imageId = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      }
      
      const positions = ['nw', 'ne', 'sw', 'se'];
      const handles = {};
      
      positions.forEach(pos => {
        const handle = createResizeHandle(pos, imgRect, overlayRect);
        handle.dataset.imageId = img.dataset.imageId;
        overlay.appendChild(handle);
        handles[pos] = handle;
      });
      
      console.log(`✅ Handles creados para imagen ${img.dataset.imageId}:`, Object.keys(handles).length);
      
      // Agregar eventos de redimensionamiento
      setupResizeEvents(img, handles);
    }
    
    // Función para configurar eventos de redimensionamiento
    function setupResizeEvents(img, handles) {
      const positions = ['nw', 'ne', 'sw', 'se'];
      
      positions.forEach(position => {
        const handle = handles[position];
        if (!handle) return;
        
        handle.addEventListener('mousedown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const imgRect = img.getBoundingClientRect();
          const startX = e.clientX;
          const startY = e.clientY;
          const startWidth = imgRect.width;
          const startHeight = imgRect.height;
          const startAspectRatio = startWidth / startHeight;
          
          const resizeHandler = (e) => {
            e.preventDefault();
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newWidth = startWidth;
            let newHeight = startHeight;
            
            if (position === 'se') {
              newWidth = Math.max(50, startWidth + deltaX);
              newHeight = Math.max(50, startHeight + deltaY);
            } else if (position === 'sw') {
              newWidth = Math.max(50, startWidth - deltaX);
              newHeight = Math.max(50, startHeight + deltaY);
            } else if (position === 'ne') {
              newWidth = Math.max(50, startWidth + deltaX);
              newHeight = Math.max(50, startHeight - deltaY);
            } else if (position === 'nw') {
              newWidth = Math.max(50, startWidth - deltaX);
              newHeight = Math.max(50, startHeight - deltaY);
            }
            
            if (e.shiftKey) {
              if (position === 'se' || position === 'nw') {
                newHeight = newWidth / startAspectRatio;
              } else {
                newWidth = newHeight * startAspectRatio;
              }
            }
            
            img.style.width = newWidth + 'px';
            img.style.height = newHeight + 'px';
            
            // Actualizar posiciones de handles
            updateImageHandles(img);
          };
          
          const stopHandler = () => {
            document.removeEventListener('mousemove', resizeHandler);
            document.removeEventListener('mouseup', stopHandler);
          };
          
          document.addEventListener('mousemove', resizeHandler);
          document.addEventListener('mouseup', stopHandler);
        });
      });
    }
    
    // Función para agregar handles a una imagen (versión simplificada)
    function addResizeHandles(img) {
      if (!img) {
        return;
      }
      
      // Esperar a que la imagen se cargue
      if (!img.complete || img.naturalWidth === 0) {
        img.addEventListener('load', () => {
          updateImageHandles(img);
        }, { once: true });
        return;
      }
      
      updateImageHandles(img);
      
      // Asegurar que la imagen tenga estilos necesarios
      // Solo aplicar estilos por defecto si no hay estilos personalizados guardados
      if (!img.getAttribute('data-width') && (!img.style.width || img.style.width === '')) {
        const naturalWidth = img.naturalWidth || img.width || 400;
        img.style.width = Math.min(naturalWidth, 600) + 'px';
      }
      if (!img.getAttribute('data-height') && (!img.style.height || img.style.height === '' || img.style.height === 'auto')) {
        if (img.style.width && img.naturalWidth && img.naturalHeight) {
          const widthValue = parseFloat(img.style.width);
          const aspectRatio = img.naturalHeight / img.naturalWidth;
          img.style.height = (widthValue * aspectRatio) + 'px';
        } else {
          img.style.height = 'auto';
        }
      }
      
      img.style.display = 'inline-block';
      // Solo aplicar max-width: 100% si no hay estilos personalizados
      if (!img.getAttribute('data-width')) {
        img.style.maxWidth = '100%';
      } else {
        // Si hay estilos personalizados, usar el width como max-width
        img.style.maxWidth = img.style.width || img.getAttribute('data-width');
      }
      img.style.cursor = 'default';
      img.style.verticalAlign = 'middle';
    }
    
    // Función para inicializar handles en todas las imágenes
    function initAllImages() {
      const images = editorContainer.querySelectorAll('img');
      console.log('🖼️ Inicializando handles para', images.length, 'imágenes');
      
      images.forEach((img, index) => {
        console.log(`Procesando imagen ${index + 1}/${images.length}:`, img.src);
        addResizeHandles(img);
      });
      
      // Actualizar posiciones periódicamente
      const updateAllHandles = () => {
        images.forEach(img => {
          if (img.complete && img.naturalWidth > 0) {
            updateImageHandles(img);
          }
        });
      };
      
      // Actualizar cuando se hace scroll o resize
      window.addEventListener('scroll', updateAllHandles, true);
      window.addEventListener('resize', updateAllHandles);
      
      // Actualizar cuando cambia el contenido del editor
      quill.on('text-change', () => {
        setTimeout(updateAllHandles, 100);
      });
    }
    
    // Agregar listener global para clicks en imágenes dentro del editor
    editorContainer.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        console.log('🖱️ Click detectado en imagen, actualizando handles...');
        updateImageHandles(e.target);
      }
    });
    
    // Actualizar handles cuando se hace hover sobre imágenes
    editorContainer.addEventListener('mouseenter', (e) => {
      if (e.target.tagName === 'IMG') {
        updateImageHandles(e.target);
      }
    }, true);
    
    // Observar cuando se insertan imágenes - más agresivo
    const observer = new MutationObserver((mutations) => {
      let hasNewImages = false;
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            if (node.tagName === 'IMG' || node.querySelector('img')) {
              hasNewImages = true;
            }
          }
        });
      });
      if (hasNewImages) {
        console.log('Nueva imagen detectada en DOM');
        // Aplicar estilos guardados a las nuevas imágenes
        setTimeout(() => {
          const images = editorContainer.querySelectorAll('img');
          images.forEach(img => {
            // Restaurar estilos desde atributos
            if (img.getAttribute('data-width')) {
              img.style.width = img.getAttribute('data-width');
            }
            if (img.getAttribute('data-height')) {
              img.style.height = img.getAttribute('data-height');
            }
          });
          initAllImages();
        }, 100);
      }
    });
    
    observer.observe(editorContainer, {
      childList: true,
      subtree: true,
      attributes: false
    });
    
    // Escuchar eventos de Quill - especialmente cuando se inserta una imagen
    quill.on('editor-change', (eventName, ...args) => {
      if (eventName === 'text-change' || eventName === 'selection-change') {
        setTimeout(initAllImages, 100);
      }
    });
    
    quill.on('text-change', () => {
      setTimeout(initAllImages, 100);
    });
    
    // Interceptar cuando Quill inserta una imagen
    const originalImageHandler = quill.getModule('toolbar').handlers.image;
    if (originalImageHandler) {
      quill.getModule('toolbar').handlers.image = function() {
        const result = originalImageHandler.apply(this, arguments);
        // Después de insertar imagen, esperar y agregar handles
        setTimeout(() => {
          console.log('Imagen insertada, agregando handles');
          initAllImages();
        }, 200);
        return result;
      };
    }
    
    // Inicializar imágenes existentes - múltiples intentos
    setTimeout(initAllImages, 100);
    setTimeout(initAllImages, 300);
    setTimeout(initAllImages, 600);
    setTimeout(initAllImages, 1000);
    
    // También inicializar cuando el editor está listo
    if (document.readyState === 'complete') {
      setTimeout(initAllImages, 500);
    } else {
      window.addEventListener('load', () => {
        setTimeout(initAllImages, 500);
      });
    }
  }

  // Initialize Quill editor
  function initQuillEditor() {
    if (!quillEditor) {
      quillEditor = new Quill('#blogContentEs', {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'color': [] }, { 'background': [] }],
              ['link', 'image'],
              ['clean']
            ],
            handlers: {
              'link': function(value) {
                if (value) {
                  // Permitir enlaces externos
                  const href = prompt('Introduce la URL del enlace:');
                  if (href) {
                    this.quill.format('link', href);
                  }
                } else {
                  this.quill.format('link', false);
                }
              }
            }
          }
        }
      });

      // Agregar botones personalizados de importancia después de inicializar
      setTimeout(() => {
        try {
          addImportanceButtons(quillEditor);
          addImageResizeHandlers(quillEditor);
        } catch (error) {
          console.error('Error al inicializar funciones del editor:', error);
        }
      }, 100);
    } else {
      // Si el editor ya existe, asegurarse de que los botones estén agregados
      setTimeout(() => {
        try {
          addImportanceButtons(quillEditor);
          addImageResizeHandlers(quillEditor);
        } catch (error) {
          console.error('Error al inicializar funciones del editor:', error);
        }
      }, 100);
    }
    
    // Hacer la función disponible globalmente para poder llamarla desde loadBlogData
    window.addImageResizeHandlers = addImageResizeHandlers;
    
    // También hacer disponible una función de depuración para forzar inicialización
    window.forceInitImageHandles = function() {
      if (quillEditor && quillEditor.root) {
        const images = quillEditor.root.querySelectorAll('img');
        console.log('Forzando inicialización de handles para', images.length, 'imágenes');
        images.forEach(img => {
          img.dataset.resizeHandles = 'false';
        });
        addImageResizeHandlers(quillEditor);
        alert(`Handles inicializados para ${images.length} imagen(es). Revisa la consola para más detalles.`);
      } else {
        alert('El editor no está inicializado. Abre un blog primero.');
      }
    };
    
    return quillEditor;
  }

  // Función para obtener el color y nombre de la categoría
  function getCategoryInfo(category) {
    const categories = {
      'fiscal': { name: 'Fiscal', color: 'danger', icon: 'calculator' },
      'laboral': { name: 'Laboral', color: 'success', icon: 'briefcase' },
      'legal': { name: 'Legal', color: 'info', icon: 'gavel' },
      'sucesiones': { name: 'Sucesiones', color: 'warning', icon: 'file-invoice' },
    };
    return categories[category] || { name: category || 'Sin categoría', color: 'secondary', icon: 'folder' };
  }

  // Renderizar blogs con filtro
  function renderBlogs(blogs) {
    const blogsList = document.getElementById('blogsList');
    
    // Filtrar blogs según la categoría seleccionada
    const filteredBlogs = blogs.filter(blog => blog.category === currentCategoryFilter);

    if (filteredBlogs.length === 0) {
      const categoryName = getCategoryInfo(currentCategoryFilter).name.toLowerCase();
      blogsList.innerHTML = `
        <div class="card-body">
          <p class="text-muted">No hay ${categoryName} aún. Crea tu primer blog haciendo clic en "Nuevo Blog".</p>
        </div>
      `;
      return;
    }

    // Filtrar blogs archivados (por flag o por estado)
    const activeBlogs = filteredBlogs.filter(blog => !blog.archived && blog.status !== 'archived');
    const archivedBlogs = filteredBlogs.filter(blog => blog.archived === true || blog.status === 'archived');
    
    // Ordenar blogs activos por order (si existe) o por fecha
    activeBlogs.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
      return dateB - dateA;
    });
    
    let html = '<div class="card-body">';
    
    // Tabla de blogs activos
    html += '<h5 class="mb-3">Blogs Activos</h5>';
    html += '<table class="table table-hover"><thead><tr><th style="width: 50px;">Orden</th><th style="width: 50px;">Oculto</th><th>Título</th><th>Categoría</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead><tbody>';
    
    activeBlogs.forEach((blog, index) => {
      const categoryInfo = getCategoryInfo(blog.category);
      const date = blog.createdAt ? blog.createdAt.toDate().toLocaleDateString() : 'N/A';
      const isHidden = blog.hidden === true;
      html += `
        <tr class="${isHidden ? 'table-secondary' : ''}" data-id="${blog.id}">
          <td>
            <div class="btn-group-vertical btn-group-sm">
              <button class="btn btn-sm btn-outline-secondary move-up-btn" data-id="${blog.id}" ${index === 0 ? 'disabled' : ''} title="Mover arriba">
                <i class="fas fa-arrow-up"></i>
              </button>
              <button class="btn btn-sm btn-outline-secondary move-down-btn" data-id="${blog.id}" ${index === activeBlogs.length - 1 ? 'disabled' : ''} title="Mover abajo">
                <i class="fas fa-arrow-down"></i>
              </button>
            </div>
          </td>
          <td>
            <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input toggle-hidden-btn" id="hidden-${blog.id}" data-id="${blog.id}" ${isHidden ? 'checked' : ''}>
              <label class="custom-control-label" for="hidden-${blog.id}"></label>
            </div>
          </td>
          <td>
            <strong>${blog.titleEs || 'Sin título'}</strong>
            ${isHidden ? '<span class="badge badge-secondary ml-2">Oculto</span>' : ''}
          </td>
          <td>
            <span class="badge badge-${categoryInfo.color}">
              <i class="fas fa-${categoryInfo.icon} mr-1"></i>${categoryInfo.name}
            </span>
          </td>
          <td><span class="badge badge-${blog.status === 'published' ? 'success' : blog.status === 'archived' ? 'secondary' : 'warning'}">${blog.status || 'draft'}</span></td>
          <td>${date}</td>
          <td>
            <button class="btn btn-sm btn-primary edit-blog-btn" data-id="${blog.id}">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-sm btn-warning archive-blog-btn" data-id="${blog.id}" title="Archivar">
              <i class="fas fa-archive"></i>
            </button>
            <button class="btn btn-sm btn-danger delete-blog-btn" data-id="${blog.id}">
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    
    // Sección de blogs archivados
    if (archivedBlogs.length > 0) {
      html += '<hr class="my-4">';
      html += '<h5 class="mb-3">Blogs Archivados</h5>';
      html += '<table class="table table-hover table-sm"><thead><tr><th>Título</th><th>Categoría</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead><tbody>';
      
      archivedBlogs.forEach(blog => {
        const categoryInfo = getCategoryInfo(blog.category);
        const date = blog.createdAt ? blog.createdAt.toDate().toLocaleDateString() : 'N/A';
        html += `
          <tr class="table-secondary" data-id="${blog.id}">
            <td><strong>${blog.titleEs || 'Sin título'}</strong> <span class="badge badge-secondary ml-2">Archivado</span></td>
            <td>
              <span class="badge badge-${categoryInfo.color}">
                <i class="fas fa-${categoryInfo.icon} mr-1"></i>${categoryInfo.name}
              </span>
            </td>
            <td><span class="badge badge-secondary">archived</span></td>
            <td>${date}</td>
            <td>
              <button class="btn btn-sm btn-success unarchive-blog-btn" data-id="${blog.id}" title="Desarchivar">
                <i class="fas fa-undo"></i> Desarchivar
              </button>
              <button class="btn btn-sm btn-danger delete-blog-btn" data-id="${blog.id}">
                <i class="fas fa-trash"></i> Eliminar
              </button>
            </td>
          </tr>
        `;
      });
      
      html += '</tbody></table>';
    }
    
    html += '</div>';
    blogsList.innerHTML = html;

    // Add event listeners
    document.querySelectorAll('.edit-blog-btn').forEach(btn => {
      btn.addEventListener('click', () => editBlog(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.delete-blog-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteBlog(btn.getAttribute('data-id')));
    });
    
    // Event listeners para toggle hidden
    document.querySelectorAll('.toggle-hidden-btn').forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        toggleBlogHidden(this.getAttribute('data-id'), this.checked);
      });
    });
    
    // Event listeners para mover arriba/abajo
    document.querySelectorAll('.move-up-btn').forEach(btn => {
      btn.addEventListener('click', () => moveBlogUp(btn.getAttribute('data-id')));
    });
    
    document.querySelectorAll('.move-down-btn').forEach(btn => {
      btn.addEventListener('click', () => moveBlogDown(btn.getAttribute('data-id')));
    });
    
    // Event listeners para archivar/desarchivar
    document.querySelectorAll('.archive-blog-btn').forEach(btn => {
      btn.addEventListener('click', () => archiveBlog(btn.getAttribute('data-id')));
    });
    
    document.querySelectorAll('.unarchive-blog-btn').forEach(btn => {
      btn.addEventListener('click', () => unarchiveBlog(btn.getAttribute('data-id')));
    });
  }

  // Load blogs list
  window.loadBlogs = async function() {
    const blogsList = document.getElementById('blogsList');
    blogsList.innerHTML = '<div class="card-body"><p class="text-muted">Cargando blogs...</p></div>';

    try {
      // Check if db is available
      if (!db) {
        throw new Error('Firebase Firestore no está inicializado');
      }

      console.log('Cargando blogs desde Firestore...');
      
      // Try to get blogs - if orderBy fails, try without it
      let snapshot;
      try {
        snapshot = await db.collection('blogs')
          .orderBy('createdAt', 'desc')
          .get();
      } catch (orderError) {
        // If orderBy fails (maybe no index), try without ordering
        console.warn('Error al ordenar por createdAt, intentando sin orden:', orderError);
        snapshot = await db.collection('blogs').get();
      }

      console.log(`Encontrados ${snapshot.size} blog(s)`);

      // Guardar todos los blogs en memoria
      allBlogs = [];
      snapshot.forEach(doc => {
        const blog = doc.data();
        allBlogs.push({
          id: doc.id,
          ...blog
        });
      });

      // Ordenar por fecha si no se pudo ordenar en la consulta
      if (allBlogs.length > 0 && allBlogs[0].createdAt) {
        allBlogs.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
          return dateB - dateA; // Más reciente primero
        });
      }

      // Renderizar blogs con el filtro actual
      renderBlogs(allBlogs);
      
      // Inicializar filtros después de cargar los blogs
      setTimeout(initCategoryFilters, 100);

    } catch (error) {
      console.error('❌ Error loading blogs:', error);
      console.error('Detalles:', {
        code: error.code,
        message: error.message
      });
      
      let errorMessage = 'Error al cargar blogs';
      if (error.code === 'permission-denied') {
        errorMessage = 'Error de permisos. Verifica las reglas de Firestore.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Firestore no está disponible. Verifica tu conexión.';
      } else {
        errorMessage = 'Error: ' + error.message;
      }
      
      blogsList.innerHTML = `
        <div class="card-body">
          <div class="alert alert-danger">
            <strong>Error al cargar blogs</strong><br>
            ${errorMessage}<br>
            <small>Código: ${error.code || 'N/A'}</small>
          </div>
          <p class="text-muted">Abre la consola del navegador (F12) para más detalles.</p>
        </div>
      `;
    }
  };

  // Inicializar filtros de categoría
  function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.category-filter');
    if (filterButtons.length === 0) {
      // Si los filtros aún no están disponibles, intentar de nuevo más tarde
      setTimeout(initCategoryFilters, 100);
      return;
    }
    
    filterButtons.forEach(btn => {
      // Remover listeners anteriores si existen (usando delegación de eventos)
      btn.onclick = null;
      
      btn.addEventListener('click', function() {
        // Remover clase active de todos los botones
        filterButtons.forEach(b => b.classList.remove('active'));
        // Agregar clase active al botón clickeado
        this.classList.add('active');
        // Actualizar filtro actual
        currentCategoryFilter = this.getAttribute('data-category');
        // Re-renderizar blogs con el nuevo filtro
        if (allBlogs.length > 0) {
          renderBlogs(allBlogs);
        }
      });
    });
  }

  // Inicializar filtros cuando se carga la página
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initCategoryFilters, 200);
    });
  } else {
    setTimeout(initCategoryFilters, 200);
  }

  // New blog button
  document.getElementById('newBlogBtn').addEventListener('click', function() {
    openBlogEditor();
  });

  // Función para importar blogs existentes - REMOVIDA
  // Usar admin/import-blogs-once.html para importar blogs desde archivos HTML
  /*
  async function importExistingBlogs() {
    if (!confirm('¿Deseas importar los blogs existentes desde la carpeta posts/?\n\nEsto creará nuevos blogs en Firebase basándose en los archivos HTML existentes.')) {
      return;
    }

    const importBtn = document.getElementById('importBlogsBtn');
    const originalText = importBtn.innerHTML;
    importBtn.disabled = true;
    importBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Importando...';

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No estás autenticado. Por favor, inicia sesión primero.');
      }

      // Mapeo de carpetas a categorías
      const categoryMap = {
        'post-fiscal': 'fiscal',
        'post-laboral': 'laboral',
        'post-legal': 'legal',
        'post-sucesiones': 'sucesiones'
      };

      // Lista de posts a importar (hardcoded basándose en la estructura de archivos)
      const postsToImport = [
        { file: 'posts/post-fiscal/20200424-fiscal.html', category: 'fiscal' },
        { file: 'posts/post-fiscal/20200425-fiscal.html', category: 'fiscal' },
        { file: 'posts/post-laboral/20200424-laboral.html', category: 'laboral' },
        { file: 'posts/post-laboral/20200425-laboral.html', category: 'laboral' },
        { file: 'posts/post-legal/20200424-legal.html', category: 'legal' },
        { file: 'posts/post-legal/20200425-legal.html', category: 'legal' },
        { file: 'posts/post-sucesiones/20200424-sucesiones.html', category: 'sucesiones' },
        { file: 'posts/post-sucesiones/20200425-sucesiones.html', category: 'sucesiones' }
      ];

      let imported = 0;
      let errors = 0;
      const results = [];

      for (const post of postsToImport) {
        try {
          // Intentar cargar el archivo HTML
          const response = await fetch(post.file);
          if (!response.ok) {
            throw new Error(`No se pudo cargar ${post.file}`);
          }

          const htmlContent = await response.text();
          
          // Parsear HTML usando DOMParser
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlContent, 'text/html');
          
          // Extraer título
          const postHeading = doc.querySelector('.post-heading');
          let title = 'Sin título';
          let subtitle = '';
          
          if (postHeading) {
            const h1 = postHeading.querySelector('h1');
            if (h1) {
              const clone = h1.cloneNode(true);
              const logo = clone.querySelector('img');
              if (logo) logo.remove();
              title = clone.textContent.trim() || 'Sin título';
            }
            
            const h2 = postHeading.querySelector('h2.subheading');
            if (h2) {
              subtitle = h2.textContent.trim();
            }
          }
          
          // Extraer fecha
          let date = null;
          const meta = doc.querySelector('.meta');
          if (meta) {
            const metaText = meta.textContent;
            const dateMatch = metaText.match(/el\s+(\d+)\s+de\s+(\w+),\s+(\d+)/i);
            if (dateMatch) {
              const day = parseInt(dateMatch[1]);
              const monthName = dateMatch[2].toLowerCase();
              const year = parseInt(dateMatch[3]);
              
              const months = {
                'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
                'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
              };
              
              if (months[monthName] !== undefined) {
                date = new Date(year, months[monthName], day);
              }
            }
          }
          
          // Extraer contenido
          const article = doc.querySelector('article .col-lg-8, article .col-md-10');
          let contentHtml = '';
          if (article) {
            const clone = article.cloneNode(true);
            const lastP = clone.querySelector('p:last-child');
            if (lastP && lastP.textContent.includes('Placeholder text')) {
              lastP.remove();
            }
            contentHtml = clone.innerHTML;
          }
          
          // Convertir HTML a Quill Delta simple
          const contentDelta = htmlToQuillDelta(contentHtml);
          
          // Crear blog en Firebase
          const blogData = {
            titleEs: title,
            contentEs: contentDelta,
            category: post.category,
            status: 'published',
            createdAt: date ? firebase.firestore.Timestamp.fromDate(date) : firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            authorId: user.uid,
            imported: true,
            originalFile: post.file.split('/').pop()
          };
          
          await db.collection('blogs').add(blogData);
          imported++;
          results.push(`✅ ${title} (${post.category})`);
          
        } catch (error) {
          errors++;
          results.push(`❌ ${post.file}: ${error.message}`);
          console.error(`Error al importar ${post.file}:`, error);
        }
      }

      // Mostrar resultados
      const resultMessage = `Importación completada!\n\n✅ Importados: ${imported}\n❌ Errores: ${errors}\n\n${results.join('\n')}`;
      alert(resultMessage);
      
      // Recargar lista de blogs
      await loadBlogs();

    } catch (error) {
      console.error('Error durante la importación:', error);
      alert('Error al importar blogs: ' + error.message);
    } finally {
      importBtn.disabled = false;
      importBtn.innerHTML = originalText;
    }
  }
  */

  // Función para convertir HTML a Quill Delta (versión simplificada)
  function htmlToQuillDelta(html) {
    if (!html || html.trim() === '') {
      return { ops: [{ insert: '\n' }] };
    }

    // Crear un elemento temporal para parsear HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const ops = [];
    
    function processNode(node) {
      if (node.nodeType === 3) { // Text node
        const text = node.textContent;
        if (text.trim()) {
          ops.push({ insert: text });
        }
      } else if (node.nodeType === 1) { // Element node
        const tagName = node.tagName.toLowerCase();
        
        if (tagName === 'p') {
          if (ops.length > 0 && ops[ops.length - 1].insert !== '\n') {
            ops.push({ insert: '\n' });
          }
          Array.from(node.childNodes).forEach(processNode);
          ops.push({ insert: '\n' });
        } else if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
          if (ops.length > 0 && ops[ops.length - 1].insert !== '\n') {
            ops.push({ insert: '\n' });
          }
          const level = parseInt(tagName.charAt(1));
          Array.from(node.childNodes).forEach(processNode);
          ops.push({ insert: '\n', attributes: { header: level } });
        } else if (tagName === 'strong' || tagName === 'b') {
          const text = node.textContent;
          if (text) {
            ops.push({ insert: text, attributes: { bold: true } });
          }
        } else if (tagName === 'em' || tagName === 'i') {
          const text = node.textContent;
          if (text) {
            ops.push({ insert: text, attributes: { italic: true } });
          }
        } else if (tagName === 'ul' || tagName === 'ol') {
          Array.from(node.querySelectorAll('li')).forEach((li) => {
            if (ops.length > 0 && ops[ops.length - 1].insert !== '\n') {
              ops.push({ insert: '\n' });
            }
            Array.from(li.childNodes).forEach(processNode);
            ops.push({ insert: '\n', attributes: { list: tagName === 'ul' ? 'bullet' : 'ordered' } });
          });
        } else if (tagName === 'blockquote') {
          if (ops.length > 0 && ops[ops.length - 1].insert !== '\n') {
            ops.push({ insert: '\n' });
          }
          Array.from(node.childNodes).forEach(processNode);
          ops.push({ insert: '\n', attributes: { blockquote: true } });
        } else {
          Array.from(node.childNodes).forEach(processNode);
        }
      }
    }
    
    Array.from(tempDiv.childNodes).forEach(processNode);
    
    // Limpiar y normalizar
    const cleanedOps = [];
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];
      if (op.insert && op.insert !== '\n') {
        cleanedOps.push(op);
      } else if (op.insert === '\n') {
        if (cleanedOps.length === 0 || cleanedOps[cleanedOps.length - 1].insert !== '\n') {
          cleanedOps.push(op);
        }
      }
    }
    
    if (cleanedOps.length === 0 || cleanedOps[cleanedOps.length - 1].insert !== '\n') {
      cleanedOps.push({ insert: '\n' });
    }
    
    return { ops: cleanedOps };
  }

  // Open blog editor
  function openBlogEditor(blogId = null) {
    const modal = $('#blogEditorModal');
    const form = document.getElementById('blogForm');
    const editor = initQuillEditor();

    form.reset();
    document.getElementById('blogId').value = blogId || '';
    document.getElementById('blogSubtitleEs').value = '';
    editor.setContents([]);
    
    // Asegurar que el selector de estado esté habilitado para nuevos blogs
    const statusSelect = document.getElementById('blogStatus');
    statusSelect.disabled = false;
    statusSelect.title = '';

    if (blogId) {
      loadBlogData(blogId);
    } else {
      // Si es un nuevo blog, establecer la categoría según el filtro activo
      document.getElementById('blogCategory').value = currentCategoryFilter || 'fiscal';
      
      // Inicializar handles después de abrir el modal (para nuevas imágenes)
      setTimeout(() => {
        addImageResizeHandlers(editor);
      }, 300);
    }

    modal.modal('show');
    
    // Asegurar que los handles se inicialicen cuando el modal esté completamente visible
    modal.on('shown.bs.modal', function () {
      // Inicializar múltiples veces para asegurar que funcione
      setTimeout(() => {
        console.log('Modal visible, inicializando handles...');
        addImageResizeHandlers(editor);
      }, 200);
      
      setTimeout(() => {
        console.log('Segunda inicialización de handles...');
        addImageResizeHandlers(editor);
      }, 500);
      
      setTimeout(() => {
        console.log('Tercera inicialización de handles...');
        addImageResizeHandlers(editor);
      }, 1000);
    });
  }

  // Load blog data for editing
  async function loadBlogData(blogId) {
    try {
      const doc = await db.collection('blogs').doc(blogId).get();
      if (doc.exists) {
        const blog = doc.data();
        document.getElementById('blogTitleEs').value = blog.titleEs || '';
        document.getElementById('blogSubtitleEs').value = blog.subtitleEs || '';
        document.getElementById('blogCategory').value = blog.category || 'fiscal';
        const statusSelect = document.getElementById('blogStatus');
        statusSelect.value = blog.status || 'draft';
        
        // Si el blog está archivado, deshabilitar el selector de estado y mostrar mensaje
        if (blog.archived === true || blog.status === 'archived') {
          statusSelect.disabled = true;
          statusSelect.title = 'Los blogs archivados no pueden cambiar de estado. Desarchiva el blog primero.';
          // Agregar opción "archived" si no existe
          if (!Array.from(statusSelect.options).some(opt => opt.value === 'archived')) {
            const archivedOption = document.createElement('option');
            archivedOption.value = 'archived';
            archivedOption.textContent = 'Archivado';
            statusSelect.appendChild(archivedOption);
          }
        } else {
          statusSelect.disabled = false;
          statusSelect.title = '';
          // Remover opción "archived" si existe (no debería estar en el selector normal)
          const archivedOption = Array.from(statusSelect.options).find(opt => opt.value === 'archived');
          if (archivedOption) {
            archivedOption.remove();
          }
        }
        
        const editor = initQuillEditor();
        if (blog.contentEs) {
          // Modificar el Delta ANTES de pasarlo a Quill para aplicar estilos inmediatamente
          let contentToLoad = blog.contentEs;
          
          // NO modificar el formato del Delta - mantener op.insert.image como string
          // Los estilos se guardan en op.attributes y se aplicarán después
          
          // Función para aplicar estilos a imágenes inmediatamente
          const applyImageStyles = () => {
            if (editor && editor.root && blog.contentEs && blog.contentEs.ops) {
              const images = editor.root.querySelectorAll('img');
              
              images.forEach(img => {
                const imgSrc = img.src;
                // Buscar el op correspondiente - manejar tanto string como objeto
                const matchingOp = blog.contentEs.ops.find(op => {
                  if (op.insert && typeof op.insert === 'object' && op.insert.image) {
                    const opImgSrc = typeof op.insert.image === 'string' 
                      ? op.insert.image 
                      : (op.insert.image.src || op.insert.image);
                    return opImgSrc === imgSrc;
                  }
                  return false;
                });
                
                if (matchingOp && matchingOp.attributes) {
                  // Aplicar estilos INMEDIATAMENTE
                  if (matchingOp.attributes['data-width']) {
                    img.style.width = matchingOp.attributes['data-width'];
                    img.setAttribute('data-width', matchingOp.attributes['data-width']);
                  }
                  if (matchingOp.attributes['data-height']) {
                    img.style.height = matchingOp.attributes['data-height'];
                    img.setAttribute('data-height', matchingOp.attributes['data-height']);
                  }
                }
                
                img.dataset.resizeHandles = 'false';
              });
            }
          };
          
          // Usar MutationObserver para aplicar estilos INMEDIATAMENTE cuando se insertan imágenes
          const observer = new MutationObserver((mutations) => {
            let hasImages = false;
            mutations.forEach(mutation => {
              mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && (node.tagName === 'IMG' || node.querySelector('img'))) {
                  hasImages = true;
                }
              });
            });
            
            if (hasImages) {
              // Aplicar estilos inmediatamente cuando se detecta una imagen
              applyImageStyles();
            }
          });
          
          // Observar el editor antes de cargar el contenido
          observer.observe(editor.root, {
            childList: true,
            subtree: true
          });
          
          // Handle both Delta format and plain object format
          if (contentToLoad.ops) {
            editor.setContents(contentToLoad);
          } else if (typeof contentToLoad === 'object') {
            // If it's already a Delta-compatible object, use it directly
            editor.setContents(contentToLoad);
          }
          
          // Aplicar estilos INMEDIATAMENTE después de setContents
          applyImageStyles();
          
          // Aplicar también en el siguiente frame para asegurar
          requestAnimationFrame(() => {
            applyImageStyles();
            
            // Re-inicializar handles para todas las imágenes
            const initFunction = window.addImageResizeHandlers;
            if (initFunction) {
              initFunction(editor);
            } else {
              addImageResizeHandlers(editor);
            }
            
            // Desconectar el observer después de aplicar estilos
            setTimeout(() => {
              observer.disconnect();
            }, 1000);
          });
          
        }

      }
    } catch (error) {
      console.error('Error loading blog:', error);
      alert('Error al cargar el blog');
    }
  }

  // Edit blog
  async function editBlog(blogId) {
    openBlogEditor(blogId);
  }

  // Save blog
  document.getElementById('saveBlogBtn').addEventListener('click', async function() {
    const blogId = document.getElementById('blogId').value;
    const titleEs = document.getElementById('blogTitleEs').value;
    const subtitleEs = document.getElementById('blogSubtitleEs').value;
    const category = document.getElementById('blogCategory').value;
    const status = document.getElementById('blogStatus').value;
    const editor = initQuillEditor();
    
    // IMPORTANTE: Preservar estilos inline de las imágenes antes de obtener el contenido
    // Quill puede perder los estilos width/height, así que los preservamos manualmente
    const images = editor.root.querySelectorAll('img');
    const imageStyles = {};
    images.forEach((img, index) => {
      const imgId = img.dataset.imageId || `img_${index}`;
      imageStyles[imgId] = {
        width: img.style.width || '',
        height: img.style.height || '',
        src: img.src
      };
      // Asegurar que los estilos se guarden como atributos de datos
      if (img.style.width) {
        img.setAttribute('data-width', img.style.width);
      }
      if (img.style.height) {
        img.setAttribute('data-height', img.style.height);
      }
    });
    
    const contentEsDelta = editor.getContents(); // This is a Delta object
    
    // Modificar el Delta para preservar los estilos de las imágenes
    if (contentEsDelta && contentEsDelta.ops) {
      contentEsDelta.ops = contentEsDelta.ops.map(op => {
        if (op.insert && typeof op.insert === 'object' && op.insert.image) {
          // Buscar la imagen correspondiente por src
          const imgSrc = op.insert.image;
          const matchingImg = Array.from(images).find(img => img.src === imgSrc);
          
          if (matchingImg && (matchingImg.style.width || matchingImg.style.height)) {
            // Crear un nuevo objeto con los estilos preservados
            const newOp = { ...op };
            if (!newOp.attributes) {
              newOp.attributes = {};
            }
            // Guardar estilos como atributos personalizados
            if (matchingImg.style.width) {
              newOp.attributes['data-width'] = matchingImg.style.width;
            }
            if (matchingImg.style.height) {
              newOp.attributes['data-height'] = matchingImg.style.height;
            }
            return newOp;
          }
        }
        return op;
      });
    }

    if (!titleEs) {
      alert('Por favor, ingresa un título');
      return;
    }

    // Disable button during save
    const saveBtn = document.getElementById('saveBlogBtn');
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Guardando...';

    try {
      // Check Firebase services
      if (!db || !auth) {
        throw new Error('Firebase no está inicializado. Verifica la configuración.');
      }

      const user = auth.currentUser;
      if (!user) {
        throw new Error('No estás autenticado. Por favor, inicia sesión primero.');
      }

      console.log('Guardando blog...', { blogId, titleEs, category, status, userId: user.uid });

      // Convert Quill Delta to Firestore-compatible format
      // CRITICAL: Firestore cannot store Delta objects, only plain JSON objects
      // We need to extract the ops array and create a plain object
      let contentEsData = null;
      
      if (contentEsDelta) {
        try {
          console.log('ContentEs Delta type:', typeof contentEsDelta);
          console.log('ContentEs Delta constructor:', contentEsDelta.constructor?.name);
          console.log('ContentEs Delta has ops?', !!contentEsDelta.ops);
          
          // Method 1: Extract ops array directly (most reliable)
          if (contentEsDelta.ops && Array.isArray(contentEsDelta.ops)) {
            // Create a completely plain object - no Delta methods or prototypes
            contentEsData = {
              ops: JSON.parse(JSON.stringify(contentEsDelta.ops))
            };
            console.log('✅ Converted Delta using ops array');
          }
          // Method 2: Use toJSON if available (some Delta implementations)
          else if (typeof contentEsDelta.toJSON === 'function') {
            const jsonResult = contentEsDelta.toJSON();
            // Ensure it's a plain object
            contentEsData = JSON.parse(JSON.stringify(jsonResult));
            console.log('✅ Converted Delta using toJSON()');
          }
          // Method 3: Serialize entire object (fallback)
          else {
            // Force serialization to remove any methods/prototypes
            const serialized = JSON.stringify(contentEsDelta);
            contentEsData = JSON.parse(serialized);
            console.log('✅ Converted Delta using JSON serialization');
          }
          
          // Final validation - ensure it's a plain object
          if (contentEsData) {
            // Remove any non-serializable properties
            contentEsData = JSON.parse(JSON.stringify(contentEsData));
            
            // Verify it has ops
            if (!contentEsData.ops || !Array.isArray(contentEsData.ops)) {
              console.warn('⚠️ ContentEs converted but missing valid ops array');
              // Create minimal valid Delta structure
              contentEsData = { ops: [] };
            }
          }
          
          console.log('Final contentEsData:', contentEsData);
          console.log('Is plain object?', contentEsData && contentEsData.constructor === Object);
          
        } catch (error) {
          console.error('❌ Error converting Quill Delta:', error);
          // Last resort: create empty Delta structure
          contentEsData = { ops: [] };
        }
      } else {
        // Empty content
        contentEsData = { ops: [] };
      }

      const blogData = {
        titleEs,
        subtitleEs: subtitleEs || '',
        contentEs: contentEsData,
        category,
        status,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedBy: user.uid
      };

      console.log('Datos del blog a guardar:', blogData);
      console.log('ContentEs (formato):', typeof contentEsData, contentEsData);

      if (blogId) {
        // Update existing blog - preservar hidden, order y archived si existen
        const existingBlog = await db.collection('blogs').doc(blogId).get();
        if (existingBlog.exists) {
          const existingData = existingBlog.data();
          if (existingData.hidden !== undefined) {
            blogData.hidden = existingData.hidden;
          }
          if (existingData.order !== undefined) {
            blogData.order = existingData.order;
          }
          // Si el blog está archivado, mantener el estado "archived" y no permitir cambiarlo
          if (existingData.archived === true) {
            blogData.archived = true;
            blogData.status = 'archived'; // Forzar estado archived si está archivado
            if (existingData.previousStatus) {
              blogData.previousStatus = existingData.previousStatus; // Preservar previousStatus
            }
          }
        }
        console.log('Actualizando blog existente:', blogId);
        await db.collection('blogs').doc(blogId).update(blogData);
        console.log('✅ Blog actualizado exitosamente');
      } else {
        // Create new blog - asignar order automáticamente
        blogData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        blogData.authorId = user.uid;
        blogData.hidden = false;
        blogData.archived = false;
        
        // Obtener el número de blogs activos en la misma categoría para asignar order
        try {
          const categoryBlogs = await db.collection('blogs')
            .where('category', '==', category)
            .where('archived', '==', false)
            .get();
          blogData.order = categoryBlogs.size;
        } catch (error) {
          console.warn('No se pudo obtener el order automáticamente, usando 0:', error);
          blogData.order = 0;
        }
        
        console.log('Creando nuevo blog...');
        const docRef = await db.collection('blogs').add(blogData);
        console.log('✅ Blog creado exitosamente con ID:', docRef.id);
      }

      $('#blogEditorModal').modal('hide');
      await loadBlogs();
      alert('Blog guardado exitosamente');

    } catch (error) {
      console.error('❌ Error al guardar el blog:', error);
      console.error('Detalles del error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      let errorMessage = 'Error al guardar el blog: ' + error.message;
      
      // Mensajes de error más específicos
      if (error.code === 'permission-denied') {
        errorMessage = 'Error de permisos. Verifica las reglas de Firestore y que estés autenticado.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Firestore no está disponible. Verifica tu conexión a internet.';
      } else if (error.message.includes('autenticado')) {
        errorMessage = 'No estás autenticado. Por favor, inicia sesión primero.';
      }
      
      alert(errorMessage);
    } finally {
      // Re-enable button
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalText;
    }
  });

  // Delete blog
  async function deleteBlog(blogId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este blog?')) {
      return;
    }

    try {
      await db.collection('blogs').doc(blogId).delete();
      loadBlogs();
      alert('Blog eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Error al eliminar el blog');
    }
  }

  // Toggle blog hidden status
  async function toggleBlogHidden(blogId, hidden) {
    try {
      await db.collection('blogs').doc(blogId).update({
        hidden: hidden,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      loadBlogs();
    } catch (error) {
      console.error('Error toggling blog hidden:', error);
      alert('Error al cambiar el estado de visibilidad del blog');
    }
  }

  // Move blog up
  async function moveBlogUp(blogId) {
    try {
      // Obtener todos los blogs activos de la misma categoría
      const currentBlog = allBlogs.find(b => b.id === blogId);
      if (!currentBlog) return;
      
      const sameCategoryBlogs = allBlogs
        .filter(b => !b.archived && b.category === currentBlog.category)
        .sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          if (a.order !== undefined) return -1;
          if (b.order !== undefined) return 1;
          return 0;
        });
      
      const currentIndex = sameCategoryBlogs.findIndex(b => b.id === blogId);
      if (currentIndex <= 0) return;
      
      const prevBlog = sameCategoryBlogs[currentIndex - 1];
      const currentOrder = currentBlog.order !== undefined ? currentBlog.order : currentIndex;
      const prevOrder = prevBlog.order !== undefined ? prevBlog.order : currentIndex - 1;
      
      // Intercambiar órdenes
      await db.collection('blogs').doc(blogId).update({
        order: prevOrder,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      await db.collection('blogs').doc(prevBlog.id).update({
        order: currentOrder,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      loadBlogs();
    } catch (error) {
      console.error('Error moving blog up:', error);
      alert('Error al mover el blog');
    }
  }

  // Move blog down
  async function moveBlogDown(blogId) {
    try {
      // Obtener todos los blogs activos de la misma categoría
      const currentBlog = allBlogs.find(b => b.id === blogId);
      if (!currentBlog) return;
      
      const sameCategoryBlogs = allBlogs
        .filter(b => !b.archived && b.category === currentBlog.category)
        .sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          if (a.order !== undefined) return -1;
          if (b.order !== undefined) return 1;
          return 0;
        });
      
      const currentIndex = sameCategoryBlogs.findIndex(b => b.id === blogId);
      if (currentIndex < 0 || currentIndex >= sameCategoryBlogs.length - 1) return;
      
      const nextBlog = sameCategoryBlogs[currentIndex + 1];
      const currentOrder = currentBlog.order !== undefined ? currentBlog.order : currentIndex;
      const nextOrder = nextBlog.order !== undefined ? nextBlog.order : currentIndex + 1;
      
      // Intercambiar órdenes
      await db.collection('blogs').doc(blogId).update({
        order: nextOrder,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      await db.collection('blogs').doc(nextBlog.id).update({
        order: currentOrder,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      loadBlogs();
    } catch (error) {
      console.error('Error moving blog down:', error);
      alert('Error al mover el blog');
    }
  }

  // Archive blog
  async function archiveBlog(blogId) {
    if (!confirm('¿Estás seguro de que quieres archivar este blog?')) {
      return;
    }

    try {
      // Obtener el blog actual para guardar el estado anterior
      const blogDoc = await db.collection('blogs').doc(blogId).get();
      if (!blogDoc.exists) {
        throw new Error('Blog no encontrado');
      }
      
      const blogData = blogDoc.data();
      const previousStatus = blogData.status || 'draft';
      
      // Cambiar el estado a "archived" y guardar el estado anterior
      await db.collection('blogs').doc(blogId).update({
        status: 'archived',
        previousStatus: previousStatus, // Guardar el estado anterior para poder restaurarlo
        archived: true,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      loadBlogs();
      alert('Blog archivado exitosamente');
    } catch (error) {
      console.error('Error archiving blog:', error);
      alert('Error al archivar el blog');
    }
  }

  // Unarchive blog
  async function unarchiveBlog(blogId) {
    try {
      // Obtener el blog actual para restaurar el estado anterior
      const blogDoc = await db.collection('blogs').doc(blogId).get();
      if (!blogDoc.exists) {
        throw new Error('Blog no encontrado');
      }
      
      const blogData = blogDoc.data();
      // Restaurar el estado anterior o usar 'draft' por defecto
      const restoredStatus = blogData.previousStatus || 'draft';
      
      // Restaurar el estado anterior y quitar el flag archived
      await db.collection('blogs').doc(blogId).update({
        status: restoredStatus,
        archived: false,
        previousStatus: firebase.firestore.FieldValue.delete(), // Eliminar el campo previousStatus
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      loadBlogs();
      alert('Blog desarchivado exitosamente');
    } catch (error) {
      console.error('Error unarchiving blog:', error);
      alert('Error al desarchivar el blog');
    }
  }

})();


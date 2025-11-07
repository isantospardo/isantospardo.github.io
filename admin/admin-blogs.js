// Blog Management
(function() {
  'use strict';

  const { db, auth, storage } = window.firebaseServices;
  let quillEditor = null;

  // Initialize Quill editor
  function initQuillEditor() {
    if (!quillEditor) {
      quillEditor = new Quill('#blogContentEs', {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image'],
            ['clean']
          ]
        }
      });
    }
    return quillEditor;
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

      if (snapshot.empty) {
        blogsList.innerHTML = '<div class="card-body"><p class="text-muted">No hay blogs aún. Crea tu primer blog haciendo clic en "Nuevo Blog".</p></div>';
        return;
      }

      let html = '<div class="card-body"><table class="table table-hover"><thead><tr><th>Título</th><th>Categoría</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead><tbody>';
      
      snapshot.forEach(doc => {
        const blog = doc.data();
        const date = blog.createdAt ? blog.createdAt.toDate().toLocaleDateString() : 'N/A';
        html += `
          <tr>
            <td>${blog.titleEs || 'Sin título'}</td>
            <td><span class="badge badge-secondary">${blog.category || 'general'}</span></td>
            <td><span class="badge badge-${blog.status === 'published' ? 'success' : 'warning'}">${blog.status || 'draft'}</span></td>
            <td>${date}</td>
            <td>
              <button class="btn btn-sm btn-primary edit-blog-btn" data-id="${doc.id}">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button class="btn btn-sm btn-danger delete-blog-btn" data-id="${doc.id}">
                <i class="fas fa-trash"></i> Eliminar
              </button>
            </td>
          </tr>
        `;
      });
      
      html += '</tbody></table></div>';
      blogsList.innerHTML = html;

      // Add event listeners
      document.querySelectorAll('.edit-blog-btn').forEach(btn => {
        btn.addEventListener('click', () => editBlog(btn.getAttribute('data-id')));
      });

      document.querySelectorAll('.delete-blog-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteBlog(btn.getAttribute('data-id')));
      });

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

  // New blog button
  document.getElementById('newBlogBtn').addEventListener('click', function() {
    openBlogEditor();
  });

  // Open blog editor
  function openBlogEditor(blogId = null) {
    const modal = $('#blogEditorModal');
    const form = document.getElementById('blogForm');
    const editor = initQuillEditor();

    form.reset();
    document.getElementById('blogId').value = blogId || '';
    editor.setContents([]);
    document.getElementById('blogFeaturedImagePreview').style.display = 'none';

    if (blogId) {
      loadBlogData(blogId);
    }

    modal.modal('show');
  }

  // Load blog data for editing
  async function loadBlogData(blogId) {
    try {
      const doc = await db.collection('blogs').doc(blogId).get();
      if (doc.exists) {
        const blog = doc.data();
        document.getElementById('blogTitleEs').value = blog.titleEs || '';
        document.getElementById('blogCategory').value = blog.category || 'general';
        document.getElementById('blogStatus').value = blog.status || 'draft';
        
        const editor = initQuillEditor();
        if (blog.contentEs) {
          // Handle both Delta format and plain object format
          if (blog.contentEs.ops) {
            editor.setContents(blog.contentEs);
          } else if (typeof blog.contentEs === 'object') {
            // If it's already a Delta-compatible object, use it directly
            editor.setContents(blog.contentEs);
          }
        }

        if (blog.featuredImage) {
          document.getElementById('blogFeaturedImagePreview').src = blog.featuredImage;
          document.getElementById('blogFeaturedImagePreview').style.display = 'block';
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
    const category = document.getElementById('blogCategory').value;
    const status = document.getElementById('blogStatus').value;
    const editor = initQuillEditor();
    const contentEsDelta = editor.getContents(); // This is a Delta object
    const featuredImageFile = document.getElementById('blogFeaturedImage').files[0];

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

      let featuredImageUrl = null;
      
      // Upload featured image if provided
      if (featuredImageFile) {
        console.log('Subiendo imagen destacada...', featuredImageFile.name);
        try {
          const imageRef = storage.ref().child(`blogs/${Date.now()}_${featuredImageFile.name}`);
          await imageRef.put(featuredImageFile);
          featuredImageUrl = await imageRef.getDownloadURL();
          console.log('✅ Imagen subida exitosamente:', featuredImageUrl);
        } catch (imageError) {
          console.error('Error al subir imagen:', imageError);
          throw new Error('Error al subir la imagen: ' + imageError.message);
        }
      } else if (blogId) {
        // Keep existing image if not changed
        try {
          const existingBlog = await db.collection('blogs').doc(blogId).get();
          if (existingBlog.exists) {
            featuredImageUrl = existingBlog.data().featuredImage;
          }
        } catch (readError) {
          console.warn('No se pudo leer el blog existente:', readError);
        }
      }

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
        contentEs: contentEsData,
        category,
        status,
        featuredImage: featuredImageUrl,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedBy: user.uid
      };

      console.log('Datos del blog a guardar:', blogData);
      console.log('ContentEs (formato):', typeof contentEs, contentEs);

      if (blogId) {
        // Update existing blog
        console.log('Actualizando blog existente:', blogId);
        await db.collection('blogs').doc(blogId).update(blogData);
        console.log('✅ Blog actualizado exitosamente');
      } else {
        // Create new blog
        blogData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        blogData.authorId = user.uid;
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

  // Handle featured image preview
  document.getElementById('blogFeaturedImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('blogFeaturedImagePreview').src = e.target.result;
        document.getElementById('blogFeaturedImagePreview').style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });
})();


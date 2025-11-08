// Authentication Management
(function() {
  'use strict';

  const { auth } = window.firebaseServices;

  // Ocultar ambas pantallas inicialmente (ya están ocultas por CSS, pero asegurarse)
  const loginScreen = document.getElementById('loginScreen');
  const adminPanel = document.getElementById('adminPanel');
  loginScreen.style.display = 'none';
  adminPanel.style.display = 'none';

  // Check if user is logged in
  auth.onAuthStateChanged(function(user) {
    if (user) {
      showAdminPanel();
    } else {
      showLoginScreen();
    }
  });

  // Login form handler
  document.getElementById('loginFormElement').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    try {
      await auth.signInWithEmailAndPassword(email, password);
      errorDiv.style.display = 'none';
    } catch (error) {
      // Personalizar mensajes de error en español
      let errorMessage = error.message;
      
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Las credenciales son incorrectas. Por favor, verifica tu email y contraseña.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'La contraseña es incorrecta.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El formato del email no es válido.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Esta cuenta ha sido deshabilitada. Contacta al administrador.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos fallidos. Por favor, intenta más tarde.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
          break;
        default:
          // Mantener el mensaje original si no es un error conocido
          errorMessage = error.message;
      }
      
      errorDiv.textContent = errorMessage;
      errorDiv.style.display = 'block';
    }
  });

  // Logout handler
  document.getElementById('logoutBtn').addEventListener('click', function() {
    auth.signOut();
  });

  function showLoginScreen() {
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
    // Ocultar admin panel
    adminPanel.style.display = 'none';
    adminPanel.classList.remove('visible');
    // Mostrar login screen
    loginScreen.style.display = 'block';
    loginScreen.classList.add('visible');
  }

  function showAdminPanel() {
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
    // Ocultar login screen
    loginScreen.style.display = 'none';
    loginScreen.classList.remove('visible');
    // Mostrar admin panel
    adminPanel.style.display = 'block';
    adminPanel.classList.add('visible');
    // La sección activa se restaurará automáticamente por admin-main.js
    // No necesitamos cargar el dashboard aquí, se hará cuando se restaure la sección
  }

  // Load dashboard stats
  async function loadDashboard() {
    const { db } = window.firebaseServices;
    
    try {
      // Count total blogs
      const blogsSnapshot = await db.collection('blogs').get();
      const totalBlogs = blogsSnapshot.size;
      document.getElementById('totalBlogs').textContent = totalBlogs;
      
      // Count published blogs
      const publishedBlogs = blogsSnapshot.docs.filter(doc => doc.data().status === 'published').length;
      document.getElementById('publishedBlogs').textContent = publishedBlogs;
      
      // Count draft blogs
      const draftBlogs = blogsSnapshot.docs.filter(doc => doc.data().status === 'draft').length;
      document.getElementById('draftBlogs').textContent = draftBlogs;
      
      // Count images
      const mediaSnapshot = await db.collection('media').get();
      document.getElementById('totalImages').textContent = mediaSnapshot.size;
      
      // Count featured news
      const featuredNewsSnapshot = await db.collection('featuredNews').get();
      const featuredNewsCount = featuredNewsSnapshot.size;
      document.getElementById('featuredNewsCount').textContent = featuredNewsCount;
      
      // Count by category
      const categoryCounts = {
        fiscal: 0,
        laboral: 0,
        legal: 0,
        sucesiones: 0
      };
      
      // Count hidden, archived, and visible blogs
      let hiddenBlogs = 0;
      let archivedBlogs = 0;
      let visibleBlogs = 0;
      
      blogsSnapshot.forEach(doc => {
        const blog = doc.data();
        const category = blog.category || 'fiscal';
        if (categoryCounts.hasOwnProperty(category)) {
          categoryCounts[category]++;
        }
        
        // Contar blogs archivados por estado "archived"
        if (blog.status === 'archived' || blog.archived === true) {
          archivedBlogs++;
        } else {
          // Solo contar como visible si no está archivado
          if (blog.hidden === true) {
            hiddenBlogs++;
          } else {
            visibleBlogs++;
          }
        }
      });
      
      // Update category stats
      document.getElementById('categoryFiscal').textContent = categoryCounts.fiscal;
      document.getElementById('categoryLaboral').textContent = categoryCounts.laboral;
      document.getElementById('categoryLegal').textContent = categoryCounts.legal;
      document.getElementById('categorySucesiones').textContent = categoryCounts.sucesiones;
      
      // Update status stats
      document.getElementById('hiddenBlogs').textContent = hiddenBlogs;
      document.getElementById('archivedBlogs').textContent = archivedBlogs;
      document.getElementById('visibleBlogs').textContent = visibleBlogs;
      
      // Load recent activity (last 5 blogs)
      const recentBlogs = blogsSnapshot.docs
        .map(doc => {
          const blog = doc.data();
          return {
            id: doc.id,
            title: blog.titleEs || 'Sin título',
            category: blog.category || 'fiscal',
            status: blog.status || 'draft',
            createdAt: blog.createdAt?.toDate ? blog.createdAt.toDate() : new Date(0),
            updatedAt: blog.updatedAt?.toDate ? blog.updatedAt.toDate() : new Date(0)
          };
        })
        .sort((a, b) => {
          const dateA = a.updatedAt || a.createdAt;
          const dateB = b.updatedAt || b.createdAt;
          return dateB - dateA;
        })
        .slice(0, 5);
      
      const activityHtml = recentBlogs.length > 0 
        ? recentBlogs.map(blog => {
            const date = blog.updatedAt || blog.createdAt;
            const dateStr = date.toLocaleDateString('es-ES', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
            const categoryInfo = {
              fiscal: { icon: 'calculator', color: '#dc3545' },
              laboral: { icon: 'briefcase', color: '#28a745' },
              legal: { icon: 'gavel', color: '#17a2b8' },
              sucesiones: { icon: 'file-invoice', color: '#ffc107' },
            }[blog.category] || { icon: 'folder', color: '#6c757d' };
            
            return `
              <div class="activity-item d-flex align-items-center">
                <div class="activity-icon" style="background-color: ${categoryInfo.color}20; color: ${categoryInfo.color};">
                  <i class="fas fa-${categoryInfo.icon}"></i>
                </div>
                <div class="flex-grow-1">
                  <div class="font-weight-medium">${blog.title}</div>
                  <small class="text-muted">${dateStr}</small>
                </div>
                <span class="badge badge-${blog.status === 'published' ? 'success' : 'warning'}">${blog.status === 'published' ? 'Publicado' : 'Borrador'}</span>
              </div>
            `;
          }).join('')
        : '<p class="text-muted mb-0">No hay actividad reciente</p>';
      
      document.getElementById('recentActivity').innerHTML = activityHtml;
      
      // Load featured news preview
      const featuredNewsPreview = featuredNewsSnapshot.docs
        .map(doc => {
          const featured = doc.data();
          return {
            id: doc.id,
            title: featured.title || 'Sin título',
            category: featured.category || 'fiscal',
            order: featured.order || 0
          };
        })
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .slice(0, 5);
      
      const featuredHtml = featuredNewsPreview.length > 0
        ? featuredNewsPreview.map(featured => {
            const categoryInfo = {
              fiscal: { icon: 'calculator', color: '#dc3545', name: 'Fiscal' },
              laboral: { icon: 'briefcase', color: '#28a745', name: 'Laboral' },
              legal: { icon: 'gavel', color: '#17a2b8', name: 'Legal' },
              sucesiones: { icon: 'file-invoice', color: '#ffc107', name: 'Sucesiones' },
            }[featured.category] || { icon: 'folder', color: '#6c757d', name: 'General' };
            
            return `
              <div class="d-flex align-items-center mb-3 pb-3" style="border-bottom: 1px solid #f0f0f0;">
                <div class="mr-3">
                  <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; background-color: ${categoryInfo.color}20; color: ${categoryInfo.color};">
                    <i class="fas fa-${categoryInfo.icon}"></i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="font-weight-medium" style="font-size: 0.9rem;">${featured.title}</div>
                  <small class="text-muted">
                    <span class="badge badge-light mr-2">Orden: ${featured.order}</span>
                    <span style="color: ${categoryInfo.color};">${categoryInfo.name}</span>
                  </small>
                </div>
                <div>
                  <span class="badge badge-warning">
                    <i class="fas fa-star"></i>
                  </span>
                </div>
              </div>
            `;
          }).join('')
        : '<p class="text-muted mb-0"><i class="fas fa-info-circle mr-2"></i>No hay noticias destacadas. <a href="#" onclick="window.switchSection && window.switchSection(\'featured-news\'); return false;">Agregar noticias destacadas</a></p>';
      
      document.getElementById('featuredNewsPreview').innerHTML = featuredHtml;
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      document.getElementById('recentActivity').innerHTML = '<p class="text-danger mb-0">Error al cargar actividad</p>';
      document.getElementById('featuredNewsPreview').innerHTML = '<p class="text-danger mb-0">Error al cargar noticias destacadas</p>';
    }
  }

  window.showAdminPanel = showAdminPanel;
  window.loadDashboard = loadDashboard;
})();


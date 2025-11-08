// Main Admin Panel Controller
(function() {
  'use strict';

  // Función para cambiar de sección (disponible globalmente)
  window.switchSection = function switchSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    
    // Actualizar estado activo de los enlaces
    document.querySelectorAll('.sidebar .nav-link').forEach(l => l.classList.remove('active'));
    
    // Mostrar la sección correspondiente
    if (section === 'dashboard') {
      document.querySelector('.nav-link[data-section="dashboard"]').classList.add('active');
      document.getElementById('dashboardSection').style.display = 'block';
      if (window.loadDashboard) window.loadDashboard();
    } else if (section === 'blogs') {
      document.querySelector('.nav-link[data-section="blogs"]').classList.add('active');
      document.getElementById('blogsSection').style.display = 'block';
      if (window.loadBlogs) window.loadBlogs();
    } else if (section === 'pages') {
      document.querySelector('.nav-link[data-section="pages"]').classList.add('active');
      document.getElementById('pagesSection').style.display = 'block';
      if (window.loadPageEditor) window.loadPageEditor();
    } else if (section === 'featured-news') {
      document.querySelector('.nav-link[data-section="featured-news"]').classList.add('active');
      document.getElementById('featuredNewsSection').style.display = 'block';
      if (window.loadFeaturedNews) window.loadFeaturedNews();
    } else if (section === 'media') {
      document.querySelector('.nav-link[data-section="media"]').classList.add('active');
      document.getElementById('mediaSection').style.display = 'block';
      if (window.loadMedia) window.loadMedia();
    }
    
    // Guardar la sección activa en localStorage
    localStorage.setItem('adminActiveSection', section);
  }

  // Navigation
  document.querySelectorAll('.sidebar .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.id === 'logoutBtn') return;
      
      e.preventDefault();
      
      const section = this.getAttribute('data-section');
      switchSection(section);
    });
  });

  // Restaurar la sección activa al cargar la página
  function restoreActiveSection() {
    const savedSection = localStorage.getItem('adminActiveSection');
    if (savedSection) {
      switchSection(savedSection);
    } else {
      // Por defecto, mostrar dashboard
      switchSection('dashboard');
    }
  }

  // Restaurar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreActiveSection);
  } else {
    // DOM ya está listo
    restoreActiveSection();
  }
})();


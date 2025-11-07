// Main Admin Panel Controller
(function() {
  'use strict';

  // Navigation
  document.querySelectorAll('.sidebar .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.id === 'logoutBtn') return;
      
      e.preventDefault();
      
      // Update active state
      document.querySelectorAll('.sidebar .nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      
      // Show corresponding section
      const section = this.getAttribute('data-section');
      document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
      
      if (section === 'dashboard') {
        document.getElementById('dashboardSection').style.display = 'block';
        window.loadDashboard();
      } else if (section === 'blogs') {
        document.getElementById('blogsSection').style.display = 'block';
        if (window.loadBlogs) window.loadBlogs();
      } else if (section === 'pages') {
        document.getElementById('pagesSection').style.display = 'block';
        if (window.loadPageEditor) window.loadPageEditor();
      } else if (section === 'media') {
        document.getElementById('mediaSection').style.display = 'block';
        if (window.loadMedia) window.loadMedia();
      }
    });
  });
})();


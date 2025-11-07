// Authentication Management
(function() {
  'use strict';

  const { auth } = window.firebaseServices;

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
      errorDiv.textContent = error.message;
      errorDiv.style.display = 'block';
    }
  });

  // Logout handler
  document.getElementById('logoutBtn').addEventListener('click', function() {
    auth.signOut();
  });

  function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
  }

  function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadDashboard();
  }

  // Load dashboard stats
  async function loadDashboard() {
    const { db } = window.firebaseServices;
    
    try {
      // Count total blogs
      const blogsSnapshot = await db.collection('blogs').get();
      document.getElementById('totalBlogs').textContent = blogsSnapshot.size;
      
      // Count published blogs
      const publishedBlogs = blogsSnapshot.docs.filter(doc => doc.data().status === 'published').length;
      document.getElementById('publishedBlogs').textContent = publishedBlogs;
      
      // Count images
      const mediaSnapshot = await db.collection('media').get();
      document.getElementById('totalImages').textContent = mediaSnapshot.size;
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  }

  window.showAdminPanel = showAdminPanel;
  window.loadDashboard = loadDashboard;
})();


// Firebase Initialization for Frontend
// This file initializes Firebase for public pages (read-only access)

(function() {
  'use strict';

  // Firebase Configuration
  // Cargar desde firebase-config.local.js si existe (no en git)
  // Si no existe, usar configuración por defecto
  const firebaseConfig = window.FIREBASE_CONFIG || {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  // Initialize Firebase only if not already initialized
  if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);

    // Initialize Firestore (read-only for public)
    const db = firebase.firestore();
    
    // Configure Firestore settings
    db.settings({
      timestampsInSnapshots: true
    });

    // Export for use in other files
    window.firebaseServices = {
      db,
      // Note: auth and storage not needed for public pages
    };

    console.log('Firebase initialized for frontend');
  }
})();


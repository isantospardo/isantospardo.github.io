// Firebase Configuration
// IMPORTANTE: Este archivo carga la configuración desde firebase-config.local.js
// El archivo firebase-config.local.js NO se sube a git (está en .gitignore)
// 
// INSTRUCCIONES:
// 1. Crea el archivo firebase-config.local.js (copia desde firebase-config.example.js)
// 2. Reemplaza los valores con tu configuración de Firebase
// 3. El archivo .local.js NO se subirá a git automáticamente

// Cargar configuración desde archivo local (no en git)
// Si no existe, usar configuración por defecto
const firebaseConfig = window.FIREBASE_CONFIG || {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);

  // Initialize services
  const db = firebase.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  // Configure Firestore settings
  db.settings({
    timestampsInSnapshots: true
  });

  // Export for use in other files
  window.firebaseServices = {
    db,
    auth,
    storage
  };

  console.log('Firebase initialized successfully');
} else {
  console.error('Firebase SDK not loaded. Make sure to include Firebase scripts before this file.');
}


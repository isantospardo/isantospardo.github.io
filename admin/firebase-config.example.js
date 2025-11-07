// Firebase Configuration Template
// IMPORTANTE: Copia este archivo a firebase-config.js y reemplaza los valores
// Este archivo (firebase-config.example.js) SÍ se sube a git
// El archivo firebase-config.js NO se sube a git (está en .gitignore)

const firebaseConfig = {
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


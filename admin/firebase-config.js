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

// Función para inicializar Firebase
function initializeFirebase() {
  if (typeof firebase === 'undefined') {
    console.warn('Firebase SDK no está cargado aún. Esperando...');
    // Intentar de nuevo después de un breve delay
    setTimeout(initializeFirebase, 100);
    return;
  }

  try {
    // Verificar si Firebase ya está inicializado
    if (firebase.apps && firebase.apps.length > 0) {
      console.log('Firebase ya está inicializado');
      // Asegurarse de que los servicios estén disponibles
      if (!window.firebaseServices) {
        const db = firebase.firestore();
        const auth = firebase.auth();
        // Storage es opcional, solo inicializarlo si está disponible
        let storage = null;
        if (typeof firebase.storage === 'function') {
          storage = firebase.storage();
        }

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
      }
      return;
    }

    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);

    // Initialize services
    const db = firebase.firestore();
    const auth = firebase.auth();
    // Storage es opcional, solo inicializarlo si está disponible
    let storage = null;
    if (typeof firebase.storage === 'function') {
      storage = firebase.storage();
    }

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

    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Error al inicializar Firebase:', error);
    
    // Si hay un error de configuración, mostrar mensaje útil
    if (error.code === 'app/duplicate-app') {
      console.log('Firebase ya estaba inicializado');
    } else if (error.message && error.message.includes('config')) {
      console.error('Error de configuración de Firebase. Verifica que firebase-config.local.js esté correctamente configurado.');
    }
  }
}

// Intentar inicializar inmediatamente
initializeFirebase();

// También intentar cuando el DOM esté listo (por si acaso)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
  // Si el DOM ya está listo, dar un poco más de tiempo
  setTimeout(initializeFirebase, 100);
}


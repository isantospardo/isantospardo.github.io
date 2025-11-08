// Firebase Initialization and Setup Script
// Este script prueba la conexión y crea las estructuras necesarias en Firestore
// IMPORTANTE: Solo se ejecuta después de que el usuario esté autenticado

(function() {
  'use strict';

  console.log('🚀 Iniciando configuración de Firebase...');

  // Esperar a que Firebase esté cargado
  function initFirebase() {
    if (typeof firebase === 'undefined' || !window.firebaseServices) {
      console.error('❌ Firebase no está inicializado. Asegúrate de cargar firebase-config.js primero.');
      return;
    }

    const { db, auth } = window.firebaseServices;
    console.log('✅ Firebase inicializado correctamente');

    // Esperar a que el usuario esté autenticado antes de probar la conexión
    // Esto evita errores de permisos al intentar escribir sin autenticación
    auth.onAuthStateChanged(function(user) {
      if (user) {
        console.log('✅ Usuario autenticado:', user.email);
        // Solo probar conexión cuando el usuario esté autenticado
        testConnection(db, auth);
      } else {
        console.log('ℹ️  Esperando autenticación...');
        // No hacer nada si no hay usuario autenticado
        // El usuario verá la pantalla de login
      }
    });
  }

  // Probar conexión (solo se ejecuta cuando el usuario está autenticado)
  async function testConnection(db, auth) {
    try {
      console.log('🔍 Probando conexión con Firestore...');
      
      // Verificar que el usuario esté autenticado
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.warn('⚠️  No hay usuario autenticado. Saltando prueba de conexión.');
        return;
      }
      
      // Intentar escribir una colección de prueba
      const testRef = db.collection('_test').doc('connection');
      await testRef.set({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: 'Conexión exitosa',
        userId: currentUser.uid
      });
      
      console.log('✅ Conexión con Firestore exitosa');
      
      // Eliminar el documento de prueba
      await testRef.delete();
      console.log('🧹 Documento de prueba eliminado');
      
      // Crear estructuras necesarias
      await createCollections(db);
      
    } catch (error) {
      console.error('❌ Error al conectar con Firestore:', error);
      // Solo mostrar alerta si el error no es de permisos (para evitar spam)
      if (error.code !== 'permission-denied') {
        alert('Error al conectar con Firebase: ' + error.message);
      } else {
        console.warn('⚠️  Error de permisos. Asegúrate de estar autenticado.');
      }
    }
  }

  // Crear colecciones y documentos iniciales
  async function createCollections(db) {
    console.log('📦 Creando estructuras necesarias...');

    try {
      // 1. Crear colección de usuarios (si no existe)
      console.log('   - Verificando colección de usuarios...');
      const usersRef = db.collection('users');
      const usersSnapshot = await usersRef.limit(1).get();
      
      if (usersSnapshot.empty) {
        console.log('   - Creando usuario administrador por defecto...');
        // Nota: La contraseña debe ser hasheada con bcrypt o similar
        // Por ahora, el usuario debe crearse desde Firebase Console
        console.log('   ⚠️  Crea el usuario administrador desde Firebase Console > Authentication');
      } else {
        console.log('   ✅ Colección de usuarios ya existe');
      }

      // 2. Crear colección de blogs (estructura de ejemplo)
      console.log('   - Verificando colección de blogs...');
      const blogsRef = db.collection('blogs');
      const blogsSnapshot = await blogsRef.limit(1).get();
      
      if (blogsSnapshot.empty) {
        console.log('   - Creando estructura de ejemplo para blogs...');
        // No creamos un blog de ejemplo, solo verificamos que la colección funciona
        console.log('   ✅ Colección de blogs lista para usar');
      } else {
        console.log('   ✅ Colección de blogs ya existe con ' + blogsSnapshot.size + ' documento(s)');
      }

      // 3. Crear colección de contenido de páginas (estructura inicial)
      console.log('   - Verificando colección de contenido de páginas...');
      const pageContentRef = db.collection('pageContent');
      const pageContentSnapshot = await pageContentRef.limit(1).get();
      
      if (pageContentSnapshot.empty) {
        console.log('   - Inicializando contenido de páginas...');
        await initializePageContent(db);
      } else {
        console.log('   ✅ Colección de contenido de páginas ya existe');
      }

      // 4. Crear colección de media
      console.log('   - Verificando colección de media...');
      const mediaRef = db.collection('media');
      const mediaSnapshot = await mediaRef.limit(1).get();
      
      if (mediaSnapshot.empty) {
        console.log('   ✅ Colección de media lista para usar');
      } else {
        console.log('   ✅ Colección de media ya existe con ' + mediaSnapshot.size + ' documento(s)');
      }

      console.log('✅ Todas las estructuras están listas');
      console.log('🎉 Firebase configurado correctamente!');
      
      // Mostrar resumen
      showSummary(db);

    } catch (error) {
      console.error('❌ Error al crear estructuras:', error);
      alert('Error al crear estructuras: ' + error.message);
    }
  }

  // Inicializar contenido de páginas
  async function initializePageContent(db) {
    const pages = [
      { page: 'index', sections: [
        { section: 'Título Principal', fieldKey: 'main_title', order: 1 },
        { section: 'Subtítulo', fieldKey: 'subtitle', order: 2 },
        { section: 'Descripción', fieldKey: 'description', order: 3 }
      ]},
      { page: 'about', sections: [
        { section: 'Título', fieldKey: 'title', order: 1 },
        { section: 'Subtítulo', fieldKey: 'subtitle', order: 2 },
        { section: 'Contenido Principal', fieldKey: 'main_content', order: 3 }
      ]},
      { page: 'contact', sections: [
        { section: 'Título', fieldKey: 'title', order: 1 },
        { section: 'Subtítulo', fieldKey: 'subtitle', order: 2 }
      ]},
      { page: 'fiscal', sections: [
        { section: 'Título', fieldKey: 'title', order: 1 },
        { section: 'Subtítulo', fieldKey: 'subtitle', order: 2 }
      ]},
      { page: 'laboral', sections: [
        { section: 'Título', fieldKey: 'title', order: 1 },
        { section: 'Subtítulo', fieldKey: 'subtitle', order: 2 }
      ]},
      { page: 'legal', sections: [
        { section: 'Título', fieldKey: 'title', order: 1 },
        { section: 'Subtítulo', fieldKey: 'subtitle', order: 2 }
      ]},
      { page: 'sucesiones', sections: [
        { section: 'Título', fieldKey: 'title', order: 1 },
        { section: 'Subtítulo', fieldKey: 'subtitle', order: 2 }
      ]}
    ];

    for (const pageData of pages) {
      for (const section of pageData.sections) {
        try {
          await db.collection('pageContent').add({
            page: pageData.page,
            section: section.section,
            fieldKey: section.fieldKey,
            contentEs: '',
            order: section.order,
            type: 'text',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        } catch (error) {
          console.warn('   ⚠️  Error al crear sección:', section.section, error);
        }
      }
    }
    console.log('   ✅ Contenido de páginas inicializado');
  }

  // Mostrar resumen
  async function showSummary(db) {
    try {
      const [blogsCount, pagesCount, mediaCount] = await Promise.all([
        db.collection('blogs').get().then(s => s.size),
        db.collection('pageContent').get().then(s => s.size),
        db.collection('media').get().then(s => s.size)
      ]);

      console.log('\n📊 RESUMEN:');
      console.log('   - Blogs:', blogsCount);
      console.log('   - Contenido de páginas:', pagesCount);
      console.log('   - Imágenes:', mediaCount);
      console.log('\n✅ Todo listo para usar!');
    } catch (error) {
      console.warn('⚠️  Error al obtener resumen:', error);
    }
  }

  // Inicializar cuando Firebase esté listo
  if (window.firebaseServices) {
    initFirebase();
  } else {
    // Esperar a que Firebase se inicialice
    const checkInterval = setInterval(() => {
      if (window.firebaseServices) {
        clearInterval(checkInterval);
        initFirebase();
      }
    }, 100);

    // Timeout después de 5 segundos
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!window.firebaseServices) {
        console.error('❌ Firebase no se inicializó después de 5 segundos');
        alert('Error: Firebase no se inicializó. Verifica la configuración.');
      }
    }, 5000);
  }

  // Exportar función para ejecutar manualmente
  window.initFirebase = initFirebase;
})();


# Guía de Configuración - Panel de Administración Firebase

## Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto" o "Add project"
3. Ingresa el nombre del proyecto (ej: "sercon-gestoria")
4. Desactiva Google Analytics (opcional) o actívalo si lo necesitas
5. Haz clic en "Crear proyecto"

## Paso 2: Configurar Authentication

1. En el menú lateral, ve a **Authentication**
2. Haz clic en "Comenzar" o "Get started"
3. Ve a la pestaña **Sign-in method**
4. Habilita **Email/Password**
   - Haz clic en "Email/Password"
   - Activa "Enable"
   - Haz clic en "Guardar"

5. Crea tu primer usuario administrador:
   - Ve a la pestaña **Users**
   - Haz clic en "Agregar usuario" o "Add user"
   - Ingresa un email y contraseña
   - Guarda las credenciales de forma segura

## Paso 3: Configurar Firestore Database

1. En el menú lateral, ve a **Firestore Database**
2. Haz clic en "Crear base de datos" o "Create database"
3. Selecciona **Modo de prueba** (para empezar)
4. Elige la ubicación de tu base de datos (ej: europe-west)
5. Haz clic en "Habilitar"

### Configurar Reglas de Seguridad de Firestore

1. Ve a la pestaña **Rules**
2. Reemplaza las reglas con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura pública de blogs publicados
    match /blogs/{blogId} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth != null;
    }
    
    // Permitir lectura pública de contenido de páginas
    match /pageContent/{contentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Permitir lectura pública de media
    match /media/{mediaId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Todo lo demás requiere autenticación
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Haz clic en "Publicar"

## Paso 4: Configurar Storage

1. En el menú lateral, ve a **Storage**
2. Haz clic en "Comenzar" o "Get started"
3. Acepta las reglas por defecto
4. Elige la misma ubicación que Firestore
5. Haz clic en "Listo"

### Configurar Reglas de Seguridad de Storage

1. Ve a la pestaña **Rules**
2. Reemplaza las reglas con:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura pública
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Haz clic en "Publicar"

## Paso 5: Obtener Configuración de Firebase

1. Ve a **Project Settings** (ícono de engranaje)
2. Desplázate hasta "Your apps"
3. Haz clic en el ícono **</>** (Web)
4. Ingresa un nombre para la app (ej: "Sercon Web")
5. **NO** marques "Also set up Firebase Hosting"
6. Haz clic en "Registrar app"
7. Copia la configuración que aparece

## Paso 6: Configurar Archivos

### 6.1 Configurar `admin/firebase-config.js`

Abre `admin/firebase-config.js` y reemplaza los valores:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};
```

### 6.2 Configurar `js/firebase-init.js`

Abre `js/firebase-init.js` y reemplaza con la misma configuración:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};
```

## Paso 7: Probar el Panel de Administración

1. Abre `admin/index.html` en tu navegador
2. Inicia sesión con las credenciales que creaste
3. Deberías ver el dashboard

## Paso 8: Crear tu Primer Blog

1. En el panel admin, ve a "Blogs"
2. Haz clic en "Nuevo Blog"
3. Completa:
   - Título
   - Contenido (usa el editor WYSIWYG)
   - Categoría
   - Imagen destacada (opcional)
   - Estado: "Publicado"
4. Haz clic en "Guardar Blog"

## Paso 9: Verificar en el Frontend

1. Abre `index.html` en tu navegador
2. Desplázate hasta la sección "Últimas Noticias y Artículos"
3. Deberías ver tu blog publicado

## Solución de Problemas

### Error: "Firebase SDK not loaded"
- Asegúrate de incluir los scripts de Firebase antes de `firebase-config.js`
- Verifica que los scripts de Firebase estén cargando correctamente

### Error: "Permission denied"
- Verifica las reglas de Firestore y Storage
- Asegúrate de estar autenticado en el panel admin

### Los blogs no aparecen en el frontend
- Verifica que el estado del blog sea "published"
- Revisa la consola del navegador para errores
- Asegúrate de que `firebase-init.js` esté configurado correctamente

### No puedo subir imágenes
- Verifica las reglas de Storage
- Asegúrate de estar autenticado
- Revisa el tamaño del archivo (máximo recomendado: 5MB)

## Próximos Pasos

- [ ] Personalizar el diseño del panel admin
- [ ] Agregar más campos a los blogs (tags, autor, etc.)
- [ ] Implementar búsqueda de blogs
- [ ] Agregar soporte multiidioma completo para blogs
- [ ] Crear página individual de blog (`blog.html`)

## Soporte

Si tienes problemas, revisa:
- [Documentación de Firebase](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)


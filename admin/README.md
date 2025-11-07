# Panel de Administración - Sercon Gestoría

Panel de administración para gestionar contenido del sitio web usando Firebase.

## Características

- ✅ Autenticación con Firebase Auth
- ✅ Gestión de blogs con editor WYSIWYG (Quill)
- ✅ Edición inline de contenido de páginas
- ✅ Gestor de imágenes con Firebase Storage
- ✅ Dashboard con estadísticas

## Configuración

### 1. Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita los siguientes servicios:
   - **Authentication**: Email/Password
   - **Firestore Database**: Modo de prueba inicialmente
   - **Storage**: Reglas por defecto

### 2. Configurar Firebase

1. En Firebase Console, ve a Project Settings > General
2. En "Your apps", selecciona Web (</>)
3. Copia la configuración
4. Edita `firebase-config.js` y pega tu configuración:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

### 3. Configurar Firestore

Crea las siguientes colecciones en Firestore:

- **blogs**: Para almacenar los blogs
- **pageContent**: Para almacenar el contenido editable de las páginas
- **media**: Para almacenar metadatos de las imágenes

### 4. Configurar Storage

1. Ve a Storage en Firebase Console
2. Crea las siguientes carpetas:
   - `media/` - Para imágenes generales
   - `blogs/` - Para imágenes destacadas de blogs

### 5. Crear primer usuario administrador

1. Ve a Authentication en Firebase Console
2. Habilita "Email/Password"
3. Agrega un usuario manualmente o usa el panel de login

## Estructura de Datos

### Blogs
```javascript
{
  titleEs: string,
  contentEs: object (Quill Delta),
  category: string,
  status: 'draft' | 'published',
  featuredImage: string (URL),
  createdAt: timestamp,
  updatedAt: timestamp,
  authorId: string
}
```

### Page Content
```javascript
{
  page: string,
  section: string,
  fieldKey: string,
  contentEs: string,
  order: number,
  type: 'text' | 'html' | 'image',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Media
```javascript
{
  filename: string,
  path: string,
  url: string,
  mimeType: string,
  fileSize: number,
  width: number,
  height: number,
  altText: string,
  uploadedBy: string,
  createdAt: timestamp
}
```

## Uso

1. Accede a `/admin/index.html`
2. Inicia sesión con tus credenciales
3. Navega por las secciones:
   - **Dashboard**: Estadísticas generales
   - **Blogs**: Crear y editar blogs
   - **Páginas**: Editar contenido de páginas
   - **Imágenes**: Subir y gestionar imágenes

## Seguridad

⚠️ **IMPORTANTE**: Configura las reglas de seguridad en Firebase:

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden leer/escribir
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true; // Público para lectura
      allow write: if request.auth != null; // Solo autenticados pueden escribir
    }
  }
}
```

## Próximos Pasos

- [ ] Integrar con frontend para mostrar blogs dinámicos
- [ ] Agregar soporte multiidioma completo
- [ ] Implementar búsqueda de blogs
- [ ] Agregar preview de blogs antes de publicar
- [ ] Implementar categorías y tags


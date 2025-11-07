# Seguridad de Configuración de Firebase

## ⚠️ Importante: Sobre las Claves de Firebase

**Las claves de Firebase en el frontend NO son secretas** - están diseñadas para ser públicas. Cualquiera puede verlas en el código fuente del navegador.

### ¿Por qué es seguro?

La seguridad real de Firebase viene de:
1. **Reglas de Firestore**: Controlan quién puede leer/escribir datos
2. **Reglas de Storage**: Controlan quién puede subir/descargar archivos
3. **Firebase Authentication**: Gestiona usuarios y permisos
4. **Firebase App Check**: Protege contra abuso (recomendado en producción)

## Soluciones de Seguridad

### Opción 1: Archivo Local (Recomendado para Desarrollo)

1. **Crea** `admin/firebase-config.local.js` con tu configuración real
2. Este archivo está en `.gitignore` y **NO se sube a git**
3. El archivo `firebase-config.example.js` SÍ se sube como plantilla

**Ventajas:**
- ✅ No se sube a git
- ✅ Fácil de usar en desarrollo
- ✅ Cada desarrollador tiene su propia configuración

**Desventajas:**
- ⚠️ Sigue siendo visible en el navegador (pero esto es normal)

### Opción 2: Variables de Entorno (Requiere Build)

Si usas un proceso de build (Webpack, Vite, etc.):

```javascript
// En tu build config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  // ...
};
```

**Ventajas:**
- ✅ No está en el código fuente
- ✅ Diferentes configuraciones para dev/prod

**Desventajas:**
- ⚠️ Sigue siendo visible en el bundle final
- ⚠️ Requiere proceso de build

### Opción 3: Firebase App Check (Recomendado para Producción)

Firebase App Check protege tu app contra abuso:

1. Ve a Firebase Console > App Check
2. Registra tu dominio
3. Configura protección para Firestore y Storage

**Ventajas:**
- ✅ Protección real contra abuso
- ✅ Las claves siguen siendo públicas pero protegidas

### Opción 4: Backend Proxy (Máxima Seguridad)

Crea un backend que actúe como proxy:

1. Las claves de Firebase están solo en el servidor
2. El frontend hace peticiones a tu API
3. Tu API se comunica con Firebase

**Ventajas:**
- ✅ Máxima seguridad
- ✅ Control total

**Desventajas:**
- ⚠️ Requiere servidor backend
- ⚠️ Más complejo

## Configuración Recomendada

### Para Desarrollo:
1. Usa `firebase-config.local.js` (no en git)
2. Cada desarrollador tiene su propia copia
3. Usa un proyecto Firebase de desarrollo

### Para Producción:
1. Usa Firebase App Check
2. Configura reglas estrictas de Firestore/Storage
3. Usa HTTPS siempre
4. Monitorea el uso en Firebase Console

## Reglas de Seguridad Recomendadas

### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo blogs publicados son visibles públicamente
    match /blogs/{blogId} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth != null;
    }
    
    // Contenido de páginas: lectura pública, escritura solo autenticados
    match /pageContent/{contentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Media: lectura pública, escritura solo autenticados
    match /media/{mediaId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Lectura pública, escritura solo autenticados
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Checklist de Seguridad

- [ ] `firebase-config.local.js` está en `.gitignore`
- [ ] Reglas de Firestore configuradas correctamente
- [ ] Reglas de Storage configuradas correctamente
- [ ] Firebase App Check habilitado (producción)
- [ ] HTTPS habilitado en producción
- [ ] Usuarios admin con contraseñas fuertes
- [ ] Monitoreo de uso en Firebase Console

## Recursos

- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [Best Practices](https://firebase.google.com/docs/projects/best-practices)


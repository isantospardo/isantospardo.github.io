# Verificar Reglas de Firestore

## ⚠️ Problema Común: Blogs no se guardan

Si los blogs no se están guardando en Firestore, el problema más común es que las **reglas de seguridad** no están configuradas correctamente.

## 🔍 Cómo Verificar

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **sercon-ourense**
3. Ve a **Firestore Database** > **Rules**
4. Verifica que las reglas sean:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Blogs: lectura pública solo de publicados, escritura solo autenticados
    match /blogs/{blogId} {
      allow read: if resource.data.status == 'published' || request.auth != null;
      allow create, update, delete: if request.auth != null;
    }
    
    // Page Content: lectura pública, escritura solo autenticados
    match /pageContent/{contentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Media: lectura pública, escritura solo autenticados
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

## 🔧 Solución Rápida (Desarrollo)

Si estás en desarrollo y quieres permitir todo temporalmente:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ SOLO PARA DESARROLLO
    }
  }
}
```

**⚠️ IMPORTANTE**: Cambia esto en producción por reglas más estrictas.

## 📝 Verificar en la Consola del Navegador

1. Abre el panel admin (`admin/index.html`)
2. Abre la consola del navegador (F12)
3. Intenta crear un blog
4. Revisa los mensajes de error en la consola

### Errores Comunes:

- **`permission-denied`**: Las reglas de Firestore no permiten la operación
- **`unavailable`**: Firestore no está disponible (problema de conexión)
- **`unauthenticated`**: No estás autenticado

## ✅ Checklist

- [ ] Reglas de Firestore configuradas correctamente
- [ ] Usuario autenticado en el panel admin
- [ ] Firebase inicializado correctamente (ver consola)
- [ ] No hay errores en la consola del navegador


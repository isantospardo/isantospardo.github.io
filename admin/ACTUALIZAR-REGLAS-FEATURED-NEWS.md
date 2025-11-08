# 🔧 ACTUALIZAR REGLAS DE FIRESTORE PARA FEATURED NEWS

## ⚠️ PROBLEMA

Las noticias destacadas no se muestran en `index.html` porque las reglas de Firestore no permiten lectura pública de la colección `featuredNews`.

Error: `Missing or insufficient permissions`

## ✅ SOLUCIÓN

### Paso 1: Abre Firebase Console

1. Ve a: https://console.firebase.google.com/
2. Selecciona el proyecto: **sercon-ourense**
3. En el menú lateral izquierdo, haz clic en **Firestore Database**
4. Haz clic en la pestaña **Rules**

### Paso 2: Añade las Reglas para Featured News

**BORRA TODO** lo que hay en el editor de reglas y pega esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Blogs: lectura pública solo de publicados, escritura solo autenticados
    match /blogs/{blogId} {
      allow read: if resource.data.status == 'published' || request.auth != null;
      allow create, update, delete: if request.auth != null;
    }
    
    // Featured News: lectura pública de publicadas, escritura solo autenticados
    match /featuredNews/{newsId} {
      // Permitir lectura pública de noticias publicadas
      allow read: if resource.data.status == 'published' || 
                     (resource.data.draft != true && 
                      resource.data.hidden != true && 
                      resource.data.archived != true) ||
                     request.auth != null;
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
    
    // Users: solo lectura/escritura propia
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Todo lo demás requiere autenticación
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Paso 3: Publica las Reglas

1. Haz clic en el botón **Publish** (Publicar) en la parte superior derecha
2. Espera a que aparezca el mensaje "Rules published successfully"
3. Puede tardar unos segundos en aplicarse

### Paso 4: Verifica

1. Recarga la página `index.html` (Ctrl+F5 para forzar recarga)
2. Las noticias destacadas deberían aparecer ahora

---

## 🚀 ALTERNATIVA: Reglas Temporales para Desarrollo

Si las reglas anteriores no funcionan o quieres probar rápidamente, usa estas reglas **temporalmente**:

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


# 🔧 Solución: Error "Missing or insufficient permissions"

## ❌ Problema

Estás recibiendo el error: **"Missing or insufficient permissions"**

Esto significa que las **reglas de seguridad de Firestore** están bloqueando las operaciones.

## ✅ Solución Rápida

### Paso 1: Ve a Firebase Console

1. Abre [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **sercon-ourense**
3. En el menú lateral, ve a **Firestore Database**
4. Haz clic en la pestaña **Rules**

### Paso 2: Copia y Pega las Reglas

Copia el contenido del archivo `firestore-rules.txt` y pégalo en el editor de reglas.

**Reglas Recomendadas (Producción):**

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

### Paso 3: Publica las Reglas

1. Haz clic en **Publish** (Publicar)
2. Espera a que se publiquen (puede tardar unos segundos)

## 🚀 Solución Temporal para Desarrollo

Si necesitas probar rápidamente sin configurar autenticación, puedes usar estas reglas **temporalmente**:

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

**⚠️ IMPORTANTE**: Estas reglas permiten **cualquier operación a cualquiera**. **NO las uses en producción**. Son solo para desarrollo y pruebas.

## 🔐 Configurar Autenticación

Para usar las reglas de producción, necesitas:

1. **Crear un usuario administrador**:
   - Ve a Firebase Console > **Authentication**
   - Haz clic en **Get Started** si es la primera vez
   - Haz clic en **Add user** (o **Users** > **Add user**)
   - Ingresa email y contraseña
   - Haz clic en **Add user**

2. **Iniciar sesión en el panel admin**:
   - Abre `admin/index.html`
   - Inicia sesión con el email y contraseña que creaste

## ✅ Verificar que Funciona

1. Abre `admin/debug-firebase.html` en tu navegador
2. Haz clic en **"Probar Escritura en Blogs"**
3. Si funciona, verás: **"✅ Blog creado exitosamente"**

## 📋 Checklist

- [ ] Reglas de Firestore configuradas y publicadas
- [ ] Usuario administrador creado en Authentication
- [ ] Iniciado sesión en el panel admin
- [ ] Prueba de escritura exitosa en `debug-firebase.html`

## 🆘 Si Sigue Sin Funcionar

1. **Verifica que estés autenticado**:
   - Abre la consola del navegador (F12)
   - Verifica que `auth.currentUser` no sea `null`

2. **Verifica las reglas**:
   - Asegúrate de que las reglas estén publicadas
   - Espera unos segundos después de publicar

3. **Revisa la consola del navegador**:
   - Busca errores específicos
   - El código de error te dirá qué está fallando

4. **Usa la página de debug**:
   - Abre `admin/debug-firebase.html`
   - Te mostrará exactamente qué está fallando


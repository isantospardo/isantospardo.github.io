# 🔧 ACTUALIZAR REGLAS DE FIRESTORE - PASO A PASO

## ⚠️ PROBLEMA ACTUAL

Estás autenticado pero recibes "permission-denied". Las reglas de Firestore están bloqueando las operaciones.

## ✅ SOLUCIÓN INMEDIATA

### Paso 1: Abre Firebase Console

1. Ve a: https://console.firebase.google.com/
2. Selecciona el proyecto: **sercon-ourense**
3. En el menú lateral izquierdo, haz clic en **Firestore Database**

### Paso 2: Ve a la Pestaña "Rules"

1. En la parte superior, verás pestañas: **Data**, **Rules**, **Indexes**, **Usage**
2. Haz clic en **Rules**

### Paso 3: Reemplaza las Reglas Actuales

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

### Paso 4: Publica las Reglas

1. Haz clic en el botón **Publish** (Publicar) en la parte superior derecha
2. Espera a que aparezca el mensaje "Rules published successfully"
3. Puede tardar unos segundos en aplicarse

### Paso 5: Verifica

1. Vuelve a `admin/debug-firebase.html`
2. Haz clic en **"Probar Escritura en Blogs"**
3. Deberías ver: **✅ Blog creado exitosamente**

---

## 🚀 ALTERNATIVA: Reglas Temporales para Desarrollo

Si las reglas anteriores no funcionan o quieres probar rápidamente, usa estas reglas **temporalmente**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANTE**: Estas reglas permiten **TODO a CUALQUIERA**. Solo úsalas para desarrollo y pruebas. **NO las uses en producción**.

---

## 🔍 VERIFICAR REGLAS ACTUALES

Si quieres ver qué reglas tienes actualmente:

1. Ve a Firebase Console > Firestore Database > Rules
2. Copia el contenido del editor
3. Si ves algo como esto, está bloqueando todo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false; // ❌ Esto bloquea todo
    }
  }
}
```

O si ves reglas por defecto que requieren autenticación pero no están configuradas correctamente.

---

## 📸 CAPTURAS DE PANTALLA (Referencia)

1. **Firebase Console**: https://console.firebase.google.com/
2. **Firestore Database**: Menú lateral > Firestore Database
3. **Rules Tab**: Pestaña superior "Rules"
4. **Editor de Reglas**: Área de texto grande en el centro
5. **Botón Publish**: Botón azul en la parte superior derecha

---

## ✅ CHECKLIST

- [ ] Abrí Firebase Console
- [ ] Seleccioné el proyecto "sercon-ourense"
- [ ] Fui a Firestore Database > Rules
- [ ] Reemplacé las reglas con las nuevas
- [ ] Hice clic en "Publish"
- [ ] Esperé a que se publique
- [ ] Probé de nuevo en debug-firebase.html
- [ ] Funciona ✅

---

## 🆘 SI SIGUE SIN FUNCIONAR

1. **Espera unos minutos**: Las reglas pueden tardar en propagarse
2. **Refresca la página**: Recarga `debug-firebase.html`
3. **Verifica que estés autenticado**: Deberías ver tu email en la página de debug
4. **Revisa la consola del navegador**: Busca errores adicionales
5. **Usa las reglas temporales**: Si necesitas probar rápido, usa las reglas que permiten todo

---

## 📝 NOTAS

- Las reglas se aplican **inmediatamente** después de publicar
- Si cambias las reglas, puede tardar unos segundos en aplicarse
- Las reglas se evalúan en el servidor, no en el cliente
- El error "permission-denied" significa que las reglas están bloqueando la operación


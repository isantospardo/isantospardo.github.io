# 📥 Importar Blogs Existentes a Firebase

Este documento explica cómo importar los blogs existentes desde archivos HTML a Firebase para que sean contenido dinámico.

## 🎯 Objetivo

Migrar los blogs que están hardcodeados en archivos HTML estáticos (`posts/`) a Firebase Firestore, para que puedan ser:
- Editados desde el panel de administración
- Mostrados dinámicamente en la web
- Gestionados fácilmente sin modificar código

## 📋 Requisitos Previos

1. ✅ Firebase configurado correctamente
2. ✅ Usuario administrador creado en Firebase Authentication
3. ✅ Firestore Database configurado con las reglas correctas
4. ✅ Archivos HTML de blogs en la carpeta `posts/`

## 🚀 Pasos para Importar

### Paso 1: Abrir la Herramienta de Importación

1. Abre en tu navegador: `admin/import-blogs-once.html`
2. O navega a: `http://localhost:3000/admin/import-blogs-once.html` (si usas un servidor local)

### Paso 2: Iniciar Sesión

1. Ingresa tu **email** de administrador
2. Ingresa tu **contraseña** de administrador
3. Haz clic en **"Iniciar Sesión"**

### Paso 3: Iniciar la Importación

1. Una vez autenticado, verás el botón **"Iniciar Importación"**
2. Haz clic en el botón
3. Espera a que se completen todas las importaciones

### Paso 4: Verificar Resultados

El script mostrará en tiempo real:
- ✅ Blogs importados exitosamente
- ❌ Errores si los hay
- 📊 Resumen final con el total de importados

## 📁 Blogs que se Importarán

El script importará automáticamente:

- **Fiscal** (2 blogs):
  - `posts/post-fiscal/20200424-fiscal.html`
  - `posts/post-fiscal/20200425-fiscal.html`

- **Laboral** (2 blogs):
  - `posts/post-laboral/20200424-laboral.html`
  - `posts/post-laboral/20200425-laboral.html`

- **Legal** (2 blogs):
  - `posts/post-legal/20200424-legal.html`
  - `posts/post-legal/20200425-legal.html`

- **Sucesiones** (2 blogs):
  - `posts/post-sucesiones/20200424-sucesiones.html`
  - `posts/post-sucesiones/20200425-sucesiones.html`

**Total: 8 blogs**

## 🔄 Después de la Importación

Una vez importados los blogs:

1. **Los blogs estarán disponibles en Firebase** con la categoría correcta
2. **Se mostrarán automáticamente** en las páginas correspondientes:
   - `fiscal.html` → muestra blogs de categoría "fiscal"
   - `laboral.html` → muestra blogs de categoría "laboral"
   - `legal.html` → muestra blogs de categoría "legal"
   - `sucesiones.html` → muestra blogs de categoría "sucesiones"
3. **Podrás editarlos** desde el panel de administración (`admin/index.html`)
4. **El contenido será dinámico** - ya no necesitarás modificar archivos HTML

## ✏️ Editar Blogs Importados

Para editar los blogs después de importarlos:

1. Ve al panel de administración: `admin/index.html`
2. Inicia sesión
3. Ve a la sección **"Blogs"**
4. Usa los **filtros por categoría** para encontrar el blog que quieres editar
5. Haz clic en **"Editar"** en el blog deseado
6. Modifica el contenido y guarda

## ⚠️ Notas Importantes

- **Los blogs se importan como "published"** (publicados)
- **La fecha original se conserva** si está disponible en el HTML
- **El contenido HTML se convierte a formato Quill Delta** para poder editarlo
- **Si un blog ya existe**, se creará uno nuevo (no se sobrescribe)
- **Este script solo se ejecuta una vez** - después puedes gestionar los blogs desde el panel de administración

## 🐛 Solución de Problemas

### Error: "No se pudo cargar [archivo]"
- Verifica que los archivos HTML existan en la carpeta `posts/`
- Asegúrate de que el servidor web pueda acceder a esos archivos

### Error: "Missing or insufficient permissions"
- Verifica las reglas de Firestore en Firebase Console
- Asegúrate de estar autenticado correctamente

### Error: "Firebase no está inicializado"
- Verifica que `firebase-config.local.js` exista y tenga la configuración correcta
- Asegúrate de que Firebase esté cargado correctamente

## 📝 Estructura de Datos en Firebase

Cada blog importado tendrá esta estructura:

```javascript
{
  titleEs: "Título del blog",
  contentEs: { ops: [...] }, // Formato Quill Delta
  category: "fiscal" | "laboral" | "legal" | "sucesiones",
  status: "published",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  authorId: "uid-del-usuario",
  imported: true,
  originalFile: "20200424-fiscal.html"
}
```

## ✅ Checklist de Importación

- [ ] Firebase configurado
- [ ] Usuario administrador creado
- [ ] Firestore rules configuradas
- [ ] Archivos HTML en `posts/`
- [ ] Abrir `admin/import-blogs-once.html`
- [ ] Iniciar sesión
- [ ] Ejecutar importación
- [ ] Verificar blogs en panel de administración
- [ ] Verificar que se muestren en las páginas correspondientes

---

**¡Listo!** Una vez completada la importación, tus blogs estarán completamente dinámicos y podrás gestionarlos desde el panel de administración.



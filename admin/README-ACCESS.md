# Acceso al Panel de Administración

## URL de Acceso

El panel de administración está disponible en:

- **URL Principal**: `https://tu-dominio.com/admin/`
- **URL Alternativa**: `https://tu-dominio.com/admin/index.html`

## Configuración para GitHub Pages

Si estás usando GitHub Pages, el panel admin será accesible en:

- `https://tu-usuario.github.io/tu-repo/admin/`
- `https://tu-usuario.github.io/tu-repo/admin/index.html`

## Configuración para Servidor Web

### Apache (.htaccess)

Ya se ha creado un archivo `.htaccess` en la raíz y en `/admin/` que:
- Redirige `/admin` a `/admin/`
- Asegura que `index.html` sea el archivo por defecto
- Configura headers de seguridad

### Nginx

Si usas Nginx, agrega esta configuración:

```nginx
location /admin {
    try_files $uri $uri/ /admin/index.html;
}

location /admin/ {
    try_files $uri $uri/ /admin/index.html;
}
```

## Seguridad

⚠️ **IMPORTANTE**: El panel admin NO está protegido por contraseña a nivel de servidor. La autenticación se maneja completamente a través de Firebase Authentication.

### Recomendaciones de Seguridad

1. **Firebase Security Rules**: Asegúrate de configurar correctamente las reglas de Firestore y Storage
2. **HTTPS**: Siempre usa HTTPS en producción
3. **Usuarios**: Solo crea usuarios administradores de confianza
4. **Contraseñas**: Usa contraseñas fuertes para los usuarios admin

## Solución de Problemas

### Error 404 al acceder a /admin

- Verifica que el archivo `admin/index.html` exista
- Verifica las rutas relativas en `index.html`
- Si usas GitHub Pages, asegúrate de que la carpeta `admin/` esté en el repositorio

### Los recursos no cargan (CSS, JS)

- Verifica que las rutas relativas (`../vendor/...`) sean correctas
- Abre la consola del navegador para ver errores 404
- Asegúrate de que la estructura de carpetas sea correcta

### Firebase no funciona

- Verifica que `firebase-config.js` esté configurado correctamente
- Revisa la consola del navegador para errores de Firebase
- Asegúrate de que los scripts de Firebase se carguen antes de `firebase-config.js`

## Estructura de Archivos

```
/
├── admin/
│   ├── index.html          ← Panel principal
│   ├── firebase-config.js  ← Configuración Firebase
│   ├── admin-auth.js       ← Autenticación
│   ├── admin-blogs.js      ← Gestión de blogs
│   ├── admin-pages.js     ← Edición de páginas
│   ├── admin-media.js     ← Gestor de imágenes
│   ├── admin-main.js      ← Controlador principal
│   └── .htaccess          ← Configuración Apache
├── vendor/                 ← Bootstrap, jQuery, FontAwesome
├── js/                     ← Scripts del frontend
└── .htaccess              ← Configuración principal
```

## Próximos Pasos

1. Configura Firebase (ver `SETUP.md`)
2. Accede a `/admin/` en tu navegador
3. Inicia sesión con tus credenciales
4. ¡Empieza a gestionar contenido!


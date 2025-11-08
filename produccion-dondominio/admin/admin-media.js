// Media/Image Management
(function() {
  'use strict';

  const { db, storage, auth } = window.firebaseServices;

  // Load media
  window.loadMedia = async function() {
    const mediaGrid = document.getElementById('mediaGrid');
    mediaGrid.innerHTML = '<div class="col-12"><p class="text-muted">Cargando imágenes...</p></div>';

    try {
      const snapshot = await db.collection('media')
        .orderBy('createdAt', 'desc')
        .get();

      if (snapshot.empty) {
        mediaGrid.innerHTML = '<div class="col-12"><p class="text-muted">No hay imágenes. Sube tu primera imagen.</p></div>';
        return;
      }

      let html = '';
      snapshot.forEach(doc => {
        const media = doc.data();
        html += `
          <div class="col-md-3 mb-4">
            <div class="card">
              <img src="${media.url}" class="card-img-top" alt="${media.altText || ''}" style="height: 200px; object-fit: cover;">
              <div class="card-body">
                <p class="card-text small">${media.filename}</p>
                <div class="btn-group btn-group-sm w-100">
                  <button class="btn btn-primary copy-url-btn" data-url="${media.url}">
                    <i class="fas fa-copy"></i> Copiar URL
                  </button>
                  <button class="btn btn-danger delete-media-btn" data-id="${doc.id}" data-path="${media.path}">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      });
      mediaGrid.innerHTML = html;

      // Add event listeners
      document.querySelectorAll('.copy-url-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const url = this.getAttribute('data-url');
          navigator.clipboard.writeText(url).then(() => {
            alert('URL copiada al portapapeles');
          });
        });
      });

      document.querySelectorAll('.delete-media-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.getAttribute('data-id');
          const path = this.getAttribute('data-path');
          deleteMedia(id, path);
        });
      });

    } catch (error) {
      console.error('Error loading media:', error);
      mediaGrid.innerHTML = '<div class="col-12"><div class="alert alert-danger">Error al cargar imágenes</div></div>';
    }
  };

  // Upload image button
  document.getElementById('uploadImageBtn').addEventListener('click', function() {
    document.getElementById('imageUpload').click();
  });

  // Handle image upload
  document.getElementById('imageUpload').addEventListener('change', async function(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const user = auth.currentUser;
    if (!user) {
      alert('No estás autenticado');
      return;
    }

    for (const file of files) {
      await uploadImage(file, user);
    }

    // Reset input
    e.target.value = '';
    loadMedia();
  });

  // Upload single image
  async function uploadImage(file, user) {
    try {
      // Upload to Firebase Storage
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name}`;
      const imageRef = storage.ref().child(`media/${filename}`);
      
      const uploadTask = imageRef.put(file);
      
      await uploadTask;
      const downloadURL = await imageRef.getDownloadURL();

      // Get image dimensions (optional)
      const img = new Image();
      img.src = downloadURL;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Save metadata to Firestore
      await db.collection('media').add({
        filename: file.name,
        path: `media/${filename}`,
        url: downloadURL,
        mimeType: file.type,
        fileSize: file.size,
        width: img.width,
        height: img.height,
        altText: '',
        uploadedBy: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      console.log('Image uploaded successfully:', filename);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen: ' + error.message);
    }
  }

  // Delete media
  async function deleteMedia(id, path) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return;
    }

    try {
      // Delete from Storage
      const imageRef = storage.ref().child(path);
      await imageRef.delete();

      // Delete from Firestore
      await db.collection('media').doc(id).delete();

      loadMedia();
      alert('Imagen eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Error al eliminar la imagen');
    }
  }
})();


// Page Content Management with Inline Editing
(function() {
  'use strict';

  const { db } = window.firebaseServices;
  let currentPage = 'index';
  let pageContent = {};

  // Load page editor
  window.loadPageEditor = async function() {
    const pageSelector = document.getElementById('pageSelector');
    const editorContainer = document.getElementById('pageContentEditor');

    // Load page content
    pageSelector.addEventListener('change', async function() {
      currentPage = this.value;
      await loadPageContent();
    });

    // Initial load
    await loadPageContent();
  };

  // Load page content from Firestore
  async function loadPageContent() {
    const editorContainer = document.getElementById('pageContentEditor');
    editorContainer.innerHTML = '<p class="text-muted">Cargando contenido...</p>';

    try {
      const snapshot = await db.collection('pageContent')
        .where('page', '==', currentPage)
        .orderBy('order')
        .get();

      if (snapshot.empty) {
        // Initialize with default structure
        await initializePageContent();
        return;
      }

      let html = '<div class="page-editor">';
      snapshot.forEach(doc => {
        const content = doc.data();
        pageContent[doc.id] = content;
        
        html += `
          <div class="card mb-3 editable-section" data-id="${doc.id}">
            <div class="card-header d-flex justify-content-between align-items-center">
              <strong>${content.section}</strong>
              <button class="btn btn-sm btn-primary edit-section-btn" data-id="${doc.id}">
                <i class="fas fa-edit"></i> Editar
              </button>
            </div>
            <div class="card-body">
              <div class="content-display" data-id="${doc.id}">
                ${content.contentEs || 'Sin contenido'}
              </div>
              <div class="content-edit" data-id="${doc.id}" style="display: none;">
                <textarea class="form-control" rows="5" data-id="${doc.id}">${content.contentEs || ''}</textarea>
                <div class="mt-2">
                  <button class="btn btn-sm btn-success save-content-btn" data-id="${doc.id}">Guardar</button>
                  <button class="btn btn-sm btn-secondary cancel-edit-btn" data-id="${doc.id}">Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        `;
      });
      html += '</div>';
      editorContainer.innerHTML = html;

      // Add event listeners
      document.querySelectorAll('.edit-section-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.getAttribute('data-id');
          enableEditMode(id);
        });
      });

      document.querySelectorAll('.save-content-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.getAttribute('data-id');
          saveContent(id);
        });
      });

      document.querySelectorAll('.cancel-edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.getAttribute('data-id');
          cancelEdit(id);
        });
      });

    } catch (error) {
      console.error('Error loading page content:', error);
      editorContainer.innerHTML = '<div class="alert alert-danger">Error al cargar el contenido</div>';
    }
  };

  // Initialize page content structure
  async function initializePageContent() {
    const defaultSections = {
      index: [
        { section: 'Título Principal', fieldKey: 'main_title', order: 1 },
        { section: 'Subtítulo', fieldKey: 'subtitle', order: 2 },
        { section: 'Descripción', fieldKey: 'description', order: 3 }
      ],
      about: [
        { section: 'Título', fieldKey: 'title', order: 1 },
        { section: 'Subtítulo', fieldKey: 'subtitle', order: 2 },
        { section: 'Contenido Principal', fieldKey: 'main_content', order: 3 }
      ],
      contact: [
        { section: 'Título', fieldKey: 'title', order: 1 },
        { section: 'Subtítulo', fieldKey: 'subtitle', order: 2 }
      ]
    };

    const sections = defaultSections[currentPage] || [];
    
    for (const section of sections) {
      await db.collection('pageContent').add({
        page: currentPage,
        section: section.section,
        fieldKey: section.fieldKey,
        contentEs: '',
        order: section.order,
        type: 'text',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    await loadPageContent();
  }

  // Enable edit mode
  function enableEditMode(id) {
    const section = document.querySelector(`.editable-section[data-id="${id}"]`);
    section.querySelector('.content-display').style.display = 'none';
    section.querySelector('.content-edit').style.display = 'block';
    section.querySelector('.edit-section-btn').style.display = 'none';
  }

  // Cancel edit
  function cancelEdit(id) {
    const section = document.querySelector(`.editable-section[data-id="${id}"]`);
    const content = pageContent[id];
    section.querySelector('.content-display').style.display = 'block';
    section.querySelector('.content-edit').style.display = 'none';
    section.querySelector('.edit-section-btn').style.display = 'block';
    section.querySelector(`textarea[data-id="${id}"]`).value = content.contentEs || '';
  }

  // Save content
  async function saveContent(id) {
    const textarea = document.querySelector(`textarea[data-id="${id}"]`);
    const newContent = textarea.value;

    try {
      await db.collection('pageContent').doc(id).update({
        contentEs: newContent,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Update display
      const section = document.querySelector(`.editable-section[data-id="${id}"]`);
      section.querySelector('.content-display').textContent = newContent || 'Sin contenido';
      section.querySelector('.content-display').style.display = 'block';
      section.querySelector('.content-edit').style.display = 'none';
      section.querySelector('.edit-section-btn').style.display = 'block';

      // Update local cache
      pageContent[id].contentEs = newContent;

      alert('Contenido guardado exitosamente');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error al guardar el contenido');
    }
  }
})();


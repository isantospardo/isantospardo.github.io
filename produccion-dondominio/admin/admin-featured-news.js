// Featured News Management
(function() {
  'use strict';

  // Firebase references
  const db = window.firebaseServices?.db;
  const auth = window.firebaseServices?.auth;
  let featuredNewsQuillEditor = null;

  window.loadFeaturedNews = async function() {
    const listContainer = document.getElementById('featuredNewsList');
    if (!listContainer) return;

    listContainer.innerHTML = `
      <div class="text-center py-4">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="sr-only">Cargando...</span>
        </div>
        <p class="text-muted">Cargando noticias destacadas...</p>
      </div>
    `;

    try {
      if (!db) {
        throw new Error('Firebase no está inicializado');
      }

      // Get featured news from Firestore
      const featuredNewsRef = db.collection('featuredNews').orderBy('order', 'asc');
      const snapshot = await featuredNewsRef.get();

      if (snapshot.empty) {
        listContainer.innerHTML = `
          <div class="alert alert-info">
            <i class="fas fa-info-circle mr-2"></i>
            No hay noticias destacadas. Haz clic en "Agregar Noticia" para comenzar.
          </div>
        `;
        return;
      }

      // Category colors and icons
      const categoryInfo = {
        fiscal: { color: '#dc3545', icon: 'calculator', name: 'Fiscal' },
        laboral: { color: '#28a745', icon: 'briefcase', name: 'Laboral' },
        legal: { color: '#17a2b8', icon: 'gavel', name: 'Legal' },
        sucesiones: { color: '#ffc107', icon: 'file-invoice', name: 'Sucesiones' }
      };

      // Separate news by status
      const published = [];
      const drafts = [];
      const hidden = [];
      const archived = [];

      snapshot.forEach((doc) => {
        const featured = doc.data();
        const isDraft = featured.status === 'draft' || featured.draft === true;
        const isHidden = featured.hidden === true;
        const isArchived = featured.archived === true;

        const newsItem = {
          id: doc.id,
          data: featured,
          order: featured.order || 0
        };

        if (isArchived) {
          archived.push(newsItem);
        } else if (isHidden) {
          hidden.push(newsItem);
        } else if (isDraft) {
          drafts.push(newsItem);
        } else {
          published.push(newsItem);
        }
      });

      // Sort each category by order
      published.sort((a, b) => a.order - b.order);
      drafts.sort((a, b) => a.order - b.order);
      hidden.sort((a, b) => a.order - b.order);
      archived.sort((a, b) => a.order - b.order);

      // Function to render a news item
      function renderNewsItem(newsItem, draggable = true) {
        const featured = newsItem.data;
        const category = featured.category || 'fiscal';
        const catInfo = categoryInfo[category] || categoryInfo.fiscal;
        const isDraft = featured.status === 'draft' || featured.draft === true;
        const isHidden = featured.hidden === true;
        const isArchived = featured.archived === true;

        return `
          <div class="list-group-item" data-id="${newsItem.id}" data-order="${featured.order || 0}" ${draggable ? 'draggable="true" style="cursor: move;"' : ''}>
            <div class="d-flex justify-content-between align-items-center">
              <div class="flex-grow-1">
                <div class="d-flex align-items-center mb-2">
                  ${draggable ? '<i class="fas fa-grip-vertical mr-2 text-muted" style="cursor: grab;"></i>' : ''}
                  <span class="badge mr-2" style="background-color: ${catInfo.color}; color: white;">
                    <i class="fas fa-${catInfo.icon} mr-1"></i> ${catInfo.name}
                  </span>
                  <h6 class="mb-0">${featured.title || 'Sin título'}</h6>
                </div>
                <p class="text-muted mb-1 small">${featured.subtitle || featured.description || ''}</p>
                <div class="mt-2 d-flex align-items-center">
                  <div class="form-check form-check-inline mr-3">
                    <input class="form-check-input" type="checkbox" id="draft_${newsItem.id}" ${isDraft ? 'checked' : ''} onchange="toggleFeaturedNewsStatus('${newsItem.id}', 'draft', this.checked)">
                    <label class="form-check-label small" for="draft_${newsItem.id}">
                      Borrador
                    </label>
                  </div>
                  <div class="form-check form-check-inline mr-3">
                    <input class="form-check-input" type="checkbox" id="hidden_${newsItem.id}" ${isHidden ? 'checked' : ''} onchange="toggleFeaturedNewsStatus('${newsItem.id}', 'hidden', this.checked)">
                    <label class="form-check-label small" for="hidden_${newsItem.id}">
                      Oculto
                    </label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="archived_${newsItem.id}" ${isArchived ? 'checked' : ''} onchange="toggleFeaturedNewsStatus('${newsItem.id}', 'archived', this.checked)">
                    <label class="form-check-label small" for="archived_${newsItem.id}">
                      Archivado
                    </label>
                  </div>
                </div>
              </div>
              <div class="ml-3">
                ${!isDraft && !isHidden && !isArchived ? 
                  `<button class="btn btn-sm btn-outline-warning mr-2" onclick="togglePublishFeaturedNews('${newsItem.id}', false)" title="Despublicar">
                    <i class="fas fa-eye-slash"></i> Despublicar
                  </button>` : 
                  `<button class="btn btn-sm btn-outline-success mr-2" onclick="togglePublishFeaturedNews('${newsItem.id}', true)" title="Publicar">
                    <i class="fas fa-eye"></i> Publicar
                  </button>`
                }
                <button class="btn btn-sm btn-outline-primary mr-2" onclick="editFeaturedNews('${newsItem.id}')">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteFeaturedNews('${newsItem.id}')">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        `;
      }

      // Build HTML with sections
      let html = '';

      // Published section
      html += `
        <div class="mb-4">
          <h5 class="mb-3">
            <i class="fas fa-check-circle text-success mr-2"></i>
            Publicadas (${published.length})
          </h5>
          <div class="list-group" id="publishedList">
      `;
      if (published.length === 0) {
        html += '<div class="list-group-item text-muted text-center py-3">No hay noticias publicadas</div>';
      } else {
        published.forEach(item => {
          html += renderNewsItem(item, true);
        });
      }
      html += '</div></div>';

      // Drafts section
      if (drafts.length > 0) {
        html += `
          <div class="mb-4">
            <h5 class="mb-3">
              <i class="fas fa-edit text-info mr-2"></i>
              Borradores (${drafts.length})
            </h5>
            <div class="list-group" id="draftsList">
        `;
        drafts.forEach(item => {
          html += renderNewsItem(item, false);
        });
        html += '</div></div>';
      }

      // Hidden section
      if (hidden.length > 0) {
        html += `
          <div class="mb-4">
            <h5 class="mb-3">
              <i class="fas fa-eye-slash text-secondary mr-2"></i>
              Ocultas (${hidden.length})
            </h5>
            <div class="list-group" id="hiddenList">
        `;
        hidden.forEach(item => {
          html += renderNewsItem(item, false);
        });
        html += '</div></div>';
      }

      // Archived section
      if (archived.length > 0) {
        html += `
          <div class="mb-4">
            <h5 class="mb-3">
              <i class="fas fa-archive text-warning mr-2"></i>
              Archivadas (${archived.length})
            </h5>
            <div class="list-group" id="archivedList">
        `;
        archived.forEach(item => {
          html += renderNewsItem(item, false);
        });
        html += '</div></div>';
      }

      listContainer.innerHTML = html;
      
      // Initialize drag and drop only for published items
      initDragAndDrop();
    } catch (error) {
      console.error('Error loading featured news:', error);
      listContainer.innerHTML = `
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          Error al cargar noticias destacadas: ${error.message}
        </div>
      `;
    }
  };

  // Initialize drag and drop for reordering
  function initDragAndDrop() {
    // Only allow drag and drop on published items
    const publishedList = document.getElementById('publishedList');
    if (!publishedList) return;

    const items = publishedList.querySelectorAll('.list-group-item[draggable="true"]');
    
    items.forEach(item => {
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragover', handleDragOver);
      item.addEventListener('drop', handleDrop);
      item.addEventListener('dragend', handleDragEnd);
    });
  }

  let draggedElement = null;

  function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedElement !== this) {
      const rect = this.getBoundingClientRect();
      const midpoint = rect.top + (rect.height / 2);
      
      if (e.clientY < midpoint) {
        this.parentNode.insertBefore(draggedElement, this);
      } else {
        this.parentNode.insertBefore(draggedElement, this.nextSibling);
      }
    }
    return false;
  }

  function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    return false;
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';
    
    // Update order in Firebase
    updateOrder();
  }

  // Update order after drag and drop
  async function updateOrder() {
    const listContainer = document.getElementById('featuredNewsList');
    if (!listContainer || !db) return;

    const items = Array.from(listContainer.querySelectorAll('.list-group-item[draggable="true"]'));
    
    try {
      const updatePromises = items.map((item, index) => {
        const id = item.getAttribute('data-id');
        return db.collection('featuredNews').doc(id).update({
          order: index,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error actualizando orden:', error);
      alert('Error al actualizar el orden. Recargando...');
      loadFeaturedNews();
    }
  }

  // Add new featured news
  document.getElementById('addFeaturedNewsBtn')?.addEventListener('click', function() {
    openFeaturedNewsEditor();
  });

  // Open featured news editor
  window.openFeaturedNewsEditor = function(featuredId = null) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('featuredNewsModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal fade';
      modal.id = 'featuredNewsModal';
      modal.setAttribute('tabindex', '-1');
      modal.innerHTML = `
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${featuredId ? 'Editar' : 'Agregar'} Noticia Destacada</h5>
              <button type="button" class="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form id="featuredNewsForm">
                <input type="hidden" id="featuredNewsId" value="">
                <div class="form-group">
                  <label for="featuredNewsTitle">Título <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="featuredNewsTitle" required>
                </div>
                <div class="form-group">
                  <label for="featuredNewsDescription">Description <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="featuredNewsDescription" required>
                </div>
                <div class="form-group">
                  <label for="featuredNewsCategory">Categoría</label>
                  <select class="form-control" id="featuredNewsCategory">
                    <option value="fiscal">Fiscal</option>
                    <option value="laboral">Laboral</option>
                    <option value="legal">Legal</option>
                    <option value="sucesiones">Sucesiones</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="featuredNewsDate">Fecha de Publicación</label>
                  <input type="date" class="form-control" id="featuredNewsDate">
                  <small class="form-text text-muted">Si no se especifica, se usará la fecha actual</small>
                </div>
                <div class="form-group">
                  <label for="featuredNewsContent">Texto</label>
                  <div id="featuredNewsContent" style="height: 300px;"></div>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="featuredNewsDraft" value="1">
                    <label class="form-check-label" for="featuredNewsDraft">
                      Marcar como borrador
                    </label>
                    <small class="form-text text-muted d-block">Las noticias en borrador no se mostrarán en la página principal</small>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" id="saveFeaturedNewsBtn" onclick="window.saveFeaturedNews && window.saveFeaturedNews();">
                <i class="fas fa-save mr-2"></i> Guardar
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    // Initialize Quill editor if not already initialized
    if (!featuredNewsQuillEditor) {
      featuredNewsQuillEditor = new Quill('#featuredNewsContent', {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image'],
            ['clean']
          ]
        }
      });
    }

    // If editing, load the featured news data
    if (featuredId) {
      loadFeaturedNewsData(featuredId);
    } else {
      // Reset form - new items are published by default
      document.getElementById('featuredNewsId').value = '';
      document.getElementById('featuredNewsTitle').value = '';
      document.getElementById('featuredNewsDescription').value = '';
      document.getElementById('featuredNewsCategory').value = 'fiscal';
      document.getElementById('featuredNewsDraft').checked = false;
      
      // Set date to today
      const dateInput = document.getElementById('featuredNewsDate');
      if (dateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
      }
      
      featuredNewsQuillEditor.setContents([]);
    }

    $(modal).modal('show');
  };

  async function loadFeaturedNewsData(featuredId) {
    try {
      if (!db) {
        throw new Error('Firebase no está inicializado');
      }

      const doc = await db.collection('featuredNews').doc(featuredId).get();
      
      if (!doc.exists) {
        alert('Noticia destacada no encontrada');
        return;
      }

      const data = doc.data();
      document.getElementById('featuredNewsId').value = featuredId;
      document.getElementById('featuredNewsTitle').value = data.title || '';
      document.getElementById('featuredNewsDescription').value = data.subtitle || data.description || '';
      document.getElementById('featuredNewsCategory').value = data.category || 'fiscal';
      document.getElementById('featuredNewsDraft').checked = data.draft === true || data.status === 'draft';
      
      // Set date field
      const dateInput = document.getElementById('featuredNewsDate');
      if (dateInput) {
        if (data.createdAt) {
          // Convert Firestore Timestamp to Date
          const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          // Format as YYYY-MM-DD for date input
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          dateInput.value = `${year}-${month}-${day}`;
        } else {
          // Default to today
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const day = String(today.getDate()).padStart(2, '0');
          dateInput.value = `${year}-${month}-${day}`;
        }
      }
      
      if (featuredNewsQuillEditor && data.contentEs) {
        featuredNewsQuillEditor.setContents(data.contentEs);
      } else if (featuredNewsQuillEditor) {
        featuredNewsQuillEditor.setContents([]);
      }
    } catch (error) {
      console.error('Error loading featured news data:', error);
      alert('Error al cargar los datos de la noticia destacada');
    }
  }

  // Edit featured news
  window.editFeaturedNews = function(featuredId) {
    openFeaturedNewsEditor(featuredId);
  };

  // Toggle publish/unpublish featured news
  window.togglePublishFeaturedNews = async function(featuredId, publish) {
    try {
      if (!db) {
        throw new Error('Firebase no está inicializado');
      }

      const updateData = {
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      if (publish) {
        updateData.status = 'published';
        updateData.draft = false;
        updateData.hidden = false;
        updateData.archived = false;
      } else {
        updateData.status = 'draft';
        updateData.draft = true;
      }

      await db.collection('featuredNews').doc(featuredId).update(updateData);
      loadFeaturedNews();
      
      if (publish) {
        alert('Noticia publicada correctamente');
      } else {
        alert('Noticia despublicada correctamente');
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Error al cambiar el estado de publicación: ' + error.message);
      loadFeaturedNews();
    }
  };

  // Toggle featured news status (draft, hidden, archived)
  window.toggleFeaturedNewsStatus = async function(featuredId, field, value) {
    try {
      if (!db) {
        throw new Error('Firebase no está inicializado');
      }

      const updateData = {};
      if (field === 'draft') {
        // When unchecking draft, also uncheck hidden and archived to ensure it's published
        updateData.status = value ? 'draft' : 'published';
        updateData.draft = value;
        if (!value) {
          // If unchecking draft, ensure it's not hidden or archived
          updateData.hidden = false;
          updateData.archived = false;
        }
      } else {
        updateData[field] = value;
        // If marking as hidden or archived, also mark as draft
        if (field === 'hidden' || field === 'archived') {
          if (value) {
            updateData.draft = true;
            updateData.status = 'draft';
          }
        }
      }
      updateData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();

      await db.collection('featuredNews').doc(featuredId).update(updateData);
      loadFeaturedNews();
    } catch (error) {
      console.error('Error updating featured news status:', error);
      alert('Error al actualizar el estado: ' + error.message);
      loadFeaturedNews();
    }
  };

  // Delete featured news
  window.deleteFeaturedNews = async function(featuredId) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta noticia destacada?')) {
      return;
    }

    try {
      if (!db) {
        throw new Error('Firebase no está inicializado');
      }

      await db.collection('featuredNews').doc(featuredId).delete();
      alert('Noticia destacada eliminada correctamente');
      loadFeaturedNews();
    } catch (error) {
      console.error('Error deleting featured news:', error);
      alert('Error al eliminar la noticia destacada: ' + error.message);
    }
  };

  // Save featured news function
  window.saveFeaturedNews = async function() {
    const form = document.getElementById('featuredNewsForm');
    if (!form || !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const featuredId = document.getElementById('featuredNewsId').value;
    const title = document.getElementById('featuredNewsTitle').value.trim();
    const description = document.getElementById('featuredNewsDescription').value.trim();
    const category = document.getElementById('featuredNewsCategory').value;
    const draft = document.getElementById('featuredNewsDraft').checked;
    const dateInputElement = document.getElementById('featuredNewsDate');
    const dateInput = dateInputElement ? dateInputElement.value.trim() : '';
    
      let contentEs = { ops: [] };
      if (featuredNewsQuillEditor) {
        const delta = featuredNewsQuillEditor.getContents();
        contentEs = {
          ops: delta.ops || []
        };
        contentEs = JSON.parse(JSON.stringify(contentEs));
      }

    if (!title || !description) {
      alert('Por favor, completa el título y la descripción');
      return;
    }

    try {
      if (!db || !auth) {
        throw new Error('Firebase no está inicializado');
      }

      const user = auth.currentUser;
      if (!user) {
        throw new Error('No estás autenticado');
      }

      let order = 0;
      if (!featuredId) {
        const snapshot = await db.collection('featuredNews').orderBy('order', 'desc').limit(1).get();
        if (!snapshot.empty) {
          order = (snapshot.docs[0].data().order || 0) + 1;
        }
      }

      let hidden = false;
      let archived = false;
      if (featuredId) {
        const existingDoc = await db.collection('featuredNews').doc(featuredId).get();
        if (existingDoc.exists) {
          const existingData = existingDoc.data();
          hidden = existingData.hidden === true;
          archived = existingData.archived === true;
        }
      }

      const featuredData = {
        title: title,
        subtitle: description,
        description: description,
        category: category,
        contentEs: contentEs,
        status: draft ? 'draft' : 'published',
        draft: draft,
        hidden: hidden,
        archived: archived,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        authorId: user.uid
      };

      let newsDate;
      if (dateInput && dateInput.length > 0) {
        const dateParts = dateInput.split('-');
        if (dateParts.length === 3) {
          const year = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10) - 1;
          const day = parseInt(dateParts[2], 10);
          newsDate = new Date(year, month, day, 12, 0, 0, 0);
        } else {
          newsDate = new Date(dateInput);
          newsDate.setHours(12, 0, 0, 0);
        }
      } else {
        newsDate = new Date();
        newsDate.setHours(12, 0, 0, 0);
      }

      if (isNaN(newsDate.getTime())) {
        alert('La fecha seleccionada no es válida. Se usará la fecha actual.');
        newsDate = new Date();
        newsDate.setHours(12, 0, 0, 0);
      }

      const createdAtTimestamp = firebase.firestore.Timestamp.fromDate(newsDate);

      if (!featuredId) {
        featuredData.order = order;
        featuredData.createdAt = createdAtTimestamp;
      } else {
        featuredData.createdAt = createdAtTimestamp;
      }

      if (featuredId) {
        const existingDoc = await db.collection('featuredNews').doc(featuredId).get();
        if (existingDoc.exists) {
          featuredData.order = existingDoc.data().order || 0;
        }
        await db.collection('featuredNews').doc(featuredId).update(featuredData);
        alert('Noticia destacada actualizada correctamente');
      } else {
        await db.collection('featuredNews').add(featuredData);
        alert('Noticia destacada agregada correctamente');
      }

      $('#featuredNewsModal').modal('hide');
      loadFeaturedNews();
    } catch (error) {
      console.error('Error saving featured news:', error);
      alert('Error al guardar la noticia destacada: ' + error.message);
    }
  };

  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'saveFeaturedNewsBtn') {
      e.preventDefault();
      window.saveFeaturedNews();
    }
  });

})();


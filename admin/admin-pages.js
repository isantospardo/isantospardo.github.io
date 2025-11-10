// Page Content Management with Quill Editor
(function() {
  'use strict';

  const { db } = window.firebaseServices;
  let currentPage = 'index';
  let pageContent = {};
  let quillEditors = {};

  // Load page editor
  window.loadPageEditor = async function() {
    const pageSelector = document.getElementById('pageSelector');
    const editorContainer = document.getElementById('pageContentEditor');

    if (!pageSelector || !editorContainer) {
      return;
    }

    // Load page content when selector changes
    pageSelector.addEventListener('change', async function() {
      currentPage = this.value;
      // Destroy existing editors
      Object.values(quillEditors).forEach(editor => {
        if (editor && editor.root) {
          editor.root.remove();
        }
      });
      quillEditors = {};
      await loadPageContent();
    });

    // Initial load
    await loadPageContent();
  };

  // Load page content from Firestore
  async function loadPageContent() {
    const editorContainer = document.getElementById('pageContentEditor');
    if (!editorContainer) return;

    editorContainer.innerHTML = '<p class="text-muted">Cargando contenido...</p>';

    try {
      // Intentar con orderBy primero
      let snapshot;
      try {
        snapshot = await db.collection('pageContent')
          .where('page', '==', currentPage)
          .orderBy('order')
          .get();
      } catch (orderByError) {
        // Si falla por índice, intentar sin orderBy y ordenar en memoria
        if (orderByError.code === 'failed-precondition' || orderByError.message.includes('index')) {
          console.warn('Índice compuesto no encontrado, cargando sin orderBy...');
          snapshot = await db.collection('pageContent')
            .where('page', '==', currentPage)
            .get();
          
          // Ordenar en memoria
          const docs = [];
          snapshot.forEach(doc => docs.push({ id: doc.id, data: doc.data() }));
          docs.sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
          
          // Crear snapshot simulado
          snapshot = {
            empty: docs.length === 0,
            forEach: (callback) => {
              docs.forEach(item => {
                callback({
                  id: item.id,
                  data: () => item.data
                });
              });
            }
          };
        } else {
          throw orderByError;
        }
      }

      if (snapshot.empty) {
        await initializePageContent();
        return;
      }

      // Si es la página "about", mostrar un solo editor grande con todo el contenido como texto continuo
      if (currentPage === 'about') {
        const contentMap = {};
        let combinedHTML = '';
        let mainFieldKey = 'welcome';
        
        snapshot.forEach(doc => {
          const content = doc.data();
          pageContent[doc.id] = content;
          contentMap[content.fieldKey] = { id: doc.id, content: content };
        });
        
        // Verificar si el campo "welcome" tiene contenido (contenido unificado)
        const welcomeContent = contentMap[mainFieldKey];
        const welcomeContentText = welcomeContent && welcomeContent.content.contentEs ? welcomeContent.content.contentEs.trim() : '';
        
        // Si welcome tiene contenido significativo (más de 200 caracteres), usarlo directamente
        // Esto indica que ya contiene contenido unificado
        if (welcomeContentText && welcomeContentText.length > 200) {
          // Si welcome tiene contenido unificado, usarlo directamente
          combinedHTML = welcomeContent.content.contentEs;
        } else {
          // Si welcome está vacío o es muy corto, combinar todo el contenido de todos los campos EXCEPTO welcome
          const allContent = [];
          snapshot.forEach(doc => {
            const content = doc.data();
            // Excluir el campo "welcome" de la combinación para evitar duplicados
            if (content.fieldKey !== 'welcome') {
              const sectionContent = content.contentEs || '';
              if (sectionContent.trim()) {
                allContent.push({ fieldKey: content.fieldKey, order: content.order || 0, html: sectionContent });
              }
            }
          });
          
          // Ordenar por order
          allContent.sort((a, b) => a.order - b.order);
          
          // Crear HTML combinado como texto continuo
          combinedHTML = allContent.map(item => item.html).join('\n\n');
        }
        
        // Guardar el mapeo de campos para cuando se guarde
        window.aboutContentMap = contentMap;
        window.aboutContentOrder = Object.keys(contentMap);
        window.aboutCombinedHTML = combinedHTML; // Guardar para cuando se active el editor
        
        const html = `
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <div>
                <h5 class="mb-0"><i class="fas fa-file-alt mr-2"></i>Contenido - Página About</h5>
                <small class="text-muted">Vista previa del contenido de la página</small>
              </div>
              <button class="btn btn-primary btn-lg" id="edit-about-btn">
                <i class="fas fa-edit mr-2"></i> Editar
              </button>
            </div>
            <div class="card-body">
              <div id="about-content-display" style="min-height: 400px; padding: 1rem; border: 1px solid #dee2e6; border-radius: 4px; background-color: #f8f9fa;">
                ${combinedHTML || '<p class="text-muted">Sin contenido</p>'}
              </div>
              <div id="about-content-edit" style="display: none;">
                <div id="quill-editor-about-unified" style="min-height: 600px;"></div>
                <div class="mt-3">
                  <button class="btn btn-success btn-lg" id="save-about-unified-btn">
                    <i class="fas fa-save mr-2"></i> Guardar Todo el Contenido
                  </button>
                  <button class="btn btn-secondary btn-lg" id="cancel-about-edit-btn" style="margin-left: 10px;">
                    <i class="fas fa-times mr-2"></i> Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
        
        editorContainer.innerHTML = html;
        
        // Event listener para el botón Editar
        document.getElementById('edit-about-btn').addEventListener('click', function() {
          const displayDiv = document.getElementById('about-content-display');
          const editDiv = document.getElementById('about-content-edit');
          const editBtn = document.getElementById('edit-about-btn');
          
          // Ocultar vista previa y mostrar editor
          displayDiv.style.display = 'none';
          editDiv.style.display = 'block';
          editBtn.style.display = 'none';
          
          // Inicializar Quill Editor si no está inicializado
          const editorId = 'quill-editor-about-unified';
          if (!quillEditors[editorId]) {
            quillEditors[editorId] = new Quill(`#${editorId}`, {
              theme: 'snow',
              modules: {
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'align': [] }],
                  ['link', 'image'],
                  ['clean']
                ]
              },
              placeholder: 'Edita todo el contenido de la página aquí...'
            });
            
            // Cargar contenido combinado
            quillEditors[editorId].root.innerHTML = window.aboutCombinedHTML || '';
          }
        });
        
        // Event listener para el botón Cancelar
        document.getElementById('cancel-about-edit-btn').addEventListener('click', function() {
          const displayDiv = document.getElementById('about-content-display');
          const editDiv = document.getElementById('about-content-edit');
          const editBtn = document.getElementById('edit-about-btn');
          
          // Mostrar vista previa y ocultar editor
          displayDiv.style.display = 'block';
          editDiv.style.display = 'none';
          editBtn.style.display = 'block';
        });
        
        // Event listener para guardar
        document.getElementById('save-about-unified-btn').addEventListener('click', async function() {
          await saveAboutUnifiedContent();
          
          // Después de guardar, actualizar la vista previa y volver a modo lectura
          const editorId = 'quill-editor-about-unified';
          const editor = quillEditors[editorId];
          if (editor) {
            const displayDiv = document.getElementById('about-content-display');
            const editDiv = document.getElementById('about-content-edit');
            const editBtn = document.getElementById('edit-about-btn');
            
            // Actualizar contenido de vista previa
            displayDiv.innerHTML = editor.root.innerHTML;
            window.aboutCombinedHTML = editor.root.innerHTML;
            
            // Volver a modo lectura
            displayDiv.style.display = 'block';
            editDiv.style.display = 'none';
            editBtn.style.display = 'block';
          }
        });
        
        return;
      }

      // Para la página "index", mostrar solo los textos principales y FAQs agrupadas
      if (currentPage === 'index') {
        const contentMap = {};
        const mainTextFields = ['description', 'contact_text'];
        const faqItems = [];
        const otherFields = [];
        
        snapshot.forEach(doc => {
          const content = doc.data();
          pageContent[doc.id] = content;
          contentMap[content.fieldKey] = { id: doc.id, content: content };
          
          if (mainTextFields.includes(content.fieldKey)) {
            // Textos principales
          } else if (content.fieldKey.startsWith('faq_item_')) {
            // FAQs individuales con estructura: faq_item_1, faq_item_2, etc.
            faqItems.push({ id: doc.id, fieldKey: content.fieldKey, content: content });
          } else {
            otherFields.push({ id: doc.id, fieldKey: content.fieldKey, content: content });
          }
        });
        
        // Ordenar FAQs por order
        faqItems.sort((a, b) => (a.content.order || 0) - (b.content.order || 0));
        
        // Combinar description y contact_text con un separador claro
        const descriptionContent = contentMap['description']?.content.contentEs || '';
        const contactTextContent = contentMap['contact_text']?.content.contentEs || '';
        // Usar un separador claro para poder dividir después
        const combinedMainText = (descriptionContent + '<hr style="margin: 2rem 0; border: none; border-top: 2px dashed #dee2e6;">' + contactTextContent).trim();
        
        let html = '<div class="page-editor">';
        
        // Sección de Textos Principales
        html += `
          <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center bg-primary text-white">
              <div>
                <h5 class="mb-0"><i class="fas fa-file-alt mr-2"></i>Textos Principales</h5>
                <small class="text-white-50">Vista previa del contenido de la página</small>
              </div>
              <button class="btn btn-light btn-lg" id="edit-index-main-text-btn">
                <i class="fas fa-edit mr-2"></i> Editar
              </button>
            </div>
            <div class="card-body">
              <div id="index-main-text-display" style="min-height: 300px; padding: 1rem; border: 1px solid #dee2e6; border-radius: 4px; background-color: #f8f9fa;">
                ${combinedMainText || '<p class="text-muted">Sin contenido</p>'}
              </div>
              <div id="index-main-text-edit" style="display: none;">
                <div id="quill-editor-index-main-text" style="min-height: 300px;"></div>
                <div class="mt-3">
                  <button class="btn btn-success btn-lg" id="save-index-main-text-btn">
                    <i class="fas fa-save mr-2"></i> Guardar Textos Principales
                  </button>
                  <button class="btn btn-secondary btn-lg" id="cancel-index-main-text-btn" style="margin-left: 10px;">
                    <i class="fas fa-times mr-2"></i> Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // Sección de Preguntas Frecuentes
        html += `
          <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center" style="background-color: #007f7e; color: white;">
              <div>
                <h5 class="mb-0"><i class="fas fa-question-circle mr-2"></i>Preguntas Frecuentes</h5>
                <small class="text-white-50">Edita las preguntas y respuestas de la sección FAQ</small>
              </div>
              <button class="btn btn-light btn-sm" id="add-faq-btn">
                <i class="fas fa-plus mr-1"></i> Añadir Pregunta
              </button>
            </div>
            <div class="card-body" style="background-color: #f8f9fa;" id="faq-items-container">
        `;
        
        faqItems.forEach((faq, index) => {
          // Parsear el contenido para extraer título y contenido
          const faqContent = faq.content.contentEs || '';
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = faqContent;
          
          // Buscar el título (primer h5 o p con negrita) y el contenido
          const titleElement = tempDiv.querySelector('h5, h4, h3, strong, b');
          let faqTitle = '';
          let faqAnswer = '';
          
          if (titleElement) {
            faqTitle = titleElement.textContent.trim();
            titleElement.remove();
            faqAnswer = tempDiv.innerHTML.trim();
          } else {
            // Si no hay título claro, dividir por el primer párrafo
            const paragraphs = tempDiv.querySelectorAll('p');
            if (paragraphs.length > 0) {
              faqTitle = paragraphs[0].textContent.trim();
              if (paragraphs.length > 1) {
                faqAnswer = Array.from(paragraphs).slice(1).map(p => p.outerHTML).join('');
              }
            } else {
              faqTitle = 'Nueva Pregunta';
              faqAnswer = faqContent;
            }
          }
          
          // Escapar el título para HTML
          const escapedTitle = faqTitle.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
          
          html += `
            <div class="card mb-3 faq-item" data-faq-id="${faq.id}" style="border-left: 4px solid #007f7e;">
              <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <div>
                  <strong>Pregunta ${index + 1}</strong>
                </div>
                <div>
                  <button class="btn btn-sm btn-primary edit-faq-btn" data-id="${faq.id}" style="margin-right: 5px;">
                    <i class="fas fa-edit mr-1"></i> Editar
                  </button>
                  <button class="btn btn-sm btn-danger delete-faq-btn" data-id="${faq.id}">
                    <i class="fas fa-trash mr-1"></i> Eliminar
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div id="faq-display-${faq.id}">
                  <div class="mb-3">
                    <strong style="color: #007f7e; font-size: 1.1rem;">${escapedTitle}</strong>
                  </div>
                  <div style="padding: 1rem; border: 1px solid #dee2e6; border-radius: 4px; background-color: #f8f9fa;">
                    ${faqAnswer || '<p class="text-muted">Sin respuesta disponible.</p>'}
                  </div>
                </div>
                <div id="faq-edit-${faq.id}" style="display: none;">
                  <div class="form-group">
                    <label><strong>Título (Pregunta):</strong></label>
                    <input type="text" class="form-control faq-title-input" data-id="${faq.id}" value="${escapedTitle}" placeholder="Escribe la pregunta aquí...">
                  </div>
                  <div class="form-group">
                    <label><strong>Contenido (Respuesta):</strong></label>
                    <div id="quill-editor-faq-${faq.id}" style="min-height: 150px;"></div>
                  </div>
                  <div class="mt-2">
                    <button class="btn btn-sm btn-success save-faq-btn" data-id="${faq.id}">
                      <i class="fas fa-save mr-1"></i> Guardar Pregunta
                    </button>
                    <button class="btn btn-sm btn-secondary cancel-faq-btn" data-id="${faq.id}" style="margin-left: 5px;">
                      <i class="fas fa-times mr-1"></i> Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
        
        html += `
            </div>
          </div>
        `;
        
        // No mostrar otros campos en index.html, solo textos principales y FAQs
        
        html += '</div>';
        editorContainer.innerHTML = html;
        
        // Inicializar editor de textos principales
        const mainTextEditorId = 'quill-editor-index-main-text';
        quillEditors[mainTextEditorId] = new Quill(`#${mainTextEditorId}`, {
          theme: 'snow',
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['link', 'image'],
              ['clean']
            ]
          },
          placeholder: 'Edita los textos principales aquí...'
        });
        quillEditors[mainTextEditorId].root.innerHTML = combinedMainText;
        
        // Guardar referencias para guardar
        window.indexMainTextMap = {
          description: contentMap['description'],
          contact_text: contentMap['contact_text']
        };
        
        // Event listener para el botón Editar
        document.getElementById('edit-index-main-text-btn').addEventListener('click', function() {
          const displayDiv = document.getElementById('index-main-text-display');
          const editDiv = document.getElementById('index-main-text-edit');
          const editBtn = document.getElementById('edit-index-main-text-btn');
          
          // Ocultar vista previa y mostrar editor
          displayDiv.style.display = 'none';
          editDiv.style.display = 'block';
          editBtn.style.display = 'none';
        });
        
        // Event listener para el botón Cancelar
        document.getElementById('cancel-index-main-text-btn').addEventListener('click', function() {
          const displayDiv = document.getElementById('index-main-text-display');
          const editDiv = document.getElementById('index-main-text-edit');
          const editBtn = document.getElementById('edit-index-main-text-btn');
          
          // Mostrar vista previa y ocultar editor
          displayDiv.style.display = 'block';
          editDiv.style.display = 'none';
          editBtn.style.display = 'block';
        });
        
        // Event listener para guardar textos principales
        document.getElementById('save-index-main-text-btn').addEventListener('click', async function() {
          await saveIndexMainText();
          
          // Después de guardar, actualizar la vista previa y volver a modo lectura
          const editorId = 'quill-editor-index-main-text';
          const editor = quillEditors[editorId];
          if (editor) {
            const displayDiv = document.getElementById('index-main-text-display');
            const editDiv = document.getElementById('index-main-text-edit');
            const editBtn = document.getElementById('edit-index-main-text-btn');
            
            // Actualizar contenido de vista previa
            displayDiv.innerHTML = editor.root.innerHTML;
            
            // Volver a modo lectura
            displayDiv.style.display = 'block';
            editDiv.style.display = 'none';
            editBtn.style.display = 'block';
          }
        });
        
        // Inicializar editores de FAQs
        faqItems.forEach(faq => {
          const editorId = `quill-editor-faq-${faq.id}`;
          const editorContainer = document.getElementById(editorId);
          
          if (editorContainer) {
            // Parsear el contenido para extraer la respuesta
            const faqContent = faq.content.contentEs || '';
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = faqContent;
            
            const titleElement = tempDiv.querySelector('h5, h4, h3, strong, b');
            let faqAnswer = '';
            
            if (titleElement) {
              titleElement.remove();
              faqAnswer = tempDiv.innerHTML.trim();
            } else {
              const paragraphs = tempDiv.querySelectorAll('p');
              if (paragraphs.length > 1) {
                faqAnswer = Array.from(paragraphs).slice(1).map(p => p.outerHTML).join('');
              } else {
                faqAnswer = faqContent;
              }
            }
            
            quillEditors[`faq-${faq.id}`] = new Quill(`#${editorId}`, {
              theme: 'snow',
              modules: {
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'align': [] }],
                  ['link', 'image'],
                  ['clean']
                ]
              },
              placeholder: 'Escribe la respuesta aquí...'
            });
            quillEditors[`faq-${faq.id}`].root.innerHTML = faqAnswer || '';
          }
        });
        
        // Guardar referencias de FAQs
        window.indexFaqItems = faqItems;
        
        // Event listeners para editar FAQs
        document.querySelectorAll('.edit-faq-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const displayDiv = document.getElementById(`faq-display-${id}`);
            const editDiv = document.getElementById(`faq-edit-${id}`);
            const editBtn = this; // El botón actual
            
            // Ocultar vista previa y mostrar editor
            if (displayDiv) displayDiv.style.display = 'none';
            if (editDiv) editDiv.style.display = 'block';
            
            // Ocultar botón Editar
            editBtn.style.display = 'none';
          });
        });
        
        // Event listeners para cancelar edición de FAQs
        document.querySelectorAll('.cancel-faq-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const displayDiv = document.getElementById(`faq-display-${id}`);
            const editDiv = document.getElementById(`faq-edit-${id}`);
            const editBtn = document.querySelector(`.edit-faq-btn[data-id="${id}"]`);
            
            // Mostrar vista previa y ocultar editor
            if (displayDiv) displayDiv.style.display = 'block';
            if (editDiv) editDiv.style.display = 'none';
            if (editBtn) editBtn.style.display = 'inline-block';
          });
        });
        
        // Event listeners para guardar FAQs
        document.querySelectorAll('.save-faq-btn').forEach(btn => {
          btn.addEventListener('click', async function() {
            const id = this.getAttribute('data-id');
            await saveFaqItem(id);
            
            // Después de guardar, actualizar la vista previa y volver a modo lectura
            const editorId = `quill-editor-faq-${id}`;
            const editor = quillEditors[`faq-${id}`];
            if (editor) {
              const displayDiv = document.getElementById(`faq-display-${id}`);
              const editDiv = document.getElementById(`faq-edit-${id}`);
              const editBtn = document.querySelector(`.edit-faq-btn[data-id="${id}"]`);
              const titleInput = document.querySelector(`.faq-title-input[data-id="${id}"]`);
              
              if (displayDiv && titleInput) {
                // Actualizar contenido de vista previa
                const title = titleInput.value.trim();
                const answer = editor.root.innerHTML;
                
                displayDiv.innerHTML = `
                  <div class="mb-3">
                    <strong style="color: #007f7e; font-size: 1.1rem;">${title.replace(/"/g, '&quot;').replace(/'/g, '&#39;')}</strong>
                  </div>
                  <div style="padding: 1rem; border: 1px solid #dee2e6; border-radius: 4px; background-color: #f8f9fa;">
                    ${answer || '<p class="text-muted">Sin respuesta disponible.</p>'}
                  </div>
                `;
                
                // Volver a modo lectura
                displayDiv.style.display = 'block';
                if (editDiv) editDiv.style.display = 'none';
                if (editBtn) editBtn.style.display = 'inline-block';
              }
            }
          });
        });
        
        // Event listeners para eliminar FAQs
        document.querySelectorAll('.delete-faq-btn').forEach(btn => {
          btn.addEventListener('click', async function() {
            const id = this.getAttribute('data-id');
            if (confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
              await deleteFaqItem(id);
            }
          });
        });
        
        // Event listener para añadir nueva FAQ
        document.getElementById('add-faq-btn').addEventListener('click', async function() {
          await addNewFaqItem();
        });
        
        return;
      }
      
      // Para otras páginas, mostrar el editor directamente por defecto
      let html = '<div class="page-editor">';
      snapshot.forEach(doc => {
        const content = doc.data();
        pageContent[doc.id] = content;
        
        html += `
          <div class="card mb-4 editable-section" data-id="${doc.id}">
            <div class="card-header">
              <strong>${content.section}</strong>
            </div>
            <div class="card-body">
              <div class="content-edit" data-id="${doc.id}">
                <div id="quill-editor-${doc.id}" style="min-height: 200px;"></div>
                <div class="mt-3">
                  <button class="btn btn-sm btn-success save-content-btn" data-id="${doc.id}">
                    <i class="fas fa-save mr-1"></i> Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      });
      html += '</div>';
      editorContainer.innerHTML = html;

      // Inicializar todos los editores directamente
      snapshot.forEach(doc => {
        const content = doc.data();
        const editorId = `quill-editor-${doc.id}`;
        const editorContainer = document.getElementById(editorId);
        
        if (editorContainer) {
          // Inicializar Quill Editor
          quillEditors[doc.id] = new Quill(`#${editorId}`, {
            theme: 'snow',
            modules: {
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['clean']
              ]
            },
            placeholder: 'Edita el contenido aquí...'
          });
          
          // Cargar contenido
          const currentContent = content.contentEs || '';
          quillEditors[doc.id].root.innerHTML = currentContent;
        }
      });

      // Add event listeners
      document.querySelectorAll('.save-content-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.getAttribute('data-id');
          saveContent(id);
        });
      });

    } catch (error) {
      console.error('Error loading page content:', error);
      let errorMessage = 'Error al cargar el contenido.';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Error de permisos: Las reglas de Firestore no permiten leer la colección "pageContent". Verifica las reglas de seguridad.';
      } else if (error.code === 'failed-precondition' || error.message.includes('index')) {
        errorMessage = 'Error: Se requiere un índice compuesto en Firestore. El código intentará cargar sin ordenar, pero es recomendable crear el índice.';
      } else {
        errorMessage = `Error: ${error.message || error.code || 'Error desconocido'}`;
      }
      
      editorContainer.innerHTML = `
        <div class="alert alert-danger">
          <h5><i class="fas fa-exclamation-triangle mr-2"></i>Error al cargar el contenido</h5>
          <p>${errorMessage}</p>
          <hr>
          <p class="mb-0"><strong>Detalles técnicos:</strong></p>
          <pre style="font-size: 0.85rem; background: #f8f9fa; padding: 0.5rem; border-radius: 4px; margin-top: 0.5rem;">${JSON.stringify(error, null, 2)}</pre>
        </div>
      `;
    }
  };

  // Initialize page content with current HTML content
  async function initializePageContentWithCurrentContent() {
    const currentContent = {
      index: {
        main_title: 'Sercon Gestoría',
        subtitle: 'Más de 40 años a vuestro servicio',
        description: 'En Gestoría Sercon contamos con un grupo de profesionales que ponemos a su servicio para resolver sus gestiones administrativas. Nuestro objetivo es evitarle preocupaciones y ahorrarle tiempo y dolores de cabeza frente a La Administración.',
        contact_text: 'Si tiene alguna cuestión que quiera aclarar no dude en ponerse en contacto con nuestra gestoría. Le responderemos a la mayor brevedad posible.',
        why_choose_title: '¿Por Qué Elegirnos?',
        why_choose_subtitle: 'Somos su socio de confianza en gestión administrativa',
        feature_trust: '<p>Más de 40 años de experiencia garantizan la confianza y seguridad en todos nuestros servicios.</p>',
        feature_speed: '<p>Respuesta inmediata a sus consultas y gestión eficiente de todos sus trámites administrativos.</p>',
        feature_personalized: '<p>Cada cliente recibe un trato personalizado adaptado a sus necesidades específicas.</p>',
        feature_team: '<p>Contamos con más de 100 asesores expertos en todas las áreas de gestión administrativa.</p>',
        feature_confidentiality: '<p>Garantizamos la máxima confidencialidad y protección de todos sus datos personales.</p>',
        feature_prices: '<p>Ofrecemos servicios de alta calidad a precios competitivos y transparentes.</p>',
        testimonials_title: 'Lo Que Dicen Nuestros Clientes',
        testimonials_subtitle: 'Testimonios reales de clientes satisfechos',
        faq_title: 'Preguntas Frecuentes',
        faq_subtitle: 'Respuestas a las dudas más comunes'
      },
      about: {
        title: 'Sobre Nosotros',
        subtitle: 'Más de 40 años de experiencia a su servicio',
        welcome: '<p>Bienvenido a nuestra página. Somos una prestigiosa gestoría administrativa formada por un excelente equipo humano que abarca una amplia lista de servicios para hacer su relación con la Administración más sencilla.</p>',
        mission: '<p>Nuestra misión es garantizarle una prestación de calidad, rigor y profesionalidad en cada uno de los servicios que le ofrecemos, resolver sus dudas y ayudarle a mejorar su gestión, así como optimizar sus resultados.</p>',
        experience: '<p>Desde la experiencia, conocimientos y medios tecnológicos que poseemos, le ofrecemos una atención personalizada basada en el respeto y la confidencialidad de todos sus datos, de acuerdo con el secreto profesional.</p>',
        objective: '<p>Nuestro objetivo es ser una empresa valorada por los clientes, cuyas expectativas se cumplan, comprometida con sus obligaciones ante la Administración y siempre buscando las mejores ventajas legislativas.</p>',
        advice: '<p>Estaremos encantados de asesorarle de manera integral en todos los trámites que precise realizar.</p>',
        visit: 'Visítenos. Estamos en Orense, Calle Peña Trevinca, 35 Bajo - 32005',
        team_title: 'Conoce a Nuestro Equipo',
        team_subtitle: 'Profesionales comprometidos con su éxito'
      }
    };

    const defaultSections = {
      index: [
        { section: 'Título Principal', fieldKey: 'main_title', order: 1, type: 'text' },
        { section: 'Subtítulo', fieldKey: 'subtitle', order: 2, type: 'text' },
        { section: 'Descripción Principal', fieldKey: 'description', order: 3, type: 'html' },
        { section: 'Texto de Contacto', fieldKey: 'contact_text', order: 4, type: 'text' },
        { section: 'Título "¿Por Qué Elegirnos?"', fieldKey: 'why_choose_title', order: 5, type: 'text' },
        { section: 'Subtítulo "¿Por Qué Elegirnos?"', fieldKey: 'why_choose_subtitle', order: 6, type: 'text' },
        { section: 'Feature: Confianza y Seguridad', fieldKey: 'feature_trust', order: 7, type: 'html' },
        { section: 'Feature: Atención Rápida', fieldKey: 'feature_speed', order: 8, type: 'html' },
        { section: 'Feature: Atención Personalizada', fieldKey: 'feature_personalized', order: 9, type: 'html' },
        { section: 'Feature: Equipo Profesional', fieldKey: 'feature_team', order: 10, type: 'html' },
        { section: 'Feature: Confidencialidad', fieldKey: 'feature_confidentiality', order: 11, type: 'html' },
        { section: 'Feature: Precios Competitivos', fieldKey: 'feature_prices', order: 12, type: 'html' },
        { section: 'Título Testimonios', fieldKey: 'testimonials_title', order: 13, type: 'text' },
        { section: 'Subtítulo Testimonios', fieldKey: 'testimonials_subtitle', order: 14, type: 'text' },
        { section: 'Título FAQ', fieldKey: 'faq_title', order: 15, type: 'text' },
        { section: 'Subtítulo FAQ', fieldKey: 'faq_subtitle', order: 16, type: 'text' }
      ],
      about: [
        { section: 'Título', fieldKey: 'title', order: 1, type: 'text' },
        { section: 'Subtítulo', fieldKey: 'subtitle', order: 2, type: 'text' },
        { section: 'Mensaje de Bienvenida', fieldKey: 'welcome', order: 3, type: 'html' },
        { section: 'Misión', fieldKey: 'mission', order: 4, type: 'html' },
        { section: 'Experiencia', fieldKey: 'experience', order: 5, type: 'html' },
        { section: 'Objetivo', fieldKey: 'objective', order: 6, type: 'html' },
        { section: 'Consejo', fieldKey: 'advice', order: 7, type: 'html' },
        { section: 'Información de Visita', fieldKey: 'visit', order: 8, type: 'text' },
        { section: 'Título Equipo', fieldKey: 'team_title', order: 9, type: 'text' },
        { section: 'Subtítulo Equipo', fieldKey: 'team_subtitle', order: 10, type: 'text' }
      ]
    };

    const sections = defaultSections[currentPage] || [];
    
    for (const section of sections) {
      try {
        // Verificar si ya existe
        const existingQuery = await db.collection('pageContent')
          .where('page', '==', currentPage)
          .where('fieldKey', '==', section.fieldKey)
          .limit(1)
          .get();
        
        if (existingQuery.empty) {
          // Obtener contenido actual si existe
          const currentContentValue = currentContent[currentPage] && currentContent[currentPage][section.fieldKey] 
            ? currentContent[currentPage][section.fieldKey] 
            : '';
          
          await db.collection('pageContent').add({
            page: currentPage,
            section: section.section,
            fieldKey: section.fieldKey,
            contentEs: currentContentValue,
            order: section.order,
            type: section.type || 'html',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
      } catch (error) {
        console.error('Error creating section:', section.section, error);
      }
    }

    await loadPageContent();
  }

  // Enable edit mode with Quill Editor
  function enableEditMode(id) {
    const section = document.querySelector(`.editable-section[data-id="${id}"]`);
    if (!section) return;

    const content = pageContent[id];
    const displayDiv = section.querySelector('.content-display');
    const editDiv = section.querySelector('.content-edit');
    const editorContainer = section.querySelector(`#quill-editor-${id}`);

    if (!editorContainer) return;

    // Hide display, show edit
    displayDiv.style.display = 'none';
    editDiv.style.display = 'block';
    section.querySelector('.edit-section-btn').style.display = 'none';

    // Initialize Quill Editor if not already created
    if (!quillEditors[id]) {
      quillEditors[id] = new Quill(`#quill-editor-${id}`, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
          ]
        },
        placeholder: 'Escribe el contenido aquí...'
      });
    }

    // Set content
    const editor = quillEditors[id];
    const currentContent = content.contentEs || '';
    editor.root.innerHTML = currentContent;
  }

  // Cancel edit
  function cancelEdit(id) {
    const section = document.querySelector(`.editable-section[data-id="${id}"]`);
    if (!section) return;

    const displayDiv = section.querySelector('.content-display');
    const editDiv = section.querySelector('.content-edit');

    displayDiv.style.display = 'block';
    editDiv.style.display = 'none';
    section.querySelector('.edit-section-btn').style.display = 'block';
  }

  // Save content
  async function saveContent(id) {
    const editor = quillEditors[id];
    if (!editor) {
      alert('Error: Editor no encontrado');
      return;
    }

    const newContent = editor.root.innerHTML;
    const section = document.querySelector(`.editable-section[data-id="${id}"]`);
    if (!section) return;

    const saveBtn = section.querySelector('.save-content-btn');
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Guardando...';

    try {
      await db.collection('pageContent').doc(id).update({
        contentEs: newContent,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Update local cache
      pageContent[id].contentEs = newContent;

      // Show success message
      const cardBody = section.querySelector('.card-body');
      const existingAlert = cardBody.querySelector('.alert');
      if (existingAlert) {
        existingAlert.remove();
      }
      
      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert alert-success alert-dismissible fade show mt-2';
      alertDiv.innerHTML = `
        <strong>¡Éxito!</strong> Contenido guardado correctamente.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      `;
      cardBody.appendChild(alertDiv);
      
      setTimeout(() => {
        alertDiv.remove();
      }, 3000);

    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error al guardar el contenido. Por favor, inténtalo de nuevo.');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalText;
    }
  }

  // Save index main text - divide el contenido combinado en description y contact_text
  async function saveIndexMainText() {
    const editorId = 'quill-editor-index-main-text';
    const editor = quillEditors[editorId];
    
    if (!editor) {
      alert('Error: Editor no encontrado');
      return;
    }

    const combinedHTML = editor.root.innerHTML;
    
    if (!window.indexMainTextMap) {
      alert('Error: No se encontró el mapeo de contenido. Por favor, recarga la página.');
      return;
    }

    const saveBtn = document.getElementById('save-index-main-text-btn');
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Guardando...';

    try {
      // Crear un div temporal para parsear el HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = combinedHTML;
      
      // Buscar el separador HR (usado para dividir description y contact_text)
      const hrSeparator = tempDiv.querySelector('hr');
      let descriptionHTML = '';
      let contactTextHTML = '';
      
      if (hrSeparator) {
        // Si hay separador HR, dividir por él
        const beforeHR = document.createElement('div');
        const afterHR = document.createElement('div');
        
        let currentDiv = beforeHR;
        Array.from(tempDiv.childNodes).forEach(node => {
          if (node === hrSeparator) {
            currentDiv = afterHR;
          } else if (currentDiv === beforeHR) {
            beforeHR.appendChild(node.cloneNode(true));
          } else {
            afterHR.appendChild(node.cloneNode(true));
          }
        });
        
        descriptionHTML = beforeHR.innerHTML.trim();
        contactTextHTML = afterHR.innerHTML.trim();
      } else {
        // Si no hay separador, dividir por párrafos
        const paragraphs = Array.from(tempDiv.querySelectorAll('p'));
        if (paragraphs.length >= 2) {
          // Si hay 2 o más párrafos, el primero es description, el segundo es contact_text
          descriptionHTML = paragraphs[0].outerHTML;
          contactTextHTML = paragraphs[1].outerHTML;
        } else if (paragraphs.length === 1) {
          // Si solo hay un párrafo, es description
          descriptionHTML = paragraphs[0].outerHTML;
          contactTextHTML = '';
        } else {
          // Si no hay párrafos, usar todo como description
          descriptionHTML = combinedHTML;
          contactTextHTML = '';
        }
      }
      
      // Guardar description
      if (window.indexMainTextMap.description) {
        await db.collection('pageContent').doc(window.indexMainTextMap.description.id).update({
          contentEs: descriptionHTML,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
      
      // Guardar contact_text
      if (window.indexMainTextMap.contact_text) {
        await db.collection('pageContent').doc(window.indexMainTextMap.contact_text.id).update({
          contentEs: contactTextHTML,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
      
      // Mostrar mensaje de éxito
      const cardBody = document.querySelector('#quill-editor-index-main-text').closest('.card-body');
      const existingAlert = cardBody.querySelector('.alert');
      if (existingAlert) {
        existingAlert.remove();
      }
      
      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert alert-success alert-dismissible fade show mt-2';
      alertDiv.innerHTML = `
        <strong>¡Éxito!</strong> Textos principales guardados correctamente.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      `;
      cardBody.appendChild(alertDiv);
      
      setTimeout(() => {
        alertDiv.remove();
      }, 3000);

    } catch (error) {
      console.error('Error saving index main text:', error);
      alert('Error al guardar los textos principales. Por favor, inténtalo de nuevo.');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalText;
    }
  }

  // Save unified about content - guarda todo el contenido en un solo campo principal
  async function saveAboutUnifiedContent() {
    const editorId = 'quill-editor-about-unified';
    const editor = quillEditors[editorId];
    
    if (!editor) {
      alert('Error: Editor no encontrado');
      return;
    }

    const combinedHTML = editor.root.innerHTML;
    
    if (!window.aboutContentMap || !window.aboutContentOrder) {
      alert('Error: No se encontró el mapeo de contenido. Por favor, recarga la página.');
      return;
    }

    // Mostrar mensaje de guardando
    const saveBtn = document.getElementById('save-about-unified-btn');
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Guardando...';

    try {
      // Guardar todo el contenido en el campo principal (welcome o el primero disponible)
      const mainFieldKey = 'welcome'; // Usar el campo principal
      const mainContentData = window.aboutContentMap[mainFieldKey];
      
      let docId;
      if (!mainContentData) {
        // Si no existe welcome, usar el primer campo disponible
        const firstFieldKey = window.aboutContentOrder[0];
        if (!firstFieldKey) {
          throw new Error('No se encontraron campos para guardar.');
        }
        docId = window.aboutContentMap[firstFieldKey].id;
      } else {
        docId = mainContentData.id;
      }
      
      // Guardar el contenido completo en el campo principal
      await db.collection('pageContent').doc(docId).update({
        contentEs: combinedHTML,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert alert-success alert-dismissible fade show mt-3';
      alertDiv.innerHTML = `
        <strong>¡Éxito!</strong> Contenido guardado correctamente.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      `;
      
      const cardBody = document.querySelector('#quill-editor-about-unified').closest('.card-body');
      const existingAlert = cardBody.querySelector('.alert');
      if (existingAlert) {
        existingAlert.remove();
      }
      cardBody.appendChild(alertDiv);
      
      setTimeout(() => {
        alertDiv.remove();
      }, 5000);

      // Recargar el contenido para reflejar los cambios
      setTimeout(() => {
        loadPageContent();
      }, 1000);

    } catch (error) {
      console.error('Error saving unified content:', error);
      alert('Error al guardar el contenido. Por favor, inténtalo de nuevo.');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalText;
    }
  }

  // Save FAQ item - guarda título y contenido de una FAQ
  async function saveFaqItem(id) {
    const titleInput = document.querySelector(`.faq-title-input[data-id="${id}"]`);
    const editor = quillEditors[`faq-${id}`];
    
    if (!titleInput || !editor) {
      alert('Error: No se encontró el editor o el título.');
      return;
    }

    const title = titleInput.value.trim();
    const answer = editor.root.innerHTML;
    
    if (!title) {
      alert('Por favor, escribe un título para la pregunta.');
      return;
    }

    const saveBtn = document.querySelector(`.save-faq-btn[data-id="${id}"]`);
    const originalText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Guardando...';

    try {
      // Combinar título y respuesta en HTML
      const combinedHTML = `<h5>${title}</h5>${answer}`;
      
      await db.collection('pageContent').doc(id).update({
        contentEs: combinedHTML,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Mostrar mensaje de éxito
      const faqItem = document.querySelector(`.faq-item[data-faq-id="${id}"]`);
      const cardBody = faqItem.querySelector('.card-body');
      const existingAlert = cardBody.querySelector('.alert');
      if (existingAlert) {
        existingAlert.remove();
      }
      
      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert alert-success alert-dismissible fade show mt-2';
      alertDiv.innerHTML = `
        <strong>¡Éxito!</strong> Pregunta guardada correctamente.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      `;
      cardBody.appendChild(alertDiv);
      
      setTimeout(() => {
        alertDiv.remove();
      }, 3000);

    } catch (error) {
      console.error('Error saving FAQ item:', error);
      alert('Error al guardar la pregunta. Por favor, inténtalo de nuevo.');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalText;
    }
  }

  // Delete FAQ item - elimina una FAQ
  async function deleteFaqItem(id) {
    try {
      await db.collection('pageContent').doc(id).delete();
      
      // Remover el elemento del DOM
      const faqItem = document.querySelector(`.faq-item[data-faq-id="${id}"]`);
      if (faqItem) {
        faqItem.remove();
      }
      
      // Limpiar el editor de la memoria
      if (quillEditors[`faq-${id}`]) {
        delete quillEditors[`faq-${id}`];
      }
      
      // Mostrar mensaje de éxito
      const container = document.getElementById('faq-items-container');
      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert alert-success alert-dismissible fade show mt-2';
      alertDiv.innerHTML = `
        <strong>¡Éxito!</strong> Pregunta eliminada correctamente.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      `;
      container.insertBefore(alertDiv, container.firstChild);
      
      setTimeout(() => {
        alertDiv.remove();
      }, 3000);

    } catch (error) {
      console.error('Error deleting FAQ item:', error);
      alert('Error al eliminar la pregunta. Por favor, inténtalo de nuevo.');
    }
  }

  // Add new FAQ item - añade una nueva FAQ
  async function addNewFaqItem() {
    try {
      // Obtener el siguiente número de orden
      const existingFaqs = window.indexFaqItems || [];
      const maxOrder = existingFaqs.length > 0 
        ? Math.max(...existingFaqs.map(faq => faq.content.order || 0))
        : 0;
      const nextOrder = maxOrder + 1;
      const nextFieldKey = `faq_item_${nextOrder}`;
      
      // Crear nueva FAQ en Firebase
      await db.collection('pageContent').add({
        page: 'index',
        section: `Pregunta ${nextOrder}`,
        fieldKey: nextFieldKey,
        contentEs: '<h5>Nueva Pregunta</h5><p>Escribe la respuesta aquí...</p>',
        order: nextOrder,
        type: 'html',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // Mostrar mensaje de éxito
      const container = document.getElementById('faq-items-container');
      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert alert-success alert-dismissible fade show mt-2';
      alertDiv.innerHTML = `
        <strong>¡Éxito!</strong> Nueva pregunta añadida. Recargando...
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      `;
      container.insertBefore(alertDiv, container.firstChild);
      
      // Recargar el contenido para mostrar la nueva FAQ
      setTimeout(async () => {
        await loadPageContent();
      }, 500);
      
    } catch (error) {
      console.error('Error adding FAQ item:', error);
      alert('Error al añadir la pregunta. Por favor, inténtalo de nuevo.');
    }
  }
})();

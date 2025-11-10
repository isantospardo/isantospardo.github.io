// Script para importar blogs directamente desde las páginas HTML a Firebase
// Este script extrae el contenido hardcodeado de las páginas y lo importa a Firebase

const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

// Cargar configuración de Firebase
let firebaseConfig;
try {
  const configPath = path.join(__dirname, 'firebase-config.local.js');
  if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, 'utf8');
    const match = configContent.match(/window\.FIREBASE_CONFIG\s*=\s*({[\s\S]*?});/);
    if (match) {
      firebaseConfig = eval('(' + match[1] + ')');
    }
  }
} catch (error) {
  console.error('Error al cargar configuración:', error);
  process.exit(1);
}

if (!firebaseConfig) {
  console.error('No se pudo cargar la configuración de Firebase.');
  process.exit(1);
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Función para convertir HTML a Quill Delta
function htmlToQuillDelta(html) {
  if (!html || html.trim() === '') {
    return { ops: [{ insert: '\n' }] };
  }

  const { JSDOM } = require('jsdom');
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const ops = [];
  
  function processNode(node) {
    if (node.nodeType === 3) { // Text node
      const text = node.textContent;
      if (text.trim()) {
        ops.push({ insert: text });
      }
    } else if (node.nodeType === 1) { // Element node
      const tagName = node.tagName.toLowerCase();
      
      if (tagName === 'p') {
        if (ops.length > 0 && ops[ops.length - 1].insert !== '\n') {
          ops.push({ insert: '\n' });
        }
        Array.from(node.childNodes).forEach(processNode);
        ops.push({ insert: '\n' });
      } else if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'h4') {
        if (ops.length > 0 && ops[ops.length - 1].insert !== '\n') {
          ops.push({ insert: '\n' });
        }
        const level = parseInt(tagName.charAt(1));
        Array.from(node.childNodes).forEach(processNode);
        ops.push({ insert: '\n', attributes: { header: level } });
      } else if (tagName === 'strong' || tagName === 'b') {
        const text = node.textContent;
        if (text) {
          ops.push({ insert: text, attributes: { bold: true } });
        }
      } else if (tagName === 'em' || tagName === 'i') {
        const text = node.textContent;
        if (text) {
          ops.push({ insert: text, attributes: { italic: true } });
        }
      } else if (tagName === 'ul' || tagName === 'ol') {
        Array.from(node.querySelectorAll('li')).forEach((li, index) => {
          if (ops.length > 0 && ops[ops.length - 1].insert !== '\n') {
            ops.push({ insert: '\n' });
          }
          Array.from(li.childNodes).forEach(processNode);
          ops.push({ insert: '\n', attributes: { list: tagName === 'ul' ? 'bullet' : 'ordered' } });
        });
      } else if (tagName === 'blockquote') {
        if (ops.length > 0 && ops[ops.length - 1].insert !== '\n') {
          ops.push({ insert: '\n' });
        }
        Array.from(node.childNodes).forEach(processNode);
        ops.push({ insert: '\n', attributes: { blockquote: true } });
      } else {
        Array.from(node.childNodes).forEach(processNode);
      }
    }
  }
  
  const body = document.body || document;
  Array.from(body.childNodes).forEach(processNode);
  
  // Limpiar y normalizar
  const cleanedOps = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    if (op.insert && op.insert !== '\n') {
      cleanedOps.push(op);
    } else if (op.insert === '\n') {
      if (cleanedOps.length === 0 || cleanedOps[cleanedOps.length - 1].insert !== '\n') {
        cleanedOps.push(op);
      }
    }
  }
  
  if (cleanedOps.length === 0 || cleanedOps[cleanedOps.length - 1].insert !== '\n') {
    cleanedOps.push({ insert: '\n' });
  }
  
  return { ops: cleanedOps };
}

// Extraer blogs de una página HTML
function extractBlogsFromPage(htmlContent, category) {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  
  const blogs = [];
  const cards = document.querySelectorAll('.elegant-card');
  
  cards.forEach((card, index) => {
    const titleEl = card.querySelector('.accordion-title');
    const subtitleEl = card.querySelector('.accordion-subtitle');
    const metaEl = card.querySelector('.accordion-meta');
    const bodyEl = card.querySelector('.elegant-card-body');
    
    if (!titleEl || !bodyEl) return;
    
    const title = titleEl.textContent.trim();
    const subtitle = subtitleEl ? subtitleEl.textContent.trim() : '';
    
    // Extraer fecha
    let date = null;
    if (metaEl) {
      const metaText = metaEl.textContent;
      const dateMatch = metaText.match(/el\s+(\d+)\s+de\s+(\w+),\s+(\d+)/i);
      if (dateMatch) {
        const day = parseInt(dateMatch[1]);
        const monthName = dateMatch[2].toLowerCase();
        const year = parseInt(dateMatch[3]);
        
        const months = {
          'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
          'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
        };
        
        if (months[monthName] !== undefined) {
          date = new Date(year, months[monthName], day);
        }
      }
    }
    
    // Extraer contenido
    const contentHtml = bodyEl.innerHTML;
    
    blogs.push({
      title,
      subtitle,
      content: contentHtml,
      date,
      category
    });
  });
  
  return blogs;
}

// Importar blogs
async function importBlogs() {
  try {
    console.log('🔐 Iniciando sesión en Firebase...');
    
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const email = await new Promise(resolve => {
      readline.question('Email de administrador: ', resolve);
    });
    
    const password = await new Promise(resolve => {
      readline.question('Contraseña: ', resolve);
    });
    
    readline.close();
    
    await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Autenticado correctamente\n');
    
    const pages = [
      { file: path.join(__dirname, '..', 'fiscal.html'), category: 'fiscal' },
      { file: path.join(__dirname, '..', 'laboral.html'), category: 'laboral' },
      { file: path.join(__dirname, '..', 'legal.html'), category: 'legal' },
      { file: path.join(__dirname, '..', 'sucesiones.html'), category: 'sucesiones' }
    ];
    
    let totalImported = 0;
    let totalErrors = 0;
    
    for (const page of pages) {
      if (!fs.existsSync(page.file)) {
        console.log(`⚠️  Archivo no encontrado: ${page.file}`);
        continue;
      }
      
      console.log(`📄 Procesando: ${path.basename(page.file)} (${page.category})`);
      const htmlContent = fs.readFileSync(page.file, 'utf8');
      const blogs = extractBlogsFromPage(htmlContent, page.category);
      
      console.log(`   Encontrados ${blogs.length} blog(s)`);
      
      for (const blog of blogs) {
        try {
          console.log(`   📝 Importando: ${blog.title}`);
          
          const contentDelta = htmlToQuillDelta(blog.content);
          
          const blogData = {
            titleEs: blog.title,
            contentEs: contentDelta,
            category: blog.category,
            status: 'published',
            createdAt: blog.date || serverTimestamp(),
            updatedAt: serverTimestamp(),
            authorId: auth.currentUser.uid,
            imported: true,
            source: 'html-page'
          };
          
          await addDoc(collection(db, 'blogs'), blogData);
          console.log(`   ✅ Importado exitosamente`);
          totalImported++;
          
        } catch (error) {
          console.error(`   ❌ Error: ${error.message}`);
          totalErrors++;
        }
      }
      
      console.log('');
    }
    
    console.log(`\n✅ Importación completada!`);
    console.log(`   ✅ Importados: ${totalImported}`);
    console.log(`   ❌ Errores: ${totalErrors}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error durante la importación:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  importBlogs();
}

module.exports = { importBlogs, extractBlogsFromPage, htmlToQuillDelta };





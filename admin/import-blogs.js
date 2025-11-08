// Script para importar blogs existentes desde archivos HTML a Firebase
// Ejecutar con: node import-blogs.js

const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

// Cargar configuración de Firebase
let firebaseConfig;
try {
  // Intentar cargar desde firebase-config.local.js
  const configPath = path.join(__dirname, 'firebase-config.local.js');
  if (fs.existsSync(configPath)) {
    // Leer y evaluar el archivo de configuración
    const configContent = fs.readFileSync(configPath, 'utf8');
    // Extraer la configuración (asumiendo formato window.FIREBASE_CONFIG = {...})
    const match = configContent.match(/window\.FIREBASE_CONFIG\s*=\s*({[\s\S]*?});/);
    if (match) {
      firebaseConfig = eval('(' + match[1] + ')');
    }
  }
} catch (error) {
  console.error('Error al cargar configuración de Firebase:', error);
  console.log('Por favor, asegúrate de que firebase-config.local.js existe y tiene la configuración correcta.');
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

// Función para convertir HTML a formato Quill Delta simple
function htmlToQuillDelta(html) {
  if (!html || html.trim() === '') {
    return { ops: [{ insert: '\n' }] };
  }

  // Crear un documento temporal para parsear HTML
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
      } else if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
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
        // Para otros elementos, procesar sus hijos
        Array.from(node.childNodes).forEach(processNode);
      }
    }
  }
  
  // Procesar el contenido
  const body = document.body || document;
  Array.from(body.childNodes).forEach(processNode);
  
  // Limpiar y normalizar
  const cleanedOps = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    if (op.insert && op.insert !== '\n') {
      cleanedOps.push(op);
    } else if (op.insert === '\n') {
      // Evitar múltiples saltos de línea consecutivos
      if (cleanedOps.length === 0 || cleanedOps[cleanedOps.length - 1].insert !== '\n') {
        cleanedOps.push(op);
      }
    }
  }
  
  // Asegurar que termine con un salto de línea
  if (cleanedOps.length === 0 || cleanedOps[cleanedOps.length - 1].insert !== '\n') {
    cleanedOps.push({ insert: '\n' });
  }
  
  return { ops: cleanedOps };
}

// Función para extraer información de un archivo HTML de blog
function extractBlogInfo(htmlContent, filePath) {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  
  // Extraer título (h1 dentro de .post-heading)
  const postHeading = document.querySelector('.post-heading');
  let title = 'Sin título';
  let subtitle = '';
  
  if (postHeading) {
    const h1 = postHeading.querySelector('h1');
    if (h1) {
      // Remover el logo si existe
      const logo = h1.querySelector('img');
      if (logo) logo.remove();
      title = h1.textContent.trim() || 'Sin título';
    }
    
    const h2 = postHeading.querySelector('h2.subheading');
    if (h2) {
      subtitle = h2.textContent.trim();
    }
  }
  
  // Extraer fecha del meta
  let date = null;
  const meta = document.querySelector('.meta');
  if (meta) {
    const metaText = meta.textContent;
    // Intentar extraer fecha (formato: "el 25 de abril, 2020")
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
  
  // Extraer contenido del artículo
  const article = document.querySelector('article .col-lg-8, article .col-md-10');
  let content = '';
  if (article) {
    // Clonar para no modificar el original
    const clone = article.cloneNode(true);
    // Remover el último párrafo si es "Placeholder text by..."
    const lastP = clone.querySelector('p:last-child');
    if (lastP && lastP.textContent.includes('Placeholder text')) {
      lastP.remove();
    }
    content = clone.innerHTML;
  }
  
  // Determinar categoría basándose en la ruta del archivo
  let category = 'general';
  if (filePath.includes('post-fiscal')) {
    category = 'fiscal';
  } else if (filePath.includes('post-laboral')) {
    category = 'laboral';
  } else if (filePath.includes('post-legal')) {
    category = 'legal';
  } else if (filePath.includes('post-sucesiones')) {
    category = 'sucesiones';
  }
  
  return {
    title,
    subtitle,
    content,
    date,
    category
  };
}

// Función principal de importación
async function importBlogs() {
  try {
    console.log('🔐 Iniciando sesión en Firebase...');
    
    // Solicitar credenciales
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
    
    // Autenticarse
    await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Autenticado correctamente');
    
    // Directorio de posts
    const postsDir = path.join(__dirname, '..', 'posts');
    
    if (!fs.existsSync(postsDir)) {
      console.error('❌ No se encontró el directorio de posts:', postsDir);
      process.exit(1);
    }
    
    console.log('📂 Buscando blogs en:', postsDir);
    
    // Leer todas las carpetas de posts
    const categories = ['post-fiscal', 'post-laboral', 'post-legal', 'post-sucesiones'];
    let totalImported = 0;
    let totalErrors = 0;
    
    for (const categoryFolder of categories) {
      const categoryPath = path.join(postsDir, categoryFolder);
      
      if (!fs.existsSync(categoryPath)) {
        console.log(`⚠️  Carpeta no encontrada: ${categoryFolder}`);
        continue;
      }
      
      const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.html'));
      console.log(`\n📁 Procesando ${files.length} archivo(s) en ${categoryFolder}...`);
      
      for (const file of files) {
        const filePath = path.join(categoryPath, file);
        console.log(`\n  📄 Procesando: ${file}`);
        
        try {
          const htmlContent = fs.readFileSync(filePath, 'utf8');
          const blogInfo = extractBlogInfo(htmlContent, filePath);
          
          console.log(`    Título: ${blogInfo.title}`);
          console.log(`    Categoría: ${blogInfo.category}`);
          
          // Convertir HTML a Quill Delta
          const contentDelta = htmlToQuillDelta(blogInfo.content);
          
          // Crear documento en Firestore
          const blogData = {
            titleEs: blogInfo.title,
            contentEs: contentDelta,
            category: blogInfo.category,
            status: 'published', // Importar como publicados
            createdAt: blogInfo.date ? new Date(blogInfo.date) : serverTimestamp(),
            updatedAt: serverTimestamp(),
            authorId: auth.currentUser.uid,
            imported: true,
            originalFile: file
          };
          
          await addDoc(collection(db, 'blogs'), blogData);
          console.log(`    ✅ Importado exitosamente`);
          totalImported++;
          
        } catch (error) {
          console.error(`    ❌ Error al importar ${file}:`, error.message);
          totalErrors++;
        }
      }
    }
    
    console.log(`\n\n✅ Importación completada!`);
    console.log(`   ✅ Importados: ${totalImported}`);
    console.log(`   ❌ Errores: ${totalErrors}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error durante la importación:', error);
    process.exit(1);
  }
}

// Ejecutar importación
if (require.main === module) {
  importBlogs();
}

module.exports = { importBlogs, extractBlogInfo, htmlToQuillDelta };




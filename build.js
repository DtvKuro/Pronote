'use strict';

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const hljs = require('highlight.js');

marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    code({ text, lang }) {
      const language = lang && hljs.getLanguage(lang) ? lang : null;
      const highlighted = language
        ? hljs.highlight(text, { language }).value
        : hljs.highlightAuto(text).value;
      const langClass = language ? ` class="hljs language-${language}"` : ' class="hljs"';
      return `<pre><code${langClass}>${highlighted}</code></pre>\n`;
    },
  },
});

function rmrf(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  mkdirp(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function slugify(filename) {
  return path.basename(filename, '.md');
}

const MENU_BTN =
  '<button class="notes-menu-toggle" aria-label="Browse notes" aria-expanded="false">' +
  '<span></span><span></span><span></span>' +
  '</button>';

function applyLayout(layout, { pageTitle, basePath, content, notesMenuToggle = '' }) {
  return layout
    .replace(/\{\{PAGE_TITLE\}\}/g, pageTitle)
    .replace(/\{\{BASE_PATH\}\}/g, basePath)
    .replace(/\{\{NOTES_MENU_TOGGLE\}\}/g, notesMenuToggle)
    .replace(/\{\{CONTENT\}\}/g, content);
}

const LOGOS = {
  'HTML': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <polygon points="4,2 36,2 33,35 20,39 7,35" fill="#e44d26"/>
    <polygon points="20,4 20,37 30,34 32.5,4" fill="#f16529"/>
    <polygon points="11,10 12,22 20,24.5 20,10" fill="#ebebeb"/>
    <polygon points="29,10 20,10 20,24.5 28,22" fill="#fff"/>
    <polygon points="12.5,12 13,18 20,18 20,12" fill="#e44d26"/>
    <polygon points="27.5,12 20,12 20,18 27,18" fill="#c0392b"/>
    <polygon points="13,20 13.5,27 20,29 20,23" fill="#ebebeb"/>
    <polygon points="27,20 20,23 20,29 26.5,27" fill="#fff"/>
  </svg>`,

  'CSS': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <polygon points="4,2 36,2 33,35 20,39 7,35" fill="#264de4"/>
    <polygon points="20,4 20,37 30,34 32.5,4" fill="#2965f1"/>
    <path d="M27,11 H13 l1,5 h7 v3 H14 l1,5 h5 l0.3,3 L20,28.5 l-0.3,0 L19.4,27 H15 l0.8,6 L20,34.5 L24.2,33 L25,27 H21 v-3 h4.5 z" fill="#ebebeb"/>
    <path d="M20,11 v5 h6 l-0.5,3 H20 v5 h4.5 l-0.8,6 L20,31 v3.5 L24.2,33 L25,27 H21 v-3 h4.5 L26.5,16 H20 z" fill="#fff"/>
  </svg>`,

  'JavaScript': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <rect width="40" height="40" fill="#f7df1e"/>
    <path d="M11,31 l2.2,-1.4 c0.4,0.9 0.8,1.6 1.8,1.6 c0.9,0 1.4,-0.4 1.4,-1.9 V17 h3 v12.5 c0,3.1 -1.8,4.5 -4.4,4.5 C13,34 11.7,32.8 11,31 z" fill="#323330"/>
    <path d="M22,30.6 l2.2,-1.3 c0.6,1 1.3,1.7 2.7,1.7 c1.1,0 1.8,-0.6 1.8,-1.4 c0,-0.9 -0.7,-1.3 -2,-1.9 l-0.7,-0.3 c-2,-0.85 -3.3,-1.9 -3.3,-4.2 c0,-2.1 1.6,-3.7 4,-3.7 c1.8,0 3,0.6 3.9,2.2 l-2.1,1.4 c-0.5,-0.8 -1,-1.1 -1.8,-1.1 c-0.8,0 -1.4,0.5 -1.4,1.1 c0,0.8 0.5,1.1 1.7,1.7 l0.7,0.3 c2.4,1 3.7,2.1 3.7,4.5 c0,2.5 -2,3.9 -4.7,3.9 C24.4,34 22.9,32.7 22,30.6 z" fill="#323330"/>
  </svg>`,

  'DOM': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <circle cx="20" cy="7" r="5" fill="#6366f1"/>
    <circle cx="8" cy="26" r="5" fill="#8b5cf6"/>
    <circle cx="20" cy="26" r="5" fill="#8b5cf6"/>
    <circle cx="32" cy="26" r="5" fill="#8b5cf6"/>
    <line x1="20" y1="12" x2="8" y2="21" stroke="#a78bfa" stroke-width="2"/>
    <line x1="20" y1="12" x2="20" y2="21" stroke="#a78bfa" stroke-width="2"/>
    <line x1="20" y1="12" x2="32" y2="21" stroke="#a78bfa" stroke-width="2"/>
    <circle cx="20" cy="7" r="2.5" fill="#fff" opacity="0.4"/>
  </svg>`,

  'Web Design': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <rect x="2" y="5" width="36" height="30" rx="3" fill="#0284c7"/>
    <rect x="2" y="5" width="36" height="8" rx="3" fill="#0369a1"/>
    <rect x="5" y="7" width="4" height="4" rx="2" fill="#f87171"/>
    <rect x="11" y="7" width="4" height="4" rx="2" fill="#fbbf24"/>
    <rect x="17" y="7" width="4" height="4" rx="2" fill="#4ade80"/>
    <rect x="5" y="17" width="12" height="14" rx="2" fill="#e0f2fe"/>
    <rect x="19" y="17" width="15" height="6" rx="2" fill="#bae6fd"/>
    <rect x="19" y="25" width="15" height="6" rx="2" fill="#bae6fd"/>
  </svg>`,

  'Node.js': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <polygon points="20,2 35,11 35,29 20,38 5,29 5,11" fill="#3c873a"/>
    <polygon points="20,2 35,11 35,29 20,38 5,29 5,11" fill="none" stroke="#4caf50" stroke-width="1.5"/>
    <path d="M17,13 h7 l-4,7 h4 l-8,8 l2,-7 h-4 z" fill="#fff" opacity="0.9"/>
  </svg>`,

  'Express': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <rect width="40" height="40" rx="6" fill="#1a1a1a"/>
    <rect x="6" y="13" width="18" height="2.5" rx="1.25" fill="#ffffff"/>
    <rect x="6" y="19" width="13" height="2.5" rx="1.25" fill="#888888"/>
    <rect x="6" y="25" width="16" height="2.5" rx="1.25" fill="#555555"/>
    <circle cx="30" cy="14.25" r="3.5" fill="#ffffff"/>
    <circle cx="25" cy="20.25" r="3.5" fill="#888888"/>
    <circle cx="28" cy="26.25" r="3.5" fill="#555555"/>
  </svg>`,

  'EJS': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <path d="M6,3 H25 L34,12 V37 H6 z" rx="2" fill="#e2e8f0"/>
    <path d="M25,3 L34,12 H25 z" fill="#94a3b8"/>
    <rect x="10" y="17" width="14" height="2" rx="1" fill="#94a3b8"/>
    <rect x="10" y="21" width="10" height="2" rx="1" fill="#94a3b8"/>
    <rect x="10" y="25" width="12" height="2" rx="1" fill="#94a3b8"/>
    <rect x="18" y="26" width="18" height="12" rx="3" fill="#10b981"/>
    <path d="M22,29.5 l-2.5,2.5 l2.5,2.5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M30,29.5 l2.5,2.5 l-2.5,2.5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <line x1="27.5" y1="29" x2="24.5" y2="35" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,

  'API': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <circle cx="20" cy="20" r="16" fill="#0c4a6e" stroke="#0ea5e9" stroke-width="2"/>
    <ellipse cx="20" cy="20" rx="6" ry="16" fill="none" stroke="#0ea5e9" stroke-width="1.5"/>
    <line x1="4" y1="20" x2="36" y2="20" stroke="#0ea5e9" stroke-width="1.5"/>
    <path d="M6,13 Q20,9 34,13" fill="none" stroke="#0ea5e9" stroke-width="1.2"/>
    <path d="M6,27 Q20,31 34,27" fill="none" stroke="#0ea5e9" stroke-width="1.2"/>
  </svg>`,

  'Backend': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <rect x="4" y="4" width="32" height="9" rx="2.5" fill="#475569"/>
    <rect x="4" y="15" width="32" height="9" rx="2.5" fill="#334155"/>
    <rect x="4" y="26" width="32" height="9" rx="2.5" fill="#1e293b"/>
    <rect x="8" y="7" width="10" height="3" rx="1" fill="#64748b"/>
    <circle cx="30" cy="8.5" r="2" fill="#22c55e"/>
    <circle cx="25" cy="8.5" r="2" fill="#fbbf24"/>
    <rect x="8" y="18" width="10" height="3" rx="1" fill="#475569"/>
    <circle cx="30" cy="19.5" r="2" fill="#22c55e"/>
    <circle cx="25" cy="19.5" r="2" fill="#22c55e"/>
    <rect x="8" y="29" width="10" height="3" rx="1" fill="#334155"/>
    <circle cx="30" cy="30.5" r="2" fill="#ef4444"/>
    <circle cx="25" cy="30.5" r="2" fill="#fbbf24"/>
  </svg>`,

  'Git & Bash': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <rect width="40" height="40" rx="6" fill="#f05133"/>
    <circle cx="13" cy="10" r="4" fill="#fff"/>
    <circle cx="13" cy="30" r="4" fill="#fff"/>
    <circle cx="29" cy="18" r="4" fill="#fff"/>
    <line x1="13" y1="14" x2="13" y2="26" stroke="#fff" stroke-width="2.5"/>
    <path d="M13,14 Q13,18 29,18" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  'GitHub': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <rect width="40" height="40" rx="6" fill="#24292e"/>
    <path d="M20,5 C11.7,5 5,11.7 5,20 c0,6.6 4.3,12.2 10.2,14.2 c0.75,0.14 1.02,-0.32 1.02,-0.72 l-0.01,-2.52 c-4.17,0.91 -5.05,-2.01 -5.05,-2.01 c-0.68,-1.73 -1.67,-2.19 -1.67,-2.19 c-1.36,-0.93 0.1,-0.91 0.1,-0.91 c1.5,0.1 2.3,1.54 2.3,1.54 c1.33,2.28 3.5,1.62 4.35,1.24 c0.14,-0.97 0.52,-1.62 0.95,-2 C14.05,26.4 10.22,25 10.22,18.68 c0,-1.63 0.58,-2.96 1.54,-4 c-0.15,-0.38 -0.67,-1.89 0.15,-3.95 c0,0 1.26,-0.4 4.12,1.53 c1.2,-0.33 2.48,-0.5 3.77,-0.5 c1.28,0 2.57,0.17 3.77,0.5 c2.86,-1.93 4.12,-1.53 4.12,-1.53 c0.82,2.06 0.3,3.57 0.15,3.95 c0.96,1.04 1.54,2.37 1.54,4 c0,5.33 -3.84,6.5 -7.5,6.85 c0.59,0.51 1.11,1.5 1.11,3.03 l-0.02,4.5 c0,0.4 0.27,0.87 1.03,0.72 C30.7,32.2 35,26.6 35,20 C35,11.7 28.3,5 20,5 z" fill="#fff"/>
  </svg>`,

  'Bash Shortcuts': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <rect width="40" height="40" rx="6" fill="#1e1e1e"/>
    <rect x="4" y="5" width="32" height="20" rx="3" fill="#2d2d2d"/>
    <circle cx="8" cy="9" r="1.5" fill="#f87171"/>
    <circle cx="13" cy="9" r="1.5" fill="#fbbf24"/>
    <circle cx="18" cy="9" r="1.5" fill="#4ade80"/>
    <path d="M7,16 l3.5,3 l-3.5,3" stroke="#22c55e" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <rect x="14" y="18.5" width="8" height="2" rx="1" fill="#4a5568"/>
    <rect x="4" y="29" width="8" height="7" rx="2" fill="#374151"/>
    <rect x="14" y="29" width="12" height="7" rx="2" fill="#374151"/>
    <rect x="28" y="29" width="8" height="7" rx="2" fill="#374151"/>
    <rect x="6" y="31.5" width="4" height="2" rx="1" fill="#6b7280"/>
    <rect x="16" y="31.5" width="8" height="2" rx="1" fill="#6b7280"/>
    <rect x="30" y="31.5" width="4" height="2" rx="1" fill="#6b7280"/>
  </svg>`,
};

const PROJECT_ROOT = __dirname;
const DIST_DIR = path.join(PROJECT_ROOT, 'docs');
const DIST_NOTES_DIR = path.join(DIST_DIR, 'notes');

rmrf(DIST_DIR);
mkdirp(DIST_DIR);
mkdirp(DIST_NOTES_DIR);

const config = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'notes.config.json'), 'utf8'));
const { notes, site } = config;

notes.sort((a, b) => a.order - b.order);

const layoutTpl = fs.readFileSync(path.join(PROJECT_ROOT, 'templates', 'layout.html'), 'utf8');
const homeTpl = fs.readFileSync(path.join(PROJECT_ROOT, 'templates', 'home.html'), 'utf8');
const noteTpl = fs.readFileSync(path.join(PROJECT_ROOT, 'templates', 'note.html'), 'utf8');

const builtNotes = [];

for (let i = 0; i < notes.length; i++) {
  const note = notes[i];
  const mdPath = path.join(site.sourceDir, note.file);

  if (!fs.existsSync(mdPath)) {
    console.warn(`  WARN: missing source file ${mdPath} — skipping`);
    continue;
  }

  const mdSource = fs.readFileSync(mdPath, 'utf8');
  let noteHtml = marked(mdSource);

  noteHtml = noteHtml.replace(/Images\//g, '../images/');

  const slug = slugify(note.file);
  const prev = notes[i - 1] || null;
  const next = notes[i + 1] || null;

  const prevLink = prev
    ? `<a href="${slugify(prev.file)}.html" class="note-nav-prev">← ${prev.title}</a>`
    : '';
  const nextLink = next
    ? `<a href="${slugify(next.file)}.html" class="note-nav-next">${next.title} →</a>`
    : '';

  const menuCategoryMap = new Map();
  for (const n of notes) {
    if (!menuCategoryMap.has(n.category)) {
      menuCategoryMap.set(n.category, []);
    }
    menuCategoryMap.get(n.category).push(n);
  }

  let notesMenuHtml = '';
  for (const [cat, catNotes] of menuCategoryMap) {
    const items = catNotes
      .map((n) => {
        const nSlug = slugify(n.file);
        const activeClass = nSlug === slug ? ' active' : '';
        return `<li><a href="${nSlug}.html" class="notes-menu-link${activeClass}">${n.title}</a></li>`;
      })
      .join('\n        ');
    notesMenuHtml += `<div class="notes-menu-category">
  <h4 class="notes-menu-category-title">${cat}</h4>
  <ul class="notes-menu-list">
        ${items}
  </ul>
</div>\n`;
  }

  const noteBody = noteTpl
    .replace(/\{\{CATEGORY\}\}/g, note.category)
    .replace(/\{\{TITLE\}\}/g, note.title)
    .replace(/\{\{NOTE_CONTENT\}\}/g, noteHtml)
    .replace(/\{\{PREV_LINK\}\}/g, prevLink)
    .replace(/\{\{NEXT_LINK\}\}/g, nextLink)
    .replace(/\{\{NOTES_MENU\}\}/g, notesMenuHtml);

  const fullPage = applyLayout(layoutTpl, {
    pageTitle: note.title,
    basePath: '../',
    content: noteBody,
    notesMenuToggle: MENU_BTN,
  });

  const outPath = path.join(DIST_NOTES_DIR, `${slug}.html`);
  fs.writeFileSync(outPath, fullPage, 'utf8');

  builtNotes.push({ ...note, slug });
}

const categoryMap = new Map();
for (const note of builtNotes) {
  if (!categoryMap.has(note.category)) {
    categoryMap.set(note.category, []);
  }
  categoryMap.get(note.category).push(note);
}

let categoriesHtml = '';
for (const [category, categoryNotes] of categoryMap) {
  const cards = categoryNotes
    .map((n) => {
      const svgIcon = LOGOS[n.title] || '';
      return `<a href="notes/${n.slug}.html" class="card" data-title="${n.title}"><div class="card-logo">${svgIcon}</div><h3>${n.title}</h3><span class="card-category">${n.category}</span></a>`;
    })
    .join('\n        ');

  categoriesHtml += `
<section class="category-section">
  <h2 class="category-heading">${category}</h2>
  <div class="card-grid">
        ${cards}
  </div>
</section>`;
}

const homeBody = homeTpl.replace(/\{\{CATEGORIES\}\}/g, categoriesHtml);

const homePage = applyLayout(layoutTpl, {
  pageTitle: site.title,
  basePath: './',
  content: homeBody,
});

fs.writeFileSync(path.join(DIST_DIR, 'index.html'), homePage, 'utf8');

copyDir(path.join(PROJECT_ROOT, 'src', 'css'), path.join(DIST_DIR, 'css'));
copyDir(path.join(PROJECT_ROOT, 'src', 'js'), path.join(DIST_DIR, 'js'));

const imagesSource = path.join(site.sourceDir, 'Images');
if (fs.existsSync(imagesSource)) {
  copyDir(imagesSource, path.join(DIST_DIR, 'images'));
  console.log('  Copied images directory.');
}

console.log(`Built ${builtNotes.length} notes, output at docs/`);

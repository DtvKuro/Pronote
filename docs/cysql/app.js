// ─────────────────────────────────────────────────────────────────────────────
// SQL Playground — app.js
// ES module. sql.js is loaded by the HTML as a regular script (global: initSqlJs)
// ─────────────────────────────────────────────────────────────────────────────

import { EditorView, keymap, lineNumbers, highlightActiveLine } from 'https://esm.sh/@codemirror/view@6';
import { EditorState }                                           from 'https://esm.sh/@codemirror/state@6';
import { sql, SQLite }                                           from 'https://esm.sh/@codemirror/lang-sql@6';
import { oneDark }                                               from 'https://esm.sh/@codemirror/theme-one-dark@6';
import { defaultKeymap, history, historyKeymap }                 from 'https://esm.sh/@codemirror/commands@6';
import { autocompletion, closeBrackets }                         from 'https://esm.sh/@codemirror/autocomplete@6';
import { indentOnInput, bracketMatching }                        from 'https://esm.sh/@codemirror/language@6';

// ─── Constants ───────────────────────────────────────────────────────────────
const IDB_NAME    = 'SQLPlaygroundDB';
const IDB_STORE   = 'databases';
const IDB_KEY     = 'main';
const IDB_TABS_KEY = 'tabs';
const ROW_CAP     = 500;
const SAVE_DELAY  = 500; // ms debounce for IndexedDB writes

// ─── State ────────────────────────────────────────────────────────────────────
let SQL   = null;   // sql.js module
let db    = null;   // current SQL.Database instance
let idb   = null;   // IDBDatabase handle (null if unavailable)
let saveTimer     = null;
let tabSaveTimer  = null;


// ─── Tab state ────────────────────────────────────────────────────────────────
// tabs: Array<{ name: string, content: string }>
// activeIndex: number
let tabs        = [{ name: 'SQL1.sql', content: '-- Write your SQL here\n' }];
let tabCounter  = 1;
let activeIndex = 0;

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const runBtn           = document.getElementById('run-btn');
const importBtn        = document.getElementById('import-btn');
const exportBtn        = document.getElementById('export-btn');
const clearBtn         = document.getElementById('clear-btn');
const fileInput        = document.getElementById('file-input');
const schemaContent    = document.getElementById('schema-content');
const resultsContainer = document.getElementById('results-container');
const statusMessage    = document.getElementById('status-message');
const logContent       = document.getElementById('log-content');
const terminalContent  = document.getElementById('terminal-content');
const logClearBtn      = document.getElementById('log-clear-btn');
const rightTabLog      = document.getElementById('right-tab-log');
const rightTabTerminal = document.getElementById('right-tab-terminal');
const editorPane       = document.getElementById('editor-pane');
const resultsPane      = document.getElementById('results-pane');
const resizeHandle     = document.getElementById('resize-handle');
const schemaAddBtn     = document.getElementById('schema-add-btn');
const tabBar           = document.getElementById('tab-bar');
const tabList          = document.getElementById('tab-list');
const tabNewBtn        = document.getElementById('tab-new-btn');
const contextMenu      = document.getElementById('context-menu');
const contextMenuList  = document.getElementById('context-menu-list');
const modalOverlay     = document.getElementById('modal-overlay');
const modalTitle       = document.getElementById('modal-title');
const modalBody        = document.getElementById('modal-body');
const modalFooter      = document.getElementById('modal-footer');

// ─── Modal ────────────────────────────────────────────────────────────────────
// showModal({ title, body, inputs, buttons }) → Promise<{ button: value, inputs: { id: value } }>
// inputs: Array<{ id, placeholder, value? }>
// buttons: Array<{ label, className, value }>
// Resolves with { button: buttonValue, inputs: { [id]: value } } on button click.
// Resolves with { button: null } on Escape or overlay click (treated as cancel).
function showModal({ title, body = '', inputs = [], buttons = [] }) {
  return new Promise((resolve) => {
    modalTitle.textContent = title;

    modalBody.innerHTML = '';
    if (body) {
      const p = document.createElement('p');
      p.textContent = body;
      modalBody.appendChild(p);
    }
    const inputEls = {};
    for (const inp of inputs) {
      const el = document.createElement('input');
      el.type = 'text';
      el.className = 'modal-input';
      el.id = inp.id;
      el.placeholder = inp.placeholder || '';
      el.value = inp.value || '';
      inputEls[inp.id] = el;
      modalBody.appendChild(el);
    }

    modalFooter.innerHTML = '';

    function finish(buttonValue) {
      modalOverlay.hidden = true;
      overlayHandler.remove();
      keyHandler.remove();
      const inputValues = {};
      for (const [id, el] of Object.entries(inputEls)) {
        inputValues[id] = el.value;
      }
      resolve({ button: buttonValue, inputs: inputValues });
    }

    for (const btn of buttons) {
      const el = document.createElement('button');
      el.textContent = btn.label;
      el.className = btn.className || '';
      el.addEventListener('click', () => finish(btn.value));
      modalFooter.appendChild(el);
    }

    // Escape key and overlay click cancel the modal
    const overlayHandler = { remove: () => {} };
    const keyHandler     = { remove: () => {} };

    const onOverlayClick = (e) => {
      if (e.target === modalOverlay) finish(null);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') finish(null);
    };

    modalOverlay.addEventListener('click', onOverlayClick);
    document.addEventListener('keydown', onKey, { once: false });

    overlayHandler.remove = () => modalOverlay.removeEventListener('click', onOverlayClick);
    keyHandler.remove     = () => document.removeEventListener('keydown', onKey);

    modalOverlay.hidden = false;

    // Auto-focus first input, or first button if no inputs
    const firstInput = modalBody.querySelector('.modal-input');
    const firstBtn   = modalFooter.querySelector('button');
    if (firstInput) {
      firstInput.focus();
      firstInput.select();
    } else if (firstBtn) {
      firstBtn.focus();
    }

    // Enter key in an input clicks the first non-cancel button
    for (const el of Object.values(inputEls)) {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const primaryBtn = buttons.find(b => b.value !== null);
          if (primaryBtn) finish(primaryBtn.value);
        }
      });
    }
  });
}

// ─── CodeMirror setup ─────────────────────────────────────────────────────────
const appKeymap = keymap.of([
  { key: 'Ctrl-Enter', run() { executeQuery(); return true; } },
  { key: 'Alt-t',      run() { tabNewBtn.click(); return true; } },
  { key: 'Alt-w',      run() { closeTab(activeIndex); return true; } },
  { key: 'Enter',      run: ({ state, dispatch }) => {
      dispatch(state.update(state.replaceSelection('\n'), { scrollIntoView: true, userEvent: 'input' }));
      return true;
    }
  },
  { key: 'Tab',        run: ({ state, dispatch }) => {
      dispatch(state.update(state.replaceSelection('  '), { scrollIntoView: true, userEvent: 'input' }));
      return true;
    }
  },
]);

const editorView = new EditorView({
  state: EditorState.create({
    doc: tabs[0].content,
    extensions: [
      history(),
      lineNumbers(),
      highlightActiveLine(),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      sql({ dialect: SQLite, upperCaseKeywords: true }),
      oneDark,
      appKeymap,
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.lineWrapping,
      // Listener to auto-save tab content on change
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          tabs[activeIndex].content = update.state.doc.toString();
          scheduleTabSave();
        }
      }),
    ],
  }),
  parent: document.getElementById('editor-container'),
});

// ─────────────────────────────────────────────────────────────────────────────
// SQL STATEMENT SPLITTER
// Quote-aware: does not split on `;` inside single-quoted strings.
// Handles -- line comments.
// ─────────────────────────────────────────────────────────────────────────────
function splitStatements(input) {
  const statements = [];
  let current      = '';
  let inString     = false;
  let i            = 0;

  while (i < input.length) {
    const ch   = input[i];
    const next = input[i + 1];

    // Inside a single-quoted string
    if (inString) {
      current += ch;
      if (ch === "'" && next === "'") {
        // Escaped quote inside string
        current += next;
        i += 2;
        continue;
      }
      if (ch === "'") inString = false;
      i++;
      continue;
    }

    // Start of single-quoted string
    if (ch === "'") {
      inString = true;
      current += ch;
      i++;
      continue;
    }

    // Line comment: skip to end of line
    if (ch === '-' && next === '-') {
      while (i < input.length && input[i] !== '\n') i++;
      continue;
    }

    // Statement terminator
    if (ch === ';') {
      const trimmed = current.trim();
      if (trimmed.length > 0) statements.push(trimmed);
      current = '';
      i++;
      continue;
    }

    current += ch;
    i++;
  }

  // Trailing statement without semicolon
  const trimmed = current.trim();
  if (trimmed.length > 0) statements.push(trimmed);

  return statements;
}

// ─────────────────────────────────────────────────────────────────────────────
// QUERY EXECUTION
// ─────────────────────────────────────────────────────────────────────────────
function executeQuery() {
  if (!db) { setStatus('Not ready yet.', 'error'); return; }

  const rawSql = editorView.state.doc.toString().trim();
  if (!rawSql) { setStatus('Empty query.', 'warning'); return; }

  const statements = splitStatements(rawSql);
  if (statements.length === 0) { setStatus('Nothing to run.', 'warning'); return; }

  let lastResults   = null;
  let totalAffected = 0;
  let errorMsg      = null;
  let executedCount = 0;

  for (const stmt of statements) {
    try {
      const results = db.exec(stmt);
      executedCount++;

      if (results.length > 0) {
        // SELECT-like: has rows
        lastResults = results[results.length - 1];
      } else {
        // DDL / DML: count changed rows
        totalAffected += db.getRowsModified();
      }
    } catch (err) {
      errorMsg = err.message;
      break;
    }
  }

  // Render results + log + terminal
  if (errorMsg) {
    const context = statements.length > 1
      ? ` (after ${executedCount} of ${statements.length} statements)`
      : '';
    addTerminalOutput(`Error${context}: ${errorMsg}`, 'error');
    addLog(`Error${context}: ${errorMsg}`, 'error', rawSql);
    setStatus('Query error', 'error');
  } else if (lastResults) {
    renderTable(lastResults);
    const extra = statements.length > 1 ? ` (${statements.length} statements)` : '';
    addTerminalOutput(`${lastResults.values.length} row(s) returned${extra}`, 'result');
    addLog(`Returned ${lastResults.values.length} row(s)${extra}`, 'success', rawSql);
    setStatus(`${lastResults.values.length} row(s) returned`, 'success');
  } else {
    addTerminalOutput(`${totalAffected} row(s) affected (${executedCount} statement(s))`, 'result');
    addLog(`${totalAffected} row(s) affected (${executedCount} statement(s))`, 'success', rawSql);
    setStatus(`${totalAffected} row(s) affected`, 'success');
  }

  // Refresh schema, schedule save
  refreshSchema();
  scheduleSave();
}

// ─────────────────────────────────────────────────────────────────────────────
// RESULT RENDERING
// ─────────────────────────────────────────────────────────────────────────────
function renderTable(result) {
  const { columns, values } = result;
  const capped    = values.length > ROW_CAP;
  const rows      = capped ? values.slice(0, ROW_CAP) : values;

  const frag = document.createDocumentFragment();

  if (capped) {
    const notice = document.createElement('div');
    notice.className = 'results-notice';
    notice.textContent = `Showing ${ROW_CAP} of ${values.length} rows`;
    frag.appendChild(notice);
  }

  const wrap  = document.createElement('div');
  wrap.className = 'results-table-wrap';

  const table = document.createElement('table');
  table.className = 'results-table';

  // Header
  const thead = document.createElement('thead');
  const hrow  = document.createElement('tr');
  for (const col of columns) {
    const th = document.createElement('th');
    th.textContent = col;
    hrow.appendChild(th);
  }
  thead.appendChild(hrow);
  table.appendChild(thead);

  // Body
  const tbody = document.createElement('tbody');
  for (const row of rows) {
    const tr = document.createElement('tr');
    for (const cell of row) {
      const td = document.createElement('td');
      if (cell === null) {
        td.textContent = 'NULL';
        td.className = 'null-cell';
      } else {
        td.textContent = String(cell);
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  wrap.appendChild(table);
  frag.appendChild(wrap);

  resultsContainer.innerHTML = '';
  resultsContainer.appendChild(frag);
}


function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA VIEWER
// ─────────────────────────────────────────────────────────────────────────────
function refreshSchema() {
  if (!db) return;

  let tables;
  try {
    const res = db.exec(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );
    tables = res.length > 0 ? res[0].values.map(r => r[0]) : [];
  } catch {
    schemaContent.innerHTML = '<p class="schema-empty">Unable to load.</p>';
    return;
  }

  // Preserve open/collapsed state
  const openTables = new Set(
    [...schemaContent.querySelectorAll('.schema-table.open')]
      .map(el => el.dataset.table)
  );
  const dbNodeOpen = schemaContent.querySelector('.schema-db.open') !== null;
  // On first render, default database node to open
  const shouldDbBeOpen = dbNodeOpen || schemaContent.querySelector('.schema-db') === null;

  const frag = document.createDocumentFragment();

  // Database node: "Tables"
  const dbDiv = document.createElement('div');
  dbDiv.className = 'schema-db' + (shouldDbBeOpen ? ' open' : '');

  const dbNameDiv = document.createElement('div');
  dbNameDiv.className = 'schema-db-name';
  dbNameDiv.innerHTML =
    `<span class="arrow">&#9654;</span>` +
    `<span>Tables</span>`;
  dbNameDiv.addEventListener('click', () => {
    dbDiv.classList.toggle('open');
  });

  const dbTablesDiv = document.createElement('div');
  dbTablesDiv.className = 'schema-db-tables';

  if (tables.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'schema-empty';
    empty.style.paddingLeft = '28px';
    empty.textContent = 'No tables yet.';
    dbTablesDiv.appendChild(empty);
  } else {
    for (const tableName of tables) {
      let columns;
      try {
        const pragma = db.exec(`PRAGMA table_info(${JSON.stringify(tableName)})`);
        columns = pragma.length > 0 ? pragma[0].values : [];
      } catch {
        columns = [];
      }

      const tableDiv = document.createElement('div');
      tableDiv.className = 'schema-table' + (openTables.has(tableName) ? ' open' : '');
      tableDiv.dataset.table = tableName;

      const nameDiv = document.createElement('div');
      nameDiv.className = 'schema-table-name';

      const arrow = document.createElement('span');
      arrow.className = 'arrow';
      arrow.innerHTML = '&#9654;';

      const icon = document.createElement('span');
      icon.className = 'schema-table-icon';
      icon.textContent = '\u{1F4C8}';

      const label = document.createElement('span');
      label.className = 'schema-table-label';
      label.textContent = tableName;

      const menuBtn = document.createElement('button');
      menuBtn.className = 'schema-table-menu-btn';
      menuBtn.title = 'Table actions';
      menuBtn.textContent = '\u22EE'; // ⋮
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showTableContextMenu(e, tableName);
      });

      nameDiv.appendChild(arrow);
      nameDiv.appendChild(icon);
      nameDiv.appendChild(label);
      nameDiv.appendChild(menuBtn);

      nameDiv.addEventListener('click', () => {
        tableDiv.classList.toggle('open');
      });

      const colsDiv = document.createElement('div');
      colsDiv.className = 'schema-columns';

      for (const col of columns) {
        // PRAGMA table_info columns: cid, name, type, notnull, dflt_value, pk
        const [, colName, colType, , , pk] = col;
        const colDiv = document.createElement('div');
        colDiv.className = 'schema-column';
        colDiv.innerHTML =
          `<span class="col-name">${escapeHtml(colName)}</span>` +
          `<span class="col-type">${escapeHtml(colType || '')}</span>` +
          (pk ? `<span class="col-pk">PK</span>` : '');
        colsDiv.appendChild(colDiv);
      }

      tableDiv.appendChild(nameDiv);
      tableDiv.appendChild(colsDiv);
      dbTablesDiv.appendChild(tableDiv);
    }
  }

  dbDiv.appendChild(dbNameDiv);
  dbDiv.appendChild(dbTablesDiv);
  frag.appendChild(dbDiv);

  schemaContent.innerHTML = '';
  schemaContent.appendChild(frag);
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLE CONTEXT MENU (3-dot)
// ─────────────────────────────────────────────────────────────────────────────
function showTableContextMenu(event, tableName) {
  const items = [
    {
      label: 'View Table',
      action() {
        setEditorContent(`SELECT * FROM "${tableName}";`);
        executeQuery();
      }
    },
    {
      label: 'View Structure',
      action() {
        try {
          const res = db.exec(`SELECT sql FROM sqlite_master WHERE name='${tableName.replace(/'/g, "''")}'`);
          if (res.length > 0 && res[0].values.length > 0) {
            addTerminalOutput(res[0].values[0][0], 'result');
          } else {
            addTerminalOutput(`No structure found for "${tableName}".`, 'error');
          }
        } catch (err) {
          addTerminalOutput(`Error: ${err.message}`, 'error');
        }
      }
    },
    { separator: true },
    {
      label: 'Delete Table',
      danger: true,
      async action() {
        const result = await showModal({
          title: 'Delete Table',
          body: `Delete "${tableName}"? This can't be undone.`,
          inputs: [],
          buttons: [
            { label: 'Cancel', className: 'btn-modal-cancel', value: null },
            { label: 'Delete', className: 'btn-modal-danger', value: 'drop' },
          ],
        });
        if (result.button !== 'drop') return;
        try {
          db.run(`DROP TABLE ${JSON.stringify(tableName)}`);
          refreshSchema();
          scheduleSave();
          addLog(`Deleted table "${tableName}"`, 'info');
          setStatus(`Deleted "${tableName}"`, 'info');
        } catch (err) {
          addLog(`Delete failed: ${err.message}`, 'error');
          setStatus(`Delete failed: ${err.message}`, 'error');
        }
      }
    },
  ];
  openContextMenu(event.clientX, event.clientY, items);
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERIC CONTEXT MENU
// ─────────────────────────────────────────────────────────────────────────────
function openContextMenu(x, y, items) {
  contextMenuList.innerHTML = '';

  for (const item of items) {
    const li = document.createElement('li');
    if (item.separator) {
      li.className = 'menu-separator';
    } else {
      if (item.danger) li.className = 'menu-danger';
      li.textContent = item.label;
      li.addEventListener('click', () => {
        closeContextMenu();
        item.action();
      });
    }
    contextMenuList.appendChild(li);
  }

  contextMenu.hidden = false;

  // Position — keep inside viewport
  const menuW = 180;
  const menuH = items.length * 30;
  const left  = x + menuW > window.innerWidth  ? x - menuW : x;
  const top   = y + menuH > window.innerHeight ? y - menuH : y;
  contextMenu.style.left = `${left}px`;
  contextMenu.style.top  = `${top}px`;
}

function closeContextMenu() {
  contextMenu.hidden = true;
}

document.addEventListener('click', (e) => {
  if (!contextMenu.hidden && !contextMenu.contains(e.target)) {
    closeContextMenu();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalOverlay.hidden) return; // modal handles its own Escape
  if (e.key === 'Escape') closeContextMenu();
});

// ─────────────────────────────────────────────────────────────────────────────
// EDITOR CONTENT HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function setEditorContent(text) {
  editorView.dispatch({
    changes: { from: 0, to: editorView.state.doc.length, insert: text }
  });
  // updateListener already syncs to tabs[activeIndex].content
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
function renderTabs() {
  tabList.innerHTML = '';

  tabs.forEach((tab, index) => {
    const item = document.createElement('div');
    item.className = 'tab-item' + (index === activeIndex ? ' active' : '');
    item.dataset.index = index;
    item.title = tab.name;

    const label = document.createElement('span');
    label.className = 'tab-item-label';
    label.textContent = tab.name;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'tab-close-btn';
    closeBtn.innerHTML = '&#x2715;';
    closeBtn.title = 'Close tab';
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeTab(index);
    });

    item.appendChild(label);
    item.appendChild(closeBtn);

    item.addEventListener('click', () => switchTab(index));
    item.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showTabContextMenu(e, index);
    });

    tabList.appendChild(item);
  });

  // Scroll active tab into view
  const activeEl = tabList.querySelector('.tab-item.active');
  if (activeEl) activeEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

function switchTab(index) {
  if (index === activeIndex) return;
  // Save current editor content before switching
  tabs[activeIndex].content = editorView.state.doc.toString();
  activeIndex = index;
  // Load target tab content into editor
  editorView.dispatch({
    changes: { from: 0, to: editorView.state.doc.length, insert: tabs[activeIndex].content }
  });
  renderTabs();
  scheduleTabSave();
}

function createTab() {
  // Save current content first
  if (tabs.length > 0) {
    tabs[activeIndex].content = editorView.state.doc.toString();
  }
  tabCounter++;
  const newTab = { name: `SQL${tabCounter}.sql`, content: '' };
  tabs.push(newTab);
  activeIndex = tabs.length - 1;
  editorView.dispatch({
    changes: { from: 0, to: editorView.state.doc.length, insert: '' }
  });
  renderTabs();
  scheduleTabSave();
}

function closeTab(index) {
  if (tabs.length === 1) return; // last tab — don't close
  tabs.splice(index, 1);
  if (activeIndex >= tabs.length) {
    activeIndex = tabs.length - 1;
  } else if (activeIndex > index) {
    activeIndex--;
  }
  // Load new active tab content
  editorView.dispatch({
    changes: { from: 0, to: editorView.state.doc.length, insert: tabs[activeIndex].content }
  });
  renderTabs();
  scheduleTabSave();
}

async function renameTab(index) {
  const result = await showModal({
    title: 'Rename',
    inputs: [{ id: 'name', placeholder: 'filename.sql', value: tabs[index].name }],
    buttons: [
      { label: 'Cancel', className: 'btn-modal-cancel', value: null },
      { label: 'Rename', className: 'btn-modal-primary', value: 'rename' },
    ],
  });
  if (result.button !== 'rename') return;
  const newName = result.inputs.name.trim();
  if (!newName) return;
  tabs[index].name = newName;
  renderTabs();
  scheduleTabSave();
}

function showTabContextMenu(event, index) {
  const items = [
    {
      label: 'Rename',
      action() { renameTab(index); }
    },
    {
      label: 'Close',
      action() { closeTab(index); }
    },
  ];
  openContextMenu(event.clientX, event.clientY, items);
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BAR
// ─────────────────────────────────────────────────────────────────────────────
function setStatus(message, type = 'idle') {
  statusMessage.textContent = message;
  statusMessage.className = `status-${type}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// LOG PANEL
// ─────────────────────────────────────────────────────────────────────────────
function addLog(message, type = 'info', sqlText = null) {
  // Remove empty placeholder
  const empty = logContent.querySelector('.log-empty');
  if (empty) empty.remove();

  const entry = document.createElement('div');
  entry.className = `log-entry log-entry--${type}`;

  const time = document.createElement('span');
  time.className = 'log-entry-time';
  time.textContent = new Date().toLocaleTimeString();

  const msg = document.createElement('span');
  msg.className = 'log-entry-message';
  msg.textContent = message;

  entry.appendChild(time);
  entry.appendChild(msg);

  if (sqlText) {
    const sqlEl = document.createElement('code');
    sqlEl.className = 'log-entry-sql';
    sqlEl.textContent = sqlText.replace(/\s+/g, ' ').trim().slice(0, 200);
    sqlEl.title = 'Click to load into editor';
    sqlEl.addEventListener('click', () => setEditorContent(sqlText));
    entry.appendChild(sqlEl);
  }

  // Prepend (newest first)
  logContent.prepend(entry);

  // Cap at 200 entries
  while (logContent.children.length > 200) {
    logContent.lastChild.remove();
  }
}

function clearLog() {
  logContent.innerHTML = '<p class="log-empty">No activity yet.</p>';
}

// ─────────────────────────────────────────────────────────────────────────────
// TERMINAL / OUTPUT PANEL
// ─────────────────────────────────────────────────────────────────────────────
function addTerminalOutput(text, type = 'info') {
  const empty = terminalContent.querySelector('.log-empty');
  if (empty) empty.remove();

  const entry = document.createElement('div');
  entry.className = `terminal-entry terminal-entry--${type}`;

  const label = document.createElement('span');
  label.className = 'terminal-entry-label';
  label.textContent = type === 'error' ? 'ERR' : type === 'result' ? 'OUT' : 'INFO';

  entry.appendChild(label);
  entry.appendChild(document.createTextNode(text));

  terminalContent.prepend(entry);

  // Switch to output tab
  switchRightTab('terminal');

  while (terminalContent.children.length > 200) {
    terminalContent.lastChild.remove();
  }
}

function clearTerminal() {
  terminalContent.innerHTML = '<p class="log-empty">No output yet.</p>';
}

// ─────────────────────────────────────────────────────────────────────────────
// RIGHT PANEL TAB SWITCHING
// ─────────────────────────────────────────────────────────────────────────────
function switchRightTab(target) {
  document.querySelectorAll('.right-tab').forEach(t => t.classList.toggle('active', t.dataset.target === target));
  document.querySelectorAll('.right-pane').forEach(p => p.classList.toggle('active', p.id === (target === 'log' ? 'log-content' : 'terminal-content')));
}

// ─────────────────────────────────────────────────────────────────────────────
// INDEXEDDB PERSISTENCE
// ─────────────────────────────────────────────────────────────────────────────
function openIdb() {
  return new Promise((resolve) => {
    if (!window.indexedDB) { resolve(null); return; }

    const req = indexedDB.open(IDB_NAME, 1);

    req.onupgradeneeded = (e) => {
      const database = e.target.result;
      if (!database.objectStoreNames.contains(IDB_STORE)) {
        database.createObjectStore(IDB_STORE);
      }
    };

    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = ()  => resolve(null);
  });
}

function loadFromIdb() {
  return new Promise((resolve) => {
    if (!idb) { resolve(null); return; }
    const tx  = idb.transaction(IDB_STORE, 'readonly');
    const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
    req.onsuccess = (e) => resolve(e.target.result ?? null);
    req.onerror   = ()  => resolve(null);
  });
}

function loadTabsFromIdb() {
  return new Promise((resolve) => {
    if (!idb) { resolve(null); return; }
    const tx  = idb.transaction(IDB_STORE, 'readonly');
    const req = tx.objectStore(IDB_STORE).get(IDB_TABS_KEY);
    req.onsuccess = (e) => resolve(e.target.result ?? null);
    req.onerror   = ()  => resolve(null);
  });
}

function saveToIdb(data) {
  if (!idb) return;
  const tx  = idb.transaction(IDB_STORE, 'readwrite');
  tx.objectStore(IDB_STORE).put(data, IDB_KEY);
  tx.onerror = () => setStatus('Failed to save.', 'warning');
}

function saveTabsToIdb() {
  if (!idb) return;
  const payload = { activeIndex, tabs };
  const tx  = idb.transaction(IDB_STORE, 'readwrite');
  tx.objectStore(IDB_STORE).put(payload, IDB_TABS_KEY);
  tx.onerror = () => setStatus('Failed to save tabs.', 'warning');
}

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    if (!db) return;
    const data = db.export();
    saveToIdb(data);
  }, SAVE_DELAY);
}

function scheduleTabSave() {
  clearTimeout(tabSaveTimer);
  tabSaveTimer = setTimeout(() => {
    saveTabsToIdb();
  }, SAVE_DELAY);
}

// ─────────────────────────────────────────────────────────────────────────────
// DATABASE LIFECYCLE
// ─────────────────────────────────────────────────────────────────────────────
function createFreshDb() {
  return new SQL.Database();
}

function loadDb(binary) {
  // Validate before replacing
  const candidate = new SQL.Database(binary);
  // Quick sanity: can we query sqlite_master?
  candidate.exec("SELECT name FROM sqlite_master LIMIT 1");
  return candidate;
}

function replaceDb(newDb) {
  if (db) db.close();
  db = newDb;
  refreshSchema();
  scheduleSave();
}

// ─────────────────────────────────────────────────────────────────────────────
// RESIZABLE SPLIT
// ─────────────────────────────────────────────────────────────────────────────
function setupResizer() {
  let dragging = false;
  let startY   = 0;
  let startH   = 0;

  resizeHandle.addEventListener('mousedown', (e) => {
    dragging  = true;
    startY    = e.clientY;
    startH    = editorPane.getBoundingClientRect().height;
    resizeHandle.classList.add('dragging');
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const delta  = e.clientY - startY;
    const newH   = Math.max(80, Math.min(startH + delta, window.innerHeight - 200));
    editorPane.style.height = `${newH}px`;
    editorPane.style.flex   = 'none';
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    resizeHandle.classList.remove('dragging');
    document.body.style.cursor  = '';
    document.body.style.userSelect = '';
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL KEYBOARD SHORTCUTS (prevent browser defaults)
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    scheduleSave();
    scheduleTabSave();
    setStatus('Saved.', 'success');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// EVENT WIRING
// ─────────────────────────────────────────────────────────────────────────────
runBtn.addEventListener('click', executeQuery);

importBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;
  fileInput.value = '';

  const reader = new FileReader();
  reader.onload = (e) => {
    const binary = new Uint8Array(e.target.result);
    try {
      const imported = loadDb(binary);
      replaceDb(imported);
      addLog(`Imported "${file.name}"`, 'success');
      setStatus(`Imported: ${file.name}`, 'success');
    } catch (err) {
      addLog(`Couldn't import: ${err.message}`, 'error');
      setStatus(`Import failed.`, 'error');
    }
  };
  reader.readAsArrayBuffer(file);
});

exportBtn.addEventListener('click', () => {
  if (!db) { setStatus('Nothing to export.', 'warning'); return; }
  const data    = db.export();
  const blob    = new Blob([data], { type: 'application/octet-stream' });
  const url     = URL.createObjectURL(blob);
  const anchor  = document.createElement('a');
  anchor.href     = url;
  anchor.download = 'playground.sqlite';
  anchor.click();
  URL.revokeObjectURL(url);
  addLog('Exported as playground.sqlite', 'success');
  setStatus('Exported.', 'success');
});

clearBtn.addEventListener('click', async () => {
  const result = await showModal({
    title: 'Clear Database',
    body: 'Clear everything? All your tables and data will be gone.',
    inputs: [],
    buttons: [
      { label: 'Cancel', className: 'btn-modal-cancel', value: null },
      { label: 'Reset',  className: 'btn-modal-danger', value: 'reset' },
    ],
  });
  if (result.button !== 'reset') return;
  const fresh = createFreshDb();
  replaceDb(fresh);
  resultsContainer.innerHTML = '<p class="results-placeholder">Run a query to see results here.</p>';
  addLog('Cleared everything.', 'info');
  setStatus('All clear.', 'info');
});

logClearBtn.addEventListener('click', () => {
  const activePane = document.querySelector('.right-tab.active');
  if (activePane && activePane.dataset.target === 'terminal') {
    clearTerminal();
  } else {
    clearLog();
  }
});

rightTabLog.addEventListener('click', () => switchRightTab('log'));
rightTabTerminal.addEventListener('click', () => switchRightTab('terminal'));

schemaAddBtn.addEventListener('click', () => {
  const template = 'CREATE TABLE new_table (\n  id INTEGER PRIMARY KEY\n);';
  setEditorContent(template);
  editorView.focus();
});

tabNewBtn.addEventListener('click', () => createTab());

// ─────────────────────────────────────────────────────────────────────────────
// INITIALISATION
// ─────────────────────────────────────────────────────────────────────────────
async function init() {
  setStatus('Starting up\u2026', 'info');

  // sql.js WASM init
  SQL = await initSqlJs({
    locateFile: (filename) =>
      `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/${filename}`
  });

  // Open IndexedDB
  idb = await openIdb();
  if (!idb) {
    setStatus('Storage unavailable \u2014 data won\u2019t be saved.', 'warning');
  }

  // Load saved tabs
  const savedTabs = idb ? await loadTabsFromIdb() : null;
  if (savedTabs && Array.isArray(savedTabs.tabs) && savedTabs.tabs.length > 0) {
    tabs = savedTabs.tabs;
    activeIndex = Math.min(savedTabs.activeIndex ?? 0, tabs.length - 1);
    // Sync tabCounter to highest existing SQL number
    for (const t of tabs) {
      const m = t.name.match(/^SQL(\d+)\.sql$/i);
      if (m) tabCounter = Math.max(tabCounter, parseInt(m[1], 10));
    }
    // Load active tab into editor
    editorView.dispatch({
      changes: { from: 0, to: editorView.state.doc.length, insert: tabs[activeIndex].content }
    });
  }

  // Try to load saved DB from IndexedDB
  const savedBinary = idb ? await loadFromIdb() : null;

  if (savedBinary) {
    try {
      db = loadDb(savedBinary);
      setStatus('Restored your database.', 'success');
    } catch {
      db = createFreshDb();
      setStatus('Saved data was corrupt \u2014 starting fresh.', 'warning');
    }
  } else {
    db = createFreshDb();
    setStatus('Ready.', 'idle');
    scheduleSave();
  }

  refreshSchema();
  renderTabs();
  setupResizer();
}

init().catch((err) => {
  setStatus(`Couldn't start: ${err.message}`, 'error');
  // eslint-disable-next-line no-console
  console.error(err);
});

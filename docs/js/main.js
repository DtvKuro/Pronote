(() => {
  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  const pageType = document.body.dataset.pageType;

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // Hide skeleton
  const skeleton = document.getElementById('skeletonLoader');
  if (skeleton) skeleton.classList.add('skeleton-loader--hidden');

  // Sidebar menu
  const menuBtn = document.querySelector('.notes-menu-toggle');
  const menu = document.querySelector('.notes-menu');
  const overlay = document.querySelector('.notes-menu-overlay');
  const closeBtn = document.querySelector('.notes-menu-close');

  function openMenu() {
    if (!menu || !overlay) return;
    menu.classList.add('is-open');
    overlay.classList.add('is-open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    if (!menu || !overlay) return;
    menu.classList.remove('is-open');
    overlay.classList.remove('is-open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  }

  if (menuBtn && menu && overlay) {
    menuBtn.addEventListener('click', openMenu);
    overlay.addEventListener('click', closeMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  }

  // Sidebar hover preview
  let previewTooltip = null;

  document.querySelectorAll('.notes-menu-link[data-preview]').forEach(link => {
    link.addEventListener('mouseenter', (e) => {
      const text = link.getAttribute('data-preview');
      if (!text) return;

      if (!previewTooltip) {
        previewTooltip = document.createElement('div');
        previewTooltip.className = 'sidebar-preview-tooltip';
        document.body.appendChild(previewTooltip);
      }
      previewTooltip.textContent = text;

      let top = e.clientY + 12;
      if (top + 120 > window.innerHeight) top = e.clientY - 120;

      const rect = link.getBoundingClientRect();
      previewTooltip.style.left = (rect.right + 8) + 'px';
      previewTooltip.style.top = Math.max(8, top) + 'px';
      previewTooltip.classList.add('show');
    });

    link.addEventListener('mouseleave', () => {
      if (previewTooltip) previewTooltip.classList.remove('show');
    });
  });

  // Back to top
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.textContent = '\u2191';
  document.body.appendChild(backToTop);
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Smooth anchor scrolling
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const targetId = link.getAttribute('href').slice(1);
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2) + (target.offsetHeight / 2);
    window.scrollTo({ top: y, behavior: 'smooth' });
  });

  // Keyboard shortcuts
  const searchInput = document.getElementById('searchInput');

  // Phones: the search icon opens the same input as a row under the nav
  const nav = document.querySelector('.nav');
  const searchToggle = document.getElementById('searchToggle');
  function setSearchOpen(open) {
    if (!nav || !searchToggle) return;
    nav.classList.toggle('nav--search-open', open);
    searchToggle.setAttribute('aria-expanded', String(open));
  }
  if (searchToggle && searchInput) {
    searchToggle.addEventListener('click', () => {
      setSearchOpen(true);
      searchInput.focus();
    });
    document.getElementById('searchClose').addEventListener('click', () => {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      setSearchOpen(false);
      searchToggle.focus();
    });
  }

  document.addEventListener('keydown', (e) => {
    const inInput = document.activeElement &&
      (document.activeElement.tagName === 'INPUT' ||
       document.activeElement.tagName === 'TEXTAREA' ||
       document.activeElement.isContentEditable);

    if (e.key === 'Escape') {
      closeMenu();
      setSearchOpen(false);
      if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.blur();
      }
      return;
    }

    if (e.key === '/' && !inInput) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
      return;
    }

    const inQuiz = document.activeElement && document.activeElement.closest('.quiz');

    if (pageType === 'note' && !inInput && !inQuiz) {
      if (e.key === 'ArrowLeft') {
        const prev = document.querySelector('.note-nav-prev');
        if (prev) prev.click();
      } else if (e.key === 'ArrowRight') {
        const next = document.querySelector('.note-nav-next');
        if (next) next.click();
      }
    }

    if (menu && menu.classList.contains('is-open') && e.key === 'Escape') {
      closeMenu();
    }
  });

  // Scroll handler
  const progressBar = document.getElementById('progressBar');
  const navContainer = document.querySelector('.nav-container');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('back-to-top--visible', window.scrollY > 300);

    if (pageType === 'note' && progressBar) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH > 0) progressBar.style.width = (window.scrollY / docH) * 100 + '%';
    }
  }, { passive: true });

  if (pageType === 'home') {
    const tabs = document.querySelectorAll('.category-tab');
    const sections = document.querySelectorAll('.category-section');
    let searchIndex = null;
    let activeFilter = 'ALL';

    if (tabs.length) {
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          activeFilter = tab.getAttribute('data-filter');
          applyFilters();
        });
      });
    }

    function applyFilters() {
      const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

      sections.forEach(section => {
        const cat = section.getAttribute('data-category');
        if (activeFilter !== 'ALL' && cat !== activeFilter) {
          section.classList.add('category-section--hidden');
          return;
        }

        const cards = section.querySelectorAll('.card');
        let visible = 0;

        cards.forEach(card => {
          if (!query) {
            card.style.display = '';
            visible++;
          } else {
            const title = (card.getAttribute('data-title') || '').toLowerCase();
            const extra = searchIndex
              ? (searchIndex[card.getAttribute('data-title')] || '').toLowerCase()
              : '';
            const match = title.includes(query) || extra.includes(query);
            card.style.display = match ? '' : 'none';
            if (match) visible++;
          }
        });

        section.classList.toggle('category-section--hidden', visible === 0 && !!query);
      });
    }

    if (searchInput) {
      // lazy load search index
      searchInput.addEventListener('focus', () => {
        if (searchIndex !== null) return;
        fetch('./search-index.json')
          .then(r => r.json())
          .then(data => { searchIndex = data; })
          .catch(() => { searchIndex = {}; });
      }, { once: true });

      searchInput.addEventListener('input', applyFilters);
    }

    // School: pick a year and semester to see its subjects
    const termPicker = document.querySelector('.term-picker');
    if (termPicker) {
      const semSections = document.querySelectorAll('.term-section');
      const empty = document.querySelector('.term-empty');
      let year = termPicker.dataset.year;
      let sem = termPicker.dataset.sem;

      termPicker.addEventListener('click', (e) => {
        const btn = e.target.closest('.term-picker-btn');
        if (!btn) return;
        if (btn.dataset.year) year = btn.dataset.year;
        if (btn.dataset.sem) sem = btn.dataset.sem;

        termPicker.querySelectorAll('.term-picker-btn').forEach(b => {
          const on = b.dataset.year ? b.dataset.year === year : b.dataset.sem === sem;
          b.classList.toggle('active', on);
          b.setAttribute('aria-pressed', String(on));
        });

        const id = 'Y' + year + 'S' + sem;
        let found = false;
        semSections.forEach(s => {
          s.hidden = s.dataset.sem !== id;
          if (!s.hidden) found = true;
        });
        if (empty) empty.hidden = found;
      });
    }
  }

  if (pageType === 'note') {
    const noteContent = document.querySelector('.note-content');
    const slug = window.location.pathname;

    // Scroll position memory
    const fromNav = sessionStorage.getItem('fromPrevNext');
    if (fromNav === 'true') {
      sessionStorage.removeItem('fromPrevNext');
    } else {
      const saved = localStorage.getItem('scroll:' + slug);
      if (saved !== null) {
        requestAnimationFrame(() => window.scrollTo(0, parseInt(saved, 10)));
      }
    }

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('scroll:' + slug, String(window.scrollY));
    });

    document.querySelectorAll('.note-nav-prev, .note-nav-next').forEach(link => {
      link.addEventListener('click', () => sessionStorage.setItem('fromPrevNext', 'true'));
    });

    // Share
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          let tip = shareBtn.querySelector('.tooltip');
          if (!tip) {
            tip = document.createElement('span');
            tip.className = 'tooltip';
            shareBtn.appendChild(tip);
          }
          tip.textContent = 'Link copied!';
          tip.classList.add('show');
          setTimeout(() => tip.classList.remove('show'), 2000);
        });
      });
    }

    // Print / export
    const exportBtn = document.getElementById('exportPdfBtn');
    if (exportBtn) exportBtn.addEventListener('click', () => window.print());

    // Code copy
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.code-copy-btn');
      if (!btn) return;
      const wrapper = btn.closest('.code-block-wrapper');
      const code = wrapper && wrapper.querySelector('code');
      if (!code) return;

      const origSvg = btn.innerHTML;
      navigator.clipboard.writeText(code.textContent).then(() => {
        btn.classList.add('copied');
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = origSvg;
        }, 2000);
      });
    });

    // TOC generation
    if (noteContent) {
      const headings = noteContent.querySelectorAll('h2, h3');

      if (headings.length > 0) {
        // Ids must be unique: the same heading text can repeat within a note
        const seenIds = new Set();
        headings.forEach(h => {
          const base = h.id || slugify(h.textContent) || 'section';
          let id = base;
          for (let n = 2; seenIds.has(id); n++) id = base + '-' + n;
          seenIds.add(id);
          h.id = id;
        });

        const toc = document.createElement('aside');
        toc.className = 'toc';

        const tocTitle = document.createElement('p');
        tocTitle.className = 'toc-title';
        tocTitle.textContent = 'On this page';
        toc.appendChild(tocTitle);

        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';

        let curH2 = null;
        let curSub = null;

        headings.forEach(heading => {
          const li = document.createElement('li');
          li.className = 'toc-item toc-item--' + heading.tagName.toLowerCase();

          const a = document.createElement('a');
          a.className = 'toc-link';
          a.href = '#' + heading.id;
          a.textContent = heading.textContent;

          if (heading.tagName === 'H2') {
            li.appendChild(a);
            tocList.appendChild(li);
            curH2 = li;
            curSub = null;
          } else if (heading.tagName === 'H3' && curH2) {
            if (!curSub) {
              curSub = document.createElement('ul');
              curSub.className = 'toc-sublist';

              const toggle = document.createElement('span');
              toggle.className = 'toc-toggle';
              curH2.classList.add('toc-item--has-children');
              curH2.appendChild(toggle);
              curH2.appendChild(curSub);

              // Capture this section: curH2 moves on by the time the arrow is clicked
              const owner = curH2;
              toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                owner.classList.toggle('toc-item--expanded');
              });
            }
            li.appendChild(a);
            curSub.appendChild(li);
          } else {
            li.appendChild(a);
            tocList.appendChild(li);
          }
        });

        toc.appendChild(tocList);
        noteContent.parentNode.insertBefore(toc, noteContent);

        tocTitle.addEventListener('click', () => toc.classList.toggle('toc--expanded'));

        // Below 1024px the list is a sheet opened from a floating button
        const tocFab = document.createElement('button');
        tocFab.className = 'toc-fab';
        tocFab.setAttribute('aria-label', 'On this page');
        tocFab.setAttribute('aria-expanded', 'false');
        tocFab.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>';
        document.body.appendChild(tocFab);
        const setTocOpen = (open) => {
          toc.classList.toggle('toc--open', open);
          tocFab.setAttribute('aria-expanded', String(open));
          if (!open) return;
          // Open with every section collapsed except the one being read
          toc.querySelectorAll('.toc-item--expanded').forEach(li => li.classList.remove('toc-item--expanded'));
          const current = toc.querySelector('.toc-link--active');
          if (!current) return;
          const section = current.closest('.toc-item--h2');
          if (section) section.classList.add('toc-item--expanded');
          current.scrollIntoView({ block: 'center' });
        };
        tocFab.addEventListener('click', () => setTocOpen(!toc.classList.contains('toc--open')));
        document.addEventListener('click', (e) => {
          if (!toc.contains(e.target) && !tocFab.contains(e.target)) setTocOpen(false);
        });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setTocOpen(false); });

        const tocLinks = toc.querySelectorAll('.toc-link');
        let clickedId = null;

        // scroll to heading + glow on TOC click
        tocLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            setTocOpen(false);
            const id = link.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (!target) return;

            clickedId = id;
            tocLinks.forEach(l => l.classList.remove('toc-link--active'));
            link.classList.add('toc-link--active');

            const y = target.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2) + (target.offsetHeight / 2);
            window.scrollTo({ top: y, behavior: 'smooth' });
            history.pushState(null, '', '#' + id);

            target.classList.remove('toc-heading-glow');
            void target.offsetWidth; // force reflow
            target.classList.add('toc-heading-glow');

            const clearGlow = () => {
              setTimeout(() => target.classList.remove('toc-heading-glow'), 700);
              clickedId = null;
            };

            if (Math.abs(Math.round(window.scrollY) - Math.round(y)) < 2) {
              clearGlow();
            } else {
              window.addEventListener('scrollend', clearGlow, { once: true });
            }
          });
        });

        // highlight closest heading in TOC
        const updateActive = () => {
          if (clickedId) return;

          const center = window.innerHeight / 2;
          let closest = null;
          let minDist = Infinity;

          // Search rebuilds the note markup, so look the headings up fresh
          const live = noteContent.querySelectorAll('h2, h3');
          const firstRect = live[0].getBoundingClientRect();
          if (firstRect.top >= 0) {
            closest = live[0];
          } else {
            live.forEach(h => {
              const d = Math.abs(h.getBoundingClientRect().top - center);
              if (d < minDist) { minDist = d; closest = h; }
            });
          }

          if (closest) {
            tocLinks.forEach(l => l.classList.remove('toc-link--active'));
            const active = toc.querySelector('.toc-link[href="#' + closest.id + '"]');
            if (active) active.classList.add('toc-link--active');
          }
        };

        window.addEventListener('scroll', updateActive, { passive: true });
        updateActive();
      }
    }

    // Sticky title in nav
    const noteTitle = document.querySelector('.note-title');
    if (noteTitle && navContainer) {
      let stickyTitle = navContainer.querySelector('.nav-sticky-title');
      if (!stickyTitle) {
        stickyTitle = document.createElement('span');
        stickyTitle.className = 'nav-sticky-title';
        stickyTitle.textContent = noteTitle.textContent;
        const logo = navContainer.querySelector('.nav-logo');
        if (logo && logo.nextSibling) {
          navContainer.insertBefore(stickyTitle, logo.nextSibling);
        } else {
          navContainer.appendChild(stickyTitle);
        }
      }

      new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          navContainer.classList.toggle('nav--show-title', !entry.isIntersecting);
        });
      }, { threshold: 0 }).observe(noteTitle);
    }

    const quizzes = Array.from(document.querySelectorAll('.quiz'));

    // In-page keyword search
    if (searchInput && noteContent) {
      const navPanel = document.getElementById('searchNavPanel');
      const matchInfo = document.getElementById('searchMatchInfo');
      const prevBtn = document.getElementById('searchPrevBtn');
      const nextBtn = document.getElementById('searchNextBtn');

      let original = noteContent.innerHTML;
      let matches = [];
      let curMatch = -1;

      // Restoring the markup would wipe a running quiz, so swap the live ones back in.
      function resetContent() {
        noteContent.innerHTML = original;
        noteContent.querySelectorAll('.quiz').forEach((fresh, i) => fresh.replaceWith(quizzes[i]));
      }

      function clearHighlights() {
        resetContent();
        matches = [];
        curMatch = -1;
      }

      function highlightText(query) {
        resetContent();
        matches = [];
        curMatch = -1;
        if (!query) return;

        const lower = query.toLowerCase();
        const walker = document.createTreeWalker(noteContent, NodeFilter.SHOW_TEXT, null);

        const nodes = [];
        let node;
        while ((node = walker.nextNode())) {
          if (node.textContent.toLowerCase().includes(lower) && !node.parentNode.closest('.quiz')) nodes.push(node);
        }

        // replace in reverse to preserve positions
        nodes.reverse().forEach(textNode => {
          const parent = textNode.parentNode;
          if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return;

          const text = textNode.textContent;
          const lowerText = text.toLowerCase();
          const frag = document.createDocumentFragment();
          let last = 0;
          let idx = lowerText.indexOf(lower);

          while (idx !== -1) {
            if (idx > last) frag.appendChild(document.createTextNode(text.slice(last, idx)));
            const mark = document.createElement('mark');
            mark.className = 'search-highlight';
            mark.textContent = text.slice(idx, idx + query.length);
            frag.appendChild(mark);
            last = idx + query.length;
            idx = lowerText.indexOf(lower, last);
          }

          if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
          parent.replaceChild(frag, textNode);
        });

        matches = Array.from(noteContent.querySelectorAll('.search-highlight'));
      }

      function goToMatch(index) {
        if (!matches.length) return;
        if (curMatch >= 0 && curMatch < matches.length) {
          matches[curMatch].classList.remove('search-highlight--current');
        }
        curMatch = (index + matches.length) % matches.length;
        matches[curMatch].classList.add('search-highlight--current');
        if (window.matchMedia('(max-width: 767px)').matches) {
          // Keep the match clear of the nav, the open search row and the on-screen keyboard
          const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
          const row = nav.querySelector('.nav-search').getBoundingClientRect();
          const clear = Math.max(nav.getBoundingClientRect().bottom, row.bottom) + 24;
          window.scrollTo({ top: matches[curMatch].getBoundingClientRect().top + window.scrollY - Math.max(vh * 0.45, clear), behavior: 'smooth' });
        } else {
          matches[curMatch].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (matchInfo) matchInfo.textContent = (curMatch + 1) + ' / ' + matches.length;
      }

      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim();
        if (!q) {
          clearHighlights();
          if (navPanel) navPanel.style.display = 'none';
          return;
        }

        highlightText(q);
        if (matches.length > 0) {
          goToMatch(0);
          if (navPanel) navPanel.style.display = 'flex';
        } else {
          if (navPanel) navPanel.style.display = 'none';
          if (matchInfo) matchInfo.textContent = '0 results';
        }
      });

      if (prevBtn) prevBtn.addEventListener('click', () => goToMatch(curMatch - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => goToMatch(curMatch + 1));
    }

    // Quiz (runs after the search block above has captured the untouched markup)
    function shuffle(list) {
      const a = list.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function make(tag, cls, text) {
      const node = document.createElement(tag);
      node.className = cls;
      if (text !== undefined) node.textContent = text;
      return node;
    }

    function initQuiz(root) {
      const questions = JSON.parse(root.querySelector('.quiz-data').textContent);
      const body = make('div', 'quiz-body');
      const live = make('div', 'quiz-live');
      const actions = make('div', 'quiz-actions');
      live.setAttribute('aria-live', 'polite');
      root.append(body, live, actions);

      let order = [];
      let pos = 0;
      let right = 0;
      let answered = false;

      function button(label, cls, onClick) {
        const b = make('button', 'quiz-btn ' + cls, label);
        b.type = 'button';
        b.addEventListener('click', onClick);
        return b;
      }

      function intro() {
        body.replaceChildren(make('p', 'quiz-intro', questions.length + ' questions, asked in random order.'));
        actions.replaceChildren(button('Start quiz', 'quiz-btn--primary', start));
      }

      function start() {
        order = shuffle(questions);
        pos = 0;
        right = 0;
        show();
      }

      function finish() {
        const count = pos + 1;
        body.replaceChildren();
        live.replaceChildren(
          make('p', 'quiz-result-title', 'Quiz finished'),
          make('p', 'quiz-score', 'Score: ' + right + ' / ' + count)
        );
        const again = button('Start again', 'quiz-btn--primary', start);
        actions.replaceChildren(again);
        again.focus();
      }

      function show() {
        const q = order[pos];
        answered = false;

        const status = make('p', 'quiz-status');
        const setStatus = () => { status.textContent = 'Question ' + (pos + 1) + ' of ' + order.length + ' · Correct: ' + right; };
        setStatus();

        const text = make('p', 'quiz-question', q.q);
        text.tabIndex = -1;

        const group = make('div', 'quiz-choices');
        group.setAttribute('role', 'group');
        group.setAttribute('aria-label', 'Answer choices');

        const choices = shuffle([{ t: q.c, ok: true }].concat(q.w.map((t) => ({ t, ok: false }))));
        const buttons = choices.map((choice) => {
          const b = make('button', 'quiz-choice');
          b.type = 'button';
          b.append(make('span', 'quiz-icon'), make('span', 'quiz-choice-text', choice.t), make('span', 'quiz-tag'));
          group.appendChild(b);
          return b;
        });

        buttons.forEach((b, i) => b.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          const ok = choices[i].ok;
          if (ok) right++;
          setStatus();

          buttons.forEach((other, j) => {
            other.setAttribute('aria-disabled', 'true');
            other.classList.add('is-locked');
            const mark = choices[j].ok ? 'is-correct' : other === b ? 'is-wrong' : '';
            if (!mark) return;
            other.classList.add(mark);
            other.querySelector('.quiz-icon').textContent = choices[j].ok ? '✓' : '✗';
            other.querySelector('.quiz-tag').textContent = choices[j].ok ? 'Correct answer' : 'Your answer';
          });

          const verdict = make('p', 'quiz-verdict ' + (ok ? 'is-correct' : 'is-wrong'), ok ? '✓ Correct' : '✗ Wrong');
          live.replaceChildren(verdict);
          if (!ok) live.appendChild(make('p', 'quiz-explain', 'Correct answer: ' + q.c));
          if (q.e) live.appendChild(make('p', 'quiz-explain', q.e));

          const last = pos === order.length - 1;
          const next = button(last ? 'See result' : 'Next question', 'quiz-btn--primary', () => {
            if (last) finish();
            else { pos++; show(); }
          });
          actions.replaceChildren(next, button('Stop', '', finish));
          next.focus({ preventScroll: true });
          actions.scrollIntoView({ block: 'nearest' });
        }));

        body.replaceChildren(status, text, group);
        live.replaceChildren();
        actions.replaceChildren();
        text.focus();
      }

      intro();
    }

    quizzes.forEach(initQuiz);
  }
})();

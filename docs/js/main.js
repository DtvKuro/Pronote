(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // close when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const searchInput = document.getElementById('search');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();

      document.querySelectorAll('.category-section').forEach(section => {
        const cards = section.querySelectorAll('.card');
        let visibleCount = 0;

        cards.forEach(card => {
          const title = (card.getAttribute('data-title') || '').toLowerCase();
          const matches = title.includes(query);
          card.style.display = matches ? '' : 'none';
          if (matches) visibleCount++;
        });

        section.style.display = visibleCount === 0 ? 'none' : '';
      });
    });
  }

  // table of contents (note pages only)
  const noteContent = document.querySelector('.note-content');

  if (noteContent) {
    const headings = noteContent.querySelectorAll('h2, h3');

    if (headings.length > 0) {
      headings.forEach(heading => {
        if (!heading.id) {
          heading.id = slugify(heading.textContent);
        }
      });

      const toc = document.createElement('aside');
      toc.className = 'toc';

      const tocTitle = document.createElement('p');
      tocTitle.className = 'toc-title';
      tocTitle.textContent = 'On this page';
      toc.appendChild(tocTitle);

      const tocList = document.createElement('ul');
      tocList.className = 'toc-list';

      headings.forEach(heading => {
        const item = document.createElement('li');
        item.className = 'toc-item toc-item--' + heading.tagName.toLowerCase();

        const link = document.createElement('a');
        link.className = 'toc-link';
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;

        item.appendChild(link);
        tocList.appendChild(item);
      });

      toc.appendChild(tocList);
      noteContent.parentNode.insertBefore(toc, noteContent);

      const tocLinks = toc.querySelectorAll('.toc-link');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              tocLinks.forEach(l => l.classList.remove('toc-link--active'));
              const activeLink = toc.querySelector(
                '.toc-link[href="#' + entry.target.id + '"]'
              );
              if (activeLink) {
                activeLink.classList.add('toc-link--active');
              }
            }
          });
        },
        { rootMargin: '0px 0px -70% 0px', threshold: 0 }
      );

      headings.forEach(heading => {
        observer.observe(heading);
      });
    }
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.textContent = '↑';
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('back-to-top--visible');
    } else {
      backToTop.classList.remove('back-to-top--visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // notes sidebar
  const menuBtn = document.querySelector('.notes-menu-toggle');
  const menu = document.querySelector('.notes-menu');
  const overlay = document.querySelector('.notes-menu-overlay');
  const closeBtn = document.querySelector('.notes-menu-close');

  if (menuBtn && menu && overlay) {
    function openMenu() {
      menu.classList.add('is-open');
      overlay.classList.add('is-open');
      menuBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      overlay.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }

    menuBtn.addEventListener('click', openMenu);
    overlay.addEventListener('click', closeMenu);

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
})();

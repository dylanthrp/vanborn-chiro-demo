// Progressive enhancement only: navigation, source links and native FAQs work without JS.
(() => {
  const header = document.querySelector('header.top');
  const nav = document.querySelector('.topnav');
  if (header && nav) {
    document.documentElement.classList.add('enhanced');
    const offsets = () => {
      const sticky = getComputedStyle(header).position === 'sticky';
      document.documentElement.style.setProperty('--header-height', (sticky ? header.getBoundingClientRect().height : 0) + 'px');
      document.documentElement.style.setProperty('--nav-height', nav.getBoundingClientRect().height + 'px');
    };
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(offsets);
      observer.observe(header);
      observer.observe(nav);
    }
    window.addEventListener('resize', offsets);
    offsets();
  }
  const panel = document.querySelector('.library-search');
  if (!panel) return;
  const input = document.getElementById('library-search');
  const reset = document.getElementById('library-reset');
  const status = document.getElementById('library-results');
  const titles = [...document.querySelectorAll('.article-titles li')];
  const indexed = titles.map(element => ({element, text: element.textContent.toLocaleLowerCase()}));
  const filter = () => {
    const query = input.value.trim().toLocaleLowerCase();
    let visible = 0;
    for (const {element, text} of indexed) {
      element.hidden = !text.includes(query);
      if (!element.hidden) visible++;
    }
    status.textContent = visible ? `${visible} of ${titles.length} titles shown.` : 'No titles match. Try a different word or clear the search.';
  };
  input.addEventListener('input', filter);
  // Prevent Enter from implying a submission: there is deliberately no form/backend.
  input.addEventListener('keydown', event => { if (event.key === 'Enter') event.preventDefault(); });
  reset.addEventListener('click', () => { input.value = ''; filter(); input.focus(); });
  filter();
  panel.hidden = false;
})();

// Top-nav dropdowns: hover (desktop), tap (any), Esc to close.
// No-JS fallback: the dropdown <ul> is `display: none` by default in
// CSS and the trigger remains a real link, so the section page is
// always reachable. Sub-items are reachable through the section page.
(() => {
  const triggers = document.querySelectorAll('.has-dropdown');
  if (!triggers.length) return;
  const closeAll = () => {
    for (const wrap of triggers) {
      wrap.classList.remove('is-open');
      // Force-hide any hover-opened dropdown by clearing inline style
      const menu = wrap.querySelector('.dropdown');
      if (menu) menu.style.display = 'none';
      const trigger = wrap.querySelector('.topnav-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
  };
  for (const wrap of triggers) {
    const trigger = wrap.querySelector('.topnav-trigger');
    if (!trigger) continue;
    // Mark current section based on URL match
    try {
      const here = location.pathname.split('/').pop() || 'index.html';
      if (trigger.getAttribute('href') === here) {
        trigger.setAttribute('aria-current', 'page');
      }
    } catch {}
    trigger.setAttribute('aria-expanded', 'false');
    // Click toggles (works for both desktop click and mobile tap)
    trigger.addEventListener('click', (e) => {
      const isOpen = wrap.classList.contains('is-open');
      if (isOpen) {
        // Second click: let the browser follow the link, but close first
        closeAll();
        return;
      }
      e.preventDefault();
      closeAll();
      wrap.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    });
  }
  // Esc closes any open dropdown (including hover-opened)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
  // Click outside closes
  document.addEventListener('click', (e) => {
    for (const wrap of triggers) {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove('is-open');
        const menu = wrap.querySelector('.dropdown');
        if (menu) menu.style.display = '';
        const t = wrap.querySelector('.topnav-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    }
  });
})();

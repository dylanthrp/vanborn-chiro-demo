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

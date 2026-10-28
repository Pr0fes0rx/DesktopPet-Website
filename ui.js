(() => {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const KEY = 'desktoppet-site-theme';
  const lang = () => (root.lang === 'en' ? 'en' : 'ar');
  const LBL = {
    ar: { toDark: 'التبديل إلى الوضع الداكن', toLight: 'التبديل إلى الوضع الفاتح' },
    en: { toDark: 'Switch to dark mode', toLight: 'Switch to light mode' }
  };
  const meta = document.querySelector('meta[name="theme-color"]');
  const paint = () => {
    const dark = root.dataset.theme === 'dark';
    if (btn) {
      btn.setAttribute('aria-pressed', String(dark));
      btn.setAttribute('aria-label', LBL[lang()][dark ? 'toLight' : 'toDark']);
    }
    if (meta) meta.setAttribute('content', dark ? '#1a1224' : '#ffe3f1');
  };
  if (btn) btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.classList.add('theme-anim');
    root.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch (_) {}
    btn.classList.remove('spin'); void btn.offsetWidth; btn.classList.add('spin');
    paint();
    setTimeout(() => root.classList.remove('theme-anim'), 450);
  });
  new MutationObserver(paint).observe(root, { attributes: true, attributeFilter: ['lang'] });
  paint();

  // ripple on buttons
  const SEL = '.btn, .header-download, .language-btn, .theme-btn, .cta-github';
  document.addEventListener('pointerdown', e => {
    const b = e.target.closest(SEL);
    if (!b || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
    const s = document.createElement('span');
    s.className = 'ripple';
    s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    b.appendChild(s);
    setTimeout(() => s.remove(), 650);
  });
})();

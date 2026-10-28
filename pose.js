(() => {
  // Pose per interaction: hover / click / scroll / idle (AFK). Priority: click > scroll > hover > afk > default.
  const POSE = {
    idle: 'assets/1.webp',
    click: 'assets/2.webp',
    click2: 'assets/3.webp',
    click3: 'assets/5.webp',
    scroll: 'assets/3.webp',
    hover: 'assets/4.webp',
    afk: 'assets/5.webp'
  };
  const imgs = [...document.querySelectorAll('img[data-pet]')];
  if (!imgs.length) return;
  const art = document.querySelector('.hero-art');
  const AFK_MS = 7000, CLICK_MS = 1500, SCROLL_MS = 650;
  Object.values(POSE).forEach(src => { const i = new Image(); i.src = src; });

  const on = { click: false, scroll: false, hover: false, afk: false };
  let current = '', ready = false;
  const CLICKS = ['click', 'click2', 'click3'];
  let ci = 0;
  const pick = () => on.click ? on.click : on.scroll ? 'scroll' : on.hover ? 'hover' : on.afk ? 'afk' : 'idle';

  const render = () => {
    const p = pick();
    if (p === current) return;
    current = p;
    imgs.forEach(im => {
      im.src = POSE[p];
      im.dataset.pose = p;
      if (im.animate) im.animate(
        [{ opacity: .45, scale: '.93' }, { opacity: 1, scale: '1.04', offset: .6 }, { opacity: 1, scale: '1' }],
        { duration: 420, easing: 'cubic-bezier(.3,1.6,.5,1)' }
      );
    });
    if (art) art.dataset.petPose = p;
    if (ready && (p === 'hover' || p === 'afk')) document.dispatchEvent(new CustomEvent('petpose', { detail: p }));
  };
  let raf = 0;
  const set = (k, v) => { on[k] = v; cancelAnimationFrame(raf); raf = requestAnimationFrame(render); };

  // hover (mouse / pen) and tap
  let clickT = 0;
  imgs.forEach(im => {
    im.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch') set('hover', true); });
    im.addEventListener('pointerleave', () => set('hover', false));
    im.addEventListener('click', () => {
      set('click', CLICKS[ci++ % CLICKS.length]);
      clearTimeout(clickT); clickT = setTimeout(() => set('click', false), CLICK_MS);
    });
  });

  // scroll
  let scrollT = 0, lastY = scrollY;
  addEventListener('scroll', () => {
    if (Math.abs(scrollY - lastY) < 3) return;
    lastY = scrollY;
    set('scroll', true);
    clearTimeout(scrollT); scrollT = setTimeout(() => set('scroll', false), SCROLL_MS);
  }, { passive: true });

  // idle / AFK
  let afkT = 0;
  const wake = () => { if (on.afk) set('afk', false); clearTimeout(afkT); afkT = setTimeout(() => set('afk', true), AFK_MS); };
  ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart', 'wheel'].forEach(ev => addEventListener(ev, wake, { passive: true }));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });
  wake();
  render();
  ready = true;
})();

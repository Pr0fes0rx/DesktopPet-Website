(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let sound = true, ctx;
  const P = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.7]; // C major pentatonic-ish
  const rnd = () => P[Math.random() * P.length | 0];
  function n(f, { type = 'sine', dur = .25, vol = .09, to = 0, at = 0 } = {}) {
    if (!sound) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const t = ctx.currentTime + at, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur + .02);
    } catch (_) {}
  }
  const S = { // a different tune for each kind of element
    hero: () => [0, 2, 3, 5].forEach((k, i) => n(P[k], { at: i * .07, dur: .3 })),
    quick: () => n(700, { type: 'triangle', to: 300, dur: .16, vol: .12 }),
    chart: i => n(P[i % 7] / 2 * 2, { type: 'triangle', dur: .35, vol: .12 }),
    water: () => { n(400, { to: 900, dur: .14, vol: .1 }); n(500, { to: 1100, dur: .12, at: .1, vol: .08 }); },
    bell: () => { n(880, { dur: .6, vol: .08 }); n(1320, { dur: .5, at: .01, vol: .04 }); n(1760, { dur: .35, at: .02, vol: .03 }); },
    note: () => { n(1500, { type: 'square', dur: .04, vol: .03 }); n(1900, { type: 'square', dur: .04, at: .06, vol: .03 }); n(P[5], { at: .12, dur: .2 }); },
    prayer: i => { const f = [329.6, 392, 440, 493.9, 587.3][i % 5]; n(f, { dur: .9, vol: .1 }); n(f * 1.5, { dur: .8, at: .02, vol: .04 }); },
    shop: () => { n(988, { type: 'square', dur: .08, vol: .05 }); n(1319, { type: 'square', dur: .3, at: .08, vol: .05 }); },
    mascot: () => { [1318.5, 1568, 2093].forEach((f, i) => { n(f, { dur: .32, vol: .05, at: i * .09 }); n(f * 2, { dur: .18, vol: .012, at: i * .09 }); }); },
    swatch: i => n(P[i % 7], { type: 'triangle', dur: .3, vol: .12 }),
    on: () => { n(600, { dur: .1 }); n(900, { dur: .15, at: .08 }); },
    off: () => { n(900, { dur: .1 }); n(550, { dur: .15, at: .08 }); },
    tag: () => n(rnd(), { type: 'triangle', dur: .22, vol: .13 }),
    tap: () => n(rnd(), { type: 'sine', dur: .18, vol: .08 })
  };
  const spark = (e, ch = ['✨', '💜', '🌸', '⭐', '🎀']) => { if (reduce) return; for (let i = 0; i < 6; i++) { const s = document.createElement('span'); s.className = 'lv-spark'; s.textContent = ch[i % ch.length]; s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;--dx:${(Math.random() - .5) * 110}px`; document.body.appendChild(s); setTimeout(() => s.remove(), 950); } };
  const say = (e, txt) => { const b = document.createElement('div'); b.className = 'lv-bubble'; b.textContent = txt; b.style.cssText = `left:${e.clientX - 20}px;top:${e.clientY - 50}px`; document.body.appendChild(b); setTimeout(() => b.remove(), 1300); };
  const hit = (el, cls = 'pop') => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  const idx = (el) => [...el.parentNode.children].indexOf(el);
  const on = (sel, fn) => $$(sel).forEach(el => { el.tabIndex = el.tabIndex < 0 ? 0 : el.tabIndex; el.addEventListener('click', e => fn(e, el)); el.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); el.click(); } }); });

  /* default pluck on every link/button */
  document.addEventListener('pointerdown', e => { if (e.target.closest('a,button,.btn,.faq-list summary,details')) S.tap(); });

  /* hero */
  on('.focus-card', (e, el) => { S.hero(); spark(e, ['🍃', '✨']); });
  on('.mood-card', e => { S.hero(); spark(e, ['✨', '💖']); say(e, 'XP +10 ✨'); });
  const mascot = $('.mascot'); if (mascot) mascot.addEventListener('click', e => { S.mascot(); hit(mascot, 'hop'); say(e, ['ميو~ 💕', 'هلا! 🌸', 'Hi! ✨'][Math.random() * 3 | 0]); spark(e, ['💖', '✨']); });
  on('.quick-stat', (e, el) => { S.quick(); hit(el); spark(e, ['♡', '✨']); });

  /* reveal */
  const cards = $$('.feature-card');
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in-view'); io.unobserve(x.target); } }), { threshold: .25 });
  cards.forEach(c => { io.observe(c); c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px'); }); });
  $$('.step,.faq-section,.extras-section').forEach(e => { e.classList.add('reveal-up'); io.observe(e); });

  /* 04 chart (decorative values) */
  const mins = [74, 122, 96, 164, 114, 184, 138];
  $$('.chart-bars i').forEach((b, i) => { b.dataset.v = mins[i]; });
  on('.chart-bars i', (e, b) => { $$('.chart-bars i').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); S.chart(idx(b)); spark(e, ['✨']); });

  /* 05 / 06 */
  const heart = sel => $$(sel).forEach(r => { const c = document.createElement('i'); c.className = 'lv-check'; r.prepend(c); });
  heart('.reminder-list>div'); heart('.calendar-event');
  on('.reminder-list>div', (e, r) => { r.classList.toggle('done'); S.water(); spark(e, ['💧', '💙']); });
  on('.calendar-event', (e, r) => { r.classList.toggle('done'); S.bell(); spark(e, ['🔔', '✨']); });

  /* 07 */ on('.note-reminder', (e, el) => { S.note(); hit(el, 'pop'); spark(e, ['📝', '✨']); });
  on('.note-preview-head', e => { S.note(); spark(e, ['💡', '✨']); });
  /* 08 */ on('.prayer-preview>div', (e, el) => { S.prayer(idx(el)); hit(el, 'ring'); spark(e, ['🌙', '⭐']); });
  /* 09 */ on('.shop-preview>span', (e, el) => { $$('.shop-preview>span').forEach(x => x.classList.remove('eq')); el.classList.add('eq'); S.shop(); spark(e, ['🪙', '✨', '💖']); });

  /* extras mock (visual only) */
  const mock = $('.settings-mock');
  if (mock) {
    $$('.swatches i', mock).forEach(s => { s.style.color = getComputedStyle(s).backgroundColor; });
    on('.swatches i', (e, s) => { $$('.swatches i').forEach(x => x.classList.remove('on')); s.classList.add('on'); S.swatch(idx(s)); spark(e, ['✨']); });
    on('.setting-toggle-row', (e, r) => { const i = $('i', r); i.classList.toggle('toggle-on'); S[i.classList.contains('toggle-on') ? 'on' : 'off'](); });
    on('.settings-sidebar span', (e, s) => { $$('.settings-sidebar span').forEach(x => x.classList.remove('active')); s.classList.add('active'); S.tag(); });
    on('.language-select', () => S.tag());
  }
  on('.tag-row span', (e, el) => { S.tag(); spark(e, ['🌸', '✨']); });

  /* floating deco in features */
  const feat = $('#features'); if (feat && !reduce) { feat.style.position = 'relative'; ['✦', '♡', '✧', '☁', '♡', '✦'].forEach((c, i) => { const d = document.createElement('span'); d.className = 'lv-deco'; d.textContent = c; d.style.cssText = `top:${5 + i * 16}%;${i % 2 ? 'left' : 'right'}:${1 + (i * 3) % 5}%;--d:${6 + i}s;--s:${.9 + (i % 3) * .5}rem;color:${i % 2 ? 'var(--acc2)' : 'var(--acc)'}`; feat.appendChild(d); }); }
})();

(() => {
  const cfg = window.SITE_CONFIG || {};
  const art = document.querySelector('.hero-art');
  const mascot = art && art.querySelector('.mascot');
  if (!art || !mascot) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const L = () => (document.documentElement.lang === 'en' ? 'en' : 'ar');
  const T = {
    ar: { newK:'جديد في v1.2.1', newT:'ميزات جديدة تخلّي رفيقك أذكى 💖', n1T:'مراقبة النظام', n1D:'CPU وRAM وكرت الشاشة، ونافذة صغيرة تظهر عند تمرير الماوس عليها.', n2T:'سجل الحافظة', n2D:'آخر 30 نسخة نصية مع تثبيت وبحث، ويتجاهل كلمات سر مديري الباسوورد.', n3T:'ألعاب صغيرة', n3D:'Catch وJump وعدّاد النقرات، مع نقاط خبرة وأفضل نتيجة محفوظة.', n4T:'أصوات لكل حدث', n4D:'10 نغمات جاهزة أو ملفك الخاص، ونظام ساعة 12 أو 24.' },
    en: { newK:'New in v1.2.1', newT:'New features that make your pet smarter 💖', n1T:'System monitor', n1D:'CPU, RAM and GPU, with a small popup when you hover the pet.', n2T:'Clipboard history', n2D:'Last 30 text copies with pinning and search; password-manager content is skipped.', n3T:'Mini games', n3D:'Catch, Jump and a click counter, with XP and saved best scores.', n4T:'Sounds per event', n4D:'10 built-in tones or your own file, plus 12/24-hour clock.' }
  };
  const SAY = {
    ar: ['هلا! 💖', 'خلّينا نركّز سوا ✨', 'اشرب ماي! 💧', 'بوسة صغيرة 😚', 'أنت شاطر! 🌟', 'يلا استراحة؟ 🍡', 'أنا هون دايماً 🎀'],
    en: ['Hi hi! 💖', "Let's focus together ✨", 'Drink some water! 💧', 'Tiny kiss 😚', "You're doing great! 🌟", 'Break time? 🍡', "I'm always here 🎀"]
  };
  const POSE_SAY = {
    hover: { ar: 'ههه خجّلتيني 😳', en: 'Hehe, you made me blush 😳' },
    afk: { ar: 'وينك؟ ما بدك استراحة؟ 🍡', en: 'Where did you go? Break time? 🍡' }
  };
  const applyI18n = () => document.querySelectorAll('[data-x]').forEach(el => { const v = T[L()][el.dataset.x]; if (v) el.textContent = v; });
  new MutationObserver(applyI18n).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  const burst = (chars, n, x, y) => {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'fx';
      s.textContent = chars[(Math.random() * chars.length) | 0];
      s.style.left = x + (Math.random() * 40 - 20) + 'px';
      s.style.top = y + 'px';
      s.style.setProperty('--x', (Math.random() * 160 - 80) + 'px');
      s.style.setProperty('--y', -(80 + Math.random() * 120) + 'px');
      s.style.setProperty('--r', (Math.random() * 80 - 40) + 'deg');
      s.style.setProperty('--d', (1 + Math.random() * .9) + 's');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 2100);
    }
  };
  const center = () => { const r = mascot.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height * .2]; };

  const bubble = document.getElementById('cuteBubble');
  let bt;
  const say = (t) => { bubble.textContent = t; bubble.classList.add('on'); clearTimeout(bt); bt = setTimeout(() => bubble.classList.remove('on'), 2600); };
  const sayRandom = () => { const a = SAY[L()]; say(a[(Math.random() * a.length) | 0]); };

  mascot.addEventListener('click', () => {
    const [x, y] = center();
    burst(['💖', '✨', '🌸', '⭐'], 7, x, y + 80);
    sayRandom();
  });
  document.addEventListener('petpose', e => { const m = POSE_SAY[e.detail] && POSE_SAY[e.detail][L()]; if (m) say(m); });
  setInterval(() => { if (!document.hidden && !bubble.classList.contains('on')) sayRandom(); }, 9000);

  if (!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    let last = 0;
    addEventListener('pointermove', e => {
      const n = performance.now();
      if (n - last < 90) return;
      last = n;
      burst(['✦', '✧', '♡'], 1, e.clientX, e.clientY);
    }, { passive: true });
  }

  applyI18n();
  setTimeout(sayRandom, 1200);
})();

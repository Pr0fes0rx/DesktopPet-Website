(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('motion-ready');
  const targets = [
    '.hero-copy', '.hero-art', '.quick-stat', '.section-heading', '.feature-card',
    '.step', '.extras-copy', '.settings-mock', '.faq-list details', '.final-cta .cta-content'
  ].flatMap(selector => [...document.querySelectorAll(selector)]);
  targets.forEach((el, index) => {
    el.classList.add('motion-reveal');
    if (el.matches('.quick-stat, .feature-card, .step')) {
      el.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
    }
  });
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
  targets.forEach(el => observer.observe(el));

  // A restrained pointer parallax, limited to desktop devices with a fine pointer.
  const stage = document.querySelector('.hero-art');
  const figure = stage?.querySelector('.mascot');
  if (stage && figure && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    stage.addEventListener('pointermove', (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      figure.style.setProperty('--look-x', `${x * 4}px`);
      figure.style.setProperty('--look-y', `${y * 3}px`);
    }, { passive: true });
    stage.addEventListener('pointerleave', () => {
      figure.style.setProperty('--look-x', '0px');
      figure.style.setProperty('--look-y', '0px');
    }, { passive: true });
  }
})();

(() => {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('mobile-menu');

  // Sticky nav background
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    nav.classList.toggle('scrolled', open || window.scrollY > 20);
  };
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

  // Active nav link
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href')));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => s && spy.observe(s));

  // Reveal on scroll + counters
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      en.target.querySelectorAll('[data-count]').forEach(countUp);
      reveal.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

  function countUp(el) {
    const target = +el.dataset.count;
    const start = performance.now();
    const dur = 1200;
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Category card spotlight
  document.querySelectorAll('.cat').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  // Solutions tabs
  const tabs = [...document.querySelectorAll('.sol-tabs [role="tab"]')];
  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      const next = tabs[(i + dir + tabs.length) % tabs.length];
      select(next);
      next.focus();
    });
  });

  // Quote form → mailto
  const form = document.getElementById('quote-form');
  const note = form.querySelector('.form-note');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach((f) => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) { note.textContent = 'Please fill in your name, a valid email and project details.'; return; }
    const d = Object.fromEntries(new FormData(form));
    const body = `Name: ${d.name}\nCompany: ${d.company}\nEmail: ${d.email}\nRegion: ${d.region}\nInterested in: ${d.interest}\n\n${d.message}`;
    window.location.href = `mailto:sales@xtndconnect.com?subject=${encodeURIComponent('Quote request — ' + d.interest)}&body=${encodeURIComponent(body)}`;
    note.textContent = 'Opening your email app…';
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  // Hero fiber-light animation
  const canvas = document.querySelector('.hero-canvas');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canvas || reduce) return;
  const ctx = canvas.getContext('2d');
  let w, h, lines;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth; h = canvas.offsetHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lines = Array.from({ length: Math.round(w / 70) }, (_, i) => ({
      y: h * (0.15 + Math.random() * 0.8),
      amp: 20 + Math.random() * 60,
      freq: 0.002 + Math.random() * 0.003,
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 1.4,
      pulse: Math.random() * w,
      hue: i % 3 === 0 ? '25,227,177' : i % 3 === 1 ? '0,194,255' : '106,168,255',
    }));
  };
  resize();
  window.addEventListener('resize', resize);
  let visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(canvas);
  const yAt = (l, x, t) => l.y + Math.sin(x * l.freq + l.phase + t * 0.0003) * l.amp;
  const draw = (t) => {
    requestAnimationFrame(draw);
    if (!visible) return;
    ctx.clearRect(0, 0, w, h);
    lines.forEach((l) => {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 12) ctx.lineTo(x, yAt(l, x, t));
      ctx.strokeStyle = `rgba(${l.hue},.12)`;
      ctx.lineWidth = 1;
      ctx.stroke();
      l.pulse = (l.pulse + l.speed * 3) % (w + 200);
      const px = l.pulse - 100;
      // Light pulse travelling along the fiber: a short bright streak
      const tail = 140;
      const g = ctx.createLinearGradient(px - tail, 0, px, 0);
      g.addColorStop(0, `rgba(${l.hue},0)`);
      g.addColorStop(1, `rgba(${l.hue},.85)`);
      ctx.beginPath();
      for (let x = px - tail; x <= px; x += 6) ctx.lineTo(x, yAt(l, x, t));
      ctx.strokeStyle = g;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(px, yAt(l, px, t), 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${l.hue},1)`;
      ctx.fill();
    });
  };
  requestAnimationFrame(draw);
})();

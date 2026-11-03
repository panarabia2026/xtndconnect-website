/* Shared layout, data and behaviour for every page. */
(() => {
  const SITE = 'https://xtndconnect.com';
  const UP = SITE + '/wp-content/uploads';

  const ICONS = {
    fiber: '<path d="M3 12c4-6 14-6 18 0M3 12c4 6 14 6 18 0M12 6v12"/>',
    network: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8 7.5l3 8M16 7.5l-3 8M8.5 6h7"/>',
    panel: '<rect x="3" y="5" width="18" height="5" rx="1"/><rect x="3" y="14" width="18" height="5" rx="1"/><path d="M7 7.5h.01M10 7.5h.01M13 7.5h.01M7 16.5h.01M10 16.5h.01M13 16.5h.01"/>',
    copper: '<rect x="6" y="3" width="12" height="10" rx="1.5"/><path d="M9 13v4h6v-4M12 17v4M9 6v3M12 6v3M15 6v3"/>',
    rack: '<rect x="5" y="2.5" width="14" height="19" rx="1.5"/><path d="M8 7h8M8 11h8M8 15h8"/>',
    tool: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L3.5 17.5l3 3 5.7-5.7a4 4 0 0 0 5.3-5.3l-2.3 2.3-2.4-.6-.6-2.4z"/>',
    drum: '<circle cx="8" cy="15" r="5"/><circle cx="8" cy="15" r="1.5"/><path d="M13 15h8M17 11v8"/>',
    switch: '<rect x="2.5" y="8" width="19" height="8" rx="1.5"/><path d="M6 12h.01M9 12h.01M12 12h.01M17 12h2M7 8V5M17 8V5"/>',
    shield: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    chart: '<path d="M4 20h16M6 16V9M10 16V5M14 16v-6M18 16V7"/>',
    spark: '<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    handshake: '<path d="M8 12l3 3a2 2 0 0 0 3 0l5-5M3 8l4-3 5 3 5-3 4 3v5l-4 4M3 8v5l4 4"/>',
    truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
    cert: '<circle cx="12" cy="9" r="6"/><path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;
  const arrow = '<svg class="arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const CATEGORIES = [
    { slug: 'fiber-cables', name: 'Fiber Optic Cables', icon: 'fiber', desc: 'Armored, breakout, drop, loose-tube and distribution cables for indoor and outdoor plant.' },
    { slug: 'fiber-networking', name: 'Fiber Networking', icon: 'network', desc: 'MTP®/MPO trunks and harnesses, patch cords, pigtails and adaptors.' },
    { slug: 'panels', name: 'Panels & Enclosures', icon: 'panel', desc: 'Rack, wall and DIN-rail patch panels, ATEX enclosures and splice closures.' },
    { slug: 'copper', name: 'Copper Systems', icon: 'copper', desc: 'Cat6, 6A, 7 and 7A LSZH cable, patch cords and pre-terminated trunks.' },
    { slug: 'racks', name: 'Racks & Cabinets', icon: 'rack', desc: 'Floor-standing, wall-mount, ONU, seismic and IP55 cabinets plus accessories.' },
    { slug: 'tools', name: 'Testers & Tools', icon: 'tool', desc: 'Core-to-core fusion splicers, fiber testers, cleaners and termination tools.' },
    { slug: 'laying', name: 'Cable Laying Equipment', icon: 'drum', desc: 'Cable pulling winches, drum trailers, rollers and duct accessories.' },
    { slug: 'active', name: 'Active Components', icon: 'switch', desc: 'Switches, media converters, transceivers, PoE and wireless access points.' },
  ];

  const PRODUCTS = (window.XTND_PRODUCTS || []);
  const catBySlug = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));
  const countIn = (slug) => PRODUCTS.filter((p) => p.cat === slug).length;

  const PAGES = [
    ['index.html', 'Home'], ['products.html', 'Products'], ['solutions.html', 'Solutions'],
    ['catalogs.html', 'Catalogs'], ['resources.html', 'Resources'], ['partners.html', 'Partners'],
    ['about.html', 'About'], ['contact.html', 'Contact'],
  ];
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isHere = (href) => href === here || (here === '' && href === 'index.html');

  const OFFICES = [
    ['Canada', '+1 (647) 780 0004', '+16477800004'],
    ['United Kingdom', '+44 7445 867830', '+447445867830'],
    ['UAE', '+971 55 299 7862', '+971552997862'],
    ['USA', '+1 (630) 885 6678', '+16308856678'],
  ];

  const brand = `<a href="index.html" class="brand" aria-label="XTND Connect home">
      <span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M4 6l10 10L4 26M28 6L18 16l10 10" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      <span class="brand-text">XTND<span>Connect</span></span></a>`;

  function renderHeader() {
    const links = PAGES.slice(1).map(([h, t]) => `<a href="${h}"${isHere(h) ? ' aria-current="page"' : ''}>${t}</a>`).join('');
    const header = document.createElement('header');
    header.className = 'nav' + (document.body.dataset.nav === 'solid' ? ' solid' : '');
    header.innerHTML = `
      <div class="container nav-inner">
        ${brand}
        <nav class="nav-links" aria-label="Primary">${links}</nav>
        <div class="nav-cta">
          <a class="btn btn-primary" href="contact.html#quote">Request a Quote</a>
        </div>
        <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
      </div>
      <div class="mobile-menu" id="mobile-menu" hidden>
        ${PAGES.map(([h, t]) => `<a href="${h}"${isHere(h) ? ' aria-current="page"' : ''}>${t}</a>`).join('')}
        <a class="btn btn-primary" href="contact.html#quote">Request a Quote</a>
      </div>`;
    document.body.prepend(header);
    const skip = document.createElement('a');
    skip.className = 'skip'; skip.href = '#main'; skip.textContent = 'Skip to content';
    document.body.prepend(skip);

    const toggle = header.querySelector('.nav-toggle');
    const menu = header.querySelector('.mobile-menu');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20 || !menu.hidden);
    const setMenu = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.hidden = !open;
      onScroll();
    };
    toggle.addEventListener('click', () => setMenu(menu.hidden));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); } });
    window.addEventListener('resize', () => { if (window.innerWidth > 1100 && !menu.hidden) setMenu(false); });
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function renderFooter() {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
      <div class="container footer-grid">
        <div>
          ${brand}
          <p class="footer-tag">Fiber, copper and enclosure infrastructure — where connectivity matters.</p>
          <div class="footer-contact">
            <a href="mailto:sales@xtndconnect.com">sales@xtndconnect.com</a>
            <a href="tel:+16477800004">+1 (647) 780 0004</a>
          </div>
        </div>
        <div>
          <h4>Products</h4>
          ${CATEGORIES.slice(0, 5).map((c) => `<a href="products.html?cat=${c.slug}">${c.name}</a>`).join('')}
        </div>
        <div>
          <h4>Company</h4>
          <a href="about.html">About Us</a>
          <a href="solutions.html">Solutions</a>
          <a href="partners.html">Partner Program</a>
          <a href="catalogs.html">Catalogs</a>
          <a href="resources.html">Resources</a>
        </div>
        <div>
          <h4>Support</h4>
          <a href="contact.html">Contact Us</a>
          <a href="contact.html#quote">Request a Quote</a>
          <a href="${UP}/2024/07/Customer-Feedback-Form-1.pdf" target="_blank" rel="noopener">Customer Feedback Form</a>
          <a href="${SITE}/terms-and-conditions/" target="_blank" rel="noopener">Terms &amp; Conditions</a>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>© ${new Date().getFullYear()} XTND Connect. All rights reserved.</span>
        <a href="#top">Back to top ↑</a>
      </div>`;
    document.body.append(footer);
    document.body.id = document.body.id || 'top';
  }

  /* ---------- Products ---------- */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function productCard(p, opts = {}) {
    const cat = catBySlug[p.cat];
    return `<button class="prod${opts.reveal ? ' reveal' : ''}" type="button" data-pid="${p.id}" ${opts.d ? `style="--d:${opts.d}s"` : ''}>
      <div class="prod-img"><img loading="lazy" src="${p.img}" alt="${esc(p.name)}" width="720" height="720" />${opts.badge ? `<span class="badge">${opts.badge}</span>` : ''}</div>
      <div class="prod-body">
        <span class="prod-cat">${esc(p.sub || (cat && cat.name))}</span>
        <h3>${esc(p.name)}</h3>
        <span class="more">View details <i>→</i></span>
      </div>
    </button>`;
  }

  let modal;
  function openProduct(id, trigger) {
    const p = PRODUCTS.find((x) => String(x.id) === String(id));
    if (!p) return;
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal'; modal.hidden = true;
      modal.innerHTML = `<div class="modal-backdrop" data-close></div>
        <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button class="modal-close" data-close aria-label="Close"><svg viewBox="0 0 20 20"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
          <div class="modal-img"><img alt="" /></div>
          <div class="modal-body"></div>
        </div>`;
      document.body.append(modal);
      modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'Tab') {
          const f = [...modal.querySelectorAll('a, button')];
          if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
          else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
        }
      });
    }
    const cat = catBySlug[p.cat];
    modal.querySelector('.modal-img img').src = p.img;
    modal.querySelector('.modal-img img').alt = p.name;
    const subject = encodeURIComponent('Quote request — ' + p.name);
    modal.querySelector('.modal-body').innerHTML = `
      <span class="prod-cat">${esc(cat ? cat.name : '')}</span>
      <h2 id="modal-title">${esc(p.name)}</h2>
      <div class="modal-tags">${p.sub ? `<span>${esc(p.sub)}</span>` : ''}<span>Custom builds available</span></div>
      <p>${esc(p.desc || 'Contact our team for full specifications, configuration options and pricing.')}</p>
      <div class="modal-actions">
        <a class="btn btn-primary" href="contact.html?product=${encodeURIComponent(p.name)}#quote">Request a quote ${arrow}</a>
        <a class="btn btn-outline" href="${p.url}" target="_blank" rel="noopener">Full specifications</a>
      </div>
      <a class="more" href="mailto:sales@xtndconnect.com?subject=${subject}">or email sales@xtndconnect.com <i>→</i></a>`;
    modal._trigger = trigger;
    modal.hidden = false;
    document.body.classList.add('lock');
    modal.querySelector('.modal-close').focus();
  }
  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('lock');
    if (modal._trigger) modal._trigger.focus();
  }
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-pid]');
    if (card) openProduct(card.dataset.pid, card);
  });

  /* ---------- Reveal + counters ---------- */
  function observeReveals(root = document) {
    const io = observeReveals.io || (observeReveals.io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        en.target.querySelectorAll('[data-count]').forEach(countUp);
        observeReveals.io.unobserve(en.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }));
    root.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
  }
  function countUp(el) {
    const target = +el.dataset.count;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min((t - start) / 1100, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + (el.dataset.suffix || '');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Tabs (any [role=tablist]) ---------- */
  function initTabs(root = document) {
    root.querySelectorAll('[role="tablist"]').forEach((list) => {
      const tabs = [...list.querySelectorAll('[role="tab"]')];
      const select = (tab) => tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => select(tab));
        tab.addEventListener('keydown', (e) => {
          const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!dir) return;
          const next = tabs[(i + dir + tabs.length) % tabs.length];
          select(next); next.focus();
        });
      });
    });
  }

  /* ---------- Forms → pre-filled email ---------- */
  function initForms() {
    document.querySelectorAll('form[data-mailto]').forEach((form) => {
      const note = form.querySelector('.form-note');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let ok = true;
        form.querySelectorAll('[required]').forEach((f) => {
          const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
          f.classList.toggle('invalid', bad);
          if (bad) ok = false;
        });
        if (!ok) { note.textContent = 'Please complete the highlighted fields.'; form.querySelector('.invalid').focus(); return; }
        const fields = [...new FormData(form)].filter(([, v]) => String(v).trim());
        const body = fields.map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)}: ${v}`).join('\n');
        const subject = form.dataset.subject + (form.elements.interest ? ' — ' + form.elements.interest.value : '');
        window.location.href = `mailto:sales@xtndconnect.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        note.textContent = 'Opening your email app with your request…';
      });
      form.querySelectorAll('[required]').forEach((f) => f.addEventListener('input', () => f.classList.remove('invalid')));
    });
  }

  window.XTND = { SITE, UP, CATEGORIES, PRODUCTS, OFFICES, catBySlug, countIn, icon, arrow, esc, productCard, openProduct, observeReveals, initTabs };

  document.documentElement.classList.remove('no-js');
  renderHeader();
  renderFooter();
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon); });
    document.querySelectorAll('[data-offices]').forEach((ul) => {
      ul.innerHTML = OFFICES.map(([r, label, tel]) => `<li><span>${r}</span><a href="tel:${tel}">${label}</a></li>`).join('');
    });
    initTabs();
    initForms();
    observeReveals();
  });
  // Content is rendered by script, so re-apply the URL hash once layout has settled.
  window.addEventListener('load', () => {
    const target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) setTimeout(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }), 0);
  });
})();

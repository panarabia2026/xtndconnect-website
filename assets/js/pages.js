/* Page-specific rendering. Each block runs only if its container exists. */
(() => {
  const { UP, CATEGORIES, PRODUCTS, catBySlug, countIn, icon, arrow, esc, productCard, observeReveals } = window.XTND;
  const $ = (s, r = document) => r.querySelector(s);
  const byId = (id) => PRODUCTS.find((p) => String(p.id) === String(id));

  /* ---------- Documents (catalogs & resources) ---------- */
  const DOCS = {
    catalogs: [
      { t: 'Fiber Optic Catalogue', d: 'Complete fiber optic range — cables, connectivity, panels and closures.', f: '2024/01/XTND-FIBER-OPTIC-Catalogue-mini.pdf', c: 'Fiber', i: 'fiber' },
      { t: 'Cabinet Catalogue', d: 'Floor-standing, wall-mount, ONU and outdoor cabinets with accessories.', f: '2024/01/XTND-Cabinet-Catalogue-mini.pdf', c: 'Racks', i: 'rack', k: 'c2' },
      { t: 'Data Center Copper Networks', d: 'Category 6 to 7A cabling, patch cords and pre-terminated copper.', f: '2024/07/Data-Center-Copper-Networks-Catalouge-EN-1-1.pdf', c: 'Copper', i: 'copper', k: 'c3' },
      { t: 'Patch Panel Catalogue', d: 'Rack-mount, wall-mount and DIN-rail fiber patch panels.', f: '2024/07/XTND-Connect-Patch-Panel-1.pdf', c: 'Panels', i: 'panel', k: 'c4' },
      { t: 'Fiber Optic Enclosures', d: 'Outdoor joint enclosures and splice closures for OSP networks.', f: '2023/08/Fiber-Optic-Enclousers-Correct-V4.pdf', c: 'Enclosures', i: 'layers', k: 'c2' },
      { t: 'Fiber Raceway Solution', d: 'Fiber routing and raceway systems for clean, protected pathways.', f: '2024/07/Fiber-Raceway-Solution.pdf', c: 'Pathways', i: 'network', k: 'c3' },
      { t: 'Fiber Optic Data Sheet', d: 'Technical data for XTND fiber optic cable constructions.', f: '2023/08/Fiber-Optic-Data-Sheet.pdf', c: 'Data sheet', i: 'doc', k: 'c4' },
      { t: 'Product Data Sheet', d: 'Specifications and ordering information (August 2023 edition).', f: '2023/08/Data-Sheet-2-copy-August-09-2023.pdf', c: 'Data sheet', i: 'doc' },
      { t: 'XTND Company Brochure', d: 'Who we are, what we make and the markets we serve.', f: '2023/08/XTND-brochure.pdf', c: 'Brochure', i: 'globe', k: 'c2' },
    ],
    certs: [
      { t: 'ISO 9001', d: 'Quality Management System', f: '2024/07/XTND-CONNECT-LTD-ISO-9001.pdf', n: '9001' },
      { t: 'ISO 14001', d: 'Environmental Management System', f: '2024/07/XTND-CONNECT-LTD-14001.pdf', n: '14001' },
      { t: 'ISO 45001', d: 'Occupational Health & Safety', f: '2024/07/XTND-CONNECT-LTD-45001.pdf', n: '45001' },
    ],
    tds: [
      { g: 'Fiber Patch Cords & Pigtails', p: 'Technical data sheets for single-mode and multimode patch cords and pigtails.', items: [
        ['Fiber Optic Pigtails (SM / MM)', '2024/10/Fiber-Optic-Pigtails-SM-MM.pdf'],
        ['Duplex Single-Mode Patch Cord', '2024/10/Duplex-Single-Mode-Patch-Cord-XTND-1.pdf'],
        ['OM4 Multimode Patch Cords', '2024/10/XTND-OM4-Patch-Cords.pdf'],
        ['Fiber Optic Catalog', '2024/07/Fiber-Optic-Catalog-1.pdf'],
      ] },
      { g: 'Fiber Patch Panels & Cabinets', p: 'Rack-mount, wall-mount and DIN-rail panels supporting SC, LC, ST and FC in simplex or duplex.', items: [
        ['Rack Mount Patch Panels', '2024/10/Fiber-Optic-Rack-Mount-Patch-Panels.pdf'],
        ['LIU DIN Rail 6 / 12 Port Panel', '2024/10/LIU-Din-Rail-6-12-Port-Panel.pdf'],
        ['DIN Rail Compact Patch Panel', '2024/10/DIN-rail-Compact-Patch-Panel-1.pdf'],
        ['Fiber Optic Patch Panel Catalog', '2024/10/Fiber-Optic-Patch-Panel-Catalog.pdf'],
        ['Cabinet Catalogue', '2024/10/XTND-Cabinet-Catalogue-mini-1.pdf'],
      ] },
      { g: 'Fiber Joint Enclosures', p: 'IP68-rated inline and dome enclosures for direct burial, 24F to 288F, with mechanical splicing kits.', items: [
        ['Dome Closure 144F', '2023/10/Dome-Closure-144F-1.pdf'],
        ['XTND-403A Installation Manual', '2023/12/XTND-403A-manual.pdf'],
        ['XTND-506A Installation Manual', '2023/12/XTND-506A-manual.pdf'],
        ['Mechanical Sealing IP Joint Enclosure', '2024/10/XTND-Mechanical-Sealing-IP-Fiber-Optic-Joint-Enclosure-Datasheet-1.pdf'],
      ] },
      { g: 'Copper Networking', p: 'High-performance Ethernet cables, panels and connectors for reliable data transmission.', items: [
        ['All Copper Cable Categories', '2024/10/All-Copper-Cable-Categories.pdf'],
      ] },
      { g: 'Forms & Agreements', p: 'Partner and customer paperwork.', items: [
        ['Distribution Agreement', '2024/07/Distribution_Agreement.pdf'],
        ['Customer Feedback Form', '2024/07/Customer-Feedback-Form-1.pdf'],
      ] },
    ],
  };
  const pdf = (f) => `${UP}/${f}`;
  const dlRow = ([t, f]) => `<a class="dl-row" href="${pdf(f)}" target="_blank" rel="noopener">
      <span class="ico">${icon('doc')}</span>
      <span><strong>${esc(t)}</strong><small>PDF document</small></span>
      <span class="more">Download <i>↓</i></span></a>`;

  /* ---------- Home: categories ---------- */
  const catGrid = $('#cat-grid');
  if (catGrid) {
    catGrid.innerHTML = CATEGORIES.map((c, i) => {
      const n = countIn(c.slug);
      return `<a class="cat reveal" style="--d:${(i % 4) * 0.05}s" href="products.html?cat=${c.slug}">
        <div class="cat-top"><span class="ico">${icon(c.icon)}</span><span class="count">${n ? n + ' products' : 'On request'}</span></div>
        <h3>${c.name}</h3><p>${c.desc}</p><span class="more">Browse <i>→</i></span></a>`;
    }).join('');
  }
  const proof = $('#proof-products');
  if (proof) proof.textContent = PRODUCTS.length + '+';

  /* ---------- Tiles (solution product previews) ---------- */
  document.querySelectorAll('[data-tiles]').forEach((el) => {
    el.innerHTML = el.dataset.tiles.split(',').map(byId).filter(Boolean).map((p) =>
      `<button type="button" class="tile" data-pid="${p.id}" aria-label="${esc(p.name)}"><img loading="lazy" src="${p.img}" alt="" /><span>${esc(p.name)}</span></button>`).join('');
  });

  /* ---------- Featured ---------- */
  const featured = $('#featured');
  if (featured) {
    const ids = [4622, 4611, 4468, 3905, 4117, 3910, 3875, 3494];
    featured.innerHTML = ids.map(byId).filter(Boolean)
      .map((p, i) => productCard(p, { reveal: true, d: (i % 4) * 0.05, badge: i < 2 ? 'New' : '' })).join('');
  }

  /* ---------- Certifications ---------- */
  const certs = $('#certs');
  if (certs) {
    certs.innerHTML = DOCS.certs.map((c, i) => `<a class="cert reveal" style="--d:${i * 0.05}s" href="${pdf(c.f)}" target="_blank" rel="noopener">
      <span class="cert-seal"><span>ISO<br>${c.n}</span></span>
      <span><h3>${c.t}</h3><p>${c.d}</p><span class="more">View certificate <i>→</i></span></span></a>`).join('');
  }

  /* ---------- Catalog downloads ---------- */
  const dlGrid = $('#dl-catalogs');
  if (dlGrid) {
    dlGrid.innerHTML = DOCS.catalogs.map((d, i) => `<a class="dl reveal" style="--d:${(i % 3) * 0.05}s" href="${pdf(d.f)}" target="_blank" rel="noopener">
      <div class="dl-cover ${d.k || ''}"><span class="ico">${icon(d.i)}</span><small>${d.c} · PDF</small></div>
      <div class="dl-body"><h3>${d.t}</h3><p>${d.d}</p><span class="more">Download <i>↓</i></span></div></a>`).join('');
  }

  /* ---------- Resources ---------- */
  const res = $('#resources');
  if (res) {
    res.innerHTML = DOCS.tds.map((g) => `<div class="res-group reveal">
      <div><h3>${g.g}</h3><p>${g.p}</p></div>
      <div class="dl-list">${g.items.map(dlRow).join('')}</div></div>`).join('');
  }

  /* ---------- Solutions page: section nav highlight ---------- */
  const solNav = $('.sol-nav');
  if (solNav) {
    const links = [...solNav.querySelectorAll('a')];
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle('active', a.hash === '#' + en.target.id));
    }), { rootMargin: '-40% 0px -55% 0px' });
    links.forEach((a) => { const s = document.querySelector(a.hash); if (s) io.observe(s); });
  }

  /* ---------- Contact: prefill product ---------- */
  const msg = $('#quote textarea[name="message"]');
  const product = new URLSearchParams(location.search).get('product');
  if (msg && product) {
    msg.value = `I'd like a quote for: ${product}\n\nQuantity: \nRequired by: `;
  }

  /* ---------- Products catalog ---------- */
  const catalog = $('#catalog');
  if (catalog) {
    const params = new URLSearchParams(location.search);
    const state = { cat: catBySlug[params.get('cat')] ? params.get('cat') : 'all', sub: params.get('sub') || 'all', q: params.get('q') || '', sort: 'featured' };
    const grid = $('#grid'), chips = $('#chips'), meta = $('#result-meta'), filters = $('#filters'), search = $('#search'), sortSel = $('#sort'), mobileCat = $('#mobile-cat'), title = $('#cat-title'), desc = $('#cat-desc');
    search.value = state.q;

    const catBtn = (slug, name, n) => `<button class="filter-btn" data-cat="${slug}" aria-pressed="false">${name}<small>${n}</small></button>`;
    filters.innerHTML = '<h4>Categories</h4>' + catBtn('all', 'All products', PRODUCTS.length) + CATEGORIES.map((c) => catBtn(c.slug, c.name, countIn(c.slug) || '—')).join('');
    mobileCat.innerHTML = `<option value="all">All products (${PRODUCTS.length})</option>` + CATEGORIES.map((c) => `<option value="${c.slug}">${c.name} (${countIn(c.slug)})</option>`).join('');

    const render = () => {
      filters.querySelectorAll('[data-cat]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === state.cat)));
      mobileCat.value = state.cat;
      const cat = catBySlug[state.cat];
      title.textContent = cat ? cat.name : 'All products';
      desc.textContent = cat ? cat.desc : 'Browse the complete XTND Connect range of fiber, copper, enclosure and rack infrastructure.';

      const inCat = PRODUCTS.filter((p) => state.cat === 'all' || p.cat === state.cat);
      const subs = state.cat === 'all' ? [] : [...new Set(inCat.map((p) => p.sub).filter(Boolean))].sort();
      if (!subs.includes(state.sub)) state.sub = 'all';
      chips.innerHTML = subs.length > 1 ? [`<button class="chip" data-sub="all" aria-pressed="${state.sub === 'all'}">All</button>`]
        .concat(subs.map((s) => `<button class="chip" data-sub="${esc(s)}" aria-pressed="${state.sub === s}">${esc(s)}</button>`)).join('') : '';
      chips.hidden = subs.length <= 1;

      // Normalise so "cat6a", "Cat.6A" and "Category 6A" all match.
      const norm = (s) => String(s || '').toLowerCase().replace(/category/g, 'cat').replace(/[\s.\-_/®]+/g, '');
      const q = norm(state.q);
      let list = inCat.filter((p) => (state.sub === 'all' || p.sub === state.sub) &&
        (!q || norm(p.name + ' ' + p.sub).includes(q) || norm(p.desc).includes(q)));
      if (state.sort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
      if (state.sort === 'za') list = [...list].sort((a, b) => b.name.localeCompare(a.name));

      meta.textContent = `${list.length} ${list.length === 1 ? 'product' : 'products'}`;
      if (list.length) {
        grid.innerHTML = list.map((p) => productCard(p)).join('');
      } else {
        const onRequest = cat && !countIn(cat.slug);
        grid.innerHTML = `<div class="empty" style="grid-column:1/-1">
          <h3>${onRequest ? `${cat.name} are available on request` : 'No products match your search'}</h3>
          <p>${onRequest ? 'Tell us what you need and our team will source and configure it for your project.' : 'Try a different keyword or category — or ask our engineers directly.'}</p>
          <a class="btn btn-primary" href="contact.html?product=${encodeURIComponent(cat ? cat.name : state.q)}#quote">Ask our team ${arrow}</a></div>`;
      }

      const u = new URLSearchParams();
      if (state.cat !== 'all') u.set('cat', state.cat);
      if (state.sub !== 'all') u.set('sub', state.sub);
      if (state.q) u.set('q', state.q);
      history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : ''));
    };

    filters.addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (!b) return; state.cat = b.dataset.cat; state.sub = 'all'; render(); });
    mobileCat.addEventListener('change', () => { state.cat = mobileCat.value; state.sub = 'all'; render(); });
    chips.addEventListener('click', (e) => { const b = e.target.closest('[data-sub]'); if (!b) return; state.sub = b.dataset.sub; render(); });
    let t;
    search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = search.value; render(); }, 120); });
    sortSel.addEventListener('change', () => { state.sort = sortSel.value; render(); });
    render();

    const pid = params.get('id');
    if (pid) window.XTND.openProduct(pid);
  }

  observeReveals();
})();

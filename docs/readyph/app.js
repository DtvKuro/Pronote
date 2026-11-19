/* ReadyPH prototype logic. Plain JS, no build step, no network. All data is mocked (see data.js). */
(function () {
  'use strict';

  const READY = window.READY;
  const you = READY.you;

  /* ---------- small helpers ---------- */
  const $ = (sel, el) => (el || document).querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const buzz = (pattern) => { try { if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(pattern); } catch (e) { /* haptics are optional */ } };

  /* ---------- persisted state (one source of truth) ---------- */
  const KEY = 'readyph.v1';
  const defaults = {
    settings: { lang: 'en', textSize: 'normal', contrast: false, offline: false },
    onboarded: false,
    recentId: null
  };
  const store = loadStore();

  function loadStore() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { saved = {}; }
    return {
      settings: Object.assign({}, defaults.settings, saved.settings),
      onboarded: !!saved.onboarded,
      recentId: saved.recentId || null
    };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* private mode: keep going in memory */ } }

  /* ---------- session state (not persisted) ---------- */
  const ui = {
    route: null, hash: '', navCount: 0, timers: [], allowLeave: false,
    filters: new Set(), mapMode: 'map', pinId: null, sheetAnim: false, mv: null,
    nearestReady: false, focusOnce: false, originTab: 'home',
    shareId: null, shareText: '', shareDirty: false,
    obStep: 0, loc: false, dl: { state: 'idle', pct: 0 }
  };
  let nav = null; // active navigation: { id, prog, step, n }
  const BOOT = Date.now();

  /* ---------- i18n ---------- */
  const lang = () => store.settings.lang;
  function t(key, vars) {
    const dict = READY.i18n;
    let s = dict[lang()][key];
    if (s === undefined) s = dict.en[key];
    if (s === undefined) s = key;
    return vars ? s.replace(/\{(\w+)\}/g, (_, n) => (vars[n] !== undefined ? vars[n] : '')) : s;
  }
  const L = (obj) => obj[lang()] || obj.en;
  const tipOf = (c) => (lang() === 'fil' && c.tipFil) || c.tip;
  const brgyOf = (c) => 'Brgy. ' + c.brgy;

  /* ---------- derived center data ---------- */
  const statusOf = (cur, max) => (cur >= max ? 'full' : cur / max >= 0.85 ? 'almost' : 'available');
  const offline = () => store.settings.offline;

  function viewOf(c) {
    const current = c.current;
    const updatedAt = BOOT - c.updatedMins * 60000;
    const offlineShift = offline() ? 120 : 0; // the saved copy is about 2h older than live data
    const age = Math.max(0, Math.round((Date.now() - updatedAt) / 60000)) + offlineShift;
    const pct = Math.min(100, Math.round((current / c.max) * 100));
    return Object.assign({}, c, { current, age, pct, left: Math.max(0, c.max - current), status: statusOf(current, c.max) });
  }
  const all = () => READY.centers.map(viewOf).sort((a, b) => a.km - b.km);
  const byId = (id) => { const c = READY.centers.find((x) => x.id === id); return c ? viewOf(c) : null; };
  const walkMin = (km) => Math.max(1, Math.round(km * 13));

  /* What the family needs: the facility filters picked on the Map (none by default). */
  const needs = () => [...ui.filters];
  /* Nearest center with space that has every needed facility. If none does, fall back to the nearest with space and say so. */
  function pickSafe(excludeId) {
    const want = needs();
    const open = all().filter((v) => v.status !== 'full' && v.id !== excludeId);
    const strict = want.length ? open.find((v) => want.every((f) => v.fac.includes(f))) : null;
    if (!want.length) return { v: open[0] || null, want, relaxed: false };
    if (strict) return { v: strict, want, relaxed: false };
    return { v: open[0] || null, want, relaxed: true };
  }

  function fmtAge(m) {
    if (m < 1) return t('justNow');
    return t('ago', { x: m < 60 ? m + ' min' : Math.floor(m / 60) + 'h' });
  }

  /* ---------- UI building blocks ---------- */
  const ic = (name, cls) => `<svg class="ic ${cls || ''}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
  const ST = { available: { icon: 'check-circle', cls: 'st-ok', glyph: 'check' }, almost: { icon: 'alert', cls: 'st-warn', glyph: 'alert' }, full: { icon: 'x-circle', cls: 'st-bad', glyph: 'x' } };
  const FAC = { pwd: { icon: 'wheelchair' }, medical: { icon: 'medical' }, pets: { icon: 'paw' }, food: { icon: 'drop' } };

  /* Status badge. Offline, capacity is labelled as a stale snapshot ("Had space 2h ago"), never as live fact. */
  function badge(v) {
    if (offline()) {
      return `<span class="badge st-stale">${ic('clock')}<span>${t(v.status === 'full' ? 'st.wasFull' : 'st.hadSpace', { x: fmtAge(v.age) })}</span></span>`;
    }
    return `<span class="badge ${ST[v.status].cls}">${ic(ST[v.status].icon)}<span>${t('st.' + v.status)}</span></span>`;
  }

  const spacesLeft = (v) => (v.status === 'almost' ? t('st.leftOf', { n: v.left, max: v.max }) : t('st.left', { n: v.left }));

  function bar(v, big) {
    const cls = offline() ? 'st-stale' : ST[v.status].cls;
    return `<div class="bar ${big ? 'bar-big' : ''}" role="img" aria-label="${t('bar.aria', { cur: v.current, max: v.max, pct: v.pct })}"><span class="bar-fill ${cls}" style="width:${v.pct}%"></span></div>`;
  }

  const freshLine = (list) => {
    const age = Math.max.apply(null, list.map((v) => v.age));
    return `<p class="caption">${offline() ? t('list.freshOff', { x: fmtAge(age) }) : t('list.fresh', { x: fmtAge(age) })}</p>`;
  };

  /* One list row for every center list (Home, List view, Nearest). */
  function centerRow(v) {
    const meta = [v.km + ' km', walkMin(v.km) + ' min'];
    if (!offline() && v.status !== 'full') meta.push(t('st.spaces', { n: v.left }));
    return `<a class="row center-row" href="#/center/${v.id}" data-k="card-${v.id}">
      <span class="row-main"><span class="row-title">${esc(v.name)}</span>
        <span class="row-sub"><span class="meta">${meta.join(' · ')}</span>${badge(v)}</span></span></a>`;
  }

  function header(title, opts) {
    const o = opts || {};
    return `<header class="head ${o.cls || ''}">
      ${o.back ? `<button class="icon-btn" data-act="back" data-fallback="${o.back}" aria-label="${t('back')}" data-k="back">${ic('back')}</button>` : ''}
      <h1 class="${o.root ? 'h-d' : 'h-t'}" tabindex="-1">${title}</h1>
      ${o.extra || ''}
    </header>`;
  }

  /* ---------- real map: simplified OpenStreetMap extract (mapdata.js), drawn offline as SVG ---------- */
  const MD = window.MAPDATA;
  /* project(lat, lon) -> [x, y] in map meters. The one lat/lon -> map conversion; every position goes through it. */
  const project = MD.project;
  const place = (o) => { const p = project(o.lat, o.lon); o.x = p[0]; o.y = p[1]; };
  place(you); READY.centers.forEach(place);

  const SVGNS = 'http://www.w3.org/2000/svg';
  const unflat = (a, s) => { const out = [a[s], a[s + 1]]; for (let i = s + 2; i < a.length; i += 2) out.push(out[i - s - 2] + a[i], out[i - s - 1] + a[i + 1]); return out; };
  const dPath = (f, close) => { let d = 'M' + f[0] + ' ' + f[1]; for (let i = 2; i < f.length; i += 2) d += 'L' + f[i] + ' ' + f[i + 1]; return close ? d + 'Z' : d; };
  const pathsOf = (list, close) => list.map((a) => dPath(unflat(a, 0), close)).join('');

  const ROADS = MD.roads.map((r) => ({ cls: r[0], name: r[1] ? MD.names[r[1] - 1] : '', pts: unflat(r, 2) }));

  /* Walking graph built from the road polylines: junctions are vertices shared by two roads (motorways excluded). */
  const GRAPH = (function () {
    const count = new Map();
    const key = (x, y) => x + ',' + y;
    const walk = ROADS.filter((r) => r.cls > 0);
    walk.forEach((r) => { for (let i = 0; i < r.pts.length; i += 2) { const k = key(r.pts[i], r.pts[i + 1]); count.set(k, (count.get(k) || 0) + 1); } });
    const ids = new Map(), nodes = [], edges = [];
    const node = (x, y) => { const k = key(x, y); let i = ids.get(k); if (i === undefined) { i = nodes.length; ids.set(k, i); nodes.push({ x, y, e: [] }); } return i; };
    walk.forEach((r) => {
      const n = r.pts.length / 2;
      let from = 0;
      for (let i = 1; i < n; i++) {
        const junction = count.get(key(r.pts[i * 2], r.pts[i * 2 + 1])) > 1;
        if (!junction && i < n - 1) continue;
        const pts = r.pts.slice(from * 2, i * 2 + 2);
        let len = 0;
        for (let j = 2; j < pts.length; j += 2) len += Math.hypot(pts[j] - pts[j - 2], pts[j + 1] - pts[j - 1]);
        const a = node(pts[0], pts[1]), b = node(pts[pts.length - 2], pts[pts.length - 1]);
        if (a !== b) { edges.push({ a, b, pts, len, name: r.name }); nodes[a].e.push(edges.length - 1); nodes[b].e.push(edges.length - 1); }
        from = i;
      }
    });
    /* Only main roads are mapped, so side streets are missing. Stand in for them with straight links between nearby
       junctions (cost 1.35x the straight distance) so short trips are not sent on long detours. */
    const LINK_R = 260, LINK_N = 3, LINK_COST = 1.35;
    const have = new Set();
    edges.forEach((e) => have.add(e.a + '-' + e.b));
    for (let i = 0; i < nodes.length; i++) {
      const near = [];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i || have.has(i + '-' + j) || have.has(j + '-' + i)) continue;
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d <= LINK_R) near.push([d, j]);
      }
      near.sort((p, q) => p[0] - q[0]).slice(0, LINK_N).forEach(([d, j]) => {
        if (have.has(i + '-' + j) || have.has(j + '-' + i)) return;
        have.add(i + '-' + j);
        edges.push({ a: i, b: j, pts: [nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y], len: d * LINK_COST, name: '' });
        nodes[i].e.push(edges.length - 1); nodes[j].e.push(edges.length - 1);
      });
    }
    // keep only the biggest connected piece so snapping never lands on an island
    const comp = new Int32Array(nodes.length).fill(-1);
    let best = -1, bestN = 0;
    nodes.forEach((_, s) => {
      if (comp[s] >= 0) return;
      const stack = [s]; comp[s] = s; let c = 0;
      while (stack.length) { const u = stack.pop(); c++; nodes[u].e.forEach((ei) => { const v = edges[ei].a === u ? edges[ei].b : edges[ei].a; if (comp[v] < 0) { comp[v] = s; stack.push(v); } }); }
      if (c > bestN) { bestN = c; best = s; }
    });
    return { nodes, edges, main: (i) => comp[i] === best };
  })();

  function nearestNode(x, y) {
    let bi = -1, bd = Infinity;
    GRAPH.nodes.forEach((n, i) => { if (!GRAPH.main(i)) return; const d = (n.x - x) * (n.x - x) + (n.y - y) * (n.y - y); if (d < bd) { bd = d; bi = i; } });
    return bi;
  }
  let sp = null; // shortest paths from "You" (computed once; "You" does not move)
  function shortestFrom(src) {
    const N = GRAPH.nodes.length, dist = new Float64Array(N).fill(Infinity), via = new Int32Array(N).fill(-1), done = new Uint8Array(N);
    dist[src] = 0;
    for (;;) {
      let u = -1, bd = Infinity;
      for (let i = 0; i < N; i++) if (!done[i] && dist[i] < bd) { bd = dist[i]; u = i; }
      if (u < 0) break;
      done[u] = 1;
      GRAPH.nodes[u].e.forEach((ei) => { const e = GRAPH.edges[ei], v = e.a === u ? e.b : e.a, nd = dist[u] + e.len; if (nd < dist[v]) { dist[v] = nd; via[v] = ei; } });
    }
    return { dist, via };
  }

  const bearing = (ax, ay, bx, by) => (Math.atan2(bx - ax, ay - by) * 180 / Math.PI + 360) % 360;
  const segLen = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const flatLen = (f) => { let s = 0; for (let i = 2; i < f.length; i += 2) s += Math.hypot(f[i] - f[i - 2], f[i + 1] - f[i - 1]); return s; };
  const reversePts = (f) => { const o = []; for (let i = f.length - 2; i >= 0; i -= 2) o.push(f[i], f[i + 1]); return o; };

  /* Turn raw road pieces into a few readable steps: name the unnamed stubs, merge same-street pieces and tiny ones. */
  function tidyLegs(raw) {
    const legs = raw.map((l) => ({ name: l.name, pts: l.pts.slice(), len: flatLen(l.pts) })).filter((l) => l.len > 0);
    legs.forEach((l, i) => {
      for (let j = i + 1; j < legs.length && !l.name; j++) l.name = legs[j].name;
      for (let j = i - 1; j >= 0 && !l.name; j--) l.name = legs[j].name;
    });
    const merge = (i, into) => { // fold leg i into its neighbour `into`
      const a = Math.min(i, into), b = Math.max(i, into);
      legs.splice(a, 2, { name: legs[into].name, pts: legs[a].pts.concat(legs[b].pts.slice(2)), len: legs[a].len + legs[b].len });
    };
    for (let guard = 0; guard < 500; guard++) {
      const same = legs.findIndex((l, i) => i > 0 && l.name === legs[i - 1].name);
      if (same > 0) { merge(same, same - 1); continue; }
      if (legs.length <= 1) break;
      let s = 0; legs.forEach((l, i) => { if (l.len < legs[s].len) s = i; });
      if (legs.length <= 4 && legs[s].len >= 90) break;
      const into = s === 0 ? 1 : s === legs.length - 1 ? s - 1 : (legs[s - 1].len >= legs[s + 1].len ? s - 1 : s + 1);
      merge(s, into);
    }
    return legs.map((l) => {
      const f = l.pts; let k = 2, acc = 0;
      while (k < f.length - 2 && acc < 60) { acc += Math.hypot(f[k] - f[k - 2], f[k + 1] - f[k - 1]); k += 2; }
      return { name: l.name, len: l.len, bearing: bearing(f[0], f[1], f[k], f[k + 1]) };
    });
  }

  /* Route from "You" to a center along the real roads: { pts: [{x,y}], len (m), legs: [{name, len, bearing}] }.
     The first and last stretches (You -> nearest road, road -> building) are straight stubs. */
  const routeCache = {};
  function routeFor(c) {
    if (routeCache[c.id]) return routeCache[c.id];
    const A = nearestNode(you.x, you.y), B = nearestNode(c.x, c.y);
    if (!sp) sp = shortestFrom(A);
    const mid = [];
    if (Number.isFinite(sp.dist[B])) {
      for (let v = B; v !== A;) { const e = GRAPH.edges[sp.via[v]]; const fwd = e.b === v; mid.unshift({ name: e.name, pts: fwd ? e.pts : reversePts(e.pts) }); v = fwd ? e.a : e.b; }
    }
    const a = GRAPH.nodes[A], b = GRAPH.nodes[B];
    const legs = mid.length || A === B
      ? [{ name: '', pts: [you.x, you.y, a.x, a.y] }].concat(mid, [{ name: '', pts: [b.x, b.y, c.x, c.y] }])
      : [{ name: '', pts: [you.x, you.y, c.x, c.y] }]; // no road path found: straight line
    const pts = [];
    legs.forEach((l) => { for (let i = 0; i < l.pts.length; i += 2) { const p = { x: l.pts[i], y: l.pts[i + 1] }; if (!pts.length || segLen(pts[pts.length - 1], p) > 0.01) pts.push(p); } });
    let len = 0;
    for (let i = 1; i < pts.length; i++) len += segLen(pts[i - 1], pts[i]);
    return (routeCache[c.id] = { pts, len, legs: tidyLegs(legs) });
  }

  /* km shown in the UI = length of the real road route from "You". */
  READY.centers.forEach((c) => { c.km = Math.max(0.1, Math.round(routeFor(c).len / 100) / 10); });

  /* ----- static drawing (built once) ----- */
  const WORLD_SVG = (function () {
    const g = { 0: '', 1: '', 2: '', 3: '', 4: '' };
    ROADS.forEach((r) => { g[r.cls] += dPath(r.pts, false); });
    const city = pathsOf(MD.city, true), flood = pathsOf(MD.flood, true);
    const [cw, ch] = MD.size;
    return `<defs><pattern id="m-hatch" width="6" height="6" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="6" class="m-hatch-ln"/></pattern></defs>
      <path class="m-outside" d="M-900 -900H${cw + 900}V${ch + 900}H-900Z${city}"/>
      <path class="m-park" d="${pathsOf(MD.parks, true)}"/>
      <path class="m-water" d="${pathsOf(MD.water, true)}"/>
      <path class="m-canal" d="${pathsOf(MD.canals, false)}"/><path class="m-river" d="${pathsOf(MD.rivers, false)}"/>
      <path class="m-flood" d="${flood}"/><path class="m-flood-h" d="${flood}"/>
      <path class="m-city" d="${city}"/>
      <path class="m-t-c" d="${g[4]}"/><path class="m-t" d="${g[4]}"/>
      <path class="m-s-c" d="${g[3]}"/><path class="m-s" d="${g[3]}"/>
      <path class="m-p-c" d="${g[2]}"/><path class="m-p" d="${g[2]}"/>
      <path class="m-x-c" d="${g[1]}${g[0]}"/><path class="m-x" d="${g[1]}${g[0]}"/>`;
  })();
  let worldNode = null; // one persistent node, moved into each new map so the big paths are parsed only once
  function world() {
    if (!worldNode) { worldNode = document.createElementNS(SVGNS, 'g'); worldNode.setAttribute('class', 'm-w'); worldNode.setAttribute('data-world', ''); worldNode.innerHTML = WORLD_SVG; }
    return worldNode;
  }

  /* Labels that stay screen-sized: barangays (CAPS), a few streets, rivers, parks. Lower pr = placed first. */
  const BRGY_SHOW = { 'general t. de leon': 'GEN. T. DE LEON' };
  const brgyName = (c) => c.brgy.toLowerCase();
  const LABELS = (function () {
    const withCenter = new Set(READY.centers.map(brgyName).concat('malanday'));
    const hasCenter = (n) => withCenter.has(n.toLowerCase()) || (n === 'General T. de Leon' && withCenter.has('gen. t. de leon'));
    const L = [];
    const add = (kind, text, x, y, rot, pr) => L.push({ kind, text, x, y, rot: rot || 0, pr, w: text.length * ({ b: 7.2, s: 5.8, w: 5.6, p: 5.8 }[kind]) });
    MD.labels.brgy.forEach((b) => add('b', BRGY_SHOW[b[0].toLowerCase()] || b[0].toUpperCase(), b[1], b[2], 0, hasCenter(b[0]) ? 1 : 4));
    MD.labels.water.forEach((w) => add('w', w[0], w[1], w[2], w[3], 2));
    MD.labels.streets.forEach((s) => add('s', s[0], s[1], s[2], s[3], 5));
    MD.labels.parks.forEach((p) => add('p', p[0], p[1], p[2], 0, 5));
    return L.sort((a, b) => a.pr - b.pr);
  })();
  const labelsSvg = () => LABELS.map((l) => `<text class="m-l m-${l.kind}l" data-lbl="${l.kind}" data-wx="${l.x}" data-wy="${l.y}" data-rot="${l.rot}" data-w="${Math.round(l.w)}">${esc(l.text)}</text>`).join('');

  const LABEL_POS = {};
  function pinShape(st) {
    if (st === 'available') return `<circle r="13" class="pin-${st}"/>`;
    if (st === 'almost') return `<polygon points="0,-17 17,0 0,17 -17,0" class="pin-${st}"/>`;
    return `<rect x="-13" y="-13" width="26" height="26" rx="6" class="pin-${st}"/>`;
  }
  function pinLabel(v, active) {
    const pos = LABEL_POS[v.id] || 'b';
    const cls = 'pin-label' + (active ? ' pin-label-on' : '');
    if (pos === 'l') return `<text x="-24" y="4" text-anchor="end" class="${cls}">${esc(v.short)}</text>`;
    if (pos === 'r') return `<text x="24" y="4" class="${cls}">${esc(v.short)}</text>`;
    if (pos === 't') return `<text y="-24" text-anchor="middle" class="${cls}">${esc(v.short)}</text>`;
    return `<text y="34" text-anchor="middle" class="${cls}">${esc(v.short)}</text>`;
  }

  const DIRS = ['north', 'east', 'south', 'west'];
  const dir4 = (b) => DIRS[Math.round(b / 90) % 4];

  function walkRoute(pts, f) {
    const lens = pts.slice(1).map((p, i) => segLen(pts[i], p));
    let target = lens.reduce((a, b) => a + b, 0) * f;
    const done = [pts[0]];
    for (let i = 0; i < lens.length; i++) {
      if (target >= lens[i] && i < lens.length - 1) { done.push(pts[i + 1]); target -= lens[i]; continue; }
      const k = lens[i] ? Math.min(1, target / lens[i]) : 1;
      const p = { x: pts[i].x + (pts[i + 1].x - pts[i].x) * k, y: pts[i].y + (pts[i + 1].y - pts[i].y) * k };
      done.push(p);
      return { done, pos: p, ang: Math.round(bearing(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y)) };
    }
    return { done, pos: pts[pts.length - 1], ang: 0 };
  }

  /* opts: pins (center views), hidden (Set of ids), activeId, routeTo (center view) + f (progress 0..1),
     static (no pan/zoom, no tap), plain (onboarding thumbnail: frame all pins). */
  function mapSvg(opts) {
    const o = opts || {};
    const live = !o.static;
    let routeSvg = '', startSvg = '';
    if (o.routeTo) {
      const r = routeFor(o.routeTo);
      const w = walkRoute(r.pts, o.f || 0);
      const str = (arr) => arr.map((p) => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ');
      routeSvg = `<polyline points="${str(r.pts)}" class="m-route-rest" stroke-width="5" stroke-dasharray="1 9"/>
        <polyline id="rt-done-casing" points="${str(w.done)}" class="m-route-casing" stroke-width="11"/>
        <polyline id="rt-done" points="${str(w.done)}" class="m-route" stroke-width="6"/>`;
      startSvg = `<circle data-wx="${you.x}" data-wy="${you.y}" r="6" class="m-start"/>
        <g id="rt-pos" data-wx="${w.pos.x}" data-wy="${w.pos.y}"><circle r="14" class="m-marker"/><g id="rt-ang" transform="rotate(${w.ang})"><use href="#i-heading" x="-7.5" y="-7.5" width="15" height="15" class="ic-svg m-marker-ic"/></g></g>`;
    }
    const shown = (o.pins || []).filter((v) => !(o.hidden && o.hidden.has(v.id)));
    shown.sort((a, b) => (a.id === o.activeId) - (b.id === o.activeId) || a.y - b.y);
    const pins = shown.map((v) => {
      const on = o.activeId === v.id;
      const label = `${v.name}, ${v.km} km, ${offline() ? t(v.status === 'full' ? 'st.wasFull' : 'st.hadSpace', { x: fmtAge(v.age) }) : t('st.' + v.status)}`;
      const body = `<g transform="scale(1.12)">${on ? '<circle r="24" class="pin-ring"/>' : ''}${pinShape(v.status)}<use href="#i-${ST[v.status].glyph}" x="-8" y="-8" width="16" height="16" class="ic-svg"/></g>${pinLabel(v, on || (o.static && !o.plain))}`;
      const pos = `data-pin data-wx="${v.x}" data-wy="${v.y}" data-lw="${Math.round(v.short.length * 6.4)}" data-lp="${LABEL_POS[v.id] || 'b'}"`;
      if (o.static) return `<g ${pos}>${body}</g>`;
      return `<g role="button" tabindex="0" aria-label="${esc(label)}" data-act="pin" data-id="${v.id}" data-k="pin-${v.id}" ${pos} class="pin ${on ? 'pin-on' : ''}">
        <circle r="26" fill="transparent"/>${body}</g>`;
    }).join('');
    const me = o.routeTo ? '' : `<g aria-hidden="true" data-me data-wx="${you.x}" data-wy="${you.y}"><circle r="17" class="you-pulse"/><circle r="8" class="m-me" stroke-width="3.5"/>
      <text x="14" y="-11" class="you-label">${esc(t('map.you'))}</text></g>`;
    const fit = o.routeTo ? 'data-fit="route"' : o.plain ? 'data-fit="pins"' : '';
    const ctl = !live ? '' : `<div class="map-ctl">
        <button type="button" data-act="zoom-in" data-k="z-in" aria-label="${t('map.zoomIn')}">${ic('plus')}</button>
        <button type="button" data-act="zoom-out" data-k="z-out" aria-label="${t('map.zoomOut')}">${ic('minus')}</button>
        <button type="button" data-act="recenter" data-k="z-me" aria-label="${t('map.recenter')}">${ic('locate')}</button></div>`;
    const attrs = live ? 'data-live data-act="unpick"' : '';
    return `<svg class="map" viewBox="0 0 340 440" role="group" aria-label="${esc(t('map.title'))}" ${attrs} ${fit}>
      <g data-slot></g><g class="m-w" data-world>${routeSvg}</g>
      <g class="m-ov">${o.routeTo ? '' : labelsSvg()}${startSvg}${pins}<g data-clusters></g>${me}</g></svg>${ctl}<p class="map-attrib">© OpenStreetMap contributors</p>`;
  }

  /* ----- viewport: zoom, pan, counter-scaled overlay ----- */
  let mp = null; // the map on screen: { svg, stage, W, H, s0, b, v: {k, wx, wy}, inset, live, kMin, kMax, ... }
  const K_MAX = 6;
  const PAD_M = 350; // how far past the city box you may pan (meters)
  const reduced = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const lsScale = () => Math.min(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ts')) || 1, 1.3);

  /* The view is {k, wx, wy}: zoom (1 = whole city) and the map point shown at the middle of the stage. */
  function clampView(v, inset) {
    const k = Math.min(mp.kMax, Math.max(mp.kMin, v.k)), S = mp.s0 * k;
    let tx = mp.W / 2 - v.wx * S, ty = mp.H / 2 - v.wy * S;
    const vw = mp.W, vh = mp.H - inset, b = mp.b;
    const x0 = b[0] * S, x1 = b[2] * S, y0 = b[1] * S, y1 = b[3] * S;
    tx = x1 - x0 <= vw ? (vw - (x1 - x0)) / 2 - x0 : Math.min(-x0, Math.max(vw - x1, tx));
    ty = y1 - y0 <= vh ? (vh - (y1 - y0)) / 2 - y0 : Math.min(-y0, Math.max(vh - y1, ty));
    return { k, wx: (mp.W / 2 - tx) / S, wy: (mp.H / 2 - ty) / S };
  }
  const toPx = (x, y, v) => { const w = v || mp.v, S = mp.s0 * w.k; return [mp.W / 2 + (x - w.wx) * S, mp.H / 2 + (y - w.wy) * S]; };
  function zoomedAt(v, f, px, py) {
    const k = Math.min(mp.kMax, Math.max(mp.kMin, v.k * f)), S0 = mp.s0 * v.k, S1 = mp.s0 * k;
    const x = v.wx + (px - mp.W / 2) / S0, y = v.wy + (py - mp.H / 2) / S0;
    return { k, wx: x - (px - mp.W / 2) / S1, wy: y - (py - mp.H / 2) / S1 };
  }

  /* Pins closer than this on screen (px) merge into one count bubble. The selected pin never merges. */
  const CLUSTER_PX = 44;
  function groupPins(pts) {
    const par = pts.map((_, i) => i);
    const root = (i) => (par[i] === i ? i : (par[i] = root(par[i])));
    const solo = (p) => p.el.classList.contains('pin-on');
    pts.forEach((a, i) => {
      if (solo(a)) return;
      for (let j = i + 1; j < pts.length; j++) if (!solo(pts[j]) && Math.hypot(a.x - pts[j].x, a.y - pts[j].y) < CLUSTER_PX) par[root(i)] = root(j);
    });
    const groups = new Map();
    pts.forEach((p, i) => { const r = root(i); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(p); });
    return [...groups.values()];
  }
  /* One bubble per group, reused between frames (so keyboard focus survives panning). Green dot = at least one center has space. */
  function clusterNode(ids) {
    const key = ids.join(',');
    let g = mp.cl.get(key);
    if (!g) {
      const open = !offline() && ids.some((id) => byId(id).status === 'available');
      g = document.createElementNS(SVGNS, 'g');
      g.setAttribute('class', 'cluster'); g.setAttribute('role', 'button'); g.setAttribute('tabindex', '0');
      g.setAttribute('data-act', 'cluster'); g.setAttribute('data-ids', key); g.setAttribute('data-k', 'cl-' + key);
      g.setAttribute('aria-label', t('map.cluster', { n: ids.length }) + (open ? ' ' + t('map.clusterOpen') : ''));
      g.innerHTML = `<circle r="24" fill="transparent"/><circle r="18" class="cl-bg"/><text class="cl-n" y="5.5">${ids.length}</text>${open ? '<circle cx="14" cy="-14" r="6.5" class="cl-open"/>' : ''}`;
      mp.clLayer.appendChild(g); mp.cl.set(key, g);
    }
    return g;
  }

  /* Overlay: everything here is positioned in screen pixels, so pins and text keep their size at any zoom. */
  function placeOverlay() {
    const mls = lsScale(), showSmall = mp.v.k >= 1.8;
    const at = (el) => { const [x, y] = toPx(+el.dataset.wx, +el.dataset.wy); el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`); return [x, y]; };
    const rects = [];
    const hit = (r) => rects.some((q) => r[0] < q[2] && r[2] > q[0] && r[1] < q[3] && r[3] > q[1]);
    const box = (x, y, w, h, rot) => { const a = Math.abs(Math.cos(rot * Math.PI / 180)), s = Math.abs(Math.sin(rot * Math.PI / 180)), hw = (w * a + h * s) / 2, hh = (w * s + h * a) / 2; return [x - hw, y - hh, x + hw, y + hh]; };
    const pts = [...mp.svg.querySelectorAll('[data-pin]')].map((el) => { const [x, y] = at(el); return { el, x, y }; });
    const me = mp.svg.querySelector('[data-me]');
    let meXY = null;
    if (me) { const [x, y] = at(me); meXY = [x, y]; rects.push([x - 16, y - 26, x + 44, y + 16]); }
    mp.obst.forEach((r) => rects.push(r)); // map buttons, hint, legend and sheet are not for text to sit under
    const singles = [], used = new Set();
    (mp.live ? groupPins(pts) : pts.map((p) => [p])).forEach((grp) => { // pins always win over text; groups become one bubble
      if (grp.length === 1) { singles.push(grp[0]); rects.push([grp[0].x - 20, grp[0].y - 20, grp[0].x + 20, grp[0].y + 20]); return; }
      let cx = grp.reduce((s, p) => s + p.x, 0) / grp.length, cy = grp.reduce((s, p) => s + p.y, 0) / grp.length;
      if (meXY) { // keep the bubble off the "You" dot
        const dx = cx - meXY[0], dy = cy - meXY[1], d = Math.hypot(dx, dy), min = 36;
        if (d < min) { const ux = d > 0.5 ? dx / d : 0, uy = d > 0.5 ? dy / d : 1; cx = meXY[0] + ux * min; cy = meXY[1] + uy * min; }
      }
      const g = clusterNode(grp.map((p) => p.el.dataset.id).sort());
      g.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)})`);
      g.style.display = '';
      used.add(g);
      rects.push([cx - 24, cy - 24, cx + 24, cy + 24]);
    });
    pts.forEach((p) => { p.el.style.display = singles.includes(p) ? '' : 'none'; });
    if (mp.cl) mp.cl.forEach((g, key) => { if (!used.has(g)) { g.remove(); mp.cl.delete(key); } });
    singles.forEach(({ el }) => { // then their names, unless they would sit on top of something
      const lab = el.querySelector('.pin-label');
      if (!lab) return;
      const [x, y] = toPx(+el.dataset.wx, +el.dataset.wy), w = (+el.dataset.lw) * mls, p = el.dataset.lp;
      const r = p === 'l' ? [x - 24 - w, y - 9, x - 24, y + 9] : p === 'r' ? [x + 24, y - 9, x + 24 + w, y + 9] : p === 't' ? [x - w / 2, y - 38, x + w / 2, y - 22] : [x - w / 2, y + 24, x + w / 2, y + 42];
      const on = el.classList.contains('pin-on') || !el.hasAttribute('data-act');
      const ok = on || !hit(r);
      if (ok) rects.push(r);
      lab.style.display = ok ? '' : 'none';
    });
    mp.svg.querySelectorAll('[data-wx]:not([data-pin]):not([data-me]):not([data-lbl])').forEach(at);
    mp.labels.forEach((el) => {
      const kind = el.dataset.lbl, rot = kind === 's' || kind === 'w' ? +el.dataset.rot : 0;
      const [x, y] = toPx(+el.dataset.wx, +el.dataset.wy);
      const half = (+el.dataset.w * mls) / 2;
      let ok = (kind === 'b' || kind === 'w' || showSmall) && x - half > 8 && x + half < mp.W - 8 && y > 12 && y < mp.H - 12;
      let dy = 0;
      if (ok) {
        const tries = kind === 'b' ? [0, -30, 30, -52] : [0]; // a barangay name may slide above or below its spot
        const hitAt = tries.find((d) => !hit(box(x, y + d, (+el.dataset.w) * mls + 6, 13 * mls, rot)));
        if (hitAt === undefined) ok = false; else { dy = hitAt; rects.push(box(x, y + dy, (+el.dataset.w) * mls + 6, 13 * mls, rot)); }
      }
      if (ok) el.setAttribute('transform', `translate(${x.toFixed(1)} ${(y + dy).toFixed(1)})${rot ? ` rotate(${rot})` : ''}`);
      el.style.display = ok ? '' : 'none';
    });
  }

  function draw() {
    const v = mp.v, S = mp.s0 * v.k, tx = mp.W / 2 - v.wx * S, ty = mp.H / 2 - v.wy * S;
    mp.svg.style.setProperty('--k', Math.min(v.k, 7).toFixed(3));
    const tr = `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${S})`;
    mp.worlds.forEach((g) => g.setAttribute('transform', tr));
    if (mp.hatch) mp.hatch.setAttribute('patternTransform', `rotate(45) scale(${1 / S})`);
    placeOverlay();
    if (mp.live) {
      const set = (k, off) => { const b = mp.stage.querySelector(`[data-k="${k}"]`); if (b) b.setAttribute('aria-disabled', off ? 'true' : 'false'); };
      set('z-in', v.k >= mp.kMax - 0.01); set('z-out', v.k <= mp.kMin + 0.01);
    }
  }
  function setView(v) { mp.v = v; if (mp.live) ui.mv = { k: v.k, wx: v.wx, wy: v.wy }; draw(); }
  function animateTo(target, done) {
    cancelAnimationFrame(mp.anim);
    const from = mp.v, m = mp;
    if (reduced() || (Math.abs(from.k - target.k) < 1e-3 && Math.hypot(from.wx - target.wx, from.wy - target.wy) < 0.5)) { setView(target); if (done) done(); return; }
    const t0 = performance.now(), D = 260;
    const step = (now) => {
      if (mp !== m) return;
      const p = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - p, 3);
      setView({ k: from.k + (target.k - from.k) * e, wx: from.wx + (target.wx - from.wx) * e, wy: from.wy + (target.wy - from.wy) * e });
      if (p < 1) m.anim = requestAnimationFrame(step); else if (done) done();
    };
    m.anim = requestAnimationFrame(step);
  }

  /* Where the view should rest: clamped to the city, and with the selected pin visible above the sheet. */
  function settledView(v) {
    let t = clampView(v, mp.inset);
    const c = ui.pinId && mp.inset ? byId(ui.pinId) : null;
    if (c) {
      const [px, py] = toPx(c.x, c.y, t);
      const lo = 64, hi = mp.H - mp.inset - 56;
      if (py < lo || py > hi || px < 28 || px > mp.W - 28) {
        const S = mp.s0 * t.k, cx = Math.min(mp.W - 28, Math.max(28, px));
        t = clampView({ k: t.k, wx: c.x - (cx - mp.W / 2) / S, wy: c.y - ((lo + hi) / 2 - mp.H / 2) / S }, mp.inset);
      }
    }
    return t;
  }

  const bboxOfPts = (pts) => pts.reduce((b, p) => [Math.min(b[0], p.x), Math.min(b[1], p.y), Math.max(b[2], p.x), Math.max(b[3], p.y)], [1e9, 1e9, -1e9, -1e9]);

  function setupMap(svg) {
    const stage = svg.parentElement;
    const live = svg.hasAttribute('data-live');
    const W = svg.clientWidth || 340, H = svg.clientHeight || 440;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.querySelector('[data-slot]').replaceWith(world());
    const [cw, ch] = MD.size;
    const b = [-PAD_M, -PAD_M, cw + PAD_M, ch + PAD_M];
    const s0 = Math.min(W / (b[2] - b[0]), H / (b[3] - b[1]));
    if (mp) cancelAnimationFrame(mp.anim);
    mp = { svg, stage, W, H, s0, b, live, kMin: 1, kMax: K_MAX, inset: 0, anim: 0, v: null,
      clLayer: svg.querySelector('[data-clusters]'), cl: new Map(), obst: [],
      worlds: [...svg.querySelectorAll('[data-world]')], hatch: svg.querySelector('#m-hatch'), labels: [...svg.querySelectorAll('[data-lbl]')] };
    if (!live) { // static maps frame what they show and do not move
      const fit = svg.dataset.fit;
      const bb = fit === 'route' ? bboxOfPts(routeFor(byId(ui.route.arg)).pts)
        : bboxOfPts([...svg.querySelectorAll('[data-pin]')].map((el) => ({ x: +el.dataset.wx, y: +el.dataset.wy })));
      const pad = fit === 'route' ? 54 : 34;
      const S = Math.min((W - pad * 2) / Math.max(bb[2] - bb[0], 200), (H - pad * 2) / Math.max(bb[3] - bb[1], 200));
      mp.kMin = 0.1; mp.kMax = 40;
      mp.v = { k: S / s0, wx: (bb[0] + bb[2]) / 2, wy: (bb[1] + bb[3]) / 2 };
      draw();
      return;
    }
    const sr = svg.getBoundingClientRect();
    mp.obst = [...stage.querySelectorAll('.map-ctl, .map-hint, .legend')].map((el) => { const r = el.getBoundingClientRect(); return [r.left - sr.left - 4, r.top - sr.top - 4, r.right - sr.left + 4, r.bottom - sr.top + 4]; });
    const sh = stage.querySelector('.sheet');
    mp.inset = sh ? sh.offsetHeight : 0;
    if (mp.inset) mp.obst.push([0, H - mp.inset, W, H]);
    mp.v = ui.mv || clampView({ k: 1, wx: (b[0] + b[2]) / 2, wy: (b[1] + b[3]) / 2 }, 0);
    draw();
    animateTo(settledView(mp.v));
  }

  function positionMap() {
    const svg = $('svg.map');
    if (!svg) { mp = null; return; }
    setupMap(svg);
  }

  /* Pointer, wheel and keyboard input on the live map. Pan and zoom never re-render the screen. */
  const gest = { ptrs: new Map(), drag: false, suppress: false };
  const liveSvg = (e) => { const s = e.target && e.target.closest ? e.target.closest('svg.map[data-live]') : null; return s && mp && mp.svg === s ? s : null; };
  const panned = (v, dx, dy) => { const S = mp.s0 * v.k; return { k: v.k, wx: v.wx - dx / S, wy: v.wy - dy / S }; };
  const settle = (v) => setView(clampView(v, mp.inset));

  function bindMapInput() {
    const view = $('#view');
    view.addEventListener('pointerdown', (e) => {
      const svg = liveSvg(e);
      if (!svg || (e.pointerType === 'mouse' && e.button !== 0)) return;
      cancelAnimationFrame(mp.anim);
      gest.ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY });
      if (gest.ptrs.size === 2) { gest.drag = true; svg.classList.add('is-drag'); }
    });
    view.addEventListener('pointermove', (e) => {
      const p = gest.ptrs.get(e.pointerId);
      if (!p || !mp) return;
      const r = mp.svg.getBoundingClientRect(), sx = mp.W / r.width;
      if (gest.ptrs.size >= 2) {
        const [a, b] = [...gest.ptrs.values()];
        const d0 = Math.hypot(a.x - b.x, a.y - b.y), m0 = [(a.x + b.x) / 2, (a.y + b.y) / 2];
        p.x = e.clientX; p.y = e.clientY;
        const d1 = Math.hypot(a.x - b.x, a.y - b.y), m1 = [(a.x + b.x) / 2, (a.y + b.y) / 2];
        if (d0 < 1) return;
        const v = zoomedAt(mp.v, d1 / d0, (m0[0] - r.left) * sx, (m0[1] - r.top) * sx);
        settle(panned(v, (m1[0] - m0[0]) * sx, (m1[1] - m0[1]) * sx));
        return;
      }
      if (!gest.drag) {
        if (Math.hypot(e.clientX - p.sx, e.clientY - p.sy) < 6) return;
        gest.drag = true; mp.svg.classList.add('is-drag');
        try { mp.svg.setPointerCapture(e.pointerId); } catch (err) { /* capture is only a nicety */ }
      }
      const dx = (e.clientX - p.x) * sx, dy = (e.clientY - p.y) * sx;
      p.x = e.clientX; p.y = e.clientY;
      settle(panned(mp.v, dx, dy));
    });
    const up = (e) => {
      if (!gest.ptrs.delete(e.pointerId)) return;
      gest.ptrs.forEach((p) => { p.sx = p.x; p.sy = p.y; });
      if (!gest.ptrs.size) {
        if (gest.drag) { gest.suppress = true; setTimeout(() => { gest.suppress = false; }, 80); }
        gest.drag = false;
        if (mp) mp.svg.classList.remove('is-drag');
      }
    };
    view.addEventListener('pointerup', up);
    view.addEventListener('pointercancel', up);
    view.addEventListener('click', (e) => { if (gest.suppress && e.target.closest('svg.map')) { e.stopPropagation(); e.preventDefault(); } }, true);
    view.addEventListener('wheel', (e) => {
      if (!liveSvg(e)) return;
      e.preventDefault();
      cancelAnimationFrame(mp.anim);
      const r = mp.svg.getBoundingClientRect(), sx = mp.W / r.width;
      settle(zoomedAt(mp.v, Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0022)), (e.clientX - r.left) * sx, (e.clientY - r.top) * sx));
    }, { passive: false });
    view.addEventListener('focusin', (e) => { // keyboard focus on a pin brings it into view
      const pin = e.target.closest && e.target.closest('[data-pin]');
      if (!pin || !mp || !mp.live) return;
      const [x, y] = toPx(+pin.dataset.wx, +pin.dataset.wy);
      if (x < 24 || x > mp.W - 24 || y < 60 || y > mp.H - mp.inset - 40) {
        const S = mp.s0 * mp.v.k;
        animateTo(clampView({ k: mp.v.k, wx: +pin.dataset.wx, wy: +pin.dataset.wy + mp.inset / (2 * S) }, mp.inset));
      }
    });
  }
  window.addEventListener('resize', () => { if (mp && document.body.contains(mp.svg)) setupMap(mp.svg); });

  function zoomBy(f) {
    if (!mp || !mp.live) return;
    animateTo(clampView(zoomedAt(mp.v, f, mp.W / 2, (mp.H - mp.inset) / 2), mp.inset));
  }
  /* Tapping a count bubble zooms to fit the centers inside it (at least 1.8x), so the bubble splits. */
  function zoomToCluster(ids, byKeyboard) {
    if (!mp || !mp.live) return;
    const list = ids.map(byId).filter(Boolean);
    const bb = bboxOfPts(list);
    const fit = Math.min((mp.W - 110) / (Math.max(bb[2] - bb[0], 1) * mp.s0), (mp.H - mp.inset - 190) / (Math.max(bb[3] - bb[1], 1) * mp.s0));
    const k = Math.min(mp.kMax, Math.max(mp.v.k * 1.8, Math.min(fit, mp.v.k * 6)));
    const m = mp;
    animateTo(clampView({ k, wx: (bb[0] + bb[2]) / 2, wy: (bb[1] + bb[3]) / 2 + mp.inset / (2 * mp.s0 * k) }, mp.inset), () => {
      if (mp !== m || !byKeyboard) return; // keyboard users land on the first pin that split off
      const first = list.map((c) => m.svg.querySelector(`[data-pin][data-id="${c.id}"]`)).find((el) => el && el.style.display !== 'none');
      if (first) first.focus({ preventScroll: true });
    });
  }
  function recenter() {
    if (!mp || !mp.live) return;
    const k = Math.max(mp.v.k, 2.5), S = mp.s0 * k;
    animateTo(clampView({ k, wx: you.x, wy: you.y + mp.inset / (2 * S) }, mp.inset));
  }

  /* ---------- generated step-by-step directions (translated), from the real road route ---------- */
  function buildSteps(c) {
    const legs = routeFor(c).legs;
    const total = legs.reduce((s, l) => s + l.len, 0) || 1;
    const steps = [];
    legs.forEach((l, i) => {
      const street = l.name || t('step.road');
      const meters = Math.max(10, Math.round(((l.len / total) * c.km * 1000) / 10) * 10);
      let text;
      if (i === 0) text = t('step.head', { dir: t('dir.' + dir4(l.bearing)), street });
      else {
        const d = ((l.bearing - legs[i - 1].bearing + 540) % 360) - 180;
        text = Math.abs(d) < 20 ? t('step.head', { dir: t('dir.' + dir4(l.bearing)), street }) : t(d > 0 ? 'step.turnRight' : 'step.turnLeft', { street });
      }
      steps.push({ kind: 'dir', text, deg: Math.round(l.bearing), meters });
    });
    steps.push({ kind: 'tip', text: tipOf(c), icon: 'shield' });
    steps.push({ kind: 'arrive', text: t('step.arrive', { name: c.name }), icon: 'pin' });
    return steps;
  }

  /* ---------- toast + dialog ---------- */
  let toastTimer = null;
  function toast(msg, action) {
    const el = $('#toast');
    clearTimeout(toastTimer);
    el.innerHTML = `<span>${esc(msg)}</span>` + (action ? `<button class="toast-btn" data-act="toast-action">${ic('undo')}${esc(action.label)}</button>` : '');
    el.classList.add('show');
    toast.at = Date.now();
    toast.action = action ? action.fn : null;
    toastTimer = setTimeout(() => { el.classList.remove('show'); }, action ? 7000 : 3800);
  }
  function hideToast() { clearTimeout(toastTimer); $('#toast').classList.remove('show'); }

  let dialogReturnFocus = null;
  function openDialog(d) {
    const root = $('#modal-root');
    dialogReturnFocus = document.activeElement;
    const actions = d.actions.filter(Boolean);
    root.innerHTML = `<div class="scrim" data-act="dialog-dismiss"></div>
      <div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dlg-title" aria-describedby="dlg-body">
        <div class="dialog-icon tone-${d.tone || 'info'}">${ic(d.icon || 'alert')}</div>
        <h2 id="dlg-title">${esc(d.title)}</h2>
        <p id="dlg-body">${esc(d.body)}</p>
        <div class="dialog-actions">${actions.map((a, i) => a.href
          ? `<a class="btn btn-${a.kind || 'secondary'}" href="${a.href}" data-dlg="${i}">${a.icon ? ic(a.icon) : ''}${esc(a.label)}</a>`
          : `<button class="btn btn-${a.kind || 'secondary'}" data-act="dialog-action" data-i="${i}">${esc(a.label)}</button>`).join('')}</div>
      </div>`;
    openDialog.actions = actions;
    const first = root.querySelector('.btn');
    if (first) first.focus();
  }
  function closeDialog() {
    $('#modal-root').innerHTML = '';
    openDialog.actions = [];
    if (dialogReturnFocus && document.contains(dialogReturnFocus)) dialogReturnFocus.focus();
  }
  const dialogOpen = () => !!$('#modal-root .dialog');

  /* ---------- screens ---------- */
  const screens = {};
  const originTab = () => ui.originTab;

  /* Alert card: faded severity tint + 4px stripe; only the pill is solid. compact = Home version (headline + places). */
  const SEV_ICON = { danger: 'alert', warning: 'bell', info: 'shield' };
  function alertCard(a, compact, tag) {
    const x = L(a);
    const mins = a.mins + (offline() ? 120 : 0);
    const inner = `<div class="acard-top"><span class="pill">${ic(SEV_ICON[a.sev])}${t('sev.' + a.sev)}</span><span class="acard-when">${fmtAge(mins)}</span></div>
      <h3 class="acard-title">${esc(x.title)}</h3>
      <p class="acard-area">${esc(compact ? x.where : x.area)}</p>
      ${!compact && x.action ? `<p class="acard-action">${esc(x.action)}</p>` : ''}`;
    return tag === 'a'
      ? `<a class="acard sev-${a.sev}" href="#/alerts" data-k="banner" aria-label="${t('home.alert')}: ${esc(x.title)}">${inner}</a>`
      : `<li class="acard sev-${a.sev}">${inner}</li>`;
  }

  function switchRow(name, label, help, on, icon) {
    return `<label class="row switch-row">${icon ? ic(icon, 'row-ic') : ''}<span class="row-main"><span class="row-title">${label}</span><span class="row-help">${help}</span></span>
      <input type="checkbox" role="switch" data-set="${name}" data-k="sw-${name}" ${on ? 'checked' : ''}><span class="sw" aria-hidden="true"></span></label>`;
  }

  screens.home = function () {
    const a = READY.alerts[0];
    const recent = store.recentId ? byId(store.recentId) : null;
    const near = all().slice(0, 3);
    const resuming = recent && nav && nav.id === recent.id;
    const recentRow = recent ? `<div class="list recent">
        <div class="row recent-row"><a class="row-link" href="${resuming ? '#/route/' + recent.id : '#/center/' + recent.id}" data-k="recent">
          <span class="row-main"><span class="row-cap">${resuming ? t('home.resume') : t('home.recent')}</span><span class="row-title">${esc(recent.name)}</span></span>
          ${resuming ? ic('navigate', 'row-ic-brand') : badge(recent)}</a>
          ${resuming ? '' : `<button class="icon-btn" data-act="unpin" aria-label="${t('home.remove')}" data-k="unpin">${ic('x')}</button>`}
        </div></div>` : '';
    return {
      title: t('nav.home'), tab: 'home',
      html: `<div class="ribbon" aria-hidden="true"></div>
        <div class="pg pg-home">
          <div class="logo" aria-hidden="true">${ic('shield', 'logo-ic')}<span class="logo-word">ReadyPH</span></div>
          <h1 class="sr-only" tabindex="-1">${t('nav.home')}</h1>
          <p class="loc">${ic('pin')}${t('home.loc')}</p>
          ${alertCard(a, true, 'a')}
          <button class="btn btn-primary btn-find" data-act="find" data-k="find">${ic('find', 'ic-lg')}<span>${t('home.find')}</span>${ic('chevron', 'find-go')}</button>
          ${recentRow}
          <section aria-labelledby="near-h">
            <div class="sec-head"><h2 id="near-h" class="h-s">${t('home.nearby')}</h2><a class="link" href="#/map" data-act="show-list">${t('home.seeAll')}${ic('chevron')}</a></div>
            <div class="list">${near.map(centerRow).join('')}</div>
            ${freshLine(near)}
          </section>
        </div>`
    };
  };

  screens.map = function () {
    const list = all();
    const facs = Object.keys(FAC);
    const match = (v) => [...ui.filters].every((f) => v.fac.includes(f));
    const shown = list.filter(match);
    const hidden = new Set(list.filter((v) => !match(v)).map((v) => v.id));
    const sel = ui.pinId && !hidden.has(ui.pinId) ? byId(ui.pinId) : null;
    const isMap = ui.mapMode === 'map';
    const filtered = ui.filters.size > 0;

    const chips = `<div class="filters" role="group" aria-label="${t('map.filters')}">
      ${filtered ? `<button class="chip chip-clear" data-act="clear-filters" data-k="clear">${ic('x')}${t('map.clear')}</button>` : ''}
      ${facs.map((f) => `<button class="chip ${ui.filters.has(f) ? 'on' : ''}" aria-pressed="${ui.filters.has(f)}" data-act="filter" data-f="${f}" data-k="f-${f}">${ic(FAC[f].icon)}${t('fac.' + f)}</button>`).join('')}
    </div>`;

    const legend = `<ul class="legend" aria-label="${t('map.legend')}">
      ${['available', 'almost', 'full'].map((s) => `<li><svg class="lg lg-${s}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${ST[s].glyph}"/></svg>${t('st.' + s)}</li>`).join('')}
      <li><span class="lg-flood" aria-hidden="true"></span>${t('map.flood')}</li>
    </ul>`;

    const pwdUnverified = ui.filters.has('pwd') && !READY.centers.some((c) => c.fac.includes('pwd'));
    let body, cls = '';
    if (!shown.length && pwdUnverified) {
      body = `<div class="pg"><div class="empty empty-pwd">${ic('wheelchair', 'ic-lg')}<p class="body" role="status">${t('map.pwdNone')}</p><button class="btn btn-secondary" data-act="clear-filters" data-k="show-all">${t('map.showAll')}</button></div></div>`;
    } else if (!shown.length) {
      body = `<div class="pg"><div class="empty"><h2 class="h-s">${t('map.none')}</h2><p>${t('map.noneHelp')}</p><button class="btn btn-secondary" data-act="clear-filters">${t('map.clear')}</button></div></div>`;
    } else if (isMap) {
      cls = 'is-map';
      body = `<div class="map-stage is-pan" id="stage">${mapSvg({ pins: list, hidden, activeId: sel && sel.id })}
        ${sel ? sheet(sel) : `<p class="map-hint">${ic('pin')}${t('map.tapPin')}</p>${legend}`}</div>`;
    } else {
      body = `<div class="pg"><div class="list">${shown.map(centerRow).join('')}</div>${freshLine(shown)}</div>`;
    }

    return {
      title: t('map.title'), tab: 'map', cls,
      html: `<header class="head head-split"><h1 class="h-d" tabindex="-1">${t('map.title')}</h1>
          ${filtered ? `<span class="head-count" role="status">${t('map.of', { n: shown.length, total: list.length })}</span>` : ''}
          <div class="seg-toggle" role="group" aria-label="${t('map.title')}">
            <button data-act="mode" data-mode="map" aria-pressed="${isMap}" data-k="m-map">${ic('map')}${t('map.map')}</button>
            <button data-act="mode" data-mode="list" aria-pressed="${!isMap}" data-k="m-list">${ic('list')}${t('map.list')}</button></div></header>
        ${chips}${body}`
    };
  };

  /* Bottom sheet over the map for the selected center. */
  function sheet(v) {
    const anim = ui.sheetAnim;
    ui.sheetAnim = false;
    return `<section class="sheet ${anim ? 'sheet-in' : ''}" aria-labelledby="sheet-t">
      <div class="sheet-grab" aria-hidden="true"></div>
      <div class="sheet-top"><h2 class="sheet-title" id="sheet-t" tabindex="-1">${esc(v.name)}</h2>
        <button class="icon-btn" data-act="unpick" aria-label="${t('close')}" data-k="sheet-x">${ic('x')}</button></div>
      <p class="sheet-meta">${badge(v)}<span class="meta">${v.km} km · ${t('c.walk', { m: walkMin(v.km) })}</span></p>
      <div class="sheet-cap">${bar(v)}<p class="cap-line"><strong>${v.current} / ${v.max}</strong>${offline() || v.status === 'full' ? '' : `<span>${t('st.left', { n: v.left })}</span>`}</p>${sampleNote()}</div>
      <div class="btn-row">
        <a class="btn btn-secondary" href="#/center/${v.id}" data-k="sheet-details">${t('c.details')}</a>
        <button class="btn btn-primary" data-act="route" data-id="${v.id}" data-k="sheet-route">${ic('navigate')}${t('c.route')}</button>
      </div></section>`;
  }

  const sampleNote = () => `<p class="caption">${t('c.sample')}</p>`;
  const confirmNote = () => `<p class="confirm">${ic('alert')}<span>${t('c.confirm')}</span><a class="btn btn-quiet btn-sm" href="tel:0200000101" data-act="vibrate">${ic('phone')}${t('c.call')}</a></p>`;

  screens.nearest = function () {
    if (!ui.nearestReady) {
      if (!ui.timers.length) {
        ui.timers.push(setTimeout(() => { ui.nearestReady = true; ui.focusOnce = true; if (ui.route && ui.route.name === 'nearest') render(); }, offline() ? 1300 : 1000));
      }
      const msg = offline() ? t('near.loadingOff', { x: fmtAge(120) }) : t('near.loading');
      return { title: t('near.title'), tab: originTab(), html: `${header(t('near.title'), { back: '#/home' })}
        <div class="pg"><p class="loading" role="status"><span class="spinner" aria-hidden="true"></span>${msg}</p>
        <div class="skel" aria-hidden="true"><i class="s1"></i><i class="s2"></i><i class="s3"></i><i class="s4"></i></div></div>` };
    }
    const list = all();
    const closest = list[0];
    const pick = pickSafe();
    const best = pick.v;
    const wantList = pick.want.map((f) => t('fac.' + f)).join(', ');
    const skipped = closest.status === 'full' ? `<p class="skipped">${ic('x-circle')}<span>${t('near.skipped', { name: esc(closest.short), km: closest.km })}</span></p>` : '';
    let main;
    if (best) {
      const others = list.filter((v) => v.status !== 'full' && v.id !== best.id && (pick.relaxed || pick.want.every((f) => v.fac.includes(f)))).slice(0, 2);
      const facs = Object.keys(FAC).filter((f) => best.fac.includes(f));
      main = `${pick.relaxed ? `<p class="skipped skipped-warn">${ic('alert')}<span>${t('near.relaxed', { list: wantList })}</span></p>` : ''}
        <section class="result" aria-labelledby="best-h">
          <p class="row-cap" id="best-h">${t('near.best')}</p>
          <h2 class="result-name">${esc(best.name)}</h2>
          <p class="sheet-meta">${badge(best)}<span class="meta">${best.km} km · ${t('c.walk', { m: walkMin(best.km) })}</span></p>
          ${bar(best, true)}
          <p class="cap-line"><strong>${best.current} / ${best.max}</strong>${offline() ? '' : `<span>${spacesLeft(best)}</span>`}</p>
          ${facs.length ? `<ul class="fac-inline" aria-label="${t('c.facilities')}">${facs.map((f) => `<li>${ic(FAC[f].icon)}${t('fac.' + f)}</li>`).join('')}</ul>` : ''}
          ${pick.want.length && !pick.relaxed ? `<p class="match">${ic('check')}${t('near.matches', { list: wantList })}</p>` : ''}
          ${offline() ? confirmNote() : ''}
          <button class="btn btn-primary btn-lg" data-act="route" data-id="${best.id}" data-k="go-best">${ic('navigate')}${t('c.route')}</button>
          <a class="btn btn-quiet" href="#/center/${best.id}" data-k="best-details">${t('c.details')}</a>
        </section>
        ${others.length ? `<h2 class="h-s">${t('near.others')}</h2><div class="list">${others.map(centerRow).join('')}</div>` : ''}`;
    } else {
      main = `<section class="result"><h2 class="result-name">${t('near.allFull')}</h2><p class="body">${t('near.allFullHelp')}</p>
        <a class="btn btn-primary btn-lg" href="tel:911" data-act="vibrate">${ic('phone')}911</a></section>`;
    }
    return { title: t('near.title'), tab: originTab(), html: `${header(t('near.title'), { back: '#/home' })}<div class="pg">${skipped}${main}</div>` };
  };

  screens.center = function (id) {
    const v = byId(id);
    if (!v) return { redirect: '#/map' };
    const alt = v.status === 'full' ? pickSafe(v.id).v : null;
    const stale = offline();
    const stateLabel = stale ? `${ic('clock')}${t(v.status === 'full' ? 'st.wasFull' : 'st.hadSpace', { x: fmtAge(v.age) })}` : `${ic(ST[v.status].icon)}${t('st.' + v.status)}`;
    let note = '';
    if (stale) note = t('c.confirm');
    else if (v.status === 'full') note = alt ? t('c.tryOther', { name: esc(alt.short), km: alt.km }) : t('near.allFull');
    else note = spacesLeft(v);
    const facList = Object.keys(FAC).map((f) => {
      const has = v.fac.includes(f);
      if (f === 'pwd' && !has) return `<li class="no unv">${ic(FAC[f].icon)}<span>${t('fac.pwd')}: ${t('c.pwdUnverified')}</span></li>`;
      return `<li class="${has ? 'has' : 'no'}">${ic(FAC[f].icon)}<span>${t('fac.' + f)}</span>${has ? '' : `<span class="sr-only">${t('fac.no')}</span>`}</li>`;
    }).join('');
    const walk = walkMin(v.km);
    const actions = alt
      ? `<button class="btn btn-primary btn-lg" data-act="route" data-id="${alt.id}" data-k="route-btn">${ic('navigate')}${t('c.goTo', { name: esc(alt.short), km: alt.km })}</button>
         <button class="btn btn-quiet" data-act="route" data-id="${v.id}" data-k="route-anyway">${t('c.anyway')}</button>`
      : `<button class="btn btn-primary btn-lg" data-act="route" data-id="${v.id}" data-k="route-btn">${ic('navigate')}${t('c.route')}</button>`;
    return {
      title: v.name, tab: originTab(),
      html: `${header(esc(v.name), { back: '#/map' })}
        <div class="pg">
          <section class="panel ${stale ? 'st-stale' : ST[v.status].cls}" aria-label="${t('st.' + v.status)}">
            <div class="panel-top"><span class="panel-state">${stateLabel}</span><span class="panel-num">${v.current} / ${v.max}</span></div>
            ${bar(v, true)}
            <p class="panel-note">${note}</p>
            ${sampleNote()}
            ${stale ? `<a class="btn btn-secondary" href="tel:0200000101" data-act="vibrate">${ic('phone')}${t('c.call')}</a>` : ''}
          </section>
          <ul class="facts">
            <li>${ic('pin')}<span>${esc(brgyOf(v))}, Valenzuela${v.approx ? `<br><strong>${t('c.approx')}</strong>` : ''}</span></li>
            <li>${ic('clock')}<span>${t('c.walk', { m: walk })} · ${t('c.walkSenior', { m: Math.round(walk * 1.5) })}</span></li>
            <li>${ic('shield')}<span><strong>${t('c.tip')}:</strong> ${esc(tipOf(v))}</span></li>
          </ul>
          <section aria-labelledby="fac-h"><h2 class="h-s" id="fac-h">${t('c.facilities')}</h2><ul class="fac-grid">${facList}</ul></section>
          <p class="caption">${t('c.updated', { x: fmtAge(v.age) })}</p>
        </div>
        <div class="actions">${actions}</div>`
    };
  };

  const fmtDist = (m) => (m >= 1000 ? (m / 1000).toFixed(1) + ' km' : Math.max(0, Math.round(m / 10) * 10) + ' m');
  const fmtEta = (c, prog) => { const m = Math.ceil(walkMin(c.km) * (1 - prog)); return m <= 0 ? '< 1 min' : m + ' min'; };

  screens.route = function (id) {
    const c = byId(id);
    if (!c) return { redirect: '#/home' };
    if (!nav || nav.id !== id) { nav = { id, prog: 0, step: 0, n: 1 }; store.recentId = id; save(); }
    const steps = buildSteps(c);
    const n = steps.length;
    nav.n = n;
    nav.step = Math.min(n - 1, Math.floor(nav.prog * n));
    const s = steps[nav.step];
    const next = steps[nav.step + 1];
    const pct = Math.round(nav.prog * 100);
    const lead = s.kind === 'dir' ? `<span class="arrow" style="transform:rotate(${s.deg}deg)">${ic('arrow', 'ic-xl')}</span>` : ic(s.icon, 'ic-xl');
    return {
      title: t('route.to', { name: c.short }), tab: null, startsSim: true, cls: 'is-route',
      html: `${header(t('route.to', { name: esc(c.short) }), { back: '#/center/' + id })}
        <section class="instr" aria-live="polite">
          <div class="instr-main"><span class="instr-ic">${lead}</span>
            <div><p class="instr-text">${s.kind === 'tip' ? `<span class="instr-tag">${t('step.tip')}</span>` : ''}${esc(s.text)}</p>${s.kind === 'dir' ? `<p class="instr-dist">${s.meters} m</p>` : ''}</div></div>
          ${next && next.kind === 'dir' ? `<p class="instr-next">${esc(t('step.then', { text: next.text }))}</p>` : ''}
          <p class="instr-safe">${ic('shield')}${t('route.safe')}</p>
          <div class="instr-bar" id="rt-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="${t('route.progress')}"><span id="rt-fill" style="width:${pct}%"></span></div>
        </section>
        <div class="map-stage map-route">${mapSvg({ pins: [c], routeTo: c, f: nav.prog, static: true })}</div>
        <div class="route-foot">
          <p class="route-stats" id="rt-stats">${t('route.stats', { d: `<strong id="rt-dist">${fmtDist(c.km * 1000 * (1 - nav.prog))}</strong>`, m: `<span id="rt-eta">${fmtEta(c, nav.prog)}</span>` })}</p>
          <button class="btn btn-secondary" data-act="stop-nav" data-k="stop">${ic('x')}${t('route.stop')}</button>
        </div>
        <p class="sim-note">${ic('locate')}${t('route.sim')}</p>`
    };
  };

  /* Simulated GPS: the marker advances along the route by itself (no taps), pausing while a dialog is open. */
  const STEP_MS = 4500; // each direction step takes about 4.5 s, so a 3-4 step demo route lasts 14-18 s
  const sim = { raf: 0, last: 0, acc: 0 };
  const reducedMotion = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function stopSim() { cancelAnimationFrame(sim.raf); sim.raf = 0; }

  function updateLive(c) {
    const w = walkRoute(routeFor(c).pts, nav.prog);
    const pts = w.done.map((p) => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ');
    const done = $('#rt-done'), casing = $('#rt-done-casing'), pos = $('#rt-pos'), ang = $('#rt-ang');
    if (done) done.setAttribute('points', pts);
    if (casing) casing.setAttribute('points', pts);
    if (pos && mp) { const [x, y] = toPx(w.pos.x, w.pos.y); pos.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`); }
    if (ang) ang.setAttribute('transform', `rotate(${w.ang})`);
    const pct = Math.round(nav.prog * 100);
    const set = (sel, v) => { const el = $(sel); if (el) el.textContent = v; };
    set('#rt-dist', fmtDist(c.km * 1000 * (1 - nav.prog))); set('#rt-eta', fmtEta(c, nav.prog));
    const fill = $('#rt-fill'), bar = $('#rt-bar');
    if (fill) fill.style.width = pct + '%';
    if (bar) bar.setAttribute('aria-valuenow', pct);
  }

  function startSim() {
    if (sim.raf) return;
    sim.last = performance.now(); sim.acc = 0;
    const tick = (now) => {
      sim.raf = requestAnimationFrame(tick);
      const dt = Math.max(0, Math.min(now - sim.last, 250)); sim.last = now;
      if (!nav || dialogOpen()) return; // paused while the leave/stop confirmation is open
      const c = byId(nav.id);
      if (!c) return;
      if (reducedMotion()) {
        sim.acc += dt;
        if (sim.acc < STEP_MS) return;
        sim.acc = 0;
        nav.prog = Math.min(1, Math.round(nav.prog * nav.n + 1) / nav.n);
      } else {
        nav.prog = Math.min(1, nav.prog + dt / (STEP_MS * nav.n));
      }
      if (nav.prog >= 1) {
        const id = nav.id; nav = null; stopSim(); buzz([60, 40, 60]);
        go('#/arrived/' + id);
        return;
      }
      if (Math.min(nav.n - 1, Math.floor(nav.prog * nav.n)) !== nav.step) { buzz(15); render(); } else updateLive(c);
    };
    sim.raf = requestAnimationFrame(tick);
  }

  screens.arrived = function (id) {
    const c = byId(id);
    if (!c) return { redirect: '#/home' };
    if (store.recentId !== id) { store.recentId = id; save(); }
    return {
      title: t('arr.title'), tab: null,
      html: `<div class="pg pg-arrived">
        <section class="arrived">
          <div class="big-check" aria-hidden="true">${ic('check', 'ic-xl')}</div>
          <h1 class="h-d" tabindex="-1">${t('arr.title')}</h1>
          <p class="arrived-name">${esc(c.name)}</p>
        </section>
        <section aria-labelledby="next-h"><h2 class="h-s" id="next-h">${t('arr.next')}</h2>
          <ol class="next-steps">${[1, 2, 3, 4].map((i) => `<li>${t('arr.n' + i)}</li>`).join('')}</ol></section>
        <div class="btn-col">
          <a class="btn btn-primary btn-lg" href="#/share/${c.id}" data-k="share-now">${ic('share')}${t('share.title')}</a>
          <a class="btn btn-quiet" href="#/home">${t('arr.home')}</a>
        </div></div>`
    };
  };

  const defaultShareId = () => store.recentId || (pickSafe().v || all()[0]).id;
  const shareMessage = (v) => t('share.default', { name: v.name, brgy: brgyOf(v) });

  screens.share = function (arg) {
    if (arg && byId(arg) && arg !== ui.shareId) { ui.shareId = arg; ui.shareDirty = false; }
    if (!ui.shareId || !byId(ui.shareId)) { ui.shareId = defaultShareId(); ui.shareDirty = false; }
    const v = byId(ui.shareId);
    if (!ui.shareDirty) ui.shareText = shareMessage(v);
    const canShare = typeof navigator.share === 'function';
    return {
      title: t('share.title'), tab: originTab(),
      html: `${header(t('share.title'), { back: '#/home' })}
        <div class="pg">
          <div class="field"><label for="share-center">${t('share.where')}</label>
            <select id="share-center" data-set="shareCenter" data-k="share-center">${all().map((c) => `<option value="${c.id}" ${c.id === v.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></div>
          <div class="field"><label for="share-text">${t('share.msg')}</label>
            <div class="ta-wrap"><textarea id="share-text" rows="5" data-k="share-text">${esc(ui.shareText)}</textarea>
              <button class="icon-btn ta-reset" data-act="share-reset" aria-label="${t('share.reset')}" data-k="share-reset">${ic('refresh')}</button></div></div>
          <div class="btn-col">
            <a class="btn btn-primary btn-lg" id="sms-link" href="sms:?body=${encodeURIComponent(ui.shareText)}" data-act="sms" data-k="sms">${ic('sms')}${t('share.sms')}</a>
            <button class="btn btn-secondary" data-act="share-native" data-k="share-native">${ic(canShare ? 'share' : 'copy')}${canShare ? t('share.more') : t('share.copy')}</button>
          </div></div>`
    };
  };

  screens.hotlines = function () {
    const sos = READY.hotlines.find((h) => h.id === 'n911');
    const rest = READY.hotlines.filter((h) => h.id !== 'n911');
    const num = (h, n) => `<li><a class="row hot-num" href="tel:${n.tel}" data-act="vibrate" aria-label="${t('hot.call')} ${esc(h.name)} ${esc(n.number)}${n.carrier ? ' ' + esc(n.carrier) : ''}">
        <span class="row-main"><span class="hot-n">${esc(n.number)}${n.carrier ? ` <b class="carrier">(${esc(n.carrier)})</b>` : ''}</span></span>
        <span class="call-ic">${ic('phone')}</span></a></li>`;
    const row = (h) => h.more ? `<li class="hot-group">
        <div class="hot-head"><span class="row-title">${esc(h.name)}</span></div>
        <ul class="hot-nums">${[h].concat(h.more).map((n) => num(h, n)).join('')}</ul>
        ${h.desc ? `<p class="row-help hot-foot">${esc(L(h.desc))}</p>` : ''}</li>`
      : `<li><a class="row hot-row" href="tel:${h.tel}" data-act="vibrate" aria-label="${t('hot.call')} ${esc(h.name)} ${esc(h.number)}">
        <span class="row-main"><span class="row-title">${esc(h.name)}</span>
          <span class="row-sub"><span class="meta">${esc(h.number)}</span>${h.verified ? '' : `<span class="tag">${t('hot.sample')}</span>`}</span>
          ${h.desc ? `<span class="row-help">${esc(L(h.desc))}</span>` : ''}</span>
        <span class="call-ic">${ic('phone')}</span></a></li>`;
    return {
      title: t('hot.title'), tab: 'hotlines',
      html: `${header(t('hot.title'), { root: true })}
        <div class="pg">
          <a class="sos" href="tel:${sos.tel}" data-act="vibrate" aria-label="${t('hot.call')} ${esc(sos.number)}, ${t('hot.n911')}">
            <span class="sos-text"><span class="sos-num">${esc(sos.number)}</span><span class="sos-sub">${t('hot.n911')}</span></span>
            <span class="sos-call">${ic('phone', 'ic-lg')}</span></a>
          <ul class="list">${rest.map(row).join('')}</ul>
          <p class="caption">${t('hot.note')}</p>
        </div>`
    };
  };

  screens.alerts = function () {
    const anyDanger = READY.alerts.some((a) => a.sev === 'danger');
    return {
      title: t('alerts.title'), tab: 'alerts',
      html: `${header(t('alerts.title'), { root: true })}
        <div class="pg">
          ${anyDanger ? `<button class="btn btn-primary btn-lg" data-act="find" data-k="alerts-find">${ic('find')}${t('home.find')}</button>` : ''}
          <ul class="alert-list">${READY.alerts.map((a) => alertCard(a, false, 'li')).join('')}</ul>
          <p class="caption">${t('alerts.source')}</p>
        </div>`
    };
  };

  function radioGroup(name, label, options, current) {
    return `<fieldset class="set-group"><legend>${label}</legend><div class="seg">${options.map((o) => `<label class="seg-opt">
      <input type="radio" name="${name}" value="${o.value}" data-set="${name}" data-k="${name}-${o.value}" ${current === o.value ? 'checked' : ''}><span>${o.label}</span></label>`).join('')}</div></fieldset>`;
  }

  screens.settings = function () {
    const s = store.settings;
    return {
      title: t('set.title'), tab: 'settings',
      html: `${header(t('set.title'), { root: true })}
        <div class="pg">
          <section aria-labelledby="disp-h"><h2 class="h-s" id="disp-h">${t('set.display')}</h2>
            <div class="list list-pad">
              ${radioGroup('textSize', t('set.size'), [{ value: 'normal', label: t('set.size.normal') }, { value: 'large', label: t('set.size.large') }, { value: 'xl', label: t('set.size.xl') }], s.textSize)}
              ${radioGroup('lang', t('set.lang'), [{ value: 'en', label: 'English' }, { value: 'fil', label: 'Filipino' }], s.lang)}
              ${switchRow('contrast', t('set.contrast'), t('set.contrastHelp'), s.contrast)}
            </div></section>
          <section aria-labelledby="proto-h"><h2 class="h-s" id="proto-h">${t('set.proto')}</h2>
            <div class="list">
              ${switchRow('offline', t('set.offline'), t('set.offlineHelp'), s.offline)}
              <button class="row row-btn" data-act="replay" data-k="replay"><span class="row-main"><span class="row-title">${t('set.replay')}</span></span>${ic('chevron', 'row-chev')}</button>
              <div class="row"><span class="row-main"><span class="row-title">${t('set.about')}</span><span class="row-help">${t('set.aboutBody')}</span></span></div>
            </div></section>
        </div>`
    };
  };

  screens.onboarding = function () {
    const total = 3;
    const step = ui.obStep;
    const dl = ui.dl;
    let body, foot;
    if (step === 0) {
      body = `<h1 class="h-d" tabindex="-1">${t('ob.cityTitle')}</h1>
        <fieldset class="city-list"><legend class="sr-only">${t('ob.cityTitle')}</legend>
          <label class="row city"><input type="radio" name="city" checked><span class="row-main"><span class="row-title">Valenzuela City</span><span class="row-help">CDRRMO Valenzuela</span></span>${ic('check-circle', 'city-ok')}</label>
        </fieldset>
        <p class="caption">${t('ob.more')}</p>
        <div class="ob-map" aria-hidden="true">${mapSvg({ pins: all(), static: true, plain: true })}</div>`;
      foot = `<button class="btn btn-primary btn-lg" data-act="ob-next" data-k="ob-next">${t('ob.next')}</button>`;
    } else if (step === 1) {
      body = `<div class="ob-art">${ic('find', 'ic-art')}</div><h1 class="h-d" tabindex="-1">${t('ob.locTitle')}</h1><p class="body">${t('ob.locBody')}</p>
        ${ui.loc ? `<p class="ok-line" role="status">${ic('check-circle')}${t('ob.locOk')}</p>` : ''}`;
      foot = ui.loc
        ? `<button class="btn btn-primary btn-lg" data-act="ob-next" data-k="ob-next">${t('ob.next')}</button>`
        : `<button class="btn btn-primary btn-lg" data-act="ob-loc" data-k="ob-loc">${t('ob.locAllow')}</button><button class="btn btn-quiet" data-act="ob-next" data-k="ob-later">${t('ob.locLater')}</button>`;
    } else {
      body = `<div class="ob-art">${ic('download', 'ic-art')}</div><h1 class="h-d" tabindex="-1">${t('ob.dlTitle')}</h1><p class="body">${t('ob.dlBody')}</p>
        ${dl.state === 'run' ? `<div class="dl"><div class="bar bar-big" id="dl-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${dl.pct}" aria-label="${t('ob.dlTitle')}"><span class="bar-fill bar-brand" id="dl-fill" style="width:${dl.pct}%"></span></div>
            <p class="cap-line" id="dl-pct">${t('ob.dlRun', { n: dl.pct })}</p></div>` : ''}
        ${dl.state === 'done' ? `<p class="ok-line" role="status">${ic('check-circle')}${t('ob.dlDone')}</p>` : ''}`;
      foot = dl.state === 'idle' ? `<button class="btn btn-primary btn-lg" data-act="ob-dl" data-k="ob-dl">${t('ob.dl')}</button>`
        : dl.state === 'run' ? `<button class="btn btn-secondary" data-act="ob-dl-cancel" data-k="ob-dl-cancel">${t('ob.dlCancel')}</button>`
          : `<button class="btn btn-primary btn-lg" data-act="ob-finish" data-k="ob-finish">${t('ob.start')}</button>`;
    }
    const canBack = step > 0 && dl.state !== 'done';
    return {
      title: 'ReadyPH', tab: null, noNav: true, cls: 'is-ob',
      html: `<div class="ribbon" aria-hidden="true"></div>
        <header class="ob-head">
          ${canBack ? `<button class="icon-btn" data-act="ob-back" aria-label="${t('back')}" data-k="ob-back">${ic('back')}</button>` : ''}
          <span class="wordmark"><i aria-hidden="true"></i>ReadyPH</span>
          <button class="btn btn-quiet btn-sm" data-act="ob-skip" data-k="ob-skip">${t('ob.skip')}</button>
        </header>
        <div class="steps" role="img" aria-label="${t('ob.step', { a: step + 1, b: total })}">${[0, 1, 2].map((i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>
        <section class="ob-body">${body}</section>
        <div class="ob-foot">${foot}</div>`
    };
  };

  /* ---------- chrome (offline strip, navigating bar, tab bar) ---------- */
  const TABS = [['home', 'home'], ['map', 'map'], ['hotlines', 'phone'], ['alerts', 'bell'], ['settings', 'sliders']];

  function renderChrome(out, routeName) {
    const conn = $('#conn');
    conn.className = 'conn' + (offline() ? ' conn-off' : '');
    conn.innerHTML = offline() ? `${ic('wifi-off')}<span>${t('conn.offline', { x: fmtAge(120) })}</span>` : '';

    const pinHost = $('#pinbar');
    const pc = nav ? byId(nav.id) : null;
    if (pc && !out.noNav && !['route', 'arrived', 'home'].includes(routeName)) {
      pinHost.innerHTML = `<a class="navbar" href="#/route/${pc.id}" data-k="pinbar">${ic('navigate')}<span class="navbar-text">${esc(t('route.paused', { name: pc.short }))}</span><span class="navbar-go">${t('route.resume')}${ic('chevron')}</span></a>`;
    } else pinHost.innerHTML = '';

    const tabbar = $('#tabbar');
    tabbar.hidden = !!out.noNav;
    tabbar.innerHTML = TABS.map(([k, icon]) => `<a href="#/${k}" class="${out.tab === k ? 'on' : ''}" ${out.tab === k ? 'aria-current="page"' : ''} data-k="tab-${k}">${ic(icon)}<span>${t('nav.' + k)}</span></a>`).join('');
    $('#skip').textContent = t('skip');
  }

  function applySettings() {
    const s = store.settings;
    const root = document.documentElement;
    root.lang = s.lang === 'fil' ? 'fil' : 'en';
    root.classList.toggle('ts-large', s.textSize === 'large');
    root.classList.toggle('ts-xl', s.textSize === 'xl');
    document.body.classList.toggle('hc', !!s.contrast);
  }

  /* ---------- router + render ---------- */
  function parse() {
    const m = location.hash.match(/^#\/([^/?]*)(?:\/([^?]*))?/);
    return m ? { name: m[1] || 'home', arg: m[2] ? decodeURIComponent(m[2]) : null } : { name: 'home', arg: null };
  }
  const go = (hash) => { location.hash = hash; };

  function route() {
    if (!store.onboarded && parse().name !== 'onboarding') history.replaceState(null, '', '#/onboarding');
    const target = location.hash;
    const r = parse();
    const prev = ui.route;
    if (prev && prev.name === 'route' && nav && r.name !== 'route' && r.name !== 'arrived' && !ui.allowLeave) {
      history.replaceState(null, '', ui.hash);
      confirmLeave(target);
      return;
    }
    ui.allowLeave = false;
    render(r);
  }

  function confirmLeave(target) {
    openDialog({
      title: t('route.leaveTitle'), body: t('route.leaveBody'), icon: 'navigate', tone: 'info',
      actions: [
        { label: t('route.stay'), kind: 'primary' },
        { label: t('route.keep'), kind: 'secondary', run: () => { ui.allowLeave = true; go(target); } },
        { label: t('route.stopConfirm'), kind: 'danger', run: () => { nav = null; toast(t('route.stopped')); go(target); } }
      ]
    });
  }

  function render(r) {
    r = r || parse();
    const routeChanged = !ui.route || ui.route.name !== r.name || ui.route.arg !== r.arg;
    if (!ui.route || ui.route.name !== r.name) { ui.timers.forEach(clearTimeout); ui.timers = []; }
    const view = $('#view');
    const focusKey = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.k : null;
    const scroll = view.scrollTop;

    const sc = screens[r.name] || screens.home;
    const out = sc(r.arg);
    if (out.redirect) { history.replaceState(null, '', out.redirect); render(); return; }

    if (!out.startsSim) stopSim();
    ui.route = r;
    ui.hash = location.hash || '#/home';
    if (['home', 'map', 'hotlines', 'alerts', 'settings'].includes(out.tab)) ui.originTab = out.tab;
    document.title = out.title + ' · ReadyPH';
    if (routeChanged && toast.at && Date.now() - toast.at > 400) hideToast(); // a toast must not linger over the next screen's actions
    view.className = 'view' + (out.cls ? ' ' + out.cls : '') + (routeChanged ? ' enter' : '');
    view.innerHTML = out.html;
    renderChrome(out, r.name);
    positionMap();

    if (out.startsSim) startSim();

    if (routeChanged || ui.focusOnce) {
      ui.focusOnce = false;
      view.scrollTop = 0;
      const h1 = $('h1', view);
      if (h1) h1.focus({ preventScroll: true });
    } else {
      view.scrollTop = scroll;
      if (focusKey) {
        const el = view.querySelector(`[data-k="${focusKey}"]`) || document.querySelector(`[data-k="${focusKey}"]`);
        if (el) el.focus({ preventScroll: true });
      }
    }
  }

  /* ---------- actions (event delegation) ---------- */
  function startRoute(id) {
    const c = byId(id);
    if (!c) return;
    if (c.status === 'full') {
      const alt = pickSafe(c.id).v;
      openDialog({
        title: t('c.fullTitle', { name: c.short }), icon: 'alert', tone: 'bad',
        body: alt ? t('c.fullBody', { alt: alt.short, km: alt.km }) : t('near.allFull') + ' ' + t('near.allFullHelp'),
        actions: [
          alt ? { label: t('c.goTo', { name: alt.short, km: alt.km }), kind: 'primary', run: () => go('#/route/' + alt.id) } : { label: '911', kind: 'primary', href: 'tel:911', icon: 'phone' },
          { label: t('c.goAnyway'), kind: 'secondary', run: () => go('#/route/' + c.id) },
          { label: t('cancel'), kind: 'quiet' }
        ]
      });
      return;
    }
    buzz(20);
    go('#/route/' + id);
  }

  async function copyText(text) {
    try { if (navigator.clipboard && window.isSecureContext !== false) { await navigator.clipboard.writeText(text); return true; } } catch (e) { /* fall through */ }
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }
  async function copyWithToast() { toast((await copyText(ui.shareText)) ? t('share.copied') : t('share.copyFail')); }

  const acts = {
    skip(el, e) { e.preventDefault(); $('#view').focus(); },
    vibrate() { buzz(30); },
    back(el) { if (ui.navCount > 0) history.back(); else go(el.dataset.fallback || '#/home'); },
    find() { buzz(30); ui.nearestReady = false; go('#/nearest'); },
    'show-list'() { ui.mapMode = 'list'; },
    mode(el) { ui.mapMode = el.dataset.mode; render(); },
    filter(el) {
      const f = el.dataset.f;
      if (ui.filters.has(f)) ui.filters.delete(f); else ui.filters.add(f);
      buzz(10); render();
    },
    'clear-filters'() {
      const before = [...ui.filters];
      ui.filters.clear(); render(); buzz(15);
      toast(t('map.cleared'), { label: t('undo'), fn: () => { before.forEach((f) => ui.filters.add(f)); render(); } });
    },
    pin(el) {
      ui.sheetAnim = !ui.pinId;
      ui.pinId = el.dataset.id; buzz(10); render();
      const h = $('.sheet-title'); if (h) h.focus({ preventScroll: true });
    },
    unpick() {
      if (!ui.pinId) return;
      const was = ui.pinId;
      ui.pinId = null; render();
      const p = document.querySelector(`[data-k="pin-${was}"]`); if (p) p.focus({ preventScroll: true });
    },
    'zoom-in'(el) { if (el.getAttribute('aria-disabled') !== 'true') zoomBy(2); },
    'zoom-out'(el) { if (el.getAttribute('aria-disabled') !== 'true') zoomBy(0.5); },
    recenter() { recenter(); },
    cluster(el, e) { buzz(10); zoomToCluster(el.dataset.ids.split(','), e.detail === 0); },
    route(el) { startRoute(el.dataset.id); },
    'stop-nav'() {
      const id = nav.id;
      openDialog({
        title: t('route.stop') + '?', body: t('route.leaveBody'), icon: 'navigate', tone: 'info',
        actions: [
          { label: t('route.stay'), kind: 'primary' },
          { label: t('route.stopConfirm'), kind: 'danger', run: () => { nav = null; stopSim(); toast(t('route.stopped')); ui.allowLeave = true; go('#/center/' + id); } }
        ]
      });
    },
    unpin() {
      const prevId = store.recentId;
      store.recentId = null; save(); render();
      toast(t('toast.unpinned'), { label: t('undo'), fn: () => { store.recentId = prevId; save(); render(); } });
    },
    sms() { buzz(20); toast(t('share.smsOk')); },
    async 'share-native'() {
      buzz(20);
      if (typeof navigator.share === 'function') {
        try { await navigator.share({ text: ui.shareText }); toast(t('share.shared')); } catch (e) { if (e && e.name !== 'AbortError') await copyWithToast(); }
      } else await copyWithToast();
    },
    'share-reset'() { ui.shareDirty = false; render(); toast(t('share.resetOk')); },
    replay() { ui.obStep = 0; ui.loc = false; ui.dl = { state: 'idle', pct: 0 }; go('#/onboarding'); },
    'ob-next'() { ui.obStep = Math.min(2, ui.obStep + 1); render(); const h = $('h1', $('#view')); if (h) h.focus({ preventScroll: true }); },
    'ob-back'() { ui.obStep = Math.max(0, ui.obStep - 1); render(); const h = $('h1', $('#view')); if (h) h.focus({ preventScroll: true }); },
    'ob-loc'() { ui.loc = true; buzz(20); render(); },
    'ob-skip'() { store.onboarded = true; save(); go('#/home'); toast(t('ob.skipped')); },
    'ob-finish'() { store.onboarded = true; save(); buzz([40, 30, 40]); go('#/home'); },
    'ob-dl'() {
      ui.dl = { state: 'run', pct: 0 }; render();
      const timer = setInterval(() => {
        ui.dl.pct = Math.min(100, ui.dl.pct + 4 + Math.floor(Math.random() * 7));
        if (ui.dl.pct >= 100) { clearInterval(timer); ui.dl.state = 'done'; render(); return; }
        const fill = $('#dl-fill'), pct = $('#dl-pct'), b = $('#dl-bar');
        if (fill) { fill.style.width = ui.dl.pct + '%'; pct.textContent = t('ob.dlRun', { n: ui.dl.pct }); b.setAttribute('aria-valuenow', ui.dl.pct); }
      }, 140);
      ui.timers.push(timer);
    },
    'ob-dl-cancel'() { ui.timers.forEach(clearTimeout); ui.timers = []; ui.dl = { state: 'idle', pct: 0 }; render(); toast(t('cancel')); },
    'toast-action'() { const fn = toast.action; hideToast(); if (fn) fn(); },
    'dialog-action'(el) {
      const a = openDialog.actions[Number(el.dataset.i)];
      closeDialog();
      if (a && a.run) a.run();
    },
    'dialog-dismiss'() { closeDialog(); }
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (el && acts[el.dataset.act]) { acts[el.dataset.act](el, e); return; }
    const dlgLink = e.target.closest('[data-dlg]');
    if (dlgLink) closeDialog();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialogOpen()) { e.preventDefault(); closeDialog(); return; }
    if (e.key === 'Escape' && ui.pinId && ui.route && ui.route.name === 'map') { e.preventDefault(); acts.unpick(); return; }
    if (e.key === 'Tab' && dialogOpen()) {
      const items = [...document.querySelectorAll('#modal-root .btn')];
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role="button"][data-act]')) {
      e.preventDefault();
      e.target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  });

  document.addEventListener('change', (e) => {
    const el = e.target;
    const key = el.dataset && el.dataset.set;
    if (!key) return;
    const s = store.settings;
    if (key === 'textSize') s.textSize = el.value;
    else if (key === 'lang') { s.lang = el.value; }
    else if (key === 'contrast') s.contrast = el.checked;
    else if (key === 'offline') { s.offline = el.checked; toast(t(el.checked ? 'toast.offlineOn' : 'toast.offlineOff')); buzz(20); }
    else if (key === 'shareCenter') { ui.shareId = el.value; render(); return; }
    save(); applySettings(); render();
    if (key === 'lang') toast(t('toast.lang'));
  });

  document.addEventListener('input', (e) => {
    const el = e.target;
    if (el.id === 'share-text') {
      ui.shareText = el.value; ui.shareDirty = true;
      const link = $('#sms-link'); if (link) link.setAttribute('href', 'sms:?body=' + encodeURIComponent(ui.shareText));
    }
  });

  window.addEventListener('hashchange', () => { ui.navCount += 1; route(); });

  /* ---------- boot ---------- */
  applySettings();
  bindMapInput();
  if (!location.hash) history.replaceState(null, '', '#/home');
  route();
})();

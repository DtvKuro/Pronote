/* ReadyPH prototype logic. Plain JS, no build step, no network. All data is mocked (see data.js). */
(function () {
  'use strict';

  const READY = window.READY;
  const you = READY.you;
  const streets = READY.streets;

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
    filters: new Set(), mapMode: 'map', pinId: null,
    nearestReady: false,
    shareId: null, shareText: '', shareDirty: false,
    obStep: 0, loc: false, dl: { state: 'idle', pct: 0 }
  };
  let nav = null; // active navigation: { id, step }
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

  /* ---------- derived center data ---------- */
  const statusOf = (cur, max) => (cur >= max ? 'full' : cur / max >= 0.85 ? 'almost' : 'available');

  function viewOf(c) {
    const current = c.current;
    const updatedAt = BOOT - c.updatedMins * 60000;
    const offlineShift = store.settings.offline ? 120 : 0; // the saved copy is about 2h older than live data
    const age = Math.max(0, Math.round((Date.now() - updatedAt) / 60000)) + offlineShift;
    const pct = Math.min(100, Math.round((current / c.max) * 100));
    return Object.assign({}, c, { current, age, pct, left: Math.max(0, c.max - current), status: statusOf(current, c.max) });
  }
  const all = () => READY.centers.map(viewOf).sort((a, b) => a.km - b.km);
  const byId = (id) => { const c = READY.centers.find((x) => x.id === id); return c ? viewOf(c) : null; };
  const nearestAvailable = (excludeId) => all().find((v) => v.status !== 'full' && v.id !== excludeId) || null;
  const walkMin = (km) => Math.max(1, Math.round(km * 13));

  function fmtAge(m) {
    if (m < 1) return t('justNow');
    return t('ago', { x: m < 60 ? m + ' min' : Math.floor(m / 60) + 'h' });
  }

  /* ---------- UI building blocks ---------- */
  const ic = (name, cls) => `<svg class="ic ${cls || ''}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
  const ST = { available: { icon: 'check-circle', cls: 'st-ok' }, almost: { icon: 'alert', cls: 'st-warn' }, full: { icon: 'ban', cls: 'st-bad' } };
  const FAC = { pwd: { icon: 'wheelchair' }, medical: { icon: 'medical' }, pets: { icon: 'paw' }, food: { icon: 'drop' } };

  const badge = (status) => `<span class="badge ${ST[status].cls}">${ic(ST[status].icon)}<span>${t('st.' + status)}</span></span>`;

  function leftText(v) { return v.left === 0 ? t('st.none') : t('st.left', { n: v.left }); }

  function bar(v, big) {
    return `<div class="cap ${big ? 'cap-big' : ''}">
      <div class="bar" role="img" aria-label="${v.current} of ${v.max} people, ${v.pct} percent full"><span class="bar-fill ${ST[v.status].cls}" style="width:${v.pct}%"></span></div>
      <div class="cap-text"><strong>${v.current} / ${v.max}</strong><span>${leftText(v)}</span></div>
    </div>`;
  }

  const facChips = (v) => v.fac.length
    ? `<ul class="chips">${v.fac.map((f) => `<li class="chip-static">${ic(FAC[f].icon)}${t('fac.' + f)}</li>`).join('')}</ul>` : '';

  const updatedLine = (v) => `${ic('clock')}<span>${t('c.updated', { x: fmtAge(v.age) })}${store.settings.offline ? ' (' + t('c.saved') + ')' : ''}</span>`;

  function centerCard(v) {
    return `<a class="card center-card" href="#/center/${v.id}" data-k="card-${v.id}">
      <div class="cc-top"><h3>${esc(v.name)}</h3>${badge(v.status)}</div>
      <p class="cc-meta">${ic('pin')}${v.km} km · ${t('c.walk', { m: walkMin(v.km) })}</p>
      ${bar(v)}
      ${facChips(v)}
      <p class="cc-foot">${updatedLine(v)}</p>
    </a>`;
  }

  function header(title, opts) {
    const o = opts || {};
    return `<header class="screen-head">
      ${o.back ? `<button class="icon-btn" data-act="back" data-fallback="${o.back}" aria-label="${t('back')}" data-k="back">${ic('back')}</button>` : ''}
      <h1 tabindex="-1">${title}</h1>
      ${o.extra || ''}
    </header>`;
  }

  /* ---------- schematic SVG map (no tiles, no network) ---------- */
  const MAP_BASE = (function () {
    const xs = [0, 130, 200, 270, 340], ys = [0, 70, 150, 230, 310, 390, 440];
    let blocks = '';
    for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
      blocks += `<rect x="${xs[i] + 8}" y="${ys[j] + 8}" width="${xs[i + 1] - xs[i] - 16}" height="${ys[j + 1] - ys[j] - 16}" rx="6" fill="#DCE5F1"/>`;
    }
    const roadsV = [130, 200, 270].map((x) => `<line x1="${x}" y1="0" x2="${x}" y2="440"/>`).join('');
    const roadsH = [70, 150, 230, 310, 390].map((y) => `<line x1="0" y1="${y}" x2="340" y2="${y}"/>`).join('');
    const north = 'M-10,22 C90,40 210,2 350,26';
    const south = 'M-10,428 C80,408 170,440 350,416';
    const nlex = 'M92,-10 C92,150 110,300 98,450';
    return `<rect width="340" height="440" fill="#EDF2F9"/>
      ${blocks}
      <path d="${south}" fill="none" stroke="#C5D9F1" stroke-width="56" stroke-linecap="round" opacity=".75"/>
      <g stroke="#FFFFFF" stroke-width="9" stroke-linecap="round">${roadsV}${roadsH}</g>
      <g stroke="#C3CFE0" stroke-width="1" stroke-dasharray="3 5">${roadsV}${roadsH}</g>
      <path d="${nlex}" fill="none" stroke="#5B6B86" stroke-width="10" stroke-linecap="round"/>
      <path d="${nlex}" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="6 6"/>
      <path d="${north}" fill="none" stroke="#8DBBEA" stroke-width="16" stroke-linecap="round"/>
      <path d="${south}" fill="none" stroke="#8DBBEA" stroke-width="18" stroke-linecap="round"/>
      <text class="map-label" x="8" y="12" fill="#27528A">Meycauayan / Polo River</text>
      <text class="map-label" x="150" y="437" fill="#27528A">Tullahan River</text>
      <text class="map-label" x="8" y="408" fill="#27528A">Flood-prone area</text>
      <text class="map-label" x="86" y="238" transform="rotate(-90 86 238)" text-anchor="middle" fill="#3A4A66">NLEX</text>
      <text class="map-label" x="206" y="112" transform="rotate(-90 206 112)" text-anchor="middle" fill="#5A6B88">MacArthur Hwy.</text>`;
  })();

  function pinShape(st, x, y) {
    if (st === 'available') return `<circle cx="${x}" cy="${y}" r="14" class="pin-${st}"/>`;
    if (st === 'almost') return `<polygon points="${x},${y - 18} ${x + 18},${y} ${x},${y + 18} ${x - 18},${y}" class="pin-${st}"/>`;
    return `<rect x="${x - 14}" y="${y - 14}" width="28" height="28" rx="5" class="pin-${st}"/>`;
  }

  function routePoints(c) {
    if (c.x === you.x || c.y === you.y) return [you, { x: c.x, y: c.y }];
    return [you, { x: you.x, y: c.y }, { x: c.x, y: c.y }];
  }
  const segLen = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

  function walkRoute(pts, f) {
    const lens = pts.slice(1).map((p, i) => segLen(pts[i], p));
    let target = lens.reduce((a, b) => a + b, 0) * f;
    const done = [pts[0]];
    for (let i = 0; i < lens.length; i++) {
      if (target >= lens[i]) { done.push(pts[i + 1]); target -= lens[i]; continue; }
      const k = target / lens[i];
      const p = { x: pts[i].x + (pts[i + 1].x - pts[i].x) * k, y: pts[i].y + (pts[i + 1].y - pts[i].y) * k };
      done.push(p);
      return { done, pos: p };
    }
    return { done, pos: pts[pts.length - 1] };
  }

  function routeView(c) {
    const pad = 60, ratio = 0.66;
    let w = Math.max(Math.abs(c.x - you.x) + pad * 2, 220), h = Math.max(Math.abs(c.y - you.y) + pad * 2, w * ratio);
    w = Math.max(w, h / ratio);
    w = Math.min(w, 340); h = Math.min(w * ratio, 440);
    const x = Math.max(0, Math.min(340 - w, (c.x + you.x) / 2 - w / 2));
    const y = Math.max(0, Math.min(440 - h, (c.y + you.y) / 2 - h / 2));
    return [x, y, w, h].map((n) => Math.round(n)).join(' ');
  }

  /* opts: pins (center views), dim (Set of ids), activeId, routeTo (center view) + f (progress 0..1) */
  function mapSvg(opts) {
    const o = opts || {};
    let routeSvg = '';
    if (o.routeTo) {
      const pts = routePoints(o.routeTo);
      const w = walkRoute(pts, o.f || 0);
      const str = (arr) => arr.map((p) => p.x + ',' + p.y).join(' ');
      routeSvg = `<polyline points="${str(pts)}" fill="none" stroke="#0B2A5B" stroke-width="5" stroke-dasharray="2 9" stroke-linecap="round" opacity=".55"/>
        <polyline id="rt-done" points="${str(w.done)}" fill="none" stroke="#1456C9" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <g id="rt-pos" transform="translate(${w.pos.x} ${w.pos.y})"><circle r="13" fill="#1456C9" stroke="#fff" stroke-width="3"/><use href="#i-navigate" x="-8" y="-8" width="16" height="16" class="ic-svg"/></g>`;
    }
    const pins = (o.pins || []).map((v) => {
      const dim = o.dim && o.dim.has(v.id);
      const active = o.activeId === v.id;
      const label = `${v.name}, ${v.km} km, ${t('st.' + v.status)}`;
      const shape = pinShape(v.status, v.x, v.y);
      const inner = `<use href="#i-${v.status === 'available' ? 'check' : v.status === 'almost' ? 'alert' : 'x'}" x="${v.x - 8}" y="${v.y - 8}" width="16" height="16" class="ic-svg"/>`;
      const ring = active ? `<circle cx="${v.x}" cy="${v.y}" r="25" class="pin-ring"/>` : '';
      const text = `<text x="${v.x}" y="${v.y + 31}" text-anchor="middle" class="pin-label">${esc(v.short)}</text>`;
      if (o.static) return `<g>${shape}${inner}${text}</g>`;
      return `<g role="button" ${dim ? 'aria-hidden="true"' : `tabindex="0" aria-label="${esc(label)}"`} data-act="pin" data-id="${v.id}" data-k="pin-${v.id}" class="pin ${dim ? 'pin-dim' : ''}">
        <circle cx="${v.x}" cy="${v.y}" r="26" fill="transparent"/>${ring}${shape}${inner}${text}</g>`;
    }).join('');
    const me = `<g aria-hidden="true"><circle cx="${you.x}" cy="${you.y}" r="16" class="you-pulse"/><circle cx="${you.x}" cy="${you.y}" r="8" fill="#0B2A5B" stroke="#fff" stroke-width="3"/>
      <text x="${you.x + 13}" y="${you.y - 11}" class="you-label">${t('map.you')}</text></g>`;
    return `<svg class="map" viewBox="${o.routeTo ? routeView(o.routeTo) : '0 0 340 440'}" role="group" aria-label="${esc(t('map.title'))}">${MAP_BASE}${routeSvg}${pins}${me}</svg>`;
  }

  /* ---------- generated step-by-step directions ---------- */
  const DEG = { north: 0, east: 90, south: 180, west: 270 };
  function heading(a, b) {
    const dx = b.x - a.x, dy = b.y - a.y;
    return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'east' : 'west') : (dy > 0 ? 'south' : 'north');
  }
  function buildSteps(c) {
    const pts = routePoints(c);
    const total = pts.slice(1).reduce((s, p, i) => s + segLen(pts[i], p), 0);
    const steps = [];
    let prev = null;
    pts.slice(1).forEach((p, i) => {
      const a = pts[i];
      const h = heading(a, p);
      const street = a.x === p.x ? streets.v[a.x] : streets.h[a.y];
      const meters = Math.max(10, Math.round(((segLen(a, p) / total) * c.km * 1000) / 10) * 10);
      const turn = prev ? ((DEG[h] - DEG[prev] + 360) % 360 === 90 ? 'right' : 'left') : null;
      steps.push({ text: turn ? `Turn ${turn} onto ${street}` : `Head ${h} on ${street}`, deg: DEG[h], meters });
      prev = h;
    });
    steps.push({ text: c.tip, icon: 'shield', kicker: 'Safety tip' });
    steps.push({ text: `${c.name} is ahead. Enter through the main gate.`, icon: 'pin', kicker: 'Almost there' });
    return steps;
  }

  /* ---------- toast + dialog ---------- */
  let toastTimer = null;
  function toast(msg, action) {
    const el = $('#toast');
    clearTimeout(toastTimer);
    el.innerHTML = `<span>${esc(msg)}</span>` + (action ? `<button class="toast-btn" data-act="toast-action">${ic('undo')}${esc(action.label)}</button>` : '');
    el.classList.add('show');
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
        <div class="dialog-icon">${ic(d.icon || 'alert')}</div>
        <h2 id="dlg-title">${esc(d.title)}</h2>
        <p id="dlg-body">${esc(d.body)}</p>
        <div class="dialog-actions">${actions.map((a, i) => a.href
          ? `<a class="btn btn-${a.kind || 'secondary'}" href="${a.href}" data-dlg="${i}">${a.icon ? ic(a.icon) : ''}${esc(a.label)}</a>`
          : `<button class="btn btn-${a.kind || 'secondary'}" data-act="dialog-action" data-i="${i}">${esc(a.label)}</button>`).join('')}</div>
      </div>`;
    openDialog.actions = actions;
    openDialog.onDismiss = d.onDismiss || null;
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

  screens.home = function () {
    const a = READY.alerts[0];
    const recent = store.recentId ? byId(store.recentId) : null;
    const near = all().slice(0, 3);
    const recentCard = recent ? `<a class="card recent" href="${nav && nav.id === recent.id ? '#/route/' + recent.id : '#/center/' + recent.id}" data-k="recent">
        <span class="recent-ic">${ic('clock')}</span>
        <span class="recent-body"><small>${nav && nav.id === recent.id ? t('home.resume') : t('home.recent')}</small><strong>${esc(recent.name)}</strong>${badge(recent.status)}</span>
        ${ic('chevron', 'chev')}</a>` : '';
    return {
      title: t('nav.home'), tab: 'home',
      html: `<h1 class="sr-only" tabindex="-1">${t('nav.home')}</h1>
        <p class="loc">${ic('pin')}${t('home.loc')}</p>
        <a class="alert-banner" href="#/alerts" data-k="banner">
          <span class="alert-ic">${ic('alert')}</span>
          <span class="alert-body"><small>${t('home.alert')}</small><strong>${esc(a.title)}</strong></span>
          ${ic('chevron', 'chev')}
        </a>
        <button class="btn-find" data-act="find" data-k="find">
          <span class="find-ic">${ic('locate')}</span>
          <span class="find-text"><strong>${t('home.find')}</strong><small>${t('home.findSub')}</small></span>
        </button>
        ${recentCard}
        <div class="quick">
          <a class="tile" href="#/map" data-k="q-map">${ic('map')}<span>${t('home.qmap')}</span></a>
          <a class="tile" href="tel:911" data-act="vibrate" data-k="q-call">${ic('phone')}<span>${t('home.qcall')}</span></a>
          <a class="tile" href="#/share" data-k="q-share">${ic('share')}<span>${t('home.qshare')}</span></a>
        </div>
        <div class="section-head"><h2>${t('home.nearby')}</h2><a class="link" href="#/map" data-act="show-list">${t('home.seeAll')}</a></div>
        <div class="stack">${near.map(centerCard).join('')}</div>
        <p class="foot-note">${ic('shield')}${t('home.managed')}</p>`
    };
  };

  screens.map = function () {
    const list = all();
    const facs = Object.keys(FAC);
    const match = (v) => [...ui.filters].every((f) => v.fac.includes(f));
    const shown = list.filter(match);
    const dim = new Set(list.filter((v) => !match(v)).map((v) => v.id));
    const sel = ui.pinId && !dim.has(ui.pinId) ? byId(ui.pinId) : null;
    const isMap = ui.mapMode === 'map';

    const filterBar = `<fieldset class="filters"><legend>${t('map.filter')}</legend>
      <div class="chips">${facs.map((f) => `<button class="chip ${ui.filters.has(f) ? 'on' : ''}" aria-pressed="${ui.filters.has(f)}" data-act="filter" data-f="${f}" data-k="f-${f}">${ic(FAC[f].icon)}${t('fac.' + f)}</button>`).join('')}</div>
      ${ui.filters.size ? `<button class="link-btn" data-act="clear-filters" data-k="clear">${ic('x')}${t('map.clear')}</button>` : ''}
    </fieldset>`;

    const legend = `<ul class="legend" aria-label="Legend">
      ${['available', 'almost', 'full'].map((s) => `<li><svg class="ic lg lg-${s}" aria-hidden="true" viewBox="0 0 24 24"><use href="#i-${s === 'available' ? 'check' : s === 'almost' ? 'alert' : 'x'}"/></svg>${t('st.' + s)}</li>`).join('')}
    </ul>`;

    let body;
    if (!shown.length) {
      body = `<div class="empty card"><h2>${t('map.none')}</h2><p>${t('map.noneHelp')}</p><button class="btn btn-secondary" data-act="clear-filters">${t('map.clear')}</button></div>`;
    } else if (isMap) {
      body = `<div class="map-wrap">${mapSvg({ pins: list, dim, activeId: sel && sel.id })}</div>${legend}
        <div class="preview" id="preview">${sel ? previewCard(sel) : `<p class="hint">${ic('pin')}${t('map.tapPin')}</p>`}</div>`;
    } else {
      body = `<div class="stack">${shown.map(centerCard).join('')}</div>`;
    }

    return {
      title: t('map.title'), tab: 'map',
      html: `${header(t('map.title'), { extra: `<div class="seg-toggle" role="group" aria-label="${t('map.title')}">
          <button data-act="mode" data-mode="map" aria-pressed="${isMap}" data-k="m-map">${ic('map')}${t('map.map')}</button>
          <button data-act="mode" data-mode="list" aria-pressed="${!isMap}" data-k="m-list">${ic('list')}${t('map.list')}</button></div>` })}
        ${filterBar}
        <p class="count" role="status">${t('map.count', { n: shown.length })}</p>
        ${body}`
    };
  };

  function previewCard(v) {
    return `<div class="card preview-card">
      <div class="cc-top"><h3>${esc(v.name)}</h3>${badge(v.status)}</div>
      <p class="cc-meta">${ic('pin')}${v.km} km · ${t('c.walk', { m: walkMin(v.km) })}</p>
      ${bar(v)}
      <div class="btn-row">
        <a class="btn btn-secondary" href="#/center/${v.id}">${t('c.details')}</a>
        <button class="btn btn-primary" data-act="route" data-id="${v.id}">${ic('navigate')}${t('c.route')}</button>
      </div></div>`;
  }

  screens.nearest = function () {
    if (!ui.nearestReady) {
      if (!ui.timers.length) {
        ui.timers.push(setTimeout(() => { ui.nearestReady = true; if (ui.route && ui.route.name === 'nearest') render(); }, store.settings.offline ? 1300 : 1000));
      }
      const msg = store.settings.offline ? t('near.loadingOff', { x: fmtAge(120) }) : t('near.loading');
      return { title: t('near.title'), tab: 'home', html: `${header(t('near.title'), { back: '#/home' })}
        <div class="loading" role="status"><span class="spinner" aria-hidden="true"></span><p>${msg}</p></div>` };
    }
    const list = all();
    const closest = list[0];
    const best = nearestAvailable();
    const others = list.filter((v) => v.status !== 'full' && (!best || v.id !== best.id)).slice(0, 2);
    const skipped = closest.status === 'full' ? `<section class="notice notice-bad" aria-labelledby="sk-h">
        <div class="notice-head">${ic('ban')}<h2 id="sk-h">${t('near.closestFull')}</h2></div>
        <p class="notice-line"><strong>${esc(closest.name)}</strong> · ${closest.km} km ${badge('full')}</p>
        <p>${t('near.skipped')}</p></section>` : '';
    let main;
    if (best) {
      main = `<section aria-labelledby="best-h"><h2 id="best-h" class="kicker">${ic('check-circle')}${t('near.best')}</h2>
        <div class="card best-card">
          <div class="cc-top"><h3>${esc(best.name)}</h3>${badge(best.status)}</div>
          <p class="cc-meta">${ic('pin')}${best.km} km · ${t('c.walk', { m: walkMin(best.km) })}</p>
          ${bar(best, true)}${facChips(best)}
          <p class="cc-foot">${updatedLine(best)}</p>
          <div class="btn-col">
            <button class="btn btn-primary btn-lg" data-act="route" data-id="${best.id}" data-k="go-best">${ic('navigate')}${t('c.route')}</button>
            <a class="btn btn-secondary" href="#/center/${best.id}">${t('c.details')}</a>
          </div></div></section>
        ${others.length ? `<h2 class="kicker plain">${t('near.others')}</h2><div class="stack">${others.map(centerCard).join('')}</div>` : ''}`;
    } else {
      main = `<section class="notice notice-bad"><div class="notice-head">${ic('ban')}<h2>${t('near.allFull')}</h2></div><p>${t('near.allFullHelp')}</p>
        <a class="btn btn-primary btn-lg" href="tel:911">${ic('phone')}${t('home.qcall')}</a></section>`;
    }
    return { title: t('near.title'), tab: 'home', html: `${header(t('near.title'), { back: '#/home' })}${skipped}${main}` };
  };

  screens.center = function (id) {
    const v = byId(id);
    if (!v) return { redirect: '#/map' };
    const alt = v.status === 'full' ? nearestAvailable(v.id) : null;
    const facList = Object.keys(FAC).map((f) => {
      const has = v.fac.includes(f);
      return `<li class="${has ? 'has' : 'no'}">${ic(FAC[f].icon)}<span class="fl">${t('fac.' + f)}</span><span class="fs">${ic(has ? 'check' : 'x')}${t(has ? 'fac.yes' : 'fac.no')}</span></li>`;
    }).join('');
    return {
      title: v.name, tab: 'map',
      html: `${header(esc(v.name), { back: '#/map' })}
        <section class="status-panel ${ST[v.status].cls}" aria-label="${t('st.' + v.status)}">
          <div class="sp-top">${ic(ST[v.status].icon, 'xl')}<div><strong>${t('st.' + v.status)}</strong><span>${leftText(v)}</span></div></div>
          ${bar(v, true)}
        </section>
        ${alt ? `<section class="notice notice-bad"><div class="notice-head">${ic('alert')}<h2>${t('c.fullWarn')}</h2></div>
          <p>${t('c.fullWarnBody', { name: esc(alt.name), km: alt.km })}</p>
          <button class="btn btn-primary" data-act="route" data-id="${alt.id}">${ic('navigate')}${t('c.pick', { name: esc(alt.short) })}</button></section>` : ''}
        <section class="card info" aria-label="${t('c.info')}">
          <p>${ic('pin')}<span><strong>${v.km} km</strong> · ${t('c.walk', { m: walkMin(v.km) })}<br><small>${t('c.walkSenior', { m: Math.round(walkMin(v.km) * 1.5) })}</small></span></p>
          <p>${ic('map')}<span>${esc(v.address)}, Valenzuela City</span></p>
          <p class="upd">${updatedLine(v)}</p>
        </section>
        <h2 class="kicker plain">${t('c.facilities')}</h2>
        <ul class="fac-list">${facList}</ul>
        <div class="sticky-actions">
          <button class="btn btn-primary btn-lg" data-act="route" data-id="${v.id}" data-k="route-btn">${ic('navigate')}${t('c.route')}</button>
          <a class="btn btn-secondary" href="#/share/${v.id}">${ic('share')}${t('c.share')}</a>
        </div>`
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
    const pct = Math.round(nav.prog * 100);
    const lead = s.icon ? ic(s.icon, 'xl') : `<span class="arrow" style="transform:rotate(${s.deg}deg)">${ic('arrow', 'xl')}</span>`;
    const next = steps[nav.step + 1];
    return {
      title: t('route.title'), tab: 'map', startsSim: true,
      html: `${header(t('route.title'), { back: '#/center/' + id })}
        <p class="route-to">${ic('pin')}<span><strong>${esc(c.name)}</strong><br><small>${t('route.safe')}</small></span></p>
        <p class="sim-chip">${ic('locate')}${t('route.sim')}</p>
        <div class="map-wrap map-short">${mapSvg({ pins: [c], routeTo: c, f: nav.prog, static: true })}</div>
        <div class="progress-block">
          <div class="progress-top"><strong>${t('route.step', { a: nav.step + 1, b: n })}</strong><span id="rt-pct">${pct}%</span></div>
          <div class="bar" id="rt-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="${t('route.title')}"><span class="bar-fill route-fill" id="rt-fill" style="width:${pct}%"></span></div>
          <p class="rt-stats"><span>${t('route.left')}: <strong id="rt-dist">${fmtDist(c.km * 1000 * (1 - nav.prog))}</strong></span><span>${t('route.eta')}: <strong id="rt-eta">${fmtEta(c, nav.prog)}</strong></span></p>
        </div>
        <section class="card step" aria-live="polite">
          <div class="step-lead">${lead}</div>
          <div class="step-body">${s.kicker ? `<small>${s.kicker}</small>` : ''}<strong>${esc(s.text)}</strong>${s.meters ? `<span>${s.meters} m</span>` : ''}</div>
        </section>
        ${next ? `<p class="next-up">${ic('chevron')}<span>${t('route.then')}: ${esc(next.text)}</span></p>` : ''}
        <div class="btn-col">
          <button class="btn btn-secondary" data-act="stop-nav" data-k="stop">${ic('x')}${t('route.stop')}</button>
        </div>`
    };
  };

  /* Simulated GPS: the marker advances along the route by itself (no taps), pausing while a dialog is open. */
  const STEP_MS = 4500; // each direction step takes about 4.5 s, so a 3-4 step demo route lasts 14-18 s
  const sim = { raf: 0, last: 0, acc: 0 };
  const reducedMotion = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function stopSim() { cancelAnimationFrame(sim.raf); sim.raf = 0; }

  function updateLive(c) {
    const w = walkRoute(routePoints(c), nav.prog);
    const done = $('#rt-done'), pos = $('#rt-pos');
    if (done) done.setAttribute('points', w.done.map((p) => p.x + ',' + p.y).join(' '));
    if (pos) pos.setAttribute('transform', `translate(${w.pos.x} ${w.pos.y})`);
    const pct = Math.round(nav.prog * 100);
    const set = (sel, v) => { const el = $(sel); if (el) el.textContent = v; };
    set('#rt-pct', pct + '%'); set('#rt-dist', fmtDist(c.km * 1000 * (1 - nav.prog))); set('#rt-eta', fmtEta(c, nav.prog));
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
      title: t('arr.title'), tab: 'map',
      html: `<h1 class="sr-only" tabindex="-1">${t('arr.title')}</h1>
        <section class="arrived">
          <div class="big-check" aria-hidden="true">${ic('check', 'xxl')}</div>
          <h2>${t('arr.title')}</h2>
          <p>${t('arr.sub', { name: esc(c.name) })}</p>
        </section>
        <h2 class="kicker plain">${t('arr.next')}</h2>
        <ol class="next-steps">${[1, 2, 3, 4].map((i) => `<li>${t('arr.n' + i)}</li>`).join('')}</ol>
        <div class="btn-col">
          <a class="btn btn-primary btn-lg" href="#/share/${c.id}" data-k="share-now">${ic('share')}${t('share.title')}</a>
          <a class="btn btn-secondary" href="#/hotlines">${ic('phone')}${t('nav.hotlines')}</a>
          <a class="btn btn-quiet" href="#/home">${ic('home')}${t('arr.home')}</a>
        </div>`
    };
  };

  const defaultShareId = () => store.recentId || (nearestAvailable() || all()[0]).id;
  const shareMessage = (v) => `I'm safe at ${v.name}, ${v.address}, Valenzuela City. – sent via ReadyPH`;

  screens.share = function (arg) {
    if (arg && byId(arg) && arg !== ui.shareId) { ui.shareId = arg; ui.shareDirty = false; }
    if (!ui.shareId || !byId(ui.shareId)) { ui.shareId = defaultShareId(); ui.shareDirty = false; }
    const v = byId(ui.shareId);
    if (!ui.shareDirty) ui.shareText = shareMessage(v);
    const canShare = typeof navigator.share === 'function';
    return {
      title: t('share.title'), tab: 'home',
      html: `${header(t('share.title'), { back: '#/home' })}
        <div class="field"><label for="share-center">${t('share.where')}</label>
          <select id="share-center" data-set="shareCenter" data-k="share-center">${all().map((c) => `<option value="${c.id}" ${c.id === v.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></div>
        <div class="field"><label for="share-text">${t('share.msg')}</label>
          <textarea id="share-text" rows="5" data-k="share-text">${esc(ui.shareText)}</textarea></div>
        <div class="btn-col">
          <a class="btn btn-primary btn-lg" id="sms-link" href="sms:?body=${encodeURIComponent(ui.shareText)}" data-act="sms" data-k="sms">${ic('sms')}${t('share.sms')}</a>
          <div class="btn-row">
            <button class="btn btn-secondary" data-act="share-native" data-k="share-native">${ic('share')}${canShare ? t('share.share') : t('share.copy')}</button>
            ${canShare ? `<button class="btn btn-secondary" data-act="share-copy" data-k="share-copy">${ic('copy')}${t('share.copy')}</button>` : ''}
            <button class="btn btn-quiet" data-act="share-reset" data-k="share-reset">${ic('refresh')}${t('share.reset')}</button>
          </div>
        </div>
        <p class="foot-note">${ic('lock')}${t('share.note')}</p>`
    };
  };

  screens.hotlines = function () {
    const row = (h) => `<li class="card hot-row">
      <div class="hot-info"><h3>${esc(h.name)}</h3><p>${esc(h.desc)}</p>
        <p class="hot-num">${esc(h.number)}</p>${h.verified ? '' : `<span class="tag">${t('hot.sample')}</span>`}</div>
      <a class="btn btn-primary" href="tel:${h.tel}" data-act="vibrate" aria-label="${t('hot.call')} ${esc(h.name)} ${esc(h.number)}">${ic('phone')}${t('hot.call')}</a></li>`;
    const emerg = READY.hotlines.filter((h) => h.emergency);
    const rest = READY.hotlines.filter((h) => !h.emergency);
    return {
      title: t('hot.title'), tab: 'hotlines',
      html: `${header(t('hot.title'))}<p class="sub">${t('hot.sub')}</p>
        <div class="emerg">${emerg.map((h) => `<a class="emerg-btn" href="tel:${h.tel}" data-act="vibrate" aria-label="${t('hot.call')} ${esc(h.name)}">${ic('phone')}<strong>${esc(h.number)}</strong><span>${esc(h.name.replace(/ \d+$/, ''))}</span>${h.verified ? '' : `<em>${t('hot.sample')}</em>`}</a>`).join('')}</div>
        <ul class="stack plain-list">${rest.map(row).join('')}</ul>
        <p class="foot-note">${ic('alert')}${t('hot.note')}</p>`
    };
  };

  screens.alerts = function () {
    const sevIcon = { warning: 'alert', advisory: 'bell', info: 'shield' };
    const sevCls = { warning: 'st-bad', advisory: 'st-warn', info: 'st-info' };
    return {
      title: t('alerts.title'), tab: 'alerts',
      html: `${header(t('alerts.title'))}<p class="sub">${t('alerts.sub')}</p>
        <ul class="stack plain-list">${READY.alerts.map((a) => `<li class="card alert-card">
          <div class="alert-meta"><span class="badge ${sevCls[a.sev]}">${ic(sevIcon[a.sev])}<span>${t('sev.' + a.sev)}</span></span><span class="when">${ic('clock')}${fmtAge(a.mins + (store.settings.offline ? 120 : 0))}</span></div>
          <h3>${esc(a.title)}</h3><p>${esc(a.body)}</p>
          <p class="todo"><strong>${t('alerts.todo')}:</strong> ${esc(a.todo)}</p></li>`).join('')}</ul>`
    };
  };

  function radioGroup(name, label, options, current) {
    return `<fieldset class="set-group"><legend>${label}</legend><div class="seg">${options.map((o) => `<label class="seg-opt">
      <input type="radio" name="${name}" value="${o.value}" data-set="${name}" data-k="${name}-${o.value}" ${current === o.value ? 'checked' : ''}><span>${o.label}</span></label>`).join('')}</div></fieldset>`;
  }
  function switchRow(name, label, help, on) {
    return `<label class="switch-row"><span class="sw-text"><strong>${label}</strong><small>${help}</small></span>
      <span class="sw"><input type="checkbox" role="switch" data-set="${name}" data-k="sw-${name}" ${on ? 'checked' : ''}><span class="sw-track" aria-hidden="true"></span><span class="sw-state">${t(on ? 'set.on' : 'set.off')}</span></span></label>`;
  }

  screens.settings = function () {
    const s = store.settings;
    return {
      title: t('set.title'), tab: 'settings',
      html: `${header(t('set.title'))}
        <section class="card set-card" aria-label="${t('set.display')}">
          ${radioGroup('textSize', t('set.size'), [{ value: 'normal', label: t('set.size.normal') }, { value: 'large', label: t('set.size.large') }, { value: 'xl', label: t('set.size.xl') }], s.textSize)}
          ${radioGroup('lang', t('set.lang'), [{ value: 'en', label: 'English' }, { value: 'fil', label: 'Filipino' }], s.lang)}
          ${switchRow('contrast', t('set.contrast'), t('set.contrastHelp'), s.contrast)}
        </section>
        <h2 class="kicker plain">${t('set.demoTools')}</h2>
        <section class="card set-card">
          ${switchRow('offline', t('set.offline'), t('set.offlineHelp'), s.offline)}
          <button class="row-btn" data-act="replay" data-k="replay">${ic('refresh')}<span>${t('set.replay')}</span>${ic('chevron', 'chev')}</button>
        </section>
        <p class="foot-note">${ic('shield')}${t('set.demo')}</p>`
    };
  };

  screens.onboarding = function () {
    const total = 3;
    const step = ui.obStep;
    const dl = ui.dl;
    let body;
    if (step === 0) {
      body = `<h2>${t('ob.cityTitle')}</h2><p>${t('ob.cityBody')}</p>
        <fieldset class="city-list"><legend class="sr-only">${t('ob.cityTitle')}</legend>
          <label class="city on"><input type="radio" name="city" checked><span><strong>Valenzuela City</strong><small>CDRRMO Valenzuela</small></span>${ic('check-circle')}</label>
          <label class="city off"><input type="radio" name="city" disabled><span><strong>Caloocan City</strong><small>${t('ob.soon')}</small></span></label>
          <label class="city off"><input type="radio" name="city" disabled><span><strong>Marikina City</strong><small>${t('ob.soon')}</small></span></label>
        </fieldset>`;
    } else if (step === 1) {
      body = `<div class="ob-art">${ic('locate', 'xxl')}</div><h2>${t('ob.locTitle')}</h2><p>${t('ob.locBody')}</p>
        ${ui.loc ? `<p class="ok-line" role="status">${ic('check-circle')}${t('ob.locOk')}</p>`
          : `<div class="btn-col"><button class="btn btn-primary btn-lg" data-act="ob-loc" data-k="ob-loc">${ic('locate')}${t('ob.locAllow')}</button><button class="btn btn-quiet" data-act="ob-next">${t('ob.locLater')}</button></div>`}`;
    } else {
      body = `<div class="ob-art">${ic('download', 'xxl')}</div><h2>${t('ob.dlTitle')}</h2><p>${t('ob.dlBody')}</p>
        ${dl.state === 'idle' ? `<button class="btn btn-primary btn-lg" data-act="ob-dl" data-k="ob-dl">${ic('download')}${t('ob.dl')}</button>` : ''}
        ${dl.state === 'run' ? `<div class="progress-block"><div class="progress-top"><strong>${t('ob.dlTitle')}</strong><span id="dl-pct">${dl.pct}%</span></div>
            <div class="bar" id="dl-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${dl.pct}" aria-label="${t('ob.dlTitle')}"><span class="bar-fill route-fill" id="dl-fill" style="width:${dl.pct}%"></span></div></div>
            <button class="btn btn-secondary" data-act="ob-dl-cancel" data-k="ob-dl-cancel">${ic('x')}${t('ob.dlCancel')}</button>` : ''}
        ${dl.state === 'done' ? `<p class="ok-line" role="status">${ic('check-circle')}${t('ob.dlDone')}</p>
            <button class="btn btn-primary btn-lg" data-act="ob-finish" data-k="ob-finish">${t('ob.start')}</button>` : ''}`;
    }
    const next = step < total - 1 && !(step === 1 && !ui.loc)
      ? `<button class="btn btn-primary" data-act="ob-next" data-k="ob-next">${t('ob.next')}${ic('chevron')}</button>` : '';
    return {
      title: 'Welcome', tab: null, noNav: true,
      html: `<header class="ob-head"><span class="ob-step">${t('ob.step', { a: step + 1, b: total })}</span>
          <button class="btn btn-quiet btn-sm" data-act="ob-skip" data-k="ob-skip">${t('ob.skip')}</button></header>
        <div class="dots" aria-hidden="true">${[0, 1, 2].map((i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>
        <h1 class="sr-only" tabindex="-1">ReadyPH</h1>
        <section class="ob-body">${body}</section>
        <div class="ob-foot">${step > 0 ? `<button class="btn btn-secondary" data-act="ob-back" data-k="ob-back">${ic('back')}${t('back')}</button>` : '<span></span>'}${next}</div>`
    };
  };

  /* ---------- chrome (connection chip, pinned center, tab bar) ---------- */
  const TABS = [['home', 'home'], ['map', 'map'], ['hotlines', 'phone'], ['alerts', 'bell'], ['settings', 'gear']];

  function renderChrome(out, routeName, routeArg) {
    const off = store.settings.offline;
    const conn = $('#conn');
    conn.className = 'conn ' + (off ? 'conn-off' : 'conn-on');
    conn.innerHTML = off ? `${ic('wifi-off')}<span>${t('conn.offline', { x: fmtAge(120) })}</span>` : `${ic('wifi')}<span>${t('conn.online')}</span>`;

    const showPin = ['map', 'hotlines', 'alerts', 'settings', 'nearest', 'share'].includes(routeName) || (routeName === 'center' && routeArg !== store.recentId);
    const pinHost = $('#pinbar');
    const pc = store.recentId ? byId(store.recentId) : null;
    if (pc && showPin && !out.noNav) {
      const navigating = nav && nav.id === pc.id;
      pinHost.innerHTML = `<div class="pinbar ${navigating ? 'pinbar-nav' : ''}">
        <a class="pin-main" href="${navigating ? '#/route/' + pc.id : '#/center/' + pc.id}" data-k="pinbar">
          ${ic(navigating ? 'navigate' : 'pin')}
          <span class="pin-text"><small>${navigating ? t('route.resume') : t('pin.label')}</small><strong>${esc(pc.name)}</strong></span>
          ${navigating ? '' : badge(pc.status)}
        </a>
        ${navigating ? '' : `<button class="icon-btn pin-x" data-act="unpin" aria-label="${t('pin.remove')}" data-k="unpin">${ic('x')}</button>`}</div>`;
    } else pinHost.innerHTML = '';

    const tabbar = $('#tabbar');
    tabbar.hidden = !!out.noNav;
    tabbar.innerHTML = TABS.map(([k, icon]) => `<a href="#/${k}" class="${out.tab === k ? 'on' : ''}" ${out.tab === k ? 'aria-current="page"' : ''} data-k="tab-${k}">${ic(icon)}<span>${t('nav.' + k)}</span></a>`).join('');
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
      title: t('route.leaveTitle'), body: t('route.leaveBody'), icon: 'navigate',
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
    document.title = out.title + ' – ReadyPH';
    view.innerHTML = out.html;
    renderChrome(out, r.name, r.arg);

    if (out.startsSim) startSim();

    if (routeChanged) {
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
      const alt = nearestAvailable(c.id);
      openDialog({
        title: t('c.fullWarn'), icon: 'ban',
        body: alt ? t('c.fullWarnBody', { name: alt.name, km: alt.km }) : t('near.allFull') + ' ' + t('near.allFullHelp'),
        actions: [
          alt ? { label: t('c.pick', { name: alt.name }), kind: 'primary', run: () => go('#/route/' + alt.id) } : { label: t('home.qcall'), kind: 'primary', href: 'tel:911', icon: 'phone' },
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
      ui.pinId = el.dataset.id; buzz(10); render();
      const p = $('#preview'); if (p && p.scrollIntoView) p.scrollIntoView({ block: 'nearest' });
    },
    route(el) { startRoute(el.dataset.id); },
    'stop-nav'() {
      const id = nav.id;
      openDialog({
        title: t('route.stop') + '?', body: t('route.leaveBody'), icon: 'navigate',
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
    'share-copy'() { return copyWithToast(); },
    'share-reset'() { ui.shareDirty = false; render(); toast(t('share.resetOk')); },
    replay() { ui.obStep = 0; ui.loc = false; ui.dl = { state: 'idle', pct: 0 }; go('#/onboarding'); },
    'ob-next'() { ui.obStep = Math.min(2, ui.obStep + 1); render(); },
    'ob-back'() { ui.obStep = Math.max(0, ui.obStep - 1); render(); },
    'ob-loc'() { ui.loc = true; buzz(20); render(); },
    'ob-skip'() { store.onboarded = true; save(); go('#/home'); toast(t('ob.skipped')); },
    'ob-finish'() { store.onboarded = true; save(); buzz([40, 30, 40]); go('#/home'); },
    'ob-dl'() {
      ui.dl = { state: 'run', pct: 0 }; render();
      const timer = setInterval(() => {
        ui.dl.pct = Math.min(100, ui.dl.pct + 4 + Math.floor(Math.random() * 7));
        if (ui.dl.pct >= 100) { clearInterval(timer); ui.dl.state = 'done'; render(); return; }
        const fill = $('#dl-fill'), pct = $('#dl-pct'), b = $('#dl-bar');
        if (fill) { fill.style.width = ui.dl.pct + '%'; pct.textContent = ui.dl.pct + '%'; b.setAttribute('aria-valuenow', ui.dl.pct); }
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
  if (!location.hash) history.replaceState(null, '', '#/home');
  route();
})();

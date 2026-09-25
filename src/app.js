const DATA = { config: null, program: null, abstracts: [], announcements: [], posters: null };

const state = {
  route: { name: 'home', id: '', query: new URLSearchParams() },
  programmeDay: 'day-1',
  programmeQuery: '',
  programmeFilter: 'all',
  abstractQuery: '',
  posterQuery: '',
  posterTheme: 'all',
  abstractFilter: 'all',
  abstractSort: 'title',
  exploreTab: 'venues',
  deferredInstall: null,
  serviceWorkerRegistration: null,
  favourites: new Set(),
  theme: localStorage.getItem('btm2026-theme') || 'system',
  standalone: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true,
  previousHash: '',
};

const ICONS = {
  home: '<path d="M3.5 10.5 12 3l8.5 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-4.5v-6h-5v6H5a1.5 1.5 0 0 1-1.5-1.5z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
  file: '<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 11h6M9 15h6M9 19h4"/>',
  pin: '<path d="M12 21s7-5 7-12a7 7 0 1 0-14 0c0 7 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  arrowRight: '<path d="M5 12h14M14 7l5 5-5 5"/>',
  arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bookmark: '<path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z"/>',
  bookmarkFill: '<path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z" fill="currentColor" stroke="none"/>',
  share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M5 20h14"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/>',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
  train: '<rect x="6" y="3" width="12" height="15" rx="3"/><path d="M8 18l-2 3M16 18l2 3M8 13h8M9 7h6"/><circle cx="9" cy="15" r=".5" fill="currentColor"/><circle cx="15" cy="15" r=".5" fill="currentColor"/>',
  plane: '<path d="m2 16 20-8-8 12-3-6z"/><path d="m11 14-4 6"/>',
  walk: '<circle cx="13" cy="4" r="2"/><path d="m10 21 2-7-3-3 2-4 4 3h4M12 14l4 7M9 11l-4 5"/>',
  car: '<path d="M4 16V9l2-4h12l2 4v7"/><path d="M4 11h16M7 16v2M17 16v2"/><circle cx="7" cy="13.5" r="1"/><circle cx="17" cy="13.5" r="1"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  mic: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/>',
  coffee: '<path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a3 3 0 0 1 0 6h-2M7 3v2M11 3v2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  check: '<path d="m5 12 4 4 10-10"/>',
  wifiOff: '<path d="M2 2l20 20M5 8a12 12 0 0 1 5-2M16 7a12 12 0 0 1 3 2M8.5 12.5a6 6 0 0 1 2.5-1.3M15.5 13.5a6 6 0 0 0-1.5-1M11 17a2 2 0 0 1 2.8 2.8"/>',
  palette: '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="9" r="1" fill="currentColor"/><circle cx="12" cy="7" r="1" fill="currentColor"/><circle cx="16" cy="9" r="1" fill="currentColor"/><path d="M18 15c0 2-2 3-4 2-1-.5-2 .5-2 1.5 0 1.5-1.5 2.5-3 1.8"/>',
  shield: '<path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m8.5 12 2 2 5-5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/>',
  phone: '<path d="M6 3h4l2 5-3 2a16 16 0 0 0 5 5l2-3 5 2v4c0 2-2 3-4 3C9 20 4 15 3 7c0-2 1-4 3-4z"/>',
  building: '<path d="M4 21V5l8-3 8 3v16M8 8h2M14 8h2M8 12h2M14 12h2M8 16h2M14 16h2M10 21v-3h4v3"/>',
  bed: '<path d="M3 20V8M3 15h18v5M7 15v-4h10a4 4 0 0 1 4 4M5 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
  refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M18 12a6 6 0 0 0-10-4L4 12M6 12a6 6 0 0 0 10 4l4-4"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',
  alert: '<path d="M12 3 2 21h20z"/><path d="M12 9v5M12 18h.01"/>',
  circleCheck: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  spark: '<path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
  board: '<rect x="3" y="3" width="18" height="13" rx="1.5"/><path d="M8 16l-2 5M16 16l2 5M12 16v3M7 7h6M7 10.5h10"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="m9 14-1.5 7L12 18.5 16.5 21 15 14"/><path d="m10 9 1.5 1.5L14.5 7.5"/>',
  copy: '<rect x="8" y="8" width="11" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"/>',
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value = '') => String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
const attr = (value = '') => esc(value).replace(/`/g, '&#96;');
const normalise = (value = '') => String(value)
  .replace(/[ıİ]/g, character => character === 'ı' ? 'i' : 'I')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ß/g, 'ss')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();
const icon = (name, className = '') => `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.info}</svg>`;

function readFavourites() {
  let values = [];
  try { values = JSON.parse(localStorage.getItem('btm2026-favourites') || '[]'); } catch { values = []; }
  return new Set(values.map(value => {
    if (String(value).startsWith('abstract:') || String(value).startsWith('programme:')) return String(value);
    if (String(value).startsWith('abs-')) return `abstract:${value}`;
    return `programme:${value}`;
  }));
}
state.favourites = readFavourites();

function saveFavourites() {
  localStorage.setItem('btm2026-favourites', JSON.stringify([...state.favourites]));
}

function favKey(type, id) { return `${type}:${id}`; }
function isFavourite(type, id) { return state.favourites.has(favKey(type, id)); }
function toggleFavourite(type, id, announce = true) {
  const key = favKey(type, id);
  const wasSaved = state.favourites.has(key);
  if (wasSaved) state.favourites.delete(key); else state.favourites.add(key);
  saveFavourites();
  haptic();
  if (announce) toast(wasSaved ? 'Removed from saved items' : 'Saved to this device');
  return !wasSaved;
}

function haptic() {
  if ('vibrate' in navigator && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) navigator.vibrate(8);
}

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove('show'), 2600);
}

function getRoute() {
  const raw = (location.hash || '#/home').replace(/^#\/?/, '');
  const [pathPart, queryPart = ''] = raw.split('?');
  const parts = pathPart.split('/').filter(Boolean);
  return {
    name: parts[0] || 'home',
    id: decodeURIComponent(parts[1] || ''),
    query: new URLSearchParams(queryPart),
  };
}

function routeTo(hash) {
  if (location.hash === hash) renderRoute();
  else location.hash = hash;
}

function setTopbar({ title, kicker = 'Brain Tumor Meeting', back = false }) {
  $('#topbar-title').textContent = title;
  $('#topbar-kicker').textContent = kicker;
  $('#back-button').hidden = !back;
  $('.mobile-brand').hidden = back;
}

function setActiveNavigation(name) {
  $$('[data-nav]').forEach(link => link.classList.toggle('active', link.dataset.nav === name));
}

function applyTheme() {
  const dark = state.theme === 'dark' || (state.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const themeColour = dark ? '#091727' : '#f3f6fa';
  document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
    if (!meta.media || window.matchMedia(meta.media).matches) meta.content = themeColour;
  });
}

function cycleTheme() {
  state.theme = state.theme === 'system' ? 'light' : state.theme === 'light' ? 'dark' : 'system';
  localStorage.setItem('btm2026-theme', state.theme);
  applyTheme();
  toast(`Appearance: ${state.theme === 'system' ? 'Use device setting' : state.theme[0].toUpperCase() + state.theme.slice(1)}`);
  if (state.route.name === 'more') renderRoute(false);
}

function programmeEntries() {
  return DATA.program.days.flatMap(day => day.sessions.flatMap(session => session.items.map(item => ({ ...item, day, session }))));
}

function programmeEntryById(id) { return programmeEntries().find(item => item.id === id); }
function abstractById(id) { return DATA.abstracts.find(abstract => abstract.id === id); }

function entryTimestamp(entry, edge = 'start') {
  const time = entry[edge] || entry.start;
  return new Date(`${entry.day.date}T${time}:00+02:00`).getTime();
}

function entryStatus(entry) {
  const now = Date.now();
  if (now >= entryTimestamp(entry, 'start') && now < entryTimestamp(entry, 'end')) return 'now';
  if (now >= entryTimestamp(entry, 'end')) return 'past';
  return 'future';
}

function upcomingEntries(limit = 3) {
  const entries = programmeEntries().filter(entry => !['break', 'registration'].includes(entry.kind));
  const now = Date.now();
  const upcoming = entries.filter(entry => entryTimestamp(entry, 'end') >= now);
  return (upcoming.length ? upcoming : entries.slice(-limit)).slice(0, limit);
}

function countdown() {
  const start = new Date(DATA.config.event.start).getTime();
  const end = new Date(DATA.config.event.end).getTime();
  const now = Date.now();
  if (now < start) {
    const days = Math.ceil((start - now) / 86400000);
    return { compact: `${days} day${days === 1 ? '' : 's'} to go`, title: `${days} day${days === 1 ? '' : 's'} until BTM 2026` };
  }
  if (now <= end) return { compact: 'Live now', title: 'BTM 2026 is under way' };
  return { compact: 'Meeting archive', title: 'Thank you for joining BTM 2026' };
}

function kindLabel(kind) {
  return ({
    keynote: 'Keynote', oral: 'Oral', flash: 'Flash oral', 'flash-session': 'Flash session', poster: 'Poster session',
    break: 'Break', registration: 'Registration', welcome: 'Welcome', social: 'Social event', closing: 'Closing',
  })[kind] || kind;
}

function badgeClass(kind) {
  if (kind === 'keynote') return 'gold';
  if (['social', 'flash-session'].includes(kind)) return 'green';
  if (['break', 'registration', 'welcome', 'closing', 'poster'].includes(kind)) return 'gray';
  return '';
}

function formatDate(date, options = { weekday: 'short', day: 'numeric', month: 'short' }) {
  return new Intl.DateTimeFormat('en-GB', options).format(new Date(`${date}T12:00:00+02:00`));
}

function durationMinutes(start, end) {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
}

function dataSummary() {
  const full = DATA.abstracts.filter(item => item.abstractStatus === 'full').length;
  const linked = DATA.abstracts.filter(item => item.programmeId).length;
  return { total: DATA.abstracts.length, full, linked };
}

function renderHome() {
  setTopbar({ title: 'BTM 2026', kicker: 'Brain Tumor Meeting' });
  const event = DATA.config.event;
  const next = upcomingEntries(1)[0];
  const count = countdown();
  const summary = dataSummary();
  const saved = getSavedItems().slice(0, 5);
  const notices = DATA.announcements.filter(item => item.active);

  return `
    <div class="page home-page">
      <section class="hero-card">
        <div class="hero-top">
          <span class="hero-edition"><i></i> Berlin · 12th edition</span>
          <span class="hero-countdown">${esc(count.compact)}</span>
        </div>
        <h1>Brain Tumor <span>Meeting 2026</span></h1>
        <p class="hero-tagline">Finding paths through brain tumor complexity across biology, genetics, immunology and translational research.</p>
        <div class="hero-facts">
          <span class="hero-fact">${icon('calendar')} ${esc(event.datesLabel)}</span>
          <span class="hero-fact">${icon('pin')} MDC.C · Berlin-Buch</span>
          <span class="hero-fact">${icon('file')} ${summary.total} abstracts</span>
        </div>
        <div class="hero-actions">
          <a class="button light" href="#/programme">${icon('calendar')} Open programme</a>
          <a class="button ghost" href="#/abstracts">${icon('search')} Search abstracts</a>
        </div>
      </section>

      <section class="section">
        <div class="quick-actions">
          <a class="card pressable quick-action" href="#/programme">
            <span class="quick-action-icon">${icon('calendar')}</span><strong>Programme</strong><small>Two days, sessions and saved talks</small>
          </a>
          <a class="card pressable quick-action" href="#/abstracts">
            <span class="quick-action-icon">${icon('file')}</span><strong>Abstracts</strong><small>${summary.total} abstracts, searchable offline</small>
          </a>
          <a class="card pressable quick-action" href="#/explore">
            <span class="quick-action-icon gold">${icon('pin')}</span><strong>Venues</strong><small>MDC.C and Stadtgut Berlin-Buch</small>
          </a>
          <a class="card pressable quick-action" href="#/explore?tab=travel">
            <span class="quick-action-icon gold">${icon('train')}</span><strong>Travel</strong><small>S2, bus 353 and BER guidance</small>
          </a>
        </div>
      </section>

      ${next ? `
      <section class="section">
        <div class="section-head">
          <div><span class="eyebrow">${entryStatus(next) === 'now' ? 'Live' : 'Coming up'}</span><h2>${esc(count.title)}</h2></div>
          <a class="text-action" href="#/programme">Full programme ${icon('arrowRight')}</a>
        </div>
        <article class="card now-card pressable" data-action="program-item" data-id="${attr(next.id)}" tabindex="0" role="button">
          <div class="now-card-main">
            <div class="now-card-time">
              ${entryStatus(next) === 'now' ? '<span class="live">Now</span>' : ''}
              <span>${esc(next.day.shortLabel)} · ${esc(next.start)}–${esc(next.end)}</span>
            </div>
            <h3>${esc(next.speaker || next.title)}</h3>
            <p>${next.speaker ? esc(next.title) : esc(next.session.title)}</p>
          </div>
          <div class="now-card-footer"><span>${icon('pin')} ${esc(next.location)}</span><span>Details ${icon('chevronRight')}</span></div>
        </article>
      </section>` : ''}

      ${saved.length ? `
      <section class="section">
        <div class="section-head"><div><span class="eyebrow">For you</span><h2>Saved on this device</h2></div><a class="text-action" href="#/abstracts?filter=saved">View all ${icon('arrowRight')}</a></div>
        <div class="saved-strip">
          ${saved.map(renderSavedCard).join('')}
        </div>
      </section>` : ''}

      <section class="section">
        <div class="section-head"><div><span class="eyebrow">Updates</span><h2>Meeting notices</h2></div></div>
        <div class="notice-list">
          ${notices.map(renderNotice).join('')}
        </div>
      </section>

      ${!state.standalone ? `
      <section class="section">
        <article class="card install-card">
          <img src="./images/icon-192.png" alt="BTM 2026 app icon">
          <div><h2>Keep BTM 2026 on your Home Screen</h2><p>Install this PWA for a full-screen app experience and one-tap access during the meeting.</p><button class="button gold small" type="button" data-action="install">${icon('download')} Install app</button></div>
        </article>
      </section>` : ''}
    </div>`;
}

function renderNotice(item) {
  const iconName = item.level === 'success' ? 'circleCheck' : item.level === 'event' ? 'calendar' : 'info';
  return `<article class="card notice-card" data-level="${attr(item.level)}">
    <span class="notice-icon">${icon(iconName)}</span>
    <div><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></div>
    <time datetime="${attr(item.date)}">${esc(formatDate(item.date, { day: 'numeric', month: 'short' }))}</time>
  </article>`;
}

function getSavedItems() {
  const results = [];
  state.favourites.forEach(key => {
    const [type, id] = key.split(':');
    if (type === 'abstract') {
      const abstract = abstractById(id);
      if (abstract) results.push({ type, id, title: abstract.title, subtitle: abstract.presentingAuthors[0] || abstract.leadAuthor, href: `#/abstract/${abstract.id}`, badge: abstract.format });
    } else if (type === 'programme') {
      const entry = programmeEntryById(id);
      if (entry) results.push({ type, id, title: entry.speaker || entry.title, subtitle: entry.speaker ? entry.title : entry.session.title, href: '#/programme', badge: `${entry.day.shortLabel} · ${entry.start}` });
    }
  });
  return results.sort((a, b) => a.title.localeCompare(b.title));
}

function renderSavedCard(item) {
  return `<a class="card pressable saved-card" href="${attr(item.href)}"><small>${esc(item.badge)}</small><h3>${esc(item.title)}</h3><p>${esc(item.subtitle)}</p></a>`;
}

function renderProgramme() {
  setTopbar({ title: 'Programme', kicker: '14–15 October 2026' });
  if (state.route.query.get('day')) state.programmeDay = state.route.query.get('day');
  if (state.route.query.get('filter')) state.programmeFilter = state.route.query.get('filter');
  const day = DATA.program.days.find(item => item.id === state.programmeDay) || DATA.program.days[0];
  state.programmeDay = day.id;
  const query = normalise(state.programmeQuery);
  const sessions = day.sessions.map(session => ({ ...session, items: session.items.filter(item => programmeItemMatches(item, session, query)) })).filter(session => session.items.length);
  const count = sessions.reduce((sum, session) => sum + session.items.length, 0);

  return `
    <div class="page programme-page">
      <div class="large-title">
        <div class="large-title-row"><div><h1 class="page-title">Programme</h1><p class="page-subtitle">All times are shown in Berlin local time.</p></div><span class="count">${count} item${count === 1 ? '' : 's'}</span></div>
      </div>
      <div class="sticky-controls">
        <div class="segmented" role="tablist" aria-label="Programme day">
          ${DATA.program.days.map(item => `<button type="button" class="${item.id === day.id ? 'active' : ''}" data-action="programme-day" data-value="${attr(item.id)}" role="tab" aria-selected="${item.id === day.id}">${esc(item.shortLabel)}</button>`).join('')}
        </div>
        <div class="search-box" style="margin-top:9px">
          ${icon('search')}<input id="programme-search" type="search" value="${attr(state.programmeQuery)}" placeholder="Search speakers, talks or sessions" autocomplete="off" aria-label="Search the programme">
          ${state.programmeQuery ? `<button class="search-clear" type="button" data-action="clear-programme-search" aria-label="Clear search">${icon('x')}</button>` : ''}
        </div>
        <div class="chip-row" aria-label="Programme filters">
          ${programmeFilterChip('all', 'All')}
          ${programmeFilterChip('scientific', 'Scientific')}
          ${programmeFilterChip('keynote', 'Keynotes')}
          ${programmeFilterChip('poster', 'Posters')}
          ${programmeFilterChip('social', 'Social')}
          ${programmeFilterChip('saved', 'Saved', 'bookmark')}
        </div>
      </div>
      <div class="programme-summary"><span>${esc(day.label)} · ${esc(day.location)}</span>${state.programmeFilter !== 'all' || state.programmeQuery ? '<button class="text-action" type="button" data-action="reset-programme">Reset filters</button>' : ''}</div>
      ${sessions.length ? `<div class="programme-list">${sessions.map(session => renderSession(session, day)).join('')}</div>` : renderEmpty('calendar', 'No programme items found', 'Try another day or remove one of the filters.')}
    </div>`;
}

function programmeFilterChip(value, label, iconName = '') {
  const active = state.programmeFilter === value;
  return `<button type="button" class="chip ${active ? 'active' : ''}" data-action="programme-filter" data-value="${value}">${iconName ? icon(iconName) : ''}${label}</button>`;
}

function programmeItemMatches(item, session, query) {
  const filter = state.programmeFilter;
  if (filter === 'saved' && !isFavourite('programme', item.id)) return false;
  if (filter === 'scientific' && !['keynote', 'oral', 'flash', 'flash-session'].includes(item.kind)) return false;
  if (filter === 'keynote' && item.kind !== 'keynote') return false;
  if (filter === 'poster' && item.kind !== 'poster') return false;
  if (filter === 'social' && !['social', 'flash-session'].includes(item.kind)) return false;
  if (!query) return true;
  return normalise([item.title, item.speaker, item.affiliation, item.location, session.title, session.theme].join(' ')).includes(query);
}

function renderSession(session, day) {
  return `<section class="card session-card" aria-labelledby="session-${attr(session.id)}">
    <header class="session-header"><small>${esc(session.theme || 'Scientific session')}</small><h2 id="session-${attr(session.id)}">${esc(session.title)}</h2><p>${session.chair && session.chair !== 'TBD' ? `Chair: ${esc(session.chair)}` : 'Chair to be announced'}</p></header>
    <div class="timeline">${session.items.map(item => renderProgrammeEntry({ ...item, day, session })).join('')}</div>
  </section>`;
}

function renderProgrammeEntry(entry) {
  const saved = isFavourite('programme', entry.id);
  const status = entryStatus(entry);
  const linked = entry.abstractId ? abstractById(entry.abstractId) : null;
  return `<article class="programme-entry ${status === 'now' ? 'now' : ''}" data-kind="${attr(entry.kind)}" data-action="program-item" data-id="${attr(entry.id)}" tabindex="0" role="button" aria-label="Open ${attr(entry.title)} details">
    <span class="timeline-dot" aria-hidden="true"></span>
    <div class="programme-time"><strong>${esc(entry.start)}</strong><small>${durationMinutes(entry.start, entry.end)} min</small></div>
    <div class="programme-copy">
      <div class="programme-meta"><span class="badge ${badgeClass(entry.kind)}">${status === 'now' ? 'Now · ' : ''}${esc(kindLabel(entry.kind))}</span>${linked ? '<span class="badge gray">Abstract</span>' : ''}</div>
      <h3>${esc(entry.title)}</h3>
      ${entry.speaker ? `<p class="speaker">${esc(entry.speaker)}</p>` : ''}
      ${entry.affiliation ? `<p class="affiliation">${esc(entry.affiliation)}</p>` : ''}
      <span class="location">${icon('pin')} ${esc(entry.location)}</span>
    </div>
    <button class="entry-action ${saved ? 'active' : ''}" type="button" data-action="toggle-programme-favourite" data-id="${attr(entry.id)}" aria-label="${saved ? 'Remove from' : 'Add to'} saved programme">${icon(saved ? 'bookmarkFill' : 'bookmark')}</button>
  </article>`;
}

function renderAbstracts() {
  setTopbar({ title: 'Abstracts', kicker: `${DATA.abstracts.length} submissions` });
  if (state.route.query.get('filter')) state.abstractFilter = state.route.query.get('filter');
  const results = filteredAbstracts();
  return `
    <div class="page abstracts-page">
      <div class="large-title">
        <div class="large-title-row"><div><h1 class="page-title">Abstracts</h1><p class="page-subtitle">Search titles, authors, affiliations and full text.</p></div><span class="count">${DATA.abstracts.length} records</span></div>
      </div>
      <div class="sticky-controls">
        <div class="search-box">
          ${icon('search')}<input id="abstract-search" type="search" value="${attr(state.abstractQuery)}" placeholder="Search the abstract book" autocomplete="off" aria-label="Search abstracts">
          ${state.abstractQuery ? `<button class="search-clear" type="button" data-action="clear-abstract-search" aria-label="Clear search">${icon('x')}</button>` : ''}
        </div>
        <div class="chip-row" aria-label="Abstract filters">
          ${abstractFilterChip('all', 'All', DATA.abstracts.length)}
          ${abstractFilterChip('oral', 'Oral', DATA.abstracts.filter(a => a.format === 'Oral presentation').length)}
          ${abstractFilterChip('flash', 'Flash', DATA.abstracts.filter(a => a.format === 'Flash oral').length)}
          ${abstractFilterChip('poster', 'Posters', DATA.abstracts.filter(a => a.format === 'Poster abstract').length)}
          ${abstractFilterChip('evening', 'Evening speakers', DATA.abstracts.filter(a => a.eveningContributor).length)}
          ${abstractFilterChip('saved', 'Saved', DATA.abstracts.filter(a => isFavourite('abstract', a.id)).length, 'bookmark')}
        </div>
      </div>
      <div class="results-row"><span>${results.length} result${results.length === 1 ? '' : 's'}</span><label>Sort <select class="sort-select" id="abstract-sort" aria-label="Sort abstracts"><option value="title" ${state.abstractSort === 'title' ? 'selected' : ''}>by title</option><option value="author" ${state.abstractSort === 'author' ? 'selected' : ''}>by author</option><option value="programme" ${state.abstractSort === 'programme' ? 'selected' : ''}>by programme</option></select></label></div>
      ${results.length ? `<div class="abstract-list">${results.map(renderAbstractCard).join('')}</div>` : renderEmpty('search', 'No abstracts found', 'Try a shorter search term or choose another filter.')}
    </div>`;
}

function abstractFilterChip(value, label, count, iconName = '') {
  const active = state.abstractFilter === value;
  return `<button type="button" class="chip ${active ? 'active' : ''}" data-action="abstract-filter" data-value="${value}">${iconName ? icon(iconName) : ''}${label} <span class="chip-count">${count}</span></button>`;
}

function filteredAbstracts() {
  const query = normalise(state.abstractQuery);
  const results = DATA.abstracts.filter(abstract => {
    if (query && !abstract.searchText.includes(query)) return false;
    if (state.abstractFilter === 'oral' && abstract.format !== 'Oral presentation') return false;
    if (state.abstractFilter === 'flash' && abstract.format !== 'Flash oral') return false;
    if (state.abstractFilter === 'poster' && abstract.format !== 'Poster abstract') return false;
    if (state.abstractFilter === 'evening' && !abstract.eveningContributor) return false;
    if (state.abstractFilter === 'saved' && !isFavourite('abstract', abstract.id)) return false;
    return true;
  });
  results.sort((a, b) => {
    if (state.abstractSort === 'author') return (a.presentingAuthors[0] || a.leadAuthor).localeCompare(b.presentingAuthors[0] || b.leadAuthor) || a.title.localeCompare(b.title);
    if (state.abstractSort === 'programme') {
      const aTime = a.programme ? `${a.programme.date}${a.programme.start}` : '9999';
      const bTime = b.programme ? `${b.programme.date}${b.programme.start}` : '9999';
      return aTime.localeCompare(bTime) || a.title.localeCompare(b.title);
    }
    return a.title.localeCompare(b.title);
  });
  return results;
}

function renderAbstractCard(abstract) {
  const saved = isFavourite('abstract', abstract.id);
  const author = abstract.presentingAuthors[0] || abstract.leadAuthor;
  const formatClass = abstract.format === 'Flash oral' ? 'green' : abstract.format === 'Oral presentation' ? '' : 'gray';
  return `<article class="card pressable abstract-card" data-action="open-abstract" data-id="${attr(abstract.id)}" tabindex="0" role="link" aria-label="Open abstract ${attr(abstract.title)}">
    <div class="abstract-card-main">
      <div class="abstract-card-top"><span class="badge ${formatClass}">${esc(abstract.format)}</span>${abstract.eveningContributor ? '<span class="badge gold">Evening speaker</span>' : ''}${abstract.abstractStatus === 'metadata-only' ? '<span class="badge red">No body text</span>' : ''}</div>
      <h2>${esc(abstract.title)}</h2>
      <p class="authors">${esc(author)}${abstract.presentingAuthors.length ? ' · presenting author' : ''}</p>
      <div class="abstract-meta">
        <span>${icon('file')} ID ${esc(abstract.submissionId)}</span>
        ${abstract.programme ? `<span>${icon('calendar')} ${esc(formatDate(abstract.programme.date))} · ${esc(abstract.programme.start)}</span>` : ''}
        <span>${icon('users')} ${abstract.authors.length} author${abstract.authors.length === 1 ? '' : 's'}</span>
      </div>
    </div>
    <span class="chevron">${icon('chevronRight')}</span>
    <button class="abstract-bookmark ${saved ? 'active' : ''}" type="button" data-action="toggle-abstract-favourite" data-id="${attr(abstract.id)}" aria-label="${saved ? 'Remove from' : 'Add to'} saved abstracts">${icon(saved ? 'bookmarkFill' : 'bookmark')}</button>
  </article>`;
}

function renderAbstractDetail(id) {
  const abstract = abstractById(id);
  setTopbar({ title: 'Abstract', kicker: abstract ? `Submission ${abstract.submissionId}` : 'Not found', back: true });
  if (!abstract) return `<div class="page detail-page">${renderEmpty('file', 'Abstract not found', 'Return to the abstract book and choose another record.')}</div>`;
  const saved = isFavourite('abstract', abstract.id);
  const sorted = [...DATA.abstracts].sort((a, b) => a.title.localeCompare(b.title));
  const index = sorted.findIndex(item => item.id === abstract.id);
  const previous = sorted[index - 1];
  const next = sorted[index + 1];
  const authorHtml = abstract.authors.map(author => {
    const refs = author.affiliationRefs.length ? `<sup>${author.affiliationRefs.join(',')}</sup>` : '';
    return `<span class="${author.presenting ? 'presenting' : ''}">${esc(author.name)}${refs}${author.presenting ? '*' : ''}</span>`;
  }).join(', ');
  const formatClass = abstract.format === 'Flash oral' ? 'green' : abstract.format === 'Poster abstract' ? 'gray' : '';

  return `<div class="page detail-page">
    <article class="card detail-hero">
      <div class="detail-actions">
        <button class="top-icon" type="button" data-action="share-abstract" data-id="${attr(abstract.id)}" aria-label="Share abstract">${icon('share')}</button>
        <button class="top-icon" type="button" data-action="toggle-abstract-favourite" data-id="${attr(abstract.id)}" aria-label="${saved ? 'Remove from' : 'Add to'} saved abstracts">${icon(saved ? 'bookmarkFill' : 'bookmark')}</button>
      </div>
      <div class="badge-row"><span class="badge ${formatClass}">${esc(abstract.format)}</span><span class="badge gray">Submission ${esc(abstract.submissionId)}</span>${posterNumberFor(abstract.id) ? `<a class="badge poster-badge" href="#/posters">${icon('board')} Poster ${esc(String(posterNumberFor(abstract.id)))}</a>` : ''}${abstract.eveningContributor ? '<span class="badge gold">Extended symposium contributor</span>' : ''}</div>
      <h1>${esc(abstract.title)}</h1>
      <p class="detail-authors">${authorHtml}</p>
      ${abstract.presentingAuthors.length ? `<span class="presenter-note">${icon('star')} * Presenting author in the submitted abstract</span>` : '<span class="presenter-note">Presenting author was not marked in the submitted PDF.</span>'}
    </article>

    <div class="detail-grid">
      <section class="card info-card">
        <h2>Affiliations</h2>
        <ol class="affiliation-list">${abstract.affiliations.map(item => `<li><sup>${item.ref}</sup><span>${esc(item.name)}</span></li>`).join('')}</ol>
      </section>

      ${abstract.programme ? renderAbstractScheduleCard(abstract) : ''}

      ${abstract.eveningContributor ? `<section class="card info-card"><h2>Extended symposium</h2><p>${esc(abstract.eveningContributorName)} is listed among the flash-oral contributors at Stadtgut. The published programme does not identify which of multiple submitted abstracts, where applicable, is presented in that block.</p></section>` : ''}
    </div>

    <section class="card abstract-body">
      <h2>Abstract</h2>
      ${abstract.bodyParagraphs.length ? abstract.bodyParagraphs.map(renderAbstractParagraph).join('') : '<div class="empty-state"><div class="empty-state-icon">' + icon('file') + '</div><h3>No abstract body in the source PDF</h3><p>The submitted file contains the title, author list and affiliation only.</p></div>'}
    </section>

    ${abstract.keywords.length ? `<section class="card info-card" style="margin-top:14px"><h2>Keywords</h2><div class="keyword-list">${abstract.keywords.map(keyword => `<span class="keyword">${esc(keyword)}</span>`).join('')}</div></section>` : ''}

    <div class="detail-footer-actions">
      <a class="button outline full" href="${attr(abstract.pdfPath)}" target="_blank" rel="noopener">${icon('file')} Open original submission PDF</a>
      <button class="button outline full" type="button" data-action="copy-citation" data-id="${attr(abstract.id)}">${icon('copy')} Copy title and authors</button>
    </div>

    <nav class="detail-nav" aria-label="Previous and next abstract">
      ${previous ? `<a class="card pressable" href="#/abstract/${attr(previous.id)}"><small>Previous</small><strong>${esc(previous.title)}</strong></a>` : '<span></span>'}
      ${next ? `<a class="card pressable" href="#/abstract/${attr(next.id)}" style="text-align:right"><small>Next</small><strong>${esc(next.title)}</strong></a>` : '<span></span>'}
    </nav>
  </div>`;
}

function renderAbstractScheduleCard(abstract) {
  const programme = abstract.programme;
  const titleDiffers = normalise(programme.programmeTitle) !== normalise(abstract.title);
  return `<section class="card info-card schedule-card">
    <h2>Programme</h2>
    <div class="schedule-info">
      <div class="schedule-line"><span class="schedule-line-icon">${icon('calendar')}</span><div><strong>${esc(formatDate(programme.date, { weekday: 'long', day: 'numeric', month: 'long' }))}</strong><span>${esc(programme.start)}–${esc(programme.end)} · ${esc(programme.sessionTitle)}</span></div></div>
      <div class="schedule-line"><span class="schedule-line-icon">${icon('pin')}</span><div><strong>${esc(programme.location)}</strong><span>${esc(programme.programmeSpeaker)}</span></div></div>
    </div>
    ${titleDiffers ? `<p style="margin-top:12px">The published programme uses the title “${esc(programme.programmeTitle)}”. This page shows the title in the submitted abstract PDF.</p>` : ''}
    <button class="button outline small full" style="margin-top:12px" type="button" data-action="calendar-abstract" data-id="${attr(abstract.id)}">${icon('calendar')} Add presentation to calendar</button>
  </section>`;
}

function renderAbstractParagraph(paragraph) {
  const pattern = /^(Background|Introduction|Objective|Objectives|Aim|Aims|Methods|Results|Conclusion|Conclusions|Discussion|Funding|Acknowledgements?|Keywords)\s*:\s*/i;
  const match = paragraph.match(pattern);
  if (!match) return `<p>${esc(paragraph)}</p>`;
  return `<p><strong class="section-label">${esc(match[1])}</strong> ${esc(paragraph.slice(match[0].length))}</p>`;
}

function renderExplore() {
  setTopbar({ title: 'Explore', kicker: 'Berlin-Buch & Berlin' });
  const queryTab = state.route.query.get('tab');
  if (['venues', 'travel', 'berlin'].includes(queryTab)) state.exploreTab = queryTab;
  return `<div class="page explore-page">
    <div class="large-title"><h1 class="page-title">Explore</h1><p class="page-subtitle">Venues, routes and practical information for Berlin.</p></div>
    <div class="segmented explore-tabs" role="tablist">
      ${['venues', 'travel', 'berlin'].map(tab => `<button class="${state.exploreTab === tab ? 'active' : ''}" type="button" data-action="explore-tab" data-value="${tab}">${tab === 'venues' ? 'Venues' : tab === 'travel' ? 'Travel' : 'Berlin'}</button>`).join('')}
    </div>
    ${state.exploreTab === 'venues' ? renderVenues() : state.exploreTab === 'travel' ? renderTravel() : renderBerlinInfo()}
  </div>`;
}

function renderVenues() {
  const main = DATA.config.venues.main;
  const social = DATA.config.venues.social;
  return `<div class="venue-stack">
    ${renderVenueCard(main, 'Main conference venue', './images/campus-schematic.svg', [
      { label: 'Google Maps', href: main.googleMaps }, { label: 'Apple Maps', href: main.appleMaps }, { label: 'Campus map', href: main.campusMap },
    ])}
    ${renderVenueCard(social, 'Wednesday evening', './images/stadtgut-schematic.svg', [
      { label: 'Walking route', href: social.walking }, { label: 'Google Maps', href: social.googleMaps }, { label: 'Venue website', href: social.website },
    ])}
  </div>
  <section class="section">
    <article class="card route-card"><h2>MDC.C to Stadtgut</h2><p>The official meeting information describes Stadtgut as approximately ten minutes on foot from the main venue.</p>
      <div class="route-steps">
        <div class="route-step"><span class="route-number">1</span><div><strong>Leave Campus Berlin-Buch</strong><p>Start at MDC.C, Building 83, and follow the live walking route toward Alt-Buch.</p></div></div>
        <div class="route-step"><span class="route-number">2</span><div><strong>Walk to Alt-Buch 45–51</strong><p>Allow additional time for wayfinding and mobility needs.</p></div></div>
        <div class="route-step"><span class="route-number">3</span><div><strong>Historic wooden barn</strong><p>Flash-orals begin at 19:00 and the social dinner at 20:00.</p></div></div>
      </div>
      <a class="button primary full" style="margin-top:17px" href="${attr(social.walking)}" target="_blank" rel="noopener">${icon('walk')} Start walking directions</a>
    </article>
  </section>`;
}

function renderVenueCard(venue, eyebrow, image, actions) {
  return `<article class="card venue-card">
    <div class="venue-visual"><img src="${attr(image)}" alt=""><div class="venue-label"><small>${esc(eyebrow)}</small><h2>${esc(venue.name)}</h2></div></div>
    <div class="venue-content"><div class="venue-address">${icon('pin')}<span>${esc(venue.address)}</span></div><p>${esc(venue.description)}</p>
      <div class="venue-actions">${actions.slice(0, 2).map(action => `<a class="button outline small" href="${attr(action.href)}" target="_blank" rel="noopener">${icon('external')} ${esc(action.label)}</a>`).join('')}</div>
      ${actions[2] ? `<a class="text-action" style="margin-top:13px" href="${attr(actions[2].href)}" target="_blank" rel="noopener">${esc(actions[2].label)} ${icon('arrowUpRight')}</a>` : ''}
    </div>
  </article>`;
}

function renderTravel() {
  const transport = DATA.config.transport;
  return `<div class="travel-grid">
    ${renderTravelCard('train', 'Reach Campus Buch', transport.campus)}
    ${renderTravelCard('plane', 'From BER Airport', transport.airport)}
    ${renderTravelCard('map', 'Berlin tickets', transport.berlin)}
    <article class="card travel-card"><div class="travel-card-head"><span class="travel-card-icon">${icon('route')}</span><h2>Live journey planners</h2></div><p style="margin:12px 0 0;color:var(--muted);font-size:.74rem">Use live routing for service changes, accessibility options and the final connection to Campus Buch.</p><div class="link-grid"><a class="button outline small" href="${attr(transport.links.bvgPlanner)}" target="_blank" rel="noopener">BVG ${icon('external')}</a><a class="button outline small" href="${attr(transport.links.vbbPlanner)}" target="_blank" rel="noopener">VBB ${icon('external')}</a><a class="button outline small" href="${attr(transport.links.dbPlanner)}" target="_blank" rel="noopener">DB ${icon('external')}</a><a class="button outline small" href="${attr(transport.links.mdcDirections)}" target="_blank" rel="noopener">MDC route ${icon('external')}</a></div></article>
  </div>`;
}

function renderTravelCard(iconName, title, items) {
  return `<article class="card travel-card"><div class="travel-card-head"><span class="travel-card-icon">${icon(iconName)}</span><h2>${esc(title)}</h2></div><ul>${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul></article>`;
}

function renderBerlinInfo() {
  const emergency = DATA.config.emergency;
  return `<div class="travel-grid">
    <article class="card travel-card"><div class="travel-card-head"><span class="travel-card-icon">${icon('map')}</span><h2>Getting around Berlin</h2></div><ul><li>S-Bahn, U-Bahn, tram and bus use the same integrated fare system.</li><li>For central Berlin to Buch, search for the S2 toward Bernau and connect to bus 353 at S Buch.</li><li>Keep the live route open on the conference days; engineering works can alter routes and platforms.</li><li>Paper tickets must be validated before travel unless already date-stamped.</li></ul></article>
    <article class="card travel-card"><div class="travel-card-head"><span class="travel-card-icon">${icon('alert')}</span><h2>Emergency numbers</h2></div><p style="margin:13px 0 0;color:var(--muted);font-size:.74rem;line-height:1.5">${esc(emergency.note)}</p><div class="link-grid"><a class="button outline" href="tel:${attr(emergency.general)}">${icon('phone')} 112</a><a class="button outline" href="tel:${attr(emergency.police)}">${icon('shield')} 110</a></div></article>
    <article class="card travel-card" style="grid-column:1/-1"><div class="travel-card-head"><span class="travel-card-icon">${icon('bed')}</span><h2>Accommodation listed by the meeting</h2></div><div class="contributor-list">${DATA.config.accommodation.map(hotel => `<div class="contributor"><div class="contributor-top"><div><strong>${esc(hotel.name)}</strong><small>${esc(hotel.address)} · ${esc(hotel.note)}</small></div><a class="top-icon" href="${attr(hotel.url)}" target="_blank" rel="noopener" aria-label="Open ${attr(hotel.name)} website">${icon('external')}</a></div></div>`).join('')}</div></article>
  </div>`;
}

function posterNumberFor(abstractId) {
  return DATA.posters?.posters?.find(p => p.abstractId === abstractId)?.number || null;
}

function posterMatches(poster, query) {
  if (!query) return true;
  if (/^\d+$/.test(query)) return String(poster.number) === query;
  return normalise(`${poster.number} ${poster.title} ${poster.presenter} ${poster.theme}`).includes(query);
}

function renderPosters() {
  setTopbar({ title: 'Posters', kicker: 'Poster session' });
  const data = DATA.posters;
  if (!data?.posters?.length) return `<div class="page">${renderEmpty('board', 'The poster plan is not available', 'Reload the app while online.')}</div>`;
  const query = normalise(state.posterQuery.trim());
  const themes = data.themes?.length ? data.themes : [...new Set(data.posters.map(p => p.theme))].map(name => ({ name }));
  if (state.posterTheme !== 'all' && !themes.some(t => t.name === state.posterTheme)) state.posterTheme = 'all';
  const visible = data.posters.filter(p => (state.posterTheme === 'all' || p.theme === state.posterTheme) && posterMatches(p, query));
  const groups = themes.map(t => ({ ...t, items: visible.filter(p => p.theme === t.name).sort((a, b) => a.number - b.number) })).filter(g => g.items.length);
  return `<div class="page posters-page">
    <div class="large-title">
      <div class="large-title-row"><div><h1 class="page-title">Posters</h1><p class="page-subtitle">${esc(data.intro || 'Find your poster number.')}</p></div><span class="count">${data.posters.length} posters</span></div>
    </div>
    <div class="sticky-controls">
      <div class="search-box">
        ${icon('search')}<input id="poster-search" type="search" inputmode="search" value="${attr(state.posterQuery)}" placeholder="Search name, title or poster number" autocomplete="off" aria-label="Search posters">
        ${state.posterQuery ? `<button class="search-clear" type="button" data-action="clear-poster-search" aria-label="Clear search">${icon('x')}</button>` : ''}
      </div>
      <div class="chip-row" aria-label="Poster topics">
        <button type="button" class="chip ${state.posterTheme === 'all' ? 'active' : ''}" data-action="poster-theme" data-value="all">All topics <span class="chip-count">${data.posters.length}</span></button>
        ${themes.map(t => `<button type="button" class="chip ${state.posterTheme === t.name ? 'active' : ''}" data-action="poster-theme" data-value="${attr(t.name)}">${esc(t.name)} <span class="chip-count">${data.posters.filter(p => p.theme === t.name).length}</span></button>`).join('')}
      </div>
    </div>
    <div class="results-row"><span>${visible.length} poster${visible.length === 1 ? '' : 's'}</span><span>Tap a poster to read the abstract</span></div>
    ${groups.length ? `<div class="card poster-table-card"><table class="poster-table">
      <thead><tr><th scope="col" class="pt-no">No.</th><th scope="col">Poster title</th><th scope="col" class="pt-author">Presenting author</th><th scope="col" class="pt-topic">Topic</th></tr></thead>
      ${groups.map(g => `<tbody>
        <tr class="pt-group"><th colspan="4" scope="rowgroup"><span>${esc(g.name)}</span>${g.numbers ? `<small>Posters ${esc(String(g.numbers).replace('-', '–'))}</small>` : ''}</th></tr>
        ${g.items.map(p => {
          const hasAbstract = !!abstractById(p.abstractId);
          const open = hasAbstract ? ` data-href="#/abstract/${attr(p.abstractId)}" tabindex="0" role="link"` : '';
          return `<tr class="pt-row${hasAbstract ? ' linked' : ''}"${open}>
            <td class="pt-no"><span class="poster-no">${esc(String(p.number))}</span></td>
            <td class="pt-title"><strong>${esc(p.title)}</strong><span class="pt-author-inline">${icon('person')}${esc(p.presenter)}</span></td>
            <td class="pt-author">${esc(p.presenter)}</td>
            <td class="pt-topic">${esc(p.theme)}</td>
          </tr>`;
        }).join('')}
      </tbody>`).join('')}
    </table></div>` : renderEmpty('search', 'No posters found', 'Try a surname, a word from the title or a poster number.')}
  </div>`;
}

function formatEuro(amount) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
}

function sponsorTierClass(tier) {
  const t = String(tier || '').toLowerCase();
  return t.includes('gold') ? 'gold' : t.includes('silver') ? 'silver' : 'gray';
}

function renderCme() {
  setTopbar({ title: 'CME & sponsors', kicker: 'Continuing medical education' });
  const cme = DATA.config.cme;
  const sponsors = DATA.config.sponsors;
  if (!cme) return `<div class="page">${renderEmpty('award', 'CME information is not available', 'Reload the app while online.')}</div>`;
  const ref = cme.reference;
  return `<div class="page cme-page">
    <div class="large-title"><h1 class="page-title">CME</h1><p class="page-subtitle">Continuing medical education points and sponsorship disclosure.</p></div>

    <article class="card cme-hero">
      <div class="cme-hero-top">
        <span class="cme-hero-icon">${icon('award')}</span>
        <div><small>${esc(cme.authorityEnglish)}</small><h2>${esc(cme.authority)}</h2></div>
      </div>
      <span class="badge gold">${esc(cme.status)}</span>
      <p>${esc(cme.summary)}</p>
      ${ref ? `<div class="cme-reference">
        <div class="cme-total"><strong>${esc(String(ref.total))}</strong><span>CME points awarded in ${esc(String(ref.year))}</span></div>
        <div class="cme-days">${ref.days.map(day => `<div><strong>${esc(String(day.points))}</strong><span>${esc(day.label)}</span></div>`).join('')}</div>
      </div>` : ''}
      ${cme.note ? `<p class="cme-note">${icon('info')}<span>${esc(cme.note)}</span></p>` : ''}
    </article>

    <section class="section">
      <div class="section-head"><div><span class="eyebrow">At the meeting</span><h2>How to claim your points</h2></div></div>
      <article class="card route-card"><div class="route-steps">
        ${cme.steps.map((step, index) => `<div class="route-step"><span class="route-number">${index + 1}</span><div><strong>${esc(step.title)}</strong><p>${esc(step.body)}</p></div></div>`).join('')}
      </div></article>
      ${cme.germanText?.length ? `<details class="card cme-german"><summary>Deutscher Originaltext</summary>${cme.germanText.map(t => `<p>${esc(t)}</p>`).join('')}</details>` : ''}
    </section>

    ${sponsors?.items?.length ? `<section class="section">
      <div class="section-head"><div><span class="eyebrow">Disclosure</span><h2>Sponsors</h2><p>${esc(sponsors.intro)}</p></div></div>
      <div class="sponsor-list">
        ${sponsors.items.map(sp => `<article class="card sponsor-card">
          <a class="sponsor-logo" href="${attr(sp.url)}" target="_blank" rel="noopener" aria-label="${attr(sp.name)} website"><img src="${attr(sp.logo)}" alt="${attr(sp.name)} logo" loading="lazy"></a>
          <div class="sponsor-copy"><strong>${esc(sp.name)}</strong><span class="badge ${sponsorTierClass(sp.tier)}">${esc(sp.tier)}</span></div>
          <div class="sponsor-amount"><strong>${esc(formatEuro(sp.amount))}</strong><small>Sponsorship</small></div>
        </article>`).join('')}
      </div>
    </section>` : ''}
  </div>`;
}

function renderMore() {
  setTopbar({ title: 'More', kicker: 'Meeting information' });
  const summary = dataSummary();
  const installedText = state.standalone ? 'Installed on this device' : 'Add to your Home Screen';
  const themeLabel = state.theme === 'system' ? 'Device setting' : state.theme[0].toUpperCase() + state.theme.slice(1);
  return `<div class="page more-page">
    <div class="large-title"><h1 class="page-title">More</h1><p class="page-subtitle">Meeting information, contacts and app settings.</p></div>
    <div class="grouped-list">
      ${!state.standalone ? `<article class="card install-card"><img src="./images/icon-192.png" alt=""><div><h2>Install BTM 2026</h2><p>${esc(installedText)} for full-screen access and an app icon.</p><button class="button gold small" type="button" data-action="install">${icon('download')} Install</button></div></article>` : ''}

      <section class="list-group"><h2>Meeting</h2><div class="card list-card">
        ${listRow('info', 'Meeting information', 'Poster size, presentation lengths and CME', 'show-meeting')}
        ${listRow('users', 'Committees', 'Scientific and organizing committees', 'show-committees')}
        ${listLink('bed', 'Accommodation', 'Hotels and pensions listed by the meeting', '#/explore?tab=berlin')}
        ${listLink('globe', 'Official meeting website', 'Latest organizer information', DATA.config.event.officialWebsite, true)}
        ${listLink('file', 'Published programme PDF', 'Open the official six-page programme', DATA.config.event.programmePdf, true)}
      </div></section>

      <section class="list-group"><h2>Contact</h2><div class="card list-card">
        ${listLink('mail', DATA.config.contacts.organisational.label, DATA.config.contacts.organisational.email, `mailto:${DATA.config.contacts.organisational.email}`)}
        ${listLink('mail', DATA.config.contacts.scientific.label, DATA.config.contacts.scientific.email, `mailto:${DATA.config.contacts.scientific.email}`)}
      </div></section>

      <section class="list-group"><h2>App</h2><div class="card list-card">
        <button class="list-row" type="button" data-action="theme"><span class="list-icon">${icon('palette')}</span><span class="list-copy"><strong>Appearance</strong><small>Light, dark or device setting</small></span><span class="list-trailing">${esc(themeLabel)} ${icon('chevronRight')}</span></button>
        <button class="list-row" type="button" data-action="check-update"><span class="list-icon green">${icon('refresh')}</span><span class="list-copy"><strong>Check for content update</strong><small>Programme and abstract data are cached offline</small></span><span class="list-trailing">${icon('chevronRight')}</span></button>
        ${listRow('shield', 'Privacy', 'No login, analytics or location collection', 'show-privacy')}
        <button class="list-row" type="button" data-action="clear-saved"><span class="list-icon red">${icon('trash')}</span><span class="list-copy"><strong>Clear saved items</strong><small>${state.favourites.size} saved item${state.favourites.size === 1 ? '' : 's'} on this device</small></span><span class="list-trailing">${icon('chevronRight')}</span></button>
      </div></section>

      <section class="list-group"><h2>About</h2><div class="card list-card">
        <div class="list-row"><span class="list-icon gold">${icon('spark')}</span><span class="list-copy"><strong>BTM 2026 PWA</strong><small>${summary.total} abstracts · ${summary.linked} linked programme contributions</small></span><span class="list-trailing">v${esc(DATA.config.event.version || '2.0.0')}</span></div>
      </div></section>
    </div>
  </div>`;
}

function listRow(iconName, title, subtitle, action) {
  return `<button class="list-row" type="button" data-action="${attr(action)}"><span class="list-icon">${icon(iconName)}</span><span class="list-copy"><strong>${esc(title)}</strong><small>${esc(subtitle)}</small></span><span class="list-trailing">${icon('chevronRight')}</span></button>`;
}

function listLink(iconName, title, subtitle, href, external = false) {
  return `<a class="list-row" href="${attr(href)}" ${external ? 'target="_blank" rel="noopener"' : ''}><span class="list-icon">${icon(iconName)}</span><span class="list-copy"><strong>${esc(title)}</strong><small>${esc(subtitle)}</small></span><span class="list-trailing">${icon(external ? 'external' : 'chevronRight')}</span></a>`;
}

function renderEmpty(iconName, title, body) {
  return `<div class="card empty-state"><div class="empty-state-icon">${icon(iconName)}</div><h3>${esc(title)}</h3><p>${esc(body)}</p></div>`;
}

function renderRoute(resetScroll = true) {
  state.route = getRoute();
  const detail = state.route.name === 'abstract';
  document.body.classList.toggle('detail-route', detail);
  const navName = detail ? 'abstracts' : ['home', 'programme', 'abstracts', 'posters', 'explore', 'cme', 'more'].includes(state.route.name) ? state.route.name : 'home';
  setActiveNavigation(navName);

  let html;
  switch (state.route.name) {
    case 'home': html = renderHome(); break;
    case 'programme': html = renderProgramme(); break;
    case 'abstracts': html = renderAbstracts(); break;
    case 'abstract': html = renderAbstractDetail(state.route.id); break;
    case 'explore': html = renderExplore(); break;
    case 'posters': html = renderPosters(); break;
    case 'cme': html = renderCme(); break;
    case 'more': html = renderMore(); break;
    default: routeTo('#/home'); return;
  }
  $('#app').innerHTML = html;
  const pageTitle = $('#topbar-title').textContent;
  document.title = pageTitle === 'BTM 2026' ? 'BTM 2026' : `${pageTitle} · BTM 2026`;
  if (resetScroll) window.scrollTo({ top: 0, behavior: 'auto' });
  updateInstallButtons();
}

function openProgrammeSheet(id) {
  const entry = programmeEntryById(id);
  if (!entry) return;
  const abstract = entry.abstractId ? abstractById(entry.abstractId) : null;
  const saved = isFavourite('programme', entry.id);
  const contributors = entry.contributors || [];
  const speakerLine = entry.speaker ? `<p><strong>${esc(entry.speaker)}</strong>${entry.affiliation ? `<br>${esc(entry.affiliation)}` : ''}</p>` : '';
  const abstractDifference = abstract && normalise(abstract.title) !== normalise(entry.title);

  $('#sheet-content').innerHTML = `<div class="sheet-body">
    <div class="sheet-header"><div><small>${esc(kindLabel(entry.kind))} · ${esc(entry.day.shortLabel)} · ${esc(entry.start)}–${esc(entry.end)}</small><h2>${esc(entry.title)}</h2></div><button class="top-icon" type="button" data-action="close-sheet" aria-label="Close">${icon('x')}</button></div>
    <div class="sheet-content">
      ${speakerLine}
      <div class="sheet-meta-list">
        <div class="sheet-meta">${icon('calendar')}<div><strong>${esc(entry.day.label)}</strong><span>${esc(entry.start)}–${esc(entry.end)} · ${durationMinutes(entry.start, entry.end)} minutes</span></div></div>
        <div class="sheet-meta">${icon('pin')}<div><strong>${esc(entry.location)}</strong><span>${esc(entry.session.title)}</span></div></div>
      </div>
      ${abstractDifference ? `<p>The submitted abstract is titled “${esc(abstract.title)}”.</p>` : ''}
      ${contributors.length ? renderContributors(contributors) : ''}
      <div class="sheet-actions">
        ${abstract ? `<a class="button primary" href="#/abstract/${attr(abstract.id)}" data-action="close-sheet">${icon('file')} View abstract</a>` : ''}
        <button class="button outline" type="button" data-action="calendar-programme" data-id="${attr(entry.id)}">${icon('calendar')} Add to calendar</button>
        <button class="button outline" type="button" data-action="toggle-programme-favourite-sheet" data-id="${attr(entry.id)}">${icon(saved ? 'bookmarkFill' : 'bookmark')} ${saved ? 'Saved' : 'Save'}</button>
        <button class="button outline" type="button" data-action="share-programme" data-id="${attr(entry.id)}">${icon('share')} Share</button>
      </div>
    </div>
  </div>`;
  openDialog($('#action-sheet'));
}

function renderContributors(contributors) {
  return `<div class="contributor-list">${contributors.map(contributor => {
    const abstracts = contributor.abstractIds.map(abstractById).filter(Boolean);
    return `<div class="contributor"><div class="contributor-top"><div><strong>${esc(contributor.name)}</strong><small>${esc(contributor.affiliation)}</small></div><span class="badge green">Speaker</span></div>
      ${abstracts.length ? `<div class="contributor-abstracts">${abstracts.map(abstract => `<a href="#/abstract/${attr(abstract.id)}" data-action="close-sheet"><span>${esc(abstract.title)}</span>${icon('chevronRight')}</a>`).join('')}</div>` : '<small>No submitted abstract could be linked automatically.</small>'}
    </div>`;
  }).join('')}</div>`;
}

function openDialog(dialog) {
  if (!dialog.open) dialog.showModal();
  document.documentElement.style.overflow = 'hidden';
}
function closeDialog(dialog) {
  if (dialog?.open) dialog.close();
  document.documentElement.style.overflow = '';
}

function showMeetingInfo() {
  const info = DATA.config.meetingInfo;
  showInformationSheet('Meeting information', 'Practical details', `
    <div class="sheet-meta-list">
      <div class="sheet-meta">${icon('file')}<div><strong>Posters</strong><span>${esc(info.poster)}</span></div></div>
      <div class="sheet-meta">${icon('mic')}<div><strong>Presentation lengths</strong><span>${esc(info.talks)}</span></div></div>
      <div class="sheet-meta">${icon('star')}<div><strong>Abstract book</strong><span>${esc(`The app contains ${dataSummary().total} submitted abstracts${dataSummary().total - dataSummary().full ? `, of which ${dataSummary().total - dataSummary().full} ${dataSummary().total - dataSummary().full === 1 ? 'has' : 'have'} title, authors and affiliations only` : ''}.`)}</span></div></div>
      <div class="sheet-meta">${icon('circleCheck')}<div><strong>Continuing medical education</strong><span>${esc(info.cme)}</span></div></div>
      <div class="sheet-meta">${icon('globe')}<div><strong>Meeting language</strong><span>${esc(info.language)}</span></div></div>
    </div>`);
}

function showCommittees() {
  const committees = DATA.config.committees;
  showInformationSheet('Committees', 'BTM 2026', `
    <h3 style="font-size:.8rem;margin:8px 0">Scientific committee</h3><div class="people-grid">${committees.scientific.map(renderPerson).join('')}</div>
    <h3 style="font-size:.8rem;margin:18px 0 8px">Organizing committee</h3><div class="people-grid">${committees.organising.map(renderPerson).join('')}</div>`);
}

function renderPerson(person) {
  return `<div class="card person-card"><span class="avatar">${esc(initials(person.name))}</span><div><strong>${esc(person.name)}</strong><small>${esc(person.detail)}</small></div></div>`;
}

function showPrivacy() {
  const privacy = DATA.config.privacy;
  showInformationSheet('Privacy', 'On-device by design', `<p>${esc(privacy.summary)}</p><p>${esc(privacy.publicationNote)}</p><div class="sheet-meta-list"><div class="sheet-meta">${icon('check')}<div><strong>No account</strong><span>Participants can use the entire app without signing in.</span></div></div><div class="sheet-meta">${icon('check')}<div><strong>No analytics</strong><span>The build contains no analytics, advertising or cross-site tracking SDK.</span></div></div><div class="sheet-meta">${icon('check')}<div><strong>Local preferences</strong><span>Saved items and theme preference remain in this browser on this device.</span></div></div></div>`);
}

function showInformationSheet(title, kicker, content) {
  $('#sheet-content').innerHTML = `<div class="sheet-body"><div class="sheet-header"><div><small>${esc(kicker)}</small><h2>${esc(title)}</h2></div><button class="top-icon" type="button" data-action="close-sheet" aria-label="Close">${icon('x')}</button></div><div class="sheet-content">${content}</div></div>`;
  openDialog($('#action-sheet'));
}

function eventICS({ title, description, location, start, end }) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const toUtc = value => new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const clean = value => String(value || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BTM 2026//Conference PWA//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${crypto.randomUUID ? crypto.randomUUID() : Date.now()}@btm2026`, `DTSTAMP:${stamp}`, `DTSTART:${toUtc(start)}`, `DTEND:${toUtc(end)}`, `SUMMARY:${clean(title)}`, `DESCRIPTION:${clean(description)}`, `LOCATION:${clean(location)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}

function downloadICS(filename, content) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  toast('Calendar file created');
}

function calendarForProgramme(id) {
  const entry = programmeEntryById(id);
  if (!entry) return;
  downloadICS(`BTM2026-${entry.id}.ics`, eventICS({
    title: entry.speaker ? `${entry.speaker}: ${entry.title}` : entry.title,
    description: `${entry.session.title}\nBrain Tumor Meeting 2026`,
    location: entry.location,
    start: `${entry.day.date}T${entry.start}:00+02:00`,
    end: `${entry.day.date}T${entry.end}:00+02:00`,
  }));
}

function calendarForAbstract(id) {
  const abstract = abstractById(id);
  if (!abstract?.programme) return;
  const programme = abstract.programme;
  downloadICS(`BTM2026-abstract-${abstract.submissionId}.ics`, eventICS({
    title: abstract.title,
    description: `${programme.sessionTitle}\n${programme.programmeSpeaker}\nBrain Tumor Meeting 2026`,
    location: programme.location,
    start: `${programme.date}T${programme.start}:00+02:00`,
    end: `${programme.date}T${programme.end}:00+02:00`,
  }));
}

async function sharePayload(payload) {
  try {
    if (navigator.share) await navigator.share(payload);
    else {
      await navigator.clipboard.writeText([payload.title, payload.text, payload.url].filter(Boolean).join('\n'));
      toast('Copied to clipboard');
    }
  } catch (error) {
    if (error.name !== 'AbortError') toast('Sharing is not available in this browser');
  }
}

function shareAbstract(id) {
  const abstract = abstractById(id);
  if (!abstract) return;
  const url = new URL(`#/abstract/${abstract.id}`, location.href).href;
  sharePayload({ title: abstract.title, text: `${abstract.presentingAuthors[0] || abstract.leadAuthor} · BTM 2026`, url });
}

function shareProgramme(id) {
  const entry = programmeEntryById(id);
  if (!entry) return;
  sharePayload({ title: entry.title, text: `${entry.day.label}, ${entry.start}–${entry.end} · ${entry.speaker || entry.session.title}`, url: new URL('#/programme', location.href).href });
}

async function copyCitation(id) {
  const abstract = abstractById(id);
  if (!abstract) return;
  const authors = abstract.authors.map(author => author.name).join(', ');
  const text = `${authors}. ${abstract.title}. Brain Tumor Meeting 2026, Berlin. Abstract ${abstract.submissionId}.`;
  try { await navigator.clipboard.writeText(text); toast('Title and authors copied'); } catch { toast('Could not access the clipboard'); }
}

function detectInstallPlatform() {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

async function showInstall() {
  if (state.standalone) { toast('BTM 2026 is already installed'); return; }
  if (state.deferredInstall) {
    state.deferredInstall.prompt();
    const choice = await state.deferredInstall.userChoice;
    if (choice.outcome === 'accepted') toast('BTM 2026 is being installed');
    state.deferredInstall = null;
    return;
  }
  const platform = detectInstallPlatform();
  const content = platform === 'ios'
    ? `<p>Install from Safari to open BTM 2026 like a conventional full-screen app.</p><div class="install-steps"><div class="install-step"><span class="install-step-index">1</span><div><strong>Open the Share menu</strong><p>Tap the square-with-arrow Share button in Safari.</p></div></div><div class="install-step"><span class="install-step-index">2</span><div><strong>Choose “Add to Home Screen”</strong><p>Scroll through the actions if the option is not immediately visible.</p></div></div><div class="install-step"><span class="install-step-index">3</span><div><strong>Confirm “Add”</strong><p>The BTM icon will appear on the Home Screen.</p></div></div></div>`
    : platform === 'android'
      ? `<p>Chrome can install this conference app without Google Play.</p><div class="install-steps"><div class="install-step"><span class="install-step-index">1</span><div><strong>Open the Chrome menu</strong><p>Tap the three-dot menu in the browser toolbar.</p></div></div><div class="install-step"><span class="install-step-index">2</span><div><strong>Choose “Install app”</strong><p>On some versions this is labelled “Add to Home screen”.</p></div></div><div class="install-step"><span class="install-step-index">3</span><div><strong>Confirm installation</strong><p>The app opens full-screen and keeps its offline conference content.</p></div></div></div>`
      : `<p>Use your browser’s install control in the address bar or application menu. Chrome and Edge usually show an install icon when the PWA is ready.</p>`;
  $('#install-content').innerHTML = content;
  openDialog($('#install-dialog'));
}

function updateInstallButtons() {
  $$('[data-action="install"]').forEach(button => {
    button.hidden = state.standalone;
    button.setAttribute('aria-hidden', state.standalone ? 'true' : 'false');
  });
}

async function checkForUpdate() {
  if (!state.serviceWorkerRegistration) { toast('Offline service is not available yet'); return; }
  toast('Checking for updates…');
  try { await state.serviceWorkerRegistration.update(); toast('Content check complete'); }
  catch { toast('Could not check for an update while offline'); }
}

function clearSaved() {
  if (!state.favourites.size) { toast('There are no saved items'); return; }
  if (!confirm('Remove all saved programme items and abstracts from this device?')) return;
  state.favourites.clear();
  saveFavourites();
  toast('Saved items cleared');
  renderRoute(false);
}

function bindEvents() {
  window.addEventListener('hashchange', () => renderRoute());
  window.addEventListener('online', updateOnlineState);
  window.addEventListener('offline', updateOnlineState);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { if (state.theme === 'system') applyTheme(); });

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    state.deferredInstall = event;
    updateInstallButtons();
  });
  window.addEventListener('appinstalled', () => {
    state.standalone = true;
    state.deferredInstall = null;
    updateInstallButtons();
    toast('BTM 2026 installed');
  });

  document.addEventListener('keydown', event => {
    const rowLink = event.target.closest?.('tr[data-href]');
    if (rowLink && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); location.hash = rowLink.dataset.href; }
  });

  document.addEventListener('input', event => {
    if (event.target.id === 'programme-search') {
      state.programmeQuery = event.target.value;
      debounceRender('programme');
    }
    if (event.target.id === 'abstract-search') {
      state.abstractQuery = event.target.value;
      debounceRender('abstracts');
    }
    if (event.target.id === 'poster-search') {
      state.posterQuery = event.target.value;
      debounceRender('posters');
    }
  });

  document.addEventListener('change', event => {
    if (event.target.id === 'abstract-sort') { state.abstractSort = event.target.value; renderRoute(false); }
  });

  document.addEventListener('keydown', event => {
    const target = event.target.closest?.('[data-action="program-item"], [data-action="open-abstract"]');
    if (target && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); target.click(); }
  });

  document.addEventListener('click', event => {
    const rowLink = event.target.closest('tr[data-href]');
    if (rowLink) { location.hash = rowLink.dataset.href; return; }
    const actionElement = event.target.closest('[data-action]');
    if (!actionElement) return;
    const action = actionElement.dataset.action;
    const id = actionElement.dataset.id;
    const value = actionElement.dataset.value;

    if (action.startsWith('toggle-')) event.stopPropagation();
    switch (action) {
      case 'theme': cycleTheme(); break;
      case 'install': showInstall(); break;
      case 'close-install': closeDialog($('#install-dialog')); break;
      case 'close-sheet': closeDialog($('#action-sheet')); break;
      case 'programme-day': state.programmeDay = value; renderRoute(false); break;
      case 'programme-filter': state.programmeFilter = value; renderRoute(false); break;
      case 'clear-programme-search': state.programmeQuery = ''; renderRoute(false); break;
      case 'reset-programme': state.programmeQuery = ''; state.programmeFilter = 'all'; renderRoute(false); break;
      case 'program-item': openProgrammeSheet(id); break;
      case 'toggle-programme-favourite': {
        toggleFavourite('programme', id);
        const active = isFavourite('programme', id);
        actionElement.classList.toggle('active', active);
        actionElement.innerHTML = icon(active ? 'bookmarkFill' : 'bookmark');
        break;
      }
      case 'toggle-programme-favourite-sheet': toggleFavourite('programme', id); openProgrammeSheet(id); break;
      case 'abstract-filter': state.abstractFilter = value; renderRoute(false); break;
      case 'clear-abstract-search': state.abstractQuery = ''; renderRoute(false); break;
      case 'poster-theme': state.posterTheme = value; renderRoute(false); break;
      case 'clear-poster-search': state.posterQuery = ''; renderRoute(false); break;
      case 'open-abstract': routeTo(`#/abstract/${encodeURIComponent(id)}`); break;
      case 'toggle-abstract-favourite': {
        toggleFavourite('abstract', id);
        if (state.route.name === 'abstract') renderRoute(false);
        else {
          const active = isFavourite('abstract', id);
          actionElement.classList.toggle('active', active);
          actionElement.innerHTML = icon(active ? 'bookmarkFill' : 'bookmark');
          if (state.abstractFilter === 'saved') renderRoute(false);
        }
        break;
      }
      case 'share-abstract': shareAbstract(id); break;
      case 'share-programme': shareProgramme(id); break;
      case 'copy-citation': copyCitation(id); break;
      case 'calendar-programme': calendarForProgramme(id); break;
      case 'calendar-abstract': calendarForAbstract(id); break;
      case 'explore-tab': state.exploreTab = value; renderRoute(false); break;
      case 'show-meeting': showMeetingInfo(); break;
      case 'show-committees': showCommittees(); break;
      case 'show-privacy': showPrivacy(); break;
      case 'check-update': checkForUpdate(); break;
      case 'clear-saved': clearSaved(); break;
      default: break;
    }
  });

  $('#back-button').addEventListener('click', () => {
    if (history.length > 1) history.back(); else routeTo('#/abstracts');
  });

  [$('#action-sheet'), $('#install-dialog')].forEach(dialog => {
    dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(dialog); });
    dialog.addEventListener('close', () => { document.documentElement.style.overflow = ''; });
  });
}

function debounceRender(routeName) {
  clearTimeout(debounceRender.timer);
  debounceRender.timer = setTimeout(() => {
    if (state.route.name === routeName) {
      const inputId = routeName === 'programme' ? 'programme-search' : routeName === 'posters' ? 'poster-search' : 'abstract-search';
      const position = document.getElementById(inputId)?.selectionStart;
      renderRoute(false);
      const input = document.getElementById(inputId);
      if (input) { input.focus({ preventScroll: true }); if (position != null) input.setSelectionRange(position, position); }
    }
  }, 120);
}

function updateOnlineState() {
  $('#offline-banner').hidden = navigator.onLine;
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.register('./service-worker.js');
    state.serviceWorkerRegistration = registration;
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) toast('A new app version is ready. Reopen BTM 2026 to update.');
      });
    });
  } catch (error) {
    console.warn('Service worker registration failed', error);
  }
}

async function loadData() {
  const paths = {
    config: './data/app-config.json',
    program: './data/program.json',
    abstracts: './data/abstracts.json',
    announcements: './data/announcements.json',
  };
  const entries = await Promise.all(Object.entries(paths).map(async ([key, path]) => {
    const response = await fetch(path, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Could not load ${path}`);
    return [key, await response.json()];
  }));
  entries.forEach(([key, value]) => { DATA[key] = value; });
  try {
    const response = await fetch('./data/posters.json', { cache: 'no-cache' });
    DATA.posters = response.ok ? await response.json() : null;
  } catch (error) {
    DATA.posters = null;
  }
}

const REFRESH_MIN_GAP_MS = 60 * 1000;
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
let lastRefreshAt = Date.now();
let refreshPending = false;
let refreshRunning = false;

function userIsTyping() {
  const el = document.activeElement;
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
}

// Re-fetch the data files when the app returns to the foreground or comes back online,
// and re-render only if something actually changed.
async function refreshData(force = false) {
  if (refreshRunning || !navigator.onLine || document.visibilityState !== 'visible') return;
  if (!force && Date.now() - lastRefreshAt < REFRESH_MIN_GAP_MS) return;
  if (userIsTyping()) { refreshPending = true; return; }
  refreshRunning = true;
  lastRefreshAt = Date.now();
  const before = JSON.stringify([DATA.config, DATA.program, DATA.abstracts, DATA.announcements, DATA.posters]);
  const previous = { ...DATA };
  try {
    await loadData();
    const after = JSON.stringify([DATA.config, DATA.program, DATA.abstracts, DATA.announcements, DATA.posters]);
    if (after !== before) {
      renderRoute(false);
      toast('Programme and notices updated');
    }
    refreshPending = false;
  } catch (error) {
    Object.assign(DATA, previous);
    console.warn('Background content check failed', error);
  } finally {
    refreshRunning = false;
  }
  state.serviceWorkerRegistration?.update().catch(() => {});
}

function bindRefreshTriggers() {
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') refreshData(); });
  window.addEventListener('pageshow', event => { if (event.persisted) refreshData(true); });
  window.addEventListener('online', () => refreshData(true));
  document.addEventListener('focusout', () => { if (refreshPending) setTimeout(() => refreshData(true), 300); });
  setInterval(() => refreshData(), REFRESH_INTERVAL_MS);
}

async function initialise() {
  applyTheme();
  bindEvents();
  updateOnlineState();
  try {
    await loadData();
    await registerServiceWorker();
    renderRoute();
    bindRefreshTriggers();
  } catch (error) {
    console.error(error);
    setTopbar({ title: 'BTM 2026', kicker: 'Conference app' });
    $('#app').innerHTML = `<div class="page">${renderEmpty('alert', 'The conference data could not be loaded', 'Reload the page while online. If the app was previously installed, the cached version may become available again.')}</div>`;
  } finally {
    setTimeout(() => $('#boot-splash').classList.add('hidden'), 180);
  }
}

initialise();

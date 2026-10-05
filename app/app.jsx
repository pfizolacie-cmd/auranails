  const { useState, useRef, useEffect, useMemo } = React;

/* ---------- helpers ---------- */
function st(cssText) {
  const obj = {};
  if (!cssText) return obj;
  cssText.split(';').forEach((rule) => {
    const idx = rule.indexOf(':');
    if (idx === -1) return;
    const prop = rule.slice(0, idx).trim();
    const val = rule.slice(idx + 1).trim();
    if (!prop || !val) return;
    const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    obj[camel] = val;
  });
  return obj;
}

/* ---------- icons ---------- */
const ICON_PATHS = {
  sparkle: <path d="M12 3.2l1.7 5.6 5.6 1.7-5.6 1.7L12 17.8l-1.7-5.6L4.7 10.5l5.6-1.7zM18.5 3.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z" />,
  heart: <path d="M12 20.3s-6.8-4.2-6.8-9.4A3.6 3.6 0 0 1 12 7.4a3.6 3.6 0 0 1 6.8 3.5c0 5.2-6.8 9.4-6.8 9.4z" />,
  arrow: <path d="M5 12h13.5M12.5 6l6 6-6 6" />,
  clock: <g><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5.2l3.2 1.9" /></g>,
  gift: <g><rect x="4" y="9" width="16" height="11.5" rx="1.5" /><path d="M3 9h18M12 9v11.5" /><path d="M12 9S11 4.5 8.4 4.5A2 2 0 0 0 8.4 8.5C10.5 8.6 12 9 12 9zM12 9s1-4.5 3.6-4.5A2 2 0 0 1 15.6 8.5C13.5 8.6 12 9 12 9z" /></g>,
  list: <path d="M4 7h16M4 12h16M4 17h16" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  home: <path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />,
  cal: <g><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M4 10h16M9 3v4M15 3v4" /></g>,
  star: <path d="M12 3.5l2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.4l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z" />,
  starf: <path fill="currentColor" stroke="none" d="M12 3.5l2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.4l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z" />,
  user: <g><circle cx="12" cy="8.5" r="3.8" /><path d="M5 20c1-3.5 4-5 7-5s6 1.5 7 5" /></g>,
  users: <g><circle cx="9" cy="9" r="3.3" /><path d="M3 19c.8-3 3.3-4.5 6-4.5s5.2 1.5 6 4.5M16 6a3 3 0 0 1 0 6M18 14.5c1.6.6 2.6 2 3 4.5" /></g>,
  tag: <g><path d="M4 12V5a1 1 0 0 1 1-1h7l8 8-8 8z" /><circle cx="8.5" cy="8.5" r="1.3" /></g>,
  chart: <path d="M5 19V11M10 19V6M15 19v-5M20 19V9" />,
  inbox: <path d="M4 13l2.5-7h11L20 13v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM4 13h5l1 2h4l1-2h5" />,
  back: <path d="M15 6l-6 6 6 6" />,
  fwd: <path d="M9 6l6 6-6 6" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
  phone: <path d="M6 4h3l1.5 4-2 1.3a10 10 0 0 0 6.2 6.2l1.3-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 4.5 5.6 1.5 1.5 0 0 1 6 4z" />,
  trash: <path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13" />,
  merge: <path d="M6 4v5c0 3 6 4 6 8v3M18 4v5c0 3-6 4-6 8" />,
  dl: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
  search: <g><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" /></g>,
  cake: <path d="M5 20v-7h14v7zM5 16c2 1 3-1 4.7 0s2.6 1 4.6 0 3-1 4.7 0M12 13v-3M12 7.5c-1-1 0-2.5 0-3 0 .5 1 2 0 3z" />,
  refresh: <path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5" />,
  hand: <path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12m0-6.5a1.5 1.5 0 0 1 3 0V12m0-5a1.5 1.5 0 0 1 3 0v6c0 4-2.5 7-6 7-2.6 0-4-1.2-5.5-3.5L4 13.8a1.5 1.5 0 0 1 2.4-1.7L8 14" />,
  chat: <path d="M5 18l-1 3 4-1.5A8.5 8.5 0 1 0 5 18z" />,
  info: <g><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8v.01" /></g>,
  moon: <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" />,
  bell: <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20h4" />,
  logout: <path d="M15 5H8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7M11 8l-4 4 4 4M7 12h13" />,
  send: <path d="M4 12l16-7-6 16-3-6z" />,
  swap: <path d="M7 4L4 7l3 3M4 7h12M17 20l3-3-3-3M20 17H8" />,
};
function Icon({ name, size = 22, style = {}, strokeWidth = 1.4 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', ...style }} aria-hidden="true">
      {ICON_PATHS[name] || null}
    </svg>
  );
}


/* ============================================================
   Espresso Night — UI stavebnice (redesign build 25)
   Malé komponenty, aby všetky obrazovky vyzerali ako schválený náhľad.
   ============================================================ */
const T = {
  lbl: 'font-family:var(--font-sans);font-size:.64rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3)',
  mut: 'font-family:var(--font-sans);font-size:.72rem;color:var(--ink-3);line-height:1.45',
  serif: 'font-family:var(--font-display);font-weight:300;color:var(--ink)',
  card: 'background:var(--white);border:1px solid var(--line);border-radius:18px;padding:14px',
  inp: 'all:unset;display:block;width:100%;box-sizing:border-box;padding:10px 12px;border-radius:12px;background:#1B1311;border:1px solid #3A2A25;font-family:var(--font-sans);font-size:.76rem;color:var(--ink)',
  page: 'flex:1;padding:6px 18px 96px;overflow:auto',
};
function Lbl({ children, gold, style }) {
  return <div style={{ ...st(T.lbl), ...(gold ? { color: 'var(--espresso)' } : {}), ...(style || {}) }}>{children}</div>;
}
function Btn({ children, onClick, kind = 'gold', disabled, full, small, style, icon, label }) {
  const base = `all:unset;box-sizing:border-box;cursor:${disabled ? 'not-allowed' : 'pointer'};display:inline-flex;align-items:center;justify-content:center;gap:6px;text-align:center;border-radius:14px;font-family:var(--font-sans);white-space:nowrap;opacity:${disabled ? 0.4 : 1};`
    + (small ? 'padding:6px 10px;font-size:.64rem;' : 'padding:10px 14px;font-size:.75rem;')
    + (full ? 'width:100%;display:flex;' : '');
  const kinds = {
    gold: 'background:var(--espresso);color:var(--porcelain);font-weight:600;',
    ghost: 'background:transparent;color:var(--ink);border:1px solid #4A322B;font-weight:500;',
    red: 'background:transparent;color:var(--danger);border:1px solid rgba(229,156,142,.35);font-weight:500;',
    soft: 'background:var(--sand);color:var(--espresso);font-weight:500;',
  };
  return <button type="button" aria-label={label} onClick={disabled ? undefined : onClick} disabled={disabled} style={{ ...st(base + kinds[kind]), ...(style || {}) }}>{icon && <Icon name={icon} size={small ? 12 : 14} strokeWidth={1.8} />}{children}</button>;
}
function Sq({ icon, size = 38, onClick, color, bg, round, badge: badgeN, label }) {
  const stl = { width: size, height: size, flex: `0 0 ${size}px`, borderRadius: round ? '50%' : Math.round(size * 0.32), display: 'grid', placeItems: 'center', background: bg || 'var(--sand)', color: color || 'var(--espresso)', position: 'relative' };
  const inner = (<React.Fragment><Icon name={icon} size={Math.round(size * 0.45)} strokeWidth={1.6} />{badgeN ? <span style={st('position:absolute;top:-3px;right:-3px;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:99px;background:var(--danger);color:var(--porcelain);font:700 .55rem Inter,sans-serif;display:grid;place-items:center')}>{badgeN}</span> : null}</React.Fragment>);
  if (onClick) return <button type="button" aria-label={label} onClick={onClick} style={{ all: 'unset', cursor: 'pointer', ...stl }}>{inner}</button>;
  return <span style={stl}>{inner}</span>;
}
function Seg({ items, value, onChange, small }) {
  return (
    <div style={st('display:flex;background:var(--white);border-radius:12px;padding:3px;overflow-x:auto')}>
      {items.map((it) => {
        const on = it.id === value;
        return <button type="button" key={it.id} onClick={() => onChange(it.id)} style={st(`all:unset;cursor:pointer;flex:1;text-align:center;padding:${small ? '6px 6px' : '7px 6px'};border-radius:9px;white-space:nowrap;font-family:var(--font-sans);font-size:${small ? '.62rem' : '.68rem'};color:${on ? 'var(--ink)' : 'var(--ink-3)'};background:${on ? 'var(--blush)' : 'transparent'}`)}>{it.label}</button>;
      })}
    </div>
  );
}
function ListRow({ icon, title, sub, right, onClick, accent, chevron }) {
  const inner = (
    <React.Fragment>
      {icon && <Sq icon={icon} />}
      <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '.78rem', color: 'var(--ink)' }}>{title}</span>
        {sub && <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '.72rem', color: 'var(--ink-3)', marginTop: 1 }}>{sub}</span>}
      </span>
      {right}
      {chevron && <span style={{ color: 'var(--taupe-dark)' }}><Icon name="fwd" size={16} /></span>}
    </React.Fragment>
  );
  const box = `display:flex;align-items:center;gap:12px;width:100%;box-sizing:border-box;margin-top:8px;padding:11px 14px;background:var(--white);border-radius:18px;border:1px solid ${accent || 'var(--sand)'}`;
  if (onClick) return <button type="button" onClick={onClick} style={st('all:unset;cursor:pointer;' + box)}>{inner}</button>;
  return <div style={st(box)}>{inner}</div>;
}
function Toggle({ on, onClick, label }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} style={st(`all:unset;cursor:pointer;width:34px;height:20px;flex:0 0 34px;border-radius:10px;position:relative;background:${on ? 'var(--espresso)' : 'var(--sand)'}`)}>
      <span style={st(`position:absolute;top:2px;${on ? 'right:2px' : 'left:2px'};width:16px;height:16px;border-radius:50%;background:${on ? 'var(--porcelain)' : 'var(--taupe-dark)'}`)}></span>
    </button>
  );
}
function Avatar({ name, size = 40 }) {
  const ini = String(name || '?').split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('');
  return <span style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,#6B4A3E,#3B2722)', fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: size * 0.36, color: 'var(--ink)' }}>{ini}</span>;
}
function Sheet({ children }) {
  return (
    <div style={st('position:fixed;left:50%;transform:translateX(-50%);bottom:0;width:100%;max-width:282px;box-sizing:border-box;padding:16px 18px calc(22px + env(safe-area-inset-bottom));background:var(--white);border-radius:24px 24px 0 0;border-top:1px solid #3A2A25;box-shadow:0 -20px 40px -20px rgba(0,0,0,.6);z-index:25')}>
      <div style={st('width:36px;height:4px;border-radius:2px;background:#4A322B;margin:-6px auto 12px')}></div>
      {children}
    </div>
  );
}
function SheetBar({ sub, price, action, onAction, disabled }) {
  return (
    <Sheet>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={st(T.mut + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{sub}</div>
          <div style={st(T.serif + ';font-size:1.4rem;line-height:1.2')}>{price}</div>
        </div>
        <Btn onClick={onAction} disabled={disabled} style={{ padding: '13px 18px', flexShrink: 0 }}>{action} <Icon name="arrow" size={14} strokeWidth={1.8} /></Btn>
      </div>
    </Sheet>
  );
}
function Glow({ style }) {
  return <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(203,170,140,.28),transparent 70%)', top: -90, right: -90, pointerEvents: 'none', ...(style || {}) }}></div>;
}
function TabBar({ items }) {
  return (
    <div style={st('display:flex;justify-content:space-around;align-items:center;padding:7px 0 calc(5px + env(safe-area-inset-bottom));background:rgba(23,16,15,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid #2C201C;position:fixed;left:50%;transform:translateX(-50%);bottom:0;width:100%;max-width:282px;box-sizing:border-box;z-index:20')}>
      {items.map((it) => (
        <button type="button" key={it.label} aria-label={it.label} onClick={it.onClick} style={st(`all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;min-width:44px;padding:0;position:relative;color:${it.on ? 'var(--espresso)' : '#7D6A62'}`)}>
          <Icon name={it.icon} size={18} strokeWidth={1.6} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.56rem' }}>{it.label}</span>
          {it.badge ? <span style={st('position:absolute;top:-2px;right:6px;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:99px;background:var(--danger);color:var(--porcelain);font:700 .55rem Inter,sans-serif;display:grid;place-items:center')}>{it.badge}</span> : null}
        </button>
      ))}
    </div>
  );
}
function Stars({ value, onRate }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button type="button" key={n} onClick={onRate ? () => onRate(n) : undefined} aria-label={`Ohodnotiť ${n} hviezdičkami`} style={{ all: 'unset', cursor: onRate ? 'pointer' : 'default', color: n <= value ? 'var(--espresso)' : 'var(--beige)' }}>
          <Icon name="starf" size={15} />
        </button>
      ))}
    </span>
  );
}
function Note({ tone = 'wait', icon = 'info', children, style }) {
  const c = { wait: ['var(--wait-bg)', 'var(--wait)', 'rgba(229,184,110,.3)'], ok: ['var(--ok-bg)', 'var(--ok)', 'rgba(127,176,138,.3)'], danger: ['var(--danger-bg)', 'var(--danger)', 'rgba(229,156,142,.3)'], plain: ['var(--white)', 'var(--ink-3)', 'var(--sand)'] }[tone];
  return <div style={{ ...st(`display:flex;gap:8px;align-items:flex-start;border-radius:12px;padding:10px 12px;font-family:var(--font-sans);font-size:.68rem;line-height:1.45;background:${c[0]};color:${c[1]};border:1px solid ${c[2]}`), ...(style || {}) }}><span style={{ flexShrink: 0, marginTop: 1 }}><Icon name={icon} size={14} strokeWidth={1.7} /></span><span>{children}</span></div>;
}

/* ---------- date helpers (real calendar, not a fixed demo window) ---------- */
const SK_DOW = ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'];
const SK_MON = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];
const CLOSE_HOUR = 18;
const OPEN_HOUR = 8;
// Po–Pi musí byť posledná klientka hotová do 14:45 (Michaela ide pre deti do škôlky)
const WEEKDAY_CLOSE_HOUR = 14.75;
// po každej klientke aspoň 10 minút oddych
const BREAK_HOURS = 10 / 60;
function closeHourFor(iso) {
  if (!iso) return CLOSE_HOUR;
  const [y, m, d] = iso.split('-').map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  return dow >= 1 && dow <= 5 ? WEEKDAY_CLOSE_HOUR : CLOSE_HOUR;
}
function hoursToTime(h) {
  const total = Math.round(h * 60);
  return Math.floor(total / 60) + ':' + String(total % 60).padStart(2, '0');
}

function isoOffset(daysFromToday) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + daysFromToday);
  // lokálny dátum — toISOString() je v UTC a na Slovensku vracal včerajší deň
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function isoParts(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return { dow: SK_DOW[dateObj.getDay()], num: d, mon: SK_MON[m - 1] };
}
const BOOKING_WINDOW_DAYS = 30;
function buildDateOptions(days = BOOKING_WINDOW_DAYS) {
  const out = [];
  for (let i = 0; i < days; i++) {
    const iso = isoOffset(i);
    out.push({ iso, ...isoParts(iso) });
  }
  return out;
}
function buildMonthGrid(monthOffset, selectedIso, todayIsoValue, isDisabledFn, dotFn) {
  const SK_MONTH_FULL = ['Január','Február','Marec','Apríl','Máj','Jún','Júl','August','September','Október','November','December'];
  const now = new Date(todayIsoValue + 'T00:00:00');
  const viewDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const y = viewDate.getFullYear(), m = viewDate.getMonth();
  const firstOfMonth = new Date(y, m, 1);
  const startDow = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(y, m, 1 - startDow);
  const lastOfMonth = new Date(y, m + 1, 0);
  const endDow = (lastOfMonth.getDay() + 6) % 7;
  const totalDays = startDow + lastOfMonth.getDate() + (6 - endDow);
  const cells = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    const iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    cells.push({
      iso,
      num: d.getDate(),
      muted: d.getMonth() !== m,
      selected: iso === selectedIso,
      today: iso === todayIsoValue,
      disabled: isDisabledFn ? isDisabledFn(iso, d.getMonth() !== m) : false,
      dot: dotFn ? dotFn(iso) : null,
    });
  }
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return { label: `${SK_MONTH_FULL[m]} ${y}`, weeks };
}
function isoLabel(iso) {
  const p = isoParts(iso);
  return `${p.dow} ${p.num}. ${p.mon}`;
}
function daysUntilBirthday(birthdayIso) {
  if (!birthdayIso) return null;
  const mmdd = birthdayIso.slice(5);
  for (let i = 0; i < 366; i++) {
    if (isoOffset(i).slice(5) === mmdd) return i;
  }
  return null;
}
function parseDateToIso(text) {
  const m = text.match(/(\d{1,2})/);
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const found = buildDateOptions().find((d) => d.num === day);
  return found ? found.iso : null;
}
function timeToHours(t) { const [h, m] = t.split(':').map(Number); return h + (m || 0) / 60; }
function formatDuration(h) {
  if (!h && h !== 0) return '';
  const total = Math.round(Number(h) * 60);
  const hh = Math.floor(total / 60), mm = total % 60;
  if (!hh) return `${mm} min`;
  return mm ? `${hh} h ${mm} min` : `${hh} h`;
}
// "Gélové nechty" a "Gelove  nechty" musia byť pre štatistiky to isté
function normText(t) {
  return String(t == null ? '' : t).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[-–—]/g, ' ').replace(/\s+/g, ' ').trim();
}
// mobil: 0915 123 456, +421 915 123 456, 00421…
function normalizePhone(t) {
  let p = String(t || '').replace(/[\s\-\/().]/g, '');
  if (p.startsWith('00')) p = '+' + p.slice(2);
  return p;
}
function isValidPhone(t) { return /^(\+\d{9,14}|0\d{9})$/.test(normalizePhone(t)); }
function clampDuration(v) { return Math.min(8, Math.max(0.25, Math.round(Number(v) * 4) / 4)); }

// Výber trvania bez písania: −/+ po 15 minútach a rýchle voľby.
// (Pôvodné číselné pole sa pri mazaní "zaseklo" na 0,25 h.)
const DURATION_CHIPS = [0.5, 1, 1.5, 2, 2.5, 3];
function DurationField({ value, onChange, autoValue }) {
  const v = Number(value) > 0 ? Number(value) : 1;
  const roundBtn = 'all:unset;cursor:pointer;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid var(--line-gold);background:var(--white);color:var(--ink);font-size:.95rem;line-height:1;flex-shrink:0';
  const chip = (on) => `all:unset;cursor:pointer;padding:5px 9px;border-radius:999px;font-family:var(--font-sans);font-size:.62rem;color:${on ? 'var(--porcelain)' : 'var(--ink-2)'};background:${on ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${on ? 'var(--espresso)' : 'var(--line-gold)'}`;
  const showAuto = autoValue && Math.abs(autoValue - v) > 0.001;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <button type="button" onClick={() => onChange(clampDuration(v - 0.25))} style={st(roundBtn)} aria-label="Skrátiť o 15 minút">−</button>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '1.05rem', color: 'var(--ink)' }}>{formatDuration(v)}</div>
        <button type="button" onClick={() => onChange(clampDuration(v + 0.25))} style={st(roundBtn)} aria-label="Predĺžiť o 15 minút">+</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {DURATION_CHIPS.map((d) => (
          <button type="button" key={d} onClick={() => onChange(d)} style={st(chip(Math.abs(d - v) < 0.001))}>{formatDuration(d)}</button>
        ))}
      </div>
      {showAuto && (
        <button type="button" onClick={() => onChange(autoValue)} style={st('all:unset;cursor:pointer;display:block;margin-top:8px;font-family:var(--font-sans);font-size:.72rem;color:var(--mocha)')}>Podľa cenníka {formatDuration(autoValue)} — použiť</button>
      )}
    </div>
  );
}
function overlaps(aStart, aDur, bStart, bDur) { return aStart < bStart + bDur && bStart < aStart + aDur; }
// dnešný čas, ktorý už prešiel, sa ponúkať nemá
function isPastSlot(iso, timeStr) {
  if (iso !== isoOffset(0)) return iso < isoOffset(0);
  const now = new Date();
  return timeToHours(timeStr) <= now.getHours() + now.getMinutes() / 60;
}
function slotAvailable(iso, timeStr, durationHours, appointments) {
  const start = timeToHours(timeStr);
  if (start + durationHours > closeHourFor(iso) + 1e-6) return false;
  // medzi klientkami 10 min oddych (pri nastavenom voľne netreba)
  return !appointments.some((a) => {
    if (a.date !== iso) return false;
    const gap = a.blocked ? 0 : BREAK_HOURS;
    return overlaps(start, durationHours + gap, timeToHours(a.time), (Number(a.duration) || 0) + gap);
  });
}
// základné časy po pol hodine + čas hneď po oddychu za každou klientkou v daný deň,
// aby sa po 10 min prestávke nestrácala celá polhodina
function buildTimeOptions(iso, appointments) {
  const base = BASE_TIME_OPTIONS.slice();
  if (!iso || !appointments) return base;
  appointments.forEach((a) => {
    if (a.date !== iso || a.blocked) return;
    const after = Math.ceil((timeToHours(a.time) + (Number(a.duration) || 0) + BREAK_HOURS) * 12 - 1e-6) / 12; // zaokrúhlené na 5 min
    const t = hoursToTime(after);
    if (after >= OPEN_HOUR && after < closeHourFor(iso) && !base.includes(t)) base.push(t);
  });
  return base.sort((x, y) => timeToHours(x) - timeToHours(y));
}
const BASE_TIME_OPTIONS = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
const DURATION_PRESETS = [{ label: '30 min', val: 0.5 }, { label: '1 h', val: 1 }, { label: '1,5 h', val: 1.5 }, { label: '2 h', val: 2 }];
const DEMO_CLIENT_NAME = 'Zuzana Kráľová';

// Predvolené trvanie služieb v hodinách. Slúži len ako záloha pre položky
// cenníka, ktoré ešte nemajú vlastné trvanie — Michaela ho vie prepísať
// v admin cenníku a od tej chvíle platí to jej.
const DEFAULT_DURATIONS = {
  'Nová modelácia — Krátke': 2, 'Nová modelácia — Stredné': 2.5, 'Nová modelácia — Dlhé': 3,
  'Doplnenie — Krátke': 1.5, 'Doplnenie — Stredné': 2, 'Doplnenie — Dlhé': 2.5,
  'Jednorázové': 2.5, 'Gél lak': 1.5,
  'Prístrojová manikúra': 1, 'SPA manikúra s peelingom': 1.5, 'Hydratačný zábal a masáž rúk': 0.5,
  'Odstránenie nechtov': 0.5, 'Odstránenie + prístrojová manikúra': 1,
  'IBX regeneračná kúra': 0.5, 'IBX kúra + prístrojová manikúra': 1,
  'Francúzska manikúra': 0.5, 'Francúzska manikúra (vstavaná)': 0.5,
  'Babyboomer (vstavaný)': 0.5, 'Oprava nechtu mimo termín': 0.5,
};
// Položky, ktoré sa štandardne ponúkajú ako doplnok k hlavnej službe,
// nie ako samostatná návšteva.
const DEFAULT_ADDONS = ['Francúzska manikúra', 'Francúzska manikúra (vstavaná)', 'Babyboomer (vstavaný)', 'Hydratačný zábal a masáž rúk'];
const FALLBACK_DURATION = 1.5;
function itemDuration(item) {
  const d = Number(item && item.duration);
  if (d > 0) return d;
  return DEFAULT_DURATIONS[item && item.label] || FALLBACK_DURATION;
}
function isAddonItem(item) {
  if (!item) return false;
  if (typeof item.addon === 'boolean') return item.addon;
  return DEFAULT_ADDONS.indexOf(item.label) !== -1;
}
// "35 €" → 35 ; zvládne aj desatinnú čiarku ("12,50 €")
function priceToNumber(p) {
  const m = String(p == null ? '' : p).replace(',', '.').match(/[0-9.]+/);
  return m ? parseFloat(m[0]) : 0;
}
function formatPrice(n) {
  if (!n) return '0 €';
  return (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',')) + ' €';
}

/* ---------- Firebase setup ---------- */
const FIREBASE_READY = typeof window.firebaseConfig === 'object'
  && window.firebaseConfig.apiKey && window.firebaseConfig.apiKey.indexOf('VLOZ_') === -1;
let db = null;
let auth = null;
if (FIREBASE_READY) {
  try {
    firebase.initializeApp(window.firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
  } catch (e) { console.error('Firebase init error', e); }
}
function authErrorSk(code) {
  const map = {
    'auth/email-already-in-use': 'Tento email už je zaregistrovaný.',
    'auth/invalid-email': 'Neplatný email.',
    'auth/weak-password': 'Heslo musí mať aspoň 6 znakov.',
    'auth/wrong-password': 'Nesprávne heslo.',
    'auth/user-not-found': 'Účet s týmto emailom neexistuje.',
    'auth/invalid-credential': 'Nesprávny email alebo heslo.',
    'auth/missing-password': 'Zadajte heslo.',
    'auth/too-many-requests': 'Príliš veľa pokusov, skúste to o chvíľu.',
  };
  return map[code] || 'Nastala chyba, skúste to znova.';
}

async function seedIfEmpty() {
  const snap = await db.collection('clients').limit(1).get();
  if (!snap.empty) return;
  const clientsSeed = [
    { name: 'Zuzana Kráľová', phone: '+421 905 111 222', stamps: 3, visits: 8, lastVisit: '13. júl 2026', notes: 'Alergia na akrylát — používať len gél. Preferuje tichšiu hudbu.', birthday: '2026-08-08', history: [{ service: 'Gélové nechty — Stredné', date: '13. júl 2026' }, { service: 'Gél lak', date: '2. jún 2026' }, { service: 'SPA manikúra', date: '18. apr 2026' }] },
    { name: 'Petra Novotná', phone: '+421 918 333 444', stamps: 5, visits: 14, lastVisit: '2. aug 2026', notes: '', birthday: '', history: [{ service: 'SPA manikúra s peelingom', date: '2. aug 2026' }, { service: 'IBX kúra', date: '5. júl 2026' }] },
    { name: 'Ivana Baková', phone: '+421 905 123 456', stamps: 1, visits: 2, lastVisit: '20. jún 2026', notes: '', birthday: '', history: [{ service: 'IBX regeneračná kúra', date: '20. jún 2026' }] },
    { name: 'Katarína Hudecová', phone: '+421 902 555 111', stamps: 0, visits: 1, lastVisit: '15. máj 2026', notes: '', birthday: '', history: [{ service: 'Francúzska manikúra', date: '15. máj 2026' }] },
    { name: 'Simona Tóthová', phone: '+421 911 222 333', stamps: 4, visits: 9, lastVisit: '28. júl 2026', notes: 'Krátke nechty, citlivá kutikula.', birthday: '', history: [{ service: 'Nová modelácia — Dlhé', date: '28. júl 2026' }, { service: 'Babyboomer', date: '30. jún 2026' }] },
  ];
  const appointmentsSeed = [
    { date: isoOffset(0), time: '9:00', name: 'Zuzana Kráľová', service: 'Gélové nechty — Stredné', duration: 2, manual: false },
    { date: isoOffset(0), time: '11:00', name: 'Petra Novotná', service: 'SPA manikúra s peelingom', duration: 1, manual: false },
    { date: isoOffset(0), time: '14:00', name: 'Michaela Vidová', service: 'Francúzska manikúra', duration: 0.5, manual: false },
    { date: isoOffset(2), time: '10:00', name: 'Ivana Baková', service: 'IBX regeneračná kúra', duration: 2, manual: false },
    { date: isoOffset(5), time: '9:00', name: 'Simona Tóthová', service: 'Manikúra', duration: 1, manual: false },
    { date: isoOffset(5), time: '14:00', name: 'Katarína Hudecová', service: 'Gélové nechty — Dlhé', duration: 2, manual: false },
  ];
  const requestsSeed = [
    { name: 'Ivana Baková', phone: '+421 905 123 456', service: 'IBX regeneračná kúra', date: isoOffset(4), time: '14:00' },
    { name: 'Simona Tóthová', phone: '+421 911 222 333', service: 'Nová modelácia — Dlhé', date: isoOffset(5), time: '16:00' },
    { name: 'Katarína Hudecová', phone: '+421 902 555 111', service: 'Francúzska manikúra', date: isoOffset(6), time: '10:00' },
  ];
  const batch = db.batch();
  clientsSeed.forEach((c) => batch.set(db.collection('clients').doc(), c));
  appointmentsSeed.forEach((a) => batch.set(db.collection('appointments').doc(), a));
  requestsSeed.forEach((r) => batch.set(db.collection('requests').doc(), r));
  await batch.commit();
}

const CENNIK_SEED = [
  { name: 'Gélové nechty', sub: 'Predĺženie & spevnenie', items: [
    { label: 'Nová modelácia — Krátke', price: '33 €', duration: 2 }, { label: 'Nová modelácia — Stredné', price: '35 €', duration: 2.5 },
    { label: 'Nová modelácia — Dlhé', price: '38 €', duration: 3 }, { label: 'Doplnenie — Krátke', price: '30 €', duration: 1.5 },
    { label: 'Doplnenie — Stredné', price: '32 €', duration: 2 }, { label: 'Doplnenie — Dlhé', price: '35 €', duration: 2.5 },
    { label: 'Jednorázové', price: '40 €', duration: 2.5 }, { label: 'Gél lak', price: '28 €', duration: 1.5 } ] },
  { name: 'Manikúra', sub: 'Starostlivosť', items: [
    { label: 'Prístrojová manikúra', price: '20 €', duration: 1 }, { label: 'SPA manikúra s peelingom', price: '25 €', duration: 1.5 },
    { label: 'Hydratačný zábal a masáž rúk', price: '10 €', duration: 0.5, addon: true } ] },
  { name: 'Odborná starostlivosť', sub: 'Zdravie nechtov', items: [
    { label: 'Odstránenie nechtov', price: '15 €', duration: 0.5 }, { label: 'Odstránenie + prístrojová manikúra', price: '25 €', duration: 1 },
    { label: 'IBX regeneračná kúra', price: '15 €', duration: 0.5 }, { label: 'IBX kúra + prístrojová manikúra', price: '25 €', duration: 1 } ] },
  { name: 'Dizajn a doplnky', sub: 'Doplnky', items: [
    { label: 'Francúzska manikúra', price: '3 €', duration: 0.5, addon: true }, { label: 'Francúzska manikúra (vstavaná)', price: '5 €', duration: 0.5, addon: true },
    { label: 'Babyboomer (vstavaný)', price: '3 €', duration: 0.5, addon: true }, { label: 'Oprava nechtu mimo termín', price: '3 €', duration: 0.5 } ] },
];
async function seedPricingIfMissing() {
  const doc = await db.collection('settings').doc('cennik').get();
  if (doc.exists) return;
  await db.collection('settings').doc('cennik').set({ categories: CENNIK_SEED });
}

function useCollection(name, uid) {
  const [items, setItems] = useState(null);
  useEffect(() => {
    if (!db) return;
    // Kým nie je jasné, či je používateľ prihlásený (uid === undefined), nespúšťame
    // poslucháča — inak by dostal "prístup zamietnutý", zomrel by a appka by
    // čakala donekonečna. Po zmene prihlásenia sa poslucháč nadviaže znova.
    if (uid === undefined) return;
    setItems(null);
    const unsub = db.collection(name).onSnapshot((snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (err) => { console.error(name, err); setItems([]); });
    return unsub;
  }, [name, uid]);
  return items;
}

function useOwnClientDoc(uid) {
  const [data, setData] = useState(undefined); // undefined = loading, null = confirmed absent, object = found
  useEffect(() => {
    if (!db || !uid) { setData(uid === null ? null : undefined); return; }
    setData(undefined);
    const unsub = db.collection('clients').doc(uid).onSnapshot((doc) => {
      setData(doc.exists ? { id: doc.id, ...doc.data() } : null);
    }, (err) => { console.error('own client doc', err); setData(null); });
    return unsub;
  }, [uid]);
  return data;
}

// Klientka smie čítať len svoje žiadosti (kvôli návrhom nového termínu).
// Ak pravidlá databázy ešte nie sú aktualizované, appka ticho pokračuje bez nich.
function useOwnRequests(uid) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!db || !uid) { setItems([]); return; }
    const unsub = db.collection('requests').where('clientUid', '==', uid).onSnapshot((snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (err) => { console.warn('own requests', err && err.code); setItems([]); });
    return unsub;
  }, [uid]);
  return items;
}

const PROPOSAL_HOURS = 24;

function usePricing() {
  const [categories, setCategories] = useState(null);
  useEffect(() => {
    if (!db) return;
    const unsub = db.collection('settings').doc('cennik').onSnapshot((doc) => {
      setCategories(doc.exists ? (doc.data().categories || []) : []);
    }, (err) => console.error('pricing', err));
    return unsub;
  }, []);
  return categories;
}

/* ---------- setup notice (shown until firebase-config.js is filled in) ---------- */
function SetupNotice() {
  return (
    <div style={{ minHeight: 'calc(100vh / var(--z, 1))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center', fontFamily: 'var(--font-sans)', color: 'var(--ink)', background: 'var(--porcelain)' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 12 }}>Appka ešte nie je pripojená k databáze</div>
        <p style={{ color: 'var(--ink-2)', maxWidth: 380, lineHeight: 1.6 }}>Doplň prosím Firebase konfiguráciu do súboru <code>firebase-config.js</code> podľa priloženého návodu.</p>
      </div>
    </div>
  );
}

/* ---------- app ---------- */
function App() {
  // POZOR na poradie: prihlásenie musí byť známe skôr, než sa nadviažu
  // databázoví poslucháči, inak by ich Firestore hneď odmietol.
  const [authUser, setAuthUser] = useState(undefined); // undefined = not yet known, null = signed out
  useEffect(() => {
    if (!auth) return;
    return auth.onAuthStateChanged((u) => setAuthUser(u));
  }, []);
  // undefined = ešte nevieme, null = odhlásený, string = uid prihláseného
  const authKey = authUser === undefined ? undefined : (authUser ? authUser.uid : null);

  const clientsRaw = useCollection('clients', authKey);
  const requestsRaw = useCollection('requests', authKey);
  const appointmentsRaw = useCollection('appointments', authKey);
  const referralsRaw = useCollection('referrals', authKey);
  const pricingRaw = usePricing();
  const seededRef = useRef(false);
  useEffect(() => {
    if (db && !seededRef.current) {
      seededRef.current = true;
      seedIfEmpty().catch((e) => console.error('seed error', e));
      seedPricingIfMissing().catch((e) => console.error('seed pricing error', e));
    }
  }, []);

  const [isAdmin, setIsAdmin] = useState(null); // null = unknown/checking
  const [isAdminForUid, setIsAdminForUid] = useState(null); // which uid the isAdmin value above was actually resolved for
  const [adminCheckDebug, setAdminCheckDebug] = useState('');
  useEffect(() => {
    if (!db || !authUser) { setIsAdmin(authUser === null ? false : null); setIsAdminForUid(authUser === null ? null : null); return; }
    setIsAdmin(null);
    db.collection('admins').doc(authUser.uid).get()
      .then((doc) => { setIsAdmin(doc.exists); setIsAdminForUid(authUser.uid); setAdminCheckDebug(`ok, exists=${doc.exists}`); })
      .catch((err) => { setIsAdmin(false); setIsAdminForUid(authUser.uid); setAdminCheckDebug(`error: ${err && err.code} ${err && err.message}`); });
  }, [authUser]);
  // Whether isAdmin above genuinely reflects the CURRENTLY signed-in
  // account — false right after a fresh sign-in, until the check for that
  // specific uid finishes, so a leftover value from before is never reused.
  const isAdminFresh = authUser ? isAdminForUid === authUser.uid : true;
  const myClientDoc = useOwnClientDoc(authUser ? authUser.uid : null);
  const myRequests = useOwnRequests(authUser && isAdminFresh && isAdmin === false ? authUser.uid : null);

  // Návrhy nového termínu: Michaelina appka sama dokončí odsúhlasené návrhy
  // (podržaný čas → potvrdený termín) a uprace vypršané / osirelé podržania.
  const proposalWorkRef = useRef({});
  useEffect(() => {
    if (!db || !isAdmin || !appointmentsRaw || !requestsRaw || !clientsRaw) return;
    const now = Date.now();
    appointmentsRaw.filter((h) => h.hold).forEach((h) => {
      if (proposalWorkRef.current[h.id]) return;
      const req = requestsRaw.find((r) => r.id === h.requestId) || null;
      if (h.accepted) {
        proposalWorkRef.current[h.id] = true;
        (async () => {
          await db.collection('appointments').doc(h.id).update({ hold: false, accepted: null, expiresAt: null, requestId: null, manual: false });
          const matched = clientsRaw.find((c) => c.name === h.name);
          if (matched) {
            await db.collection('clients').doc(matched.id).update({
              visits: (matched.visits || 0) + 1,
              lastVisit: isoLabel(h.date),
              stamps: Math.min(5, (matched.stamps || 0) + 1),
              history: [{ service: h.service, date: isoLabel(h.date) }, ...(matched.history || [])],
            });
          }
          if (req) await db.collection('requests').doc(req.id).delete();
        })().catch((e) => { proposalWorkRef.current[h.id] = false; console.error('finalize proposal failed', e); });
      } else if (!req || !req.proposal || req.proposal.holdId !== h.id) {
        proposalWorkRef.current[h.id] = true;
        db.collection('appointments').doc(h.id).delete().catch(() => { proposalWorkRef.current[h.id] = false; });
      } else if (h.expiresAt && h.expiresAt < now) {
        proposalWorkRef.current[h.id] = true;
        (async () => {
          await db.collection('appointments').doc(h.id).delete();
          if (req.proposal.status === 'pending') await db.collection('requests').doc(req.id).update({ 'proposal.status': 'expired' });
        })().catch(() => { proposalWorkRef.current[h.id] = false; });
      }
    });
  }, [isAdmin, appointmentsRaw, requestsRaw, clientsRaw]);
  const healedRef = useRef({});
  // počas registrácie kartu zakladá doClientRegister (s menom a mobilom) —
  // auto-oprava by ju inak mohla prepísať prázdnymi údajmi
  const registeringRef = useRef(false);
  useEffect(() => {
    if (!db || !authUser || !isAdminFresh || isAdmin || myClientDoc !== null) return;
    if (registeringRef.current) return;
    if (healedRef.current[authUser.uid]) return;
    healedRef.current[authUser.uid] = true;
    db.collection('clients').doc(authUser.uid).set({
      name: authUser.email ? authUser.email.split('@')[0] : 'Klientka',
      email: authUser.email || '', phone: '', stamps: 0, visits: 0, lastVisit: '—', notes: '', birthday: '', history: [],
    }).catch((e) => console.error('auto-heal client doc failed', e));
  }, [authUser, isAdmin, isAdminFresh, myClientDoc]);

  const [state, setStateRaw] = useState({
    screen: 'login', clientTab: 'home',
    booking: { step: 0, catIdx: null, itemIdx: null, addons: [], dateIso: null, time: null, done: false },
    profileView: 'main', expandedCat: 0,
    adminTab: 'overview', selectedClientId: null,
    toast: { visible: false, msg: '' },
    addFormOpen: false, newClientName: '', newClientPhone: '', newClientDateIso: null, newClientTime: '09:00',
    newClientService: '', newClientDuration: 1.5, newClientMainKey: null, newClientAddons: [],
    adminSelectedDate: isoOffset(0),
    authMode: 'login', authName: '', authFirstName: '', authLastName: '', authPhone: '', authEmail: '', authPassword: '', authError: '', authInfo: '',
    blockFormOpen: false, blockAllDay: true, blockTime: '8:00', blockDuration: 1,
    addItemCatIndex: null, newItemLabel: '', newItemPrice: '', newItemDuration: '1.5', newItemAddon: false,
    addCatFormOpen: false, newCatName: '', newCatSub: '',
    editItemCatIndex: null, editItemIndex: null, editItemLabel: '', editItemPrice: '', editItemDuration: '1.5', editItemAddon: false,
    dayAddOpen: false, dayAddQuery: '', dayAddClientId: null, dayAddNewName: '', dayAddNewPhone: '',
    dayAddCatIdx: null, dayAddItemIdx: null, dayAddAddons: [], dayAddDuration: null, dayAddTime: '',
    requestDurations: {},
    reqView: 'new', proposeFor: null, proposeDateIso: null, proposeTime: '', proposeMsg: '', proposeSending: false,
    rescheduleApptId: null, rescheduleDateIso: null, rescheduleTime: '',
    clientSearch: '', clientSort: 'visits', statsPeriod: 'month', mapServiceSel: {},
    apptFormOpen: false, apptEditingId: null, apptDateIso: null, apptTime: '', apptService: '', apptDuration: 1.5, apptMainKey: null, apptAddons: [],
    mergeFormOpen: false, mergeSearchQuery: '', mergeSourceId: null,
    chatOpen: false, chatLog: [], chatView: 'menu', chatSvcIdx: null, chatDateIso: null,
  });
  const s = state;
  const set = (patch) => setStateRaw((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (authUser && isAdminFresh && (s.screen === 'login' || s.screen === 'client-auth' || (s.screen === 'admin-auth' && isAdmin))) {
      set({ screen: isAdmin ? 'admin' : 'client', clientTab: 'home', adminTab: 'overview' });
    }
    if (authUser === null && (s.screen === 'client' || s.screen === 'admin')) {
      set({ screen: 'login' });
    }
  }, [authUser, isAdmin, isAdminFresh]);
  // A signed-in account that turns out not to be an admin, while on the
  // admin login screen specifically, gets signed back out with an
  // explanation. Gated on isAdminFresh so this can only fire once the
  // check has genuinely completed for THIS sign-in — never on a leftover
  // `false` left over from being signed out a moment before.
  useEffect(() => {
    if (authUser && isAdminFresh && isAdmin === false && s.screen === 'admin-auth') {
      auth.signOut();
      set({ authError: `Tento účet nemá administrátorský prístup. (UID: ${authUser.uid}) [${adminCheckDebug}]` });
    }
  }, [authUser, isAdmin, isAdminFresh, s.screen]);
  const setBooking = (patch) => setStateRaw((prev) => ({ ...prev, booking: { ...prev.booking, ...patch } }));
  const toastTimer = useRef(null);
  const showToast = (msg) => {
    set({ toast: { visible: true, msg } });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => set({ toast: { visible: false, msg: '' } }), 2400);
  };
  const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const notifUserId = (authUser && !isAdmin) ? authUser.uid : null;
  const { notifications: clientNotifs, unreadCount: clientUnreadCount, manager: clientNotifMgr } = typeof useNotifications === 'function'
    ? useNotifications(db, auth, notifUserId)
    : { notifications: [], unreadCount: 0, manager: null };

  if (!FIREBASE_READY) return <SetupNotice />;
  // Wait only for data the current role is actually allowed to read — an
  // unauthenticated visitor should reach the login screen immediately
  // instead of waiting forever on collections that require sign-in.
  if (authUser === undefined) {
    return <div style={{ minHeight: 'calc(100vh / var(--z, 1))', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--porcelain)', color: 'var(--ink-3)', fontFamily: 'var(--font-sans)' }}>Načítavam…</div>;
  }
  if (authUser && !isAdminFresh) {
    return <div style={{ minHeight: 'calc(100vh / var(--z, 1))', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--porcelain)', color: 'var(--ink-3)', fontFamily: 'var(--font-sans)' }}>Načítavam…</div>;
  }
  if (authUser && isAdmin && (clientsRaw === null || requestsRaw === null || appointmentsRaw === null || pricingRaw === null)) {
    return <div style={{ minHeight: 'calc(100vh / var(--z, 1))', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--porcelain)', color: 'var(--ink-3)', fontFamily: 'var(--font-sans)' }}>Načítavam…</div>;
  }
  if (authUser && !isAdmin && (appointmentsRaw === null || pricingRaw === null)) {
    return <div style={{ minHeight: 'calc(100vh / var(--z, 1))', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--porcelain)', color: 'var(--ink-3)', fontFamily: 'var(--font-sans)' }}>Načítavam…</div>;
  }

  const loggedInClient = myClientDoc;
  // For a non-admin client, `clients`/`requests`/`referrals` stay null
  // forever (the security rules correctly deny listing them) — fall back
  // to empty arrays so admin-only computations below never crash for that role.
  const clients = clientsRaw || [];
  const requests = requestsRaw || [];
  // Podržané časy (návrh nového termínu) nie sú skutočné termíny, ale blokujú
  // čas pre ostatné rezervácie, kým nevyprší 24 h lehota.
  const nowMs = Date.now();
  const allAppointments = appointmentsRaw || [];
  const holds = allAppointments.filter((a) => a.hold && (a.accepted || !(a.expiresAt > 0) || a.expiresAt > nowMs));
  const appointments = allAppointments.filter((a) => !a.hold);
  const busyAppointments = appointments.concat(holds);
  const referrals = referralsRaw || [];
  const pricing = pricingRaw || [];

  const b = s.booking;
  const atLogin = s.screen === 'login', atClient = s.screen === 'client', atAdmin = s.screen === 'admin';
  const goClientAuth = () => set({ screen: 'client-auth', authMode: 'login', authError: '', authEmail: '', authPassword: '', authName: '', authFirstName: '', authLastName: '', authPhone: '' });
  const goAdminAuth = () => set({ screen: 'admin-auth', authError: '', authEmail: '', authPassword: '' });
  const backToEntry = () => set({ screen: 'login', authError: '' });
  const backToLogin = () => { if (auth) auth.signOut(); set({ screen: 'login', authMode: 'login', authEmail: '', authPassword: '', authName: '', authError: '' }); };

  const doClientRegister = async () => {
    set({ authError: '' });
    const first = s.authFirstName.trim(), last = s.authLastName.trim();
    if (!first) { set({ authError: 'Zadajte meno.' }); return; }
    if (!last) { set({ authError: 'Zadajte priezvisko.' }); return; }
    if (!isValidPhone(s.authPhone)) { set({ authError: 'Zadajte platné mobilné číslo (napr. 0915 123 456).' }); return; }
    if (!s.authEmail.trim()) { set({ authError: 'Zadajte email.' }); return; }
    registeringRef.current = true;
    try {
      const cred = await auth.createUserWithEmailAndPassword(s.authEmail.trim(), s.authPassword);
      await db.collection('clients').doc(cred.user.uid).set({
        name: `${first} ${last}`, email: s.authEmail.trim(), phone: normalizePhone(s.authPhone), stamps: 0, visits: 0, lastVisit: '—', notes: '', birthday: '', history: [],
      });
    } catch (e) { set({ authError: authErrorSk(e.code) }); }
    finally { registeringRef.current = false; }
  };
  const doClientLogin = async () => {
    set({ authError: '' });
    try { await auth.signInWithEmailAndPassword(s.authEmail.trim(), s.authPassword); }
    catch (e) { set({ authError: authErrorSk(e.code) }); }
  };
  const doAdminLogin = async () => {
    set({ authError: '' });
    try { await auth.signInWithEmailAndPassword(s.authEmail.trim(), s.authPassword); }
    catch (e) { set({ authError: authErrorSk(e.code) }); }
  };
  const doForgotPassword = async () => {
    set({ authError: '', authInfo: '' });
    if (!s.authEmail.trim()) { set({ authError: 'Najprv zadajte email, potom kliknite na odkaz znova.' }); return; }
    try {
      await auth.sendPasswordResetEmail(s.authEmail.trim());
      set({ authInfo: 'Poslali sme vám email s odkazom na obnovu hesla.' });
    } catch (e) { set({ authError: authErrorSk(e.code) }); }
  };

  const tabHome = s.clientTab === 'home', tabBooking = s.clientTab === 'booking', tabPass = s.clientTab === 'pass',
    tabPricing = s.clientTab === 'pricing', tabProfile = s.clientTab === 'profile';
  const goHome = () => set({ clientTab: 'home' });
  const goBooking = () => set({ clientTab: 'booking' });
  const goPass = () => set({ clientTab: 'pass' });
  const goPricing = () => set({ clientTab: 'pricing' });
  const goProfile = () => set({ clientTab: 'profile', profileView: 'main' });
  const goReminders = () => set({ clientTab: 'profile', profileView: 'reminders' });
  const backToProfile = () => set({ profileView: 'main' });

  const todayIso = isoOffset(0);
  const clientBirthday = loggedInClient ? (loggedInClient.birthday || '') : '';
  const isBirthdayToday = clientBirthday && clientBirthday.slice(5) === todayIso.slice(5);

  const setClientBirthday = (e) => { if (loggedInClient) db.collection('clients').doc(loggedInClient.id).update({ birthday: e.target.value }); };
  // staršie účty mobil nemajú — klientka si ho doplní v profile
  const clientMissingPhone = !!(loggedInClient && (!loggedInClient.phone || loggedInClient.phone === '—'));
  const saveClientPhone = async (e) => {
    const val = e.target.value;
    if (!loggedInClient || normalizePhone(val) === normalizePhone(loggedInClient.phone)) return;
    if (!isValidPhone(val)) { showToast('Neplatné mobilné číslo'); return; }
    await db.collection('clients').doc(loggedInClient.id).update({ phone: normalizePhone(val) });
    showToast('Mobilné číslo uložené');
  };
  const startEditName = () => set({ nameEditOpen: true, nameEditValue: loggedInClient ? loggedInClient.name : '' });
  const cancelEditName = () => set({ nameEditOpen: false, nameEditValue: '' });
  const saveEditName = async () => {
    const val = (s.nameEditValue || '').trim();
    if (!val || !loggedInClient) return;
    await db.collection('clients').doc(loggedInClient.id).update({ name: val });
    set({ nameEditOpen: false, nameEditValue: '' });
    showToast('Meno uložené');
  };

  const navBtn = (active) => `all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;padding:6px 10px;color:${active ? 'var(--espresso)' : 'var(--ink-3)'};min-width:44px`;
  const headerMap = {
    home: ['NECHTOVÉ ŠTÚDIO · HANDLOVÁ', 'Dobrý deň'], booking: ['REZERVÁCIA', 'Nový termín'],
    pass: ['VERNOSTNÝ PROGRAM', 'Aura Pass'], pricing: ['KATALÓG SLUŽIEB', 'Cenník'], profile: ['MÔJ ÚČET', 'Profil'],
  };
  const [clientHeaderEyebrow, clientHeaderTitle] = headerMap[s.clientTab];

  const step0 = b.step === 0, step1 = b.step === 1, step2 = b.step === 2;
  const dotStyle = (active, done) => `flex:1;height:4px;border-radius:2px;background:${active || done ? 'var(--espresso)' : 'var(--line)'}`;

  // Celý cenník rozdelený na hlavné služby a doplnky. Klientka si vyberie
  // jednu hlavnú službu a k nej ľubovoľné doplnky; cena aj trvanie sa sčítajú.
  const cennikMain = [];
  const cennikAddons = [];
  pricing.forEach((cat, ci) => (cat.items || []).forEach((item, ii) => {
    const entry = {
      key: ci + ':' + ii, ci, ii, catName: cat.name, label: item.label,
      price: item.price, priceNum: priceToNumber(item.price), duration: itemDuration(item),
    };
    (isAddonItem(item) ? cennikAddons : cennikMain).push(entry);
  }));
  const cennikMainByCat = pricing.map((cat, ci) => ({
    name: cat.name, sub: cat.sub, ci, items: cennikMain.filter((m) => m.ci === ci),
  })).filter((c) => c.items.length > 0);

  const bookingMain = cennikMain.find((m) => m.ci === b.catIdx && m.ii === b.itemIdx) || null;
  const bookingAddons = cennikAddons.filter((a) => (b.addons || []).indexOf(a.key) !== -1);
  const toggleBookingAddon = (key) => {
    const cur = b.addons || [];
    setBooking({ addons: cur.indexOf(key) !== -1 ? cur.filter((k) => k !== key) : [...cur, key], time: null });
  };
  const pickBookingService = (m) => setBooking({ catIdx: m.ci, itemIdx: m.ii, time: null });
  const serviceItemStyle = (selected) => `all:unset;cursor:pointer;display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;text-align:left;padding:13px 15px;border-radius:14px;margin-bottom:8px;color:${selected ? 'var(--porcelain)' : 'var(--ink)'};background:${selected ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${selected ? 'var(--espresso)' : 'var(--line)'}`;

  const dates = buildDateOptions();
  const bookingPriceNum = bookingMain ? bookingMain.priceNum + bookingAddons.reduce((sum, a) => sum + a.priceNum, 0) : 0;
  const svcDuration = bookingMain ? bookingMain.duration + bookingAddons.reduce((sum, a) => sum + a.duration, 0) : 1;
  const dateOptions = dates.map((d) => {
    const freeCount = buildTimeOptions(d.iso, busyAppointments).filter((t) => !isPastSlot(d.iso, t) && slotAvailable(d.iso, t, svcDuration, busyAppointments)).length;
    const dayFull = freeCount === 0;
    return {
      iso: d.iso, dow: d.dow, num: d.num, mon: d.mon, full: dayFull, free: freeCount, select: () => setBooking({ dateIso: d.iso, time: null }),
      style: `all:unset;cursor:pointer;text-align:center;padding:9px 4px;border-radius:13px;position:relative;color:${b.dateIso === d.iso ? 'var(--porcelain)' : dayFull ? 'var(--ink-3)' : 'var(--ink)'};background:${b.dateIso === d.iso ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${b.dateIso === d.iso ? 'var(--espresso)' : 'var(--line)'};opacity:${dayFull && b.dateIso !== d.iso ? 0.55 : 1}`,
    };
  });

  const bookingMaxIso = dates.length ? dates[dates.length - 1].iso : todayIso;
  const apptsByDateForFull = {};
  busyAppointments.forEach((a) => { (apptsByDateForFull[a.date] = apptsByDateForFull[a.date] || []).push(a); });
  const isDayFull = (iso) => {
    const dayAppts = apptsByDateForFull[iso] || [];
    return buildTimeOptions(iso, dayAppts).every((t) => isPastSlot(iso, t) || !slotAvailable(iso, t, svcDuration, dayAppts));
  };
  const clientMonthGrid = buildMonthGrid(b.monthOffset || 0, b.dateIso, todayIso,
    (iso, muted) => muted || iso < todayIso || iso > bookingMaxIso,
    (iso) => (iso >= todayIso && iso <= bookingMaxIso) ? (isDayFull(iso) ? 'var(--line-gold)' : 'var(--taupe)') : null);
  const selectedDateFull = b.dateIso ? !!dateOptions.find((d) => d.iso === b.dateIso)?.full : false;
  const nearestAvailableDate = dateOptions.find((d) => !d.full && d.iso !== b.dateIso) || null;
  const timeOptions = buildTimeOptions(b.dateIso, busyAppointments).map((t) => {
    const taken = b.dateIso === null ? true : (isPastSlot(b.dateIso, t) || !slotAvailable(b.dateIso, t, svcDuration, busyAppointments));
    const selected = b.time === t;
    return {
      label: t, taken, select: () => !taken && setBooking({ time: t }),
      style: `all:unset;cursor:${taken ? 'not-allowed' : 'pointer'};padding:10px 4px;border-radius:10px;text-align:center;font-family:var(--font-sans);font-size:.78rem;color:${taken ? 'var(--ink-3)' : selected ? 'var(--porcelain)' : 'var(--ink-2)'};background:${taken ? 'rgba(255,255,255,.02)' : selected ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${taken ? 'var(--line)' : selected ? 'var(--espresso)' : 'var(--line-gold)'};text-decoration:${taken ? 'line-through' : 'none'}`,
    };
  });
  const booking_selectedService = bookingMain
    ? [bookingMain.label, ...bookingAddons.map((a) => a.label)].join(' + ')
    : '—';
  const booking_priceLabel = bookingMain ? formatPrice(bookingPriceNum) : '—';
  const booking_durationLabel = formatDuration(svcDuration);
  const booking_selectedDate = b.dateIso ? isoLabel(b.dateIso) : '—';
  const bookingSummary = `${booking_selectedService} · ${booking_selectedDate} · ${b.time || '—'}`;
  const nextDisabled = (step0 && !bookingMain) || (step1 && (b.dateIso === null || !b.time));
  const nextStep = () => !nextDisabled && setBooking({ step: Math.min(2, b.step + 1) });
  const prevStep = () => setBooking({ step: Math.max(0, b.step - 1) });
  const btnBase = 'all:unset;cursor:pointer;padding:12px 26px;border-radius:999px;font-family:var(--font-sans);font-size:.74rem;letter-spacing:.14em;text-transform:uppercase';
  const prevBtnStyle = `${btnBase};color:${step0 ? 'var(--ink-3)' : 'var(--ink-2)'};border:1px solid var(--line-gold);opacity:${step0 ? 0.4 : 1};visibility:${step0 ? 'hidden' : 'visible'}`;
  const nextBtnStyle = `${btnBase};color:var(--porcelain);background:var(--espresso);opacity:${nextDisabled ? 0.4 : 1}`;
  const submitBooking = async () => {
    if (!loggedInClient || !authUser || !bookingMain) return;
    // Ukladáme aj rozpis položiek a cenu, aby Michaela videla presne to,
    // čo si klientka naklikala — nielen jeden textový názov.
    await db.collection('requests').add({
      name: loggedInClient.name, phone: loggedInClient.phone || '', email: loggedInClient.email || '',
      service: booking_selectedService,
      items: [bookingMain, ...bookingAddons].map((it) => ({ label: it.label, price: it.price, duration: it.duration })),
      price: bookingPriceNum, priceLabel: formatPrice(bookingPriceNum),
      date: b.dateIso, time: b.time, clientUid: authUser.uid, duration: svcDuration,
      createdAt: new Date().toISOString(),
    });
    setBooking({ done: true });
  };
  const resetBooking = () => set({ booking: { step: 0, catIdx: null, itemIdx: null, addons: [], dateIso: null, time: null, done: false } });

  /* ---------- chatbot (recepčná bez AI: vedená konverzácia klikaním) ---------- */
  const chatSay = (from, text) => setStateRaw((prev) => ({ ...prev, chatLog: [...prev.chatLog, { from, text }] }));
  const chatOpen = () => set({ chatOpen: true, chatLog: s.chatLog.length ? s.chatLog : [{ from: 'bot', text: 'Dobrý deň! Som Aura, vaša asistentka. S čím vám môžem pomôcť?' }], chatView: 'menu' });
  const chatClose = () => set({ chatOpen: false });
  const chatReset = () => set({ chatView: 'menu', chatSvcIdx: null, chatDateIso: null });
  // klientka klikne na možnosť → zapíšeme jej "otázku" aj odpoveď, aby to pôsobilo ako rozhovor
  const chatPick = (label, answer, nextView) => {
    setStateRaw((prev) => ({
      ...prev,
      chatLog: [...prev.chatLog, { from: 'me', text: label }, ...(answer ? [{ from: 'bot', text: answer }] : [])],
      chatView: nextView !== undefined ? nextView : prev.chatView,
    }));
  };
  const chatPriceText = pricing.length
    ? pricing.map((c) => `${c.name}: ${c.items.slice(0, 3).map((i) => `${i.label} ${i.price}`).join(', ')}${c.items.length > 3 ? '…' : ''}`).join('\n')
    : 'Cenník sa práve načítava.';
  // ponuka hlavného menu
  const chatMenuOptions = [
    { label: 'Chcem sa objednať', run: () => chatPick('Chcem sa objednať', 'Rada vám pomôžem. Akú službu si želáte?', 'svc') },
    { label: 'Aké máte ceny?', run: () => chatPick('Aké máte ceny?', chatPriceText + '\n\nCelý cenník nájdete v záložke Cenník.') },
    { label: 'Otváracie hodiny', run: () => chatPick('Otváracie hodiny', `Cez týždeň (Po–Pi) robím od ${OPEN_HOUR}:00 do ${hoursToTime(WEEKDAY_CLOSE_HOUR)}, cez víkend do ${CLOSE_HOUR}:00. Termíny sa dajú rezervovať až 30 dní dopredu.`) },
    { label: 'Kde vás nájdem?', run: () => chatPick('Kde vás nájdem?', 'Nechtové štúdio Aura Nails, Handlová. Presnú adresu a kontakt nájdete na našej stránke auranails.sk.') },
    { label: 'Ako funguje Aura Pass?', run: () => chatPick('Ako funguje Aura Pass?', 'Za každú návštevu vám Michaela pridá pečiatku. Po 5 pečiatkach získate odmenu. Aktuálny stav vidíte v záložke Pass.') },
  ];
  // krok: výber služby
  const chatSvcOptions = cennikMain.map((sv) => ({
    label: `${sv.label} · ${sv.price}`,
    run: () => {
      setStateRaw((prev) => ({
        ...prev, chatSvcIdx: sv.key, chatView: 'date',
        chatLog: [...prev.chatLog, { from: 'me', text: sv.label }, { from: 'bot', text: `${sv.label} — ${sv.price}, trvanie ${formatDuration(sv.duration)}. Na ktorý deň?` }],
      }));
    },
  }));
  const chatSvc = cennikMain.find((m) => m.key === s.chatSvcIdx) || null;
  // krok: výber dňa (najbližších 7 dní, plné dni sa neponúkajú)
  const chatSvcDuration = chatSvc ? chatSvc.duration : 1;
  const chatDateOptions = buildDateOptions(7)
    .filter((d) => buildTimeOptions(d.iso, busyAppointments).some((t) => !isPastSlot(d.iso, t) && slotAvailable(d.iso, t, chatSvcDuration, busyAppointments)))
    .map((d) => ({
      label: `${d.dow} ${d.num}. ${d.mon}`,
      run: () => {
        setStateRaw((prev) => ({
          ...prev, chatDateIso: d.iso, chatView: 'time',
          chatLog: [...prev.chatLog, { from: 'me', text: `${d.dow} ${d.num}. ${d.mon}` }, { from: 'bot', text: 'Tu sú voľné časy:' }],
        }));
      },
    }));
  // krok: výber času (len skutočne voľné)
  const chatTimeOptions = (s.chatDateIso ? buildTimeOptions(s.chatDateIso, busyAppointments).filter((t) => !isPastSlot(s.chatDateIso, t) && slotAvailable(s.chatDateIso, t, chatSvcDuration, busyAppointments)) : [])
    .map((t) => ({
      label: t,
      run: async () => {
        if (!loggedInClient || !authUser) {
          chatPick(t, 'Aby som mohla rezerváciu odoslať, prihláste sa prosím ako klientka (tlačidlo Späť → Som klientka).', 'menu');
          return;
        }
        await db.collection('requests').add({
          name: loggedInClient.name, phone: loggedInClient.phone || '', email: loggedInClient.email || '',
          service: chatSvc ? chatSvc.label : 'Bez upresnenia',
          items: chatSvc ? [{ label: chatSvc.label, price: chatSvc.price, duration: chatSvc.duration }] : [],
          price: chatSvc ? chatSvc.priceNum : 0, priceLabel: chatSvc ? formatPrice(chatSvc.priceNum) : '',
          date: s.chatDateIso, time: t, clientUid: authUser.uid, duration: chatSvcDuration,
          createdAt: new Date().toISOString(),
        });
        setStateRaw((prev) => ({
          ...prev, chatView: 'menu', chatSvcIdx: null, chatDateIso: null,
          chatLog: [...prev.chatLog, { from: 'me', text: t }, { from: 'bot', text: `Hotovo! Vaša žiadosť (${isoLabel(s.chatDateIso)} o ${t}) je odoslaná a čaká na potvrdenie od Michaely. Ozveme sa vám čoskoro. Môžem ešte s niečím pomôcť?` }],
        }));
      },
    }));
  const chatCurrentOptions = s.chatView === 'svc' ? chatSvcOptions
    : s.chatView === 'date' ? chatDateOptions
    : s.chatView === 'time' ? chatTimeOptions
    : chatMenuOptions;
  const chatShowBack = s.chatView !== 'menu';

  const clientStamps = loggedInClient ? loggedInClient.stamps : 0;
  const passStampDots = [0, 1, 2, 3, 4].map((i) => {
    const on = i < clientStamps;
    return {
      style: `aspect-ratio:1;border-radius:50%;cursor:default;display:flex;align-items:center;justify-content:center;background:${on ? 'radial-gradient(circle at 35% 30%,var(--taupe-light),#B8916F)' : 'rgba(23,16,15,.35)'};color:${on ? 'var(--porcelain)' : 'rgba(217,185,155,.45)'};border:${on ? '0' : '1.5px dashed rgba(217,185,155,.4)'};box-shadow:${on ? 'var(--shadow-md, 0 10px 34px -16px rgba(56,48,42,.35))' : 'none'};transition:transform .2s ease`,
    };
  });
  const rewardStyle = `aspect-ratio:1;border-radius:50%;cursor:default;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${clientStamps >= 5 ? 'radial-gradient(circle at 35% 30%,var(--taupe-light),#B8916F)' : 'rgba(23,16,15,.35)'};color:${clientStamps >= 5 ? 'var(--porcelain)' : 'var(--espresso)'};border:1.5px ${clientStamps >= 5 ? 'solid' : 'dashed'} ${clientStamps >= 5 ? 'var(--espresso)' : 'rgba(217,185,155,.55)'}`;
  const passHelperText = clientStamps >= 5 ? 'Máte 5 pečiatok — pri ďalšej návšteve vám Michaela uplatní odmenu!' : `Za každú návštevu vám Michaela pridá pečiatku. Aktuálne máte ${clientStamps}/5.`;

  const cennikCategories = pricing.map((cat, i) => ({
    name: cat.name, sub: cat.sub, items: cat.items, open: s.expandedCat === i,
    toggle: () => set({ expandedCat: s.expandedCat === i ? null : i }),
    chevStyle: `display:flex;transform:rotate(${s.expandedCat === i ? 90 : 0}deg);transition:transform .3s;color:var(--ink-3)`,
  }));

  const badge = (tone) => `font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;padding:5px 10px;border-radius:999px;background:${tone === 'pending' ? 'var(--wait-bg)' : tone === 'blocked' ? 'var(--danger-bg)' : 'var(--ok-bg)'};color:${tone === 'pending' ? 'var(--wait)' : tone === 'blocked' ? 'var(--danger)' : 'var(--ok)'};font-weight:600`;
  const myAppointments = loggedInClient ? appointments.concat(holds.filter((h) => h.accepted)).filter((a) => a.name === loggedInClient.name) : [];
  const upcomingAppts = myAppointments.filter((a) => a.date >= todayIso).sort((a, bb) => a.date === bb.date ? timeToHours(a.time) - timeToHours(bb.time) : a.date.localeCompare(bb.date))
    .map((a) => ({
      id: a.id, iso: a.date, duration: a.duration, service: a.service, date: isoLabel(a.date), time: a.time, badgeLabel: a.hold ? 'Potvrdené' : a.manual ? 'Telefonicky' : 'Potvrdené', badgeStyle: badge(a.manual && !a.hold ? 'pending' : undefined),
      mine: !!(a.clientUid && authUser && a.clientUid === authUser.uid),
    }));
  const rebookService = (serviceName) => {
    // z minulého termínu vieme len text — skúsime nájsť hlavnú službu podľa názvu
    const mainLabel = String(serviceName || '').split(' + ')[0].trim();
    const found = cennikMain.find((m) => m.label === mainLabel) || null;
    setBooking({
      step: found ? 1 : 0, catIdx: found ? found.ci : null, itemIdx: found ? found.ii : null,
      addons: [], dateIso: null, time: null, done: false,
    });
    set({ clientTab: 'booking' });
  };
  const rateAppt = (id, rating) => { db.collection('appointments').doc(id).update({ rating }); };
  const historyAppts = myAppointments.filter((a) => a.date < todayIso).sort((a, bb) => bb.date.localeCompare(a.date))
    .map((a) => ({
      id: a.id, service: a.service, date: isoLabel(a.date), time: a.time, rating: a.rating || 0,
      mine: !!(a.clientUid && authUser && a.clientUid === authUser.uid), rebook: () => rebookService(a.service),
    }));
  const cancelMyAppt = (id) => {
    if (!window.confirm('Naozaj zrušiť tento termín?')) return;
    db.collection('appointments').doc(id).delete();
    showToast('Termín zrušený');
  };
  const openReschedule = (a) => set({ rescheduleApptId: a.id, rescheduleDateIso: a.date, rescheduleTime: a.time });
  const cancelReschedule = () => set({ rescheduleApptId: null });
  const rescheduleTarget = appointments.find((a) => a.id === s.rescheduleApptId) || null;
  const rescheduleValidReason = (() => {
    if (!rescheduleTarget || !s.rescheduleDateIso || !s.rescheduleTime) return null;
    const startHours = timeToHours(s.rescheduleTime);
    if (startHours < OPEN_HOUR) return `Štúdio otvára až o ${OPEN_HOUR}:00.`;
    if (isPastSlot(s.rescheduleDateIso, s.rescheduleTime)) return 'Tento čas už prešiel, vyberte neskorší.';
    if (startHours + (rescheduleTarget.duration || 1) > closeHourFor(s.rescheduleDateIso) + 1e-6) return `Termín musí skončiť do ${hoursToTime(closeHourFor(s.rescheduleDateIso))}.`;
    const others = busyAppointments.filter((x) => x.id !== rescheduleTarget.id);
    if (!slotAvailable(s.rescheduleDateIso, s.rescheduleTime, rescheduleTarget.duration || 1, others)) return 'Tento čas je už obsadený, vyberte iný.';
    return null;
  })();
  const saveReschedule = async () => {
    if (!rescheduleTarget || !s.rescheduleDateIso || !s.rescheduleTime || rescheduleValidReason) return;
    await db.collection('appointments').doc(rescheduleTarget.id).update({ date: s.rescheduleDateIso, time: s.rescheduleTime });
    set({ rescheduleApptId: null });
    showToast('Termín zmenený');
  };
  const notifications = [
    { icon: 'clock', title: 'Pripomienka termínu', text: 'Váš najbližší termín sa blíži.', time: '' },
    { icon: 'sparkle', title: 'Aura Pass', text: `Aktuálne máte ${clientStamps}/5 pečiatok.`, time: '' },
  ];
  if (isBirthdayToday) {
    notifications.unshift({ icon: 'gift', title: 'Všetko najlepšie k narodeninám!', text: 'Nech je váš deň krásny ako vaše nechty.', time: 'dnes' });
  }
  const notificationsPreview = notifications.slice(0, 2);

  const toggleTrack = (on) => `all:unset;cursor:pointer;width:44px;height:26px;border-radius:999px;background:${on ? 'var(--espresso)' : 'var(--line-gold)'};display:flex;align-items:center;padding:2px;box-sizing:border-box`;
  const toggleKnob = (on) => `display:block;width:22px;height:22px;border-radius:50%;background:var(--porcelain);transform:translateX(${on ? '18px' : '0'});transition:transform .25s`;
  // Prepínače pripomienok sa ukladajú do karty klientky — až podľa nich sa
  // cloud funkcia rozhoduje, či jej pripomienkový e-mail poslať. Ak pole
  // chýba (staršie klientky), pripomienky sú zapnuté.
  const remindDayBefore = loggedInClient ? loggedInClient.remindDayBefore !== false : true;
  const remindHoursBefore = loggedInClient ? loggedInClient.remindHoursBefore !== false : true;
  const toggleDayBefore = () => { if (loggedInClient) db.collection('clients').doc(loggedInClient.id).update({ remindDayBefore: !remindDayBefore }); };
  const toggleHourBefore = () => { if (loggedInClient) db.collection('clients').doc(loggedInClient.id).update({ remindHoursBefore: !remindHoursBefore }); };

  const adminTabOverview = s.adminTab === 'overview', adminTabRequests = s.adminTab === 'requests', adminTabClients = s.adminTab === 'clients', adminTabPricing = s.adminTab === 'pricing', adminTabStats = s.adminTab === 'stats';
  const goOverview = () => set({ adminTab: 'overview' });
  const goRequests = () => set({ adminTab: 'requests' });
  const goClients = () => set({ adminTab: 'clients', selectedClientId: null });
  const goPricingAdmin = () => set({ adminTab: 'pricing' });
  const goStats = () => set({ adminTab: 'stats' });
  const hasPending = requests.length > 0 || referrals.some((r) => r.status !== 'done');
  const adminHeaderMap = { overview: 'Prehľad', requests: 'Žiadosti', clients: 'Klientky', pricing: 'Cenník', stats: 'Štatistiky' };

  const statsWeekStart = isoOffset(-(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1));
  const nonBlockedAppts = appointments.filter((a) => !a.blocked);
  const totalClientsCount = clients.length;
  const upcomingBirthdays = clients
    .map((c) => ({ ...c, daysUntil: daysUntilBirthday(c.birthday) }))
    .filter((c) => c.daysUntil !== null && c.daysUntil <= 7)
    .sort((a, bb) => a.daysUntil - bb.daysUntil);
  const ratedAppts = nonBlockedAppts.filter((a) => a.rating);
  const avgRating = ratedAppts.length ? (ratedAppts.reduce((sum, a) => sum + a.rating, 0) / ratedAppts.length) : null;
  const exportClientsCsv = () => {
    const header = ['Meno', 'Telefón', 'Email', 'Návštevy', 'Útrata spolu (€)', 'Pečiatky', 'Posledná návšteva'];
    const rows = clients.map((c) => {
      const r = clientApptStats(c);
      return [c.name, c.phone || '', c.email || '', r.visits, Math.round(r.spend), c.stamps || 0, r.last ? isoLabel(r.last) : (c.lastVisit || '')];
    });
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `aura-nails-klientky-${todayIso}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updatePricing = (newCategories) => db.collection('settings').doc('cennik').set({ categories: newCategories });
  const deletePricingCategory = (catIdx) => updatePricing(pricing.filter((_, i) => i !== catIdx));
  const deletePricingItem = (catIdx, itemIdx) => updatePricing(pricing.map((c, i) => (i === catIdx ? { ...c, items: c.items.filter((_, j) => j !== itemIdx) } : c)));
  // trvanie sa zadáva v hodinách (0.25 = 15 min); zaokrúhľujeme na štvrťhodiny
  const parseDurationInput = (txt) => {
    const v = parseFloat(String(txt).replace(',', '.'));
    if (!v || v <= 0) return FALLBACK_DURATION;
    return Math.min(8, Math.max(0.25, Math.round(v * 4) / 4));
  };
  const openAddItem = (catIdx) => set({ addItemCatIndex: catIdx, newItemLabel: '', newItemPrice: '', newItemDuration: '1.5', newItemAddon: false });
  const cancelAddItem = () => set({ addItemCatIndex: null });
  const saveNewItem = (catIdx) => {
    if (!s.newItemLabel.trim() || !s.newItemPrice.trim()) return;
    const item = { label: s.newItemLabel.trim(), price: s.newItemPrice.trim(), duration: parseDurationInput(s.newItemDuration), addon: !!s.newItemAddon };
    updatePricing(pricing.map((c, i) => (i === catIdx ? { ...c, items: [...c.items, item] } : c)));
    set({ addItemCatIndex: null, newItemLabel: '', newItemPrice: '', newItemDuration: '1.5', newItemAddon: false });
  };
  const openEditItem = (catIdx, itemIdx, item) => set({
    editItemCatIndex: catIdx, editItemIndex: itemIdx, editItemLabel: item.label, editItemPrice: item.price,
    editItemDuration: String(itemDuration(item)), editItemAddon: isAddonItem(item),
  });
  const cancelEditItem = () => set({ editItemCatIndex: null, editItemIndex: null });
  const saveEditItem = () => {
    if (!s.editItemLabel.trim() || !s.editItemPrice.trim()) return;
    const item = { label: s.editItemLabel.trim(), price: s.editItemPrice.trim(), duration: parseDurationInput(s.editItemDuration), addon: !!s.editItemAddon };
    updatePricing(pricing.map((c, ci) => (ci === s.editItemCatIndex ? { ...c, items: c.items.map((it, ii) => (ii === s.editItemIndex ? item : it)) } : c)));
    set({ editItemCatIndex: null, editItemIndex: null });
  };
  const openAddCategory = () => set({ addCatFormOpen: true, newCatName: '', newCatSub: '' });
  const cancelAddCategory = () => set({ addCatFormOpen: false });
  const saveNewCategory = () => {
    if (!s.newCatName.trim()) return;
    updatePricing([...pricing, { name: s.newCatName.trim(), sub: s.newCatSub.trim(), items: [] }]);
    set({ addCatFormOpen: false, newCatName: '', newCatSub: '' });
  };

  const calendarDates = buildDateOptions();
  const countsByDate = {};
  appointments.forEach((a) => { countsByDate[a.date] = (countsByDate[a.date] || 0) + 1; });
  const occupancyColor = (n) => (n === 0 ? 'var(--line)' : n <= 1 ? 'var(--taupe)' : n <= 2 ? 'var(--mocha)' : 'var(--espresso)');
  const calendarStrip = calendarDates.map((d) => {
    const count = countsByDate[d.iso] || 0;
    const selected = s.adminSelectedDate === d.iso;
    return {
      dow: d.dow, num: d.num, select: () => set({ adminSelectedDate: d.iso }),
      style: `all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:5px;padding:11px 4px;border-radius:16px;flex-shrink:0;width:48px;background:${selected ? 'var(--espresso)' : 'var(--white)'};color:${selected ? 'var(--porcelain)' : 'var(--ink)'};border:1px solid ${selected ? 'var(--espresso)' : 'var(--line)'};box-shadow:${selected ? 'var(--shadow-md, 0 10px 34px -16px rgba(56,48,42,.35))' : 'none'};transition:transform .2s ease,box-shadow .2s ease`,
      dotStyle: `width:6px;height:6px;border-radius:50%;background:${selected ? 'var(--porcelain)' : occupancyColor(count)}`,
    };
  });

  const adminMonthGrid = buildMonthGrid(s.adminMonthOffset || 0, s.adminSelectedDate, todayIso, null, (iso) => occupancyColor(countsByDate[iso] || 0) !== 'var(--line)' ? occupancyColor(countsByDate[iso] || 0) : null);
  const calendarSelectedLabel = isoLabel(s.adminSelectedDate);
  const selectedDayAppts = appointments.concat(holds).filter((a) => a.date === s.adminSelectedDate).sort((a, bb) => timeToHours(a.time) - timeToHours(bb.time)).map((a) => {
    const matched = clients.find((c) => c.name === a.name);
    return {
      ...a,
      badgeLabel: a.hold ? (a.accepted ? 'Odsúhlasené' : 'Návrh · čaká') : a.blocked ? 'Zatvorené' : (a.manual ? 'Telefonicky' : 'Potvrdené'),
      badgeStyle: badge(a.hold ? (a.accepted ? undefined : 'pending') : a.blocked ? 'blocked' : (a.manual ? 'pending' : undefined)),
      open: a.hold ? () => set({ adminTab: 'requests', reqView: 'waiting' }) : a.blocked ? () => deleteBlock(a.id) : (() => matched && set({ adminTab: 'clients', selectedClientId: matched.id })),
    };
  });
  const noDayAppts = selectedDayAppts.length === 0;
  const openBlockForm = () => set({ blockFormOpen: true, blockAllDay: true, blockTime: '8:00', blockDuration: 1 });
  const cancelBlockForm = () => set({ blockFormOpen: false });
  const saveBlock = async () => {
    const duration = s.blockAllDay ? (CLOSE_HOUR - OPEN_HOUR) : s.blockDuration;
    const time = s.blockAllDay ? `${OPEN_HOUR}:00` : s.blockTime;
    await db.collection('appointments').add({ date: s.adminSelectedDate, time, duration, blocked: true, name: 'Voľno', service: s.blockAllDay ? 'Celý deň voľno' : 'Blokovaný čas', manual: true });
    set({ blockFormOpen: false });
    showToast('Voľno nastavené');
  };
  const deleteBlock = async (id) => { await db.collection('appointments').doc(id).delete(); showToast('Voľno zrušené'); };

  /* ---------- pridanie klientky priamo z kalendára ---------- */
  const openDayAdd = () => set({
    dayAddOpen: true, dayAddQuery: '', dayAddClientId: null, dayAddNewName: '', dayAddNewPhone: '',
    dayAddCatIdx: null, dayAddItemIdx: null, dayAddAddons: [], dayAddDuration: null, dayAddTime: '',
  });
  const cancelDayAdd = () => set({ dayAddOpen: false });
  // najčastejšie klientky — tie sa Michaele ponúknu hneď, bez písania
  // (funkcia, lebo štatistiky návštev sa počítajú až nižšie)
  const getFrequentClients = () => clients.map((c) => ({ ...c, visitCount: clientApptStats(c).visits }))
    .sort((a, bb) => bb.visitCount - a.visitCount).slice(0, 6);
  const dayAddQ = s.dayAddQuery.trim().toLowerCase();
  const dayAddMatches = dayAddQ.length >= 2
    ? clients.filter((c) => (c.name || '').toLowerCase().includes(dayAddQ) || (c.phone || '').toLowerCase().includes(dayAddQ)).slice(0, 8)
    : [];
  const dayAddPicked = clients.find((c) => c.id === s.dayAddClientId) || null;
  // klientka, ktorá v zozname nie je — založíme ju spolu s termínom
  const dayAddIsNew = !dayAddPicked && !!s.dayAddNewName.trim();
  const dayAddName = dayAddPicked ? dayAddPicked.name : s.dayAddNewName.trim();
  const pickDayAddClient = (c) => set({ dayAddClientId: c.id, dayAddNewName: '', dayAddQuery: '' });
  const pickDayAddNew = () => set({ dayAddClientId: null, dayAddNewName: s.dayAddQuery.trim(), dayAddQuery: '' });
  const clearDayAddClient = () => set({ dayAddClientId: null, dayAddNewName: '', dayAddNewPhone: '', dayAddQuery: '' });

  const dayAddMain = cennikMain.find((m) => m.ci === s.dayAddCatIdx && m.ii === s.dayAddItemIdx) || null;
  const dayAddAddonItems = cennikAddons.filter((a) => (s.dayAddAddons || []).indexOf(a.key) !== -1);
  const toggleDayAddAddon = (key) => {
    const cur = s.dayAddAddons || [];
    set({ dayAddAddons: cur.indexOf(key) !== -1 ? cur.filter((k) => k !== key) : [...cur, key], dayAddDuration: null, dayAddTime: '' });
  };
  const pickDayAddService = (m) => set({ dayAddCatIdx: m.ci, dayAddItemIdx: m.ii, dayAddDuration: null, dayAddTime: '' });
  const dayAddAutoDuration = dayAddMain ? dayAddMain.duration + dayAddAddonItems.reduce((sum, a) => sum + a.duration, 0) : 1.5;
  // Michaela môže auto-trvanie prepísať, inak platí to z cenníka
  const dayAddDuration = (s.dayAddDuration === null || s.dayAddDuration === undefined) ? dayAddAutoDuration : s.dayAddDuration;
  const dayAddPriceNum = dayAddMain ? dayAddMain.priceNum + dayAddAddonItems.reduce((sum, a) => sum + a.priceNum, 0) : 0;
  const dayAddServiceLabel = dayAddMain ? [dayAddMain.label, ...dayAddAddonItems.map((a) => a.label)].join(' + ') : '';
  const dayAddTimeOptions = buildTimeOptions(s.adminSelectedDate, busyAppointments).map((t) => {
    const taken = !slotAvailable(s.adminSelectedDate, t, dayAddDuration, busyAppointments);
    const selected = s.dayAddTime === t;
    return {
      label: t, taken, select: () => !taken && set({ dayAddTime: t }),
      style: `all:unset;cursor:${taken ? 'not-allowed' : 'pointer'};padding:10px 4px;border-radius:10px;text-align:center;font-family:var(--font-sans);font-size:.78rem;color:${taken ? 'var(--ink-3)' : selected ? 'var(--porcelain)' : 'var(--ink-2)'};background:${taken ? 'rgba(255,255,255,.02)' : selected ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${taken ? 'var(--line)' : selected ? 'var(--espresso)' : 'var(--line-gold)'};text-decoration:${taken ? 'line-through' : 'none'}`,
    };
  });
  const dayAddDisabled = !dayAddName || !s.dayAddTime;
  const saveDayAdd = async () => {
    if (dayAddDisabled) return;
    if (dayAddIsNew) {
      await db.collection('clients').add({
        name: dayAddName, phone: s.dayAddNewPhone.trim() || '—', email: '',
        stamps: 0, visits: 0, lastVisit: '—', notes: '', birthday: '', history: [],
      });
    }
    await db.collection('appointments').add({
      date: s.adminSelectedDate, time: s.dayAddTime, name: dayAddName,
      service: dayAddServiceLabel || 'Bez upresnenia',
      items: dayAddMain ? [dayAddMain, ...dayAddAddonItems].map((it) => ({ label: it.label, price: it.price, duration: it.duration })) : [],
      price: dayAddPriceNum, priceLabel: dayAddPriceNum ? formatPrice(dayAddPriceNum) : '',
      phone: dayAddPicked ? (dayAddPicked.phone || '') : s.dayAddNewPhone.trim(),
      duration: dayAddDuration, manual: true,
    });
    set({ dayAddOpen: false });
    showToast(dayAddIsNew ? 'Klientka a termín pridané' : 'Termín pridaný');
  };
  /* ---------- služba vždy z cenníka (karta klientky, nová klientka) ----------
     Voľný text vytváral rôzne názvy tej istej služby ("Gelove nechty" vs
     "Gélové nechty") a štatistiky sa potom rozpadali. */
  const cennikByNorm = {};
  cennikMain.concat(cennikAddons).forEach((m) => { const k = normText(m.label); if (!cennikByNorm[k]) cennikByNorm[k] = m; });
  const pickedService = (mainKey, addonKeys) => {
    const main = cennikMain.find((m) => m.key === mainKey) || null;
    if (!main) return null;
    const all = [main, ...cennikAddons.filter((a) => (addonKeys || []).indexOf(a.key) !== -1)];
    const priceNum = all.reduce((sum, it) => sum + it.priceNum, 0);
    return {
      label: all.map((it) => it.label).join(' + '), priceNum, priceLabel: formatPrice(priceNum),
      duration: all.reduce((sum, it) => sum + it.duration, 0),
      items: all.map((it) => ({ label: it.label, price: it.price, duration: it.duration })),
    };
  };
  // existujúci termín → položky cenníka (podľa uložených položiek alebo názvu)
  const keysFromAppt = (a) => {
    const labels = (a.items && a.items.length) ? a.items.map((it) => it.label) : String(a.service || '').split(' + ');
    const found = labels.map((l) => cennikByNorm[normText(l)]).filter(Boolean);
    const main = found.find((m) => cennikMain.indexOf(m) !== -1);
    return { mainKey: main ? main.key : null, addons: found.filter((m) => cennikAddons.indexOf(m) !== -1).map((m) => m.key) };
  };
  const renderServicePicker = (mainKey, addonKeys, onPickMain, onToggleAddon) => (
    <React.Fragment>
      {cennikMainByCat.map((cat) => (
        <div key={cat.ci} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: '.62rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--mocha)', marginBottom: 6 }}>{cat.name}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {cat.items.map((m) => (
              <button type="button" key={m.key} onClick={() => onPickMain(m)} style={st(chipStyle(mainKey === m.key))}>{m.label} · {m.price}</button>
            ))}
          </div>
        </div>
      ))}
      {mainKey && cennikAddons.length > 0 && (
        <React.Fragment>
          <div style={{ fontSize: '.62rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--mocha)', margin: '10px 0 6px' }}>Doplnky</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 10 }}>
            {cennikAddons.map((a) => (
              <button type="button" key={a.key} onClick={() => onToggleAddon(a)} style={st(chipStyle((addonKeys || []).indexOf(a.key) !== -1))}>+ {a.label} · {a.price}</button>
            ))}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
  const toggleKey = (list, key) => ((list || []).indexOf(key) !== -1 ? list.filter((k) => k !== key) : [...(list || []), key]);
  const apptPicked = pickedService(s.apptMainKey, s.apptAddons);
  const newClientPicked = pickedService(s.newClientMainKey, s.newClientAddons);

  /* ---------- štatistiky ---------- */
  const cennikCatByNorm = {};
  pricing.forEach((cat) => { cennikCatByNorm[normText(cat.name)] = cat.name; });
  // hlavná služba termínu, zjednotená podľa cenníka
  const canonicalService = (a) => {
    const raw = ((a.items && a.items[0] && a.items[0].label) || String(a.service || '').split(' + ')[0]).trim();
    const n = normText(raw);
    if (!n || n === 'bez upresnenia') return { label: 'Bez upresnenia', status: 'none' };
    const m = cennikByNorm[n];
    if (m) return { label: m.label, status: 'item' };
    if (cennikCatByNorm[n]) return { label: `${cennikCatByNorm[n]} (bez upresnenia)`, status: 'category' };
    return { label: raw, status: 'unknown' };
  };
  // cena termínu: uložená, inak súčet položiek, inak dohľadaná v cenníku
  const apptPrice = (a) => {
    if (Number(a.price) > 0) return Number(a.price);
    if (a.items && a.items.length) {
      const sum = a.items.reduce((t, it) => t + priceToNumber(it.price), 0);
      if (sum) return sum;
    }
    return String(a.service || '').split(' + ').reduce((t, l) => {
      const m = cennikByNorm[normText(l)];
      return t + (m ? m.priceNum : 0);
    }, 0);
  };
  const money = (n) => formatPrice(Math.round(n));
  const isoFromDate = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const isoAddDays = (iso, n) => { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return isoFromDate(d); };
  const daysBetween = (a, bIso) => Math.round((new Date(bIso + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);

  // prehľad po klientkach (párujeme podľa mena, rovnako ako zvyšok appky)
  const statsByName = {};
  nonBlockedAppts.forEach((a) => {
    const r = statsByName[a.name] || (statsByName[a.name] = { past: 0, spend: 0, first: null, last: null, next: null });
    if (!r.first || a.date < r.first) r.first = a.date;
    if (a.date <= todayIso) {
      r.past += 1; r.spend += apptPrice(a);
      if (!r.last || a.date > r.last) r.last = a.date;
    } else if (!r.next || a.date < r.next) r.next = a.date;
  });
  const clientApptStats = (c) => {
    const r = statsByName[c.name] || { past: 0, spend: 0, first: null, last: null, next: null };
    // c.visits pochádza zo schválených žiadostí — tie sú zároveň v termínoch, preto max, nie súčet
    return { ...r, visits: Math.max(c.visits || 0, r.past) };
  };

  const STATS_PERIODS = [{ id: 'week', label: 'Týždeň' }, { id: 'month', label: 'Mesiac' }, { id: 'lastMonth', label: 'Min. mesiac' }, { id: 'year', label: 'Rok' }];
  const todayDate = new Date(todayIso + 'T00:00:00');
  const [pFrom, pTo] = (() => {
    const y = todayDate.getFullYear(), m = todayDate.getMonth();
    if (s.statsPeriod === 'week') return [statsWeekStart, isoAddDays(statsWeekStart, 6)];
    if (s.statsPeriod === 'lastMonth') return [isoFromDate(new Date(y, m - 1, 1)), isoFromDate(new Date(y, m, 0))];
    if (s.statsPeriod === 'year') return [`${y}-01-01`, `${y}-12-31`];
    return [isoFromDate(new Date(y, m, 1)), isoFromDate(new Date(y, m + 1, 0))];
  })();
  const inPeriod = (a) => a.date >= pFrom && a.date <= pTo;
  const periodAppts = nonBlockedAppts.filter(inPeriod);
  const periodDone = periodAppts.filter((a) => a.date <= todayIso);
  const periodPlanned = periodAppts.filter((a) => a.date > todayIso);
  const revenueDone = periodDone.reduce((t, a) => t + apptPrice(a), 0);
  const revenuePlanned = periodPlanned.reduce((t, a) => t + apptPrice(a), 0);
  const hoursDone = periodDone.reduce((t, a) => t + (Number(a.duration) || 0), 0);
  const avgTicket = periodDone.length ? revenueDone / periodDone.length : 0;
  const newClientsInPeriod = Object.values(statsByName).filter((r) => r.first >= pFrom && r.first <= pTo).length;
  // vyťaženosť: obsadené hodiny / (dni × otváracie hodiny − nastavené voľno)
  const occupancyFor = (from, to) => {
    if (to < from) return null;
    const days = daysBetween(from, to) + 1;
    const inRange = (a) => a.date >= from && a.date <= to;
    const blockedH = appointments.filter((a) => a.blocked && inRange(a)).reduce((t, a) => t + (Number(a.duration) || 0), 0);
    const capacity = days * (CLOSE_HOUR - OPEN_HOUR) - blockedH;
    if (capacity <= 0) return null;
    const booked = nonBlockedAppts.filter(inRange).reduce((t, a) => t + (Number(a.duration) || 0), 0);
    return Math.min(1, booked / capacity);
  };
  const occupancyPeriod = occupancyFor(pFrom, pTo < todayIso ? pTo : todayIso);
  const occupancyNext7 = occupancyFor(isoAddDays(todayIso, 1), isoAddDays(todayIso, 7));
  const pct = (f) => (f === null ? '—' : `${Math.round(f * 100)} %`);

  // služby v období (zjednotené podľa cenníka)
  const svcAgg = {};
  let unspecifiedCount = 0;
  periodAppts.forEach((a) => {
    const c = canonicalService(a);
    if (c.status === 'none') { unspecifiedCount += 1; return; }
    const r = svcAgg[c.label] || (svcAgg[c.label] = { label: c.label, count: 0, revenue: 0 });
    r.count += 1; r.revenue += apptPrice(a);
  });
  const topServices = Object.values(svcAgg).sort((a, bb) => bb.count - a.count || bb.revenue - a.revenue).slice(0, 6);
  const topServiceMax = topServices.length ? topServices[0].count : 1;

  // rozloženie podľa dní v týždni
  const WEEKDAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];
  periodAppts.forEach((a) => { weekdayCounts[(new Date(a.date + 'T00:00:00').getDay() + 6) % 7] += 1; });
  const weekdayMax = Math.max(1, ...weekdayCounts);

  // tržby za posledných 6 mesiacov
  const monthlyRevenue = [5, 4, 3, 2, 1, 0].map((back) => {
    const d = new Date(todayDate.getFullYear(), todayDate.getMonth() - back, 1);
    const prefix = isoFromDate(d).slice(0, 7);
    const list = nonBlockedAppts.filter((a) => a.date.slice(0, 7) === prefix);
    const done = list.filter((a) => a.date <= todayIso).reduce((t, a) => t + apptPrice(a), 0);
    const planned = list.filter((a) => a.date > todayIso).reduce((t, a) => t + apptPrice(a), 0);
    return { label: SK_MON[d.getMonth()], done, planned, count: list.length };
  });
  const monthlyMax = Math.max(1, ...monthlyRevenue.map((m) => m.done + m.planned));

  // najvernejšie klientky a tie, ktoré dlho neboli
  const clientsWithStats = clients.map((c) => ({ c, r: clientApptStats(c) }));
  const topClients = clientsWithStats.filter((x) => x.r.visits > 0)
    .sort((a, bb) => bb.r.visits - a.r.visits || bb.r.spend - a.r.spend).slice(0, 5);
  const LAPSED_DAYS = 42;
  const lapsedClients = clientsWithStats
    .filter((x) => x.r.last && !x.r.next && daysBetween(x.r.last, todayIso) >= LAPSED_DAYS)
    .map((x) => ({ ...x, since: daysBetween(x.r.last, todayIso) }))
    .sort((a, bb) => a.since - bb.since).slice(0, 8);

  // staré názvy služieb, ktoré nesedia s cenníkom — Michaela ich jedným klikom zjednotí
  const unmatchedAgg = {};
  nonBlockedAppts.forEach((a) => {
    const st2 = canonicalService(a).status;
    if (st2 === 'category' || st2 === 'unknown') unmatchedAgg[a.service] = (unmatchedAgg[a.service] || 0) + 1;
  });
  const unmatchedServices = Object.entries(unmatchedAgg).sort((a, bb) => bb[1] - a[1]);
  const remapService = async (raw) => {
    const m = cennikMain.find((x) => x.key === s.mapServiceSel[raw]);
    if (!m) return;
    const targets = nonBlockedAppts.filter((a) => a.service === raw);
    if (!window.confirm(`Prepísať „${raw}“ na „${m.label}“ (${m.price}) v ${targets.length} termínoch?`)) return;
    const batch = db.batch();
    targets.forEach((a) => batch.update(db.collection('appointments').doc(a.id), {
      service: m.label, items: [{ label: m.label, price: m.price, duration: m.duration }], price: m.priceNum, priceLabel: formatPrice(m.priceNum),
    }));
    clients.forEach((c) => {
      const h = c.history || [];
      if (h.some((x) => x.service === raw)) batch.update(db.collection('clients').doc(c.id), { history: h.map((x) => (x.service === raw ? { ...x, service: m.label } : x)) });
    });
    await batch.commit();
    set({ mapServiceSel: { ...s.mapServiceSel, [raw]: undefined } });
    showToast('Názov služby zjednotený');
  };
  const statTile = (value, label, sub) => (
    <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line)')}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--ink)', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: '.68rem', color: 'var(--ink-3)', letterSpacing: '.06em', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: '.66rem', color: 'var(--mocha)', marginTop: 3 }}>{sub}</div>}
    </div>
  );
  const statHeading = (title, note) => (
    <div style={{ margin: '24px 0 10px' }}>
      <div style={st('font-family:var(--font-display);font-size:1.15rem;color:var(--ink)')}>{title}</div>
      {note && <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '.74rem', color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.5 }}>{note}</div>}
    </div>
  );
  const statBar = (key, label, valueText, frac, plannedFrac) => (
    <div key={key} style={{ padding: '8px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 5 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.84rem', color: 'var(--ink-2)', minWidth: 0 }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.8rem', color: 'var(--ink)', flexShrink: 0 }}>{valueText}</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'var(--cream)', display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: `${Math.round(frac * 100)}%`, background: 'var(--mocha)' }}></div>
        {plannedFrac > 0 && <div style={{ width: `${Math.round(plannedFrac * 100)}%`, background: 'var(--taupe)' }}></div>}
      </div>
    </div>
  );

  const chipStyle = (selected) => `all:unset;cursor:pointer;padding:6px 10px;border-radius:999px;font-family:var(--font-sans);font-size:.64rem;color:${selected ? 'var(--porcelain)' : 'var(--ink-2)'};background:${selected ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${selected ? 'var(--espresso)' : 'var(--line-gold)'}`;
  const blockTimePresetStyle = (active) => `all:unset;cursor:pointer;padding:6px 10px;border-radius:999px;font-family:var(--font-sans);font-size:.64rem;color:${active ? 'var(--porcelain)' : 'var(--ink-2)'};background:${active ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${active ? 'var(--espresso)' : 'var(--line-gold)'}`;
  // Referral system removed
  const adminTodayCount = countsByDate[todayIso] || 0;
  // stav návrhu nového termínu: pending | accepted | declined | expired | null
  const proposalState = (r) => {
    const p = r.proposal;
    if (!p) return null;
    const hold = p.holdId ? allAppointments.find((a) => a.id === p.holdId) : null;
    if (hold && hold.accepted) return 'accepted';
    if (p.status === 'pending' && p.expiresAt && p.expiresAt < nowMs) return 'expired';
    // klientka podržanie zrušila, ale stav žiadosti sa nestihol zapísať
    if (p.status === 'pending' && !hold) return 'declined';
    return p.status || null;
  };
  const isWaitingRequest = (r) => { const st0 = proposalState(r); return st0 === 'pending' || st0 === 'accepted'; };
  const newRequests = requests.filter((r) => !isWaitingRequest(r));
  const waitingRequests = requests.filter(isWaitingRequest);
  const adminPendingCount = newRequests.length;
  const noRequests = requests.length === 0;
  const reqViewWaiting = s.reqView === 'waiting' && waitingRequests.length > 0;
  const getRequestDuration = (r) => {
    const stored = s.requestDurations[r.id];
    if (stored === undefined) return r.duration || 1.5;
    const n = parseFloat(stored);
    return isNaN(n) ? (r.duration || 1.5) : n;
  };
  const setRequestDuration = (id, val) => set({ requestDurations: { ...s.requestDurations, [id]: val } });
  const notifyClient = async (uid, title, message, type) => {
    if (!uid || typeof NotificationManager === 'undefined') return;
    try { await new NotificationManager(db, auth, uid).sendCustomNotification(title, message, type || 'info'); }
    catch (e) { console.warn('notify failed', e && e.message); }
  };
  const fmtDeadline = (ms) => { const d = new Date(ms); return `${d.getDate()}. ${d.getMonth() + 1}. o ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const hoursLeft = (ms) => Math.max(0, Math.round((ms - nowMs) / 3600000));
  const proposeDates = buildDateOptions();
  const adminRequestsList = (reqViewWaiting ? waitingRequests : newRequests).map((r) => {
    const pState = proposalState(r);
    const dur = getRequestDuration(r);
    const conflict = !slotAvailable(r.date, r.time, dur, busyAppointments) || isPastSlot(r.date, r.time);
    const proposing = s.proposeFor === r.id;
    const proposeTimes = proposing && s.proposeDateIso ? buildTimeOptions(s.proposeDateIso, busyAppointments).map((t) => {
      const start = timeToHours(t);
      const ownHold = r.proposal && r.proposal.holdId;
      const others = busyAppointments.filter((a) => a.id !== ownHold);
      const taken = isPastSlot(s.proposeDateIso, t) || !slotAvailable(s.proposeDateIso, t, dur, others);
      return { label: t, taken, selected: s.proposeTime === t };
    }) : [];
    return {
      ...r, dateLabel: isoLabel(r.date), durationValue: dur, pState, conflict, proposing, proposeTimes,
      approve: async () => {
        const apptRef = await db.collection('appointments').add({
          date: r.date, time: r.time, name: r.name, service: r.service, duration: dur,
          items: r.items || [], price: r.price || 0, priceLabel: r.priceLabel || '',
          phone: r.phone || '', email: r.email || '',
          manual: false, clientUid: r.clientUid || null,
        });
        const matched = clients.find((c) => c.name === r.name);
        if (matched) {
          await db.collection('clients').doc(matched.id).update({
            visits: (matched.visits || 0) + 1,
            lastVisit: isoLabel(r.date),
            stamps: Math.min(5, (matched.stamps || 0) + 1),
            history: [{ service: r.service, date: isoLabel(r.date) }, ...(matched.history || [])],
          });
        }
        if (r.proposal && r.proposal.holdId) await db.collection('appointments').doc(r.proposal.holdId).delete().catch(() => {});
        await db.collection('requests').doc(r.id).delete();
        if (r.clientUid && typeof NotificationManager !== 'undefined') {
          try {
            const notifMgr = new NotificationManager(db, auth, r.clientUid);
            await notifMgr.sendConfirmationNotification({ id: apptRef.id, service: r.service, date: r.date, time: r.time });
          } catch (e) { console.error('notify approve failed', e); }
        }
        showToast('Rezervácia potvrdená');
      },
      reject: async () => {
        if (r.proposal && r.proposal.holdId) await db.collection('appointments').doc(r.proposal.holdId).delete().catch(() => {});
        await db.collection('requests').doc(r.id).delete();
        showToast('Žiadosť zamietnutá');
      },
      openPropose: () => set({ proposeFor: r.id, proposeDateIso: r.date >= todayIso ? r.date : todayIso, proposeTime: '', proposeMsg: '' }),
      closePropose: () => set({ proposeFor: null }),
      sendProposal: async () => {
        if (!s.proposeDateIso || !s.proposeTime || s.proposeSending) return;
        set({ proposeSending: true });
        try {
          const now = Date.now();
          const exp = now + PROPOSAL_HOURS * 3600 * 1000;
          const holdRef = await db.collection('appointments').add({
            date: s.proposeDateIso, time: s.proposeTime, duration: dur, name: r.name, service: r.service,
            items: r.items || [], price: r.price || 0, priceLabel: r.priceLabel || '',
            phone: r.phone || '', email: r.email || '', clientUid: r.clientUid || null,
            manual: false, hold: true, accepted: false, requestId: r.id, expiresAt: exp,
          });
          const prevHold = r.proposal && r.proposal.holdId;
          await db.collection('requests').doc(r.id).update({
            duration: dur,
            proposal: { date: s.proposeDateIso, time: s.proposeTime, message: (s.proposeMsg || '').trim(), sentAt: now, expiresAt: exp, holdId: holdRef.id, status: 'pending' },
          });
          if (prevHold) await db.collection('appointments').doc(prevHold).delete().catch(() => {});
          await notifyClient(r.clientUid, 'Návrh nového termínu',
            `Michaela navrhuje ${isoLabel(s.proposeDateIso)} o ${s.proposeTime}. Potvrďte ho prosím v appke do ${PROPOSAL_HOURS} hodín.`, 'reschedule');
          set({ proposeFor: null, proposeSending: false, reqView: 'waiting' });
          showToast('Návrh odoslaný klientke');
        } catch (e) {
          console.error('send proposal failed', e);
          set({ proposeSending: false });
          showToast('Návrh sa nepodarilo odoslať');
        }
      },
      withdraw: async () => {
        if (r.proposal && r.proposal.holdId) await db.collection('appointments').doc(r.proposal.holdId).delete().catch(() => {});
        await db.collection('requests').doc(r.id).update({ proposal: null });
        set({ reqView: 'new' });
        showToast('Návrh stiahnutý');
      },
    };
  });

  /* ---------- klientka: návrhy nového termínu ---------- */
  const myProposals = (myRequests || []).filter((r) => {
    const p = r.proposal;
    if (!p || p.status !== 'pending' || !(p.expiresAt > nowMs)) return false;
    const hold = allAppointments.find((a) => a.id === p.holdId);
    return !!hold && !hold.accepted;
  }).map((r) => ({
    ...r,
    oldLabel: `${isoLabel(r.date)} · ${r.time}`,
    newLabel: `${isoLabel(r.proposal.date)} · ${r.proposal.time}`,
    deadline: fmtDeadline(r.proposal.expiresAt),
    accept: async () => {
      try {
        await db.collection('appointments').doc(r.proposal.holdId).update({ accepted: true, acceptedAt: Date.now() });
        await db.collection('requests').doc(r.id).update({ 'proposal.status': 'accepted' }).catch(() => {});
        showToast('Termín potvrdený');
      } catch (e) { console.error('accept proposal failed', e); showToast('Nepodarilo sa potvrdiť, skúste znova'); }
    },
    decline: async (rebook) => {
      await db.collection('appointments').doc(r.proposal.holdId).delete().catch(() => {});
      await db.collection('requests').doc(r.id).update({ 'proposal.status': 'declined', 'proposal.declinedAt': Date.now(), 'proposal.rebook': !!rebook }).catch(() => {});
      if (rebook) rebookService(r.service); else showToast('Návrh odmietnutý');
    },
  }));

  const clientsListView = s.selectedClientId === null;
  const adminClientsList = clients.map((c) => {
    const r = clientApptStats(c);
    return { ...c, initials: initials(c.name || '—'), visitCount: r.visits, lastIso: r.last, open: () => set({ selectedClientId: c.id }) };
  }).sort(s.clientSort === 'alpha'
    ? (a, bb) => (a.name || '').localeCompare(bb.name || '', 'sk', { sensitivity: 'base' })
    : (a, bb) => bb.visitCount - a.visitCount || (bb.lastIso || '').localeCompare(a.lastIso || '') || (a.name || '').localeCompare(bb.name || '', 'sk'));
  const clientSearchLower = s.clientSearch.trim().toLowerCase();
  const adminClientsListFiltered = clientSearchLower
    ? adminClientsList.filter((c) => (c.name || '').toLowerCase().includes(clientSearchLower) || (c.email || '').toLowerCase().includes(clientSearchLower) || (c.phone || '').toLowerCase().includes(clientSearchLower))
    : adminClientsList;
  const noSearchResults = clientSearchLower && adminClientsListFiltered.length === 0;
  const selClient = clients.find((c) => c.id === s.selectedClientId) || { name: '', phone: '', visits: 0, lastVisit: '', stamps: 0, history: [] };
  const selClientInitials = initials(selClient.name || '—');
  const selClientHistory = selClient.history || [];
  // Compute lastVisit automatically from history
  const computedLastVisit = selClientHistory.length > 0 ? selClientHistory[0].date : (selClient.lastVisit || '—');
  const selClientStamps = [0, 1, 2, 3, 4].map((i) => ({
    style: `aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${i < selClient.stamps ? 'linear-gradient(150deg,var(--taupe-light),var(--espresso))' : 'var(--cream)'};color:${i < selClient.stamps ? 'var(--porcelain)' : 'var(--ink-3)'};border:1px solid ${i < selClient.stamps ? 'var(--espresso)' : 'var(--line)'}`,
  }));
  const backToClients = () => set({ selectedClientId: null });
  const deleteClient = async () => {
    if (!s.selectedClientId) return;
    if (!window.confirm(`Naozaj zmazať klientku ${selClient.name}? Táto akcia sa nedá vrátiť späť.`)) return;
    // Delete all appointments for this client
    const clientAppts = appointments.filter((a) => a.name === selClient.name);
    const batch = db.batch();
    clientAppts.forEach((a) => batch.delete(db.collection('appointments').doc(a.id)));
    // Delete the client
    batch.delete(db.collection('clients').doc(s.selectedClientId));
    await batch.commit();
    set({ selectedClientId: null });
    showToast('Klientka a jej termíny zmazané');
  };
  const openMergeForm = () => set({ mergeFormOpen: true, mergeSearchQuery: '', mergeSourceId: null });
  const cancelMergeForm = () => set({ mergeFormOpen: false, mergeSourceId: null });
  const mergeSearchLower = s.mergeSearchQuery.trim().toLowerCase();
  const mergeCandidates = clients.filter((c) => c.id !== s.selectedClientId
    && (!mergeSearchLower || c.name.toLowerCase().includes(mergeSearchLower) || (c.phone || '').toLowerCase().includes(mergeSearchLower)));
  const mergeSource = clients.find((c) => c.id === s.mergeSourceId) || null;
  const mergeBlocked = !!(mergeSource && mergeSource.email && !selClient.email);
  const confirmMerge = async () => {
    if (!mergeSource || mergeBlocked) return;
    if (!window.confirm(`Naozaj zlúčiť ${mergeSource.name} do ${selClient.name}? Návštevy, pečiatky a história sa spoja, ${mergeSource.name} bude zmazaná. Táto akcia sa nedá vrátiť späť.`)) return;
    const mergedHistory = [...(selClient.history || []), ...(mergeSource.history || [])];
    const mergedNotes = [selClient.notes, mergeSource.notes].filter(Boolean).join(' | ');
    await db.collection('clients').doc(s.selectedClientId).update({
      visits: (selClient.visits || 0) + (mergeSource.visits || 0),
      stamps: Math.min(5, (selClient.stamps || 0) + (mergeSource.stamps || 0)),
      history: mergedHistory,
      notes: mergedNotes,
      phone: (selClient.phone && selClient.phone !== '—') ? selClient.phone : (mergeSource.phone || '—'),
      birthday: selClient.birthday || mergeSource.birthday || '',
      email: selClient.email || mergeSource.email || '',
    });
    const apptsToMove = appointments.filter((a) => a.name === mergeSource.name);
    await Promise.all(apptsToMove.map((a) => db.collection('appointments').doc(a.id).update({ name: selClient.name })));
    await db.collection('clients').doc(mergeSource.id).delete();
    set({ mergeFormOpen: false, mergeSourceId: null });
    showToast('Klientky zlúčené');
  };
  const updateClientNotes = (e) => { if (s.selectedClientId) db.collection('clients').doc(s.selectedClientId).update({ notes: e.target.value }); };
  const updateClientBirthday = (e) => { if (s.selectedClientId) db.collection('clients').doc(s.selectedClientId).update({ birthday: e.target.value }); };
  const openAddClient = () => set({ addFormOpen: true, newClientName: '', newClientPhone: '', newClientDateIso: null, newClientTime: '09:00', newClientService: '', newClientMainKey: null, newClientAddons: [], newClientDuration: 1.5 });
  const pickNewClientMain = (m) => {
    const p = pickedService(m.key, s.newClientAddons);
    set({ newClientMainKey: m.key, newClientDuration: p ? p.duration : s.newClientDuration });
  };
  const toggleNewClientAddon = (a) => {
    const addons = toggleKey(s.newClientAddons, a.key);
    const p = pickedService(s.newClientMainKey, addons);
    set({ newClientAddons: addons, newClientDuration: p ? p.duration : s.newClientDuration });
  };
  const cancelAddClient = () => set({ addFormOpen: false });
  const durationPresetOptions = DURATION_PRESETS.map((d) => ({
    label: d.label, select: () => set({ newClientDuration: d.val }),
    style: `all:unset;cursor:pointer;padding:8px 14px;border-radius:999px;font-family:var(--font-sans);font-size:.74rem;color:${s.newClientDuration === d.val ? 'var(--porcelain)' : 'var(--ink-2)'};background:${s.newClientDuration === d.val ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${s.newClientDuration === d.val ? 'var(--espresso)' : 'var(--line-gold)'}`,
  }));
  const saveDisabled = !s.newClientName.trim();
  const saveBtnStyle = `all:unset;cursor:${saveDisabled ? 'not-allowed' : 'pointer'};flex:1;text-align:center;padding:11px;border-radius:999px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;opacity:${saveDisabled ? 0.5 : 1}`;
  const adminDayPickerStyle = (selected) => `all:unset;cursor:pointer;text-align:center;padding:9px 4px;border-radius:12px;color:${selected ? 'var(--porcelain)' : 'var(--ink)'};background:${selected ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${selected ? 'var(--espresso)' : 'var(--line)'}`;
  const newClientDateOptions = calendarDates.map((d) => ({
    dow: d.dow, num: d.num, mon: d.mon, select: () => set({ newClientDateIso: d.iso }),
    style: adminDayPickerStyle(s.newClientDateIso === d.iso),
  }));
  const saveNewClient = async () => {
    if (saveDisabled) return;
    const hasAppt = s.newClientDateIso && s.newClientTime.trim();
    await db.collection('clients').add({
      name: s.newClientName.trim(), phone: s.newClientPhone.trim() ? normalizePhone(s.newClientPhone) : '—', stamps: 0, visits: 0, lastVisit: '—', notes: '', birthday: '', history: [],
    });
    if (hasAppt) {
      const p = newClientPicked;
      await db.collection('appointments').add({
        date: s.newClientDateIso, time: s.newClientTime.trim(), name: s.newClientName.trim(),
        service: p ? p.label : 'Bez upresnenia', items: p ? p.items : [], price: p ? p.priceNum : 0, priceLabel: p ? p.priceLabel : '',
        phone: s.newClientPhone.trim() ? normalizePhone(s.newClientPhone) : '',
        duration: clampDuration(s.newClientDuration || 1.5), manual: true,
      });
    }
    set({ addFormOpen: false });
    showToast(hasAppt ? 'Klientka a termín pridané' : 'Klientka pridaná');
  };
  const addStampSel = () => { if (s.selectedClientId) db.collection('clients').doc(s.selectedClientId).update({ stamps: Math.min(5, (selClient.stamps || 0) + 1) }); };
  const removeStampSel = () => { if (s.selectedClientId) db.collection('clients').doc(s.selectedClientId).update({ stamps: Math.max(0, (selClient.stamps || 0) - 1) }); };

  // Appointment management for the client currently open in the detail view.
  // Show only current/future appointment (closest one) and past appointments
  const allClientAppts = appointments.filter((a) => a.name === selClient.name && !a.blocked).sort((a, bb) => a.date === bb.date ? timeToHours(a.time) - timeToHours(bb.time) : a.date.localeCompare(bb.date));
  const currentAppt = allClientAppts.find((a) => a.date >= todayIso);
  const pastAppts = allClientAppts.filter((a) => a.date < todayIso);
  const selClientAppts = [...(currentAppt ? [currentAppt] : []), ...pastAppts];
  const openAddAppt = () => set({ apptFormOpen: true, apptEditingId: null, apptDateIso: calendarDates[0].iso, apptTime: '', apptService: '', apptDuration: 1.5, apptMainKey: null, apptAddons: [] });
  const openEditAppt = (a) => {
    const k = keysFromAppt(a);
    set({ apptFormOpen: true, apptEditingId: a.id, apptDateIso: a.date, apptTime: a.time, apptService: a.service, apptDuration: a.duration || 1.5, apptMainKey: k.mainKey, apptAddons: k.addons });
  };
  const pickApptMain = (m) => {
    const p = pickedService(m.key, s.apptAddons);
    set({ apptMainKey: m.key, apptDuration: p ? p.duration : s.apptDuration });
  };
  const toggleApptAddon = (a) => {
    const addons = toggleKey(s.apptAddons, a.key);
    const p = pickedService(s.apptMainKey, addons);
    set({ apptAddons: addons, apptDuration: p ? p.duration : s.apptDuration });
  };
  const cancelApptForm = () => set({ apptFormOpen: false, apptEditingId: null });
  const apptDateOptions = calendarDates.map((d) => ({
    dow: d.dow, num: d.num, mon: d.mon, select: () => set({ apptDateIso: d.iso }),
    style: adminDayPickerStyle(s.apptDateIso === d.iso),
  }));
  const apptDurationOptions = DURATION_PRESETS.map((d) => ({
    label: d.label, select: () => set({ apptDuration: d.val }),
    style: `all:unset;cursor:pointer;padding:8px 14px;border-radius:999px;font-family:var(--font-sans);font-size:.74rem;color:${s.apptDuration === d.val ? 'var(--porcelain)' : 'var(--ink-2)'};background:${s.apptDuration === d.val ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${s.apptDuration === d.val ? 'var(--espresso)' : 'var(--line-gold)'}`,
  }));
  const apptSaveDisabled = !s.apptDateIso || !s.apptTime.trim();
  const saveAppt = async () => {
    if (apptSaveDisabled) return;
    const p = apptPicked;
    const payload = { date: s.apptDateIso, time: s.apptTime.trim(), name: selClient.name, duration: clampDuration(s.apptDuration || 1.5) };
    if (p) Object.assign(payload, { service: p.label, items: p.items, price: p.priceNum, priceLabel: p.priceLabel });
    else if (!s.apptEditingId) Object.assign(payload, { service: 'Bez upresnenia', items: [], price: 0, priceLabel: '' });
    // pri úprave bez zvolenej služby ponecháme pôvodnú (a pôvodné "manual")
    if (!s.apptEditingId) payload.manual = true;
    if (s.apptEditingId) await db.collection('appointments').doc(s.apptEditingId).update(payload);
    else await db.collection('appointments').add(payload);
    set({ apptFormOpen: false, apptEditingId: null });
    showToast(s.apptEditingId ? 'Termín upravený' : 'Termín pridaný');
  };
  const cancelAppt = (id) => {
    if (!window.confirm('Naozaj zrušiť tento termín?')) return;
    db.collection('appointments').doc(id).delete();
    showToast('Termín zrušený');
  };

  const inputStyle = 'all:unset;display:block;width:100%;box-sizing:border-box;padding:11px 14px;border-radius:12px;border:1px solid var(--line);background:var(--cream);font-family:var(--font-sans);font-size:.86rem;color:var(--ink);margin-bottom:10px';

  /* ---------- redesign: pomocné hodnoty pre obrazovky ---------- */
  const hourNow = new Date().getHours();
  const greetWord = 'Dobrý deň';
  const firstName = loggedInClient ? String(loggedInClient.name || '').split(' ')[0] : '';
  const daysLabel = (iso) => { const n = daysBetween(todayIso, iso); return n <= 0 ? 'dnes' : n === 1 ? 'zajtra' : n < 5 ? `o ${n} dni` : `o ${n} dní`; };
  const shortDate = (iso) => { const p = isoParts(iso); return `${p.dow} ${p.num}. ${p.mon}`; };
  const freeLabel = (n) => (n === 1 ? '1 voľný' : n >= 2 && n <= 4 ? `${n} voľné` : `${n} voľných`);
  const MONTHS_FULL = ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December'];
  const maxDayPage = Math.max(0, Math.ceil(dateOptions.length / 4) - 1);
  const bookingDayPage = Math.min(maxDayPage, b.dayPage || 0);
  const visibleDays = dateOptions.slice(bookingDayPage * 4, bookingDayPage * 4 + 4);
  const visibleMonthLabel = (() => {
    if (!visibleDays.length) return '';
    const a = new Date(visibleDays[0].iso + 'T00:00:00'); const z = new Date(visibleDays[visibleDays.length - 1].iso + 'T00:00:00');
    return a.getMonth() === z.getMonth() ? `${MONTHS_FULL[a.getMonth()]} ${a.getFullYear()}` : `${MONTHS_FULL[a.getMonth()].slice(0, 3)} – ${MONTHS_FULL[z.getMonth()].slice(0, 3)} ${z.getFullYear()}`;
  })();
  const bookCatPosRaw = b.catTab != null ? b.catTab : (bookingMain ? cennikMainByCat.findIndex((c) => c.ci === bookingMain.ci) : 0);
  const bookCatPos = bookCatPosRaw >= 0 && bookCatPosRaw < cennikMainByCat.length ? bookCatPosRaw : 0;
  const shortCat = (n) => { const t = String(n || ''); if (/g[ée]l/i.test(t)) return 'Gélové'; if (/manik/i.test(t)) return 'Manikúra'; if (/starostl/i.test(t)) return 'Starostl.'; if (/dizajn|doplnk/i.test(t)) return 'Dizajn'; return t.split(' ')[0]; };
  const shortAddon = (n) => String(n || '').replace(/\s+manikúra/i, '');
  const historyRatedAvg = (() => { const r = historyAppts.filter((h) => h.rating); return r.length ? (r.reduce((t, h) => t + h.rating, 0) / r.length).toFixed(1).replace('.', ',') : ''; })();
  const pricePos = s.expandedCat != null && pricing[s.expandedCat] ? s.expandedCat : 0;
  const downloadIcs = () => {
    if (!b.dateIso || !b.time) return;
    const [hh, mm] = b.time.split(':').map(Number);
    const start = new Date(b.dateIso + 'T00:00:00'); start.setHours(hh, mm || 0, 0, 0);
    const end = new Date(start.getTime() + svcDuration * 3600000);
    const f = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}00`;
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Aura Nails//SK', 'BEGIN:VEVENT', `UID:${Date.now()}@auranails.sk`, `DTSTART:${f(start)}`, `DTEND:${f(end)}`,
      `SUMMARY:Aura Nails – ${booking_selectedService}`, 'LOCATION:Námestie Baníkov 2\\, Handlová', 'DESCRIPTION:Čaká na potvrdenie od Michaely.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
    a.download = 'aura-nails-termin.ics';
    document.body.appendChild(a); a.click(); a.remove();
  };
  const todayLongLabel = (() => { const d = new Date(); const dn = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'][d.getDay()]; return `${dn} ${d.getDate()}. ${d.getMonth() + 1}.`; })();
  const todayRealAppts = appointments.filter((a) => a.date === todayIso && !a.blocked).sort((a, bb) => timeToHours(a.time) - timeToHours(bb.time));
  const nowH = new Date().getHours() + new Date().getMinutes() / 60;
  const nextTodayAppt = todayRealAppts.find((a) => timeToHours(a.time) + (Number(a.duration) || 0) > nowH) || null;
  const todayRangeLabel = todayRealAppts.length ? `${todayRealAppts[0].time} – ${(() => { const l = todayRealAppts[todayRealAppts.length - 1]; const e = timeToHours(l.time) + (Number(l.duration) || 0); return `${Math.floor(e)}:${String(Math.round((e % 1) * 60)).padStart(2, '0')}`; })()}` : '';
  const apptCountByDate = {};
  const closedByDate = {};
  appointments.forEach((a) => {
    if (a.blocked) { if ((Number(a.duration) || 0) >= CLOSE_HOUR - OPEN_HOUR) closedByDate[a.date] = true; }
    else apptCountByDate[a.date] = (apptCountByDate[a.date] || 0) + 1;
  });
  const blockConflicts = (() => {
    const st0 = s.blockAllDay ? OPEN_HOUR : timeToHours(s.blockTime || '8:00');
    const du = s.blockAllDay ? CLOSE_HOUR - OPEN_HOUR : (s.blockDuration || 1);
    return appointments.filter((a) => !a.blocked && a.date === s.adminSelectedDate && overlaps(st0, du, timeToHours(a.time), Number(a.duration) || 0));
  })();

  return (
    <div style={st('height:100%;display:flex;flex-direction:column;position:relative;background:var(--porcelain)')}>

      {(s.screen === 'client-auth' || s.screen === 'login') && (
        <div className="aura-rise" style={st('flex:1;display:flex;flex-direction:column;padding:var(--top) 18px 30px;box-sizing:border-box;background:var(--porcelain);position:relative;overflow:hidden')}>
          <Glow style={{ top: -60, left: -60, right: 'auto' }} />
          <div style={{ textAlign: 'center', marginTop: 14, position: 'relative' }}>
            <div style={st(T.serif + ';font-size:2rem;letter-spacing:.04em;line-height:1.2')}>Aura Nails</div>
            <Lbl style={{ marginTop: 4 }}>Nechtové štúdio · Handlová</Lbl>
          </div>
          <div style={{ marginTop: 18 }}>
            <Seg items={[{ id: 'login', label: 'Prihlásenie' }, { id: 'register', label: 'Registrácia' }]} value={s.authMode} onChange={(v) => set({ authMode: v, authError: '', authInfo: '' })} />
          </div>
          <div style={{ display: 'grid', gap: 7, marginTop: 10 }}>
            {s.authMode === 'register' && (
              <React.Fragment>
                <div style={{ display: 'flex', gap: 7 }}>
                  <input value={s.authFirstName} onChange={(e) => set({ authFirstName: e.target.value })} placeholder="Meno" autoComplete="given-name" style={st(T.inp)} />
                  <input value={s.authLastName} onChange={(e) => set({ authLastName: e.target.value })} placeholder="Priezvisko" autoComplete="family-name" style={st(T.inp)} />
                </div>
                <input value={s.authPhone} onChange={(e) => set({ authPhone: e.target.value })} placeholder="Mobilné číslo" type="tel" autoComplete="tel" style={st(T.inp)} />
              </React.Fragment>
            )}
            <input value={s.authEmail} onChange={(e) => set({ authEmail: e.target.value })} placeholder="Email" type="email" autoComplete="email" style={st(T.inp)} />
            <input value={s.authPassword} onChange={(e) => set({ authPassword: e.target.value })} placeholder="Heslo" type="password" autoComplete={s.authMode === 'login' ? 'current-password' : 'new-password'} style={st(T.inp)} />
          </div>
          {s.authMode === 'register' && <div style={st(T.mut + ';font-size:.64rem;margin-top:6px')}>Mobil potrebujeme, aby vás Michaela vedela kontaktovať pri zmene termínu.</div>}
          {s.authError && <div style={{ marginTop: 10 }}><Note tone="danger">{s.authError}</Note></div>}
          {s.authInfo && <div style={{ marginTop: 10 }}><Note tone="ok" icon="check">{s.authInfo}</Note></div>}
          <div style={{ marginTop: 14 }}><Btn full style={{ padding: 13 }} onClick={s.authMode === 'login' ? doClientLogin : doClientRegister}>{s.authMode === 'login' ? 'Prihlásiť sa' : 'Vytvoriť účet'}</Btn></div>
          {s.authMode === 'login' && <button type="button" onClick={doForgotPassword} style={st('all:unset;cursor:pointer;text-align:center;margin-top:12px;font-family:var(--font-sans);font-size:.72rem;color:var(--ink-3)')}>Zabudli ste heslo?</button>}
          <div style={st(T.mut + ';text-align:center;margin-top:10px')}>Ste Michaela? <button type="button" onClick={goAdminAuth} style={st('all:unset;cursor:pointer;color:var(--espresso)')}>Vstup pre admin</button></div>
        </div>
      )}

      {s.screen === 'admin-auth' && (
        <div style={st('flex:1;display:flex;flex-direction:column;padding:76px 30px 40px;box-sizing:border-box;background:var(--porcelain)')}>
          <button onClick={backToEntry} style={st('all:unset;cursor:pointer;display:flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--mocha);font-size:.76rem;letter-spacing:.1em;text-transform:uppercase')}><span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={13} /></span>Späť</button>
          <div style={st('display:flex;flex-direction:column;align-items:center;margin-bottom:28px')}>
            <img src="assets/aura-mark-gold.svg" alt="" style={{ width: 44, height: 44, marginBottom: 12 }} />
            <div style={st('font-family:var(--font-display);font-size:1.4rem;color:var(--ink)')}>Prihlásenie — Michaela</div>
          </div>
          <input value={s.authEmail} onChange={(e) => set({ authEmail: e.target.value })} placeholder="Email" type="email" style={st(T.inp + ';margin-bottom:8px')} />
          <input value={s.authPassword} onChange={(e) => set({ authPassword: e.target.value })} placeholder="Heslo" type="password" style={st(T.inp + ';margin-bottom:8px')} />
          {s.authError && <p style={{ color: 'var(--danger)', fontFamily: 'var(--font-sans)', fontSize: '.8rem', margin: '0 0 12px', lineHeight: 1.5 }}>{s.authError}</p>}
          <button onClick={doAdminLogin} style={st('all:unset;cursor:pointer;display:block;width:100%;box-sizing:border-box;text-align:center;padding:15px;border-radius:999px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.76rem;letter-spacing:.16em;text-transform:uppercase;margin-top:6px;box-shadow:var(--shadow-md)')}>Prihlásiť sa</button>
          <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.72rem;color:var(--ink-3);text-align:center;margin-top:24px;line-height:1.6')}>Účet pre admin prístup zakladá majiteľ appky ručne vo Firebase konzole.</p>
        </div>
      )}

      {atClient && (
        <div style={st('flex:1;display:flex;flex-direction:column;min-height:100%;position:relative;overflow:hidden')}>
          {(tabHome || tabPass) && <Glow style={tabPass ? { top: 160, left: -120, right: 'auto' } : null} />}

          {/* ---------- notifikácie (vlastný panel v štýle Espresso Night) ---------- */}
          {s.notifOpen && (
            <div onClick={() => set({ notifOpen: false })} style={st('position:fixed;inset:0;z-index:70;background:rgba(5,3,3,.6);display:flex;justify-content:center;align-items:flex-end')}>
              <div onClick={(e) => e.stopPropagation()} style={st('width:100%;max-width:282px;max-height:78vh;overflow:auto;box-sizing:border-box;padding:16px 18px calc(22px + env(safe-area-inset-bottom));background:var(--white);border-radius:24px 24px 0 0;border-top:1px solid var(--beige)')}>
                <div style={st('width:36px;height:4px;border-radius:2px;background:var(--taupe);margin:-4px auto 14px')}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={st(T.serif + ';font-size:1.3rem')}>Upozornenia</span>
                  <span style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {clientUnreadCount > 0 && <button type="button" onClick={() => clientNotifMgr && clientNotifMgr.markAllAsRead()} style={st('all:unset;cursor:pointer;font-family:var(--font-sans);font-size:.68rem;color:var(--espresso)')}>Označiť všetky</button>}
                    <button type="button" aria-label="Zavrieť" onClick={() => set({ notifOpen: false })} style={st('all:unset;cursor:pointer;color:var(--ink-3)')}><Icon name="x" size={18} /></button>
                  </span>
                </div>
                {(clientNotifs || []).length === 0 && <div style={st(T.mut + ';text-align:center;padding:30px 0')}>Zatiaľ žiadne upozornenia.</div>}
                {(clientNotifs || []).map((n) => (
                  <ListRow key={n.id} icon={n.type === 'reschedule' ? 'swap' : n.type === 'confirmation' ? 'check' : 'bell'} title={n.title} sub={n.message}
                    accent={n.read ? null : 'var(--taupe)'}
                    onClick={() => clientNotifMgr && !n.read && clientNotifMgr.markAsRead(n.id)}
                    right={!n.read ? <i style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--espresso)', flexShrink: 0 }}></i> : <button type="button" aria-label="Zmazať" onClick={(e) => { e.stopPropagation(); clientNotifMgr && clientNotifMgr.deleteNotification(n.id); }} style={st('all:unset;cursor:pointer;color:var(--ink-3)')}><Icon name="x" size={14} /></button>} />
                ))}
              </div>
            </div>
          )}

          {/* ===================== DOMOV ===================== */}
          {tabHome && (
            <div className="aura-rise" style={st(T.page + ';padding-top:var(--top);position:relative')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Lbl>Aura Nails · Handlová</Lbl>
                <Sq icon="bell" size={32} round onClick={() => set({ notifOpen: true })} badge={clientUnreadCount || null} label="Upozornenia" />
              </div>
              <div style={st(T.serif + ';font-size:1.7rem;line-height:1.1;margin:6px 0 14px')}>{greetWord},<br /><em style={{ color: 'var(--espresso)' }}>{firstName}.</em></div>

              {myProposals.map((r) => (
                <div key={r.id} className="aura-rise" style={st('position:relative;overflow:hidden;border-radius:22px;padding:18px;background:var(--hero);border:1px solid #6B5230;box-shadow:var(--shadow-lg);margin-bottom:12px')}>
                  <Lbl style={{ color: 'var(--wait)' }}>Michaela navrhuje iný termín</Lbl>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: 'var(--font-sans)', fontSize: '.76rem' }}>
                    <span style={{ color: 'var(--ink-3)' }}>Vaša žiadosť</span><span style={{ color: 'var(--ink-3)', textDecoration: 'line-through' }}>{r.oldLabel}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.72rem', color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>Nový návrh</span>
                    <span style={st(T.serif + ';font-size:1.15rem;white-space:nowrap')}>{r.newLabel}</span>
                  </div>
                  <div style={st(T.mut + ';text-align:right;margin-top:2px')}>{r.service}</div>
                  {r.proposal.message && (
                    <div style={st('margin-top:10px;padding:9px 12px;border-radius:16px 16px 16px 5px;background:#1B1311;border:1px solid var(--sand);font-family:var(--font-sans);font-size:.78rem;line-height:1.45;color:var(--ink)')}>
                      „{r.proposal.message}“<div style={st(T.mut + ';margin-top:3px')}>— Michaela</div>
                    </div>
                  )}
                  <div style={{ marginTop: 12, position: 'relative', zIndex: 1 }}><Btn full icon="check" onClick={r.accept}>Súhlasím</Btn></div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, position: 'relative', zIndex: 1 }}>
                    <Btn kind="ghost" small style={{ flex: 1, padding: 10 }} onClick={() => r.decline(true)}>Vybrať iný čas</Btn>
                    <Btn kind="red" small style={{ flex: 1, padding: 10 }} onClick={() => r.decline(false)}>Odmietnuť</Btn>
                  </div>
                  <div style={st(T.mut + ';text-align:center;margin-top:10px;font-size:.66rem')}>Návrh platí do {r.deadline}</div>
                </div>
              ))}

              {clientMissingPhone && (
                <ListRow icon="phone" title="Doplňte prosím mobilné číslo" sub="Aby vás Michaela mohla kontaktovať pri zmene termínu." onClick={goProfile} accent="#5A4322" chevron />
              )}

              {upcomingAppts.length > 0 ? (
                <div style={st('position:relative;overflow:hidden;margin-top:12px;padding:18px;border-radius:22px;background:var(--hero);border:1px solid #4A322B;box-shadow:var(--shadow-lg)')}>
                  <Lbl gold>Váš najbližší termín</Lbl>
                  <div style={st(T.serif + ';font-size:1.45rem;margin:6px 0 2px')}>{shortDate(upcomingAppts[0].iso)} · {upcomingAppts[0].time}</div>
                  <div style={st(T.mut)}>{upcomingAppts[0].service}{upcomingAppts[0].duration ? ` · ${formatDuration(upcomingAppts[0].duration)}` : ''}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 14 }}>
                    <span style={st(upcomingAppts[0].badgeStyle)}>{upcomingAppts[0].badgeLabel}</span>
                    <span style={st(T.mut)}>{daysLabel(upcomingAppts[0].iso)}</span>
                  </div>
                </div>
              ) : (
                <div style={st('margin-top:12px;padding:18px;border-radius:22px;background:var(--hero);border:1px solid #4A322B')}>
                  <Lbl gold>Zatiaľ bez termínu</Lbl>
                  <div style={st(T.serif + ';font-size:1.3rem;margin:6px 0 2px')}>Doprajte si chvíľu pre seba</div>
                  <div style={st(T.mut)}>Voľné termíny nájdete v rezervácii.</div>
                </div>
              )}
              <div style={{ marginTop: 10 }}><Btn full icon="cal" onClick={goBooking} style={{ padding: 13 }}>Rezervovať termín</Btn></div>

              <Lbl style={{ marginTop: 14 }}>Nedávne</Lbl>
              {isBirthdayToday && <ListRow icon="gift" title="Darček od Aura Nails" sub="10 % zľava k narodeninám" />}
              <ListRow icon="star" title="Aura Pass" sub={`Máte ${clientStamps} z 5 pečiatok`} onClick={goPass} />
            </div>
          )}

          {/* ===================== REZERVÁCIA ===================== */}
          {tabBooking && (
            <div className="aura-rise" style={st(T.page + ';padding-top:var(--top);padding-bottom:150px')}>
              {b.done ? (
                <div style={{ textAlign: 'center', position: 'relative' }}>
                  <Glow style={{ top: 0, left: 20, right: 'auto' }} />
                  <div style={st('width:84px;height:84px;border-radius:50%;margin:24px auto 16px;display:grid;place-items:center;background:radial-gradient(circle,#D9B99B,#9A7558);color:#17100F;box-shadow:0 0 0 10px rgba(217,185,155,.12),0 0 0 22px rgba(217,185,155,.06)')}><Icon name="check" size={38} strokeWidth={2} /></div>
                  <div style={st(T.serif + ';font-size:1.7rem')}>Žiadosť <em style={{ color: 'var(--espresso)' }}>odoslaná</em></div>
                  <p style={st(T.mut + ';font-size:.8rem;margin:8px 16px 0')}>Michaela ju potvrdí čo najskôr. Dáme vám vedieť notifikáciou aj e-mailom.</p>
                  <div style={st(T.card + ';margin-top:18px;text-align:left')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', fontFamily: 'var(--font-sans)' }}><span style={{ color: 'var(--ink-3)' }}>Termín</span><span style={{ color: 'var(--ink)' }}>{booking_selectedDate} · {b.time}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: '.8rem', fontFamily: 'var(--font-sans)', marginTop: 8 }}><span style={{ color: 'var(--ink-3)' }}>Služby</span><span style={{ color: 'var(--ink)', textAlign: 'right' }}>{booking_selectedService}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', fontFamily: 'var(--font-sans)', marginTop: 8 }}><span style={{ color: 'var(--ink-3)' }}>Spolu</span><span style={{ color: 'var(--espresso)' }}>{booking_priceLabel} · {booking_durationLabel}</span></div>
                  </div>
                  <ListRow icon="star" title={<span>Po návšteve získate <span style={{ color: 'var(--espresso)' }}>+1 pečiatku</span></span>} />
                  <div style={{ display: 'grid', gap: 8, marginTop: 18 }}>
                    <Btn full onClick={downloadIcs} icon="cal">Pridať do kalendára</Btn>
                    <Btn full kind="ghost" onClick={() => { resetBooking(); goHome(); }}>Späť domov</Btn>
                  </div>
                </div>
              ) : (
                <React.Fragment>
                  {step0 ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.8rem', color: 'var(--ink)' }}>Nová rezervácia</span>
                      <span style={st(T.mut)}>1 / 3</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button type="button" aria-label="Späť" onClick={prevStep} style={st('all:unset;cursor:pointer;color:var(--ink)')}><Icon name="back" size={20} /></button>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.8rem', color: 'var(--ink)' }}>{step1 ? 'Vyberte termín' : 'Zhrnutie'}</span>
                      <span style={st(T.mut)}>{b.step + 1} / 3</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    {[0, 1, 2].map((i) => <i key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i <= b.step ? 'var(--espresso)' : 'rgba(255,255,255,.15)' }}></i>)}
                  </div>

                  {step0 && (
                    <React.Fragment>
                      <Lbl style={{ marginTop: 14 }}>Vyberte službu</Lbl>
                      {cennikMainByCat.length === 0 && <div style={{ marginTop: 10 }}><div className="aura-sk" style={{ height: 40 }}></div><div className="aura-sk" style={{ height: 58, marginTop: 8 }}></div><div className="aura-sk" style={{ height: 58, marginTop: 8 }}></div></div>}
                      {cennikMainByCat.length > 0 && (
                        <div style={{ margin: '6px 0 0' }}>
                          <Seg items={cennikMainByCat.map((c, i) => ({ id: i, label: shortCat(c.name) }))} value={bookCatPos} onChange={(i) => setBooking({ catTab: i })} />
                        </div>
                      )}
                      {cennikMainByCat[bookCatPos] && cennikMainByCat[bookCatPos].items.map((m) => {
                        const on = !!(bookingMain && bookingMain.key === m.key);
                        return (
                          <button type="button" key={m.key} onClick={() => (on ? setBooking({ catIdx: null, itemIdx: null, addons: [], time: null }) : pickBookingService(m))} style={st(`all:unset;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px;width:100%;box-sizing:border-box;padding:11px 12px;margin-top:7px;border-radius:16px;background:${on ? '#2C1F1B' : 'var(--white)'};border:1px solid ${on ? 'var(--espresso)' : 'var(--sand)'}`)}>
                            <span style={{ minWidth: 0, textAlign: 'left' }}>
                              <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '.78rem', color: 'var(--ink)' }}>{m.label}</span>
                              <span style={st(T.mut)}>{formatDuration(m.duration)}</span>
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, fontFamily: 'var(--font-sans)', fontSize: '.78rem', color: 'var(--ink)' }}>
                              {m.price}
                              <span style={st(`width:20px;height:20px;border-radius:6px;display:grid;place-items:center;border:1.5px solid ${on ? 'var(--espresso)' : '#5A443B'};background:${on ? 'var(--espresso)' : 'transparent'};color:var(--porcelain)`)}>{on && <Icon name="check" size={13} strokeWidth={2.4} />}</span>
                            </span>
                          </button>
                        );
                      })}
                      {bookingMain && cennikAddons.length > 0 && (
                        <React.Fragment>
                          <Lbl style={{ marginTop: 14 }}>Doplnky <span style={{ textTransform: 'none', letterSpacing: 0 }}>· nepovinné</span></Lbl>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                            {cennikAddons.map((a) => {
                              const on = (b.addons || []).indexOf(a.key) !== -1;
                              return (
                                <button type="button" key={a.key} onClick={() => toggleBookingAddon(a.key)} style={st(`all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:5px;padding:7px 11px;border-radius:99px;font-family:var(--font-sans);font-size:.64rem;background:${on ? 'var(--espresso)' : 'transparent'};color:${on ? 'var(--porcelain)' : 'var(--ink)'};border:1px solid ${on ? 'var(--espresso)' : 'var(--taupe)'}`)}>
                                  {on && <Icon name="check" size={11} strokeWidth={2.2} />}{shortAddon(a.label)} +{a.price}
                                </button>
                              );
                            })}
                          </div>
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )}

                  {step1 && (
                    <React.Fragment>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
                        <span style={st(T.serif + ';font-size:1.15rem')}>{visibleMonthLabel}</span>
                        <span style={{ display: 'flex', gap: 6 }}>
                          <button type="button" aria-label="Predchádzajúce dni" disabled={bookingDayPage === 0} onClick={() => setBooking({ dayPage: Math.max(0, bookingDayPage - 1) })} style={st(`all:unset;cursor:pointer;width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:var(--sand);color:var(--espresso);opacity:${bookingDayPage === 0 ? 0.35 : 1}`)}><Icon name="back" size={15} /></button>
                          <button type="button" aria-label="Ďalšie dni" disabled={bookingDayPage >= maxDayPage} onClick={() => setBooking({ dayPage: Math.min(maxDayPage, bookingDayPage + 1) })} style={st(`all:unset;cursor:pointer;width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:var(--sand);color:var(--espresso);opacity:${bookingDayPage >= maxDayPage ? 0.35 : 1}`)}><Icon name="fwd" size={15} /></button>
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 10 }}>
                        {visibleDays.map((d) => {
                          const on = b.dateIso === d.iso;
                          return (
                            <button type="button" key={d.iso} disabled={d.full} onClick={d.select} style={st(`all:unset;cursor:${d.full ? 'not-allowed' : 'pointer'};text-align:center;padding:10px 0;border-radius:16px;font-family:var(--font-sans);font-size:.62rem;background:${on ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${on ? 'var(--espresso)' : 'var(--sand)'};color:${on ? '#3B2722' : 'var(--ink-3)'};opacity:${d.full ? 0.55 : 1}`)}>
                              {d.dow}
                              <b style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.45rem', lineHeight: 1.2, color: on ? '#17100F' : 'var(--ink)' }}>{d.num}</b>
                              <em style={{ fontStyle: 'normal', display: 'block', fontSize: '.56rem', marginTop: 2, color: on ? '#3B2722' : d.full ? 'var(--danger)' : '#7FB08A' }}>{d.full ? 'plné' : freeLabel(d.free)}</em>
                            </button>
                          );
                        })}
                      </div>
                      {b.dateIso ? (
                        <React.Fragment>
                          <Lbl style={{ marginTop: 16 }}>{booking_selectedDate} · voľné časy</Lbl>
                          {selectedDateFull && nearestAvailableDate && (
                            <div style={{ marginTop: 8 }}><Note tone="wait" icon="cal">Tento deň je plný. <button type="button" onClick={() => { nearestAvailableDate.select(); const idx = dateOptions.findIndex((x) => x.iso === nearestAvailableDate.iso); setBooking({ dateIso: nearestAvailableDate.iso, time: null, dayPage: Math.floor(idx / 4) }); }} style={st('all:unset;cursor:pointer;text-decoration:underline')}>Najbližší voľný: {nearestAvailableDate.dow} {nearestAvailableDate.num}. {nearestAvailableDate.mon}</button></Note></div>
                          )}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginTop: 10 }}>
                            {timeOptions.map((t) => {
                              const on = b.time === t.label;
                              return <button type="button" key={t.label} onClick={t.select} disabled={t.taken} style={st(`all:unset;cursor:${t.taken ? 'not-allowed' : 'pointer'};text-align:center;padding:11px 0;border-radius:12px;font-family:var(--font-sans);font-size:.82rem;border:1px solid ${on ? 'var(--ink)' : 'var(--sand)'};background:${on ? 'var(--ink)' : 'transparent'};color:${on ? '#17100F' : 'var(--ink)'};font-weight:${on ? 600 : 400};opacity:${t.taken ? 0.25 : 1};text-decoration:${t.taken ? 'line-through' : 'none'}`)}>{t.label}</button>;
                            })}
                          </div>
                        </React.Fragment>
                      ) : (
                        <div style={{ marginTop: 14 }}><Note tone="plain" icon="cal">Vyberte deň, potom sa zobrazia voľné časy.</Note></div>
                      )}
                      <div style={{ marginTop: 12 }}><Note tone="plain" icon="info">Zrušenie do 24 h pred termínom je spoplatnené 15 €.</Note></div>
                    </React.Fragment>
                  )}

                  {step2 && (
                    <React.Fragment>
                      <div style={st('position:relative;overflow:hidden;margin-top:18px;padding:18px;border-radius:22px;background:var(--hero);border:1px solid #4A322B')}>
                        <Lbl gold>Vaša rezervácia</Lbl>
                        <div style={st(T.serif + ';font-size:1.3rem;margin:8px 0 12px')}>{booking_selectedService}</div>
                        {bookingMain && [bookingMain, ...bookingAddons].map((it, i) => (
                          <div key={it.key} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', fontSize: '.78rem', marginTop: 5 }}><span style={{ color: 'var(--ink-3)' }}>{i === 0 ? it.label : '+ ' + it.label}</span><span style={{ color: 'var(--ink-2)' }}>{it.price}</span></div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', fontSize: '.8rem', marginTop: 10 }}><span style={{ color: 'var(--ink-3)' }}>Deň</span><span style={{ color: 'var(--ink)' }}>{booking_selectedDate}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', fontSize: '.8rem', marginTop: 6 }}><span style={{ color: 'var(--ink-3)' }}>Čas</span><span style={{ color: 'var(--ink)' }}>{b.time} · {booking_durationLabel}</span></div>
                        <div style={st('display:flex;justify-content:space-between;align-items:baseline;margin-top:12px;padding-top:12px;border-top:1px solid #4A322B')}><span style={st(T.mut)}>Cena spolu</span><span style={st(T.serif + ';font-size:1.25rem;color:var(--espresso)')}>{booking_priceLabel}</span></div>
                      </div>
                      <div style={{ marginTop: 10 }}><Note tone="plain" icon="info">Rezervácia je žiadosť – Michaela ju potvrdí a dáme vám vedieť. Zrušenie do 24 h pred termínom je spoplatnené 15 €.</Note></div>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </div>
          )}
          {tabBooking && !b.done && step0 && bookingMain && <SheetBar sub={bookingMain ? `${[bookingMain.label, ...bookingAddons.map((x) => shortAddon(x.label).toLowerCase())].join(' + ')} · ${booking_durationLabel}` : 'Vyberte službu'} price={bookingMain ? booking_priceLabel : '—'} action="Ďalej" onAction={nextStep} disabled={nextDisabled} />}
          {tabBooking && !b.done && step1 && <SheetBar sub={b.dateIso && b.time ? `${booking_selectedDate} · ${b.time} · ${booking_durationLabel}` : 'Vyberte deň a čas'} price={booking_priceLabel} action="Ďalej" onAction={nextStep} disabled={nextDisabled} />}
          {tabBooking && !b.done && step2 && <Sheet><Btn full onClick={submitBooking} style={{ padding: 14 }}>Odoslať rezerváciu</Btn></Sheet>}

          {/* ===================== AURA PASS ===================== */}
          {tabPass && (
            <div className="aura-rise" style={st(T.page + ';padding-top:var(--top);position:relative')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={st(T.serif + ';font-size:1.6rem')}>Aura Pass</span>
                <Sq icon="bell" size={34} round onClick={() => set({ notifOpen: true })} badge={clientUnreadCount || null} label="Upozornenia" />
              </div>
              <div style={st(T.mut)}>Vernostný program Aura Nails</div>
              <div style={st('position:relative;border-radius:22px;padding:18px;margin-top:14px;background:var(--wallet);border:1px solid #6B4A3E;box-shadow:var(--shadow-xl);overflow:hidden')}>
                <div className="aura-wallet-sheen"></div>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={st('font-family:var(--font-display);font-weight:400;font-size:1.05rem;letter-spacing:.08em;color:var(--ink)')}>AURA</span>
                  <Lbl gold>Pass · MF</Lbl>
                </div>
                <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, marginTop: 18 }}>
                  {[0, 1, 2, 3, 4].map((i) => {
                    const on = i < clientStamps; const last = i === 4;
                    return (
                      <i key={i} style={st(`aspect-ratio:1;border-radius:50%;display:grid;place-items:center;${on ? 'background:radial-gradient(circle at 35% 30%,#F0D9C2,#B8916F);color:#17100F;border:0' : 'border:1.5px dashed rgba(217,185,155,.4);color:var(--espresso)'}`)}>
                        {on ? <Icon name="check" size={15} strokeWidth={2.2} /> : last ? <Icon name="gift" size={16} /> : null}
                      </i>
                    );
                  })}
                </div>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 16 }}>
                  <span style={st(T.serif + ';font-size:1.7rem')}>{clientStamps}<span style={{ fontSize: '.9rem', color: 'var(--ink-3)' }}> / 5</span></span>
                  <Lbl>{loggedInClient ? loggedInClient.name : ''}</Lbl>
                </div>
              </div>
              <ListRow icon="gift" title="Darček" sub={clientStamps >= 5 ? 'Máte 5 pečiatok – pri ďalšej návšteve vás čaká odmena.' : `Ešte ${5 - clientStamps} ${5 - clientStamps === 1 ? 'návšteva' : 'návštevy'} do odmeny`} accent={clientStamps >= 5 ? 'var(--espresso)' : null} />
              <div style={st(T.card + ';margin-top:8px')}>
                <Lbl>Ako to funguje</Lbl>
                <p style={st(T.mut + ';font-size:.76rem;margin:6px 0 0;line-height:1.55')}>Za každú potvrdenú návštevu dostanete pečiatku. Pečiatky pridáva Michaela – nemusíte nič robiť. Po piatich vás čaká rituál so zľavou a malým darčekom.</p>
              </div>
            </div>
          )}

          {/* ===================== CENNÍK ===================== */}
          {tabPricing && (
            <div className="aura-rise" style={st(T.page + ';padding-top:var(--top)')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={st(T.serif + ';font-size:1.6rem')}>Cenník</span>
                <Sq icon="bell" size={34} round onClick={() => set({ notifOpen: true })} badge={clientUnreadCount || null} label="Upozornenia" />
              </div>
              {pricing.length > 0 && (
                <div style={{ margin: '10px 0' }}>
                  <Seg items={pricing.map((c, i) => ({ id: i, label: shortCat(c.name) }))} value={pricePos} onChange={(i) => set({ expandedCat: i })} />
                </div>
              )}
              {pricing[pricePos] && (
                <div style={st('background:var(--white);border:1px solid var(--sand);border-radius:18px;padding:4px 14px')}>
                  {(pricing[pricePos].items || []).map((it, j, arr) => (
                    <div key={j} style={st(`display:flex;justify-content:space-between;align-items:center;gap:10px;padding:11px 0;${j < arr.length - 1 ? 'border-bottom:1px solid var(--sand)' : ''}`)}>
                      <span style={{ minWidth: 0 }}>
                        <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '.82rem', color: 'var(--ink)' }}>{it.label}</span>
                        <span style={st(T.mut)}>{formatDuration(itemDuration(it))}{isAddonItem(it) ? ' · doplnok' : ''}</span>
                      </span>
                      <span style={st(T.serif + ';font-size:1.05rem;flex-shrink:0')}>{it.price}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={st(T.mut + ';font-size:.66rem;margin-top:10px')}>Každá služba zahŕňa konzultáciu, dokonalú hygienu a čas venovaný len vám. Záruka na modeláže 48 h, nevzťahuje sa na mechanické poškodenie.</div>
              <div style={{ marginTop: 14 }}><Btn full kind="ghost" icon="cal" onClick={goBooking}>Rezervovať termín</Btn></div>
            </div>
          )}

          {/* ===================== PROFIL ===================== */}
          {tabProfile && (
            <div className="aura-rise" style={st(T.page + ';padding-top:var(--top)')}>
              {s.profileView === 'main' && (
                <React.Fragment>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar name={loggedInClient ? loggedInClient.name : ''} size={50} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {s.nameEditOpen ? (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input value={s.nameEditValue} onChange={(e) => set({ nameEditValue: e.target.value })} style={st(T.inp + ';padding:8px 10px')} />
                          <Btn small onClick={saveEditName}>Uložiť</Btn>
                          <button type="button" aria-label="Zrušiť" onClick={cancelEditName} style={st('all:unset;cursor:pointer;color:var(--ink-3)')}><Icon name="x" size={16} /></button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={st(T.serif + ';font-size:1.2rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{loggedInClient ? loggedInClient.name : '—'}</span>
                          <button type="button" onClick={startEditName} aria-label="Upraviť meno" style={st('all:unset;cursor:pointer;color:var(--ink-3)')}><Icon name="edit" size={14} /></button>
                        </div>
                      )}
                      <div style={st(T.mut)}>{historyAppts.length} {historyAppts.length === 1 ? 'návšteva' : historyAppts.length >= 2 && historyAppts.length <= 4 ? 'návštevy' : 'návštev'}{historyRatedAvg ? ` · ${historyRatedAvg} ★ priemer` : ''}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <Seg items={[{ id: 'up', label: 'Nadchádzajúce' }, { id: 'hist', label: 'História' }, { id: 'data', label: 'Údaje' }]} value={s.profileSeg || 'up'} onChange={(v) => set({ profileSeg: v })} />
                  </div>

                  {(s.profileSeg || 'up') === 'up' && (
                    <React.Fragment>
                      {upcomingAppts.length === 0 && <div style={{ marginTop: 10 }}><Note tone="plain" icon="cal">Žiadne nadchádzajúce termíny.</Note></div>}
                      {upcomingAppts.map((a) => (
                        <div key={a.id} style={st(T.card + ';margin-top:8px')}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                            <span style={st(T.serif + ';font-size:1.05rem')}>{shortDate(a.iso)} · {a.time}</span>
                            <span style={st(a.badgeStyle)}>{a.badgeLabel}</span>
                          </div>
                          <div style={st(T.mut + ';margin-top:2px')}>{a.service}</div>
                          {a.mine && s.rescheduleApptId !== a.id && (
                            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                              <Btn kind="ghost" small icon="swap" style={{ flex: 1, padding: 9 }} onClick={() => openReschedule(a)}>Zmeniť termín</Btn>
                              <Btn kind="red" small style={{ flex: 1, padding: 9 }} onClick={() => cancelMyAppt(a.id)}>Zrušiť</Btn>
                            </div>
                          )}
                          {s.rescheduleApptId === a.id && (
                            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--sand)' }}>
                              <Lbl>Nový deň</Lbl>
                              <div style={st('display:flex;gap:6px;overflow-x:auto;padding:8px 0 4px')}>
                                {dates.map((d) => {
                                  const on = s.rescheduleDateIso === d.iso;
                                  return (
                                    <button type="button" key={d.iso} onClick={() => set({ rescheduleDateIso: d.iso })} style={st(`all:unset;cursor:pointer;flex-shrink:0;width:46px;text-align:center;padding:7px 0;border-radius:12px;font-family:var(--font-sans);font-size:.58rem;background:${on ? 'var(--espresso)' : 'var(--cream)'};color:${on ? '#3B2722' : 'var(--ink-3)'};border:1px solid ${on ? 'var(--espresso)' : 'var(--sand)'}`)}>
                                      {d.dow}<b style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.05rem', color: on ? '#17100F' : 'var(--ink)' }}>{d.num}</b>
                                    </button>
                                  );
                                })}
                              </div>
                              <Lbl style={{ marginTop: 8 }}>Čas</Lbl>
                              <input type="time" value={s.rescheduleTime} onChange={(e) => set({ rescheduleTime: e.target.value })} style={st(T.inp + ';margin-top:6px')} />
                              {rescheduleValidReason && <div style={{ marginTop: 8 }}><Note tone="danger">{rescheduleValidReason}</Note></div>}
                              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                                <Btn kind="ghost" small style={{ flex: 1, padding: 9 }} onClick={cancelReschedule}>Zrušiť</Btn>
                                <Btn small style={{ flex: 1, padding: 9 }} onClick={saveReschedule} disabled={!!rescheduleValidReason}>Uložiť</Btn>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </React.Fragment>
                  )}

                  {s.profileSeg === 'hist' && (
                    <React.Fragment>
                      {historyAppts.length === 0 && <div style={{ marginTop: 10 }}><Note tone="plain" icon="clock">Zatiaľ žiadna história.</Note></div>}
                      {historyAppts.map((h) => (
                        <div key={h.id} style={st(T.card + ';margin-top:8px;padding:11px 13px')}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                            <span style={{ minWidth: 0 }}><span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '.8rem', color: 'var(--ink)' }}>{h.service}</span><span style={st(T.mut)}>{h.date} · {h.time}</span></span>
                            <Stars value={h.rating} onRate={h.mine ? (n) => rateAppt(h.id, n) : null} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                            <span style={st(T.mut)}>{h.rating ? 'Ohodnotené' : h.mine ? 'Ohodnoťte návštevu' : ''}</span>
                            <button type="button" onClick={h.rebook} style={st('all:unset;cursor:pointer;font-family:var(--font-sans);font-size:.7rem;font-weight:600;color:var(--espresso)')}>Rezervovať znova →</button>
                          </div>
                        </div>
                      ))}
                    </React.Fragment>
                  )}

                  {s.profileSeg === 'data' && (
                    <React.Fragment>
                      <div style={st('display:flex;align-items:center;gap:12px;margin-top:8px;padding:10px 12px;background:var(--white);border-radius:18px;border:1px solid var(--sand)')}>
                        <Sq icon="cake" size={34} />
                        <label style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '.72rem', color: 'var(--ink-2)' }}>Dátum narodenia</span>
                          <input type="date" value={clientBirthday} onChange={setClientBirthday} style={st(T.inp + ';margin-top:5px;padding:8px 10px;font-size:.8rem;min-width:0;max-width:100%')} />
                        </label>
                      </div>
                      <div style={st(`display:flex;align-items:center;gap:12px;margin-top:8px;padding:10px 12px;background:var(--white);border-radius:18px;border:1px solid ${clientMissingPhone ? '#5A4322' : 'var(--sand)'}`)}>
                        <Sq icon="phone" size={34} />
                        <label style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '.72rem', color: 'var(--ink-2)' }}>Mobilné číslo</span>
                          <input key={loggedInClient ? loggedInClient.phone : ''} type="tel" inputMode="tel" autoComplete="tel" defaultValue={loggedInClient && loggedInClient.phone !== '—' ? loggedInClient.phone : ''} onBlur={saveClientPhone} placeholder="0915 123 456" style={st(T.inp + ';margin-top:5px;padding:8px 10px;font-size:.8rem;min-width:0;max-width:100%')} />
                        </label>
                      </div>
                    </React.Fragment>
                  )}

                  <ListRow icon="bell" title="Pripomienky a upozornenia" sub={`${remindDayBefore ? 'Deň vopred' : ''}${remindDayBefore && remindHoursBefore ? ' · ' : ''}${remindHoursBefore ? '2 h vopred' : ''}` || 'Vypnuté'} onClick={goReminders} chevron />
                  <div style={{ marginTop: 16 }}><Btn full kind="ghost" icon="logout" onClick={backToLogin}>Odhlásiť sa</Btn></div>
                </React.Fragment>
              )}

              {s.profileView === 'reminders' && (
                <React.Fragment>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button type="button" aria-label="Späť" onClick={backToProfile} style={st('all:unset;cursor:pointer;color:var(--ink)')}><Icon name="back" size={20} /></button>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.84rem', color: 'var(--ink)' }}>Pripomienky a upozornenia</span>
                    <span style={{ width: 20 }}></span>
                  </div>
                  <Lbl style={{ marginTop: 18 }}>Nastavenia</Lbl>
                  <ListRow icon="cal" title="Deň vopred" sub="E-mail + notifikácia" right={<Toggle on={remindDayBefore} onClick={toggleDayBefore} label="Deň vopred" />} />
                  <ListRow icon="clock" title="2 hodiny vopred" sub="Notifikácia" right={<Toggle on={remindHoursBefore} onClick={toggleHourBefore} label="2 hodiny vopred" />} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
                    <Lbl>Upozornenia</Lbl>
                    {clientUnreadCount > 0 && <button type="button" onClick={() => clientNotifMgr && clientNotifMgr.markAllAsRead()} style={st('all:unset;cursor:pointer;font-family:var(--font-sans);font-size:.66rem;color:var(--espresso)')}>Označiť všetky</button>}
                  </div>
                  {(clientNotifs || []).map((n) => (
                    <ListRow key={n.id} icon={n.type === 'reschedule' ? 'swap' : n.type === 'confirmation' ? 'check' : 'bell'} title={n.title} sub={n.message} accent={n.read ? null : 'var(--taupe)'} onClick={() => clientNotifMgr && !n.read && clientNotifMgr.markAsRead(n.id)} right={!n.read ? <i style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--espresso)', flexShrink: 0 }}></i> : null} />
                  ))}
                  {notifications.map((n, i) => (
                    <ListRow key={'l' + i} icon={n.icon === 'sparkle' ? 'star' : n.icon} title={n.title} sub={n.text} />
                  ))}
                </React.Fragment>
              )}
            </div>
          )}

          {!(tabBooking && !b.done && (bookingMain || !step0)) && (
            <TabBar items={[
              { icon: 'home', label: 'Domov', on: tabHome, onClick: goHome },
              { icon: 'cal', label: 'Rezervácia', on: tabBooking, onClick: goBooking },
              { icon: 'star', label: 'Pass', on: tabPass, onClick: goPass },
              { icon: 'tag', label: 'Cenník', on: tabPricing, onClick: goPricing },
              { icon: 'user', label: 'Profil', on: tabProfile, onClick: goProfile },
            ]} />
          )}
        </div>
      )}

      {atAdmin && (
        <div style={st('flex:1;display:flex;flex-direction:column;min-height:100%;position:relative;overflow:hidden;background:var(--porcelain)')}>
          {adminTabOverview && <Glow />}
          <div style={st('padding:var(--top) 18px 0;position:relative;z-index:2')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Lbl>{adminTabOverview ? `Admin · ${todayLongLabel}` : 'Michaela · Admin'}</Lbl>
              <Sq icon="logout" size={32} round onClick={backToLogin} color="var(--ink-3)" label="Odhlásiť sa" />
            </div>
            {adminTabOverview ? (
              <div style={st(T.serif + ';font-size:1.9rem;line-height:1.1;margin-top:4px')}>{greetWord},<br /><em style={{ color: 'var(--espresso)' }}>Michaela.</em></div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <span style={st(T.serif + ';font-size:1.6rem')}>
                  {adminHeaderMap[s.adminTab]}
                  {adminTabRequests && requests.length > 0 && <span style={{ fontSize: '1rem', color: 'var(--espresso)' }}> {requests.length}</span>}
                </span>
                {adminTabClients && clientsListView && !s.addFormOpen && <Btn small icon="plus" onClick={openAddClient}>Pridať</Btn>}
                {adminTabPricing && !s.addCatFormOpen && <Btn small kind="ghost" onClick={openAddCategory}>+ Nová kategória</Btn>}
              </div>
            )}
          </div>

          {/* ===================== PREHĽAD ===================== */}
          {adminTabOverview && (
            <div className="aura-rise" style={st(T.page + ';position:relative;z-index:1')}>
              {nextTodayAppt && (
                <div style={st('position:relative;overflow:hidden;margin-top:12px;padding:14px;border-radius:22px;background:var(--hero);border:1px solid #4A322B')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><Lbl gold>Dnes · {adminTodayCount} {adminTodayCount === 1 ? 'termín' : adminTodayCount >= 2 && adminTodayCount <= 4 ? 'termíny' : 'termínov'}</Lbl><span style={st(T.mut)}>{todayRangeLabel}</span></div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 10 }}>
                    <span style={st(T.serif + ';font-size:1.35rem')}>{nextTodayAppt.time}</span>
                    <span style={{ minWidth: 0 }}><span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '.8rem', color: 'var(--ink)' }}>{nextTodayAppt.name} · {nextTodayAppt.service}</span><span style={st(T.mut)}>{formatDuration(nextTodayAppt.duration)}{nextTodayAppt.priceLabel ? ` · ${nextTodayAppt.priceLabel}` : ''}</span></span>
                  </div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginTop: 10 }}>
                {[['Dnes', adminTodayCount, null, null], ['Žiadosti', adminPendingCount, 'var(--wait)', goRequests], ['Narodeniny', upcomingBirthdays.length, null, null]].map(([l, v, c, fn]) => (
                  <button type="button" key={l} onClick={fn || undefined} style={st(`all:unset;cursor:${fn ? 'pointer' : 'default'};box-sizing:border-box;padding:10px;border-radius:16px;background:var(--white);border:1px solid ${c && v ? '#5A4322' : 'var(--sand)'}`)}>
                    <span style={st(T.mut + ';font-size:.62rem;display:block')}>{l}</span>
                    <b style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '1.45rem', color: c && v ? c : 'var(--ink)', marginTop: 2 }}>{v}</b>
                  </button>
                ))}
              </div>
              {upcomingBirthdays.length > 0 && (
                <ListRow icon="cake" title={upcomingBirthdays[0].daysUntil === 0 ? 'Dnes má narodeniny' : upcomingBirthdays[0].daysUntil === 1 ? 'Zajtra má narodeniny' : `Narodeniny o ${upcomingBirthdays[0].daysUntil} dní`} sub={upcomingBirthdays.map((c) => c.name).join(', ')} />
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <span style={st(T.serif + ';font-size:1.1rem')}>{adminMonthGrid.label}</span>
                <span style={{ display: 'flex', gap: 5 }}>
                  <Sq icon="back" size={28} onClick={() => set({ adminMonthOffset: (s.adminMonthOffset || 0) - 1 })} label="Predchádzajúci mesiac" />
                  <Sq icon="fwd" size={28} onClick={() => set({ adminMonthOffset: (s.adminMonthOffset || 0) + 1 })} label="Ďalší mesiac" />
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginTop: 8, textAlign: 'center' }}>
                {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'].map((d) => <span key={d} style={st(T.mut + ';font-size:.58rem')}>{d}</span>)}
                {adminMonthGrid.weeks.map((week) => week.map((cell) => {
                  const n = apptCountByDate[cell.iso] || 0;
                  const closed = !!closedByDate[cell.iso];
                  const bg = cell.muted ? 'transparent' : closed ? 'repeating-linear-gradient(45deg,#2A1E1B 0 4px,#1F1715 4px 8px)' : '#1F1715';
                  const dots = cell.muted ? 0 : Math.min(n, 5);
                  return (
                    <button type="button" key={cell.iso} onClick={() => set({ adminSelectedDate: cell.iso, dayAddOpen: false, blockFormOpen: false })} style={st(`all:unset;cursor:pointer;height:38px;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-family:var(--font-sans);font-size:.74rem;font-weight:${cell.today ? 700 : 500};background:${bg};color:${cell.muted ? '#4A3A35' : 'var(--ink)'};outline:${cell.selected ? '2px solid var(--ink)' : cell.today ? '1px solid var(--espresso)' : 'none'};outline-offset:1px`)}>
                      <span style={{ lineHeight: 1 }}>{cell.num}</span>
                      <span style={{ display: 'flex', gap: 2, height: 4, alignItems: 'center' }}>
                        {Array.from({ length: dots }, (_, i) => <i key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--espresso)', display: 'block' }}></i>)}
                        {n > 5 && !cell.muted && <b style={{ fontSize: '.45rem', fontWeight: 700, color: 'var(--espresso)', lineHeight: 1 }}>+</b>}
                      </span>
                    </button>
                  );
                }))}
              </div>
              <div style={{ display: 'flex', gap: 9, alignItems: 'center', marginTop: 7, flexWrap: 'wrap' }}>
                <span style={st(T.mut + ';font-size:.58rem;display:flex;align-items:center;gap:3px')}><i style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--espresso)', display: 'inline-block' }}></i>1 bodka = 1 objednaná klientka</span>
                <span style={st(T.mut + ';font-size:.58rem;display:flex;align-items:center;gap:3px')}><i style={{ width: 10, height: 10, borderRadius: 3, background: 'repeating-linear-gradient(45deg,#2A1E1B 0 3px,#1F1715 3px 6px)', display: 'inline-block' }}></i>voľno</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                <Lbl>{calendarSelectedLabel}</Lbl>
                {!s.blockFormOpen && !s.dayAddOpen && (
                  <span style={{ display: 'flex', gap: 5 }}>
                    <Btn small icon="plus" onClick={openDayAdd}>Klientka</Btn>
                    <Btn small kind="ghost" icon="moon" onClick={openBlockForm}>Voľno</Btn>
                  </span>
                )}
              </div>

              {s.dayAddOpen && (
                <div style={st(T.card + ';margin-top:10px;border-color:var(--taupe)')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={st(T.serif + ';font-size:1.1rem')}>Pridať · {calendarSelectedLabel}</span>
                    <button type="button" aria-label="Zavrieť" onClick={cancelDayAdd} style={st('all:unset;cursor:pointer;color:var(--ink-3)')}><Icon name="x" size={18} /></button>
                  </div>
                  <Lbl>Klientka</Lbl>
                  {!dayAddName ? (
                    <React.Fragment>
                      <input value={s.dayAddQuery} onChange={(e) => set({ dayAddQuery: e.target.value })} placeholder="Meno klientky (stačia 3 písmená)" autoFocus style={st(T.inp + ';margin-top:6px')} />
                      {dayAddQ.length < 2 && clients.length > 0 && (
                        <React.Fragment>
                          <div style={st(T.mut + ';margin:10px 0 6px')}>Chodia najčastejšie</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {getFrequentClients().map((c) => (
                              <button type="button" key={c.id} onClick={() => pickDayAddClient(c)} style={st(chipStyle(false))}>{c.name}{c.visitCount ? ` · ${c.visitCount}×` : ''}</button>
                            ))}
                          </div>
                        </React.Fragment>
                      )}
                      {dayAddQ.length >= 2 && (
                        <div style={st('margin-top:6px;border-radius:12px;background:var(--cream);border:1px solid var(--sand);padding:2px 12px')}>
                          {dayAddMatches.map((c) => (
                            <button type="button" key={c.id} onClick={() => pickDayAddClient(c)} style={st('all:unset;cursor:pointer;display:flex;justify-content:space-between;width:100%;box-sizing:border-box;padding:9px 0;border-bottom:1px solid var(--sand);font-family:var(--font-sans);font-size:.8rem;color:var(--ink)')}>
                              <span>{c.name}</span><span style={{ color: 'var(--ink-3)' }}>{c.phone || '—'}</span>
                            </button>
                          ))}
                          <button type="button" onClick={pickDayAddNew} style={st('all:unset;cursor:pointer;display:block;width:100%;padding:9px 0;font-family:var(--font-sans);font-size:.8rem;color:var(--espresso)')}>+ {dayAddMatches.length ? 'Nie je medzi nimi – ' : ''}Nová klientka „{s.dayAddQuery.trim()}“</button>
                        </div>
                      )}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div style={st('display:flex;align-items:center;gap:10px;margin-top:6px;padding:10px 12px;border-radius:12px;background:var(--cream);border:1px solid var(--taupe)')}>
                        <Avatar name={dayAddName} size={32} />
                        <span style={{ flex: 1, minWidth: 0 }}><span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '.84rem', color: 'var(--ink)' }}>{dayAddName}</span><span style={st(T.mut)}>{dayAddIsNew ? 'nová klientka' : `${clientApptStats(dayAddPicked).visits}× u nás`}</span></span>
                        <button type="button" onClick={clearDayAddClient} style={st('all:unset;cursor:pointer;font-family:var(--font-sans);font-size:.7rem;color:var(--espresso)')}>Zmeniť</button>
                      </div>
                      {dayAddIsNew && <input value={s.dayAddNewPhone} onChange={(e) => set({ dayAddNewPhone: e.target.value })} placeholder="Telefón (nepovinné)" style={st(T.inp + ';margin-top:8px')} />}
                      <Lbl style={{ marginTop: 12 }}>Služba z cenníka</Lbl>
                      <div style={{ marginTop: 6 }}>
                        {cennikMainByCat.map((cat) => (
                          <div key={cat.ci} style={{ marginBottom: 8 }}>
                            <div style={st(T.mut + ';font-size:.6rem;margin-bottom:5px')}>{cat.name}</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                              {cat.items.map((m) => <button type="button" key={m.key} onClick={() => pickDayAddService(m)} style={st(chipStyle(dayAddMain && dayAddMain.key === m.key))}>{m.label} · {m.price}</button>)}
                            </div>
                          </div>
                        ))}
                        {dayAddMain && cennikAddons.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, margin: '4px 0 8px' }}>
                            {cennikAddons.map((a) => <button type="button" key={a.key} onClick={() => toggleDayAddAddon(a.key)} style={st(chipStyle((s.dayAddAddons || []).indexOf(a.key) !== -1))}>+ {a.label} · {a.price}</button>)}
                          </div>
                        )}
                      </div>
                      {dayAddMain && <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', fontSize: '.78rem', margin: '4px 0 10px' }}><span style={{ color: 'var(--ink-3)' }}>Spolu · {formatDuration(dayAddDuration)}</span><span style={st(T.serif + ';font-size:1.05rem')}>{formatPrice(dayAddPriceNum)}</span></div>}
                      <Lbl>Trvanie úkonu</Lbl>
                      <div style={{ marginTop: 8 }}><DurationField value={dayAddDuration} onChange={(v) => set({ dayAddDuration: v, dayAddTime: '' })} autoValue={dayAddMain ? dayAddAutoDuration : null} /></div>
                      <Lbl>Čas — voľné a obsadené</Lbl>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 5, margin: '8px 0 12px' }}>
                        {dayAddTimeOptions.map((t) => {
                          const on = s.dayAddTime === t.label;
                          return <button type="button" key={t.label} onClick={t.select} disabled={t.taken} style={st(`all:unset;cursor:${t.taken ? 'not-allowed' : 'pointer'};text-align:center;padding:9px 0;border-radius:12px;font-family:var(--font-sans);font-size:.76rem;border:1px solid ${on ? 'var(--ink)' : 'var(--sand)'};background:${on ? 'var(--ink)' : 'transparent'};color:${on ? '#17100F' : 'var(--ink)'};opacity:${t.taken ? 0.25 : 1};text-decoration:${t.taken ? 'line-through' : 'none'}`)}>{t.label}</button>;
                        })}
                      </div>
                    </React.Fragment>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <Btn kind="ghost" style={{ flex: 1 }} onClick={cancelDayAdd}>Zrušiť</Btn>
                    <Btn style={{ flex: 1.5 }} onClick={saveDayAdd} disabled={dayAddDisabled}>Uložiť termín</Btn>
                  </div>
                </div>
              )}

              {s.blockFormOpen && (
                <div style={st(T.card + ';margin-top:10px;border-color:var(--taupe)')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={st(T.serif + ';font-size:1.1rem')}>Voľno · {calendarSelectedLabel}</span>
                    <button type="button" aria-label="Zavrieť" onClick={cancelBlockForm} style={st('all:unset;cursor:pointer;color:var(--ink-3)')}><Icon name="x" size={18} /></button>
                  </div>
                  <Seg items={[{ id: 'all', label: 'Celý deň' }, { id: 'part', label: 'Konkrétny čas' }]} value={s.blockAllDay ? 'all' : 'part'} onChange={(v) => set({ blockAllDay: v === 'all' })} />
                  {!s.blockAllDay && (
                    <React.Fragment>
                      <Lbl style={{ marginTop: 12 }}>Od</Lbl>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                        {buildTimeOptions().map((t) => <button type="button" key={t} onClick={() => set({ blockTime: t })} style={st(blockTimePresetStyle(s.blockTime === t))}>{t}</button>)}
                      </div>
                      <Lbl style={{ marginTop: 12 }}>Trvanie</Lbl>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                        {DURATION_PRESETS.map((d) => <button type="button" key={d.val} onClick={() => set({ blockDuration: d.val })} style={st(blockTimePresetStyle(s.blockDuration === d.val))}>{d.label}</button>)}
                      </div>
                    </React.Fragment>
                  )}
                  <div style={{ marginTop: 12 }}>{blockConflicts.length === 0 ? <Note tone="ok" icon="check">V tomto čase nemáte žiadne termíny.</Note> : <Note tone="wait">V tomto čase máte {blockConflicts.length} {blockConflicts.length === 1 ? 'termín' : 'termíny'} – zostanú zapísané.</Note>}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <Btn kind="ghost" style={{ flex: 1 }} onClick={cancelBlockForm}>Zrušiť</Btn>
                    <Btn style={{ flex: 1.5 }} onClick={saveBlock}>Uložiť</Btn>
                  </div>
                </div>
              )}

              {noDayAppts && !s.dayAddOpen && <div style={{ marginTop: 10 }}><Note tone="plain" icon="cal">Žiadne termíny na tento deň.</Note></div>}
              {selectedDayAppts.map((ap) => (
                <div key={ap.id} style={{ display: 'flex', gap: 10, marginTop: 7 }}>
                  <span style={st(T.mut + ';width:40px;padding-top:10px;flex-shrink:0')}>{ap.time}</span>
                  <div style={st(`flex:1;min-width:0;display:flex;align-items:center;gap:8px;border-radius:14px;padding:9px 11px;background:var(--white);border-left:3px solid ${ap.blocked ? 'var(--taupe-dark)' : ap.hold ? 'var(--wait)' : ap.manual ? 'var(--wait)' : 'var(--espresso)'}`)}>
                    <button type="button" onClick={ap.open} style={st('all:unset;cursor:pointer;flex:1;min-width:0')}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '.78rem', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ap.blocked ? (ap.service || 'Voľno') : `${ap.name} · ${ap.service}`}</span>
                      <span style={st(T.mut + ';font-size:.66rem')}>{formatDuration(ap.duration)}{ap.priceLabel ? ` · ${ap.priceLabel}` : ''}</span>
                    </button>
                    <span style={st(ap.badgeStyle + ';font-size:.52rem;padding:3px 7px')}>{ap.badgeLabel}</span>
                    {!ap.blocked && !ap.hold && <button type="button" aria-label="Zmazať termín" onClick={() => cancelAppt(ap.id)} style={st('all:unset;cursor:pointer;color:var(--ink-3)')}><Icon name="x" size={14} /></button>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {adminTabRequests && (
            <div className="aura-rise" style={st(T.page + ';padding-top:12px')}>
              {waitingRequests.length > 0 && (
                <div style={st('display:flex;background:var(--white);border:1px solid var(--line);border-radius:14px;padding:4px;margin-bottom:14px')}>
                  {[['new', `Nové · ${newRequests.length}`], ['waiting', `Čaká na klientku · ${waitingRequests.length}`]].map(([id, label]) => {
                    const on = (id === 'waiting') === reqViewWaiting;
                    return <button key={id} onClick={() => set({ reqView: id, proposeFor: null })} style={st(`all:unset;cursor:pointer;flex:1;text-align:center;padding:9px 4px;border-radius:10px;font-family:var(--font-sans);font-size:.64rem;white-space:nowrap;color:${on ? 'var(--ink)' : 'var(--ink-3)'};background:${on ? 'var(--blush)' : 'transparent'}`)}>{label}</button>;
                  })}
                </div>
              )}
              {(noRequests || (!reqViewWaiting && newRequests.length === 0)) && (
                <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--ink-3)' }}>
                  <div style={st('width:64px;height:64px;margin:0 auto 16px;border-radius:22px;display:flex;align-items:center;justify-content:center;background:var(--white);border:1px solid var(--line-gold);color:var(--espresso)')}><Icon name="check" size={26} /></div>
                  <div style={st('font-family:var(--font-display);font-size:1.2rem;color:var(--ink);margin-bottom:8px')}>Žiadne čakajúce žiadosti</div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '.84rem' }}>Všetko je vybavené — skvelá práca.</p>
                </div>
              )}
              {adminRequestsList.map((r) => (
                <div key={r.id} className="aura-rise" style={st(`border-radius:18px;padding:16px;background:var(--white);border:1px solid ${r.pState === 'pending' || r.pState === 'accepted' ? 'rgba(229,184,110,.35)' : 'var(--line)'};margin-bottom:12px`)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 300, color: 'var(--ink)' }}>{r.name}</div>
                      <div style={{ fontSize: '.76rem', color: 'var(--ink-3)', marginTop: 2 }}>
                        {r.phone ? <a href={`tel:${normalizePhone(r.phone)}`} style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>{r.phone}</a> : 'bez telefónu'}
                      </div>
                    </div>
                    {r.pState === 'pending' ? <span style={st(badge('pending'))}>Čaká na klientku</span>
                      : r.pState === 'accepted' ? <span style={st(badge())}>Odsúhlasené</span>
                      : <span style={st(badge('pending'))}>Nová</span>}
                  </div>
                  {(r.items && r.items.length > 0) ? (
                    <div style={st('border-radius:12px;background:var(--cream);border:1px solid var(--line);padding:10px 12px;margin-bottom:10px')}>
                      {r.items.map((it, ii) => (
                        <div key={ii} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, padding: '3px 0' }}>
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.74rem', color: ii === 0 ? 'var(--ink)' : 'var(--ink-2)' }}>{ii === 0 ? it.label : '+ ' + it.label}</span>
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.72rem', color: 'var(--mocha)', flexShrink: 0 }}>{it.price}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6, paddingTop: 6, borderTop: '1px solid var(--line)' }}>
                        <span style={{ fontSize: '.66rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Spolu</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--ink)' }}>{r.priceLabel || '—'}</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '.76rem', color: 'var(--ink-2)', marginBottom: 4 }}>{r.service}</div>
                  )}

                  {(r.pState === 'pending' || r.pState === 'accepted') ? (
                    <React.Fragment>
                      <div style={st('border-radius:12px;background:var(--cream);border:1px solid var(--line);padding:10px 12px;margin-bottom:10px;font-family:var(--font-sans);font-size:.72rem')}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '2px 0' }}><span style={{ color: 'var(--ink-3)' }}>Pôvodne</span><span style={{ color: 'var(--ink-3)', textDecoration: 'line-through' }}>{r.dateLabel} · {r.time}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '2px 0' }}><span style={{ color: 'var(--ink-3)' }}>Navrhnuté</span><span style={{ color: 'var(--ink)' }}>{isoLabel(r.proposal.date)} · {r.proposal.time}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '2px 0' }}><span style={{ color: 'var(--ink-3)' }}>Platí ešte</span><span style={{ color: 'var(--wait)' }}>{r.pState === 'accepted' ? 'odsúhlasené – zapisujem…' : `${hoursLeft(r.proposal.expiresAt)} h (do ${fmtDeadline(r.proposal.expiresAt)})`}</span></div>
                        {r.proposal.message && <div style={{ marginTop: 6, color: 'var(--ink-2)', fontStyle: 'italic' }}>„{r.proposal.message}“</div>}
                      </div>
                      {r.pState === 'pending' && (
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button onClick={r.openPropose} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:9px;border-radius:14px;border:1px solid var(--line-gold);color:var(--ink-2);font-family:var(--font-sans);font-size:.62rem;letter-spacing:.06em;text-transform:uppercase')}>Zmeniť návrh</button>
                          <button onClick={r.withdraw} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:9px;border-radius:14px;border:1px solid rgba(229,156,142,.4);color:var(--danger);font-family:var(--font-sans);font-size:.62rem;letter-spacing:.06em;text-transform:uppercase')}>Stiahnuť návrh</button>
                        </div>
                      )}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div style={{ fontSize: '.74rem', color: 'var(--ink-2)', marginBottom: 10 }}>{r.dateLabel} · {r.time}</div>
                      {(r.pState === 'declined' || r.pState === 'expired') && (
                        <div style={st('display:flex;gap:8px;align-items:flex-start;border-radius:12px;padding:9px 11px;margin-bottom:10px;background:var(--wait-bg);color:var(--wait);font-family:var(--font-sans);font-size:.66rem;line-height:1.45')}>
                          <Icon name="clock" size={15} />
                          <span>{r.pState === 'expired'
                            ? `Klientka návrh (${isoLabel(r.proposal.date)} · ${r.proposal.time}) neodsúhlasila do ${PROPOSAL_HOURS} h – podržaný čas sa uvoľnil.`
                            : `Klientka odmietla návrh ${isoLabel(r.proposal.date)} · ${r.proposal.time}${r.proposal.rebook ? ' a vyberá si iný čas.' : '.'}`}</span>
                        </div>
                      )}
                      {r.conflict && !r.proposing && (
                        <div style={st('display:flex;gap:8px;align-items:flex-start;border-radius:12px;padding:9px 11px;margin-bottom:10px;background:var(--danger-bg);color:var(--danger);font-family:var(--font-sans);font-size:.66rem;line-height:1.45')}>
                          <Icon name="clock" size={15} />
                          <span>S trvaním {formatDuration(r.durationValue)} sa tento čas prekrýva s iným termínom alebo už prešiel. Zvážte zmenu termínu.</span>
                        </div>
                      )}
                      <div style={{ fontSize: '.66rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>Trvanie</div>
                      <DurationField value={r.durationValue} onChange={(v) => setRequestDuration(r.id, v)} autoValue={r.duration || null} />
                      {!r.proposing && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={r.reject} aria-label="Zamietnuť" style={st('all:unset;cursor:pointer;flex:0.8;text-align:center;padding:9px 4px;border-radius:14px;border:1px solid rgba(229,156,142,.4);color:var(--danger);font-family:var(--font-sans);font-size:.6rem;letter-spacing:.04em;text-transform:uppercase')}>Zamietnuť</button>
                          <button onClick={r.openPropose} style={st('all:unset;cursor:pointer;flex:1.1;text-align:center;padding:9px 4px;border-radius:14px;border:1px solid var(--line-gold);color:var(--ink);font-family:var(--font-sans);font-size:.6rem;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap')}>Zmeniť termín</button>
                          <button onClick={r.approve} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:9px 4px;border-radius:14px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.68rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase')}>Potvrdiť</button>
                        </div>
                      )}
                    </React.Fragment>
                  )}

                  {r.proposing && (
                    <div style={st('margin-top:12px;padding-top:14px;border-top:1px solid var(--line)')}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={st('font-family:var(--font-display);font-size:1rem;font-weight:300;color:var(--ink)')}>Navrhnúť iný termín</span>
                        <button onClick={r.closePropose} aria-label="Zavrieť" style={st('all:unset;cursor:pointer;color:var(--ink-3);font-size:1.2rem;line-height:1;padding:4px')}>×</button>
                      </div>
                      {!r.clientUid && (
                        <div style={st('border-radius:12px;padding:9px 11px;margin-bottom:10px;background:var(--wait-bg);color:var(--wait);font-family:var(--font-sans);font-size:.66rem;line-height:1.45')}>Klientka nemá účet v appke, návrh neuvidí. Lepšie jej zavolajte{r.phone ? ` (${r.phone})` : ''} a termín zapíšte ručne.</div>
                      )}
                      <div style={st('display:flex;gap:7px;overflow-x:auto;padding-bottom:6px;margin-bottom:10px')}>
                        {proposeDates.map((d) => {
                          const on = s.proposeDateIso === d.iso;
                          return (
                            <button key={d.iso} onClick={() => set({ proposeDateIso: d.iso, proposeTime: '' })} style={st(`all:unset;cursor:pointer;flex-shrink:0;width:42px;text-align:center;padding:6px 0;border-radius:12px;font-family:var(--font-sans);background:${on ? 'var(--espresso)' : 'var(--cream)'};color:${on ? 'var(--porcelain)' : 'var(--ink-2)'};border:1px solid ${on ? 'var(--espresso)' : 'var(--line)'}`)}>
                              <span style={{ display: 'block', fontSize: '.6rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>{d.dow}</span>
                              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>{d.num}</span>
                              <span style={{ display: 'block', fontSize: '.58rem' }}>{d.mon}</span>
                            </button>
                          );
                        })}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 12 }}>
                        {r.proposeTimes.map((t) => (
                          <button key={t.label} disabled={t.taken} onClick={() => !t.taken && set({ proposeTime: t.label })} style={st(`all:unset;cursor:${t.taken ? 'not-allowed' : 'pointer'};text-align:center;padding:7px 0;border-radius:10px;font-family:var(--font-sans);font-size:.66rem;color:${t.taken ? 'var(--ink-3)' : t.selected ? 'var(--porcelain)' : 'var(--ink)'};background:${t.selected ? 'var(--espresso)' : 'transparent'};border:1px solid ${t.selected ? 'var(--espresso)' : 'var(--line)'};opacity:${t.taken ? 0.35 : 1};text-decoration:${t.taken ? 'line-through' : 'none'}`)}>{t.label}</button>
                        ))}
                      </div>
                      <textarea value={s.proposeMsg} onChange={(e) => set({ proposeMsg: e.target.value })} placeholder="Správa pre klientku (nepovinné)" style={st('all:unset;display:block;width:100%;min-height:58px;box-sizing:border-box;padding:11px 13px;border-radius:12px;background:var(--cream);border:1px solid var(--line);color:var(--ink);font-family:var(--font-sans);font-size:.74rem;line-height:1.5;margin-bottom:10px')} />
                      <div style={st('display:flex;gap:8px;align-items:flex-start;font-family:var(--font-sans);font-size:.64rem;color:var(--ink-3);line-height:1.45;margin-bottom:12px')}>
                        <Icon name="clock" size={14} />
                        <span>Vybraný čas sa podrží {PROPOSAL_HOURS} h. Termín sa zapíše až keď ho klientka odsúhlasí.</span>
                      </div>
                      <button onClick={r.sendProposal} disabled={!s.proposeTime || s.proposeSending || !r.clientUid} style={st(`all:unset;cursor:${(!s.proposeTime || !r.clientUid) ? 'not-allowed' : 'pointer'};display:block;width:100%;box-sizing:border-box;text-align:center;padding:11px;border-radius:14px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.66rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;opacity:${(!s.proposeTime || s.proposeSending || !r.clientUid) ? 0.4 : 1}`)}>
                        {s.proposeSending ? 'Odosielam…' : s.proposeTime ? `Poslať návrh · ${isoLabel(s.proposeDateIso)} ${s.proposeTime}` : 'Vyberte nový čas'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ===================== KLIENTKY ===================== */}
          {adminTabClients && (
            <div className="aura-rise" style={st(T.page)}>
              {clientsListView && (
                <React.Fragment>
                  {s.addFormOpen && (
                    <div style={st(T.card + ';margin-top:10px;border-color:var(--taupe)')}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={st(T.serif + ';font-size:1.1rem')}>Nová klientka</span>
                        <button type="button" aria-label="Zavrieť" onClick={cancelAddClient} style={st('all:unset;cursor:pointer;color:var(--ink-3)')}><Icon name="x" size={18} /></button>
                      </div>
                      <input value={s.newClientName} onChange={(e) => set({ newClientName: e.target.value })} placeholder="Meno a priezvisko" style={st(T.inp)} />
                      <input value={s.newClientPhone} onChange={(e) => set({ newClientPhone: e.target.value })} placeholder="Telefónne číslo" style={st(T.inp + ';margin-top:7px')} />
                      <Lbl style={{ marginTop: 12 }}>Termín z kalendára (nepovinné)</Lbl>
                      <div style={st('display:flex;gap:6px;overflow-x:auto;padding:8px 0 4px')}>
                        {newClientDateOptions.map((d, i) => {
                          const on = s.newClientDateIso === d.iso;
                          return <button type="button" key={i} onClick={d.select} style={st(`all:unset;cursor:pointer;flex-shrink:0;width:46px;text-align:center;padding:7px 0;border-radius:12px;font-family:var(--font-sans);font-size:.58rem;background:${on ? 'var(--espresso)' : 'var(--cream)'};color:${on ? '#3B2722' : 'var(--ink-3)'};border:1px solid ${on ? 'var(--espresso)' : 'var(--sand)'}`)}>{d.dow}<b style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.05rem', color: on ? '#17100F' : 'var(--ink)' }}>{d.num}</b></button>;
                        })}
                      </div>
                      <input type="time" value={s.newClientTime} onChange={(e) => set({ newClientTime: e.target.value })} style={st(T.inp + ';margin-top:6px')} />
                      <Lbl style={{ marginTop: 12 }}>Služba z cenníka</Lbl>
                      <div style={{ marginTop: 6 }}>{renderServicePicker(s.newClientMainKey, s.newClientAddons, pickNewClientMain, toggleNewClientAddon)}</div>
                      {newClientPicked && <div style={st(T.mut + ';margin:2px 0 10px')}>Spolu {newClientPicked.priceLabel}</div>}
                      <Lbl>Trvanie úkonu</Lbl>
                      <div style={{ marginTop: 8 }}><DurationField value={s.newClientDuration} onChange={(v) => set({ newClientDuration: v })} autoValue={newClientPicked ? newClientPicked.duration : null} /></div>
                      <Note tone="plain">Vyplňte termín, ak si klientka dohodla čas telefonicky alebo osobne – obsadí to daný čas aj v rezervačnom kalendári appky.</Note>
                      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <Btn kind="ghost" style={{ flex: 1 }} onClick={cancelAddClient}>Zrušiť</Btn>
                        <Btn style={{ flex: 1.5 }} onClick={saveNewClient} disabled={saveDisabled}>Uložiť</Btn>
                      </div>
                    </div>
                  )}
                  <div style={st('display:flex;align-items:center;gap:8px;margin-top:12px;padding:0 12px;border-radius:12px;background:#1B1311;border:1px solid var(--sand);color:var(--ink-3)')}>
                    <Icon name="search" size={15} />
                    <input value={s.clientSearch} onChange={(e) => set({ clientSearch: e.target.value })} placeholder="Meno, e-mail alebo telefón" style={st('all:unset;flex:1;padding:11px 0;font-family:var(--font-sans);font-size:.82rem;color:var(--ink)')} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, gap: 8 }}>
                    <Lbl style={{ whiteSpace: 'nowrap' }}>{clients.length} {clients.length === 1 ? 'klientka' : clients.length >= 2 && clients.length <= 4 ? 'klientky' : 'klientok'}</Lbl>
                    <div style={{ width: 150 }}><Seg small items={[{ id: 'visits', label: 'Podľa návštev' }, { id: 'alpha', label: 'Abecedne' }]} value={s.clientSort === 'alpha' ? 'alpha' : 'visits'} onChange={(v) => set({ clientSort: v })} /></div>
                  </div>
                  {noSearchResults && <div style={{ marginTop: 10 }}><Note tone="plain" icon="search">Žiadna klientka nezodpovedá hľadaniu.</Note></div>}
                  {adminClientsListFiltered.map((c) => {
                    const bd = c.birthday ? daysUntilBirthday(c.birthday) : null;
                    return (
                      <div key={c.id} style={st('display:flex;align-items:center;gap:12px;margin-top:8px;padding:10px 12px;background:var(--white);border-radius:18px;border:1px solid var(--sand)')}>
                        <button type="button" onClick={c.open} style={st('all:unset;cursor:pointer;display:flex;align-items:center;gap:12px;flex:1;min-width:0')}>
                          <Avatar name={c.name} size={32} />
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-sans)', fontSize: '.76rem', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}{bd !== null && bd <= 7 && <span style={{ color: 'var(--espresso)' }}><Icon name="cake" size={12} /></span>}</span>
                            <span style={st(T.mut + ';font-size:.64rem;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{c.visitCount} {c.visitCount === 1 ? 'návšteva' : c.visitCount >= 2 && c.visitCount <= 4 ? 'návštevy' : 'návštev'}{bd === 0 ? ' · dnes narodeniny' : bd === 1 ? ' · zajtra narodeniny' : c.lastIso ? ` · ${isoLabel(c.lastIso)}` : ''}</span>
                          </span>
                          <span style={{ display: 'flex', gap: 2 }}>{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i < (c.stamps || 0) ? 'var(--espresso)' : '#4A3A35' }}></i>)}</span>
                        </button>
                        {c.phone && c.phone !== '—' && <a href={`tel:${normalizePhone(c.phone)}`} aria-label={`Zavolať ${c.name}`} style={{ textDecoration: 'none' }}><Sq icon="phone" size={30} round /></a>}
                      </div>
                    );
                  })}
                </React.Fragment>
              )}

              {!clientsListView && (
                <React.Fragment>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                    <button type="button" aria-label="Späť na klientky" onClick={backToClients} style={st('all:unset;cursor:pointer;color:var(--ink);display:flex;align-items:center;gap:4px;font-family:var(--font-sans);font-size:.74rem')}><Icon name="back" size={18} />Klientky</button>
                    <span style={{ display: 'flex', gap: 6 }}>
                      {selClient.phone && selClient.phone !== '—' && <a href={`tel:${normalizePhone(selClient.phone)}`} aria-label="Zavolať" style={{ textDecoration: 'none' }}><Sq icon="phone" size={32} /></a>}
                      <Sq icon="merge" size={32} onClick={openMergeForm} label="Zlúčiť s inou klientkou" />
                      <Sq icon="trash" size={32} color="var(--danger)" onClick={deleteClient} label="Zmazať klientku" />
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                    <Avatar name={selClient.name} size={48} />
                    <div style={{ minWidth: 0 }}>
                      <div style={st(T.serif + ';font-size:1.2rem')}>{selClient.name}</div>
                      <div style={st(T.mut)}>{clientApptStats(selClient).visits} návštev · {money(clientApptStats(selClient).spend)} · naposledy {computedLastVisit}</div>
                    </div>
                  </div>

                  <div style={st(T.card + ';margin-top:12px;padding:12px')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Lbl>Aura Pass</Lbl>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Sq icon="minus" size={28} onClick={removeStampSel} label="Odobrať pečiatku" />
                        <span style={st(T.serif + ';font-size:1.1rem')}>{selClient.stamps || 0}/5</span>
                        <Sq icon="plus" size={28} bg="var(--espresso)" color="#17100F" onClick={addStampSel} label="Pridať pečiatku" />
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i < (selClient.stamps || 0) ? 'var(--espresso)' : 'rgba(255,255,255,.12)' }}></i>)}</div>
                  </div>

                  <div style={st('display:flex;align-items:center;gap:12px;margin-top:8px;padding:10px 12px;background:var(--white);border-radius:18px;border:1px solid var(--sand)')}>
                    <Sq icon="cake" size={32} />
                    <label style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '.72rem', color: 'var(--ink-2)' }}>Dátum narodenia</span>
                      <input type="date" value={selClient.birthday || ''} onChange={updateClientBirthday} style={st(T.inp + ';margin-top:5px;padding:8px 10px;font-size:.8rem;min-width:0;max-width:100%')} />
                    </label>
                  </div>

                  <Lbl style={{ marginTop: 14 }}>Poznámky</Lbl>
                  <textarea value={selClient.notes || ''} onChange={updateClientNotes} placeholder="Farba, tvar, dĺžka, citlivosť, alergie, preferencie…" style={st(T.inp + ';margin-top:6px;min-height:80px;line-height:1.5;font-size:.78rem;color:#E4D4CC')}></textarea>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                    <Lbl>Termíny</Lbl>
                    {!s.apptFormOpen && <button type="button" onClick={openAddAppt} style={st('all:unset;cursor:pointer;font-family:var(--font-sans);font-size:.7rem;font-weight:600;color:var(--espresso)')}>+ Pridať termín</button>}
                  </div>
                  {selClientAppts.length === 0 && !s.apptFormOpen && <div style={{ marginTop: 6 }}><Note tone="plain" icon="cal">Žiadne termíny.</Note></div>}
                  {selClientAppts.map((a) => (
                    <div key={a.id} style={st('display:flex;align-items:center;gap:10px;margin-top:6px;padding:9px 11px;border-radius:14px;background:var(--white);border:1px solid var(--sand)')}>
                      <span style={{ flex: 1, minWidth: 0 }}><span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '.78rem', color: 'var(--ink)' }}>{shortDate(a.date)} · {a.time}</span><span style={st(T.mut)}>{a.service}</span></span>
                      <button type="button" aria-label="Upraviť termín" onClick={() => openEditAppt(a)} style={st('all:unset;cursor:pointer;color:var(--ink-3)')}><Icon name="edit" size={15} /></button>
                      <button type="button" aria-label="Zrušiť termín" onClick={() => cancelAppt(a.id)} style={st('all:unset;cursor:pointer;color:var(--danger)')}><Icon name="x" size={15} /></button>
                    </div>
                  ))}
                  {s.apptFormOpen && (
                    <div style={st(T.card + ';margin-top:10px;border-color:var(--taupe)')}>
                      <div style={st(T.serif + ';font-size:1.05rem;margin-bottom:8px')}>{s.apptEditingId ? 'Upraviť termín' : 'Nový termín'}</div>
                      <div style={st('display:flex;gap:6px;overflow-x:auto;padding:2px 0 6px')}>
                        {apptDateOptions.map((d, i) => {
                          const on = s.apptDateIso === d.iso;
                          return <button type="button" key={i} onClick={d.select} style={st(`all:unset;cursor:pointer;flex-shrink:0;width:46px;text-align:center;padding:7px 0;border-radius:12px;font-family:var(--font-sans);font-size:.58rem;background:${on ? 'var(--espresso)' : 'var(--cream)'};color:${on ? '#3B2722' : 'var(--ink-3)'};border:1px solid ${on ? 'var(--espresso)' : 'var(--sand)'}`)}>{d.dow}<b style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.05rem', color: on ? '#17100F' : 'var(--ink)' }}>{d.num}</b></button>;
                        })}
                      </div>
                      <input type="time" value={s.apptTime} onChange={(e) => set({ apptTime: e.target.value })} style={st(T.inp + ';margin-top:4px')} />
                      <Lbl style={{ marginTop: 12 }}>Služba z cenníka</Lbl>
                      {s.apptEditingId && !s.apptMainKey && s.apptService && <div style={{ marginTop: 6 }}><Note tone="wait">Pôvodne zapísané ako „{s.apptService}“ – nie je v cenníku. Vyberte službu nižšie, aby sedeli štatistiky.</Note></div>}
                      <div style={{ marginTop: 6 }}>{renderServicePicker(s.apptMainKey, s.apptAddons, pickApptMain, toggleApptAddon)}</div>
                      {apptPicked && <div style={st(T.mut + ';margin:2px 0 10px')}>Spolu {apptPicked.priceLabel}</div>}
                      <Lbl>Trvanie úkonu</Lbl>
                      <div style={{ marginTop: 8 }}><DurationField value={s.apptDuration} onChange={(v) => set({ apptDuration: v })} autoValue={apptPicked ? apptPicked.duration : null} /></div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Btn kind="ghost" style={{ flex: 1 }} onClick={cancelApptForm}>Zrušiť</Btn>
                        <Btn style={{ flex: 1.5 }} onClick={saveAppt} disabled={apptSaveDisabled}>Uložiť</Btn>
                      </div>
                    </div>
                  )}

                  <Lbl style={{ marginTop: 14 }}>História návštev</Lbl>
                  {selClientHistory.length === 0 && <div style={st(T.mut + ';margin-top:6px')}>Zatiaľ žiadna história.</div>}
                  {selClientHistory.map((h, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontFamily: 'var(--font-sans)', fontSize: '.76rem', marginTop: 7 }}><span style={{ color: 'var(--ink)' }}>{h.service}</span><span style={{ color: 'var(--ink-3)', flexShrink: 0 }}>{h.date}</span></div>
                  ))}

                  {s.mergeFormOpen && (
                    <div style={st(T.card + ';margin-top:14px;border-color:var(--taupe)')}>
                      <div style={st(T.serif + ';font-size:1.05rem')}>Zlúčiť duplicitný záznam</div>
                      <p style={st(T.mut + ';margin:4px 0 10px')}>Vyberte duplicitnú klientku – jej návštevy, pečiatky a história sa presunú sem a jej záznam sa zmaže.</p>
                      <input value={s.mergeSearchQuery} onChange={(e) => set({ mergeSearchQuery: e.target.value, mergeSourceId: null })} placeholder="Hľadať podľa mena alebo telefónu" style={st(T.inp)} />
                      <div style={{ maxHeight: 180, overflowY: 'auto', margin: '8px 0' }}>
                        {mergeCandidates.map((c) => (
                          <button type="button" key={c.id} onClick={() => set({ mergeSourceId: c.id })} style={st(`all:unset;cursor:pointer;display:flex;justify-content:space-between;width:100%;box-sizing:border-box;padding:9px 11px;border-radius:10px;margin-bottom:4px;font-family:var(--font-sans);font-size:.8rem;color:var(--ink);background:${s.mergeSourceId === c.id ? 'var(--cream)' : 'transparent'};border:1px solid ${s.mergeSourceId === c.id ? 'var(--taupe)' : 'transparent'}`)}><span>{c.name}</span><span style={{ color: 'var(--ink-3)' }}>{c.phone}</span></button>
                        ))}
                        {mergeCandidates.length === 0 && <div style={st(T.mut)}>Žiadne zhody.</div>}
                      </div>
                      {mergeBlocked && <Note tone="danger">{mergeSource.name} má prihlasovací účet (email) – jej zmazaním by stratila prístup do appky. Otvorte namiesto toho detail klientky {mergeSource.name} a zlúčte do nej tento záznam.</Note>}
                      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                        <Btn kind="ghost" style={{ flex: 1 }} onClick={cancelMergeForm}>Zrušiť</Btn>
                        <Btn style={{ flex: 1.5 }} onClick={confirmMerge} disabled={!mergeSource || mergeBlocked}>Zlúčiť</Btn>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              )}
            </div>
          )}

          {/* ===================== CENNÍK (úpravy) ===================== */}
          {adminTabPricing && (
            <div className="aura-rise" style={st(T.page)}>
              <div style={st(T.mut + ';margin-top:2px')}>Zmeny sa hneď zobrazia klientkam v appke.</div>
              {pricing.map((cat, ci) => (
                <div key={ci} style={st('background:var(--white);border:1px solid var(--sand);border-radius:18px;padding:4px 13px;margin-top:10px')}>
                  <div style={st('display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--sand)')}>
                    <span><span style={st(T.serif + ';font-size:1.05rem;display:block')}>{cat.name}</span>{cat.sub && <span style={st(T.mut + ';font-size:.64rem')}>{cat.sub}</span>}</span>
                    <button type="button" aria-label="Zmazať kategóriu" onClick={() => deletePricingCategory(ci)} style={st('all:unset;cursor:pointer;color:var(--ink-3)')}><Icon name="trash" size={15} /></button>
                  </div>
                  {(cat.items || []).map((it, ii) => (
                    s.editItemCatIndex === ci && s.editItemIndex === ii ? (
                      <div key={ii} style={{ padding: '10px 0', borderBottom: '1px solid var(--sand)' }}>
                        <input value={s.editItemLabel} onChange={(e) => set({ editItemLabel: e.target.value })} placeholder="Názov služby" style={st(T.inp + ';padding:9px 11px')} />
                        <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
                          <input value={s.editItemPrice} onChange={(e) => set({ editItemPrice: e.target.value })} placeholder="35 €" style={st(T.inp + ';padding:9px 11px;width:90px')} />
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', fontFamily: 'var(--font-sans)', fontSize: '.72rem', color: 'var(--ink-2)' }}><Toggle on={s.editItemAddon} onClick={() => set({ editItemAddon: !s.editItemAddon })} label="Doplnok" />Doplnok</span>
                        </div>
                        <div style={{ marginTop: 8 }}><DurationField value={parseDurationInput(s.editItemDuration)} onChange={(v) => set({ editItemDuration: String(v) })} /></div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Btn kind="ghost" small style={{ flex: 1, padding: 9 }} onClick={cancelEditItem}>Zrušiť</Btn>
                          <Btn small style={{ flex: 1, padding: 9 }} onClick={saveEditItem}>Uložiť</Btn>
                        </div>
                      </div>
                    ) : (
                      <div key={ii} style={st('display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--sand)')}>
                        <button type="button" onClick={() => openEditItem(ci, ii, it)} style={st('all:unset;cursor:pointer;flex:1;min-width:0')}>
                          <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '.8rem', color: 'var(--ink)' }}>{it.label}</span>
                          <span style={st(T.mut)}>{isAddonItem(it) ? 'doplnok · ' : ''}{formatDuration(itemDuration(it))}</span>
                        </button>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)', fontSize: '.8rem', color: 'var(--ink)' }}>
                          {it.price}
                          <button type="button" aria-label="Upraviť" onClick={() => openEditItem(ci, ii, it)} style={st('all:unset;cursor:pointer;color:var(--ink-3)')}><Icon name="edit" size={14} /></button>
                          <button type="button" aria-label="Zmazať" onClick={() => deletePricingItem(ci, ii)} style={st('all:unset;cursor:pointer;color:var(--ink-3)')}><Icon name="x" size={14} /></button>
                        </span>
                      </div>
                    )
                  ))}
                  {s.addItemCatIndex === ci ? (
                    <div style={{ padding: '10px 0' }}>
                      <input value={s.newItemLabel} onChange={(e) => set({ newItemLabel: e.target.value })} placeholder="Názov služby" style={st(T.inp + ';padding:9px 11px')} />
                      <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
                        <input value={s.newItemPrice} onChange={(e) => set({ newItemPrice: e.target.value })} placeholder="35 €" style={st(T.inp + ';padding:9px 11px;width:90px')} />
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', fontFamily: 'var(--font-sans)', fontSize: '.72rem', color: 'var(--ink-2)' }}><Toggle on={s.newItemAddon} onClick={() => set({ newItemAddon: !s.newItemAddon })} label="Doplnok" />Doplnok</span>
                      </div>
                      <div style={{ marginTop: 8 }}><DurationField value={parseDurationInput(s.newItemDuration)} onChange={(v) => set({ newItemDuration: String(v) })} /></div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Btn kind="ghost" small style={{ flex: 1, padding: 9 }} onClick={cancelAddItem}>Zrušiť</Btn>
                        <Btn small style={{ flex: 1, padding: 9 }} onClick={() => saveNewItem(ci)}>Uložiť</Btn>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={() => openAddItem(ci)} style={st('all:unset;cursor:pointer;display:block;padding:10px 0;font-family:var(--font-sans);font-size:.72rem;font-weight:600;color:var(--espresso)')}>+ Pridať službu</button>
                  )}
                </div>
              ))}
              {s.addCatFormOpen && (
                <div style={st(T.card + ';margin-top:10px;border-color:var(--taupe)')}>
                  <input value={s.newCatName} onChange={(e) => set({ newCatName: e.target.value })} placeholder="Názov kategórie (napr. Pedikúra)" style={st(T.inp)} />
                  <input value={s.newCatSub} onChange={(e) => set({ newCatSub: e.target.value })} placeholder="Podnadpis (nepovinné)" style={st(T.inp + ';margin-top:7px')} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <Btn kind="ghost" style={{ flex: 1 }} onClick={cancelAddCategory}>Zrušiť</Btn>
                    <Btn style={{ flex: 1.5 }} onClick={saveNewCategory}>Uložiť</Btn>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== ŠTATISTIKY ===================== */}
          {adminTabStats && (
            <div className="aura-rise" style={st(T.page)}>
              <div style={{ marginTop: 10 }}><Seg small items={STATS_PERIODS.map((p) => ({ id: p.id, label: p.label }))} value={s.statsPeriod} onChange={(v) => set({ statsPeriod: v })} /></div>
              <div style={st(T.mut + ';margin-top:6px;font-size:.66rem')}>{isoLabel(pFrom)} – {isoLabel(pTo)}</div>
              <div style={st('position:relative;overflow:hidden;margin-top:8px;padding:14px;border-radius:22px;background:var(--hero);border:1px solid #4A322B')}>
                <Lbl gold>Tržby (odrobené)</Lbl>
                <div style={st(T.serif + ';font-size:2rem;line-height:1.15;margin-top:4px')}>{money(revenueDone)}</div>
                {revenuePlanned > 0 && <div style={st(T.mut)}>+ {money(revenuePlanned)} objednané</div>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                {[['Termíny', periodDone.length, periodPlanned.length ? `+ ${periodPlanned.length} naplánovaných` : null, null], ['Priemer / návšteva', money(avgTicket), null, null], ['Odpracované', `${String(Math.round(hoursDone * 10) / 10).replace('.', ',')} h`, null, null], ['Vyťaženosť', pct(occupancyPeriod), 'bez voľna', 'var(--espresso)']].map(([l, v, sub, c]) => (
                  <div key={l} style={st(T.card + ';padding:12px')}>
                    <span style={st(T.mut + ';white-space:nowrap')}>{l}</span>
                    <b style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '1.5rem', lineHeight: 1.2, marginTop: 4, color: c || 'var(--ink)' }}>{v}</b>
                    {sub && <span style={st(T.mut + ';font-size:.6rem')}>{sub}</span>}
                  </div>
                ))}
              </div>
              <ListRow icon="users" title="Nové klientky" sub={`celkovo ${totalClientsCount}`} right={<span style={st(T.serif + ';font-size:1.3rem')}>{newClientsInPeriod}</span>} />
              <ListRow icon="cal" title="Obsadenosť najbližších 7 dní" right={<span style={st(T.serif + ';font-size:1.15rem')}>{pct(occupancyNext7)}</span>} />

              <Lbl style={{ marginTop: 18 }}>Tržby po mesiacoch</Lbl>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7, height: 96, marginTop: 10 }}>
                {monthlyRevenue.map((m, i) => {
                  const tot = m.done + m.planned;
                  const isLast = i === monthlyRevenue.length - 1;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                      <span style={st(T.mut + ';font-size:.54rem;margin-bottom:3px')}>{tot ? Math.round(tot) : ''}</span>
                      {m.planned > 0 && <div style={{ width: '100%', height: Math.max(2, (m.planned / monthlyMax) * 62), background: 'rgba(217,185,155,.35)', borderRadius: m.done ? '5px 5px 0 0' : '5px 5px 2px 2px' }}></div>}
                      <div style={{ width: '100%', height: Math.max(2, (m.done / monthlyMax) * 62), background: isLast ? '#D9B99B' : '#A47C60', borderRadius: m.planned ? '0 0 2px 2px' : '5px 5px 2px 2px', opacity: m.done ? 1 : 0.25 }}></div>
                      <span style={st(T.mut + `;font-size:.56rem;margin-top:3px;${isLast ? 'color:var(--espresso)' : ''}`)}>{String(m.label).split(" ")[0]}</span>
                    </div>
                  );
                })}
              </div>
              <div style={st(T.mut + ';font-size:.58rem;margin-top:4px')}>Plná časť odrobená, svetlá objednaná · ceny podľa cenníka</div>

              <Lbl style={{ marginTop: 18 }}>Najobľúbenejšie služby</Lbl>
              {topServices.length === 0 && <div style={st(T.mut + ';margin-top:6px')}>V tomto období zatiaľ žiadne dáta.</div>}
              {topServices.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontFamily: 'var(--font-sans)', fontSize: '.72rem' }}>
                  <span style={{ width: 110, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--ink)' }}>{t.label}</span>
                  <span style={{ flex: 1, height: 8, borderRadius: 4, background: 'rgba(255,255,255,.05)' }}><i style={{ display: 'block', height: 8, borderRadius: 4, width: `${Math.round((t.count / topServiceMax) * 100)}%`, background: 'var(--espresso)' }}></i></span>
                  <em style={{ fontStyle: 'normal', color: 'var(--ink-3)', fontSize: '.66rem', width: 62, textAlign: 'right' }}>{t.count}× · {money(t.revenue)}</em>
                </div>
              ))}
              {unspecifiedCount > 0 && <div style={st(T.mut + ';font-size:.62rem;margin-top:6px')}>Ďalších {unspecifiedCount} termínov je bez uvedenej služby.</div>}

              <Lbl style={{ marginTop: 18 }}>Najrušnejšie dni</Lbl>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginTop: 8 }}>
                {weekdayCounts.map((n, i) => {
                  const f = n / weekdayMax;
                  const bg = !n ? '#1F1715' : f > 0.8 ? '#D9B99B' : f > 0.55 ? '#A47C60' : f > 0.3 ? '#6B4A3B' : '#3A2A23';
                  return <div key={i} style={{ height: 40, borderRadius: 10, display: 'grid', placeItems: 'center', background: bg, color: f > 0.55 ? '#17100F' : 'var(--ink)', fontFamily: 'var(--font-sans)', fontSize: '.66rem', lineHeight: 1.2, textAlign: 'center' }}><span>{WEEKDAYS[i]}<br /><b style={{ fontWeight: 600 }}>{n || ''}</b></span></div>;
                })}
              </div>

              <Lbl style={{ marginTop: 18 }}>Najvernejšie klientky</Lbl>
              {topClients.length === 0 && <div style={st(T.mut + ';margin-top:6px')}>Zatiaľ žiadne dáta.</div>}
              {topClients.map((x) => (
                <button type="button" key={x.c.id} onClick={() => set({ adminTab: 'clients', selectedClientId: x.c.id })} style={st('all:unset;cursor:pointer;display:flex;align-items:center;gap:8px;width:100%;margin-top:8px;font-family:var(--font-sans);font-size:.72rem')}>
                  <span style={{ width: 110, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--ink)' }}>{x.c.name}</span>
                  <span style={{ flex: 1, height: 8, borderRadius: 4, background: 'rgba(255,255,255,.05)' }}><i style={{ display: 'block', height: 8, borderRadius: 4, width: `${Math.round((x.r.visits / Math.max(1, topClients[0].r.visits)) * 100)}%`, background: 'var(--espresso)' }}></i></span>
                  <em style={{ fontStyle: 'normal', color: 'var(--ink-3)', fontSize: '.66rem', width: 62, textAlign: 'right' }}>{x.r.visits}× · {money(x.r.spend)}</em>
                </button>
              ))}

              <Lbl style={{ marginTop: 18 }}>Dlho neboli <span style={{ textTransform: 'none', letterSpacing: 0 }}>· viac ako {LAPSED_DAYS / 7} týždňov</span></Lbl>
              {lapsedClients.length === 0 && <div style={st(T.mut + ';margin-top:6px')}>Všetky pravidelné klientky majú termín alebo boli nedávno.</div>}
              {lapsedClients.map((x) => (
                <div key={x.c.id} style={st('display:flex;align-items:center;gap:10px;margin-top:7px;padding:9px 12px;border-radius:16px;background:var(--white);border:1px solid var(--sand)')}>
                  <button type="button" onClick={() => set({ adminTab: 'clients', selectedClientId: x.c.id })} style={st('all:unset;cursor:pointer;flex:1;min-width:0')}>
                    <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '.78rem', color: 'var(--ink)' }}>{x.c.name}</span>
                    <span style={st(T.mut)}>naposledy {isoLabel(x.r.last)} · pred {Math.round(x.since / 7)} týž.</span>
                  </button>
                  {x.c.phone && x.c.phone !== '—' && <a href={`tel:${normalizePhone(x.c.phone)}`} style={st('display:inline-flex;align-items:center;gap:5px;padding:7px 10px;border-radius:14px;border:1px solid var(--taupe);color:var(--ink);font-family:var(--font-sans);font-size:.66rem;text-decoration:none')}><Icon name="phone" size={12} />Zavolať</a>}
                </div>
              ))}

              {unmatchedServices.length > 0 && (
                <React.Fragment>
                  <div style={{ marginTop: 18 }}><Note tone="wait">{unmatchedServices.length} {unmatchedServices.length === 1 ? 'starý názov služby nesedí' : 'staré názvy služieb nesedia'} s cenníkom, preto sa v štatistikách počítajú zvlášť. Vyberte, ktorej službe zodpovedajú – prepíšu sa vo všetkých termínoch.</Note></div>
                  {unmatchedServices.map(([raw, count]) => (
                    <div key={raw} style={st(T.card + ';margin-top:8px;padding:11px 12px')}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontFamily: 'var(--font-sans)', fontSize: '.8rem', color: 'var(--ink)' }}><span>„{raw}“</span><span style={{ color: 'var(--ink-3)' }}>{count}×</span></div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <select value={s.mapServiceSel[raw] || ''} onChange={(e) => set({ mapServiceSel: { ...s.mapServiceSel, [raw]: e.target.value } })} style={st(T.inp + ';flex:1;width:auto;padding:8px 10px;font-size:.76rem;appearance:auto;-webkit-appearance:menulist')}>
                          <option value="">Vyberte službu z cenníka…</option>
                          {cennikMainByCat.map((cat) => (
                            <optgroup key={cat.ci} label={cat.name}>
                              {cat.items.map((m) => <option key={m.key} value={m.key}>{m.label} · {m.price}</option>)}
                            </optgroup>
                          ))}
                        </select>
                        <Btn small onClick={() => remapService(raw)} disabled={!s.mapServiceSel[raw]}>Zjednotiť</Btn>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              )}

              <Lbl style={{ marginTop: 18 }}>Ostatné</Lbl>
              <ListRow icon="inbox" title="Čakajúce žiadosti" right={<span style={st(T.serif + ';font-size:1.1rem')}>{requests.length}</span>} onClick={goRequests} />
              <ListRow icon="star" title="Priemerné hodnotenie návštev" right={<span style={st(T.serif + ';font-size:1.05rem;color:var(--espresso)')}>{avgRating ? `${avgRating.toFixed(1).replace('.', ',')} ★` : '—'}</span>} sub={avgRating ? `${ratedAppts.length} hodnotení` : null} />
              <div style={{ marginTop: 12 }}><Btn full kind="ghost" icon="dl" onClick={exportClientsCsv}>Stiahnuť zálohu klientok (CSV)</Btn></div>
            </div>
          )}

          <TabBar items={[
            { icon: 'home', label: 'Prehľad', on: adminTabOverview, onClick: goOverview },
            { icon: 'inbox', label: 'Žiadosti', on: adminTabRequests, onClick: goRequests, badge: adminPendingCount || null },
            { icon: 'users', label: 'Klientky', on: adminTabClients, onClick: goClients },
            { icon: 'tag', label: 'Cenník', on: adminTabPricing, onClick: goPricingAdmin },
            { icon: 'chart', label: 'Štatistiky', on: adminTabStats, onClick: goStats },
          ]} />
        </div>
      )}

      {s.toast.visible && (
        <div style={st('position:fixed;left:50%;bottom:96px;transform:translateX(-50%);background:var(--ink);color:#17100F;padding:10px 18px;border-radius:999px;font-family:var(--font-sans);font-size:.76rem;font-weight:500;white-space:nowrap;box-shadow:var(--shadow-lg);z-index:80')}>{s.toast.msg}</div>
      )}

      {/* Chatbot Aura — len pre klientky, nie počas rezervácie */}
      {s.screen === 'client' && !s.chatOpen && s.clientTab !== 'booking' && !s.notifOpen && (
        <button type="button" onClick={chatOpen} aria-label="Otvoriť chat" style={st('all:unset;cursor:pointer;position:fixed;right:max(16px,calc(50% - 125px));bottom:calc(68px + env(safe-area-inset-bottom));height:44px;border-radius:22px;padding:0 16px 0 12px;background:var(--espresso);color:#17100F;display:flex;align-items:center;gap:6px;font-family:var(--font-sans);font-size:.72rem;font-weight:600;box-shadow:0 12px 24px -8px rgba(0,0,0,.6);z-index:21')}>
          <Icon name="chat" size={16} strokeWidth={1.8} />Aura
        </button>
      )}
      {s.screen === 'client' && s.chatOpen && s.clientTab !== 'booking' && (
        <div style={st('position:fixed;left:50%;transform:translateX(-50%);bottom:0;top:0;width:100%;max-width:282px;display:flex;flex-direction:column;background:var(--porcelain);z-index:60')}>
          <div style={st('display:flex;align-items:center;justify-content:space-between;padding:var(--top) 18px 12px;border-bottom:1px solid #2C201C')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={st('width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#D9B99B,#9A7558);color:#17100F;font-family:var(--font-display);font-size:1rem')}>A</span>
              <div><div style={{ fontFamily: 'var(--font-sans)', fontSize: '.84rem', color: 'var(--ink)' }}>Aura — asistentka</div><div style={{ fontFamily: 'var(--font-sans)', fontSize: '.68rem', color: '#7FB08A' }}>online</div></div>
            </div>
            <button type="button" onClick={chatClose} aria-label="Zavrieť chat" style={st('all:unset;cursor:pointer;color:var(--ink-2)')}><Icon name="x" size={20} /></button>
          </div>
          <div style={st('flex:1;overflow-y:auto;padding:14px 18px;display:flex;flex-direction:column;gap:8px')}>
            {s.chatLog.map((m, i) => (
              <div key={i} style={st(`max-width:82%;padding:9px 12px;border-radius:16px;font-family:var(--font-sans);font-size:.8rem;line-height:1.45;white-space:pre-line;${m.from === 'me' ? 'align-self:flex-end;background:var(--espresso);color:#17100F;border-bottom-right-radius:5px' : 'align-self:flex-start;background:var(--white);color:var(--ink);border:1px solid var(--sand);border-bottom-left-radius:5px'}`)}>{m.text}</div>
            ))}
          </div>
          <div style={st('padding:12px 18px calc(16px + env(safe-area-inset-bottom));border-top:1px solid #2C201C;display:flex;flex-wrap:wrap;gap:6px')}>
            {chatCurrentOptions.length === 0 && <span style={st(T.mut)}>Na tento deň, žiaľ, nie sú voľné časy.</span>}
            {chatCurrentOptions.map((o, i) => (
              <button type="button" key={i} onClick={o.run} style={st('all:unset;cursor:pointer;padding:7px 12px;border-radius:99px;border:1px solid #4A322B;color:var(--espresso);font-family:var(--font-sans);font-size:.74rem')}>{o.label}</button>
            ))}
            {chatShowBack && <button type="button" onClick={chatReset} style={st('all:unset;cursor:pointer;padding:7px 12px;border-radius:99px;color:var(--ink-3);font-family:var(--font-sans);font-size:.74rem')}>← Späť na začiatok</button>}
          </div>
        </div>
      )}
    </div>
  );
}

class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('App crashed:', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: 'calc(100vh / var(--z, 1))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#17100F', color: '#F1E6DF', fontFamily: 'Inter, sans-serif', padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: '1.1rem' }}>Niečo sa pokazilo.</div>
          <div style={{ fontSize: '.8rem', color: '#9C8981', maxWidth: 320 }}>Skúste appku znova načítať. Ak problém pretrváva, dajte nám vedieť.</div>
          <button onClick={() => window.location.reload()} style={{ all: 'unset', cursor: 'pointer', padding: '12px 28px', borderRadius: 999, background: '#D9B99B', color: '#17100F', fontSize: '.8rem', letterSpacing: '.08em', textTransform: 'uppercase' }}>Načítať znova</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppErrorBoundary><App /></AppErrorBoundary>);

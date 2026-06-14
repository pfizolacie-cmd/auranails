// ── Icon set — self-contained thin-stroke SVGs (no CDN dependency) ──
// Hairline (1.4) line icons tuned to the Aura Nails aesthetic.
const ICON_PATHS = {
  sparkle: <path d="M12 3.2l1.7 5.6 5.6 1.7-5.6 1.7L12 17.8l-1.7-5.6L4.7 10.5l5.6-1.7zM18.5 3.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z" />,
  drop: <path d="M12 3.5s5.5 5.8 5.5 10.2a5.5 5.5 0 0 1-11 0C6.5 9.3 12 3.5 12 3.5z" />,
  heart: <path d="M12 20.3s-6.8-4.2-6.8-9.4A3.6 3.6 0 0 1 12 7.4a3.6 3.6 0 0 1 6.8 3.5c0 5.2-6.8 9.4-6.8 9.4z" />,
  arrow: <path d="M5 12h13.5M12.5 6l6 6-6 6" />,
  clock: <g><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5.2l3.2 1.9" /></g>,
  pin: <g><path d="M12 21s-6.2-5.4-6.2-10.2A6.2 6.2 0 0 1 12 4.6a6.2 6.2 0 0 1 6.2 6.2C18.2 15.6 12 21 12 21z" /><circle cx="12" cy="10.8" r="2.3" /></g>,
  phone: <path d="M6.4 4h3l1.5 3.9-2 1.4a11 11 0 0 0 5 5l1.4-2 3.9 1.5v3a1.5 1.5 0 0 1-1.6 1.5A15.3 15.3 0 0 1 4.9 6.6 1.5 1.5 0 0 1 6.4 4z" />,
  instagram: <g><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.6" /><circle cx="16.4" cy="7.6" r="1" fill="currentColor" stroke="none" /></g>,
  facebook: <path d="M14.5 21v-7h2.3l.4-2.7h-2.7V9.5c0-.8.2-1.3 1.3-1.3h1.5V5.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.2H9v2.7h2.4V21z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  seal: <g><circle cx="12" cy="10" r="6" /><path d="M9 15l-1.6 5 4.6-2.4 4.6 2.4-1.6-5" /><path d="M9.6 10l1.6 1.6 3.2-3.2" /></g>,
  heartArrow: <g><path d="M12 3v8.4" /><path d="M12 20.4s-4.2-2.5-4.2-5.7a2.3 2.3 0 0 1 4.2-1.3 2.3 2.3 0 0 1 4.2 1.3c0 3.2-4.2 5.7-4.2 5.7z" /></g>,
  mail: <g><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="M4 7l8 6 8-6" /></g>,
  twitter: <path d="M21 5.6c-.7.3-1.4.5-2.2.6.8-.5 1.4-1.2 1.7-2.1-.8.4-1.6.8-2.5 1a3.7 3.7 0 0 0-6.3 3.4A10.5 10.5 0 0 1 4 4.9a3.7 3.7 0 0 0 1.1 4.9c-.6 0-1.2-.2-1.7-.4a3.7 3.7 0 0 0 3 3.6c-.5.2-1.1.2-1.7.1a3.7 3.7 0 0 0 3.4 2.6A7.4 7.4 0 0 1 3 17.5a10.5 10.5 0 0 0 5.7 1.7c6.8 0 10.5-5.6 10.5-10.5v-.5c.7-.5 1.3-1.2 1.8-2z" />,
  leaf: <g><path d="M5 19c0-7 5.5-13 15-13.5C20.5 14 15 20 5 19z" /><path d="M5 19c4.5-4 8-6.5 12.5-8" /></g>,
  almond: <g><path d="M12 3.5c5 4.5 5 12.5 0 17-5-4.5-5-12.5 0-17z" /><path d="M12 8.5v7" /></g>,
  wave: <g><path d="M3 9.5c3-3.5 6-3.5 9 0s6 3.5 9 0" /><path d="M3 15c3-3.5 6-3.5 9 0s6 3.5 9 0" /></g>,
  gem: <g><path d="M6 4.5h12l3 4.8-9 10.2-9-10.2z" /><path d="M3 9.3h18M9 4.5L6.4 9.3 12 19.5l5.6-10.2L15 4.5" /></g>,
  arch: <g><path d="M4.5 20V12a7.5 7.5 0 0 1 15 0v8" /><path d="M9 20v-8a3 3 0 0 1 6 0v8" /></g>,
  gift: <g><rect x="4" y="9" width="16" height="11.5" rx="1.5" /><path d="M3 9h18M12 9v11.5" /><path d="M12 9S11 4.5 8.4 4.5A2 2 0 0 0 8.4 8.5C10.5 8.6 12 9 12 9zM12 9s1-4.5 3.6-4.5A2 2 0 0 1 15.6 8.5C13.5 8.6 12 9 12 9z" /></g>,
  list: <path d="M4 7h16M4 12h16M4 17h16" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
};

function Icon({ name, size = 22, className = '', style = {}, strokeWidth = 1.4 }) {
  const fillIcons = { facebook: true };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={fillIcons[name] ? 'currentColor' : 'none'}
      stroke={fillIcons[name] ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={{ display: 'block', ...style }} aria-hidden="true">
      {ICON_PATHS[name] || null}
    </svg>
  );
}

Object.assign(window, { Icon });

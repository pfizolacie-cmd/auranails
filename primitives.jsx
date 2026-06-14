// ── Aura Nails · shared primitives ──────────────────────────────
const { useState, useEffect, useRef } = React;

// Reveal-on-scroll (rAF + bounding-rect — robust across environments)
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nodes = [];
    if (el.classList.contains('reveal')) nodes.push(el);
    el.querySelectorAll('.reveal').forEach((n) => nodes.push(n));
    const check = () => {
      const vh = window.innerHeight;
      for (const n of nodes) {
        const r = n.getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > 0) n.classList.add('in');
      }
    };
    check();
    let scheduled = false;
    const onScroll = () => {
      check();
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { check(); scheduled = false; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  return ref;
}

// Brand monogram — thin framed serif "A" (echoes the logo's framed wordmark)
function Emblem({ size = 40, color = '#3E2727', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} style={{ display: 'block' }} aria-hidden="true">
      <rect x="3" y="3" width="34" height="34" rx="7" fill="none" stroke={color} strokeWidth="1.1" />
      <text x="20" y="21" textAnchor="middle" dominantBaseline="central"
        fontFamily='"Cormorant Garamond", serif' fontWeight="500" fontSize="23" fill={color}>A</text>
    </svg>
  );
}

// Wordmark lockup — serif "Aura Nails" + name flanked by rules (matches the brand logo)
function Wordmark({ dark = false, sub = true }) {
  const fg = dark ? '#F7F2EF' : '#3E2727';
  const rule = dark ? 'rgba(203,185,176,0.7)' : 'rgba(62,39,39,0.35)';
  const subc = dark ? '#CBB9B0' : '#8C6E62';
  return (
    <div className="select-none leading-none">
      <div className="font-display font-medium tracking-[.07em] whitespace-nowrap" style={{ color: fg, fontSize: '1.5rem' }}>Aura Nails</div>
      {sub && (
        <div className="flex items-center gap-2 mt-[7px]">
          <span className="h-px w-4" style={{ background: rule }}></span>
          <span className="font-sans uppercase whitespace-nowrap" style={{ fontSize: '.5rem', letterSpacing: '.32em', color: subc }}>Michaela Foltánová</span>
          <span className="h-px flex-1 min-w-4" style={{ background: rule }}></span>
        </div>
      )}
    </div>
  );
}

// Eyebrow with flanking hairline
function Eyebrow({ children, center = false, light = false }) {
  return (
    <div className={`flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
      <span className="h-px w-7" style={{ background: light ? '#CBB9B0' : '#3E2727' }}></span>
      <span className="eyebrow" style={{ color: light ? '#CBB9B0' : '#8C6E62' }}>{children}</span>
      {center && <span className="h-px w-7" style={{ background: light ? '#CBB9B0' : '#3E2727' }}></span>}
    </div>
  );
}

// Button
function Button({ children, variant = 'primary', href = '#', onClick, className = '' }) {
  const base = 'inline-flex items-center justify-center gap-2 font-sans uppercase rounded-full transition-all duration-500 cursor-pointer text-[.72rem] tracking-[.28em] px-8 py-[14px]';
  const styles = {
    primary: 'bg-gold text-porcelain shadow-gold hover:bg-goldDeep',
    outline: 'bg-transparent text-goldDeep border border-gold/40 hover:bg-gold hover:text-porcelain hover:border-gold',
    ghost: 'bg-transparent text-ink hover:text-goldDeep px-2',
    onInk: 'bg-transparent text-champagne border border-champagne/40 hover:bg-champagne hover:text-ink',
  };
  return <a href={href} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>{children}</a>;
}

Object.assign(window, { useReveal, Emblem, Wordmark, Eyebrow, Button, useState, useEffect, useRef });

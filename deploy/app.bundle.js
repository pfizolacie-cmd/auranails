// Aura Nails — single bundle (auto-generated). Všetko v jednom scope.

// ===== primitives =====
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




// ===== Icons =====
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




// ===== Nav =====
// ── Navigation ──────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    ['Filozofia', '#filozofia'],
    ['Služby', '#sluzby'],
    ['Kvíz', '#kviz'],
    ['Galéria', 'gallery'],
    ['Kontakt', '#kontakt'],
  ];

  const handleLink = (href) => (e) => {
    if (href === 'gallery') { e.preventDefault(); window.dispatchEvent(new Event('aura:open-gallery')); return; }
    e.preventDefault();
    const el = document.getElementById(href.replace('#', ''));
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 8, behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}
      style={{
        background: scrolled ? 'rgba(247,242,239,0.78)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(62,39,39,0.08)' : '1px solid transparent',
      }}>
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10 flex items-center justify-between">
        <a href="#top"><Wordmark /></a>
        <nav className="hidden md:flex items-center gap-9">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={handleLink(href)} className="font-sans text-[.74rem] tracking-caps uppercase text-ink2 hover:text-goldDeep transition-colors duration-300 cursor-pointer">{label}</a>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button href="#kontakt" variant="primary" className="!px-6 !py-3"
            onClick={(e) => { e.preventDefault(); const el = document.getElementById('kontakt'); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 8, behavior: 'smooth' }); }}>
            Rezervovať <Icon name="heartArrow" size={16} className="nudge-down" />
          </Button>
        </div>
        <button className="md:hidden text-ink text-2xl" onClick={() => setOpen(!open)} aria-label="Menu">
          <Icon name={open ? 'x' : 'list'} size={26} />
        </button>
      </div>
      {/* mobile drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ${open ? 'max-h-96 mt-3' : 'max-h-0'}`}
        style={{ background: 'rgba(247,242,239,0.96)', backdropFilter: 'blur(14px)' }}>
        <nav className="flex flex-col px-8 py-4 gap-1">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={(e) => { setOpen(false); handleLink(href)(e); }} className="font-sans text-sm tracking-caps uppercase text-ink2 py-3 border-b border-ink/5 cursor-pointer">{label}</a>
          ))}
          <Button href="#kontakt" variant="primary" className="mt-4"
            onClick={(e) => { e.preventDefault(); setOpen(false); const el = document.getElementById('kontakt'); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 8, behavior: 'smooth' }); }}>
            Rezervovať termín <Icon name="heartArrow" size={16} className="nudge-down" />
          </Button>
        </nav>
      </div>
    </header>
  );
}



// ===== Hero =====
// ── Hero — luxusný framed úvod nad fixným pozadím ───────────────
function Hero() {
  const scrollToId = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 8, behavior: 'smooth' });
  };

  const socials = [
    ['facebook', 'https://www.facebook.com/profile.php?id=61579592324120'],
    ['instagram', 'https://www.instagram.com/aura_nails_mf/'],
    ['mail', 'mailto:aura.nails.mf@gmail.com'],
  ];

  return (
    <section id="top" className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 py-28 text-center">
      {/* rámček s názvom */}
      <div className="reveal in relative inline-flex flex-col items-center justify-center max-w-full px-6 sm:px-20 py-11 sm:py-16"
        style={{ border: '1px solid rgba(62,39,39,0.45)' }}>
        <span className="font-sans text-[.62rem] sm:text-[.74rem] tracking-[.3em] sm:tracking-[.34em] uppercase text-ink2 mb-5 text-center">
          Nechtové štúdio · Handlová
        </span>
        <h1 className="font-display font-light text-ink leading-[0.92] tracking-[.01em] whitespace-nowrap"
          style={{ fontSize: 'clamp(2.2rem, 11vw, 5.6rem)' }}>
          Aura Nails
        </h1>
        <span className="font-display italic text-ink2 mt-5 whitespace-nowrap" style={{ fontSize: 'clamp(1.2rem, 3.4vw, 1.9rem)' }}>
          Michaela Foltánová
        </span>
      </div>

      {/* podtext */}
      <p className="reveal in font-sans font-light text-ink2 mt-10 max-w-lg leading-[1.8] text-[.98rem] sm:text-[1.02rem] tracking-[.02em]">
        Každá služba zahŕňa konzultáciu, dokonalú hygienu a čas venovaný len vám.
        Oáza pokoja v srdci Handlovej.
      </p>

      {/* smotanové tlačidlo */}
      <a href="#kontakt" onClick={scrollToId('kontakt')}
        className="reveal in lift mt-10 inline-flex items-center justify-center text-center font-sans uppercase rounded-full text-[.74rem] tracking-[.26em] leading-tight px-12 py-5"
        style={{ background: '#F7F2EF', color: '#3E2727', border: '1px solid rgba(62,39,39,0.18)', boxShadow: '0 24px 50px -24px rgba(62,39,39,0.4)' }}>
        Objednať sa na termín
      </a>

      {/* sociálne ikony */}
      <div className="reveal in flex items-center gap-3.5 mt-11">
        {socials.map(([ic, href]) => (
          <a key={ic} href={href} target="_blank" rel="noreferrer"
            className="flex items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-0.5"
            style={{ width: '42px', height: '42px', border: '1px solid rgba(62,39,39,0.30)', color: '#3E2727', background: 'rgba(247,242,239,0.45)' }}>
            <Icon name={ic} size={18} />
          </a>
        ))}
      </div>

      {/* scroll náznak */}
      <a href="#filozofia" onClick={scrollToId('filozofia')} className="absolute bottom-7 left-1/2 -translate-x-1/2 text-ink3 hover:text-goldDeep transition-colors" aria-label="Posunúť nižšie">
        <Icon name="heartArrow" size={22} className="nudge-down" />
      </a>
    </section>
  );
}



// ===== Philosophy =====
// ── Philosophy (three pillars) ──────────────────────────────────
function Philosophy() {
  const ref = useReveal();
  const pillars = [
    ['sparkle', 'Ženská energia', 'Aura je o vyžarovaní. Každá žena odchádza s pocitom, že investovala čas do seba a svojej vnútornej pohody.'],
    ['drop', 'Estetika & čistota', 'Nude tóny, krémová biela a matné zlato. Minimalistická elegancia bez krikľavých farieb — len pokoj a vkus.'],
    ['heart', 'Prémiová starostlivosť', 'Dôraz na detail, dokonalá hygiena a individuálny prístup ku každej jednej zákazníčke. Vždy.'],
  ];
  return (
    <section id="filozofia" ref={ref} className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10">
        <div className="reveal text-center max-w-2xl mx-auto">
          <Eyebrow center>Naša filozofia</Eyebrow>
          <h2 className="font-display font-normal text-ink mt-6 leading-[1.1]" style={{ fontSize: 'clamp(2.1rem,4vw,3.2rem)' }}>
            Viac než manikúra —<br/>zážitok a <span className="italic" style={{ color: '#8C6E62' }}>rituál krásy</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 sm:gap-5 mt-14">
          {pillars.map(([icon, title, body], i) => (
            <div key={i} className="reveal lift glass rounded-[28px] px-9 py-11 text-center flex flex-col items-center" style={{ transitionDelay: `${i * 120}ms` }}>
              <span className="flex items-center justify-center w-16 h-16 rounded-full mb-7"
                style={{ border: '1px solid rgba(62,39,39,0.35)', color: '#8C6E62', background: 'rgba(255,255,255,0.5)' }}>
                <Icon name={icon} size={28} />
              </span>
              <h3 className="font-display font-medium text-2xl text-ink leading-snug">{title}</h3>
              <p className="font-sans font-light text-ink3 mt-4 leading-[1.7] text-[.98rem] tracking-[.03em]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



// ===== Services =====
// ── Cenník — moderný interaktívny katalóg ───────────────────────
const CATALOG = [
  {
    kicker: 'Predĺženie & spevnenie', title: 'Gélové nechty', photo: 'nail-french',
    blurb: 'Pevná, trvácna modeláž šitá na tvar a dĺžku vašich nechtov.',
    items: [
      { name: 'Nová modelácia', tiers: [['Krátke', '33 €'], ['Stredné', '35 €'], ['Dlhé', '38 €']] },
      { name: 'Doplnenie', tiers: [['Krátke', '30 €'], ['Stredné', '32 €'], ['Dlhé', '35 €']] },
      { name: 'Jednorázové', price: '40 €', sub: 'Kompletná modeláž na jednu príležitosť' },
      { name: 'Gél lak', price: '28 €', sub: 'Trvácny lak na prírodné nechty' },
    ],
  },
  {
    kicker: 'Starostlivosť', title: 'Manikúra', photo: 'nail-natural',
    blurb: 'Upravené, hydratované a zdravé ruky — od základu po rituál.',
    items: [
      { name: 'Prístrojová manikúra', price: '20 €' },
      { name: 'SPA manikúra s peelingom', price: '25 €' },
      { name: 'Hydratačný zábal a masáž rúk', price: '10 €' },
    ],
  },
  {
    kicker: 'Zdravie nechtov', title: 'Odborná starostlivosť', photo: 'nail-red',
    blurb: 'Regenerácia a obnova prirodzene oslabených nechtov.',
    items: [
      { name: 'Odstránenie nechtov', price: '15 €' },
      { name: 'Odstránenie + prístrojová manikúra', price: '25 €' },
      { name: 'IBX regeneračná kúra', price: '15 €' },
      { name: 'IBX kúra + prístrojová manikúra', price: '25 €' },
    ],
  },
  {
    kicker: 'Doplnky', title: 'Dizajn a doplnky', photo: 'nail-pink',
    blurb: 'Detaily, ktoré dotvoria váš jedinečný štýl.',
    items: [
      { name: 'Francúzska manikúra', price: '3 €' },
      { name: 'Francúzska manikúra (vstavaná)', price: '5 €' },
      { name: 'Babyboomer (vstavaný)', price: '3 €' },
      { name: 'Oprava nechtu mimo termín', price: '3 €' },
      { name: 'Zrušenie termínu (do 24 hod.)', price: '15 €' },
    ],
  },
];

function Services({ onBook }) {
  const ref = useReveal();
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const cat = CATALOG[active];

  const go = (i) => {
    if (i === active || fading) return;
    setFading(true);
    setTimeout(() => { setActive(i); setFading(false); }, 240);
  };

  const num = (i) => String(i + 1).padStart(2, '0');

  return (
    <section id="sluzby" ref={ref} className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-10">
        <div className="reveal flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12">
          <div>
            <Eyebrow>Katalóg služieb</Eyebrow>
            <h2 className="font-display font-normal text-ink mt-5 leading-[1.06]" style={{ fontSize: 'clamp(2.2rem,4.4vw,3.4rem)' }}>
              Starostlivosť šitá <span className="italic" style={{ color: '#8C6E62' }}>na mieru</span>
            </h2>
          </div>
          <p className="font-sans font-light text-ink2 leading-[1.7] tracking-[.05em] max-w-xs sm:text-right">
            Každá služba zahŕňa konzultáciu, dokonalú hygienu a čas venovaný len vám.
          </p>
        </div>

        {/* Catalog frame */}
        <div className="reveal glass rounded-[32px] overflow-hidden grid lg:grid-cols-[300px_1fr]">

          {/* Index column */}
          <nav className="relative min-w-0 p-3 sm:p-5 lg:p-6 lg:border-r" style={{ borderColor: 'rgba(62,39,39,0.10)' }}>
            <div className="hidden lg:flex items-center justify-between px-3 mb-4">
              <span className="eyebrow text-ink3" style={{ fontSize: '.58rem', letterSpacing: '.24em' }}>Kategórie</span>
              <span className="font-display text-ink3 text-[1rem]">{num(active)} / {num(CATALOG.length - 1)}</span>
            </div>
            <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible">
              {CATALOG.map((c, i) => {
                const on = i === active;
                return (
                  <button key={i} onClick={() => go(i)}
                    className="group flex items-center gap-3 text-left rounded-2xl px-4 py-3.5 transition-all duration-300 shrink-0 lg:w-full"
                    style={{ background: on ? '#3E2727' : 'transparent', color: on ? '#F7F2EF' : '#3E2727' }}>
                    <span className="font-display text-[1.15rem] leading-none" style={{ color: on ? '#CBB9B0' : '#8C6E62' }}>{num(i)}</span>
                    <span className="font-sans font-light text-[.98rem] whitespace-nowrap lg:whitespace-normal">{c.title}</span>
                    <span className="ml-auto hidden lg:block transition-transform duration-300" style={{ opacity: on ? 1 : 0, transform: on ? 'translateX(0)' : 'translateX(-6px)' }}>
                      <Icon name="arrow" size={15} color={on ? '#F7F2EF' : '#3E2727'} />
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Content column */}
          <div className="min-w-0 p-7 sm:p-10 lg:p-12" style={{ transition: 'opacity .26s ease', opacity: fading ? 0 : 1 }}>
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <div className="eyebrow" style={{ color: '#8C6E62', fontSize: '.6rem', letterSpacing: '.24em' }}>{cat.kicker}</div>
                <h3 className="font-display text-ink mt-2 leading-[1.05]" style={{ fontSize: 'clamp(1.9rem,3.4vw,2.7rem)' }}>{cat.title}</h3>
                <p className="font-sans font-light text-ink3 text-[.92rem] mt-3 max-w-sm leading-relaxed tracking-[.03em]">{cat.blurb}</p>
              </div>
            </div>

            <div className="mt-8">
              {cat.items.map((it, i) => (
                <button key={i} type="button"
                  onClick={() => onBook && onBook({ service: it.name, price: it.price || (it.tiers && it.tiers[0][1]) })}
                  className="group/item w-full text-left py-4 border-b last:border-b-0 transition-colors duration-300"
                  style={{ borderColor: 'rgba(62,39,39,0.10)' }}>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-ink text-[1.4rem] leading-tight transition-colors duration-300 group-hover/item:text-goldDeep">{it.name}</span>
                    <span className="shrink-0 inline-flex items-center gap-1 font-sans uppercase text-[.54rem] tracking-[.18em] text-goldDeep opacity-0 -translate-x-1 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-x-0">
                      Rezervovať <Icon name="arrow" size={12} />
                    </span>
                    <span className="flex-1 border-b border-dotted translate-y-[-4px]" style={{ borderColor: 'rgba(62,39,39,0.22)' }}></span>
                    {it.price && <span className="font-display text-[1.5rem] text-ink whitespace-nowrap leading-none">{it.price}</span>}
                  </div>
                  {it.sub && <div className="font-sans font-light text-ink3 text-[.84rem] mt-1.5 tracking-[.02em]">{it.sub}</div>}
                  {it.tiers && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {it.tiers.map(([t, p]) => (
                        <span key={t} role="button" tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); onBook && onBook({ service: `${it.name} · ${t}`, price: p }); }}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onBook && onBook({ service: `${it.name} · ${t}`, price: p }); } }}
                          className="font-sans text-[.85rem] whitespace-nowrap cursor-pointer rounded-full px-3 py-1.5 border transition-all duration-300 hover:-translate-y-0.5"
                          style={{ color: '#8C6E62', borderColor: 'rgba(62,39,39,0.16)' }}>
                          {t}&nbsp;<span className="font-display text-[1.1rem] text-ink">{p}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* note + CTA */}
        <div className="reveal flex flex-col sm:flex-row items-center justify-between gap-6 mt-10">
          <p className="font-sans font-light text-ink3 text-[.82rem] tracking-[.03em] max-w-md text-center sm:text-left">
            * Záruka modeláže je 48 hodín a nevzťahuje sa na mechanické poškodenie.
          </p>
          <button onClick={() => { const el=document.getElementById('kontakt'); if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-8,behavior:'smooth'}); }}
            className="lift inline-flex items-center gap-2.5 font-sans uppercase rounded-full text-[.72rem] tracking-[.24em] px-9 py-[16px] bg-gold text-porcelain shadow-gold hover:bg-goldDeep shrink-0">
            Rezervovať návštevu <Icon name="arrow" size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}



// ===== Premeny =====
// ── Salón — kinematická prezentácia (video salónu) + premeny ────
function Premeny() {
  const ref = useReveal();
  const toId = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 8, behavior: 'smooth' });
  };

  return (
    <section id="premeny" ref={ref} className="px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
      <div className="mx-auto max-w-[1200px]">

        {/* ── Veľké kinematické video salónu ── */}
        <div className="reveal relative rounded-[32px] overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 50px 100px -40px rgba(62,39,39,0.45)' }}>
          <video className="w-full h-[480px] sm:h-[600px] object-cover"
            autoPlay loop muted playsInline poster="assets/photos/premeny-bg.jpg">
            <source src="assets/video/salon-hero.mp4" type="video/mp4" />
          </video>

          {/* filmový závoj — čitateľnosť textu */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(180deg, rgba(62,39,39,0.10) 0%, rgba(62,39,39,0) 38%, rgba(62,39,39,0.30) 72%, rgba(62,39,39,0.72) 100%)',
          }}></div>

          {/* text dole */}
          <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 lg:p-16">
            <div className="max-w-xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-8" style={{ background: '#D8C8C0' }}></span>
                <span className="font-sans uppercase text-[.7rem] tracking-[.34em]" style={{ color: '#E7D9D1' }}>Naša oáza · Handlová</span>
              </div>
              <h2 className="font-display font-light text-porcelain mt-5 leading-[1.05]"
                style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}>
                Vstúpte do nášho <span className="italic" style={{ color: '#E7D9D1' }}>salónu</span>
              </h2>
              <p className="font-sans font-light mt-5 max-w-md leading-[1.8] text-[1rem] tracking-[.02em]"
                style={{ color: 'rgba(247,242,239,0.85)' }}>
                Pokojné, čisté a útulné miesto, kde sa zastaví čas. Každý detail je vyladený tak,
                aby ste sa cítili výnimočne — od prvého dotyku až po finálny lesk.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <a href="#kontakt" onClick={toId('kontakt')}
                  className="lift inline-flex items-center gap-2.5 font-sans uppercase rounded-full text-[.72rem] tracking-[.24em] px-8 py-[15px]"
                  style={{ background: '#F7F2EF', color: '#3E2727', boxShadow: '0 24px 50px -24px rgba(0,0,0,0.5)' }}>
                  Rezervovať návštevu
                </a>
                <a href="#galeria" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('aura:open-gallery')); }}
                  className="inline-flex items-center gap-2 font-sans uppercase text-[.72rem] tracking-[.24em] pb-1"
                  style={{ color: '#F7F2EF', borderBottom: '1px solid rgba(247,242,239,0.5)' }}>
                  Pozrieť galériu <Icon name="arrow" size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



// ===== Quiz =====
// ── Kvíz nechtového štýlu — Bento ───────────────────────────────
const QUIZ_QUESTIONS = [
  { tag: 'Záťaž', q: 'Ako najčastejšie využívate svoje ruky?',
    a: ['Práca na počítači', 'Manuálna práca a domácnosť', 'Bežná každodenná záťaž'] },
  { tag: 'Tvar lôžka', q: 'Aký je prirodzený tvar vašich nechtov?',
    a: ['Širšie a kratšie', 'Úzke a dlhé', 'Drobné a malé'] },
  { tag: 'Dĺžka', q: 'Akú dĺžku nechtov preferujete?',
    a: ['Krátke a praktické', 'Stredné a elegantné', 'Dlhé a výrazné'] },
  { tag: 'Dizajn', q: 'Aký dizajn sa vám najviac páči?',
    a: ['Čistý nude a minimalizmus', 'Elegancia s jemným zdobením', 'Výrazný Nail Art'] },
];

function quizResult(ans) {
  const [load, bed, len, design] = ans;
  const level = Math.max(len, design);
  const loadTxt = ['Pri práci za počítačom máte ruky neustále na očiach',
    'Pri manuálnej práci a v domácnosti potrebujú nechty predovšetkým odolnosť',
    'Pri bežnej dennej záťaži'][load];
  const bedTxt = ['širšie lôžko opticky predĺžime jemne mandľovým tvarom',
    'úzke a dlhé lôžko krásne podčiarkne elegantnú líniu',
    'drobnejšie lôžko opticky predĺžime starostlivým vytvarovaním'][bed];
  const cap = (s) => s[0].toUpperCase() + s.slice(1);

  if (level === 2) return {
    title: 'Výrazná modeláž s autorským Nail Artom', shape: 'Mandľa / dlhšia oválna', service: 'Gélové nechty – nová modelácia',
    desc: `${loadTxt} a milujete, keď nechty zaujmú. ${cap(bedTxt)}. Pevná modeláž udrží väčšiu dĺžku a vytvorí dokonalý podklad pre výrazné zdobenie, ktoré vydrží týždne.`,
  };
  if (level === 1) return {
    title: 'Elegantná mandľa s gél lakom', shape: 'Mandľový tvar', service: 'Gélové nechty – nová modelácia',
    desc: `${loadTxt}, preto stavíme na nadčasovú eleganciu. ${cap(bedTxt)} a spevnenie gél lakom zabezpečí perfektný, upravený vzhľad bez starostí.`,
  };
  return {
    title: 'Prirodzená krása: nude gél lak', shape: 'Krátky oválny tvar', service: 'Prístrojová / SPA manikúra',
    desc: `${loadTxt}, preto volíme čistý, praktický a nadčasový vzhľad. ${cap(bedTxt)}. Nude gél lak pôsobí decentne, prirodzene spevní necht a vydrží dlhé týždne dokonalý.`,
  };
}

function Quiz({ onBook }) {
  const ref = useReveal();
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState([]);
  const [fading, setFading] = useState(false);
  const isResult = step === 4;
  const progress = isResult ? 100 : (step / QUIZ_QUESTIONS.length) * 100;

  const pick = (i) => {
    if (fading) return;
    const next = [...ans]; next[step] = i; setAns(next);
    setFading(true);
    setTimeout(() => { setStep(step + 1); setFading(false); }, 320);
  };
  const go = (s) => { setFading(true); setTimeout(() => { setStep(s); setFading(false); }, 250); };
  const restart = () => { setFading(true); setTimeout(() => { setAns([]); setStep(0); setFading(false); }, 250); };
  const result = isResult ? quizResult(ans) : null;

  return (
    <section id="kviz" ref={ref} className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-10">
        <div className="reveal text-center mb-12 max-w-2xl mx-auto">
          <Eyebrow center>Kvíz nechtového štýlu</Eyebrow>
          <h2 className="font-display font-normal text-ink mt-6 leading-[1.08]" style={{ fontSize: 'clamp(2.2rem,4.4vw,3.4rem)' }}>
            Nájdite svoj <span className="italic" style={{ color: '#8C6E62' }}>ideálny štýl</span>
          </h2>
          <p className="font-sans font-light text-ink2 mt-5 leading-[1.7] tracking-[.06em]">
            Štyri otázky a Michaela vám odporučí tvar, dĺžku a úpravu na mieru.
          </p>
        </div>

        {/* BENTO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-[minmax(0,auto)] gap-4 sm:gap-5 items-stretch">

          {/* Main interactive card — 2 cols, 2 rows */}
          <div className="reveal glass rounded-[30px] lg:col-span-2 lg:row-span-2 overflow-hidden flex flex-col">
            <div className="px-8 sm:px-11 pt-8">
              <div className="flex items-center justify-between mb-3">
                <span className="eyebrow text-goldDeep" style={{ fontSize: '.62rem', letterSpacing: '.24em' }}>
                  {isResult ? 'Váš výsledok' : `Krok ${step + 1} zo ${QUIZ_QUESTIONS.length}`}
                </span>
                {!isResult && <span className="eyebrow text-ink3" style={{ fontSize: '.62rem', letterSpacing: '.24em' }}>{QUIZ_QUESTIONS[step].tag}</span>}
              </div>
              <div className="h-[3px] w-full rounded-full bg-[rgba(62,39,39,0.10)] relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#CBB9B0,#3E2727)' }}></div>
              </div>
            </div>

            <div className="px-8 sm:px-11 py-9 flex-1 flex flex-col justify-center" style={{ minHeight: '360px', transition: 'opacity .3s ease', opacity: fading ? 0 : 1 }}>
              {!isResult ? (
                <div>
                  <h3 className="font-display text-ink leading-[1.12] mb-8" style={{ fontSize: 'clamp(1.7rem,3vw,2.3rem)' }}>
                    {QUIZ_QUESTIONS[step].q}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {QUIZ_QUESTIONS[step].a.map((opt, i) => {
                      const selected = ans[step] === i;
                      return (
                        <button key={i} onClick={() => pick(i)}
                          className="lift group flex items-center justify-between text-left rounded-2xl px-6 py-[18px] border"
                          style={{
                            background: selected ? '#3E2727' : 'rgba(255,255,255,0.6)',
                            borderColor: selected ? '#3E2727' : 'rgba(62,39,39,0.08)',
                            color: selected ? '#F7F2EF' : '#3E2727',
                          }}>
                          <span className="font-sans font-light text-[1.05rem] tracking-[.02em]">{opt}</span>
                          <span className="shrink-0 ml-4 flex items-center justify-center w-7 h-7 rounded-full border transition-colors duration-300"
                            style={{ borderColor: selected ? 'rgba(247,242,239,0.6)' : 'rgba(62,39,39,0.4)', color: selected ? '#F7F2EF' : '#3E2727' }}>
                            {selected ? <Icon name="check" size={15} /> : <span className="font-sans text-[.8rem]">{String.fromCharCode(65 + i)}</span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {step > 0 && (
                    <button onClick={() => go(step - 1)} className="mt-8 font-sans text-[.7rem] tracking-caps uppercase text-ink3 hover:text-goldDeep transition-colors">← Späť</button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <span className="flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-6" style={{ border: '1px solid rgba(62,39,39,0.4)', color: '#8C6E62' }}>
                    <Icon name="sparkle" size={26} />
                  </span>
                  <div className="eyebrow text-goldDeep" style={{ letterSpacing: '.24em' }}>Váš ideálny štýl</div>
                  <h3 className="font-display text-ink mt-4 leading-[1.1]" style={{ fontSize: 'clamp(1.9rem,3.4vw,2.6rem)' }}>{result.title}</h3>
                  <div className="flex items-center justify-center gap-2.5 mt-4">
                    <span className="h-px w-6 bg-gold"></span>
                    <span className="eyebrow text-ink3" style={{ letterSpacing: '.18em' }}>{result.shape}</span>
                    <span className="h-px w-6 bg-gold"></span>
                  </div>
                  <p className="font-sans font-light text-ink2 mt-6 leading-[1.8] max-w-lg mx-auto tracking-[.02em]">{result.desc}</p>
                  <div className="mt-9 flex flex-col items-center gap-4">
                    <button onClick={() => onBook({ service: result.service, note: `Odporúčaný štýl z kvízu: ${result.title} (${result.shape}).` })}
                      className="lift inline-flex items-center justify-center gap-2 font-sans uppercase rounded-full text-[.72rem] tracking-[.24em] px-9 py-[17px] bg-gold text-porcelain shadow-gold">
                      Objednať sa na tento štýl <Icon name="arrow" size={17} />
                    </button>
                    <button onClick={restart} className="font-sans text-[.7rem] tracking-caps uppercase text-ink3 hover:text-goldDeep transition-colors">Spustiť kvíz znova</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side accent tile */}
          <div className="reveal glass-cream rounded-[30px] p-7 flex flex-col justify-between min-h-[180px]">
            <Emblem size={36} />
            <div>
              <div className="font-display text-[1.45rem] leading-tight text-ink">Odporúčanie na mieru</div>
              <p className="font-sans font-light text-ink3 text-[.86rem] mt-2 leading-relaxed tracking-[.03em]">
                Výsledok je len návrh — finálny tvar vždy doladíme spoločne priamo v štúdiu.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}



// ===== About =====
// ── About Michaela ──────────────────────────────────────────────
function About() {
  const ref = useReveal();
  return (
    <section id="o-mne" ref={ref} className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* portrait */}
        <div className="reveal relative order-2 lg:order-1">
          <div className="relative max-w-[460px] mx-auto">
            <img src="assets/photos/michaela.jpg?v=2" alt="Michaela Foltánová — Aura Nails"
              style={{ width: '100%', height: '552px', objectFit: 'cover', objectPosition: '50% 30%' }}
              className="rounded-[18px] shadow-soft" />
            <div className="pointer-events-none absolute -top-5 -right-5 w-24 h-24 rounded-full opacity-70"
              style={{ background: 'radial-gradient(circle, rgba(203,185,176,0.6), transparent 70%)' }}></div>
          </div>
        </div>
        {/* text */}
        <div className="reveal order-1 lg:order-2 glass-cream rounded-[30px] p-8 sm:p-11">
          <Eyebrow>Manikérka &amp; zakladateľka</Eyebrow>
          <h2 className="font-display font-normal text-ink mt-6 leading-[1.1]" style={{ fontSize: 'clamp(2rem,3.6vw,2.9rem)' }}>
            Michaela Foltánová
          </h2>
          <p className="font-sans font-light text-ink2 mt-6 leading-[1.8] text-[1.06rem]">
            Aura Nails som vytvorila ako miesto, kde sa každá žena na chvíľu zastaví — len pre seba.
            Verím, že krásne nechty sú detail, ktorý dodáva sebavedomie a pokoj.
          </p>
          <p className="font-sans font-light text-ink2 mt-4 leading-[1.8] text-[1.06rem]">
            Pracujem precízne, s dôrazom na dokonalú hygienu a individuálny prístup. U mňa nie ste
            ďalšou klientkou v poradí — máte môj čas, pozornosť a starostlivosť.
          </p>
          <div className="flex flex-wrap gap-10 mt-10">
            {[['3+', 'rokov praxe'], ['100%', 'sterilná hygiena'], ['1:1', 'individuálny prístup']].map(([n, l], i) => (
              <div key={i}>
                <div className="font-display text-4xl text-goldDeep leading-none">{n}</div>
                <div className="eyebrow mt-2 text-ink2" style={{ letterSpacing: '.18em' }}>{l}</div>
              </div>
            ))}
          </div>
          <div className="font-display italic text-2xl text-gold mt-10">— Michaela</div>
        </div>
      </div>
    </section>
  );
}



// ===== GalleryModal =====
// ── Galéria — celoobrazovkový modal (otvára sa z navigácie) ─────
function GalleryTile({ src, label, h, type }) {
  const [err, setErr] = useState(false);
  return (
    <figure className="lift relative overflow-hidden rounded-[22px] group" style={{ breakInside: 'avoid', marginBottom: '16px' }}>
      {type === 'video' ? (
        <video src={`assets/video/${src}`} autoPlay loop muted playsInline
          style={{ width: '100%', height: `${h}px`, objectFit: 'cover', display: 'block' }} />
      ) : !err ? (
        <img src={`assets/photos/${src}`} alt={label} onError={() => setErr(true)}
          style={{ width: '100%', height: `${h}px`, objectFit: 'cover', display: 'block' }}
          className="transition-transform duration-700 group-hover:scale-105" />
      ) : (
        <div style={{ width: '100%', height: `${h}px`, background: 'linear-gradient(135deg,#4a3a36,#2c2422)' }}
          className="flex flex-col items-center justify-center gap-2">
          <Icon name="sparkle" size={22} style={{ color: 'rgba(216,200,190,0.7)' }} />
          <span className="font-sans text-[.62rem] tracking-[.2em] uppercase" style={{ color: 'rgba(216,200,190,0.6)' }}>{src}</span>
        </div>
      )}
      {type === 'video' && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 font-sans uppercase text-[.55rem] tracking-[.2em] px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(20,14,12,0.45)', color: '#F4ECE4', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.3)' }}>
          Pred &amp; Po
        </span>
      )}
      <figcaption className="absolute inset-x-0 bottom-0 px-4 py-3 font-sans text-[.72rem] tracking-[.06em]"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(20,14,12,0.78))', color: '#F4ECE4' }}>
        {label}
      </figcaption>
    </figure>
  );
}

function GalleryModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openIt = (e) => { if (e) e.preventDefault && e.preventDefault(); setOpen(true); };
    window.addEventListener('aura:open-gallery', openIt);
    return () => window.removeEventListener('aura:open-gallery', openIt);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    } else {
      document.body.style.overflow = '';
    }
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  const photos = [
    { type: 'video', src: 'premeny-1.mp4', label: 'Premena 01 · Modeláž & tvar', h: 420 },
    { type: 'video', src: 'premeny-2.mp4', label: 'Premena 02 · Gél lak & lesk', h: 420 },
    { src: 'g-glitter.jpg', label: 'Trblietavý ombré', h: 380 },
    { src: 'g-pink.jpg', label: 'Neónová ružová', h: 300 },
    { src: 'g-silver.jpg', label: 'Strieborný glitter', h: 360 },
    { src: 'g-nude.jpg', label: 'Prirodzený nude', h: 300 },
    { src: 'g-red.jpg', label: 'Bordová cat-eye', h: 320 },
    { src: 'g-french.jpg', label: 'Francúzska manikúra', h: 360 },
  ];

  return (
    open ? (
    <div
      className="fixed inset-0 z-[100]"
      style={{ background: 'rgba(24,17,15,0.82)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>

      <div className="absolute inset-0 overflow-y-auto">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-10 py-20">

          {/* hlavička */}
          <div className="flex items-end justify-between gap-6 mb-14">
            <div>
              <div className="font-sans text-[.66rem] tracking-[.34em] uppercase mb-3" style={{ color: '#CBB9B0' }}>Galéria · Aura Nails</div>
              <h2 className="font-display font-light leading-[1.12]" style={{ fontSize: 'clamp(2rem,4.4vw,3rem)', color: '#F7F2EF' }}>
                Naša práca <span className="italic" style={{ color: '#D8C8C0' }}>hovorí za nás</span>
              </h2>
            </div>
            <button onClick={() => setOpen(false)}
              className="shrink-0 inline-flex items-center gap-2 font-sans text-[.7rem] tracking-[.2em] uppercase rounded-full px-5 py-3 transition-all duration-300 hover:-translate-y-0.5"
              style={{ color: '#F7F2EF', border: '1px solid rgba(247,242,239,0.4)', background: 'rgba(247,242,239,0.08)' }}>
              Zatvoriť <Icon name="x" size={16} />
            </button>
          </div>

          {/* mriežka (masonry) */}
          <div style={{ columnGap: '16px' }} className="[column-count:1] sm:[column-count:2] lg:[column-count:3]">
            {photos.map((p, i) => <GalleryTile key={i} {...p} />)}
          </div>

          <p className="text-center mt-10 font-sans font-light text-[.85rem] tracking-[.04em]" style={{ color: 'rgba(247,242,239,0.6)' }}>
            Viac na Instagrame ·{' '}
            <a href="https://instagram.com/aura_nails_mf" target="_blank" rel="noreferrer" style={{ color: '#D8C8C0', borderBottom: '1px solid rgba(216,200,192,0.5)' }}>@aura_nails_mf</a>
          </p>
        </div>
      </div>
    </div>
    ) : null
  );
}



// ===== AuraPass =====
// ── Aura Pass — vernostný program ───────────────────────────────
function AuraPass() {
  const ref = useReveal();
  const [stamps, setStamps] = useState(0);   // koľko z 5 je nazbieraných
  const [reward, setReward] = useState(false);
  const [burst, setBurst] = useState(false);

  const collect = (i) => {
    // klikať sa dá len na ďalšiu v poradí (alebo odznačiť poslednú)
    if (i < 5) {
      if (i === stamps) setStamps(stamps + 1);
      else if (i === stamps - 1) setStamps(stamps - 1);
    }
  };
  const claim = () => {
    if (stamps < 5 || reward) return;
    setReward(true); setBurst(true);
    setTimeout(() => setBurst(false), 2600);
  };
  const reset = () => { setStamps(0); setReward(false); };

  const rules = [
    ['sparkle', 'Za každú návštevu', 'Pri každom termíne vám pridáme jednu zlatú pečiatku do digitálnej Aura Pass karty.'],
    ['heart', 'Päť rituálov krásy', 'Vyzbierajte 5 pečiatok počas vašich obľúbených návštev — bez ponáhľania, vlastným tempom.'],
    ['gift', 'Šiesta s darčekom', 'Pri 6. návšteve vás čaká rituál so zľavou a malým darčekom ako poďakovanie.'],
  ];

  // konfeti čiastočky (deterministické pozície)
  const confetti = Array.from({ length: 24 }, (_, k) => {
    const x = (k * 37) % 100;
    const delay = (k % 8) * 0.08;
    const colors = ['#CBB9B0', '#3E2727', '#DEC8C0', '#8C6E62'];
    return { x, delay, c: colors[k % 4], r: (k * 53) % 360, dur: 1.8 + (k % 5) * 0.18 };
  });

  return (
    <section id="aura-pass" ref={ref} className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-10">
        <div className="reveal text-center max-w-2xl mx-auto mb-14">
          <Eyebrow center>Vernostný program</Eyebrow>
          <h2 className="font-display font-normal text-ink mt-6 leading-[1.08]" style={{ fontSize: 'clamp(2.2rem,4.4vw,3.4rem)' }}>
            Aura Pass — <span className="italic" style={{ color: '#8C6E62' }}>rituál vernosti</span>
          </h2>
          <p className="font-sans font-light text-ink2 mt-5 leading-[1.7] tracking-[.06em]">
            Päť návštev, šiesta s odmenou. Vaša starostlivosť o seba sa oplatí.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
          {/* ĽAVO — pravidlá */}
          <div className="reveal glass-cream rounded-[30px] p-8 sm:p-11 flex flex-col">
            <span className="self-start font-sans uppercase text-[.62rem] tracking-[.24em] px-4 py-2 rounded-full"
              style={{ background: 'rgba(62,39,39,0.12)', color: '#8C6E62', border: '1px solid rgba(62,39,39,0.3)' }}>
              Rituál vernosti 5+1
            </span>
            <h3 className="font-display text-ink mt-6 leading-[1.12]" style={{ fontSize: 'clamp(1.7rem,2.6vw,2.2rem)' }}>
              Ako to funguje
            </h3>
            <div className="mt-7 flex flex-col gap-6">
              {rules.map(([icon, title, body], i) => (
                <div key={i} className="flex gap-4">
                  <span className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full"
                    style={{ border: '1px solid rgba(62,39,39,0.35)', color: '#8C6E62', background: 'rgba(255,255,255,0.6)' }}>
                    <Icon name={icon} size={20} />
                  </span>
                  <div>
                    <div className="font-display text-[1.3rem] text-ink leading-tight">{title}</div>
                    <p className="font-sans font-light text-ink3 text-[.92rem] mt-1.5 leading-relaxed tracking-[.03em]">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-8">
              <p className="font-sans font-light text-ink3 text-[.82rem] leading-relaxed tracking-[.04em]">
                Aura Pass vediem pre každú zákazníčku osobne. Stačí prísť — o zvyšok sa postarám.
              </p>
            </div>
          </div>

          {/* PRAVO — digitálna karta */}
          <div className="reveal relative">
            <div className="relative rounded-[30px] p-7 sm:p-9 overflow-hidden h-full flex flex-col"
              style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(62,39,39,0.4)', boxShadow: '0 40px 80px -36px rgba(62,39,39,0.40)' }}>

              {/* konfeti */}
              {burst && (
                <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
                  {confetti.map((c, k) => (
                    <span key={k} style={{
                      position: 'absolute', left: `${c.x}%`, top: '-6%',
                      width: '9px', height: '9px', background: c.c, borderRadius: '2px',
                      transform: `rotate(${c.r}deg)`,
                      animation: `auraFall ${c.dur}s cubic-bezier(.4,.1,.5,1) ${c.delay}s forwards`,
                    }}></span>
                  ))}
                </div>
              )}

              {/* hlavička karty */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Emblem size={30} />
                  <div className="leading-none">
                    <div className="font-display text-[1.4rem] text-ink">Aura Pass</div>
                    <div className="eyebrow mt-1" style={{ color: '#9D8B84', fontSize: '.54rem', letterSpacing: '.28em' }}>MF · Handlová</div>
                  </div>
                </div>
                <span className="font-sans uppercase text-[.55rem] tracking-[.2em] px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(62,39,39,0.12)', color: '#8C6E62', border: '1px solid rgba(62,39,39,0.28)' }}>
                  {stamps}/5
                </span>
              </div>

              <div className="h-px w-full my-6" style={{ background: 'rgba(62,39,39,0.22)' }}></div>

              {/* mriežka pečiatok */}
              <div className="grid grid-cols-3 gap-4 sm:gap-5">
                {[0, 1, 2, 3, 4].map((i) => {
                  const on = i < stamps;
                  const isNext = i === stamps && !reward;
                  return (
                    <button key={i} onClick={() => collect(i)}
                      className="aspect-square rounded-full flex items-center justify-center transition-all duration-500"
                      style={{
                        background: on ? 'linear-gradient(150deg,#CBB9B0,#3E2727)' : 'rgba(238,230,225,0.7)',
                        border: on ? '1px solid #3E2727' : isNext ? '1.5px dashed rgba(62,39,39,0.5)' : '1px solid rgba(62,39,39,0.08)',
                        color: on ? '#F7F2EF' : '#B6A79F',
                        transform: on ? 'scale(1)' : 'scale(0.96)',
                        boxShadow: on ? '0 10px 22px -10px rgba(62,39,39,0.6)' : 'none',
                        cursor: 'pointer',
                      }}>
                      <Icon name="sparkle" size={24} />
                    </button>
                  );
                })}

                {/* 6. kruh — odmena */}
                <button onClick={claim}
                  className="aspect-square rounded-full flex flex-col items-center justify-center transition-all duration-500 relative"
                  style={{
                    background: reward ? 'linear-gradient(150deg,#CBB9B0,#8C6E62)' : stamps >= 5 ? 'rgba(255,255,255,0.7)' : 'rgba(238,230,225,0.55)',
                    border: stamps >= 5 ? '2px solid #3E2727' : '2px solid rgba(62,39,39,0.35)',
                    color: reward ? '#F7F2EF' : stamps >= 5 ? '#8C6E62' : '#B6A79F',
                    boxShadow: stamps >= 5 ? '0 14px 30px -12px rgba(62,39,39,0.55)' : 'none',
                    cursor: stamps >= 5 ? 'pointer' : 'not-allowed',
                    animation: stamps >= 5 && !reward ? 'auraPulse 2s ease-in-out infinite' : 'none',
                  }}>
                  <Icon name="gift" size={26} />
                  <span className="font-sans uppercase mt-1" style={{ fontSize: '.46rem', letterSpacing: '.16em' }}>Darček</span>
                </button>
              </div>

              {/* stav / odmena */}
              <div className="mt-7 min-h-[64px] flex items-center">
                {reward ? (
                  <div className="w-full text-center rounded-2xl px-5 py-4" style={{ background: 'rgba(62,39,39,0.10)', border: '1px solid rgba(62,39,39,0.3)' }}>
                    <div className="font-display italic text-ink text-[1.15rem] leading-snug">Vaša odmena je pripravená! ✨</div>
                    <div className="font-sans font-light text-ink3 text-[.84rem] mt-1 tracking-[.03em]">Pri 6. návšteve vás čaká rituál s darčekom.</div>
                  </div>
                ) : (
                  <p className="font-sans font-light text-ink3 text-[.86rem] leading-relaxed tracking-[.03em] text-center w-full">
                    {stamps < 5
                      ? 'Klikajte na kruhy a vyskúšajte si zbieranie pečiatok.'
                      : 'Máte 5 pečiatok — kliknite na zlatý darček a uplatnite odmenu!'}
                  </p>
                )}
              </div>

              {(stamps > 0 || reward) && (
                <button onClick={reset} className="mt-4 self-center font-sans text-[.66rem] tracking-caps uppercase text-ink3 hover:text-goldDeep transition-colors">
                  Vynulovať kartu
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes auraFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(460px) rotate(420deg); opacity: 0; }
        }
        @keyframes auraPulse {
          0%,100% { box-shadow: 0 14px 30px -12px rgba(62,39,39,0.55); }
          50% { box-shadow: 0 0 0 6px rgba(62,39,39,0.12), 0 14px 30px -12px rgba(62,39,39,0.55); }
        }
      `}</style>
    </section>
  );
}



// ===== Certifikaty =====
// ── Certifikáty — diskrétne známky kvality (glass grid) ─────────
function Certifikaty() {
  const ref = useReveal();

  const certs = [
    {
      icon: 'leaf',
      title: 'Natural Nails',
      body: (<>Certifikované školenie „Natural Nails" (Juliannea Academy / Ruscona). Zamerané na <em className="italic" style={{ color: '#8C6E62' }}>čistú, precíznu starostlivosť</em> a zdravý, elegantný vzhľad prírodných nechtov.</>),
    },
    {
      icon: 'almond',
      title: 'Dokonalá mandľa',
      body: (<>Masterclass zameraný na modeláciu, doplnenie a správnu techniku pilovania tvaru mandle. Zaručuje <em className="italic" style={{ color: '#8C6E62' }}>dokonalú symetriu</em> a precízne línie.</>),
    },
    {
      icon: 'wave',
      title: 'Doplnenie bez pilovania',
      body: (<>Špecializovaný kurz na prácu s gélom FLUFFI (Ruscona). Pokročilá technika pre dokonale hladký povrch <em className="italic" style={{ color: '#8C6E62' }}>bez nutnosti dodatočného pilovania</em>, čo šetrí čas klientky.</>),
    },
    {
      icon: 'gem',
      title: 'Babyboomer',
      body: (<>Certifikovaný kurz pre dokonalú modeláciu a <em className="italic" style={{ color: '#8C6E62' }}>precízny, plynulý prechod</em> obľúbeného dizajnu Babyboomer pomocou hubky.</>),
    },
    {
      icon: 'arch',
      title: 'Dual Forms',
      body: (<>Moderná technika predlžovania a modelácie nechtov pomocou horných foriem. Zabezpečuje <em className="italic" style={{ color: '#8C6E62' }}>extrémnu odolnosť</em>, dokonalú architektúru a prirodzený vzhľad nechtov.</>),
    },
  ];

  const num = (i) => String(i + 1).padStart(2, '0');

  // Hairline icon medallion
  const Medallion = ({ icon, big }) => (
    <span className="flex items-center justify-center rounded-full shrink-0"
      style={{ width: big ? '68px' : '52px', height: big ? '68px' : '52px', border: '1px solid rgba(140,110,98,0.4)', color: '#8C6E62', background: 'rgba(255,255,255,0.4)' }}>
      <Icon name={icon} size={big ? 32 : 25} strokeWidth={1.1} />
    </span>
  );

  return (
    <section id="certifikaty" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      {/* ── Pokojné dekoratívne pozadie ─────────────────────────── */}
      <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(247,242,239,0.45) 0%, rgba(238,230,225,0.30) 50%, rgba(247,242,239,0.45) 100%)' }}></div>
      <div className="absolute -z-10 pointer-events-none rounded-full" style={{ top: '-8%', left: '-6%', width: '480px', height: '480px', background: 'radial-gradient(circle, rgba(222,200,192,0.45), transparent 68%)' }}></div>
      <div className="absolute -z-10 pointer-events-none rounded-full" style={{ bottom: '-12%', right: '-8%', width: '560px', height: '560px', background: 'radial-gradient(circle, rgba(203,185,176,0.40), transparent 70%)' }}></div>
      <div className="absolute inset-0 -z-10 pointer-events-none grain" style={{ opacity: 0.5 }}></div>
      <div className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center select-none">
        <span className="font-display italic" style={{ fontSize: 'clamp(7rem, 22vw, 22rem)', color: 'rgba(140,110,98,0.05)', lineHeight: 1, letterSpacing: '.02em' }}>Ruscona</span>
      </div>

      <div className="relative mx-auto max-w-[1180px] px-6 sm:px-10">
        <div className="reveal text-center max-w-2xl mx-auto mb-14">
          <Eyebrow center>Odbornosť & vzdelanie</Eyebrow>
          <h2 className="font-display font-normal text-ink mt-5 leading-[1.06]" style={{ fontSize: 'clamp(2.1rem,4.4vw,3.4rem)' }}>
            Certifikáty a <span className="italic" style={{ color: '#8C6E62' }}>kvalita</span>
          </h2>
          <p className="font-sans font-light text-ink2 mt-5 leading-[1.8] tracking-[.03em] max-w-md mx-auto">
            Diskrétne známky kvality, ktoré stoja za precíznou prácou Michaely.
          </p>
        </div>

        {/* Bento grid — prvá karta dominuje */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 auto-rows-fr">

          {/* Dominantná karta — Natural Nails */}
          <article className="reveal lift glass rounded-[28px] p-8 sm:p-10 flex flex-col sm:col-span-2 lg:row-span-2 lg:col-span-1"
            style={{ border: '1px solid rgba(203,185,176,0.6)', background: 'rgba(222,200,192,0.28)' }}>
            <div className="flex items-center justify-between mb-7">
              <Medallion icon={certs[0].icon} big />
              <span className="font-display leading-none" style={{ fontSize: '2.4rem', color: 'rgba(157,139,132,0.5)' }}>{num(0)}</span>
            </div>
            <div className="eyebrow mb-3" style={{ color: '#8C6E62', fontSize: '.58rem', letterSpacing: '.24em' }}>Hlavná špecializácia</div>
            <h3 className="font-display text-ink leading-tight" style={{ fontSize: 'clamp(1.9rem,2.6vw,2.4rem)' }}>{certs[0].title}</h3>
            <div className="h-px w-12 my-5" style={{ background: 'rgba(140,110,98,0.45)' }}></div>
            <p className="font-sans font-light text-ink2 text-[.98rem] leading-[1.8] tracking-[.02em]">{certs[0].body}</p>
          </article>

          {/* Ostatné certifikáty */}
          {certs.slice(1).map((c, idx) => {
            const i = idx + 1;
            return (
              <article key={i}
                className="reveal lift glass rounded-[26px] p-7 sm:p-8 flex flex-col"
                style={{ transitionDelay: `${(idx % 2) * 90}ms`, border: '1px solid rgba(203,185,176,0.55)' }}>
                <div className="flex items-center justify-between mb-6">
                  <Medallion icon={c.icon} />
                  <span className="font-display leading-none" style={{ fontSize: '2rem', color: 'rgba(157,139,132,0.5)' }}>{num(i)}</span>
                </div>
                <h3 className="font-display text-ink leading-tight" style={{ fontSize: '1.5rem' }}>{c.title}</h3>
                <div className="h-px w-10 my-4" style={{ background: 'rgba(140,110,98,0.45)' }}></div>
                <p className="font-sans font-light text-ink2 text-[.92rem] leading-[1.7] tracking-[.02em]">{c.body}</p>
              </article>
            );
          })}

          {/* Ruscona note — celá šírka, tichý banner */}
          <div className="reveal lift glass-blush rounded-[26px] px-8 py-7 flex items-center gap-5 sm:col-span-2 lg:col-span-3"
            style={{ border: '1px solid rgba(203,185,176,0.55)' }}>
            <span className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: '48px', height: '48px', border: '1px solid rgba(140,110,98,0.4)', color: '#8C6E62' }}>
              <Icon name="sparkle" size={22} strokeWidth={1.1} />
            </span>
            <p className="font-display italic text-ink leading-snug" style={{ fontSize: '1.18rem' }}>
              Všetky školenia boli absolvované pod vedením certifikovanej lektorky pre prémiovú značku Ruscona®.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}



// ===== Booking =====
// ── Rezervácia — náš vlastný 3-krokový formulár (v štýle webu) ───
function Booking({ prefill }) {
  const ref = useReveal();

  const baseServices = ['Gélové nechty', 'Manikúra', 'Japonská manikúra', 'Nail art', 'Iné'];
  const times = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const [service, setService] = useState('Gélové nechty');
  const [picked, setPicked] = useState(null);   // konkrétna služba z cenníka { service, price }
  const [day, setDay] = useState(null);
  const [time, setTime] = useState('10:00');
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState('');

  // ► Sem chodia rezervácie (e-mail Michaely)
  const BOOKING_EMAIL = 'michaelafoltanova3@gmail.com';

  // Predvyplnenie služby z kvízu alebo cenníka
  useEffect(() => {
    if (prefill && prefill.service) {
      setService(prefill.service);
      setPicked(prefill.price ? { service: prefill.service, price: prefill.price } : null);
    }
  }, [prefill]);

  // Zoznam štítkov — ak prišla konkrétna služba mimo základných, pridáme ju dopredu
  const services = (prefill && prefill.service && !baseServices.includes(prefill.service))
    ? [prefill.service, ...baseServices]
    : baseServices;

  // ── Mesačný kalendár ──
  const dowHead = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
  const dNames = ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'];
  const mNames = ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December'];
  const mShort = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [viewYM, setViewYM] = useState({ y: today.getFullYear(), m: today.getMonth() });

  const pad = (n) => String(n).padStart(2, '0');
  const dayKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

  // bunky mriežky (Po–Ne), prázdne pred 1. dňom
  const firstDow = (new Date(viewYM.y, viewYM.m, 1).getDay() + 6) % 7; // Po=0
  const daysInMonth = new Date(viewYM.y, viewYM.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isPast = (d) => new Date(viewYM.y, viewYM.m, d) < today;
  const isToday = (d) => viewYM.y === today.getFullYear() && viewYM.m === today.getMonth() && d === today.getDate();
  const atCurrentMonth = viewYM.y === today.getFullYear() && viewYM.m === today.getMonth();
  const stepMonth = (dir) => setViewYM((v) => {
    let m = v.m + dir, y = v.y;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    return { y, m };
  });

  const formatDay = (key) => {
    if (!key) return null;
    const [y, m, d] = key.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return `${dNames[dt.getDay()]} ${d}. ${mShort[m - 1]}`;
  };

  const Field = ({ label, children }) => (
    <div>
      <div className="eyebrow text-goldDeep mb-2.5" style={{ fontSize: '.62rem', letterSpacing: '.22em' }}>{label}</div>
      {children}
    </div>
  );

  const inputCls = 'w-full font-sans font-light text-[15px] text-ink bg-white border rounded-xl px-4 py-3 outline-none focus:border-gold transition-colors';

  const selectedDay = formatDay(day);

  // Odoslanie rezervácie na e-mail cez FormSubmit (bez registrácie)
  const submitBooking = async (e) => {
    e.preventDefault();
    if (sending) return;
    setErr('');
    setSending(true);
    const payload = {
      _subject: `Nová rezervácia — ${service}`,
      Sluzba: picked && picked.price ? `${service} (${picked.price})` : service,
      Den: selectedDay || 'neuvedený',
      Cas: time,
      Meno: name,
      Telefon: phone,
      Poznamka: note || '—',
      _template: 'table',
    };
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${BOOKING_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('bad status');
      setSent(true);
    } catch (e2) {
      // Záloha: otvorí e-mailového klienta s predvyplnenou správou
      const body = `Služba: ${payload.Sluzba}%0D%0ADeň: ${payload.Den}%0D%0AČas: ${time}%0D%0AMeno: ${name}%0D%0ATelefón: ${phone}%0D%0APoznámka: ${note || '—'}`;
      window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent('Nová rezervácia — ' + service)}&body=${body}`;
      setErr('Odoslanie cez web zlyhalo — otvoril sa váš e-mail. Alebo nám zavolajte na +421 915 539 600.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="kontakt" ref={ref} className="bg-ink py-24 sm:py-32 relative overflow-hidden">
      {/* Fotka na pozadí + espresso závoj */}
      <img src="assets/photos/kontakt-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.5 }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(46,30,30,0.92) 0%, rgba(46,30,30,0.78) 45%, rgba(62,39,39,0.55) 100%)' }}></div>
      <div className="pointer-events-none absolute -bottom-40 -left-32 w-[560px] h-[560px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(203,185,176,0.4), transparent 62%)' }}></div>

      <div className="relative mx-auto max-w-[1140px] px-6 sm:px-10 grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-14 items-center">
        {/* info */}
        <div className="reveal min-w-0">
          <Eyebrow light>Rezervácia</Eyebrow>
          <h2 className="font-display font-light text-porcelain mt-6 leading-[1.08]" style={{ fontSize: 'clamp(2.2rem,4vw,3.4rem)' }}>
            Doprajte si chvíľu<br/>len pre seba
          </h2>
          <p className="font-sans font-light mt-6 leading-[1.8] text-[1.04rem]" style={{ color: 'rgba(247,242,239,0.72)' }}>
            Vyberte si službu, deň a čas — ja sa vám ozvem s potvrdením presného termínu.
            Teším sa na vás.
          </p>
          <div className="mt-10 space-y-5">
            {[
              ['pin', 'Námestie Baníkov 2 · 972 51 Handlová', null],
              ['phone', '+421 915 539 600', 'tel:+421915539600'],
              ['instagram', '@aura_nails_mf', 'https://www.instagram.com/aura_nails_mf/'],
              ['clock', 'Pondelok – Nedeľa · na objednávku', null],
            ].map(([icon, text, href], i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
                  style={{ border: '1px solid rgba(203,185,176,0.35)', color: '#CBB9B0' }}>
                  <Icon name={icon} size={18} />
                </span>
                {href
                  ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="font-sans font-light text-[1.02rem] transition-colors hover:text-champagne" style={{ color: 'rgba(247,242,239,0.88)' }}>{text}</a>
                  : <span className="font-sans font-light text-[1.02rem]" style={{ color: 'rgba(247,242,239,0.88)' }}>{text}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* formulár v glass karte */}
        <div className="reveal min-w-0">
          <div className="rounded-[26px] p-6 sm:p-7"
            style={{ background: 'rgba(247,242,239,0.92)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 50px 100px -40px rgba(0,0,0,0.5)' }}>

            {sent ? (
              <div className="text-center py-10">
                <span className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-6"
                  style={{ border: '1px solid rgba(181,142,80,0.4)', color: '#94733B' }}>
                  <Icon name="check" size={30} />
                </span>
                <h3 className="font-display text-3xl text-ink">Ďakujem!</h3>
                <p className="font-sans font-light text-ink2 mt-3 max-w-xs mx-auto leading-relaxed">
                  Vašu žiadosť som prijala:<br/>
                  <span className="text-ink">{service}</span>
                  {selectedDay && <> · {selectedDay}</>} · {time}.
                  <br/>Ozvem sa vám čo najskôr s potvrdením. 🤍
                </p>
                <button onClick={() => { setSent(false); setName(''); setPhone(''); setNote(''); setDay(null); }} className="mt-7 font-sans text-[.72rem] tracking-[.2em] uppercase text-goldDeep border-b border-gold/40 pb-1">
                  Nová rezervácia
                </button>
              </div>
            ) : (
              <form onSubmit={submitBooking} className="space-y-5">
                {/* Zvýraznená vybraná služba (z cenníka) */}
                {picked && (
                  <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl"
                    style={{ background: 'rgba(231,205,188,0.5)', border: '1px solid rgba(181,142,80,0.35)' }}>
                    <span className="flex items-center justify-center w-9 h-9 rounded-full shrink-0" style={{ background: '#B58E50', color: '#F7F2EF' }}>
                      <Icon name="sparkle" size={16} />
                    </span>
                    <div className="min-w-0">
                      <div className="eyebrow text-goldDeep" style={{ fontSize: '.54rem', letterSpacing: '.2em' }}>Objednávate</div>
                      <div className="font-display text-ink text-[1.25rem] leading-tight truncate">{picked.service}{picked.price ? <span className="text-goldDeep"> · {picked.price}</span> : null}</div>
                    </div>
                  </div>
                )}

                {/* 1 — služba */}
                <Field label="1 · Služba">
                  <div className="flex flex-wrap gap-2.5">
                    {services.map((s) => (
                      <button type="button" key={s} onClick={() => { setService(s); setPicked(null); }}
                        className="font-sans text-[.82rem] tracking-[.04em] px-4 py-2 rounded-full border transition-all duration-300"
                        style={service === s
                          ? { background: '#E7CDBC', borderColor: '#E7CDBC', color: '#3E2727' }
                          : { background: 'transparent', borderColor: 'rgba(62,39,39,0.18)', color: '#6E5B55' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>

                {/* 2 — deň (mesačný kalendár) */}
                <Field label="2 · Deň">
                  <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(62,39,39,0.10)' }}>
                    {/* hlavička s prepínaním mesiacov */}
                    <div className="flex items-center justify-between mb-3">
                      <button type="button" onClick={() => stepMonth(-1)} disabled={atCurrentMonth}
                        className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                        style={{ border: '1px solid rgba(62,39,39,0.16)', color: atCurrentMonth ? 'rgba(62,39,39,0.2)' : '#6E5B55', cursor: atCurrentMonth ? 'not-allowed' : 'pointer' }}
                        aria-label="Predošlý mesiac">
                        <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={14} /></span>
                      </button>
                      <span className="font-display text-ink text-[1.25rem]">{mNames[viewYM.m]} {viewYM.y}</span>
                      <button type="button" onClick={() => stepMonth(1)}
                        className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                        style={{ border: '1px solid rgba(62,39,39,0.16)', color: '#6E5B55' }}
                        aria-label="Ďalší mesiac">
                        <Icon name="arrow" size={14} />
                      </button>
                    </div>
                    {/* dni v týždni */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {dowHead.map((h) => (
                        <div key={h} className="text-center font-sans uppercase" style={{ fontSize: '.56rem', letterSpacing: '.12em', color: '#9D8B84', padding: '4px 0' }}>{h}</div>
                      ))}
                    </div>
                    {/* mriežka dní */}
                    <div className="grid grid-cols-7 gap-1">
                      {cells.map((d, i) => {
                        if (d === null) return <div key={`e${i}`}></div>;
                        const key = dayKey(viewYM.y, viewYM.m, d);
                        const past = isPast(d);
                        const on = key === day;
                        return (
                          <button type="button" key={key} disabled={past} onClick={() => setDay(key)}
                            className="aspect-square flex items-center justify-center rounded-lg font-sans text-[.92rem] transition-all duration-200"
                            style={{
                              background: on ? '#3E2727' : 'transparent',
                              color: on ? '#F7F2EF' : past ? 'rgba(62,39,39,0.22)' : '#3E2727',
                              border: isToday(d) && !on ? '1px solid rgba(181,142,80,0.6)' : '1px solid transparent',
                              cursor: past ? 'default' : 'pointer',
                              fontWeight: on ? 500 : 300,
                            }}>
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {day && (
                    <div className="mt-2.5 font-sans text-[.82rem] tracking-[.04em]" style={{ color: '#8C6E62' }}>
                      Vybraný deň: <span className="font-display text-[1.05rem] text-ink">{formatDay(day)}</span>
                    </div>
                  )}
                </Field>

                {/* 3 — čas */}
                <Field label="3 · Čas">
                  <div className="flex flex-wrap gap-2.5">
                    {times.map((t) => (
                      <button type="button" key={t} onClick={() => setTime(t)}
                        className="font-sans text-[.85rem] tracking-[.06em] px-5 py-2.5 rounded-full border transition-all duration-300"
                        style={time === t
                          ? { background: '#B58E50', borderColor: '#B58E50', color: '#F7F2EF' }
                          : { background: 'transparent', borderColor: 'rgba(62,39,39,0.18)', color: '#6E5B55' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </Field>

                {/* kontakt */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Vaše meno" className={inputCls} style={{ borderColor: 'rgba(62,39,39,0.12)' }} />
                  <input required value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Telefón (+421)" className={inputCls} style={{ borderColor: 'rgba(62,39,39,0.12)' }} />
                </div>
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Poznámka (nepovinné)" className={inputCls} style={{ borderColor: 'rgba(62,39,39,0.12)' }} />

                {err && <p className="font-sans font-light text-[.82rem] text-center" style={{ color: '#B5544F' }}>{err}</p>}

                <button type="submit" disabled={sending}
                  className="lift w-full inline-flex items-center justify-center gap-2.5 font-sans uppercase rounded-full text-[.74rem] tracking-[.24em] py-[15px] bg-gold text-porcelain hover:bg-goldDeep transition-colors"
                  style={{ boxShadow: '0 18px 40px -16px rgba(181,142,80,0.6)', opacity: sending ? 0.7 : 1 }}>
                  {sending ? 'Odosielam…' : <>Odoslať rezerváciu <Icon name="heartArrow" size={16} /></>}
                </button>
                <p className="font-sans font-light text-[.78rem] text-center text-ink3 tracking-[.02em]">
                  Nezáväzná žiadosť — termín vám potvrdím osobne.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}



// ===== Footer =====
// ── Footer ──────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t py-14" style={{ background: 'rgba(247,242,239,0.55)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderColor: 'rgba(62,39,39,0.08)' }}>
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <Wordmark />
        <nav className="flex flex-wrap items-center justify-center gap-7">
          {[['Filozofia', '#filozofia'], ['Služby', '#sluzby'], ['O mne', '#o-mne'], ['Galéria', 'gallery'], ['Kontakt', '#kontakt']].map(([l, h]) => (
            <a key={h} href={h === 'gallery' ? '#' : h}
              onClick={(e) => { if (h === 'gallery') { e.preventDefault(); window.dispatchEvent(new Event('aura:open-gallery')); } }}
              className="font-sans text-[.72rem] tracking-caps uppercase text-ink2 hover:text-goldDeep transition-colors cursor-pointer">{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {[
            ['instagram', 'https://www.instagram.com/aura_nails_mf/'],
            ['facebook', 'https://www.facebook.com/profile.php?id=61579592324120'],
          ].map(([ic, href]) => (
            <a key={ic} href={href} target="_blank" rel="noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full border border-ink/12 text-ink2 hover:text-goldDeep hover:border-gold/40 transition-all">
              <Icon name={ic} size={18} />
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10 mt-10 pt-7 border-t border-ink/8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-sans text-[.72rem] tracking-[.1em] text-ink3">© 2026 Aura Nails MF · Handlová</p>
        <p className="font-sans text-[.72rem] tracking-[.1em] text-ink3">Vytvorené s láskou k detailu</p>
      </div>
    </footer>
  );
}



// ===== App =====
// ── App ─────────────────────────────────────────────────────────
function App() {
  const [prefill, setPrefill] = useState(null);
  const onBook = (data) => {
    setPrefill({ ...data });
    const el = document.getElementById('kontakt');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 8, behavior: 'smooth' });
  };
  useEffect(() => {
    // Force-mute every video (React's JSX `muted` prop is unreliable —
    // it must be set as a DOM property to actually silence playback).
    const mute = () => document.querySelectorAll('video').forEach((v) => {
      v.muted = true; v.defaultMuted = true; v.volume = 0; v.removeAttribute('controls');
    });
    mute();
    const mt = setInterval(mute, 1000);
    setTimeout(() => clearInterval(mt), 5000);
    // Global reveal fallback: ensures nothing stays hidden if a
    // per-section scroll handler doesn't fire (e.g. headless capture).
    const reveal = () => {
      const vh = window.innerHeight;
      document.querySelectorAll('.reveal').forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) n.classList.add('in');
      });
    };
    reveal();
    window.addEventListener('scroll', reveal, { passive: true });
    const t = setTimeout(() => document.querySelectorAll('.reveal').forEach((n) => n.classList.add('in')), 1400);
    return () => { window.removeEventListener('scroll', reveal); clearTimeout(t); clearInterval(mt); };
  }, []);
  return (
    <React.Fragment>
      <Nav />
      <main>
        <Hero />
        <Philosophy />
        <Services onBook={onBook} />
        <Premeny />
        <Quiz onBook={onBook} />
        <About />
        <Certifikaty />
        <AuraPass />
        <Booking prefill={prefill} />
      </main>
      <Footer />
      <GalleryModal />
    </React.Fragment>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);


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
Object.assign(window, { Nav });

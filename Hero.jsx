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
Object.assign(window, { Hero });

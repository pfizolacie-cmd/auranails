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
          {['instagram', 'facebook'].map((ic) => (
            <a key={ic} href="#" className="flex items-center justify-center w-10 h-10 rounded-full border border-ink/12 text-ink2 hover:text-goldDeep hover:border-gold/40 transition-all">
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
Object.assign(window, { Footer });

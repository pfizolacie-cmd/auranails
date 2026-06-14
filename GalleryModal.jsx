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
Object.assign(window, { GalleryModal });

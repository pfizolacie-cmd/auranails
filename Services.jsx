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
          <nav className="relative p-3 sm:p-5 lg:p-6 lg:border-r" style={{ borderColor: 'rgba(62,39,39,0.10)' }}>
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
          <div className="p-7 sm:p-10 lg:p-12" style={{ transition: 'opacity .26s ease', opacity: fading ? 0 : 1 }}>
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <div className="eyebrow" style={{ color: '#8C6E62', fontSize: '.6rem', letterSpacing: '.24em' }}>{cat.kicker}</div>
                <h3 className="font-display text-ink mt-2 leading-[1.05]" style={{ fontSize: 'clamp(1.9rem,3.4vw,2.7rem)' }}>{cat.title}</h3>
                <p className="font-sans font-light text-ink3 text-[.92rem] mt-3 max-w-sm leading-relaxed tracking-[.03em]">{cat.blurb}</p>
              </div>
              <div className="shrink-0 hidden sm:block relative overflow-hidden rounded-[20px]" style={{ width: '128px', height: '128px', border: '1px solid rgba(255,255,255,0.5)' }}>
                <img src={`assets/photos/${cat.photo}.png`} alt={cat.title} className="w-full h-full object-cover" />
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
Object.assign(window, { Services });

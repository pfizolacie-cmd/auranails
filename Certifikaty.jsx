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
Object.assign(window, { Certifikaty });

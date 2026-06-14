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
Object.assign(window, { About });

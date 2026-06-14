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
Object.assign(window, { Premeny });

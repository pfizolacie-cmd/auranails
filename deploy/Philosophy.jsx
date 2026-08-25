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
Object.assign(window, { Philosophy });

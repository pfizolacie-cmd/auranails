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
Object.assign(window, { AuraPass });

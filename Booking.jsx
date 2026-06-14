// ── Rezervácia — náš vlastný 3-krokový formulár (v štýle webu) ───
function Booking({ prefill }) {
  const ref = useReveal();

  const baseServices = ['Gélové nechty', 'Manikúra', 'Japonská manikúra', 'Nail art', 'Iné'];
  const times = ['9:00', '10:30', '13:00', '15:30', '17:00'];

  const [service, setService] = useState('Gélové nechty');
  const [picked, setPicked] = useState(null);   // konkrétna služba z cenníka { service, price }
  const [day, setDay] = useState(null);
  const [time, setTime] = useState('10:30');
  const [sent, setSent] = useState(false);

  // Predvyplnenie služby z kvízu alebo cenníka
  useEffect(() => {
    if (prefill && prefill.service) {
      setService(prefill.service);
      setPicked(prefill.price ? { service: prefill.service, price: prefill.price } : null);
    }
  }, [prefill]);

  // Zoznam štítkov — ak prišla konkrétna služba mimo základných, pridáme ju dopredu
  const services = (prefill && prefill.service && !baseServices.includes(prefill.service))
    ? [prefill.service, ...baseServices]
    : baseServices;

  // Najbližších 14 dní (preskočiť dnešok)
  const days = [];
  const dNames = ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'];
  const mNames = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];
  for (let i = 1; i <= 14; i++) {
    const dt = new Date();
    dt.setDate(dt.getDate() + i);
    days.push({ key: dt.toISOString().slice(0, 10), dow: dNames[dt.getDay()], d: dt.getDate(), m: mNames[dt.getMonth()], weekend: dt.getDay() === 0 });
  }

  const Field = ({ label, children }) => (
    <div>
      <div className="eyebrow text-goldDeep mb-2.5" style={{ fontSize: '.62rem', letterSpacing: '.22em' }}>{label}</div>
      {children}
    </div>
  );

  const inputCls = 'w-full font-sans font-light text-[15px] text-ink bg-white border rounded-xl px-4 py-3 outline-none focus:border-gold transition-colors';

  const selectedDay = days.find((d) => d.key === day);

  return (
    <section id="kontakt" ref={ref} className="bg-ink py-24 sm:py-32 relative overflow-hidden">
      {/* Fotka na pozadí + espresso závoj */}
      <img src="assets/photos/kontakt-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.5 }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(46,30,30,0.92) 0%, rgba(46,30,30,0.78) 45%, rgba(62,39,39,0.55) 100%)' }}></div>
      <div className="pointer-events-none absolute -bottom-40 -left-32 w-[560px] h-[560px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(203,185,176,0.4), transparent 62%)' }}></div>

      <div className="relative mx-auto max-w-[1140px] px-6 sm:px-10 grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-14 items-center">
        {/* info */}
        <div className="reveal">
          <Eyebrow light>Rezervácia</Eyebrow>
          <h2 className="font-display font-light text-porcelain mt-6 leading-[1.08]" style={{ fontSize: 'clamp(2.2rem,4vw,3.4rem)' }}>
            Doprajte si chvíľu<br/>len pre seba
          </h2>
          <p className="font-sans font-light mt-6 leading-[1.8] text-[1.04rem]" style={{ color: 'rgba(247,242,239,0.72)' }}>
            Vyberte si službu, deň a čas — ja sa vám ozvem s potvrdením presného termínu.
            Teším sa na vás.
          </p>
          <div className="mt-10 space-y-5">
            {[
              ['pin', 'Námestie Baníkov 2 · 972 51 Handlová'],
              ['phone', '+421 915 539 600'],
              ['instagram', '@aura_nails_mf'],
              ['clock', 'Pondelok – Nedeľa · na objednávku'],
            ].map(([icon, text], i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
                  style={{ border: '1px solid rgba(203,185,176,0.35)', color: '#CBB9B0' }}>
                  <Icon name={icon} size={18} />
                </span>
                <span className="font-sans font-light text-[1.02rem]" style={{ color: 'rgba(247,242,239,0.88)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* formulár v glass karte */}
        <div className="reveal">
          <div className="rounded-[26px] p-6 sm:p-7"
            style={{ background: 'rgba(247,242,239,0.92)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 50px 100px -40px rgba(0,0,0,0.5)' }}>

            {sent ? (
              <div className="text-center py-10">
                <span className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-6"
                  style={{ border: '1px solid rgba(181,142,80,0.4)', color: '#94733B' }}>
                  <Icon name="check" size={30} />
                </span>
                <h3 className="font-display text-3xl text-ink">Ďakujem!</h3>
                <p className="font-sans font-light text-ink2 mt-3 max-w-xs mx-auto leading-relaxed">
                  Vašu žiadosť som prijala:<br/>
                  <span className="text-ink">{service}</span>
                  {selectedDay && <> · {selectedDay.dow} {selectedDay.d}. {selectedDay.m}</>} · {time}.
                  <br/>Ozvem sa vám čo najskôr s potvrdením. 🤍
                </p>
                <button onClick={() => setSent(false)} className="mt-7 font-sans text-[.72rem] tracking-[.2em] uppercase text-goldDeep border-b border-gold/40 pb-1">
                  Nová rezervácia
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5">
                {/* Zvýraznená vybraná služba (z cenníka) */}
                {picked && (
                  <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl"
                    style={{ background: 'rgba(231,205,188,0.5)', border: '1px solid rgba(181,142,80,0.35)' }}>
                    <span className="flex items-center justify-center w-9 h-9 rounded-full shrink-0" style={{ background: '#B58E50', color: '#F7F2EF' }}>
                      <Icon name="sparkle" size={16} />
                    </span>
                    <div className="min-w-0">
                      <div className="eyebrow text-goldDeep" style={{ fontSize: '.54rem', letterSpacing: '.2em' }}>Objednávate</div>
                      <div className="font-display text-ink text-[1.25rem] leading-tight truncate">{picked.service}{picked.price ? <span className="text-goldDeep"> · {picked.price}</span> : null}</div>
                    </div>
                  </div>
                )}

                {/* 1 — služba */}
                <Field label="1 · Služba">
                  <div className="flex flex-wrap gap-2.5">
                    {services.map((s) => (
                      <button type="button" key={s} onClick={() => { setService(s); setPicked(null); }}
                        className="font-sans text-[.82rem] tracking-[.04em] px-4 py-2 rounded-full border transition-all duration-300"
                        style={service === s
                          ? { background: '#E7CDBC', borderColor: '#E7CDBC', color: '#3E2727' }
                          : { background: 'transparent', borderColor: 'rgba(62,39,39,0.18)', color: '#6E5B55' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>

                {/* 2 — deň */}
                <Field label="2 · Deň">
                  <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                    {days.map((d) => {
                      const on = d.key === day;
                      return (
                        <button type="button" key={d.key} onClick={() => setDay(d.key)}
                          className="shrink-0 flex flex-col items-center justify-center rounded-xl transition-all duration-300"
                          style={{
                            width: '54px', height: '64px',
                            background: on ? '#3E2727' : 'rgba(255,255,255,0.7)',
                            border: on ? '1px solid #3E2727' : '1px solid rgba(62,39,39,0.12)',
                            color: on ? '#F7F2EF' : (d.weekend ? '#B58E50' : '#3E2727'),
                          }}>
                          <span className="font-sans text-[.58rem] tracking-[.12em] uppercase" style={{ opacity: 0.7 }}>{d.dow}</span>
                          <span className="font-display text-[1.3rem] leading-none mt-0.5">{d.d}</span>
                          <span className="font-sans text-[.52rem] tracking-[.1em] uppercase mt-0.5" style={{ opacity: 0.6 }}>{d.m}</span>
                        </button>
                      );
                    })}
                  </div>
                </Field>

                {/* 3 — čas */}
                <Field label="3 · Čas">
                  <div className="flex flex-wrap gap-2.5">
                    {times.map((t) => (
                      <button type="button" key={t} onClick={() => setTime(t)}
                        className="font-sans text-[.85rem] tracking-[.06em] px-5 py-2.5 rounded-full border transition-all duration-300"
                        style={time === t
                          ? { background: '#B58E50', borderColor: '#B58E50', color: '#F7F2EF' }
                          : { background: 'transparent', borderColor: 'rgba(62,39,39,0.18)', color: '#6E5B55' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </Field>

                {/* kontakt */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <input required placeholder="Vaše meno" className={inputCls} style={{ borderColor: 'rgba(62,39,39,0.12)' }} />
                  <input required placeholder="Telefón (+421)" className={inputCls} style={{ borderColor: 'rgba(62,39,39,0.12)' }} />
                </div>

                <button type="submit"
                  className="lift w-full inline-flex items-center justify-center gap-2.5 font-sans uppercase rounded-full text-[.74rem] tracking-[.24em] py-[15px] bg-gold text-porcelain hover:bg-goldDeep transition-colors"
                  style={{ boxShadow: '0 18px 40px -16px rgba(181,142,80,0.6)' }}>
                  Odoslať rezerváciu <Icon name="heartArrow" size={16} />
                </button>
                <p className="font-sans font-light text-[.78rem] text-center text-ink3 tracking-[.02em]">
                  Nezáväzná žiadosť — termín vám potvrdím osobne.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Booking });

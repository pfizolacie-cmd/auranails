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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState('');

  // ► Sem chodia rezervácie (e-mail Michaely)
  const BOOKING_EMAIL = 'michaelafoltanova3@gmail.com';

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

  // ── Mesačný kalendár ──
  const dowHead = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
  const dNames = ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'];
  const mNames = ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December'];
  const mShort = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [viewYM, setViewYM] = useState({ y: today.getFullYear(), m: today.getMonth() });

  const pad = (n) => String(n).padStart(2, '0');
  const dayKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

  // bunky mriežky (Po–Ne), prázdne pred 1. dňom
  const firstDow = (new Date(viewYM.y, viewYM.m, 1).getDay() + 6) % 7; // Po=0
  const daysInMonth = new Date(viewYM.y, viewYM.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isPast = (d) => new Date(viewYM.y, viewYM.m, d) < today;
  const isToday = (d) => viewYM.y === today.getFullYear() && viewYM.m === today.getMonth() && d === today.getDate();
  const atCurrentMonth = viewYM.y === today.getFullYear() && viewYM.m === today.getMonth();
  const stepMonth = (dir) => setViewYM((v) => {
    let m = v.m + dir, y = v.y;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    return { y, m };
  });

  const formatDay = (key) => {
    if (!key) return null;
    const [y, m, d] = key.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return `${dNames[dt.getDay()]} ${d}. ${mShort[m - 1]}`;
  };

  const Field = ({ label, children }) => (
    <div>
      <div className="eyebrow text-goldDeep mb-2.5" style={{ fontSize: '.62rem', letterSpacing: '.22em' }}>{label}</div>
      {children}
    </div>
  );

  const inputCls = 'w-full font-sans font-light text-[15px] text-ink bg-white border rounded-xl px-4 py-3 outline-none focus:border-gold transition-colors';

  const selectedDay = formatDay(day);

  // Odoslanie rezervácie na e-mail cez FormSubmit (bez registrácie)
  const submitBooking = async (e) => {
    e.preventDefault();
    if (sending) return;
    setErr('');
    setSending(true);
    const payload = {
      _subject: `Nová rezervácia — ${service}`,
      Sluzba: picked && picked.price ? `${service} (${picked.price})` : service,
      Den: selectedDay || 'neuvedený',
      Cas: time,
      Meno: name,
      Telefon: phone,
      Poznamka: note || '—',
      _template: 'table',
    };
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${BOOKING_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('bad status');
      setSent(true);
    } catch (e2) {
      // Záloha: otvorí e-mailového klienta s predvyplnenou správou
      const body = `Služba: ${payload.Sluzba}%0D%0ADeň: ${payload.Den}%0D%0AČas: ${time}%0D%0AMeno: ${name}%0D%0ATelefón: ${phone}%0D%0APoznámka: ${note || '—'}`;
      window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent('Nová rezervácia — ' + service)}&body=${body}`;
      setErr('Odoslanie cez web zlyhalo — otvoril sa váš e-mail. Alebo nám zavolajte na +421 915 539 600.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="kontakt" ref={ref} className="bg-ink py-24 sm:py-32 relative overflow-hidden">
      {/* Fotka na pozadí + espresso závoj */}
      <img src="assets/photos/kontakt-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.5 }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(46,30,30,0.92) 0%, rgba(46,30,30,0.78) 45%, rgba(62,39,39,0.55) 100%)' }}></div>
      <div className="pointer-events-none absolute -bottom-40 -left-32 w-[560px] h-[560px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(203,185,176,0.4), transparent 62%)' }}></div>

      <div className="relative mx-auto max-w-[1140px] px-6 sm:px-10 grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-14 items-center">
        {/* info */}
        <div className="reveal min-w-0">
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
              ['pin', 'Námestie Baníkov 2 · 972 51 Handlová', null],
              ['phone', '+421 915 539 600', 'tel:+421915539600'],
              ['instagram', '@aura_nails_mf', 'https://www.instagram.com/aura_nails_mf/'],
              ['clock', 'Pondelok – Nedeľa · na objednávku', null],
            ].map(([icon, text, href], i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
                  style={{ border: '1px solid rgba(203,185,176,0.35)', color: '#CBB9B0' }}>
                  <Icon name={icon} size={18} />
                </span>
                {href
                  ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="font-sans font-light text-[1.02rem] transition-colors hover:text-champagne" style={{ color: 'rgba(247,242,239,0.88)' }}>{text}</a>
                  : <span className="font-sans font-light text-[1.02rem]" style={{ color: 'rgba(247,242,239,0.88)' }}>{text}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* formulár v glass karte */}
        <div className="reveal min-w-0">
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
                  {selectedDay && <> · {selectedDay}</>} · {time}.
                  <br/>Ozvem sa vám čo najskôr s potvrdením. 🤍
                </p>
                <button onClick={() => { setSent(false); setName(''); setPhone(''); setNote(''); setDay(null); }} className="mt-7 font-sans text-[.72rem] tracking-[.2em] uppercase text-goldDeep border-b border-gold/40 pb-1">
                  Nová rezervácia
                </button>
              </div>
            ) : (
              <form onSubmit={submitBooking} className="space-y-5">
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

                {/* 2 — deň (mesačný kalendár) */}
                <Field label="2 · Deň">
                  <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(62,39,39,0.10)' }}>
                    {/* hlavička s prepínaním mesiacov */}
                    <div className="flex items-center justify-between mb-3">
                      <button type="button" onClick={() => stepMonth(-1)} disabled={atCurrentMonth}
                        className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                        style={{ border: '1px solid rgba(62,39,39,0.16)', color: atCurrentMonth ? 'rgba(62,39,39,0.2)' : '#6E5B55', cursor: atCurrentMonth ? 'not-allowed' : 'pointer' }}
                        aria-label="Predošlý mesiac">
                        <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={14} /></span>
                      </button>
                      <span className="font-display text-ink text-[1.25rem]">{mNames[viewYM.m]} {viewYM.y}</span>
                      <button type="button" onClick={() => stepMonth(1)}
                        className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                        style={{ border: '1px solid rgba(62,39,39,0.16)', color: '#6E5B55' }}
                        aria-label="Ďalší mesiac">
                        <Icon name="arrow" size={14} />
                      </button>
                    </div>
                    {/* dni v týždni */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {dowHead.map((h) => (
                        <div key={h} className="text-center font-sans uppercase" style={{ fontSize: '.56rem', letterSpacing: '.12em', color: '#9D8B84', padding: '4px 0' }}>{h}</div>
                      ))}
                    </div>
                    {/* mriežka dní */}
                    <div className="grid grid-cols-7 gap-1">
                      {cells.map((d, i) => {
                        if (d === null) return <div key={`e${i}`}></div>;
                        const key = dayKey(viewYM.y, viewYM.m, d);
                        const past = isPast(d);
                        const on = key === day;
                        return (
                          <button type="button" key={key} disabled={past} onClick={() => setDay(key)}
                            className="aspect-square flex items-center justify-center rounded-lg font-sans text-[.92rem] transition-all duration-200"
                            style={{
                              background: on ? '#3E2727' : 'transparent',
                              color: on ? '#F7F2EF' : past ? 'rgba(62,39,39,0.22)' : '#3E2727',
                              border: isToday(d) && !on ? '1px solid rgba(181,142,80,0.6)' : '1px solid transparent',
                              cursor: past ? 'default' : 'pointer',
                              fontWeight: on ? 500 : 300,
                            }}>
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {day && (
                    <div className="mt-2.5 font-sans text-[.82rem] tracking-[.04em]" style={{ color: '#8C6E62' }}>
                      Vybraný deň: <span className="font-display text-[1.05rem] text-ink">{formatDay(day)}</span>
                    </div>
                  )}
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
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Vaše meno" className={inputCls} style={{ borderColor: 'rgba(62,39,39,0.12)' }} />
                  <input required value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Telefón (+421)" className={inputCls} style={{ borderColor: 'rgba(62,39,39,0.12)' }} />
                </div>
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Poznámka (nepovinné)" className={inputCls} style={{ borderColor: 'rgba(62,39,39,0.12)' }} />

                {err && <p className="font-sans font-light text-[.82rem] text-center" style={{ color: '#B5544F' }}>{err}</p>}

                <button type="submit" disabled={sending}
                  className="lift w-full inline-flex items-center justify-center gap-2.5 font-sans uppercase rounded-full text-[.74rem] tracking-[.24em] py-[15px] bg-gold text-porcelain hover:bg-goldDeep transition-colors"
                  style={{ boxShadow: '0 18px 40px -16px rgba(181,142,80,0.6)', opacity: sending ? 0.7 : 1 }}>
                  {sending ? 'Odosielam…' : <>Odoslať rezerváciu <Icon name="heartArrow" size={16} /></>}
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

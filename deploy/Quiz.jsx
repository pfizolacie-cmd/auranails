// ── Kvíz nechtového štýlu — Bento ───────────────────────────────
const QUIZ_QUESTIONS = [
  { tag: 'Záťaž', q: 'Ako najčastejšie využívate svoje ruky?',
    a: ['Práca na počítači', 'Manuálna práca a domácnosť', 'Bežná každodenná záťaž'] },
  { tag: 'Tvar lôžka', q: 'Aký je prirodzený tvar vašich nechtov?',
    a: ['Širšie a kratšie', 'Úzke a dlhé', 'Drobné a malé'] },
  { tag: 'Dĺžka', q: 'Akú dĺžku nechtov preferujete?',
    a: ['Krátke a praktické', 'Stredné a elegantné', 'Dlhé a výrazné'] },
  { tag: 'Dizajn', q: 'Aký dizajn sa vám najviac páči?',
    a: ['Čistý nude a minimalizmus', 'Elegancia s jemným zdobením', 'Výrazný Nail Art'] },
];

function quizResult(ans) {
  const [load, bed, len, design] = ans;
  const level = Math.max(len, design);
  const loadTxt = ['Pri práci za počítačom máte ruky neustále na očiach',
    'Pri manuálnej práci a v domácnosti potrebujú nechty predovšetkým odolnosť',
    'Pri bežnej dennej záťaži'][load];
  const bedTxt = ['širšie lôžko opticky predĺžime jemne mandľovým tvarom',
    'úzke a dlhé lôžko krásne podčiarkne elegantnú líniu',
    'drobnejšie lôžko opticky predĺžime starostlivým vytvarovaním'][bed];
  const cap = (s) => s[0].toUpperCase() + s.slice(1);

  if (level === 2) return {
    title: 'Výrazná modeláž s autorským Nail Artom', shape: 'Mandľa / dlhšia oválna', service: 'Gélové nechty – nová modelácia',
    desc: `${loadTxt} a milujete, keď nechty zaujmú. ${cap(bedTxt)}. Pevná modeláž udrží väčšiu dĺžku a vytvorí dokonalý podklad pre výrazné zdobenie, ktoré vydrží týždne.`,
  };
  if (level === 1) return {
    title: 'Elegantná mandľa s gél lakom', shape: 'Mandľový tvar', service: 'Gélové nechty – nová modelácia',
    desc: `${loadTxt}, preto stavíme na nadčasovú eleganciu. ${cap(bedTxt)} a spevnenie gél lakom zabezpečí perfektný, upravený vzhľad bez starostí.`,
  };
  return {
    title: 'Prirodzená krása: nude gél lak', shape: 'Krátky oválny tvar', service: 'Prístrojová / SPA manikúra',
    desc: `${loadTxt}, preto volíme čistý, praktický a nadčasový vzhľad. ${cap(bedTxt)}. Nude gél lak pôsobí decentne, prirodzene spevní necht a vydrží dlhé týždne dokonalý.`,
  };
}

function Quiz({ onBook }) {
  const ref = useReveal();
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState([]);
  const [fading, setFading] = useState(false);
  const isResult = step === 4;
  const progress = isResult ? 100 : (step / QUIZ_QUESTIONS.length) * 100;

  const pick = (i) => {
    if (fading) return;
    const next = [...ans]; next[step] = i; setAns(next);
    setFading(true);
    setTimeout(() => { setStep(step + 1); setFading(false); }, 320);
  };
  const go = (s) => { setFading(true); setTimeout(() => { setStep(s); setFading(false); }, 250); };
  const restart = () => { setFading(true); setTimeout(() => { setAns([]); setStep(0); setFading(false); }, 250); };
  const result = isResult ? quizResult(ans) : null;

  return (
    <section id="kviz" ref={ref} className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-10">
        <div className="reveal text-center mb-12 max-w-2xl mx-auto">
          <Eyebrow center>Kvíz nechtového štýlu</Eyebrow>
          <h2 className="font-display font-normal text-ink mt-6 leading-[1.08]" style={{ fontSize: 'clamp(2.2rem,4.4vw,3.4rem)' }}>
            Nájdite svoj <span className="italic" style={{ color: '#8C6E62' }}>ideálny štýl</span>
          </h2>
          <p className="font-sans font-light text-ink2 mt-5 leading-[1.7] tracking-[.06em]">
            Štyri otázky a Michaela vám odporučí tvar, dĺžku a úpravu na mieru.
          </p>
        </div>

        {/* BENTO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-[minmax(0,auto)] gap-4 sm:gap-5 items-stretch">

          {/* Main interactive card — 2 cols, 2 rows */}
          <div className="reveal glass rounded-[30px] lg:col-span-2 lg:row-span-2 overflow-hidden flex flex-col">
            <div className="px-8 sm:px-11 pt-8">
              <div className="flex items-center justify-between mb-3">
                <span className="eyebrow text-goldDeep" style={{ fontSize: '.62rem', letterSpacing: '.24em' }}>
                  {isResult ? 'Váš výsledok' : `Krok ${step + 1} zo ${QUIZ_QUESTIONS.length}`}
                </span>
                {!isResult && <span className="eyebrow text-ink3" style={{ fontSize: '.62rem', letterSpacing: '.24em' }}>{QUIZ_QUESTIONS[step].tag}</span>}
              </div>
              <div className="h-[3px] w-full rounded-full bg-[rgba(62,39,39,0.10)] relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#CBB9B0,#3E2727)' }}></div>
              </div>
            </div>

            <div className="px-8 sm:px-11 py-9 flex-1 flex flex-col justify-center" style={{ minHeight: '360px', transition: 'opacity .3s ease', opacity: fading ? 0 : 1 }}>
              {!isResult ? (
                <div>
                  <h3 className="font-display text-ink leading-[1.12] mb-8" style={{ fontSize: 'clamp(1.7rem,3vw,2.3rem)' }}>
                    {QUIZ_QUESTIONS[step].q}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {QUIZ_QUESTIONS[step].a.map((opt, i) => {
                      const selected = ans[step] === i;
                      return (
                        <button key={i} onClick={() => pick(i)}
                          className="lift group flex items-center justify-between text-left rounded-2xl px-6 py-[18px] border"
                          style={{
                            background: selected ? '#3E2727' : 'rgba(255,255,255,0.6)',
                            borderColor: selected ? '#3E2727' : 'rgba(62,39,39,0.08)',
                            color: selected ? '#F7F2EF' : '#3E2727',
                          }}>
                          <span className="font-sans font-light text-[1.05rem] tracking-[.02em]">{opt}</span>
                          <span className="shrink-0 ml-4 flex items-center justify-center w-7 h-7 rounded-full border transition-colors duration-300"
                            style={{ borderColor: selected ? 'rgba(247,242,239,0.6)' : 'rgba(62,39,39,0.4)', color: selected ? '#F7F2EF' : '#3E2727' }}>
                            {selected ? <Icon name="check" size={15} /> : <span className="font-sans text-[.8rem]">{String.fromCharCode(65 + i)}</span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {step > 0 && (
                    <button onClick={() => go(step - 1)} className="mt-8 font-sans text-[.7rem] tracking-caps uppercase text-ink3 hover:text-goldDeep transition-colors">← Späť</button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <span className="flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-6" style={{ border: '1px solid rgba(62,39,39,0.4)', color: '#8C6E62' }}>
                    <Icon name="sparkle" size={26} />
                  </span>
                  <div className="eyebrow text-goldDeep" style={{ letterSpacing: '.24em' }}>Váš ideálny štýl</div>
                  <h3 className="font-display text-ink mt-4 leading-[1.1]" style={{ fontSize: 'clamp(1.9rem,3.4vw,2.6rem)' }}>{result.title}</h3>
                  <div className="flex items-center justify-center gap-2.5 mt-4">
                    <span className="h-px w-6 bg-gold"></span>
                    <span className="eyebrow text-ink3" style={{ letterSpacing: '.18em' }}>{result.shape}</span>
                    <span className="h-px w-6 bg-gold"></span>
                  </div>
                  <p className="font-sans font-light text-ink2 mt-6 leading-[1.8] max-w-lg mx-auto tracking-[.02em]">{result.desc}</p>
                  <div className="mt-9 flex flex-col items-center gap-4">
                    <button onClick={() => onBook({ service: result.service, note: `Odporúčaný štýl z kvízu: ${result.title} (${result.shape}).` })}
                      className="lift inline-flex items-center justify-center gap-2 font-sans uppercase rounded-full text-[.72rem] tracking-[.24em] px-9 py-[17px] bg-gold text-porcelain shadow-gold">
                      Objednať sa na tento štýl <Icon name="arrow" size={17} />
                    </button>
                    <button onClick={restart} className="font-sans text-[.7rem] tracking-caps uppercase text-ink3 hover:text-goldDeep transition-colors">Spustiť kvíz znova</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side photo tile */}
          <div className="reveal lift group relative overflow-hidden rounded-[30px] min-h-[210px]" style={{ border: '1px solid rgba(255,255,255,0.4)' }}>
            <img src="assets/photos/nail-natural.png" alt="Inšpirácia Aura Nails"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(62,39,39,0) 40%, rgba(62,39,39,0.62) 100%)' }}></div>
            <div className="relative h-full flex items-end p-6">
              <div className="font-display italic text-porcelain text-[1.4rem] leading-tight">Vaša aura,<br/>vaše sebavedomie</div>
            </div>
          </div>

          {/* Side accent tile */}
          <div className="reveal glass-cream rounded-[30px] p-7 flex flex-col justify-between min-h-[180px]">
            <Emblem size={36} />
            <div>
              <div className="font-display text-[1.45rem] leading-tight text-ink">Odporúčanie na mieru</div>
              <p className="font-sans font-light text-ink3 text-[.86rem] mt-2 leading-relaxed tracking-[.03em]">
                Výsledok je len návrh — finálny tvar vždy doladíme spoločne priamo v štúdiu.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Quiz });

// ── App ─────────────────────────────────────────────────────────
function App() {
  const [prefill, setPrefill] = useState(null);
  const onBook = (data) => {
    setPrefill({ ...data });
    const el = document.getElementById('kontakt');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 8, behavior: 'smooth' });
  };
  useEffect(() => {
    // Force-mute every video (React's JSX `muted` prop is unreliable —
    // it must be set as a DOM property to actually silence playback).
    const mute = () => document.querySelectorAll('video').forEach((v) => {
      v.muted = true; v.defaultMuted = true; v.volume = 0; v.removeAttribute('controls');
    });
    mute();
    const mt = setInterval(mute, 1000);
    setTimeout(() => clearInterval(mt), 5000);
    // Global reveal fallback: ensures nothing stays hidden if a
    // per-section scroll handler doesn't fire (e.g. headless capture).
    const reveal = () => {
      const vh = window.innerHeight;
      document.querySelectorAll('.reveal').forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) n.classList.add('in');
      });
    };
    reveal();
    window.addEventListener('scroll', reveal, { passive: true });
    const t = setTimeout(() => document.querySelectorAll('.reveal').forEach((n) => n.classList.add('in')), 1400);
    return () => { window.removeEventListener('scroll', reveal); clearTimeout(t); clearInterval(mt); };
  }, []);
  return (
    <React.Fragment>
      <Nav />
      <main>
        <Hero />
        <Philosophy />
        <Services onBook={onBook} />
        <Premeny />
        <Quiz onBook={onBook} />
        <About />
        <Certifikaty />
        <AuraPass />
        <Booking prefill={prefill} />
      </main>
      <Footer />
      <GalleryModal />
    </React.Fragment>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);

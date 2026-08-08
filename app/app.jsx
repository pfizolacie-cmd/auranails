const { useState, useRef, useEffect, useMemo } = React;

/* ---------- helpers ---------- */
function st(cssText) {
  const obj = {};
  if (!cssText) return obj;
  cssText.split(';').forEach((rule) => {
    const idx = rule.indexOf(':');
    if (idx === -1) return;
    const prop = rule.slice(0, idx).trim();
    const val = rule.slice(idx + 1).trim();
    if (!prop || !val) return;
    const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    obj[camel] = val;
  });
  return obj;
}

/* ---------- icons ---------- */
const ICON_PATHS = {
  sparkle: <path d="M12 3.2l1.7 5.6 5.6 1.7-5.6 1.7L12 17.8l-1.7-5.6L4.7 10.5l5.6-1.7zM18.5 3.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z" />,
  heart: <path d="M12 20.3s-6.8-4.2-6.8-9.4A3.6 3.6 0 0 1 12 7.4a3.6 3.6 0 0 1 6.8 3.5c0 5.2-6.8 9.4-6.8 9.4z" />,
  arrow: <path d="M5 12h13.5M12.5 6l6 6-6 6" />,
  clock: <g><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5.2l3.2 1.9" /></g>,
  gift: <g><rect x="4" y="9" width="16" height="11.5" rx="1.5" /><path d="M3 9h18M12 9v11.5" /><path d="M12 9S11 4.5 8.4 4.5A2 2 0 0 0 8.4 8.5C10.5 8.6 12 9 12 9zM12 9s1-4.5 3.6-4.5A2 2 0 0 1 15.6 8.5C13.5 8.6 12 9 12 9z" /></g>,
  list: <path d="M4 7h16M4 12h16M4 17h16" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
};
function Icon({ name, size = 22, style = {}, strokeWidth = 1.4 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', ...style }} aria-hidden="true">
      {ICON_PATHS[name] || null}
    </svg>
  );
}

/* ---------- date helpers (real calendar, not a fixed demo window) ---------- */
const SK_DOW = ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'];
const SK_MON = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];
const CLOSE_HOUR = 18;
const OPEN_HOUR = 8;

function isoOffset(daysFromToday) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
}
function isoParts(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return { dow: SK_DOW[dateObj.getDay()], num: d, mon: SK_MON[m - 1] };
}
function buildDateOptions() {
  const out = [];
  for (let i = 0; i < 12; i++) {
    const iso = isoOffset(i);
    out.push({ iso, ...isoParts(iso) });
  }
  return out;
}
function isoLabel(iso) {
  const p = isoParts(iso);
  return `${p.dow} ${p.num}. ${p.mon}`;
}
function parseDateToIso(text) {
  const m = text.match(/(\d{1,2})/);
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const found = buildDateOptions().find((d) => d.num === day);
  return found ? found.iso : null;
}
function timeToHours(t) { const [h, m] = t.split(':').map(Number); return h + (m || 0) / 60; }
function overlaps(aStart, aDur, bStart, bDur) { return aStart < bStart + bDur && bStart < aStart + aDur; }
function slotAvailable(iso, timeStr, durationHours, appointments) {
  const start = timeToHours(timeStr);
  if (start + durationHours > CLOSE_HOUR) return false;
  return !appointments.some((a) => a.date === iso && overlaps(start, durationHours, timeToHours(a.time), a.duration));
}
function buildTimeOptions() { return ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']; }
const DURATION_PRESETS = [{ label: '30 min', val: 0.5 }, { label: '1 h', val: 1 }, { label: '1,5 h', val: 1.5 }, { label: '2 h', val: 2 }];
const BIRTHDAY_DISCOUNT_CODE = 'NARODENINY10';
const DEMO_CLIENT_NAME = 'Zuzana Kráľová';

const SERVICE_OPTIONS = [
  { name: 'Gélové nechty', sub: 'Modeláž, doplnenie, gél lak', duration: 2 },
  { name: 'Manikúra', sub: 'Prístrojová, SPA, hydratácia', duration: 1 },
  { name: 'Odborná starostlivosť', sub: 'IBX kúra, regenerácia', duration: 1.5 },
  { name: 'Dizajn a doplnky', sub: 'Francúzska, babyboomer', duration: 0.5 },
];

/* ---------- Firebase setup ---------- */
const FIREBASE_READY = typeof window.firebaseConfig === 'object'
  && window.firebaseConfig.apiKey && window.firebaseConfig.apiKey.indexOf('VLOZ_') === -1;
let db = null;
let auth = null;
if (FIREBASE_READY) {
  try {
    firebase.initializeApp(window.firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
  } catch (e) { console.error('Firebase init error', e); }
}
function authErrorSk(code) {
  const map = {
    'auth/email-already-in-use': 'Tento email už je zaregistrovaný.',
    'auth/invalid-email': 'Neplatný email.',
    'auth/weak-password': 'Heslo musí mať aspoň 6 znakov.',
    'auth/wrong-password': 'Nesprávne heslo.',
    'auth/user-not-found': 'Účet s týmto emailom neexistuje.',
    'auth/invalid-credential': 'Nesprávny email alebo heslo.',
    'auth/missing-password': 'Zadajte heslo.',
    'auth/too-many-requests': 'Príliš veľa pokusov, skúste to o chvíľu.',
  };
  return map[code] || 'Nastala chyba, skúste to znova.';
}

async function seedIfEmpty() {
  const snap = await db.collection('clients').limit(1).get();
  if (!snap.empty) return;
  const clientsSeed = [
    { name: 'Zuzana Kráľová', phone: '+421 905 111 222', stamps: 3, visits: 8, lastVisit: '13. júl 2026', notes: 'Alergia na akrylát — používať len gél. Preferuje tichšiu hudbu.', birthday: '2026-08-08', history: [{ service: 'Gélové nechty — Stredné', date: '13. júl 2026' }, { service: 'Gél lak', date: '2. jún 2026' }, { service: 'SPA manikúra', date: '18. apr 2026' }] },
    { name: 'Petra Novotná', phone: '+421 918 333 444', stamps: 5, visits: 14, lastVisit: '2. aug 2026', notes: '', birthday: '', history: [{ service: 'SPA manikúra s peelingom', date: '2. aug 2026' }, { service: 'IBX kúra', date: '5. júl 2026' }] },
    { name: 'Ivana Baková', phone: '+421 905 123 456', stamps: 1, visits: 2, lastVisit: '20. jún 2026', notes: '', birthday: '', history: [{ service: 'IBX regeneračná kúra', date: '20. jún 2026' }] },
    { name: 'Katarína Hudecová', phone: '+421 902 555 111', stamps: 0, visits: 1, lastVisit: '15. máj 2026', notes: '', birthday: '', history: [{ service: 'Francúzska manikúra', date: '15. máj 2026' }] },
    { name: 'Simona Tóthová', phone: '+421 911 222 333', stamps: 4, visits: 9, lastVisit: '28. júl 2026', notes: 'Krátke nechty, citlivá kutikula.', birthday: '', history: [{ service: 'Nová modelácia — Dlhé', date: '28. júl 2026' }, { service: 'Babyboomer', date: '30. jún 2026' }] },
  ];
  const appointmentsSeed = [
    { date: isoOffset(0), time: '9:00', name: 'Zuzana Kráľová', service: 'Gélové nechty — Stredné', duration: 2, manual: false },
    { date: isoOffset(0), time: '11:00', name: 'Petra Novotná', service: 'SPA manikúra s peelingom', duration: 1, manual: false },
    { date: isoOffset(0), time: '14:00', name: 'Michaela Vidová', service: 'Francúzska manikúra', duration: 0.5, manual: false },
    { date: isoOffset(2), time: '10:00', name: 'Ivana Baková', service: 'IBX regeneračná kúra', duration: 2, manual: false },
    { date: isoOffset(5), time: '9:00', name: 'Simona Tóthová', service: 'Manikúra', duration: 1, manual: false },
    { date: isoOffset(5), time: '14:00', name: 'Katarína Hudecová', service: 'Gélové nechty — Dlhé', duration: 2, manual: false },
  ];
  const requestsSeed = [
    { name: 'Ivana Baková', phone: '+421 905 123 456', service: 'IBX regeneračná kúra', date: isoOffset(4), time: '14:00' },
    { name: 'Simona Tóthová', phone: '+421 911 222 333', service: 'Nová modelácia — Dlhé', date: isoOffset(5), time: '16:00' },
    { name: 'Katarína Hudecová', phone: '+421 902 555 111', service: 'Francúzska manikúra', date: isoOffset(6), time: '10:00' },
  ];
  const batch = db.batch();
  clientsSeed.forEach((c) => batch.set(db.collection('clients').doc(), c));
  appointmentsSeed.forEach((a) => batch.set(db.collection('appointments').doc(), a));
  requestsSeed.forEach((r) => batch.set(db.collection('requests').doc(), r));
  await batch.commit();
}

const CENNIK_SEED = [
  { name: 'Gélové nechty', sub: 'Predĺženie & spevnenie', items: [
    { label: 'Nová modelácia — Krátke', price: '33 €' }, { label: 'Nová modelácia — Stredné', price: '35 €' },
    { label: 'Nová modelácia — Dlhé', price: '38 €' }, { label: 'Doplnenie — Krátke', price: '30 €' },
    { label: 'Doplnenie — Stredné', price: '32 €' }, { label: 'Doplnenie — Dlhé', price: '35 €' },
    { label: 'Jednorázové', price: '40 €' }, { label: 'Gél lak', price: '28 €' } ] },
  { name: 'Manikúra', sub: 'Starostlivosť', items: [
    { label: 'Prístrojová manikúra', price: '20 €' }, { label: 'SPA manikúra s peelingom', price: '25 €' },
    { label: 'Hydratačný zábal a masáž rúk', price: '10 €' } ] },
  { name: 'Odborná starostlivosť', sub: 'Zdravie nechtov', items: [
    { label: 'Odstránenie nechtov', price: '15 €' }, { label: 'Odstránenie + prístrojová manikúra', price: '25 €' },
    { label: 'IBX regeneračná kúra', price: '15 €' }, { label: 'IBX kúra + prístrojová manikúra', price: '25 €' } ] },
  { name: 'Dizajn a doplnky', sub: 'Doplnky', items: [
    { label: 'Francúzska manikúra', price: '3 €' }, { label: 'Francúzska manikúra (vstavaná)', price: '5 €' },
    { label: 'Babyboomer (vstavaný)', price: '3 €' }, { label: 'Oprava nechtu mimo termín', price: '3 €' } ] },
];
async function seedPricingIfMissing() {
  const doc = await db.collection('settings').doc('cennik').get();
  if (doc.exists) return;
  await db.collection('settings').doc('cennik').set({ categories: CENNIK_SEED });
}

function useCollection(name) {
  const [items, setItems] = useState(null);
  useEffect(() => {
    if (!db) return;
    const unsub = db.collection(name).onSnapshot((snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (err) => console.error(name, err));
    return unsub;
  }, [name]);
  return items;
}

function useOwnClientDoc(uid) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!db || !uid) { setData(null); return; }
    const unsub = db.collection('clients').doc(uid).onSnapshot((doc) => {
      setData(doc.exists ? { id: doc.id, ...doc.data() } : null);
    }, (err) => console.error('own client doc', err));
    return unsub;
  }, [uid]);
  return data;
}

function usePricing() {
  const [categories, setCategories] = useState(null);
  useEffect(() => {
    if (!db) return;
    const unsub = db.collection('settings').doc('cennik').onSnapshot((doc) => {
      setCategories(doc.exists ? (doc.data().categories || []) : []);
    }, (err) => console.error('pricing', err));
    return unsub;
  }, []);
  return categories;
}

/* ---------- setup notice (shown until firebase-config.js is filled in) ---------- */
function SetupNotice() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center', fontFamily: 'var(--font-sans)', color: 'var(--ink)', background: 'var(--porcelain)' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 12 }}>Appka ešte nie je pripojená k databáze</div>
        <p style={{ color: 'var(--ink-2)', maxWidth: 380, lineHeight: 1.6 }}>Doplň prosím Firebase konfiguráciu do súboru <code>firebase-config.js</code> podľa priloženého návodu.</p>
      </div>
    </div>
  );
}

/* ---------- app ---------- */
function App() {
  const clientsRaw = useCollection('clients');
  const requestsRaw = useCollection('requests');
  const appointmentsRaw = useCollection('appointments');
  const pricingRaw = usePricing();
  const seededRef = useRef(false);
  useEffect(() => {
    if (db && !seededRef.current) {
      seededRef.current = true;
      seedIfEmpty().catch((e) => console.error('seed error', e));
      seedPricingIfMissing().catch((e) => console.error('seed pricing error', e));
    }
  }, []);

  const [authUser, setAuthUser] = useState(undefined); // undefined = not yet known, null = signed out
  useEffect(() => {
    if (!auth) return;
    return auth.onAuthStateChanged((u) => setAuthUser(u));
  }, []);
  const [isAdmin, setIsAdmin] = useState(null); // null = unknown/checking
  const [isAdminForUid, setIsAdminForUid] = useState(null); // which uid the isAdmin value above was actually resolved for
  useEffect(() => {
    if (!db || !authUser) { setIsAdmin(authUser === null ? false : null); setIsAdminForUid(authUser === null ? null : null); return; }
    setIsAdmin(null);
    db.collection('admins').doc(authUser.uid).get()
      .then((doc) => { setIsAdmin(doc.exists); setIsAdminForUid(authUser.uid); })
      .catch(() => { setIsAdmin(false); setIsAdminForUid(authUser.uid); });
  }, [authUser]);
  // Whether isAdmin above genuinely reflects the CURRENTLY signed-in
  // account — false right after a fresh sign-in, until the check for that
  // specific uid finishes, so a leftover value from before is never reused.
  const isAdminFresh = authUser ? isAdminForUid === authUser.uid : true;
  const myClientDoc = useOwnClientDoc(authUser ? authUser.uid : null);

  const [state, setStateRaw] = useState({
    screen: 'login', clientTab: 'home',
    booking: { step: 0, serviceIdx: null, dateIso: null, time: null, done: false },
    profileView: 'main', expandedCat: 0,
    adminTab: 'overview', selectedClientId: null,
    toast: { visible: false, msg: '' },
    dayBefore: true, hourBefore: true,
    addFormOpen: false, newClientName: '', newClientPhone: '', newClientDate: '', newClientTime: '',
    newClientService: '', newClientDuration: 1.5,
    adminSelectedDate: isoOffset(0),
    authMode: 'login', authName: '', authEmail: '', authPassword: '', authError: '',
    blockFormOpen: false, blockAllDay: true, blockTime: '8:00', blockDuration: 1,
    addItemCatIndex: null, newItemLabel: '', newItemPrice: '', addCatFormOpen: false, newCatName: '', newCatSub: '',
    clientSearch: '',
  });
  const s = state;
  const set = (patch) => setStateRaw((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (authUser && isAdminFresh && (s.screen === 'login' || s.screen === 'client-auth' || (s.screen === 'admin-auth' && isAdmin))) {
      set({ screen: isAdmin ? 'admin' : 'client', clientTab: 'home', adminTab: 'overview' });
    }
    if (authUser === null && (s.screen === 'client' || s.screen === 'admin')) {
      set({ screen: 'login' });
    }
  }, [authUser, isAdmin, isAdminFresh]);
  // A signed-in account that turns out not to be an admin, while on the
  // admin login screen specifically, gets signed back out with an
  // explanation. Gated on isAdminFresh so this can only fire once the
  // check has genuinely completed for THIS sign-in — never on a leftover
  // `false` left over from being signed out a moment before.
  useEffect(() => {
    if (authUser && isAdminFresh && isAdmin === false && s.screen === 'admin-auth') {
      auth.signOut();
      set({ authError: 'Tento účet nemá administrátorský prístup.' });
    }
  }, [authUser, isAdmin, isAdminFresh, s.screen]);
  const setBooking = (patch) => setStateRaw((prev) => ({ ...prev, booking: { ...prev.booking, ...patch } }));
  const toastTimer = useRef(null);
  const showToast = (msg) => {
    set({ toast: { visible: true, msg } });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => set({ toast: { visible: false, msg: '' } }), 2400);
  };
  const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('');

  if (!FIREBASE_READY) return <SetupNotice />;
  // Wait only for data the current role is actually allowed to read — an
  // unauthenticated visitor should reach the login screen immediately
  // instead of waiting forever on collections that require sign-in.
  if (authUser === undefined) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--porcelain)', color: 'var(--ink-3)', fontFamily: 'var(--font-sans)' }}>Načítavam…</div>;
  }
  if (authUser && !isAdminFresh) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--porcelain)', color: 'var(--ink-3)', fontFamily: 'var(--font-sans)' }}>Načítavam…</div>;
  }
  if (authUser && isAdmin && (clientsRaw === null || requestsRaw === null || appointmentsRaw === null || pricingRaw === null)) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--porcelain)', color: 'var(--ink-3)', fontFamily: 'var(--font-sans)' }}>Načítavam…</div>;
  }
  if (authUser && !isAdmin && (appointmentsRaw === null || pricingRaw === null)) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--porcelain)', color: 'var(--ink-3)', fontFamily: 'var(--font-sans)' }}>Načítavam…</div>;
  }

  const loggedInClient = myClientDoc;
  // For a non-admin client, `clients`/`requests` stay null forever (the
  // security rules correctly deny listing them) — fall back to empty
  // arrays so admin-only computations below never crash for that role.
  const clients = clientsRaw || [];
  const requests = requestsRaw || [];
  const appointments = appointmentsRaw || [];
  const pricing = pricingRaw || [];

  const b = s.booking;
  const atLogin = s.screen === 'login', atClient = s.screen === 'client', atAdmin = s.screen === 'admin';
  const goClientAuth = () => set({ screen: 'client-auth', authMode: 'login', authError: '', authEmail: '', authPassword: '', authName: '' });
  const goAdminAuth = () => set({ screen: 'admin-auth', authError: '', authEmail: '', authPassword: '' });
  const backToEntry = () => set({ screen: 'login', authError: '' });
  const backToLogin = () => { if (auth) auth.signOut(); set({ screen: 'login', authMode: 'login', authEmail: '', authPassword: '', authName: '', authError: '' }); };

  const doClientRegister = async () => {
    set({ authError: '' });
    if (!s.authName.trim()) { set({ authError: 'Zadajte meno a priezvisko.' }); return; }
    try {
      const cred = await auth.createUserWithEmailAndPassword(s.authEmail.trim(), s.authPassword);
      await db.collection('clients').doc(cred.user.uid).set({
        name: s.authName.trim(), email: s.authEmail.trim(), phone: '', stamps: 0, visits: 0, lastVisit: '—', notes: '', birthday: '', history: [],
      });
    } catch (e) { set({ authError: authErrorSk(e.code) }); }
  };
  const doClientLogin = async () => {
    set({ authError: '' });
    try { await auth.signInWithEmailAndPassword(s.authEmail.trim(), s.authPassword); }
    catch (e) { set({ authError: authErrorSk(e.code) }); }
  };
  const doAdminLogin = async () => {
    set({ authError: '' });
    try { await auth.signInWithEmailAndPassword(s.authEmail.trim(), s.authPassword); }
    catch (e) { set({ authError: authErrorSk(e.code) }); }
  };

  const tabHome = s.clientTab === 'home', tabBooking = s.clientTab === 'booking', tabPass = s.clientTab === 'pass',
    tabPricing = s.clientTab === 'pricing', tabProfile = s.clientTab === 'profile';
  const goHome = () => set({ clientTab: 'home' });
  const goBooking = () => set({ clientTab: 'booking' });
  const goPass = () => set({ clientTab: 'pass' });
  const goPricing = () => set({ clientTab: 'pricing' });
  const goProfile = () => set({ clientTab: 'profile', profileView: 'main' });
  const goReminders = () => set({ clientTab: 'profile', profileView: 'reminders' });
  const backToProfile = () => set({ profileView: 'main' });

  const todayIso = isoOffset(0);
  const clientBirthday = loggedInClient ? (loggedInClient.birthday || '') : '';
  const isBirthdayToday = clientBirthday && clientBirthday.slice(5) === todayIso.slice(5);
  const setClientBirthday = (e) => { if (loggedInClient) db.collection('clients').doc(loggedInClient.id).update({ birthday: e.target.value }); };

  const navBtn = (active) => `all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;padding:6px 10px;color:${active ? 'var(--espresso)' : 'var(--ink-3)'};min-width:44px`;
  const headerMap = {
    home: ['NECHTOVÉ ŠTÚDIO · HANDLOVÁ', 'Dobrý deň'], booking: ['REZERVÁCIA', 'Nový termín'],
    pass: ['VERNOSTNÝ PROGRAM', 'Aura Pass'], pricing: ['KATALÓG SLUŽIEB', 'Cenník'], profile: ['MÔJ ÚČET', 'Profil'],
  };
  const [clientHeaderEyebrow, clientHeaderTitle] = headerMap[s.clientTab];

  const step0 = b.step === 0, step1 = b.step === 1, step2 = b.step === 2, step3 = b.step === 3;
  const dotStyle = (active, done) => `flex:1;height:4px;border-radius:2px;background:${active || done ? 'var(--espresso)' : 'var(--line)'}`;

  const serviceOptions = SERVICE_OPTIONS.map((sv, i) => ({
    name: sv.name, sub: sv.sub, select: () => setBooking({ serviceIdx: i }),
    style: `all:unset;cursor:pointer;display:block;width:100%;box-sizing:border-box;text-align:left;padding:16px 18px;border-radius:16px;margin-bottom:10px;color:${b.serviceIdx === i ? 'var(--porcelain)' : 'var(--ink)'};background:${b.serviceIdx === i ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${b.serviceIdx === i ? 'var(--espresso)' : 'var(--line)'}`,
  }));
  const dates = buildDateOptions();
  const dateOptions = dates.map((d) => ({
    dow: d.dow, num: d.num, mon: d.mon, select: () => setBooking({ dateIso: d.iso }),
    style: `all:unset;cursor:pointer;text-align:center;padding:10px 4px;border-radius:14px;color:${b.dateIso === d.iso ? 'var(--porcelain)' : 'var(--ink)'};background:${b.dateIso === d.iso ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${b.dateIso === d.iso ? 'var(--espresso)' : 'var(--line)'}`,
  }));
  const svcDuration = b.serviceIdx !== null ? SERVICE_OPTIONS[b.serviceIdx].duration : 1;
  const timeOptions = buildTimeOptions().map((t) => {
    const taken = b.dateIso === null ? false : !slotAvailable(b.dateIso, t, svcDuration, appointments);
    const selected = b.time === t;
    return {
      label: t, taken, select: () => !taken && setBooking({ time: t }),
      style: `cursor:${taken ? 'not-allowed' : 'pointer'};padding:11px 16px;border-radius:999px;font-family:var(--font-sans);font-size:.82rem;color:${taken ? 'var(--ink-3)' : selected ? 'var(--porcelain)' : 'var(--ink-2)'};background:${taken ? 'rgba(62,39,39,.05)' : selected ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${taken ? 'var(--line)' : selected ? 'var(--espresso)' : 'var(--line-gold)'};text-decoration:${taken ? 'line-through' : 'none'}`,
    };
  });
  const booking_selectedService = b.serviceIdx !== null ? SERVICE_OPTIONS[b.serviceIdx].name : '—';
  const booking_durationLabel = svcDuration === 0.5 ? '30 min' : svcDuration === 1 ? '1 h' : `${svcDuration} h`;
  const booking_selectedDate = b.dateIso ? isoLabel(b.dateIso) : '—';
  const bookingSummary = `${booking_selectedService} · ${booking_selectedDate} · ${b.time || '—'}`;
  const nextDisabled = (step0 && b.serviceIdx === null) || (step1 && b.dateIso === null) || (step2 && !b.time);
  const nextStep = () => !nextDisabled && setBooking({ step: Math.min(3, b.step + 1) });
  const prevStep = () => setBooking({ step: Math.max(0, b.step - 1) });
  const btnBase = 'all:unset;cursor:pointer;padding:12px 26px;border-radius:999px;font-family:var(--font-sans);font-size:.74rem;letter-spacing:.14em;text-transform:uppercase';
  const prevBtnStyle = `${btnBase};color:${step0 ? 'var(--ink-3)' : 'var(--ink-2)'};border:1px solid var(--line-gold);opacity:${step0 ? 0.4 : 1};visibility:${step0 ? 'hidden' : 'visible'}`;
  const nextBtnStyle = `${btnBase};color:var(--porcelain);background:var(--espresso);opacity:${nextDisabled ? 0.4 : 1}`;
  const submitBooking = async () => {
    if (!loggedInClient || !authUser) return;
    await db.collection('requests').add({
      name: loggedInClient.name, phone: loggedInClient.phone || '', service: booking_selectedService,
      date: b.dateIso, time: b.time, clientUid: authUser.uid,
    });
    setBooking({ done: true });
  };
  const resetBooking = () => set({ booking: { step: 0, serviceIdx: null, dateIso: null, time: null, done: false } });

  const clientStamps = loggedInClient ? loggedInClient.stamps : 0;
  const passStampDots = [0, 1, 2, 3, 4].map((i) => {
    const on = i < clientStamps;
    return {
      click: () => {
        if (!loggedInClient) return;
        if (i === clientStamps) db.collection('clients').doc(loggedInClient.id).update({ stamps: clientStamps + 1 });
        else if (i === clientStamps - 1) db.collection('clients').doc(loggedInClient.id).update({ stamps: clientStamps - 1 });
      },
      style: `aspect-ratio:1;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;background:${on ? 'linear-gradient(150deg,var(--taupe-light),var(--espresso))' : 'var(--cream)'};color:${on ? 'var(--porcelain)' : 'var(--ink-3)'};border:${on ? '1px solid var(--espresso)' : i === clientStamps ? '1.5px dashed var(--line-gold)' : '1px solid var(--line)'}`,
    };
  });
  const rewardStyle = `aspect-ratio:1;border-radius:50%;cursor:${clientStamps >= 5 ? 'pointer' : 'not-allowed'};display:flex;flex-direction:column;align-items:center;justify-content:center;background:${clientStamps >= 5 ? 'linear-gradient(150deg,var(--taupe-light),var(--mocha))' : 'var(--cream)'};color:${clientStamps >= 5 ? 'var(--porcelain)' : 'var(--ink-3)'};border:2px solid ${clientStamps >= 5 ? 'var(--espresso)' : 'var(--line-gold)'}`;
  const claimReward = () => {
    if (loggedInClient && clientStamps >= 5) {
      db.collection('clients').doc(loggedInClient.id).update({ stamps: 0 });
      showToast('Odmena uplatnená! ✨');
    }
  };
  const resetPass = () => { if (loggedInClient) db.collection('clients').doc(loggedInClient.id).update({ stamps: 0 }); };
  const passShowReset = clientStamps > 0;
  const passHelperText = clientStamps < 5 ? 'Klikajte na kruhy a vyskúšajte si zbieranie pečiatok.' : 'Máte 5 pečiatok — kliknite na darček a uplatnite odmenu!';

  const cennikCategories = pricing.map((cat, i) => ({
    name: cat.name, sub: cat.sub, items: cat.items, open: s.expandedCat === i,
    toggle: () => set({ expandedCat: s.expandedCat === i ? null : i }),
    chevStyle: `display:flex;transform:rotate(${s.expandedCat === i ? 90 : 0}deg);transition:transform .3s;color:var(--ink-3)`,
  }));

  const badge = (tone) => `font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;padding:5px 10px;border-radius:999px;background:${tone === 'pending' ? 'rgba(140,110,98,.14)' : tone === 'blocked' ? 'rgba(178,59,59,.12)' : 'rgba(62,39,39,.08)'};color:${tone === 'pending' ? 'var(--mocha)' : tone === 'blocked' ? '#b23b3b' : 'var(--espresso)'}`;
  const myAppointments = loggedInClient ? appointments.filter((a) => a.name === loggedInClient.name) : [];
  const upcomingAppts = myAppointments.filter((a) => a.date >= todayIso).sort((a, bb) => a.date === bb.date ? timeToHours(a.time) - timeToHours(bb.time) : a.date.localeCompare(bb.date))
    .map((a) => ({ service: a.service, date: isoLabel(a.date), time: a.time, badgeLabel: a.manual ? 'Telefonicky' : 'Potvrdené', badgeStyle: badge(a.manual ? 'pending' : undefined) }));
  const historyAppts = myAppointments.filter((a) => a.date < todayIso).sort((a, bb) => bb.date.localeCompare(a.date))
    .map((a) => ({ service: a.service, date: isoLabel(a.date), time: a.time }));
  const notifications = [
    { icon: 'clock', title: 'Pripomienka termínu', text: 'Váš najbližší termín sa blíži.', time: '' },
    { icon: 'sparkle', title: 'Aura Pass', text: `Aktuálne máte ${clientStamps}/5 pečiatok.`, time: '' },
  ];
  if (isBirthdayToday) {
    notifications.unshift({ icon: 'gift', title: 'Všetko najlepšie k narodeninám!', text: `Nech je váš deň krásny ako vaše nechty. Darček od nás: 10 % zľava na ďalšiu starostlivosť s kódom ${BIRTHDAY_DISCOUNT_CODE}.`, time: 'dnes' });
  }
  const notificationsPreview = notifications.slice(0, 2);

  const toggleTrack = (on) => `all:unset;cursor:pointer;width:44px;height:26px;border-radius:999px;background:${on ? 'var(--espresso)' : 'var(--line-gold)'};display:flex;align-items:center;padding:2px;box-sizing:border-box`;
  const toggleKnob = (on) => `display:block;width:22px;height:22px;border-radius:50%;background:var(--porcelain);transform:translateX(${on ? '18px' : '0'});transition:transform .25s`;
  const toggleDayBefore = () => set({ dayBefore: !s.dayBefore });
  const toggleHourBefore = () => set({ hourBefore: !s.hourBefore });

  const adminTabOverview = s.adminTab === 'overview', adminTabRequests = s.adminTab === 'requests', adminTabClients = s.adminTab === 'clients', adminTabPricing = s.adminTab === 'pricing';
  const goOverview = () => set({ adminTab: 'overview' });
  const goRequests = () => set({ adminTab: 'requests' });
  const goClients = () => set({ adminTab: 'clients', selectedClientId: null });
  const goPricingAdmin = () => set({ adminTab: 'pricing' });
  const hasPending = requests.length > 0;
  const adminHeaderMap = { overview: 'Prehľad', requests: 'Žiadosti', clients: 'Klientky', pricing: 'Cenník' };

  const updatePricing = (newCategories) => db.collection('settings').doc('cennik').set({ categories: newCategories });
  const deletePricingCategory = (catIdx) => updatePricing(pricing.filter((_, i) => i !== catIdx));
  const deletePricingItem = (catIdx, itemIdx) => updatePricing(pricing.map((c, i) => (i === catIdx ? { ...c, items: c.items.filter((_, j) => j !== itemIdx) } : c)));
  const openAddItem = (catIdx) => set({ addItemCatIndex: catIdx, newItemLabel: '', newItemPrice: '' });
  const cancelAddItem = () => set({ addItemCatIndex: null });
  const saveNewItem = (catIdx) => {
    if (!s.newItemLabel.trim() || !s.newItemPrice.trim()) return;
    updatePricing(pricing.map((c, i) => (i === catIdx ? { ...c, items: [...c.items, { label: s.newItemLabel.trim(), price: s.newItemPrice.trim() }] } : c)));
    set({ addItemCatIndex: null, newItemLabel: '', newItemPrice: '' });
  };
  const openAddCategory = () => set({ addCatFormOpen: true, newCatName: '', newCatSub: '' });
  const cancelAddCategory = () => set({ addCatFormOpen: false });
  const saveNewCategory = () => {
    if (!s.newCatName.trim()) return;
    updatePricing([...pricing, { name: s.newCatName.trim(), sub: s.newCatSub.trim(), items: [] }]);
    set({ addCatFormOpen: false, newCatName: '', newCatSub: '' });
  };

  const calendarDates = buildDateOptions();
  const countsByDate = {};
  appointments.forEach((a) => { countsByDate[a.date] = (countsByDate[a.date] || 0) + 1; });
  const occupancyColor = (n) => (n === 0 ? 'var(--line)' : n <= 1 ? 'var(--taupe)' : n <= 2 ? 'var(--mocha)' : 'var(--espresso)');
  const calendarStrip = calendarDates.map((d) => {
    const count = countsByDate[d.iso] || 0;
    const selected = s.adminSelectedDate === d.iso;
    return {
      dow: d.dow, num: d.num, select: () => set({ adminSelectedDate: d.iso }),
      style: `all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:5px;padding:9px 4px;border-radius:14px;flex-shrink:0;width:42px;background:${selected ? 'var(--espresso)' : 'transparent'};color:${selected ? 'var(--porcelain)' : 'var(--ink)'};border:1px solid ${selected ? 'var(--espresso)' : 'var(--line)'}`,
      dotStyle: `width:6px;height:6px;border-radius:50%;background:${selected ? 'var(--porcelain)' : occupancyColor(count)}`,
    };
  });
  const calendarSelectedLabel = isoLabel(s.adminSelectedDate);
  const selectedDayAppts = appointments.filter((a) => a.date === s.adminSelectedDate).sort((a, bb) => timeToHours(a.time) - timeToHours(bb.time)).map((a) => {
    const matched = clients.find((c) => c.name === a.name);
    return {
      ...a,
      badgeLabel: a.blocked ? 'Zatvorené' : (a.manual ? 'Telefonicky' : 'Potvrdené'),
      badgeStyle: badge(a.blocked ? 'blocked' : (a.manual ? 'pending' : undefined)),
      open: a.blocked ? () => deleteBlock(a.id) : (() => matched && set({ adminTab: 'clients', selectedClientId: matched.id })),
    };
  });
  const noDayAppts = selectedDayAppts.length === 0;
  const openBlockForm = () => set({ blockFormOpen: true, blockAllDay: true, blockTime: '8:00', blockDuration: 1 });
  const cancelBlockForm = () => set({ blockFormOpen: false });
  const saveBlock = async () => {
    const duration = s.blockAllDay ? (CLOSE_HOUR - OPEN_HOUR) : s.blockDuration;
    const time = s.blockAllDay ? `${OPEN_HOUR}:00` : s.blockTime;
    await db.collection('appointments').add({ date: s.adminSelectedDate, time, duration, blocked: true, name: 'Voľno', service: s.blockAllDay ? 'Celý deň voľno' : 'Blokovaný čas', manual: true });
    set({ blockFormOpen: false });
    showToast('Voľno nastavené');
  };
  const deleteBlock = async (id) => { await db.collection('appointments').doc(id).delete(); showToast('Voľno zrušené'); };
  const blockTimePresetStyle = (active) => `all:unset;cursor:pointer;padding:8px 12px;border-radius:999px;font-family:var(--font-sans);font-size:.72rem;color:${active ? 'var(--porcelain)' : 'var(--ink-2)'};background:${active ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${active ? 'var(--espresso)' : 'var(--line-gold)'}`;
  const adminTodayCount = countsByDate[todayIso] || 0;
  const adminPendingCount = requests.length;
  const noRequests = requests.length === 0;
  const adminRequestsList = requests.map((r) => ({
    ...r, dateLabel: isoLabel(r.date),
    approve: async () => {
      await db.collection('appointments').add({ date: r.date, time: r.time, name: r.name, service: r.service, duration: 1.5, manual: false });
      const matched = clients.find((c) => c.name === r.name);
      if (matched) {
        await db.collection('clients').doc(matched.id).update({
          visits: (matched.visits || 0) + 1,
          lastVisit: isoLabel(r.date),
          stamps: Math.min(5, (matched.stamps || 0) + 1),
          history: [{ service: r.service, date: isoLabel(r.date) }, ...(matched.history || [])],
        });
      }
      await db.collection('requests').doc(r.id).delete();
      showToast('Rezervácia potvrdená');
    },
    reject: async () => { await db.collection('requests').doc(r.id).delete(); showToast('Žiadosť zamietnutá'); },
  }));

  const clientsListView = s.selectedClientId === null;
  const adminClientsList = clients.map((c) => ({ ...c, initials: initials(c.name), open: () => set({ selectedClientId: c.id }) }));
  const clientSearchLower = s.clientSearch.trim().toLowerCase();
  const adminClientsListFiltered = clientSearchLower
    ? adminClientsList.filter((c) => (c.name || '').toLowerCase().includes(clientSearchLower) || (c.email || '').toLowerCase().includes(clientSearchLower) || (c.phone || '').toLowerCase().includes(clientSearchLower))
    : adminClientsList;
  const noSearchResults = clientSearchLower && adminClientsListFiltered.length === 0;
  const selClient = clients.find((c) => c.id === s.selectedClientId) || { name: '', phone: '', visits: 0, lastVisit: '', stamps: 0, history: [] };
  const selClientInitials = initials(selClient.name || '—');
  const selClientHistory = selClient.history || [];
  const selClientStamps = [0, 1, 2, 3, 4].map((i) => ({
    style: `aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${i < selClient.stamps ? 'linear-gradient(150deg,var(--taupe-light),var(--espresso))' : 'var(--cream)'};color:${i < selClient.stamps ? 'var(--porcelain)' : 'var(--ink-3)'};border:1px solid ${i < selClient.stamps ? 'var(--espresso)' : 'var(--line)'}`,
  }));
  const backToClients = () => set({ selectedClientId: null });
  const updateClientNotes = (e) => { if (s.selectedClientId) db.collection('clients').doc(s.selectedClientId).update({ notes: e.target.value }); };
  const updateClientBirthday = (e) => { if (s.selectedClientId) db.collection('clients').doc(s.selectedClientId).update({ birthday: e.target.value }); };
  const openAddClient = () => set({ addFormOpen: true, newClientName: '', newClientPhone: '', newClientDate: '', newClientTime: '', newClientService: '' });
  const cancelAddClient = () => set({ addFormOpen: false });
  const durationPresetOptions = DURATION_PRESETS.map((d) => ({
    label: d.label, select: () => set({ newClientDuration: d.val }),
    style: `all:unset;cursor:pointer;padding:8px 14px;border-radius:999px;font-family:var(--font-sans);font-size:.74rem;color:${s.newClientDuration === d.val ? 'var(--porcelain)' : 'var(--ink-2)'};background:${s.newClientDuration === d.val ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${s.newClientDuration === d.val ? 'var(--espresso)' : 'var(--line-gold)'}`,
  }));
  const saveDisabled = !s.newClientName.trim();
  const saveBtnStyle = `all:unset;cursor:${saveDisabled ? 'not-allowed' : 'pointer'};flex:1;text-align:center;padding:11px;border-radius:999px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;opacity:${saveDisabled ? 0.5 : 1}`;
  const saveNewClient = async () => {
    if (saveDisabled) return;
    const hasAppt = s.newClientDate.trim() && s.newClientTime.trim();
    const newClientRef = await db.collection('clients').add({
      name: s.newClientName.trim(), phone: s.newClientPhone.trim() || '—', stamps: 0, visits: 0, lastVisit: '—', notes: '', birthday: '', history: [],
    });
    if (hasAppt) {
      const iso = parseDateToIso(s.newClientDate.trim());
      if (iso) {
        await db.collection('appointments').add({ date: iso, time: s.newClientTime.trim(), name: s.newClientName.trim(), service: s.newClientService.trim() || 'Bez upresnenia', duration: s.newClientDuration, manual: true });
      }
    }
    set({ addFormOpen: false });
    showToast(hasAppt ? 'Klientka a termín pridané' : 'Klientka pridaná');
  };
  const addStampSel = () => { if (s.selectedClientId) db.collection('clients').doc(s.selectedClientId).update({ stamps: Math.min(5, (selClient.stamps || 0) + 1) }); };
  const removeStampSel = () => { if (s.selectedClientId) db.collection('clients').doc(s.selectedClientId).update({ stamps: Math.max(0, (selClient.stamps || 0) - 1) }); };

  const inputStyle = 'all:unset;display:block;width:100%;box-sizing:border-box;padding:11px 14px;border-radius:12px;border:1px solid var(--line);background:var(--cream);font-family:var(--font-sans);font-size:.86rem;color:var(--ink);margin-bottom:10px';

  return (
    <div style={st('height:100%;display:flex;flex-direction:column;position:relative;background:var(--porcelain)')}>

      {atLogin && (
        <div style={st('flex:1;display:flex;flex-direction:column;padding:76px 30px 40px;box-sizing:border-box;background:var(--porcelain)')}>
          <div style={st('display:flex;flex-direction:column;align-items:center;margin-bottom:40px')}>
            <img src="assets/aura-mark.svg" alt="" style={{ width: 52, height: 52, marginBottom: 14 }} />
            <div style={st('font-family:var(--font-display);font-weight:400;font-size:1.7rem;color:var(--ink)')}>Aura Nails</div>
            <div style={st('font-family:var(--font-sans);font-size:.62rem;letter-spacing:.28em;text-transform:uppercase;color:var(--mocha);margin-top:6px')}>Rozumiem · Handlová</div>
          </div>
          <div style={st('font-family:var(--font-display);font-size:1.5rem;color:var(--ink);text-align:center;margin-bottom:8px')}>Prihlásenie</div>
          <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.88rem;color:var(--ink-2);text-align:center;line-height:1.6;margin:0 0 32px')}>Vyberte, ako chcete pokračovať</p>
          <button onClick={goClientAuth} style={st('all:unset;cursor:pointer;display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:20px;background:var(--white);border:1px solid var(--line-gold);box-shadow:var(--shadow-md);margin-bottom:14px')}>
            <span style={st('width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--taupe);color:var(--espresso);flex-shrink:0')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-4 3.2-6.4 7-6.4s7 2.4 7 6.4" /></svg>
            </span>
            <span style={st('flex:1;text-align:left')}>
              <span style={st('display:block;font-family:var(--font-display);font-size:1.15rem;color:var(--ink)')}>Som klientka</span>
              <span style={st('display:block;font-family:var(--font-sans);font-weight:300;font-size:.78rem;color:var(--ink-3)')}>Rezervácie, Aura Pass, cenník</span>
            </span>
            <svg width="8" height="14" viewBox="0 0 8 14" style={{ flexShrink: 0 }}><path d="M1 1l6 6-6 6" stroke="var(--ink-3)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button onClick={goAdminAuth} style={st('all:unset;cursor:pointer;display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:20px;background:var(--espresso);box-shadow:var(--shadow-md);margin-bottom:28px')}>
            <span style={st('width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(247,242,239,0.14);color:var(--taupe-light);flex-shrink:0')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5l1.7 5.6 5.6 1.7-5.6 1.7L12 17.8l-1.7-5.6L4.7 10.5l5.6-1.7z" /></svg>
            </span>
            <span style={st('flex:1;text-align:left')}>
              <span style={st('display:block;font-family:var(--font-display);font-size:1.15rem;color:var(--porcelain)')}>Som Michaela</span>
              <span style={st('display:block;font-family:var(--font-sans);font-weight:300;font-size:.78rem;color:var(--taupe-light)')}>Rezervácie, žiadosti, klientky</span>
            </span>
            <svg width="8" height="14" viewBox="0 0 8 14" style={{ flexShrink: 0 }}><path d="M1 1l6 6-6 6" stroke="var(--taupe-light)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.72rem;color:var(--ink-3);text-align:center;margin-top:auto;letter-spacing:.02em')}>Dáta appky sa teraz ukladajú natrvalo.</p>
        </div>
      )}

      {s.screen === 'client-auth' && (
        <div style={st('flex:1;display:flex;flex-direction:column;padding:76px 30px 40px;box-sizing:border-box;background:var(--porcelain)')}>
          <button onClick={backToEntry} style={st('all:unset;cursor:pointer;display:flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--mocha);font-size:.76rem;letter-spacing:.1em;text-transform:uppercase')}><span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={13} /></span>Späť</button>
          <div style={st('display:flex;flex-direction:column;align-items:center;margin-bottom:28px')}>
            <img src="assets/aura-mark.svg" alt="" style={{ width: 44, height: 44, marginBottom: 12 }} />
            <div style={st('font-family:var(--font-display);font-size:1.4rem;color:var(--ink)')}>{s.authMode === 'login' ? 'Prihlásenie klientky' : 'Vytvorenie účtu'}</div>
          </div>
          {s.authMode === 'register' && (
            <input value={s.authName} onChange={(e) => set({ authName: e.target.value })} placeholder="Meno a priezvisko" style={st(inputStyle)} />
          )}
          <input value={s.authEmail} onChange={(e) => set({ authEmail: e.target.value })} placeholder="Email" type="email" style={st(inputStyle)} />
          <input value={s.authPassword} onChange={(e) => set({ authPassword: e.target.value })} placeholder="Heslo" type="password" style={st(inputStyle)} />
          {s.authError && <p style={{ color: '#b23b3b', fontFamily: 'var(--font-sans)', fontSize: '.8rem', margin: '0 0 12px', lineHeight: 1.5 }}>{s.authError}</p>}
          <button onClick={s.authMode === 'login' ? doClientLogin : doClientRegister} style={st('all:unset;cursor:pointer;display:block;width:100%;box-sizing:border-box;text-align:center;padding:15px;border-radius:999px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.76rem;letter-spacing:.16em;text-transform:uppercase;margin-top:6px;margin-bottom:18px;box-shadow:var(--shadow-md)')}>{s.authMode === 'login' ? 'Prihlásiť sa' : 'Zaregistrovať sa'}</button>
          <button onClick={() => set({ authMode: s.authMode === 'login' ? 'register' : 'login', authError: '' })} style={st('all:unset;cursor:pointer;text-align:center;font-family:var(--font-sans);font-size:.78rem;color:var(--mocha)')}>{s.authMode === 'login' ? 'Nemáte účet? Zaregistrujte sa' : 'Už máte účet? Prihláste sa'}</button>
        </div>
      )}

      {s.screen === 'admin-auth' && (
        <div style={st('flex:1;display:flex;flex-direction:column;padding:76px 30px 40px;box-sizing:border-box;background:var(--porcelain)')}>
          <button onClick={backToEntry} style={st('all:unset;cursor:pointer;display:flex;align-items:center;gap:6px;margin-bottom:24px;color:var(--mocha);font-size:.76rem;letter-spacing:.1em;text-transform:uppercase')}><span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={13} /></span>Späť</button>
          <div style={st('display:flex;flex-direction:column;align-items:center;margin-bottom:28px')}>
            <img src="assets/aura-mark.svg" alt="" style={{ width: 44, height: 44, marginBottom: 12 }} />
            <div style={st('font-family:var(--font-display);font-size:1.4rem;color:var(--ink)')}>Prihlásenie — Michaela</div>
          </div>
          <input value={s.authEmail} onChange={(e) => set({ authEmail: e.target.value })} placeholder="Email" type="email" style={st(inputStyle)} />
          <input value={s.authPassword} onChange={(e) => set({ authPassword: e.target.value })} placeholder="Heslo" type="password" style={st(inputStyle)} />
          {s.authError && <p style={{ color: '#b23b3b', fontFamily: 'var(--font-sans)', fontSize: '.8rem', margin: '0 0 12px', lineHeight: 1.5 }}>{s.authError}</p>}
          <button onClick={doAdminLogin} style={st('all:unset;cursor:pointer;display:block;width:100%;box-sizing:border-box;text-align:center;padding:15px;border-radius:999px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.76rem;letter-spacing:.16em;text-transform:uppercase;margin-top:6px;box-shadow:var(--shadow-md)')}>Prihlásiť sa</button>
          <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.72rem;color:var(--ink-3);text-align:center;margin-top:24px;line-height:1.6')}>Účet pre admin prístup zakladá majiteľ appky ručne vo Firebase konzole.</p>
        </div>
      )}

      {atClient && (
        <div style={st('flex:1;display:flex;flex-direction:column;min-height:100%;position:relative')}>
          <div style={st('padding:56px 20px 14px;display:flex;align-items:center;justify-content:space-between;background:var(--porcelain);position:sticky;top:0;z-index:5')}>
            <div>
              <div style={st('font-family:var(--font-sans);font-size:.6rem;letter-spacing:.26em;text-transform:uppercase;color:var(--mocha)')}>{clientHeaderEyebrow}</div>
              <div style={st('font-family:var(--font-display);font-size:1.55rem;color:var(--ink);margin-top:2px')}>{clientHeaderTitle}</div>
            </div>
            <button onClick={backToLogin} style={st('all:unset;cursor:pointer;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid var(--line-gold);color:var(--ink-2)')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M15 5H8a2 2 0 00-2 2v10a2 2 0 002 2h7M11 8l-4 4 4 4M7 12h13" /></svg>
            </button>
          </div>

          {tabHome && (
            <div style={st('flex:1;padding:4px 20px 100px;overflow:auto')}>
              <div style={st('font-family:var(--font-sans);font-weight:300;font-size:.95rem;color:var(--ink-2);margin-bottom:18px')}>Dobrý deň, <span style={{ color: 'var(--ink)' }}>{loggedInClient ? loggedInClient.name.split(' ')[0] : ''}</span> 🤍</div>
              {isBirthdayToday && (
                <div style={st('border-radius:24px;padding:22px;background:var(--white);border:1px solid var(--line-gold);box-shadow:var(--shadow-md);margin-bottom:16px;text-align:center')}>
                  <div style={st('font-family:var(--font-sans);font-size:.6rem;letter-spacing:.24em;text-transform:uppercase;color:var(--mocha);margin-bottom:10px')}>Darček od Aura Nails</div>
                  <div style={st('font-family:var(--font-display);font-size:1.4rem;color:var(--ink);margin-bottom:8px')}>Všetko najlepšie k narodeninám!</div>
                  <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.86rem;color:var(--ink-2);line-height:1.6;margin:0 0 16px')}>Nech je váš deň krásny ako vaše nechty. Máte od nás 10 % zľavu na ďalšiu starostlivosť.</p>
                  <span style={st('display:inline-block;font-family:var(--font-sans);font-size:.8rem;letter-spacing:.1em;color:var(--espresso);padding:9px 18px;border-radius:999px;border:1px dashed var(--line-gold);background:var(--cream)')}>{BIRTHDAY_DISCOUNT_CODE}</span>
                </div>
              )}
              {upcomingAppts.length > 0 && (
                <div style={st('border-radius:24px;padding:22px;background:linear-gradient(135deg,var(--taupe-light),var(--espresso));color:var(--porcelain);box-shadow:var(--shadow-lg);margin-bottom:20px')}>
                  <div style={st('font-family:var(--font-sans);font-size:.6rem;letter-spacing:.24em;text-transform:uppercase;color:var(--taupe-light);margin-bottom:8px')}>Váš najbližší termín</div>
                  <div style={st('font-family:var(--font-display);font-size:1.5rem;margin-bottom:6px')}>{upcomingAppts[0].service}</div>
                  <div style={st('font-family:var(--font-sans);font-weight:300;font-size:.9rem;opacity:.9')}>{upcomingAppts[0].date} · {upcomingAppts[0].time}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    <span style={st('font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;padding:6px 12px;border-radius:999px;background:rgba(247,242,239,.18);border:1px solid rgba(247,242,239,.35)')}>{upcomingAppts[0].badgeLabel}</span>
                  </div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
                <button onClick={goBooking} style={st('all:unset;cursor:pointer;display:flex;flex-direction:column;gap:10px;padding:18px;border-radius:18px;background:var(--white);border:1px solid var(--line)')}>
                  <span style={st('width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--taupe);color:var(--espresso)')}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M4 10h16M8 3v4M16 3v4" /></svg>
                  </span>
                  <span style={st('font-family:var(--font-display);font-size:1.05rem;color:var(--ink)')}>Rezervovať termín</span>
                </button>
                <button onClick={goPass} style={st('all:unset;cursor:pointer;display:flex;flex-direction:column;gap:10px;padding:18px;border-radius:18px;background:var(--white);border:1px solid var(--line)')}>
                  <span style={st('width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--taupe);color:var(--espresso)')}><Icon name="heart" size={17} /></span>
                  <span style={st('font-family:var(--font-display);font-size:1.05rem;color:var(--ink)')}>Aura Pass ({clientStamps}/5)</span>
                </button>
                <button onClick={goPricing} style={st('all:unset;cursor:pointer;display:flex;flex-direction:column;gap:10px;padding:18px;border-radius:18px;background:var(--white);border:1px solid var(--line)')}>
                  <span style={st('width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--taupe);color:var(--espresso)')}><Icon name="list" size={17} /></span>
                  <span style={st('font-family:var(--font-display);font-size:1.05rem;color:var(--ink)')}>Cenník</span>
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={st('font-family:var(--font-display);font-size:1.15rem;color:var(--ink)')}>Pripomienky</div>
                <button onClick={goReminders} style={st('all:unset;cursor:pointer;font-family:var(--font-sans);font-size:.7rem;letter-spacing:.1em;color:var(--mocha)')}>Všetky</button>
              </div>
              {notificationsPreview.map((n, i) => (
                <div key={i} style={st('display:flex;gap:12px;padding:14px 0;border-bottom:1px solid var(--line)')}>
                  <span style={st('width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid var(--line-gold);color:var(--mocha);flex-shrink:0')}><Icon name={n.icon} size={15} /></span>
                  <div style={{ minWidth: 0 }}>
                    <div style={st('font-family:var(--font-sans);font-size:.86rem;color:var(--ink)')}>{n.title}</div>
                    <div style={st('font-family:var(--font-sans);font-weight:300;font-size:.78rem;color:var(--ink-3);margin-top:2px;line-height:1.4')}>{n.text}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tabBooking && (
            <div style={st('flex:1;padding:4px 20px 100px;overflow:auto')}>
              {b.done && (
                <div style={st('display:flex;flex-direction:column;align-items:center;text-align:center;padding-top:40px')}>
                  <span style={st('width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid var(--line-gold);color:var(--espresso);margin-bottom:20px')}><Icon name="check" size={28} /></span>
                  <div style={st('font-family:var(--font-display);font-size:1.6rem;color:var(--ink);margin-bottom:10px')}>Žiadosť odoslaná</div>
                  <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.88rem;color:var(--ink-2);line-height:1.7;max-width:260px')}>{bookingSummary} — čaká na potvrdenie od Michaely. Ozveme sa vám čoskoro.</p>
                  <span style={st('margin-top:14px;font-size:.6rem;letter-spacing:.16em;text-transform:uppercase;padding:6px 14px;border-radius:999px;background:rgba(140,110,98,.15);color:var(--mocha);border:1px solid var(--line-gold)')}>Čaká na potvrdenie</span>
                  <button onClick={resetBooking} style={st('all:unset;cursor:pointer;margin-top:28px;font-family:var(--font-sans);font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--mocha);border-bottom:1px solid var(--line-gold);padding-bottom:4px')}>Nová rezervácia</button>
                </div>
              )}
              {!b.done && (
                <React.Fragment>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
                    <div style={st(dotStyle(step0, b.step > 0))}></div><div style={st(dotStyle(step1, b.step > 1))}></div>
                    <div style={st(dotStyle(step2, b.step > 2))}></div><div style={st(dotStyle(step3, false))}></div>
                  </div>
                  {step0 && (
                    <React.Fragment>
                      <div style={st('font-family:var(--font-display);font-size:1.3rem;color:var(--ink);margin-bottom:4px')}>1 · Vyberte službu</div>
                      <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.82rem;color:var(--ink-3);margin:0 0 18px')}>Presný typ doladíme spolu priamo v štúdiu.</p>
                      {serviceOptions.map((svc, i) => (
                        <button key={i} onClick={svc.select} style={st(svc.style)}>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{svc.name}</span>
                          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '.76rem', display: 'block', marginTop: 3, opacity: .7 }}>{svc.sub}</span>
                        </button>
                      ))}
                    </React.Fragment>
                  )}
                  {step1 && (
                    <React.Fragment>
                      <div style={st('font-family:var(--font-display);font-size:1.3rem;color:var(--ink);margin-bottom:4px')}>2 · Vyberte deň</div>
                      <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.82rem;color:var(--ink-3);margin:0 0 18px')}>{booking_selectedService}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9 }}>
                        {dateOptions.map((d, i) => (
                          <button key={i} onClick={d.select} style={st(d.style)}>
                            <span style={{ display: 'block', fontSize: '.6rem', letterSpacing: '.08em', textTransform: 'uppercase', opacity: .7 }}>{d.dow}</span>
                            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginTop: 2 }}>{d.num}</span>
                            <span style={{ display: 'block', fontSize: '.55rem', textTransform: 'uppercase', opacity: .6 }}>{d.mon}</span>
                          </button>
                        ))}
                      </div>
                    </React.Fragment>
                  )}
                  {step2 && (
                    <React.Fragment>
                      <div style={st('font-family:var(--font-display);font-size:1.3rem;color:var(--ink);margin-bottom:4px')}>3 · Vyberte čas</div>
                      <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.82rem;color:var(--ink-3);margin:0 0 18px')}>{booking_selectedDate} · trvanie {booking_durationLabel}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
                        {timeOptions.map((t, i) => (
                          <button key={i} onClick={t.select} disabled={t.taken} style={st(t.style)}>{t.label}</button>
                        ))}
                      </div>
                    </React.Fragment>
                  )}
                  {step3 && (
                    <React.Fragment>
                      <div style={st('font-family:var(--font-display);font-size:1.3rem;color:var(--ink);margin-bottom:16px')}>4 · Zhrnutie</div>
                      <div style={st('border-radius:20px;padding:20px;background:var(--cream);border:1px solid var(--line);margin-bottom:20px')}>
                        <div style={st('display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--line)')}><span style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--ink-3)' }}>Služba</span><span style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink)' }}>{booking_selectedService}</span></div>
                        <div style={st('display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--line)')}><span style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--ink-3)' }}>Deň</span><span style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink)' }}>{booking_selectedDate}</span></div>
                        <div style={st('display:flex;justify-content:space-between;padding:9px 0')}><span style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--ink-3)' }}>Čas</span><span style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink)' }}>{b.time}</span></div>
                      </div>
                      <button onClick={submitBooking} style={st('all:unset;cursor:pointer;display:block;width:100%;box-sizing:border-box;text-align:center;padding:16px;border-radius:999px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.76rem;letter-spacing:.2em;text-transform:uppercase;box-shadow:var(--shadow-md)')}>Odoslať rezerváciu</button>
                    </React.Fragment>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22 }}>
                    <button onClick={prevStep} disabled={step0} style={st(prevBtnStyle)}>Späť</button>
                    {!step3 && <button onClick={nextStep} disabled={nextDisabled} style={st(nextBtnStyle)}>Ďalej</button>}
                  </div>
                </React.Fragment>
              )}
            </div>
          )}

          {tabPass && (
            <div style={st('flex:1;padding:4px 20px 100px;overflow:auto')}>
              <div style={st('position:relative;border-radius:26px;padding:22px;background:rgba(255,255,255,.85);border:1px solid var(--line-gold);box-shadow:var(--shadow-lg);margin-bottom:22px;overflow:hidden')}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src="assets/aura-mark.svg" alt="" style={{ width: 28, height: 28 }} />
                    <div>
                      <div style={st('font-family:var(--font-display);font-size:1.2rem;color:var(--ink)')}>Aura Pass</div>
                      <div style={st('font-size:.55rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-3)')}>MF · Handlová</div>
                    </div>
                  </div>
                  <span style={st('font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;padding:6px 12px;border-radius:999px;background:rgba(62,39,39,.1);color:var(--mocha);border:1px solid var(--line-gold)')}>{clientStamps}/5</span>
                </div>
                <div style={{ height: 1, background: 'var(--line-gold)', marginBottom: 18 }}></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                  {passStampDots.map((p, i) => (
                    <button key={i} onClick={p.click} style={st(p.style)}><Icon name="sparkle" size={20} /></button>
                  ))}
                  <button onClick={claimReward} style={st(rewardStyle)}>
                    <Icon name="gift" size={22} />
                    <span style={{ fontSize: '.5rem', letterSpacing: '.12em', textTransform: 'uppercase', display: 'block', marginTop: 4 }}>Darček</span>
                  </button>
                </div>
                <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.8rem;color:var(--ink-3);text-align:center;margin:18px 0 4px;line-height:1.6')}>{passHelperText}</p>
                {passShowReset && <button onClick={resetPass} style={st('all:unset;cursor:pointer;display:block;margin:8px auto 0;font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3)')}>Vynulovať kartu</button>}
              </div>
              <div style={st('font-family:var(--font-display);font-size:1.15rem;color:var(--ink);margin-bottom:10px')}>Ako to funguje</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: 'sparkle', title: 'Za každú návštevu', text: 'Jedna pečiatka pri každom termíne.' },
                  { icon: 'heart', title: 'Päť rituálov krásy', text: 'Vlastným tempom, bez ponáhľania.' },
                  { icon: 'gift', title: 'Šiesta s darčekom', text: 'Rituál so zľavou a malým darčekom.' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12 }}>
                    <span style={st('width:36px;height:36px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;border:1px solid var(--line-gold);color:var(--mocha)')}><Icon name={item.icon} size={16} /></span>
                    <div>
                      <div style={st('font-family:var(--font-display);font-size:1rem;color:var(--ink)')}>{item.title}</div>
                      <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.8rem;color:var(--ink-3);margin:3px 0 0;line-height:1.5')}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tabPricing && (
            <div style={st('flex:1;padding:4px 20px 100px;overflow:auto')}>
              <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.84rem;color:var(--ink-2);margin:0 0 18px;line-height:1.6')}>Každá služba zahŕňa konzultáciu, dokonalú hygienu a čas venovaný len vám.</p>
              {cennikCategories.map((cat, i) => (
                <div key={i} style={st('border-radius:18px;background:var(--white);border:1px solid var(--line);margin-bottom:12px;overflow:hidden')}>
                  <button onClick={cat.toggle} style={st('all:unset;cursor:pointer;display:flex;align-items:center;justify-content:space-between;width:100%;box-sizing:border-box;padding:16px 18px')}>
                    <span><span style={{ fontFamily: 'var(--font-display)', fontSize: '1.08rem', color: 'var(--ink)', display: 'block' }}>{cat.name}</span><span style={{ fontSize: '.68rem', color: 'var(--ink-3)', letterSpacing: '.06em' }}>{cat.sub}</span></span>
                    <span style={st(cat.chevStyle)}><Icon name="arrow" size={14} /></span>
                  </button>
                  {cat.open && (
                    <div style={{ padding: '0 18px 14px' }}>
                      {cat.items.map((it, j) => (
                        <div key={j} style={st('display:flex;justify-content:space-between;padding:9px 0;border-top:1px solid var(--line)')}>
                          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '.84rem', color: 'var(--ink-2)' }}>{it.label}</span>
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.84rem', color: 'var(--mocha)' }}>{it.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tabProfile && (
            <div style={st('flex:1;padding:4px 20px 100px;overflow:auto')}>
              {s.profileView === 'main' && (
                <React.Fragment>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                    <img src="assets/michaela.jpg" alt="" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--line-gold)' }} />
                    <div><div style={st('font-family:var(--font-display);font-size:1.2rem;color:var(--ink)')}>{loggedInClient ? loggedInClient.name : '—'}</div><div style={{ fontSize: '.78rem', color: 'var(--ink-3)' }}>{loggedInClient ? (loggedInClient.email || loggedInClient.phone) : ''}</div></div>
                  </div>
                  <div style={st('border-radius:16px;border:1px solid var(--line);background:var(--white);padding:14px 16px;margin-bottom:22px;display:flex;align-items:center;justify-content:space-between;gap:12px')}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.86rem', color: 'var(--ink)' }}>Dátum narodenia</span>
                    <input type="date" value={clientBirthday} onChange={setClientBirthday} style={{ all: 'unset', fontFamily: 'var(--font-sans)', fontSize: '.84rem', color: 'var(--mocha)', textAlign: 'right' }} />
                  </div>
                  <div style={st('display:flex;flex-direction:column;border-radius:18px;border:1px solid var(--line);background:var(--white);margin-bottom:22px;overflow:hidden')}>
                    <button onClick={goReminders} style={st('all:unset;cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:15px 16px')}><span style={{ fontFamily: 'var(--font-sans)', fontSize: '.9rem', color: 'var(--ink)' }}>Pripomienky a upozornenia</span><Icon name="arrow" size={14} /></button>
                  </div>
                  <div style={st('font-family:var(--font-display);font-size:1.1rem;color:var(--ink);margin-bottom:10px')}>Nadchádzajúce</div>
                  {upcomingAppts.length === 0 && <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '.84rem', color: 'var(--ink-3)' }}>Žiadne nadchádzajúce termíny.</p>}
                  {upcomingAppts.map((a, i) => (
                    <div key={i} style={st('display:flex;justify-content:space-between;align-items:center;padding:13px 0;border-bottom:1px solid var(--line)')}>
                      <div><div style={{ fontFamily: 'var(--font-sans)', fontSize: '.86rem', color: 'var(--ink)' }}>{a.service}</div><div style={{ fontSize: '.74rem', color: 'var(--ink-3)', marginTop: 2 }}>{a.date} · {a.time}</div></div>
                      <span style={st(a.badgeStyle)}>{a.badgeLabel}</span>
                    </div>
                  ))}
                  <div style={st('font-family:var(--font-display);font-size:1.1rem;color:var(--ink);margin:20px 0 10px')}>História</div>
                  {historyAppts.length === 0 && <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '.84rem', color: 'var(--ink-3)' }}>Zatiaľ žiadna história.</p>}
                  {historyAppts.map((h, i) => (
                    <div key={i} style={st('display:flex;justify-content:space-between;align-items:center;padding:13px 0;border-bottom:1px solid var(--line)')}>
                      <div><div style={{ fontFamily: 'var(--font-sans)', fontSize: '.86rem', color: 'var(--ink)' }}>{h.service}</div><div style={{ fontSize: '.74rem', color: 'var(--ink-3)', marginTop: 2 }}>{h.date} · {h.time}</div></div>
                      <span style={{ fontSize: '.62rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Dokončené</span>
                    </div>
                  ))}
                </React.Fragment>
              )}
              {s.profileView === 'reminders' && (
                <React.Fragment>
                  <button onClick={backToProfile} style={st('all:unset;cursor:pointer;display:flex;align-items:center;gap:6px;margin-bottom:16px;color:var(--mocha);font-size:.76rem;letter-spacing:.1em;text-transform:uppercase')}><span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={13} /></span>Späť</button>
                  <div style={st('font-family:var(--font-display);font-size:1.1rem;color:var(--ink);margin-bottom:10px')}>Nastavenia</div>
                  <div style={st('border-radius:16px;border:1px solid var(--line);background:var(--white);margin-bottom:22px')}>
                    <div style={st('display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--line)')}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.86rem', color: 'var(--ink)' }}>Deň vopred</span>
                      <button onClick={toggleDayBefore} style={st(toggleTrack(s.dayBefore))}><span style={st(toggleKnob(s.dayBefore))}></span></button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.86rem', color: 'var(--ink)' }}>2 hodiny vopred</span>
                      <button onClick={toggleHourBefore} style={st(toggleTrack(s.hourBefore))}><span style={st(toggleKnob(s.hourBefore))}></span></button>
                    </div>
                  </div>
                  <div style={st('font-family:var(--font-display);font-size:1.1rem;color:var(--ink);margin-bottom:10px')}>Nedávne</div>
                  {notifications.map((n, i) => (
                    <div key={i} style={st('display:flex;gap:12px;padding:13px 0;border-bottom:1px solid var(--line)')}>
                      <span style={st('width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid var(--line-gold);color:var(--mocha);flex-shrink:0')}><Icon name={n.icon} size={14} /></span>
                      <div style={{ minWidth: 0, flex: 1 }}><div style={{ fontFamily: 'var(--font-sans)', fontSize: '.84rem', color: 'var(--ink)' }}>{n.title}</div><div style={{ fontSize: '.76rem', color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.4 }}>{n.text}</div></div>
                      <span style={{ fontSize: '.66rem', color: 'var(--ink-3)', flexShrink: 0 }}>{n.time}</span>
                    </div>
                  ))}
                </React.Fragment>
              )}
            </div>
          )}

          <div style={st('display:flex;justify-content:space-around;align-items:center;padding:10px 6px 26px;background:rgba(247,242,239,.92);backdrop-filter:blur(14px);border-top:1px solid var(--line);position:sticky;bottom:0;z-index:5')}>
            <button onClick={goHome} style={st(navBtn(tabHome))}>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11.5L12 4l8 7.5" /><path d="M6 10v9h5v-5h2v5h5v-9" /></svg>
              <span style={{ fontSize: '.56rem', letterSpacing: '.04em', marginTop: 3 }}>Domov</span>
            </button>
            <button onClick={goBooking} style={st(navBtn(tabBooking))}>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M4 10h16M8 3v4M16 3v4" /></svg>
              <span style={{ fontSize: '.56rem', letterSpacing: '.04em', marginTop: 3 }}>Rezervácia</span>
            </button>
            <button onClick={goPass} style={st(navBtn(tabPass))}><Icon name="heart" size={21} /><span style={{ fontSize: '.56rem', letterSpacing: '.04em', marginTop: 3 }}>Pass</span></button>
            <button onClick={goPricing} style={st(navBtn(tabPricing))}><Icon name="list" size={21} /><span style={{ fontSize: '.56rem', letterSpacing: '.04em', marginTop: 3 }}>Cenník</span></button>
            <button onClick={goProfile} style={st(navBtn(tabProfile))}>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8.2" r="3.6" /><path d="M5 20c0-4 3.2-6.4 7-6.4s7 2.4 7 6.4" /></svg>
              <span style={{ fontSize: '.56rem', letterSpacing: '.04em', marginTop: 3 }}>Profil</span>
            </button>
          </div>
        </div>
      )}

      {atAdmin && (
        <div style={st('flex:1;display:flex;flex-direction:column;min-height:100%;position:relative;background:var(--porcelain)')}>
          <div style={st('padding:56px 20px 14px;display:flex;align-items:center;justify-content:space-between;background:var(--espresso);position:sticky;top:0;z-index:5')}>
            <div>
              <div style={st('font-family:var(--font-sans);font-size:.6rem;letter-spacing:.26em;text-transform:uppercase;color:var(--taupe-light)')}>Michaela · Admin</div>
              <div style={st('font-family:var(--font-display);font-size:1.5rem;color:var(--porcelain);margin-top:2px')}>{adminHeaderMap[s.adminTab]}</div>
            </div>
            <button onClick={backToLogin} style={st('all:unset;cursor:pointer;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid rgba(247,242,239,.35);color:var(--taupe-light)')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M15 5H8a2 2 0 00-2 2v10a2 2 0 002 2h7M11 8l-4 4 4 4M7 12h13" /></svg>
            </button>
          </div>

          {adminTabOverview && (
            <div style={st('flex:1;padding:4px 20px 100px;overflow:auto')}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line)')}><div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', color: 'var(--ink)' }}>{adminTodayCount}</div><div style={{ fontSize: '.68rem', color: 'var(--ink-3)', letterSpacing: '.06em' }}>Termínov dnes</div></div>
                <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line)')}><div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', color: 'var(--mocha)' }}>{adminPendingCount}</div><div style={{ fontSize: '.68rem', color: 'var(--ink-3)', letterSpacing: '.06em' }}>Čakajúce žiadosti</div></div>
              </div>
              <div style={st('font-family:var(--font-display);font-size:1.15rem;color:var(--ink);margin-bottom:10px')}>Kalendár obsadenosti</div>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, marginBottom: 18 }}>
                {calendarStrip.map((cd, i) => (
                  <button key={i} onClick={cd.select} style={st(cd.style)}>
                    <span style={{ fontSize: '.58rem', letterSpacing: '.06em', textTransform: 'uppercase', opacity: .75 }}>{cd.dow}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>{cd.num}</span>
                    <span style={st(cd.dotStyle)}></span>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={st('font-family:var(--font-display);font-size:1.15rem;color:var(--ink)')}>{calendarSelectedLabel}</div>
                {!s.blockFormOpen && <button onClick={openBlockForm} style={st('all:unset;cursor:pointer;font-family:var(--font-sans);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--mocha)')}>+ Voľno</button>}
              </div>
              {s.blockFormOpen && (
                <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line-gold);margin-bottom:16px')}>
                  <div style={st('font-family:var(--font-display);font-size:1rem;color:var(--ink);margin-bottom:12px')}>Nastaviť voľno — {calendarSelectedLabel}</div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    <button onClick={() => set({ blockAllDay: true })} style={st(blockTimePresetStyle(s.blockAllDay))}>Celý deň</button>
                    <button onClick={() => set({ blockAllDay: false })} style={st(blockTimePresetStyle(!s.blockAllDay))}>Konkrétny čas</button>
                  </div>
                  {!s.blockAllDay && (
                    <React.Fragment>
                      <div style={{ fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 6 }}>Od</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                        {buildTimeOptions().map((t, i) => (
                          <button key={i} onClick={() => set({ blockTime: t })} style={st(blockTimePresetStyle(s.blockTime === t))}>{t}</button>
                        ))}
                      </div>
                      <div style={{ fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 6 }}>Trvanie</div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                        {DURATION_PRESETS.map((d, i) => (
                          <button key={i} onClick={() => set({ blockDuration: d.val })} style={st(blockTimePresetStyle(s.blockDuration === d.val))}>{d.label}</button>
                        ))}
                      </div>
                    </React.Fragment>
                  )}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={cancelBlockForm} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:11px;border-radius:999px;border:1px solid var(--line-gold);color:var(--ink-2);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase')}>Zrušiť</button>
                    <button onClick={saveBlock} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:11px;border-radius:999px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase')}>Uložiť</button>
                  </div>
                </div>
              )}
              {noDayAppts && <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.84rem;color:var(--ink-3);padding:8px 0')}>Žiadne termíny na tento deň.</p>}
              {selectedDayAppts.map((ap, i) => (
                <button key={i} onClick={ap.open} style={st('all:unset;cursor:pointer;display:flex;align-items:center;gap:14px;width:100%;box-sizing:border-box;padding:14px 0;border-bottom:1px solid var(--line)')}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--ink)', width: 48, flexShrink: 0, textAlign: 'left' }}>{ap.time}</div>
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}><div style={{ fontFamily: 'var(--font-sans)', fontSize: '.86rem', color: 'var(--ink)' }}>{ap.name}</div><div style={{ fontSize: '.76rem', color: 'var(--ink-3)', marginTop: 2 }}>{ap.service}</div></div>
                  <span style={st(ap.badgeStyle)}>{ap.badgeLabel}</span>
                </button>
              ))}
            </div>
          )}

          {adminTabRequests && (
            <div style={st('flex:1;padding:4px 20px 100px;overflow:auto')}>
              {noRequests && (
                <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--ink-3)' }}>
                  <div style={st('font-family:var(--font-display);font-size:1.2rem;color:var(--ink);margin-bottom:8px')}>Žiadne čakajúce žiadosti</div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '.84rem' }}>Všetko je vybavené — skvelá práca.</p>
                </div>
              )}
              {adminRequestsList.map((r, i) => (
                <div key={i} style={st('border-radius:18px;padding:16px;background:var(--white);border:1px solid var(--line);margin-bottom:12px')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div><div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--ink)' }}>{r.name}</div><div style={{ fontSize: '.76rem', color: 'var(--ink-3)', marginTop: 2 }}>{r.phone}</div></div>
                    <span style={st('font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;padding:5px 10px;border-radius:999px;background:rgba(140,110,98,.14);color:var(--mocha)')}>Nová</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '.86rem', color: 'var(--ink-2)', marginBottom: 4 }}>{r.service}</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--ink-3)', marginBottom: 14 }}>{r.dateLabel} · {r.time}</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={r.reject} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:11px;border-radius:999px;border:1px solid var(--line-gold);color:var(--ink-2);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase')}>Zamietnuť</button>
                    <button onClick={r.approve} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:11px;border-radius:999px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase')}>Potvrdiť</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {adminTabClients && (
            <div style={st('flex:1;padding:4px 20px 100px;overflow:auto')}>
              {clientsListView && (
                <React.Fragment>
                  {s.addFormOpen && (
                    <div style={st('border-radius:18px;padding:16px;background:var(--white);border:1px solid var(--line-gold);margin-bottom:16px')}>
                      <div style={st('font-family:var(--font-display);font-size:1.05rem;color:var(--ink);margin-bottom:12px')}>Nová klientka</div>
                      <input value={s.newClientName} onChange={(e) => set({ newClientName: e.target.value })} placeholder="Meno a priezvisko" style={st(inputStyle)} />
                      <input value={s.newClientPhone} onChange={(e) => set({ newClientPhone: e.target.value })} placeholder="Telefónne číslo" style={st(inputStyle)} />
                      <div style={{ fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 6 }}>Termín z kalendára (nepovinné)</div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                        <input value={s.newClientDate} onChange={(e) => set({ newClientDate: e.target.value })} placeholder="napr. 14. aug" style={st('all:unset;flex:1;box-sizing:border-box;padding:11px 14px;border-radius:12px;border:1px solid var(--line);background:var(--cream);font-family:var(--font-sans);font-size:.86rem;color:var(--ink)')} />
                        <input value={s.newClientTime} onChange={(e) => set({ newClientTime: e.target.value })} placeholder="14:00" style={st('all:unset;width:90px;box-sizing:border-box;padding:11px 14px;border-radius:12px;border:1px solid var(--line);background:var(--cream);font-family:var(--font-sans);font-size:.86rem;color:var(--ink)')} />
                      </div>
                      <input value={s.newClientService} onChange={(e) => set({ newClientService: e.target.value })} placeholder="Služba (napr. Gélové nechty)" style={st(inputStyle)} />
                      <div style={{ fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 6 }}>Trvanie úkonu</div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                        {durationPresetOptions.map((dp, i) => (
                          <button key={i} onClick={dp.select} style={st(dp.style)}>{dp.label}</button>
                        ))}
                      </div>
                      <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.74rem;color:var(--ink-3);margin:0 0 14px;line-height:1.5')}>Vyplňte termín, ak si klientka dohodla čas telefonicky alebo osobne — obsadí to daný čas aj v rezervačnom kalendári appky.</p>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={cancelAddClient} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:11px;border-radius:999px;border:1px solid var(--line-gold);color:var(--ink-2);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase')}>Zrušiť</button>
                        <button onClick={saveNewClient} disabled={saveDisabled} style={st(saveBtnStyle)}>Uložiť</button>
                      </div>
                    </div>
                  )}
                  {!s.addFormOpen && (
                    <button onClick={openAddClient} style={st('all:unset;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;box-sizing:border-box;padding:13px;border-radius:999px;border:1px dashed var(--line-gold);color:var(--mocha);font-family:var(--font-sans);font-size:.76rem;letter-spacing:.12em;text-transform:uppercase;margin-bottom:16px')}>+ Pridať klientku</button>
                  )}
                  <input value={s.clientSearch} onChange={(e) => set({ clientSearch: e.target.value })} placeholder="Hľadať podľa mena, emailu alebo telefónu" style={st(inputStyle + ';margin-bottom:16px')} />
                  {noSearchResults && <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '.84rem', color: 'var(--ink-3)', textAlign: 'center', padding: '20px 0' }}>Žiadna klientka nezodpovedá hľadaniu.</p>}
                  {adminClientsListFiltered.map((c, i) => (
                    <button key={i} onClick={c.open} style={st('all:unset;cursor:pointer;display:flex;align-items:center;gap:12px;width:100%;box-sizing:border-box;padding:13px 0;border-bottom:1px solid var(--line)')}>
                      <span style={st('width:40px;height:40px;border-radius:50%;background:var(--taupe);color:var(--espresso);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:1rem;flex-shrink:0')}>{c.initials}</span>
                      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}><div style={{ fontFamily: 'var(--font-sans)', fontSize: '.9rem', color: 'var(--ink)' }}>{c.name}</div><div style={{ fontSize: '.76rem', color: 'var(--ink-3)', marginTop: 2 }}>{c.email || c.phone}</div></div>
                      <span style={{ fontSize: '.68rem', letterSpacing: '.06em', color: 'var(--mocha)', flexShrink: 0 }}>{c.stamps}/5</span>
                    </button>
                  ))}
                </React.Fragment>
              )}

              {!clientsListView && (
                <React.Fragment>
                  <button onClick={backToClients} style={st('all:unset;cursor:pointer;display:flex;align-items:center;gap:6px;margin-bottom:16px;color:var(--mocha);font-size:.76rem;letter-spacing:.1em;text-transform:uppercase')}><span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow" size={13} /></span>Klientky</button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                    <span style={st('width:52px;height:52px;border-radius:50%;background:var(--taupe);color:var(--espresso);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:1.25rem;flex-shrink:0')}>{selClientInitials}</span>
                    <div><div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--ink)' }}>{selClient.name}</div><div style={{ fontSize: '.78rem', color: 'var(--ink-3)' }}>{selClient.phone}</div></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <div style={st('border-radius:14px;padding:14px;background:var(--white);border:1px solid var(--line)')}><div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--ink)' }}>{selClient.visits}</div><div style={{ fontSize: '.66rem', color: 'var(--ink-3)' }}>Návštev spolu</div></div>
                    <div style={st('border-radius:14px;padding:14px;background:var(--white);border:1px solid var(--line)')}><div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--ink)' }}>{selClient.lastVisit}</div><div style={{ fontSize: '.66rem', color: 'var(--ink-3)' }}>Posledná návšteva</div></div>
                  </div>
                  <div style={st('border-radius:14px;padding:14px 16px;background:var(--white);border:1px solid var(--line);margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;gap:12px')}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.84rem', color: 'var(--ink)' }}>Dátum narodenia</span>
                    <input type="date" value={selClient.birthday || ''} onChange={updateClientBirthday} style={{ all: 'unset', fontFamily: 'var(--font-sans)', fontSize: '.82rem', color: 'var(--mocha)', textAlign: 'right' }} />
                  </div>
                  <div style={st('font-family:var(--font-display);font-size:1.1rem;color:var(--ink);margin-bottom:10px')}>Aura Pass pečiatky</div>
                  <div style={st('border-radius:18px;padding:18px;background:var(--white);border:1px solid var(--line-gold);margin-bottom:22px')}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, marginBottom: 14 }}>
                      {selClientStamps.map((p, i) => (<div key={i} style={st(p.style)}><Icon name="sparkle" size={16} /></div>))}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={removeStampSel} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:10px;border-radius:999px;border:1px solid var(--line-gold);color:var(--ink-2);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase')}>− Pečiatka</button>
                      <button onClick={addStampSel} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:10px;border-radius:999px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase')}>+ Pečiatka</button>
                    </div>
                  </div>
                  <div style={st('font-family:var(--font-display);font-size:1.1rem;color:var(--ink);margin-bottom:10px')}>História návštev</div>
                  {selClientHistory.map((h, i) => (
                    <div key={i} style={st('display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--line)')}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.84rem', color: 'var(--ink-2)' }}>{h.service}</span>
                      <span style={{ fontSize: '.76rem', color: 'var(--ink-3)' }}>{h.date}</span>
                    </div>
                  ))}
                  <div style={st('font-family:var(--font-display);font-size:1.1rem;color:var(--ink);margin:20px 0 10px')}>Poznámky</div>
                  <textarea value={selClient.notes} onChange={updateClientNotes} placeholder="napr. alergie, preferencie, poznámky k nechtom…" style={st('all:unset;display:block;width:100%;min-height:90px;box-sizing:border-box;padding:14px;border-radius:16px;border:1px solid var(--line);background:var(--white);font-family:var(--font-sans);font-weight:300;font-size:.84rem;color:var(--ink);line-height:1.6;margin-bottom:20px;resize:none')}></textarea>
                </React.Fragment>
              )}
            </div>
          )}

          {adminTabPricing && (
            <div style={st('flex:1;padding:4px 20px 100px;overflow:auto')}>
              <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.84rem;color:var(--ink-2);margin:0 0 18px;line-height:1.6')}>Zmeny sa hneď zobrazia klientkam v appke.</p>
              {pricing.map((cat, ci) => (
                <div key={ci} style={st('border-radius:18px;background:var(--white);border:1px solid var(--line);margin-bottom:14px;overflow:hidden;padding:16px')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div><span style={{ fontFamily: 'var(--font-display)', fontSize: '1.08rem', color: 'var(--ink)', display: 'block' }}>{cat.name}</span><span style={{ fontSize: '.68rem', color: 'var(--ink-3)', letterSpacing: '.06em' }}>{cat.sub}</span></div>
                    <button onClick={() => deletePricingCategory(ci)} style={st('all:unset;cursor:pointer;color:#b23b3b;font-family:var(--font-sans);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase')}>Zmazať</button>
                  </div>
                  {cat.items.map((it, ii) => (
                    <div key={ii} style={st('display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-top:1px solid var(--line)')}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '.84rem', color: 'var(--ink-2)' }}>{it.label}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.84rem', color: 'var(--mocha)' }}>{it.price}</span>
                        <button onClick={() => deletePricingItem(ci, ii)} style={st('all:unset;cursor:pointer;color:var(--ink-3);font-size:.9rem;line-height:1')}>×</button>
                      </span>
                    </div>
                  ))}
                  {s.addItemCatIndex === ci ? (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input value={s.newItemLabel} onChange={(e) => set({ newItemLabel: e.target.value })} placeholder="Názov služby" style={st('all:unset;flex:1;box-sizing:border-box;padding:9px 12px;border-radius:10px;border:1px solid var(--line);background:var(--cream);font-family:var(--font-sans);font-size:.8rem;color:var(--ink)')} />
                        <input value={s.newItemPrice} onChange={(e) => set({ newItemPrice: e.target.value })} placeholder="35 €" style={st('all:unset;width:70px;box-sizing:border-box;padding:9px 12px;border-radius:10px;border:1px solid var(--line);background:var(--cream);font-family:var(--font-sans);font-size:.8rem;color:var(--ink)')} />
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={cancelAddItem} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:8px;border-radius:999px;border:1px solid var(--line-gold);color:var(--ink-2);font-family:var(--font-sans);font-size:.7rem;letter-spacing:.08em;text-transform:uppercase')}>Zrušiť</button>
                        <button onClick={() => saveNewItem(ci)} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:8px;border-radius:999px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.7rem;letter-spacing:.08em;text-transform:uppercase')}>Uložiť</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => openAddItem(ci)} style={st('all:unset;cursor:pointer;display:block;margin-top:10px;font-family:var(--font-sans);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--mocha)')}>+ Pridať službu</button>
                  )}
                </div>
              ))}
              {s.addCatFormOpen ? (
                <div style={st('border-radius:18px;padding:16px;background:var(--white);border:1px solid var(--line-gold)')}>
                  <input value={s.newCatName} onChange={(e) => set({ newCatName: e.target.value })} placeholder="Názov kategórie (napr. Pedikúra)" style={st(inputStyle)} />
                  <input value={s.newCatSub} onChange={(e) => set({ newCatSub: e.target.value })} placeholder="Podnadpis (nepovinné)" style={st(inputStyle)} />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={cancelAddCategory} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:11px;border-radius:999px;border:1px solid var(--line-gold);color:var(--ink-2);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase')}>Zrušiť</button>
                    <button onClick={saveNewCategory} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:11px;border-radius:999px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase')}>Uložiť</button>
                  </div>
                </div>
              ) : (
                <button onClick={openAddCategory} style={st('all:unset;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;box-sizing:border-box;padding:13px;border-radius:999px;border:1px dashed var(--line-gold);color:var(--mocha);font-family:var(--font-sans);font-size:.76rem;letter-spacing:.12em;text-transform:uppercase')}>+ Nová kategória</button>
              )}
            </div>
          )}

          <div style={st('display:flex;justify-content:space-around;align-items:center;padding:10px 6px 26px;background:rgba(247,242,239,.92);backdrop-filter:blur(14px);border-top:1px solid var(--line);position:sticky;bottom:0;z-index:5')}>
            <button onClick={goOverview} style={st(navBtn(adminTabOverview))}>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M4 10h16M8 3v4M16 3v4" /></svg>
              <span style={{ fontSize: '.56rem', letterSpacing: '.04em', marginTop: 3 }}>Prehľad</span>
            </button>
            <button onClick={goRequests} style={st(navBtn(adminTabRequests))}>
              <span style={{ position: 'relative' }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8.5c0-3.6-2.7-6-6-6s-6 2.4-6 6c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5z" /><path d="M10 18.5a2 2 0 004 0" /></svg>
                {hasPending && <span style={{ position: 'absolute', top: -2, right: -4, width: 8, height: 8, borderRadius: '50%', background: 'var(--mocha)' }}></span>}
              </span>
              <span style={{ fontSize: '.56rem', letterSpacing: '.04em', marginTop: 3 }}>Žiadosti</span>
            </button>
            <button onClick={goClients} style={st(navBtn(adminTabClients))}>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19c0-3.4 2.6-5.6 5.5-5.6s5.5 2.2 5.5 5.6" /><circle cx="17" cy="9" r="2.4" /><path d="M15 13.6c2.4.3 4.5 2.1 4.5 5.4" /></svg>
              <span style={{ fontSize: '.56rem', letterSpacing: '.04em', marginTop: 3 }}>Klientky</span>
            </button>
            <button onClick={goPricingAdmin} style={st(navBtn(adminTabPricing))}>
              <Icon name="list" size={21} />
              <span style={{ fontSize: '.56rem', letterSpacing: '.04em', marginTop: 3 }}>Cenník</span>
            </button>
          </div>
        </div>
      )}

      {s.toast.visible && (
        <div style={st('position:absolute;left:50%;bottom:90px;transform:translateX(-50%);background:var(--espresso);color:var(--porcelain);padding:10px 18px;border-radius:999px;font-family:var(--font-sans);font-size:.76rem;letter-spacing:.04em;white-space:nowrap;box-shadow:var(--shadow-lg);z-index:50')}>{s.toast.msg}</div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

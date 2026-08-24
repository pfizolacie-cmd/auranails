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
const BOOKING_WINDOW_DAYS = 30;
function buildDateOptions(days = BOOKING_WINDOW_DAYS) {
  const out = [];
  for (let i = 0; i < days; i++) {
    const iso = isoOffset(i);
    out.push({ iso, ...isoParts(iso) });
  }
  return out;
}
function buildMonthGrid(monthOffset, selectedIso, todayIsoValue, isDisabledFn, dotFn) {
  const SK_MONTH_FULL = ['Január','Február','Marec','Apríl','Máj','Jún','Júl','August','September','Október','November','December'];
  const now = new Date(todayIsoValue + 'T00:00:00');
  const viewDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const y = viewDate.getFullYear(), m = viewDate.getMonth();
  const firstOfMonth = new Date(y, m, 1);
  const startDow = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(y, m, 1 - startDow);
  const lastOfMonth = new Date(y, m + 1, 0);
  const endDow = (lastOfMonth.getDay() + 6) % 7;
  const totalDays = startDow + lastOfMonth.getDate() + (6 - endDow);
  const cells = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    const iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    cells.push({
      iso,
      num: d.getDate(),
      muted: d.getMonth() !== m,
      selected: iso === selectedIso,
      today: iso === todayIsoValue,
      disabled: isDisabledFn ? isDisabledFn(iso, d.getMonth() !== m) : false,
      dot: dotFn ? dotFn(iso) : null,
    });
  }
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return { label: `${SK_MONTH_FULL[m]} ${y}`, weeks };
}
function isoLabel(iso) {
  const p = isoParts(iso);
  return `${p.dow} ${p.num}. ${p.mon}`;
}
function daysUntilBirthday(birthdayIso) {
  if (!birthdayIso) return null;
  const mmdd = birthdayIso.slice(5);
  for (let i = 0; i < 366; i++) {
    if (isoOffset(i).slice(5) === mmdd) return i;
  }
  return null;
}
function parseDateToIso(text) {
  const m = text.match(/(\d{1,2})/);
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const found = buildDateOptions().find((d) => d.num === day);
  return found ? found.iso : null;
}
function timeToHours(t) { const [h, m] = t.split(':').map(Number); return h + (m || 0) / 60; }
function formatDuration(h) {
  if (!h && h !== 0) return '';
  if (h === 0.5) return '30 min';
  return Number.isInteger(h) ? `${h} h` : `${String(h).replace('.', ',')} h`;
}
function overlaps(aStart, aDur, bStart, bDur) { return aStart < bStart + bDur && bStart < aStart + aDur; }
function slotAvailable(iso, timeStr, durationHours, appointments) {
  const start = timeToHours(timeStr);
  if (start + durationHours > CLOSE_HOUR) return false;
  return !appointments.some((a) => a.date === iso && overlaps(start, durationHours, timeToHours(a.time), a.duration));
}
function buildTimeOptions() { return ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']; }
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

function useCollection(name, uid) {
  const [items, setItems] = useState(null);
  useEffect(() => {
    if (!db) return;
    // Kým nie je jasné, či je používateľ prihlásený (uid === undefined), nespúšťame
    // poslucháča — inak by dostal "prístup zamietnutý", zomrel by a appka by
    // čakala donekonečna. Po zmene prihlásenia sa poslucháč nadviaže znova.
    if (uid === undefined) return;
    setItems(null);
    const unsub = db.collection(name).onSnapshot((snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (err) => { console.error(name, err); setItems([]); });
    return unsub;
  }, [name, uid]);
  return items;
}

function useOwnClientDoc(uid) {
  const [data, setData] = useState(undefined); // undefined = loading, null = confirmed absent, object = found
  useEffect(() => {
    if (!db || !uid) { setData(uid === null ? null : undefined); return; }
    setData(undefined);
    const unsub = db.collection('clients').doc(uid).onSnapshot((doc) => {
      setData(doc.exists ? { id: doc.id, ...doc.data() } : null);
    }, (err) => { console.error('own client doc', err); setData(null); });
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
  // POZOR na poradie: prihlásenie musí byť známe skôr, než sa nadviažu
  // databázoví poslucháči, inak by ich Firestore hneď odmietol.
  const [authUser, setAuthUser] = useState(undefined); // undefined = not yet known, null = signed out
  useEffect(() => {
    if (!auth) return;
    return auth.onAuthStateChanged((u) => setAuthUser(u));
  }, []);
  // undefined = ešte nevieme, null = odhlásený, string = uid prihláseného
  const authKey = authUser === undefined ? undefined : (authUser ? authUser.uid : null);

  const clientsRaw = useCollection('clients', authKey);
  const requestsRaw = useCollection('requests', authKey);
  const appointmentsRaw = useCollection('appointments', authKey);
  const referralsRaw = useCollection('referrals', authKey);
  const pricingRaw = usePricing();
  const seededRef = useRef(false);
  useEffect(() => {
    if (db && !seededRef.current) {
      seededRef.current = true;
      seedIfEmpty().catch((e) => console.error('seed error', e));
      seedPricingIfMissing().catch((e) => console.error('seed pricing error', e));
    }
  }, []);

  const [isAdmin, setIsAdmin] = useState(null); // null = unknown/checking
  const [isAdminForUid, setIsAdminForUid] = useState(null); // which uid the isAdmin value above was actually resolved for
  const [adminCheckDebug, setAdminCheckDebug] = useState('');
  useEffect(() => {
    if (!db || !authUser) { setIsAdmin(authUser === null ? false : null); setIsAdminForUid(authUser === null ? null : null); return; }
    setIsAdmin(null);
    db.collection('admins').doc(authUser.uid).get()
      .then((doc) => { setIsAdmin(doc.exists); setIsAdminForUid(authUser.uid); setAdminCheckDebug(`ok, exists=${doc.exists}`); })
      .catch((err) => { setIsAdmin(false); setIsAdminForUid(authUser.uid); setAdminCheckDebug(`error: ${err && err.code} ${err && err.message}`); });
  }, [authUser]);
  // Whether isAdmin above genuinely reflects the CURRENTLY signed-in
  // account — false right after a fresh sign-in, until the check for that
  // specific uid finishes, so a leftover value from before is never reused.
  const isAdminFresh = authUser ? isAdminForUid === authUser.uid : true;
  const myClientDoc = useOwnClientDoc(authUser ? authUser.uid : null);
  const healedRef = useRef({});
  useEffect(() => {
    if (!db || !authUser || !isAdminFresh || isAdmin || myClientDoc !== null) return;
    if (healedRef.current[authUser.uid]) return;
    healedRef.current[authUser.uid] = true;
    db.collection('clients').doc(authUser.uid).set({
      name: authUser.email ? authUser.email.split('@')[0] : 'Klientka',
      email: authUser.email || '', phone: '', stamps: 0, visits: 0, lastVisit: '—', notes: '', birthday: '', history: [],
    }).catch((e) => console.error('auto-heal client doc failed', e));
  }, [authUser, isAdmin, isAdminFresh, myClientDoc]);

  const [state, setStateRaw] = useState({
    screen: 'login', clientTab: 'home',
    booking: { step: 0, serviceIdx: null, dateIso: null, time: null, done: false },
    profileView: 'main', expandedCat: 0,
    adminTab: 'overview', selectedClientId: null,
    toast: { visible: false, msg: '' },
    dayBefore: true, hourBefore: true,
    addFormOpen: false, newClientName: '', newClientPhone: '', newClientDateIso: null, newClientTime: '09:00',
    newClientService: '', newClientDuration: 1.5,
    adminSelectedDate: isoOffset(0),
    authMode: 'login', authName: '', authEmail: '', authPassword: '', authError: '', authInfo: '',
    blockFormOpen: false, blockAllDay: true, blockTime: '8:00', blockDuration: 1,
    addItemCatIndex: null, newItemLabel: '', newItemPrice: '', addCatFormOpen: false, newCatName: '', newCatSub: '',
    editItemCatIndex: null, editItemIndex: null, editItemLabel: '', editItemPrice: '',
    requestDurations: {},
    rescheduleApptId: null, rescheduleDateIso: null, rescheduleTime: '',
    clientSearch: '',
    apptFormOpen: false, apptEditingId: null, apptDateIso: null, apptTime: '', apptService: '', apptDuration: 1.5,
    mergeFormOpen: false, mergeSearchQuery: '', mergeSourceId: null,
    chatOpen: false, chatLog: [], chatView: 'menu', chatSvcIdx: null, chatDateIso: null,
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
      set({ authError: `Tento účet nemá administrátorský prístup. (UID: ${authUser.uid}) [${adminCheckDebug}]` });
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
  const notifUserId = (authUser && !isAdmin) ? authUser.uid : null;
  const { notifications: clientNotifs, unreadCount: clientUnreadCount, manager: clientNotifMgr } = typeof useNotifications === 'function'
    ? useNotifications(db, auth, notifUserId)
    : { notifications: [], unreadCount: 0, manager: null };

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
  // For a non-admin client, `clients`/`requests`/`referrals` stay null
  // forever (the security rules correctly deny listing them) — fall back
  // to empty arrays so admin-only computations below never crash for that role.
  const clients = clientsRaw || [];
  const requests = requestsRaw || [];
  const appointments = appointmentsRaw || [];
  const referrals = referralsRaw || [];
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
  const doForgotPassword = async () => {
    set({ authError: '', authInfo: '' });
    if (!s.authEmail.trim()) { set({ authError: 'Najprv zadajte email, potom kliknite na odkaz znova.' }); return; }
    try {
      await auth.sendPasswordResetEmail(s.authEmail.trim());
      set({ authInfo: 'Poslali sme vám email s odkazom na obnovu hesla.' });
    } catch (e) { set({ authError: authErrorSk(e.code) }); }
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
  const startEditName = () => set({ nameEditOpen: true, nameEditValue: loggedInClient ? loggedInClient.name : '' });
  const cancelEditName = () => set({ nameEditOpen: false, nameEditValue: '' });
  const saveEditName = async () => {
    const val = (s.nameEditValue || '').trim();
    if (!val || !loggedInClient) return;
    await db.collection('clients').doc(loggedInClient.id).update({ name: val });
    set({ nameEditOpen: false, nameEditValue: '' });
    showToast('Meno uložené');
  };

  const navBtn = (active) => `all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;padding:6px 10px;color:${active ? 'var(--espresso)' : 'var(--ink-3)'};min-width:44px`;
  const headerMap = {
    home: ['NECHTOVÉ ŠTÚDIO · HANDLOVÁ', 'Dobrý deň'], booking: ['REZERVÁCIA', 'Nový termín'],
    pass: ['VERNOSTNÝ PROGRAM', 'Aura Pass'], pricing: ['KATALÓG SLUŽIEB', 'Cenník'], profile: ['MÔJ ÚČET', 'Profil'],
  };
  const [clientHeaderEyebrow, clientHeaderTitle] = headerMap[s.clientTab];

  const step0 = b.step === 0, step1 = b.step === 1, step2 = b.step === 2;
  const dotStyle = (active, done) => `flex:1;height:4px;border-radius:2px;background:${active || done ? 'var(--espresso)' : 'var(--line)'}`;

  const serviceOptions = SERVICE_OPTIONS.map((sv, i) => ({
    name: sv.name, sub: sv.sub, select: () => setBooking({ serviceIdx: i }),
    style: `all:unset;cursor:pointer;display:block;width:100%;box-sizing:border-box;text-align:left;padding:16px 18px;border-radius:16px;margin-bottom:10px;color:${b.serviceIdx === i ? 'var(--porcelain)' : 'var(--ink)'};background:${b.serviceIdx === i ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${b.serviceIdx === i ? 'var(--espresso)' : 'var(--line)'}`,
  }));
  const dates = buildDateOptions();
  const svcDuration = b.serviceIdx !== null ? SERVICE_OPTIONS[b.serviceIdx].duration : 1;
  const dateOptions = dates.map((d) => {
    const dayFull = buildTimeOptions().every((t) => !slotAvailable(d.iso, t, svcDuration, appointments));
    return {
      iso: d.iso, dow: d.dow, num: d.num, mon: d.mon, full: dayFull, select: () => setBooking({ dateIso: d.iso, time: null }),
      style: `all:unset;cursor:pointer;text-align:center;padding:9px 4px;border-radius:13px;position:relative;color:${b.dateIso === d.iso ? 'var(--porcelain)' : dayFull ? 'var(--ink-3)' : 'var(--ink)'};background:${b.dateIso === d.iso ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${b.dateIso === d.iso ? 'var(--espresso)' : 'var(--line)'};opacity:${dayFull && b.dateIso !== d.iso ? 0.55 : 1}`,
    };
  });

  const bookingMaxIso = dates.length ? dates[dates.length - 1].iso : todayIso;
  const apptsByDateForFull = {};
  appointments.forEach((a) => { (apptsByDateForFull[a.date] = apptsByDateForFull[a.date] || []).push(a); });
  const timeOptionsForFull = buildTimeOptions();
  const isDayFull = (iso) => {
    const dayAppts = apptsByDateForFull[iso] || [];
    return timeOptionsForFull.every((t) => {
      const start = timeToHours(t);
      if (start + svcDuration > CLOSE_HOUR) return true;
      return dayAppts.some((a) => overlaps(start, svcDuration, timeToHours(a.time), a.duration));
    });
  };
  const clientMonthGrid = buildMonthGrid(b.monthOffset || 0, b.dateIso, todayIso,
    (iso, muted) => muted || iso < todayIso || iso > bookingMaxIso,
    (iso) => (iso >= todayIso && iso <= bookingMaxIso) ? (isDayFull(iso) ? 'var(--line-gold)' : 'var(--taupe)') : null);
  const selectedDateFull = b.dateIso ? !!dateOptions.find((d) => d.iso === b.dateIso)?.full : false;
  const nearestAvailableDate = dateOptions.find((d) => !d.full && d.iso !== b.dateIso) || null;
  const timeOptions = buildTimeOptions().map((t) => {
    const taken = b.dateIso === null ? true : !slotAvailable(b.dateIso, t, svcDuration, appointments);
    const selected = b.time === t;
    return {
      label: t, taken, select: () => !taken && setBooking({ time: t }),
      style: `all:unset;cursor:${taken ? 'not-allowed' : 'pointer'};padding:10px 4px;border-radius:10px;text-align:center;font-family:var(--font-sans);font-size:.78rem;color:${taken ? 'var(--ink-3)' : selected ? 'var(--porcelain)' : 'var(--ink-2)'};background:${taken ? 'rgba(62,39,39,.05)' : selected ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${taken ? 'var(--line)' : selected ? 'var(--espresso)' : 'var(--line-gold)'};text-decoration:${taken ? 'line-through' : 'none'}`,
    };
  });
  const booking_selectedService = b.serviceIdx !== null ? SERVICE_OPTIONS[b.serviceIdx].name : '—';
  const booking_durationLabel = formatDuration(svcDuration);
  const booking_selectedDate = b.dateIso ? isoLabel(b.dateIso) : '—';
  const bookingSummary = `${booking_selectedService} · ${booking_selectedDate} · ${b.time || '—'}`;
  const nextDisabled = (step0 && b.serviceIdx === null) || (step1 && (b.dateIso === null || !b.time));
  const nextStep = () => !nextDisabled && setBooking({ step: Math.min(2, b.step + 1) });
  const prevStep = () => setBooking({ step: Math.max(0, b.step - 1) });
  const btnBase = 'all:unset;cursor:pointer;padding:12px 26px;border-radius:999px;font-family:var(--font-sans);font-size:.74rem;letter-spacing:.14em;text-transform:uppercase';
  const prevBtnStyle = `${btnBase};color:${step0 ? 'var(--ink-3)' : 'var(--ink-2)'};border:1px solid var(--line-gold);opacity:${step0 ? 0.4 : 1};visibility:${step0 ? 'hidden' : 'visible'}`;
  const nextBtnStyle = `${btnBase};color:var(--porcelain);background:var(--espresso);opacity:${nextDisabled ? 0.4 : 1}`;
  const submitBooking = async () => {
    if (!loggedInClient || !authUser) return;
    await db.collection('requests').add({
      name: loggedInClient.name, phone: loggedInClient.phone || '', service: booking_selectedService,
      date: b.dateIso, time: b.time, clientUid: authUser.uid, duration: svcDuration,
    });
    setBooking({ done: true });
  };
  const resetBooking = () => set({ booking: { step: 0, serviceIdx: null, dateIso: null, time: null, done: false } });

  /* ---------- chatbot (recepčná bez AI: vedená konverzácia klikaním) ---------- */
  const chatSay = (from, text) => setStateRaw((prev) => ({ ...prev, chatLog: [...prev.chatLog, { from, text }] }));
  const chatOpen = () => set({ chatOpen: true, chatLog: s.chatLog.length ? s.chatLog : [{ from: 'bot', text: 'Dobrý deň! Som Aura, vaša asistentka. S čím vám môžem pomôcť?' }], chatView: 'menu' });
  const chatClose = () => set({ chatOpen: false });
  const chatReset = () => set({ chatView: 'menu', chatSvcIdx: null, chatDateIso: null });
  // klientka klikne na možnosť → zapíšeme jej "otázku" aj odpoveď, aby to pôsobilo ako rozhovor
  const chatPick = (label, answer, nextView) => {
    setStateRaw((prev) => ({
      ...prev,
      chatLog: [...prev.chatLog, { from: 'me', text: label }, ...(answer ? [{ from: 'bot', text: answer }] : [])],
      chatView: nextView !== undefined ? nextView : prev.chatView,
    }));
  };
  const chatPriceText = pricing.length
    ? pricing.map((c) => `${c.name}: ${c.items.slice(0, 3).map((i) => `${i.label} ${i.price}`).join(', ')}${c.items.length > 3 ? '…' : ''}`).join('\n')
    : 'Cenník sa práve načítava.';
  // ponuka hlavného menu
  const chatMenuOptions = [
    { label: 'Chcem sa objednať', run: () => chatPick('Chcem sa objednať', 'Rada vám pomôžem. Akú službu si želáte?', 'svc') },
    { label: 'Aké máte ceny?', run: () => chatPick('Aké máte ceny?', chatPriceText + '\n\nCelý cenník nájdete v záložke Cenník.') },
    { label: 'Otváracie hodiny', run: () => chatPick('Otváracie hodiny', `Otvorené máme ${OPEN_HOUR}:00 – ${CLOSE_HOUR}:00. Termíny sa dajú rezervovať až 30 dní dopredu.`) },
    { label: 'Kde vás nájdem?', run: () => chatPick('Kde vás nájdem?', 'Nechtové štúdio Aura Nails, Handlová. Presnú adresu a kontakt nájdete na našej stránke auranails.sk.') },
    { label: 'Ako funguje Aura Pass?', run: () => chatPick('Ako funguje Aura Pass?', 'Za každú návštevu vám Michaela pridá pečiatku. Po 5 pečiatkach získate odmenu. Aktuálny stav vidíte v záložke Pass.') },
  ];
  // krok: výber služby
  const chatSvcOptions = SERVICE_OPTIONS.map((sv, i) => ({
    label: sv.name,
    run: () => {
      setStateRaw((prev) => ({
        ...prev, chatSvcIdx: i, chatView: 'date',
        chatLog: [...prev.chatLog, { from: 'me', text: sv.name }, { from: 'bot', text: `${sv.name} (${formatDuration(sv.duration)}). Na ktorý deň?` }],
      }));
    },
  }));
  // krok: výber dňa (najbližších 7 dní, plné dni sa neponúkajú)
  const chatSvcDuration = s.chatSvcIdx !== null ? SERVICE_OPTIONS[s.chatSvcIdx].duration : 1;
  const chatDateOptions = buildDateOptions(7)
    .filter((d) => buildTimeOptions().some((t) => slotAvailable(d.iso, t, chatSvcDuration, appointments)))
    .map((d) => ({
      label: `${d.dow} ${d.num}. ${d.mon}`,
      run: () => {
        setStateRaw((prev) => ({
          ...prev, chatDateIso: d.iso, chatView: 'time',
          chatLog: [...prev.chatLog, { from: 'me', text: `${d.dow} ${d.num}. ${d.mon}` }, { from: 'bot', text: 'Tu sú voľné časy:' }],
        }));
      },
    }));
  // krok: výber času (len skutočne voľné)
  const chatTimeOptions = (s.chatDateIso ? buildTimeOptions().filter((t) => slotAvailable(s.chatDateIso, t, chatSvcDuration, appointments)) : [])
    .map((t) => ({
      label: t,
      run: async () => {
        if (!loggedInClient || !authUser) {
          chatPick(t, 'Aby som mohla rezerváciu odoslať, prihláste sa prosím ako klientka (tlačidlo Späť → Som klientka).', 'menu');
          return;
        }
        await db.collection('requests').add({
          name: loggedInClient.name, phone: loggedInClient.phone || '', service: SERVICE_OPTIONS[s.chatSvcIdx].name,
          date: s.chatDateIso, time: t, clientUid: authUser.uid, duration: chatSvcDuration,
        });
        setStateRaw((prev) => ({
          ...prev, chatView: 'menu', chatSvcIdx: null, chatDateIso: null,
          chatLog: [...prev.chatLog, { from: 'me', text: t }, { from: 'bot', text: `Hotovo! Vaša žiadosť (${isoLabel(s.chatDateIso)} o ${t}) je odoslaná a čaká na potvrdenie od Michaely. Ozveme sa vám čoskoro. Môžem ešte s niečím pomôcť?` }],
        }));
      },
    }));
  const chatCurrentOptions = s.chatView === 'svc' ? chatSvcOptions
    : s.chatView === 'date' ? chatDateOptions
    : s.chatView === 'time' ? chatTimeOptions
    : chatMenuOptions;
  const chatShowBack = s.chatView !== 'menu';

  const clientStamps = loggedInClient ? loggedInClient.stamps : 0;
  const passStampDots = [0, 1, 2, 3, 4].map((i) => {
    const on = i < clientStamps;
    return {
      style: `aspect-ratio:1;border-radius:50%;cursor:default;display:flex;align-items:center;justify-content:center;background:${on ? 'linear-gradient(150deg,var(--taupe-light),var(--espresso))' : 'var(--cream)'};color:${on ? 'var(--porcelain)' : 'var(--ink-3)'};border:${on ? '1px solid var(--espresso)' : '1px solid var(--line)'};box-shadow:${on ? 'var(--shadow-md, 0 10px 34px -16px rgba(56,48,42,.35))' : 'none'};transition:transform .2s ease`,
    };
  });
  const rewardStyle = `aspect-ratio:1;border-radius:50%;cursor:default;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${clientStamps >= 5 ? 'linear-gradient(150deg,var(--taupe-light),var(--mocha))' : 'var(--cream)'};color:${clientStamps >= 5 ? 'var(--porcelain)' : 'var(--ink-3)'};border:2px solid ${clientStamps >= 5 ? 'var(--espresso)' : 'var(--line-gold)'}`;
  const passHelperText = clientStamps >= 5 ? 'Máte 5 pečiatok — pri ďalšej návšteve vám Michaela uplatní odmenu!' : `Za každú návštevu vám Michaela pridá pečiatku. Aktuálne máte ${clientStamps}/5.`;

  const cennikCategories = pricing.map((cat, i) => ({
    name: cat.name, sub: cat.sub, items: cat.items, open: s.expandedCat === i,
    toggle: () => set({ expandedCat: s.expandedCat === i ? null : i }),
    chevStyle: `display:flex;transform:rotate(${s.expandedCat === i ? 90 : 0}deg);transition:transform .3s;color:var(--ink-3)`,
  }));

  const badge = (tone) => `font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;padding:5px 10px;border-radius:999px;background:${tone === 'pending' ? 'rgba(140,110,98,.14)' : tone === 'blocked' ? 'rgba(178,59,59,.12)' : 'rgba(62,39,39,.08)'};color:${tone === 'pending' ? 'var(--mocha)' : tone === 'blocked' ? '#b23b3b' : 'var(--espresso)'}`;
  const myAppointments = loggedInClient ? appointments.filter((a) => a.name === loggedInClient.name) : [];
  const upcomingAppts = myAppointments.filter((a) => a.date >= todayIso).sort((a, bb) => a.date === bb.date ? timeToHours(a.time) - timeToHours(bb.time) : a.date.localeCompare(bb.date))
    .map((a) => ({
      id: a.id, service: a.service, date: isoLabel(a.date), time: a.time, badgeLabel: a.manual ? 'Telefonicky' : 'Potvrdené', badgeStyle: badge(a.manual ? 'pending' : undefined),
      mine: !!(a.clientUid && authUser && a.clientUid === authUser.uid),
    }));
  const rebookService = (serviceName) => {
    const idx = SERVICE_OPTIONS.findIndex((sv) => sv.name === serviceName);
    setBooking({ step: idx !== -1 ? 1 : 0, serviceIdx: idx !== -1 ? idx : null, dateIso: null, time: null, done: false });
    set({ clientTab: 'booking' });
  };
  const rateAppt = (id, rating) => { db.collection('appointments').doc(id).update({ rating }); };
  const historyAppts = myAppointments.filter((a) => a.date < todayIso).sort((a, bb) => bb.date.localeCompare(a.date))
    .map((a) => ({
      id: a.id, service: a.service, date: isoLabel(a.date), time: a.time, rating: a.rating || 0,
      mine: !!(a.clientUid && authUser && a.clientUid === authUser.uid), rebook: () => rebookService(a.service),
    }));
  const cancelMyAppt = (id) => {
    if (!window.confirm('Naozaj zrušiť tento termín?')) return;
    db.collection('appointments').doc(id).delete();
    showToast('Termín zrušený');
  };
  const openReschedule = (a) => set({ rescheduleApptId: a.id, rescheduleDateIso: a.date, rescheduleTime: a.time });
  const cancelReschedule = () => set({ rescheduleApptId: null });
  const rescheduleTarget = appointments.find((a) => a.id === s.rescheduleApptId) || null;
  const rescheduleValidReason = (() => {
    if (!rescheduleTarget || !s.rescheduleDateIso || !s.rescheduleTime) return null;
    const startHours = timeToHours(s.rescheduleTime);
    if (startHours < OPEN_HOUR) return `Štúdio otvára až o ${OPEN_HOUR}:00.`;
    if (startHours + (rescheduleTarget.duration || 1) > CLOSE_HOUR) return `Tento čas presahuje otváracie hodiny (do ${CLOSE_HOUR}:00).`;
    const others = appointments.filter((x) => x.id !== rescheduleTarget.id);
    if (!slotAvailable(s.rescheduleDateIso, s.rescheduleTime, rescheduleTarget.duration || 1, others)) return 'Tento čas je už obsadený, vyberte iný.';
    return null;
  })();
  const saveReschedule = async () => {
    if (!rescheduleTarget || !s.rescheduleDateIso || !s.rescheduleTime || rescheduleValidReason) return;
    await db.collection('appointments').doc(rescheduleTarget.id).update({ date: s.rescheduleDateIso, time: s.rescheduleTime });
    set({ rescheduleApptId: null });
    showToast('Termín zmenený');
  };
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

  const adminTabOverview = s.adminTab === 'overview', adminTabRequests = s.adminTab === 'requests', adminTabClients = s.adminTab === 'clients', adminTabPricing = s.adminTab === 'pricing', adminTabStats = s.adminTab === 'stats';
  const goOverview = () => set({ adminTab: 'overview' });
  const goRequests = () => set({ adminTab: 'requests' });
  const goClients = () => set({ adminTab: 'clients', selectedClientId: null });
  const goPricingAdmin = () => set({ adminTab: 'pricing' });
  const goStats = () => set({ adminTab: 'stats' });
  const hasPending = requests.length > 0 || referrals.some((r) => r.status !== 'done');
  const adminHeaderMap = { overview: 'Prehľad', requests: 'Žiadosti', clients: 'Klientky', pricing: 'Cenník', stats: 'Štatistiky' };

  const statsWeekStart = isoOffset(-(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1));
  const statsMonthPrefix = todayIso.slice(0, 7);
  const nonBlockedAppts = appointments.filter((a) => !a.blocked);
  const statsThisWeek = nonBlockedAppts.filter((a) => a.date >= statsWeekStart).length;
  const statsThisMonth = nonBlockedAppts.filter((a) => a.date.slice(0, 7) === statsMonthPrefix).length;
  const serviceCounts = {};
  nonBlockedAppts.forEach((a) => { serviceCounts[a.service] = (serviceCounts[a.service] || 0) + 1; });
  const topServices = Object.entries(serviceCounts).sort((a, bb) => bb[1] - a[1]).slice(0, 5);
  const totalClientsCount = clients.length;
  const avgVisits = totalClientsCount ? (clients.reduce((sum, c) => sum + (c.visits || 0), 0) / totalClientsCount) : 0;
  const totalUpcoming = nonBlockedAppts.filter((a) => a.date >= todayIso).length;
  const upcomingBirthdays = clients
    .map((c) => ({ ...c, daysUntil: daysUntilBirthday(c.birthday) }))
    .filter((c) => c.daysUntil !== null && c.daysUntil <= 7)
    .sort((a, bb) => a.daysUntil - bb.daysUntil);
  const ratedAppts = nonBlockedAppts.filter((a) => a.rating);
  const avgRating = ratedAppts.length ? (ratedAppts.reduce((sum, a) => sum + a.rating, 0) / ratedAppts.length) : null;
  const exportClientsCsv = () => {
    const header = ['Meno', 'Telefón', 'Email', 'Návštevy', 'Pečiatky', 'Posledná návšteva'];
    const rows = clients.map((c) => [c.name, c.phone || '', c.email || '', c.visits || 0, c.stamps || 0, c.lastVisit || '']);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `aura-nails-klientky-${todayIso}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
  const openEditItem = (catIdx, itemIdx, item) => set({ editItemCatIndex: catIdx, editItemIndex: itemIdx, editItemLabel: item.label, editItemPrice: item.price });
  const cancelEditItem = () => set({ editItemCatIndex: null, editItemIndex: null });
  const saveEditItem = () => {
    if (!s.editItemLabel.trim() || !s.editItemPrice.trim()) return;
    updatePricing(pricing.map((c, ci) => (ci === s.editItemCatIndex ? { ...c, items: c.items.map((it, ii) => (ii === s.editItemIndex ? { label: s.editItemLabel.trim(), price: s.editItemPrice.trim() } : it)) } : c)));
    set({ editItemCatIndex: null, editItemIndex: null });
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
      style: `all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:5px;padding:11px 4px;border-radius:16px;flex-shrink:0;width:48px;background:${selected ? 'var(--espresso)' : 'var(--white)'};color:${selected ? 'var(--porcelain)' : 'var(--ink)'};border:1px solid ${selected ? 'var(--espresso)' : 'var(--line)'};box-shadow:${selected ? 'var(--shadow-md, 0 10px 34px -16px rgba(56,48,42,.35))' : 'none'};transition:transform .2s ease,box-shadow .2s ease`,
      dotStyle: `width:6px;height:6px;border-radius:50%;background:${selected ? 'var(--porcelain)' : occupancyColor(count)}`,
    };
  });

  const adminMonthGrid = buildMonthGrid(s.adminMonthOffset || 0, s.adminSelectedDate, todayIso, null, (iso) => occupancyColor(countsByDate[iso] || 0) !== 'var(--line)' ? occupancyColor(countsByDate[iso] || 0) : null);
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
  // Referral system removed
  const adminTodayCount = countsByDate[todayIso] || 0;
  const adminPendingCount = requests.length;
  const noRequests = requests.length === 0;
  const getRequestDuration = (r) => {
    const stored = s.requestDurations[r.id];
    if (stored === undefined) return r.duration || 1.5;
    const n = parseFloat(stored);
    return isNaN(n) ? (r.duration || 1.5) : n;
  };
  const setRequestDuration = (id, val) => set({ requestDurations: { ...s.requestDurations, [id]: val } });
  const adminRequestsList = requests.map((r) => ({
    ...r, dateLabel: isoLabel(r.date), durationValue: getRequestDuration(r),
    approve: async () => {
      const apptRef = await db.collection('appointments').add({ date: r.date, time: r.time, name: r.name, service: r.service, duration: getRequestDuration(r), manual: false, clientUid: r.clientUid || null });
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
      if (r.clientUid && typeof NotificationManager !== 'undefined') {
        try {
          const notifMgr = new NotificationManager(db, auth, r.clientUid);
          await notifMgr.sendConfirmationNotification({ id: apptRef.id, service: r.service, date: r.date, time: r.time });
        } catch (e) { console.error('notify approve failed', e); }
      }
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
  // Compute lastVisit automatically from history
  const computedLastVisit = selClientHistory.length > 0 ? selClientHistory[0].date : (selClient.lastVisit || '—');
  const selClientStamps = [0, 1, 2, 3, 4].map((i) => ({
    style: `aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${i < selClient.stamps ? 'linear-gradient(150deg,var(--taupe-light),var(--espresso))' : 'var(--cream)'};color:${i < selClient.stamps ? 'var(--porcelain)' : 'var(--ink-3)'};border:1px solid ${i < selClient.stamps ? 'var(--espresso)' : 'var(--line)'}`,
  }));
  const backToClients = () => set({ selectedClientId: null });
  const deleteClient = async () => {
    if (!s.selectedClientId) return;
    if (!window.confirm(`Naozaj zmazať klientku ${selClient.name}? Táto akcia sa nedá vrátiť späť.`)) return;
    // Delete all appointments for this client
    const clientAppts = appointments.filter((a) => a.name === selClient.name);
    const batch = db.batch();
    clientAppts.forEach((a) => batch.delete(db.collection('appointments').doc(a.id)));
    // Delete the client
    batch.delete(db.collection('clients').doc(s.selectedClientId));
    await batch.commit();
    set({ selectedClientId: null });
    showToast('Klientka a jej termíny zmazané');
  };
  const openMergeForm = () => set({ mergeFormOpen: true, mergeSearchQuery: '', mergeSourceId: null });
  const cancelMergeForm = () => set({ mergeFormOpen: false, mergeSourceId: null });
  const mergeSearchLower = s.mergeSearchQuery.trim().toLowerCase();
  const mergeCandidates = clients.filter((c) => c.id !== s.selectedClientId
    && (!mergeSearchLower || c.name.toLowerCase().includes(mergeSearchLower) || (c.phone || '').toLowerCase().includes(mergeSearchLower)));
  const mergeSource = clients.find((c) => c.id === s.mergeSourceId) || null;
  const mergeBlocked = !!(mergeSource && mergeSource.email && !selClient.email);
  const confirmMerge = async () => {
    if (!mergeSource || mergeBlocked) return;
    if (!window.confirm(`Naozaj zlúčiť ${mergeSource.name} do ${selClient.name}? Návštevy, pečiatky a história sa spoja, ${mergeSource.name} bude zmazaná. Táto akcia sa nedá vrátiť späť.`)) return;
    const mergedHistory = [...(selClient.history || []), ...(mergeSource.history || [])];
    const mergedNotes = [selClient.notes, mergeSource.notes].filter(Boolean).join(' | ');
    await db.collection('clients').doc(s.selectedClientId).update({
      visits: (selClient.visits || 0) + (mergeSource.visits || 0),
      stamps: Math.min(5, (selClient.stamps || 0) + (mergeSource.stamps || 0)),
      history: mergedHistory,
      notes: mergedNotes,
      phone: (selClient.phone && selClient.phone !== '—') ? selClient.phone : (mergeSource.phone || '—'),
      birthday: selClient.birthday || mergeSource.birthday || '',
      email: selClient.email || mergeSource.email || '',
    });
    const apptsToMove = appointments.filter((a) => a.name === mergeSource.name);
    await Promise.all(apptsToMove.map((a) => db.collection('appointments').doc(a.id).update({ name: selClient.name })));
    await db.collection('clients').doc(mergeSource.id).delete();
    set({ mergeFormOpen: false, mergeSourceId: null });
    showToast('Klientky zlúčené');
  };
  const updateClientNotes = (e) => { if (s.selectedClientId) db.collection('clients').doc(s.selectedClientId).update({ notes: e.target.value }); };
  const updateClientBirthday = (e) => { if (s.selectedClientId) db.collection('clients').doc(s.selectedClientId).update({ birthday: e.target.value }); };
  const openAddClient = () => set({ addFormOpen: true, newClientName: '', newClientPhone: '', newClientDateIso: null, newClientTime: '09:00', newClientService: '' });
  const cancelAddClient = () => set({ addFormOpen: false });
  const durationPresetOptions = DURATION_PRESETS.map((d) => ({
    label: d.label, select: () => set({ newClientDuration: d.val }),
    style: `all:unset;cursor:pointer;padding:8px 14px;border-radius:999px;font-family:var(--font-sans);font-size:.74rem;color:${s.newClientDuration === d.val ? 'var(--porcelain)' : 'var(--ink-2)'};background:${s.newClientDuration === d.val ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${s.newClientDuration === d.val ? 'var(--espresso)' : 'var(--line-gold)'}`,
  }));
  const saveDisabled = !s.newClientName.trim();
  const saveBtnStyle = `all:unset;cursor:${saveDisabled ? 'not-allowed' : 'pointer'};flex:1;text-align:center;padding:11px;border-radius:999px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;opacity:${saveDisabled ? 0.5 : 1}`;
  const adminDayPickerStyle = (selected) => `all:unset;cursor:pointer;text-align:center;padding:9px 4px;border-radius:12px;color:${selected ? 'var(--porcelain)' : 'var(--ink)'};background:${selected ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${selected ? 'var(--espresso)' : 'var(--line)'}`;
  const newClientDateOptions = calendarDates.map((d) => ({
    dow: d.dow, num: d.num, mon: d.mon, select: () => set({ newClientDateIso: d.iso }),
    style: adminDayPickerStyle(s.newClientDateIso === d.iso),
  }));
  const saveNewClient = async () => {
    if (saveDisabled) return;
    const hasAppt = s.newClientDateIso && s.newClientTime.trim();
    await db.collection('clients').add({
      name: s.newClientName.trim(), phone: s.newClientPhone.trim() || '—', stamps: 0, visits: 0, lastVisit: '—', notes: '', birthday: '', history: [],
    });
    if (hasAppt) {
      const parsedDuration = parseFloat(s.newClientDuration);
      await db.collection('appointments').add({ date: s.newClientDateIso, time: s.newClientTime.trim(), name: s.newClientName.trim(), service: s.newClientService.trim() || 'Bez upresnenia', duration: isNaN(parsedDuration) ? 1.5 : parsedDuration, manual: true });
    }
    set({ addFormOpen: false });
    showToast(hasAppt ? 'Klientka a termín pridané' : 'Klientka pridaná');
  };
  const addStampSel = () => { if (s.selectedClientId) db.collection('clients').doc(s.selectedClientId).update({ stamps: Math.min(5, (selClient.stamps || 0) + 1) }); };
  const removeStampSel = () => { if (s.selectedClientId) db.collection('clients').doc(s.selectedClientId).update({ stamps: Math.max(0, (selClient.stamps || 0) - 1) }); };

  // Appointment management for the client currently open in the detail view.
  // Show only current/future appointment (closest one) and past appointments
  const allClientAppts = appointments.filter((a) => a.name === selClient.name && !a.blocked).sort((a, bb) => a.date === bb.date ? timeToHours(a.time) - timeToHours(bb.time) : a.date.localeCompare(bb.date));
  const currentAppt = allClientAppts.find((a) => a.date >= todayIso);
  const pastAppts = allClientAppts.filter((a) => a.date < todayIso);
  const selClientAppts = [...(currentAppt ? [currentAppt] : []), ...pastAppts];
  const openAddAppt = () => set({ apptFormOpen: true, apptEditingId: null, apptDateIso: calendarDates[0].iso, apptTime: '', apptService: '', apptDuration: 1.5 });
  const openEditAppt = (a) => set({ apptFormOpen: true, apptEditingId: a.id, apptDateIso: a.date, apptTime: a.time, apptService: a.service, apptDuration: a.duration || 1.5 });
  const cancelApptForm = () => set({ apptFormOpen: false, apptEditingId: null });
  const apptDateOptions = calendarDates.map((d) => ({
    dow: d.dow, num: d.num, mon: d.mon, select: () => set({ apptDateIso: d.iso }),
    style: adminDayPickerStyle(s.apptDateIso === d.iso),
  }));
  const apptDurationOptions = DURATION_PRESETS.map((d) => ({
    label: d.label, select: () => set({ apptDuration: d.val }),
    style: `all:unset;cursor:pointer;padding:8px 14px;border-radius:999px;font-family:var(--font-sans);font-size:.74rem;color:${s.apptDuration === d.val ? 'var(--porcelain)' : 'var(--ink-2)'};background:${s.apptDuration === d.val ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${s.apptDuration === d.val ? 'var(--espresso)' : 'var(--line-gold)'}`,
  }));
  const apptSaveDisabled = !s.apptDateIso || !s.apptTime.trim();
  const saveAppt = async () => {
    if (apptSaveDisabled) return;
    const parsedApptDuration = parseFloat(s.apptDuration);
    const payload = { date: s.apptDateIso, time: s.apptTime.trim(), name: selClient.name, service: s.apptService.trim() || 'Bez upresnenia', duration: isNaN(parsedApptDuration) ? 1.5 : parsedApptDuration, manual: true };
    if (s.apptEditingId) await db.collection('appointments').doc(s.apptEditingId).update(payload);
    else await db.collection('appointments').add(payload);
    set({ apptFormOpen: false, apptEditingId: null });
    showToast(s.apptEditingId ? 'Termín upravený' : 'Termín pridaný');
  };
  const cancelAppt = (id) => {
    if (!window.confirm('Naozaj zrušiť tento termín?')) return;
    db.collection('appointments').doc(id).delete();
    showToast('Termín zrušený');
  };

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
          <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.72rem;color:var(--ink-3);text-align:center;margin-top:auto;letter-spacing:.02em')}>Dáta appky sa teraz ukladajú natrvalo. (build 19)</p>
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
            <React.Fragment>
              <input value={s.authName} onChange={(e) => set({ authName: e.target.value })} placeholder="Meno a priezvisko" style={st(inputStyle)} />
            </React.Fragment>
          )}
          <input value={s.authEmail} onChange={(e) => set({ authEmail: e.target.value })} placeholder="Email" type="email" style={st(inputStyle)} />
          <input value={s.authPassword} onChange={(e) => set({ authPassword: e.target.value })} placeholder="Heslo" type="password" style={st(inputStyle)} />
          {s.authError && <p style={{ color: '#b23b3b', fontFamily: 'var(--font-sans)', fontSize: '.8rem', margin: '0 0 12px', lineHeight: 1.5 }}>{s.authError}</p>}
          {s.authInfo && <p style={{ color: 'var(--mocha)', fontFamily: 'var(--font-sans)', fontSize: '.8rem', margin: '0 0 12px', lineHeight: 1.5 }}>{s.authInfo}</p>}
          <button onClick={s.authMode === 'login' ? doClientLogin : doClientRegister} style={st('all:unset;cursor:pointer;display:block;width:100%;box-sizing:border-box;text-align:center;padding:15px;border-radius:999px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.76rem;letter-spacing:.16em;text-transform:uppercase;margin-top:6px;margin-bottom:18px;box-shadow:var(--shadow-md)')}>{s.authMode === 'login' ? 'Prihlásiť sa' : 'Zaregistrovať sa'}</button>
          <button onClick={() => set({ authMode: s.authMode === 'login' ? 'register' : 'login', authError: '', authInfo: '' })} style={st('all:unset;cursor:pointer;text-align:center;font-family:var(--font-sans);font-size:.78rem;color:var(--mocha);margin-bottom:12px')}>{s.authMode === 'login' ? 'Nemáte účet? Zaregistrujte sa' : 'Už máte účet? Prihláste sa'}</button>
          {s.authMode === 'login' && <button onClick={doForgotPassword} style={st('all:unset;cursor:pointer;text-align:center;font-family:var(--font-sans);font-size:.72rem;color:var(--ink-3)')}>Zabudli ste heslo?</button>}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => set({ notifOpen: true })} style={st('all:unset;cursor:pointer;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid var(--line-gold);color:var(--ink-2);position:relative')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 3a5 5 0 00-5 5v3.2c0 .5-.2 1-.5 1.4L5 14.5c-.6.8 0 2 1 2h12c1 0 1.6-1.2 1-2l-1.5-2c-.3-.4-.5-.9-.5-1.4V8a5 5 0 00-5-5z" /><path d="M9.5 19a2.5 2.5 0 005 0" /></svg>
                {clientUnreadCount > 0 && <span style={{ position: 'absolute', top: 3, right: 3, width: 8, height: 8, borderRadius: '50%', background: 'var(--mocha)' }}></span>}
              </button>
              <button onClick={backToLogin} style={st('all:unset;cursor:pointer;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid var(--line-gold);color:var(--ink-2)')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M15 5H8a2 2 0 00-2 2v10a2 2 0 002 2h7M11 8l-4 4 4 4M7 12h13" /></svg>
              </button>
            </div>
          </div>
          {typeof NotificationCenter === 'function' && (
            <NotificationCenter
              isOpen={!!s.notifOpen}
              onClose={() => set({ notifOpen: false })}
              notifications={clientNotifs}
              onMarkRead={(id) => clientNotifMgr && clientNotifMgr.markAsRead(id)}
              onDelete={(id) => clientNotifMgr && clientNotifMgr.deleteNotification(id)}
              onMarkAllRead={() => clientNotifMgr && clientNotifMgr.markAllAsRead()}
            />
          )}

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
                    <div style={st(dotStyle(step2, false))}></div>
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
                      <div style={st('font-family:var(--font-display);font-size:1.3rem;color:var(--ink);margin-bottom:4px')}>2 · Deň a čas</div>
                      <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.82rem;color:var(--ink-3);margin:0 0 14px')}>{booking_selectedService} · trvanie {booking_durationLabel}</p>
                      <div className="cal-month-nav">
                        <button onClick={() => setBooking({ monthOffset: (b.monthOffset || 0) - 1 })}>‹</button>
                        <span>{clientMonthGrid.label}</span>
                        <button onClick={() => setBooking({ monthOffset: (b.monthOffset || 0) + 1 })}>›</button>
                      </div>
                      <div className="cal-dow-row"><span>Po</span><span>Ut</span><span>St</span><span>Št</span><span>Pi</span><span>So</span><span>Ne</span></div>
                      {clientMonthGrid.weeks.map((week, wi) => (
                        <div className="cal-grid" key={wi} style={{ marginBottom: 18 }}>
                          {week.map((cell, ci) => (
                            <button key={ci} className={`cal-day${cell.muted ? ' muted' : ''}${cell.selected ? ' selected' : ''}${cell.today ? ' today' : ''}${cell.disabled ? ' disabled' : ''}`} disabled={cell.disabled} onClick={() => setBooking({ dateIso: cell.iso, time: null })}>
                              <span className="cal-day-circle">{cell.num}</span>
                              {cell.dot && <span className="cal-dot" style={{ background: cell.dot }}></span>}
                            </button>
                          ))}
                        </div>
                      ))}
                      {b.dateIso ? (
                        <React.Fragment>
                          <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.78rem;color:var(--ink-3);margin:0 0 10px')}>{booking_selectedDate} · voľné a obsadené časy (otvorené {OPEN_HOUR}:00–{CLOSE_HOUR}:00)</p>
                          {selectedDateFull && nearestAvailableDate && (
                            <button onClick={nearestAvailableDate.select} style={st('all:unset;cursor:pointer;display:block;width:100%;box-sizing:border-box;text-align:center;padding:11px;border-radius:12px;background:var(--cream);border:1px solid var(--line-gold);color:var(--mocha);font-family:var(--font-sans);font-size:.78rem;margin-bottom:14px')}>Tento deň je plný — skočiť na najbližší voľný deň ({nearestAvailableDate.dow} {nearestAvailableDate.num}. {nearestAvailableDate.mon})</button>
                          )}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7 }}>
                            {timeOptions.map((t, i) => (
                              <button key={i} onClick={t.select} disabled={t.taken} style={st(t.style)}>{t.label}</button>
                            ))}
                          </div>
                        </React.Fragment>
                      ) : (
                        <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.82rem;color:var(--ink-3)')}>Najprv vyberte deň hore, potom sa zobrazia voľné časy.</p>
                      )}
                    </React.Fragment>
                  )}
                  {step2 && (
                    <React.Fragment>
                      <div style={st('font-family:var(--font-display);font-size:1.3rem;color:var(--ink);margin-bottom:16px')}>3 · Zhrnutie</div>
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
                    {!step2 && <button onClick={nextStep} disabled={nextDisabled} style={st(nextBtnStyle)}>Ďalej</button>}
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
                    <div key={i} style={st(p.style)}><Icon name="sparkle" size={20} /></div>
                  ))}
                  <div style={st(rewardStyle)}>
                    <Icon name="gift" size={22} />
                    <span style={{ fontSize: '.5rem', letterSpacing: '.12em', textTransform: 'uppercase', display: 'block', marginTop: 4 }}>Darček</span>
                  </div>
                </div>
                <p style={st('font-family:var(--font-sans);font-weight:300;font-size:.8rem;color:var(--ink-3);text-align:center;margin:18px 0 4px;line-height:1.6')}>{passHelperText}</p>
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
                    <span style={st('width:56px;height:56px;border-radius:50%;background:var(--taupe);color:var(--espresso);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:1.35rem;flex-shrink:0;border:1px solid var(--line-gold)')}>{loggedInClient ? initials(loggedInClient.name) : ''}</span>
                    <div style={{ flex: 1 }}>
                      {s.nameEditOpen ? (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input value={s.nameEditValue} onChange={(e) => set({ nameEditValue: e.target.value })} style={{ all: 'unset', fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--ink)', borderBottom: '1px solid var(--line-gold)', flex: 1, minWidth: 0 }} />
                          <button onClick={saveEditName} style={st('all:unset;cursor:pointer;font-family:var(--font-sans);font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;color:var(--espresso)')}>Uložiť</button>
                          <button onClick={cancelEditName} style={st('all:unset;cursor:pointer;font-family:var(--font-sans);font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3)')}>Zrušiť</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={st('font-family:var(--font-display);font-size:1.2rem;color:var(--ink)')}>{loggedInClient ? loggedInClient.name : '—'}</div>
                          <button onClick={startEditName} style={st('all:unset;cursor:pointer;color:var(--ink-3)')} aria-label="Upraviť meno">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg>
                          </button>
                        </div>
                      )}
                      <div style={{ fontSize: '.78rem', color: 'var(--ink-3)' }}>{loggedInClient ? (loggedInClient.email || loggedInClient.phone) : ''}</div>
                    </div>
                  </div>
                  <div style={st('border-radius:16px;border:1px solid var(--line);background:var(--white);padding:14px 16px;margin-bottom:22px;display:flex;align-items:center;justify-content:space-between;gap:12px')}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.86rem', color: 'var(--ink)' }}>Dátum narodenia</span>
                    <input type="date" value={clientBirthday} onChange={setClientBirthday} style={{ fontFamily: 'var(--font-sans)', fontSize: '.84rem', color: 'var(--ink)', textAlign: 'right', border: '1px solid var(--line-gold)', borderRadius: 8, padding: '6px 10px', background: 'var(--cream)', cursor: 'pointer' }} />
                  </div>
                  <div style={st('display:flex;flex-direction:column;border-radius:18px;border:1px solid var(--line);background:var(--white);margin-bottom:22px;overflow:hidden')}>
                    <button onClick={goReminders} style={st('all:unset;cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:15px 16px')}><span style={{ fontFamily: 'var(--font-sans)', fontSize: '.9rem', color: 'var(--ink)' }}>Pripomienky a upozornenia</span><Icon name="arrow" size={14} /></button>
                  </div>
                  <div style={st('font-family:var(--font-display);font-size:1.1rem;color:var(--ink);margin-bottom:10px')}>Nadchádzajúce</div>
                  {upcomingAppts.length === 0 && <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '.84rem', color: 'var(--ink-3)' }}>Žiadne nadchádzajúce termíny.</p>}
                  {upcomingAppts.map((a, i) => (
                    <React.Fragment key={i}>
                      <div style={st('display:flex;justify-content:space-between;align-items:center;padding:13px 0;border-bottom:1px solid var(--line)')}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '.86rem', color: 'var(--ink)' }}>{a.service}</div>
                          <div style={{ fontSize: '.74rem', color: 'var(--ink-3)', marginTop: 2 }}>{a.date} · {a.time}</div>
                          {a.mine && (
                            <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                              <button onClick={() => openReschedule(a)} style={st('all:unset;cursor:pointer;font-family:var(--font-sans);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--mocha)')}>Zmeniť termín</button>
                              <button onClick={() => cancelMyAppt(a.id)} style={st('all:unset;cursor:pointer;font-family:var(--font-sans);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:#b23b3b')}>Zrušiť</button>
                            </div>
                          )}
                        </div>
                        <span style={st(a.badgeStyle)}>{a.badgeLabel}</span>
                      </div>
                      {s.rescheduleApptId === a.id && (
                        <div style={st('border-radius:18px;padding:16px;background:var(--cream);border:1px solid var(--line-gold);margin:10px 0')}>
                          <div style={st('font-family:var(--font-display);font-size:1rem;color:var(--ink);margin-bottom:12px')}>Zmeniť termín</div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 12 }}>
                            {dates.map((d, di) => (
                              <button key={di} onClick={() => set({ rescheduleDateIso: d.iso })} style={st(`all:unset;cursor:pointer;text-align:center;padding:8px 4px;border-radius:12px;color:${s.rescheduleDateIso === d.iso ? 'var(--porcelain)' : 'var(--ink)'};background:${s.rescheduleDateIso === d.iso ? 'var(--espresso)' : 'var(--white)'};border:1px solid ${s.rescheduleDateIso === d.iso ? 'var(--espresso)' : 'var(--line)'}`)}>
                                <span style={{ display: 'block', fontSize: '.55rem', textTransform: 'uppercase', opacity: .7 }}>{d.dow}</span>
                                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>{d.num}</span>
                              </button>
                            ))}
                          </div>
                          <input type="time" value={s.rescheduleTime} onChange={(e) => set({ rescheduleTime: e.target.value })} style={st('all:unset;display:block;width:100%;box-sizing:border-box;padding:12px 14px;border-radius:12px;border:1px solid var(--line-gold);background:var(--white);font-family:var(--font-sans);font-size:.9rem;color:var(--ink);margin-bottom:8px')} />
                          {rescheduleValidReason && <p style={{ color: '#b23b3b', fontFamily: 'var(--font-sans)', fontSize: '.76rem', margin: '0 0 10px' }}>{rescheduleValidReason}</p>}
                          <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={cancelReschedule} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:10px;border-radius:999px;border:1px solid var(--line-gold);color:var(--ink-2);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase')}>Zrušiť</button>
                            <button onClick={saveReschedule} disabled={!!rescheduleValidReason} style={st(`all:unset;cursor:${rescheduleValidReason ? 'not-allowed' : 'pointer'};flex:1;text-align:center;padding:10px;border-radius:999px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;opacity:${rescheduleValidReason ? 0.5 : 1}`)}>Uložiť</button>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                  <div style={st('font-family:var(--font-display);font-size:1.1rem;color:var(--ink);margin:20px 0 10px')}>História</div>
                  {historyAppts.length === 0 && <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '.84rem', color: 'var(--ink-3)' }}>Zatiaľ žiadna história.</p>}
                  {historyAppts.map((h, i) => (
                    <div key={i} style={st('padding:13px 0;border-bottom:1px solid var(--line)')}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div><div style={{ fontFamily: 'var(--font-sans)', fontSize: '.86rem', color: 'var(--ink)' }}>{h.service}</div><div style={{ fontSize: '.74rem', color: 'var(--ink-3)', marginTop: 2 }}>{h.date} · {h.time}</div></div>
                        <button onClick={h.rebook} style={st('all:unset;cursor:pointer;font-family:var(--font-sans);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--mocha)')}>Rezervovať znova</button>
                      </div>
                      {h.mine && (
                        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button key={n} onClick={() => rateAppt(h.id, n)} style={st('all:unset;cursor:pointer;color:' + (n <= h.rating ? 'var(--mocha)' : 'var(--line-gold)'))} aria-label={`Ohodnotiť ${n} hviezdičkami`}>
                              <Icon name="sparkle" size={15} />
                            </button>
                          ))}
                        </div>
                      )}
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

          <div style={st('display:flex;justify-content:space-around;align-items:center;padding:10px 6px 26px;background:rgba(247,242,239,.92);backdrop-filter:blur(14px);border-top:1px solid var(--line);position:fixed;left:50%;transform:translateX(-50%);bottom:0;width:100%;max-width:480px;box-sizing:border-box;z-index:20')}>
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
                <div style={st('border-radius:18px;padding:18px;background:var(--white);box-shadow:var(--shadow-sm, 0 1px 2px rgba(56,48,42,.05));transition:transform .2s ease,box-shadow .2s ease')}><div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'var(--ink)' }}>{adminTodayCount}</div><div style={{ fontSize: '.7rem', color: 'var(--ink-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginTop: 4 }}>Termínov dnes</div></div>
                <div style={st('border-radius:18px;padding:18px;background:var(--white);box-shadow:var(--shadow-sm, 0 1px 2px rgba(56,48,42,.05));transition:transform .2s ease,box-shadow .2s ease')}><div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'var(--mocha)' }}>{adminPendingCount}</div><div style={{ fontSize: '.7rem', color: 'var(--ink-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginTop: 4 }}>Čakajúce žiadosti</div></div>
              </div>
              {upcomingBirthdays.length > 0 && (
                <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line-gold);margin-bottom:20px')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Icon name="gift" size={16} style={{ color: 'var(--mocha)' }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--ink)' }}>Narodeniny čoskoro</span>
                  </div>
                  {upcomingBirthdays.map((c, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '.82rem' }}>
                      <span style={{ color: 'var(--ink-2)', fontFamily: 'var(--font-sans)' }}>{c.name}</span>
                      <span style={{ color: 'var(--ink-3)' }}>{c.daysUntil === 0 ? 'dnes' : c.daysUntil === 1 ? 'zajtra' : `o ${c.daysUntil} dní`}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={st('font-family:var(--font-display);font-size:1.15rem;color:var(--ink);margin-bottom:10px')}>Kalendár obsadenosti</div>
              <div className="cal-month-nav">
                <button onClick={() => set({ adminMonthOffset: (s.adminMonthOffset || 0) - 1 })}>‹</button>
                <span>{adminMonthGrid.label}</span>
                <button onClick={() => set({ adminMonthOffset: (s.adminMonthOffset || 0) + 1 })}>›</button>
              </div>
              <div className="cal-dow-row"><span>Po</span><span>Ut</span><span>St</span><span>Št</span><span>Pi</span><span>So</span><span>Ne</span></div>
              {adminMonthGrid.weeks.map((week, wi) => (
                <div className="cal-grid" key={wi}>
                  {week.map((cell, ci) => (
                    <button key={ci} className={`cal-day${cell.muted ? ' muted' : ''}${cell.selected ? ' selected' : ''}${cell.today ? ' today' : ''}`} onClick={() => set({ adminSelectedDate: cell.iso })}>
                      <span className="cal-day-circle">{cell.num}</span>
                      {cell.dot && <span className="cal-dot" style={{ background: cell.dot }}></span>}
                    </button>
                  ))}
                </div>
              ))}
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
                <div key={i} style={st('display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;padding:14px 0;border-bottom:1px solid var(--line)')}>
                  <button onClick={ap.open} style={st('all:unset;cursor:pointer;display:flex;align-items:center;gap:14px;flex:1;text-align:left')}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--ink)', width: 48, flexShrink: 0 }}>{ap.time}</div>
                    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontFamily: 'var(--font-sans)', fontSize: '.86rem', color: 'var(--ink)' }}>{ap.name}</div><div style={{ fontSize: '.76rem', color: 'var(--ink-3)', marginTop: 2 }}>{ap.service}</div></div>
                    <span style={st(ap.badgeStyle)}>{ap.badgeLabel}</span>
                  </button>
                  {!ap.blocked && <button onClick={() => cancelAppt(ap.id)} style={st('all:unset;cursor:pointer;font-family:var(--font-sans);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:#b23b3b;flex-shrink:0')}>Zmazať</button>}
                </div>
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
                  <div style={{ fontSize: '.78rem', color: 'var(--ink-3)', marginBottom: 12 }}>{r.dateLabel} · {r.time}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <span style={{ fontSize: '.68rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Trvanie (h)</span>
                    <input type="number" step="0.25" min="0.25" max="8" value={r.durationValue} onChange={(e) => setRequestDuration(r.id, e.target.value)} style={st('all:unset;width:70px;box-sizing:border-box;padding:6px 10px;border-radius:8px;border:1px solid var(--line);background:var(--cream);font-family:var(--font-sans);font-size:.8rem;color:var(--ink)')} />
                  </div>
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
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6, marginBottom: 10 }}>
                        {newClientDateOptions.map((d, i) => (
                          <button key={i} onClick={d.select} style={st(d.style)}>
                            <span style={{ display: 'block', fontSize: '.55rem', textTransform: 'uppercase', opacity: .7 }}>{d.dow}</span>
                            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>{d.num}</span>
                          </button>
                        ))}
                      </div>
                      <input type="time" value={s.newClientTime} onChange={(e) => set({ newClientTime: e.target.value })} style={st('all:unset;display:block;width:100%;box-sizing:border-box;padding:11px 14px;border-radius:12px;border:1px solid var(--line);background:var(--cream);font-family:var(--font-sans);font-size:.86rem;color:var(--ink);margin-bottom:10px')} />
                      <input value={s.newClientService} onChange={(e) => set({ newClientService: e.target.value })} placeholder="Služba (napr. Gélové nechty)" style={st(inputStyle)} />
                      <div style={{ fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 6 }}>Trvanie úkonu (v hodinách)</div>
                      <input type="number" step="0.25" min="0.25" max="8" value={s.newClientDuration} onChange={(e) => set({ newClientDuration: e.target.value })} style={st('all:unset;display:block;width:120px;box-sizing:border-box;padding:9px 12px;border-radius:10px;border:1px solid var(--line);background:var(--cream);font-family:var(--font-sans);font-size:.86rem;color:var(--ink);margin-bottom:14px')} />
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
                    <div style={st('border-radius:14px;padding:14px;background:var(--white);border:1px solid var(--line)')}><div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--ink)' }}>{computedLastVisit}</div><div style={{ fontSize: '.66rem', color: 'var(--ink-3)' }}>Posledná návšteva</div></div>
                  </div>
                  <div style={st('border-radius:14px;padding:14px 16px;background:var(--white);border:1px solid var(--line);margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;gap:12px')}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.84rem', color: 'var(--ink)' }}>Dátum narodenia</span>
                    <input type="date" value={selClient.birthday || ''} onChange={updateClientBirthday} style={{ fontFamily: 'var(--font-sans)', fontSize: '.82rem', color: 'var(--ink)', textAlign: 'right', border: '1px solid var(--line-gold)', borderRadius: 8, padding: '6px 10px', background: 'var(--cream)', cursor: 'pointer' }} />
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={st('font-family:var(--font-display);font-size:1.1rem;color:var(--ink)')}>Termíny</div>
                    {!s.apptFormOpen && <button onClick={openAddAppt} style={st('all:unset;cursor:pointer;font-family:var(--font-sans);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--mocha)')}>+ Pridať termín</button>}
                  </div>
                  {selClientAppts.length === 0 && !s.apptFormOpen && <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '.84rem', color: 'var(--ink-3)', margin: '0 0 14px' }}>Žiadne termíny.</p>}
                  {selClientAppts.map((a, i) => (
                    <div key={i} style={st('display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid var(--line)')}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '.84rem', color: 'var(--ink)' }}>{a.service}</div>
                        <div style={{ fontSize: '.76rem', color: 'var(--ink-3)', marginTop: 2 }}>{isoLabel(a.date)} · {a.time}</div>
                      </div>
                      <button onClick={() => openEditAppt(a)} style={st('all:unset;cursor:pointer;font-family:var(--font-sans);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--mocha)')}>Upraviť</button>
                      <button onClick={() => cancelAppt(a.id)} style={st('all:unset;cursor:pointer;font-family:var(--font-sans);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:#b23b3b')}>Zrušiť</button>
                    </div>
                  ))}
                  {s.apptFormOpen && (
                    <div style={st('border-radius:18px;padding:16px;background:var(--white);border:1px solid var(--line-gold);margin:12px 0')}>
                      <div style={st('font-family:var(--font-display);font-size:1rem;color:var(--ink);margin-bottom:12px')}>{s.apptEditingId ? 'Upraviť termín' : 'Nový termín'}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6, marginBottom: 10 }}>
                        {apptDateOptions.map((d, i) => (
                          <button key={i} onClick={d.select} style={st(d.style)}>
                            <span style={{ display: 'block', fontSize: '.55rem', textTransform: 'uppercase', opacity: .7 }}>{d.dow}</span>
                            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>{d.num}</span>
                          </button>
                        ))}
                      </div>
                      <input type="time" value={s.apptTime} onChange={(e) => set({ apptTime: e.target.value })} style={st(inputStyle)} />
                      <input value={s.apptService} onChange={(e) => set({ apptService: e.target.value })} placeholder="Služba (napr. Gélové nechty)" style={st(inputStyle)} />
                      <div style={{ fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 6 }}>Trvanie úkonu (v hodinách)</div>
                      <input type="number" step="0.25" min="0.25" max="8" value={s.apptDuration} onChange={(e) => set({ apptDuration: e.target.value })} style={st('all:unset;display:block;width:120px;box-sizing:border-box;padding:9px 12px;border-radius:10px;border:1px solid var(--line);background:var(--cream);font-family:var(--font-sans);font-size:.86rem;color:var(--ink);margin-bottom:14px')} />
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={cancelApptForm} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:11px;border-radius:999px;border:1px solid var(--line-gold);color:var(--ink-2);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase')}>Zrušiť</button>
                        <button onClick={saveAppt} disabled={apptSaveDisabled} style={st(`all:unset;cursor:${apptSaveDisabled ? 'not-allowed' : 'pointer'};flex:1;text-align:center;padding:11px;border-radius:999px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;opacity:${apptSaveDisabled ? 0.5 : 1}`)}>Uložiť</button>
                      </div>
                    </div>
                  )}
                  <div style={st('font-family:var(--font-display);font-size:1.1rem;color:var(--ink);margin:20px 0 10px')}>História návštev</div>
                  {selClientHistory.map((h, i) => (
                    <div key={i} style={st('display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--line)')}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.84rem', color: 'var(--ink-2)' }}>{h.service}</span>
                      <span style={{ fontSize: '.76rem', color: 'var(--ink-3)' }}>{h.date}</span>
                    </div>
                  ))}
                  <div style={st('font-family:var(--font-display);font-size:1.1rem;color:var(--ink);margin:20px 0 10px')}>Karta klientky</div>
                  <textarea value={selClient.notes} onChange={updateClientNotes} placeholder="napr. alergie, preferencie, poznámky k nechtom…" style={st('all:unset;display:block;width:100%;min-height:90px;box-sizing:border-box;padding:14px;border-radius:16px;border:1px solid var(--line);background:var(--white);font-family:var(--font-sans);font-weight:300;font-size:.84rem;color:var(--ink);line-height:1.6;margin-bottom:20px;resize:none')}></textarea>
                  {!s.mergeFormOpen && <button onClick={openMergeForm} style={st('all:unset;cursor:pointer;display:block;width:100%;box-sizing:border-box;text-align:center;padding:13px;border-radius:999px;border:1px solid var(--line-gold);color:var(--mocha);font-family:var(--font-sans);font-size:.74rem;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px')}>Zlúčiť s inou klientkou</button>}
                  {s.mergeFormOpen && (
                    <div style={st('border-radius:18px;padding:16px;background:var(--white);border:1px solid var(--line-gold);margin-bottom:10px')}>
                      <div style={st('font-family:var(--font-display);font-size:1rem;color:var(--ink);margin-bottom:4px')}>Zlúčiť duplicitný záznam</div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '.76rem', color: 'var(--ink-3)', margin: '0 0 12px', lineHeight: 1.5 }}>Vyber duplicitnú klientku — jej návštevy, pečiatky a história sa presunú sem a jej záznam sa zmaže.</p>
                      <input value={s.mergeSearchQuery} onChange={(e) => set({ mergeSearchQuery: e.target.value, mergeSourceId: null })} placeholder="Hľadať podľa mena alebo telefónu" style={st(inputStyle)} />
                      <div style={{ maxHeight: 180, overflowY: 'auto', marginBottom: 12 }}>
                        {mergeCandidates.map((c, i) => (
                          <button key={i} onClick={() => set({ mergeSourceId: c.id })} style={st(`all:unset;cursor:pointer;display:flex;justify-content:space-between;width:100%;box-sizing:border-box;padding:10px 12px;border-radius:10px;margin-bottom:4px;background:${s.mergeSourceId === c.id ? 'var(--cream)' : 'transparent'};border:1px solid ${s.mergeSourceId === c.id ? 'var(--line-gold)' : 'transparent'}`)}>
                            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.82rem', color: 'var(--ink)' }}>{c.name}</span>
                            <span style={{ fontSize: '.74rem', color: 'var(--ink-3)' }}>{c.phone}</span>
                          </button>
                        ))}
                        {mergeCandidates.length === 0 && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '.78rem', color: 'var(--ink-3)' }}>Žiadne zhody.</p>}
                      </div>
                      {mergeBlocked && <p style={{ color: '#b23b3b', fontFamily: 'var(--font-sans)', fontSize: '.76rem', margin: '0 0 12px', lineHeight: 1.5 }}>{mergeSource.name} má prihlasovací účet (email) — jej zmazaním by stratila prístup do appky. Otvor namiesto toho detail klientky {mergeSource.name} a zlúč do nej tento záznam.</p>}
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={cancelMergeForm} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:11px;border-radius:999px;border:1px solid var(--line-gold);color:var(--ink-2);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase')}>Zrušiť</button>
                        <button onClick={confirmMerge} disabled={!mergeSource || mergeBlocked} style={st(`all:unset;cursor:${(!mergeSource || mergeBlocked) ? 'not-allowed' : 'pointer'};flex:1;text-align:center;padding:11px;border-radius:999px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;opacity:${(!mergeSource || mergeBlocked) ? 0.5 : 1}`)}>Zlúčiť</button>
                      </div>
                    </div>
                  )}
                  <button onClick={deleteClient} style={st('all:unset;cursor:pointer;display:block;width:100%;box-sizing:border-box;text-align:center;padding:13px;border-radius:999px;border:1px solid rgba(178,59,59,.4);color:#b23b3b;font-family:var(--font-sans);font-size:.74rem;letter-spacing:.1em;text-transform:uppercase')}>Zmazať klientku</button>
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
                    s.editItemCatIndex === ci && s.editItemIndex === ii ? (
                      <div key={ii} style={{ padding: '9px 0', borderTop: '1px solid var(--line)' }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                          <input value={s.editItemLabel} onChange={(e) => set({ editItemLabel: e.target.value })} placeholder="Názov služby" style={st('all:unset;flex:1;box-sizing:border-box;padding:9px 12px;border-radius:10px;border:1px solid var(--line);background:var(--cream);font-family:var(--font-sans);font-size:.8rem;color:var(--ink)')} />
                          <input value={s.editItemPrice} onChange={(e) => set({ editItemPrice: e.target.value })} placeholder="35 €" style={st('all:unset;width:70px;box-sizing:border-box;padding:9px 12px;border-radius:10px;border:1px solid var(--line);background:var(--cream);font-family:var(--font-sans);font-size:.8rem;color:var(--ink)')} />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={cancelEditItem} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:8px;border-radius:999px;border:1px solid var(--line-gold);color:var(--ink-2);font-family:var(--font-sans);font-size:.7rem;letter-spacing:.08em;text-transform:uppercase')}>Zrušiť</button>
                          <button onClick={saveEditItem} style={st('all:unset;cursor:pointer;flex:1;text-align:center;padding:8px;border-radius:999px;background:var(--espresso);color:var(--porcelain);font-family:var(--font-sans);font-size:.7rem;letter-spacing:.08em;text-transform:uppercase')}>Uložiť</button>
                        </div>
                      </div>
                    ) : (
                      <div key={ii} style={st('display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-top:1px solid var(--line)')}>
                        <button onClick={() => openEditItem(ci, ii, it)} style={st('all:unset;cursor:pointer;text-align:left;font-family:var(--font-sans);font-weight:300;font-size:.84rem;color:var(--ink-2)')}>{it.label}</button>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <button onClick={() => openEditItem(ci, ii, it)} style={st('all:unset;cursor:pointer;font-family:var(--font-sans);font-size:.84rem;color:var(--mocha)')}>{it.price}</button>
                          <button onClick={() => deletePricingItem(ci, ii)} style={st('all:unset;cursor:pointer;color:var(--ink-3);font-size:.9rem;line-height:1')}>×</button>
                        </span>
                      </div>
                    )
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

          {adminTabStats && (
            <div style={st('flex:1;padding:4px 20px 100px;overflow:auto')}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line)')}><div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', color: 'var(--ink)' }}>{statsThisWeek}</div><div style={{ fontSize: '.68rem', color: 'var(--ink-3)', letterSpacing: '.06em' }}>Termínov tento týždeň</div></div>
                <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line)')}><div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', color: 'var(--ink)' }}>{statsThisMonth}</div><div style={{ fontSize: '.68rem', color: 'var(--ink-3)', letterSpacing: '.06em' }}>Termínov tento mesiac</div></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
                <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line)')}><div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', color: 'var(--ink)' }}>{totalClientsCount}</div><div style={{ fontSize: '.68rem', color: 'var(--ink-3)', letterSpacing: '.06em' }}>Klientok celkovo</div></div>
                <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line)')}><div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', color: 'var(--ink)' }}>{avgVisits.toFixed(1)}</div><div style={{ fontSize: '.68rem', color: 'var(--ink-3)', letterSpacing: '.06em' }}>Priemer návštev/klientka</div></div>
              </div>
              <div style={st('font-family:var(--font-display);font-size:1.15rem;color:var(--ink);margin-bottom:10px')}>Najobľúbenejšie služby</div>
              {topServices.length === 0 && <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, fontSize: '.84rem', color: 'var(--ink-3)' }}>Zatiaľ žiadne dáta.</p>}
              {topServices.map(([name, count], i) => (
                <div key={i} style={st('display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid var(--line)')}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.86rem', color: 'var(--ink-2)' }}>{name}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--mocha)' }}>{count}×</span>
                </div>
              ))}
              <div style={st('font-family:var(--font-display);font-size:1.15rem;color:var(--ink);margin:22px 0 10px')}>Ostatné</div>
              <div style={st('display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--line)')}><span style={{ fontFamily: 'var(--font-sans)', fontSize: '.86rem', color: 'var(--ink-2)' }}>Nadchádzajúce termíny spolu</span><span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--ink)' }}>{totalUpcoming}</span></div>
              <div style={st('display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--line)')}><span style={{ fontFamily: 'var(--font-sans)', fontSize: '.86rem', color: 'var(--ink-2)' }}>Čakajúce žiadosti</span><span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--ink)' }}>{requests.length}</span></div>
              <div style={st('display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--line)')}><span style={{ fontFamily: 'var(--font-sans)', fontSize: '.86rem', color: 'var(--ink-2)' }}>Priemerné hodnotenie návštev</span><span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--ink)' }}>{avgRating ? `${avgRating.toFixed(1)} / 5 (${ratedAppts.length})` : '—'}</span></div>
              <button onClick={exportClientsCsv} style={st('all:unset;cursor:pointer;display:block;width:100%;box-sizing:border-box;text-align:center;padding:13px;border-radius:999px;border:1px solid var(--line-gold);color:var(--mocha);font-family:var(--font-sans);font-size:.74rem;letter-spacing:.1em;text-transform:uppercase;margin-top:22px')}>Stiahnuť zálohu klientok (CSV)</button>
            </div>
          )}

          <div style={st('display:flex;justify-content:space-around;align-items:center;padding:10px 6px 26px;background:rgba(247,242,239,.92);backdrop-filter:blur(14px);border-top:1px solid var(--line);position:fixed;left:50%;transform:translateX(-50%);bottom:0;width:100%;max-width:480px;box-sizing:border-box;z-index:20')}>
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
            <button onClick={goStats} style={st(navBtn(adminTabStats))}>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 19V10M12 19V5M19 19v-7" /></svg>
              <span style={{ fontSize: '.56rem', letterSpacing: '.04em', marginTop: 3 }}>Štatistiky</span>
            </button>
          </div>
        </div>
      )}

      {s.toast.visible && (
        <div style={st('position:absolute;left:50%;bottom:90px;transform:translateX(-50%);background:var(--espresso);color:var(--porcelain);padding:10px 18px;border-radius:999px;font-family:var(--font-sans);font-size:.76rem;letter-spacing:.04em;white-space:nowrap;box-shadow:var(--shadow-lg);z-index:50')}>{s.toast.msg}</div>
      )}

      {/* Chatbot — len pre klientky (nie v admin rozhraní) */}
      {s.screen === 'client' && !s.chatOpen && (
        <button onClick={chatOpen} aria-label="Otvoriť chat" style={st('all:unset;cursor:pointer;position:absolute;right:18px;bottom:88px;width:52px;height:52px;border-radius:50%;background:var(--espresso);color:var(--porcelain);display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-lg);z-index:60')}>
          <Icon name="sparkle" size={22} />
        </button>
      )}
      {s.screen === 'client' && s.chatOpen && (
        <div style={st('position:absolute;left:12px;right:12px;bottom:80px;max-height:70%;display:flex;flex-direction:column;background:var(--porcelain);border:1px solid var(--line-gold);border-radius:20px;overflow:hidden;box-shadow:var(--shadow-lg);z-index:60')}>
          <div style={st('display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:var(--espresso);color:var(--porcelain)')}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Aura — asistentka</span>
            <button onClick={chatClose} aria-label="Zavrieť chat" style={st('all:unset;cursor:pointer;font-size:1.1rem;line-height:1;opacity:.85')}>×</button>
          </div>
          <div style={st('flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px')}>
            {s.chatLog.map((m, i) => (
              <div key={i} style={st(`max-width:85%;padding:9px 13px;border-radius:14px;font-family:var(--font-sans);font-size:.82rem;line-height:1.5;white-space:pre-line;${m.from === 'me' ? 'align-self:flex-end;background:var(--espresso);color:var(--porcelain)' : 'align-self:flex-start;background:var(--white);color:var(--ink);border:1px solid var(--line)'}`)}>{m.text}</div>
            ))}
          </div>
          <div style={st('padding:12px 14px;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:7px')}>
            {chatCurrentOptions.length === 0 && (
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.8rem', color: 'var(--ink-3)' }}>Na tento deň, žiaľ, nie sú voľné časy.</span>
            )}
            {chatCurrentOptions.map((o, i) => (
              <button key={i} onClick={o.run} style={st('all:unset;cursor:pointer;padding:8px 14px;border-radius:999px;background:var(--white);border:1px solid var(--line-gold);color:var(--ink-2);font-family:var(--font-sans);font-size:.78rem')}>{o.label}</button>
            ))}
            {chatShowBack && (
              <button onClick={chatReset} style={st('all:unset;cursor:pointer;padding:8px 14px;border-radius:999px;color:var(--ink-3);font-family:var(--font-sans);font-size:.78rem')}>← Späť na začiatok</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('App crashed:', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#F7F2EF', color: '#3E2727', fontFamily: 'sans-serif', padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: '1.1rem' }}>Niečo sa pokazilo.</div>
          <div style={{ fontSize: '.8rem', color: '#9D8B84', maxWidth: 320 }}>Skúste appku znova načítať. Ak problém pretrváva, dajte nám vedieť.</div>
          <button onClick={() => window.location.reload()} style={{ all: 'unset', cursor: 'pointer', padding: '12px 28px', borderRadius: 999, background: '#3E2727', color: '#F7F2EF', fontSize: '.8rem', letterSpacing: '.08em', textTransform: 'uppercase' }}>Načítať znova</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppErrorBoundary><App /></AppErrorBoundary>);

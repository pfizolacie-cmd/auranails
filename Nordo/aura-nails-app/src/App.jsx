import React from 'react';
import { PhoneFrame } from './components/navigation/PhoneFrame.jsx';
import { TabBar } from './components/navigation/TabBar.jsx';
import { SegmentedControl } from './components/core/SegmentedControl.jsx';
import { SalonProvider } from './state/SalonContext.jsx';
import { SALON } from './data/salon.js';
import { BookingScreen } from './screens/BookingScreen.jsx';
import { MyBookingsScreen } from './screens/MyBookingsScreen.jsx';
import { PriceListScreen } from './screens/PriceListScreen.jsx';
import { DayScreen } from './screens/DayScreen.jsx';
import { ClientsScreen } from './screens/ClientsScreen.jsx';

/* Appka má dve strany tej istej prevádzky: zákaznícku a prevádzkovú.
 * V ostrej verzii ich oddelí prihlásenie — tu sa prepínajú ručne, aby si
 * klientka aj Michaela vedeli pozrieť obe. */
const ROLES = {
  zakaznicka: {
    label: 'Zákazníčka',
    backdrop: '/assets/backdrop-room-warm.jpg',
    tabs: [
      { value: 'rezervacia', icon: 'calendar-check', label: 'Rezervácia', Screen: BookingScreen },
      { value: 'terminy', icon: 'clock', label: 'Moje termíny', Screen: MyBookingsScreen },
      { value: 'cennik', icon: 'layout-grid', label: 'Cenník', Screen: PriceListScreen },
    ],
  },
  studio: {
    label: 'Štúdio',
    backdrop: '/assets/backdrop-glow-amber.jpg',
    tabs: [
      { value: 'den', icon: 'calendar', label: 'Deň', Screen: DayScreen },
      { value: 'klientky', icon: 'users', label: 'Klientky', Screen: ClientsScreen },
    ],
  },
};

const NARROW_MQ = '(max-width: 560px)';
const PHONE_MAX_H = 760;
const PHONE_MIN_H = 480;
// Názov prevádzky, prepínač rolí, medzery a okraje nad a pod rámom — namerané.
const CHROME_H = 190;

/** Na telefóne sa appka kreslí na celú plochu, na väčšom displeji do rámu telefónu,
 *  ktorý sa zmestí aj na nižší notebookový displej. */
function useViewport() {
  const read = () => ({
    narrow: window.matchMedia(NARROW_MQ).matches,
    phoneHeight: Math.max(PHONE_MIN_H, Math.min(PHONE_MAX_H, window.innerHeight - CHROME_H)),
  });

  const [state, setState] = React.useState(read);

  React.useEffect(() => {
    const sync = () => setState((prev) => {
      const next = read();
      // Bez tejto rovnosti by každý tik ResizeObserveru spustil nový render.
      return prev.narrow === next.narrow && prev.phoneHeight === next.phoneHeight ? prev : next;
    });

    // Rozmer sa môže ustáliť až po prvom renderi a nie vždy pritom vznikne
    // `resize` na okne (napríklad v náhľadovom paneli alebo v iframe).
    // ResizeObserver zachytí zmenu layoutu spoľahlivo, zvyšné dva sú poistka.
    const ro = new ResizeObserver(sync);
    ro.observe(document.documentElement);

    const mq = window.matchMedia(NARROW_MQ);
    mq.addEventListener('change', sync);
    window.addEventListener('resize', sync);

    sync();

    return () => {
      ro.disconnect();
      mq.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  return state;
}

function Shell() {
  const [role, setRole] = React.useState('zakaznicka');
  const [tab, setTab] = React.useState('rezervacia');
  const { narrow, phoneHeight } = useViewport();

  const current = ROLES[role];
  const active = current.tabs.find((t) => t.value === tab) || current.tabs[0];
  const Screen = active.Screen;

  const switchRole = (next) => {
    setRole(next);
    setTab(ROLES[next].tabs[0].value);
  };

  const roleSwitch = (
    <SegmentedControl
      options={Object.entries(ROLES).map(([value, r]) => ({ value, label: r.label }))}
      value={role}
      onChange={switchRole}
    />
  );

  const app = (
    <>
      <Screen />
      <div style={{ padding: '0 var(--gutter-screen)', paddingBottom: 'var(--gutter-screen)' }}>
        <TabBar items={current.tabs} value={active.value} onChange={setTab} />
      </div>
    </>
  );

  if (narrow) {
    return (
      <div style={{ position: 'relative', height: '100%', isolation: 'isolate' }}>
        <img
          src={current.backdrop}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,7,.34)' }} />
        <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Bez tohto by sa Michaela na telefóne do štúdiovej časti nedostala —
              na širokom displeji je prepínač nad rámom telefónu. */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-4) 0 0' }}>
            {roleSwitch}
          </div>
          {app}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 'var(--space-6)', padding: 'var(--space-8) var(--space-6)',
      background: `url('/assets/backdrop-cool-edge.jpg') center/cover fixed, var(--espresso-900)`,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ font: 'var(--text-title)', color: 'var(--text-primary)' }}>{SALON.name}</div>
        <div style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)', marginTop: 2 }}>
          {SALON.street}, {SALON.city} · {SALON.hours}
        </div>
      </div>

      {roleSwitch}

      <PhoneFrame backdrop={current.backdrop} width={375} height={phoneHeight}>
        {app}
      </PhoneFrame>
    </div>
  );
}

export default function App() {
  return (
    <SalonProvider>
      <Shell />
    </SalonProvider>
  );
}
